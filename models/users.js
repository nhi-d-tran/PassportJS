const bcrypt = require('bcrypt');
const saltRounds = 15;

module.exports = (sequelize, DataTypes) => {
  // define() takes a table name and a set of columns
  const Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    hashed_password: DataTypes.STRING
  });

  // Runs every time before a new user is created to hash the password
  // Also it's being created async
  // It should check for existing user before creating.
  Users.beforeCreate(user =>
    new sequelize.Promise(resolve => {
      bcrypt.hash(user.hashed_password, saltRounds)
        .then(hashedPassword => {
          resolve(hashedPassword);
        });
    })
    .then(hashedPassword => {
      user.hashed_password = hashedPassword;
    })
  );  

  return Users;
}