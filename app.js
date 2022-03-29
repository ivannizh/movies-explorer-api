const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const routerMovie = require('./routes/movies');
const routerUser = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const {
  createUserData,
  loginData,
} = require('./middlewares/validatons');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}, () => {});

const app = express();

const corsOptions = {
  origin: ['https://ivannizh.nomoredomains.work', 'http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.post('/signin', loginData, login);
app.post('/signup', createUserData, createUser);

app.use(auth);

app.use('/users', routerUser);
app.use('/movies', routerMovie);

app.use((req, res, next) => {
  next(new NotFoundError('Not found'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
