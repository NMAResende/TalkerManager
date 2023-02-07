const express = require('express');

const { talkerPathRead, talkerPathWrite } = require('./utils/fsUtils');
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
    const talker = await talkerPathRead();
    const newTalker = {
      id: talker.length + 1,
      ...req.body,
    };
    const allTalker = [...talker, newTalker];
    await talkerPathWrite(allTalker);
    res.status(201).json(newTalker);
});

app.put('/talker/:id', 
auth, 
validateName,
validateAge,
validateTalk,
validateWatchedAt, 
validateRate,
async (req, res) => {
  try {
    const { id } = req.params;
    const talker = await talkerPathRead();
    const index = talker.findIndex((element) => element.id === Number(id));
    talker[index] = { id: Number(id), ...req.body };
    await talkerPathWrite(talker);
    const findTalker = talker.find((element) => element.id === Number(id)); 
    res.status(200).json(findTalker);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
  });

  app.delete('/talker/:id', auth, async (req, res) => {
    try {
      const { id } = req.params;
      const talker = await talkerPathRead();
      const filterTalker = talker.filter((el) => el.id === Number(id));
      await talkerPathWrite({ filterTalker });
      res.status(204).end();
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

module.exports = app;
