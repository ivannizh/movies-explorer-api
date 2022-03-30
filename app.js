const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const {
  createUserData,
  loginData,
} = require('./middlewares/validatons');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();
const { routes } = require('./routes/index');
const NotFoundError = require('./errors/not-found-error');
const { limiter } = require('./middlewares/rate-limit');
const { signIn } = require('./controllers/signIn');
const { signUp } = require('./controllers/signUp');

const { PORT = 3000 } = process.env;

const { NODE_ENV, DB_URL } = process.env;
mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
}, () => {});

const app = express();

const corsOptions = {
  origin: ['https://ivannizh.nomoredomains.work', 'http://localhost:3000'],
  credentials: true,
};

app.use(requestLogger);
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());

app.use(express.json());

app.post('/api/signin', loginData, signIn);
app.post('/api/signup', createUserData, signUp);

app.use(auth);

app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError('Not found'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
