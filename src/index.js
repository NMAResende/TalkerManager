const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
app.use(express.json());

const talkerPath = async () => {
  const readFile = await fs.readFile(path.resolve(__dirname, 'talker.json'), 'utf8');
  return JSON.parse(readFile);
};

const HTTP_OK_STATUS = 200;
const HTTP_ERROR_STATUS = 500;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  try {
    const talker = await talkerPath();
    res.status(HTTP_OK_STATUS).json(talker);

    if (!talker) {
      return res.status(HTTP_OK_STATUS).json([]);
    }
  } catch (err) {
    res.status(HTTP_ERROR_STATUS).json({ message: err.message });
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talker = await talkerPath();
    const talkerId = talker.find((e) => e.id === Number(id));

    if (!talkerId) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    res.status(HTTP_OK_STATUS).json(talkerId);
  } catch (err) {
    res.status(HTTP_ERROR_STATUS).json({ message: err.message });
  }
});

module.exports = app;
