const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const bodyValidation = {
  name: Joi.string().min(2).max(30).messages({
    'string.min': 'Минимальная длина поля "name" - 2',
    'string.max': 'Максимальная длина поля "name" - 30',
  }),
  email: Joi.string().required().custom((value, helpers) => {
    if (validator.isEmail(value)) {
      return value;
    }
    return helpers.message('Невалидный email');
  }),
  password: Joi.string().required().min(6).messages({
    'string.min': 'Минимальная длина поля "password" - 6',
  }),
};

const createUserData = celebrate({
  body: Joi.object().keys({
    name: bodyValidation.name,
    email: bodyValidation.email,
    password: bodyValidation.password,
  }),
});

const loginData = celebrate({
  body: Joi.object().keys({
    email: bodyValidation.email,
    password: bodyValidation.password,
  }),
});

const updateUserData = celebrate({
  body: Joi.object().keys({
    name: bodyValidation.name,
    email: bodyValidation.email,
  }),
});

const createMovieData = celebrate({
  body: Joi.object().keys({

    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdInParamsData = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

module.exports = {
  createUserData,
  loginData,
  updateUserData,
  createMovieData,
  movieIdInParamsData,
};
