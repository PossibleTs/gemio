require('dotenv').config();

module.exports = {
  local: {
    dialect: process.env.DB_LOCAL_DIALECT,
    host: process.env.DB_LOCAL_HOST,
    port: process.env.DB_LOCAL_PORT,
    username: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
    database: process.env.DB_LOCAL_NAME,
  },
  develop: {
    dialect: process.env.DB_DEVELOP_DIALECT,
    host: process.env.DB_DEVELOP_HOST,
    port: process.env.DB_DEVELOP_PORT,
    username: process.env.DB_DEVELOP_USER,
    password: process.env.DB_DEVELOP_PASSWORD,
    database: process.env.DB_DEVELOP_NAME,
  },
  stage: {
    dialect: process.env.DB_STAGE_DIALECT,
    host: process.env.DB_STAGE_HOST,
    port: process.env.DB_STAGE_PORT,
    username: process.env.DB_STAGE_USER,
    password: process.env.DB_STAGE_PASSWORD,
    database: process.env.DB_STAGE_NAME,
  },
  main: {
    dialect: process.env.DB_MAIN_DIALECT,
    host: process.env.DB_MAIN_HOST,
    port: process.env.DB_MAIN_PORT,
    username: process.env.DB_MAIN_USER,
    password: process.env.DB_MAIN_PASSWORD,
    database: process.env.DB_MAIN_NAME,
  },
};
