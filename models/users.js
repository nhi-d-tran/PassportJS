const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  // define() takes a table name and a set of columns
  const Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING
  });

  // Runs every time before a new user is created to hash the password
  Users.beforeCreate(user =>
    new sequelize.Promise(resolve => {
      bcrypt.hash(user.password_hash, null, null, (err, hashedPassword) => {
        resolve(hashedPassword);
      });
    })
    .then(hashedPw => {
      user.password_hash = hashedPw;
    })
  );  

  return Users;
}