const db = require("../db.js"); // importing the db config

const addMessage = (message) => {
  return createMessagePromise(message)
    .then((message) => (message ? message : "Error añadiendo nuevo mensaje"))
    .catch((err) => "Error creando mensaje");
};

const createMessagePromise = (message) => {
  return db
    .raw(
      "INSERT INTO messages (text, date, usr) VALUES (?, ?, ? ) RETURNING id, text, date, usr",
      [message.text, message.date, message.usr]
    )
    .then(
      (data) => data.rows[0],
      (err) => console.log(err)
    );
};

const getMessages = () => {
  return getMessagesPromise()
    .then((messages) => (messages ? messages : "Error obteniendo mensajes"))
    .catch((err) => "Error obteniendo mensajes");
};

const getMessagesPromise = () => {
  return db.raw("SELECT * FROM messages").then(
    (data) => data.rows,
    (err) => console.log(err)
  );
};

module.exports = {
  addMessage,
  getMessages,
};
