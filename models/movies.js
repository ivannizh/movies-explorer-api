const mongoose = require('mongoose');
require('mongoose-type-url');

const movieSchema = new mongoose.Schema({
  country: { // — страна создания фильма. Обязательное поле-строка.
    type: String,
    required: true,
  },
  director: { // — режиссёр фильма. Обязательное поле-строка.
    type: String,
    required: true,
  },
  duration: { // — длительность фильма. Обязательное поле-число.
    type: Number,
    required: true,
  },
  year: { // — год выпуска фильма. Обязательное поле-строка.
    type: String,
    required: true,
  },
  description: { // — описание фильма. Обязательное поле-строка.
    type: String,
    required: true,
  },
  image: { // — ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
    type: String,
    required: true,
  },
  trailerLink: { // — ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  thumbnail: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  owner: { // — _id пользователя, который сохранил фильм. Обязательное поле.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  movieId: { // — id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: { // — название фильма на русском языке. Обязательное поле-строка.
    type: String,
    required: true,
  },
  nameEN: { // — название фильма на английском языке. Обязательное поле-строка.
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
