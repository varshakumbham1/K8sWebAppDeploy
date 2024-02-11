const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

const UserModel = require('../models/User');
const AssignmentModel = require('../models/Assignment');
const SubmissionModel = require('../models/Submission');

require('dotenv').config();

const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;

const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 5000; // 5 seconds

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect,
});

const User = UserModel(sequelize);
const Assignment = AssignmentModel(sequelize);
const Submission = SubmissionModel(sequelize);

const retryConnection = async () => {
  let retries = 0;
  let connection;

  while (retries < MAX_RETRIES) {
    try {
      connection = await mysql.createConnection({
        host: host,
        user: user,
        password: password,
      });

      console.log('Connected to MySQL server!');
      break;
    } catch (error) {
      console.error(`Error connecting to MySQL server: ${error.message}`);
      retries++;
      console.log(`Retrying in ${RETRY_INTERVAL_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
    }
  }

  if (!connection) {
    console.error(`Unable to connect to MySQL server after ${MAX_RETRIES} retries.`);
    process.exit(1);
  }

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();
};

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Models synchronized successfully.');
};

const connectToDatabase = async () => {
  await retryConnection();
  await sequelize.authenticate();
  console.log('Connection to the database has been established successfully.');
};

module.exports = {
  sequelize,
  syncDatabase,
  connectToDatabase,
  User,
  Assignment,
  Submission,
};
