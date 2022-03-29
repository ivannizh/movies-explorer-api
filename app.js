const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
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
const { router } = require('./routes');
const { limiter } = require('./middlewares/rate-limit');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
}, () => {});

const app = express();

const corsOptions = {
  origin: ['https://ivannizh.nomoredomains.work', 'http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.post('/api/signin', loginData, login);
app.post('/api/signup', createUserData, createUser);

app.use(auth);

app.use('/api', router);

app.use((req, res, next) => {
  next(new NotFoundError('Not found'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
