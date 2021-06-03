const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Wall = require('./../../models/wallModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const walls = JSON.parse(
  fs.readFileSync(`${__dirname}/walls-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Wall.create(walls);
  } catch (e) {
    console.log(e);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Wall.deleteMany();
  } catch (e) {
    console.log(e);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
  console.log('Data import successful');
} else if (process.argv[2] === '--delete') {
  deleteData();
  console.log('Data delete successful');
}
