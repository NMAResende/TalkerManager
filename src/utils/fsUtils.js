const fs = require('fs/promises');
const path = require('path');

const talkerPathRead = async () => {
  try {
    const readFile = await fs.readFile(path.resolve(__dirname, '../talker.json'), 'utf8');
    return JSON.parse(readFile);
  } catch (err) {
    console.log(err.message);
  }
};

const talkerPathWrite = async (file) => {
  try {
    const write = await fs
    .writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(file));
    return write;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  talkerPathRead,
  talkerPathWrite,
};