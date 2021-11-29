import dotenv from 'dotenv';
dotenv.config();
export const config = {
  development: {
    username: "root",
    password: process.env.DB_TEST_PW,
    database: process.env.DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.RDS_PASSWORD,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_END_POINT,
    dialect: "mysql",
  },
  rds: {
    username: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_END_POINT,
    dialect: "mysql",
  },
};
