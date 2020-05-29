const bcrypt = require("bcryptjs"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const db = require("../db.js"); // importing the db config

const signup = (user) => {
  return hashPassword(user.password)
    .then((hashedPassword) => {
      delete user.password;
      user.password_digested = hashedPassword;
    })
    .then(() => createToken())
    .then((token) => (user.token = token))
    .then(() => createUser(user))
    .then((user) => {
      delete user.password_digested;
      return user;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const signin = (userReq) => {
  let user;
  return findUser(userReq)
    .then((foundUser) => {
      user = foundUser;
      return checkPassword(userReq.password, foundUser);
    })
    .then((res) => createToken())
    .then((token) => updateUserToken(token, user))
    .then(
      () => {
        delete user.password_digested;
        return user;
      },
      (err) => {
        return "No se encontró tu usuario, por favor verifica los campos";
      }
    )
    .catch((err) => {
      console.log(err);
      return "Imposible iniciar sesión, contacta con el administrador";
    });
};

// a random token is created with Crypto
const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString("base64"));
    });
  });
};

// hashing the password with Bcrypt
const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash);
    })
  );
};

const createUser = (user) => {
  console.log("--", user);
  return db
    .raw(
      "INSERT INTO users ( usr, name, password_digested, token, type) VALUES (?, ?, ?, ?, ?) RETURNING  usr, name, type, token",
      [user.usr, user.name, user.password_digested, user.token, user.type]
    )
    .then((data) => data.rows[0]);
};

const checkPassword = (reqPassword, foundUser) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(
      reqPassword,
      foundUser.password_digested,
      (err, response) => {
        if (err) {
          reject(err);
        } else if (response) {
          resolve(response);
        } else {
          reject(new Error("Verifica tu contraseña"));
        }
      }
    )
  );
};

const updateUserToken = (token, user) => {
  return db
    .raw("UPDATE users SET token = ? WHERE usr = ? RETURNING  usr, token", [
      token,
      user.usr,
    ])
    .then((data) => data.rows[0]);
};

const findUser = (userReq) => {
  return db
    .raw("SELECT * FROM users WHERE usr = ?", [userReq.usr])
    .then((data) => data.rows[0]);
};

module.exports = {
  signin,
  signup,
};
