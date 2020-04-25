const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const errorMessage = { "message": "Запрашиваемый ресурс не найден" };
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = { _id: '5ea407a2351c5e259c23a7aa' };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send(errorMessage);
});

app.listen(PORT);
