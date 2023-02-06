const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;

  if (rate <= 0 || rate > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
if (!rate) {
  return res.status(400).json(
    { message: 'O campo "rate" é obrigatório' },
  );
}
if (!Number.isInteger(rate)) {
  return res.status(400).json({
    message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
}

return next();
};
module.exports = validateRate;