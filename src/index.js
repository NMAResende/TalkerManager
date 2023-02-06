const express = require('express');
const fs = require('fs/promises');

const talkerPathRead = require('./utils/fsUtils');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./middleware/validateEmail');
const validatePassword = require('./middleware/validatePassword');
const auth = require('./middleware/auth');
const validateName = require('./middleware/validateName');
const validateAge = require('./middleware/validateAge');
const validateTalk = require('./middleware/validateTalk');
const validateWatchedAt = require('./middleware/validateWatchedAt');
const validateRate = require('./middleware/validadeRate');

const app = express();
app.use(express.json());

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
    const talker = await talkerPathRead();
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
    const talker = await talkerPathRead();
    const talkerId = talker.find((e) => e.id === Number(id));

    if (!talkerId) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    res.status(HTTP_OK_STATUS).json(talkerId);
  } catch (err) {
    res.status(HTTP_ERROR_STATUS).json({ message: err.message });
  }
});

app.post('/login', validateEmail, validatePassword, async (_req, res) => {
  try {
    const token = generateToken();
    return res.status(200).json({ token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }  
});

app.post('/talker', 
auth, 
validateName,
validateAge,
validateTalk,
validateWatchedAt, 
validateRate,
async (req, res) => {
  try {
    const { name, age, talk: watchedAt, rate } = req.body;
    const talker = await talkerPathRead();
    const newTalker = {
      id: talker.lenght + 1,
      name,
      age, 
      talk:
       watchedAt,
       rate,
    };
    const allTalker = [...talker, newTalker];
    await fs.writeFile(talkerPathRead(), JSON.stringify(allTalker));
    res.status(201).json(newTalker);
  } catch (err) {
      res.status(500).send({ message: err.message });
    }
});

module.exports = app;
