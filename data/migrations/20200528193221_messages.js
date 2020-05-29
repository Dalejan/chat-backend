exports.up = function (knex) {
  let createQuery = `CREATE TABLE messages (
              id SERIAL PRIMARY KEY NOT NULL,
              text TEXT NOT NULL,
              date TIMESTAMP NOT NULL,
              usr TEXT REFERENCES users(usr) ON DELETE CASCADE
              )`;

  return knex.raw(createQuery);
};

exports.down = function (knex) {
  let dropQuery = `DROP TABLE users`;
  return knex.raw(dropQuery);
};
