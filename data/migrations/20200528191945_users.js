exports.up = function (knex) {
  let createQuery = `CREATE TABLE users (
              usr TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              type TEXT NOT NULL,
              password_digested TEXT,
              token TEXT NOT NULL
              )`;

  return knex.raw(createQuery);
};

exports.down = function (knex) {
  let dropQuery = `DROP TABLE users`;
  return knex.raw(dropQuery);
};
