import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { bold } from 'chalk';

dotenv.config();

const connected = bold.cyan;
const error = bold.yellow;
const disconnected = bold.red;
const termination = bold.magenta;

const { MONGODB_URL, MONGODB_TEST_URL, NODE_ENV } = process.env;

const dbUrl = NODE_ENV === 'test' ? MONGODB_TEST_URL : MONGODB_URL;

connection.on('connected', async () => {
  await console.log(
    connected('Mongoose default connection is open to ', dbUrl),
  );
});

connection.on('error', async err => {
  await console.log(
    error('Mongoose default connection has occured ' + err + ' error'),
  );
});

connection.on('disconnected', async () => {
  await console.log(
    disconnected('Mongoose default connection is disconnected'),
  );
});

process.on('SIGINT', async () => {
  await connection.close(() => {
    console.log(
      termination(
        'Mongoose default connection is disconnected due to application termination',
      ),
    );
    process.exit(0);
  });
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const dbconnect = async () => await connect(dbUrl, options);

export default dbconnect;
