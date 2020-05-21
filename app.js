require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/loggers');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8)
  })
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().min(2).regex(/^https?:\/\/(w{3}\.)?((\w{2,}(-\w+)*(\.[a-zA-Z]{2,})+)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(\/\w+)*#?(:\d{2,5})?$/)
  })
}), createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ "message": "Запрашиваемый ресурс не найден" });
});

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "На сервере что-то пошло не так...";
  if (err.name === 'ValidationError' || err.joi) {
    return res.status(400).send({ "message": `Ошибка валидации: ${err.message}` });
  }
  if (err.code === 11000) {
    return res.status(409).send({ "message": "Данный email уже зарегистрирован" });
  }
  res.status(statusCode).send({ "message": message });
});

app.listen(PORT);
