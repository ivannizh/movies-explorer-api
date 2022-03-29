const Movie = require('../models/movies');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

function getMovies(req, res, next) {
  Movie.find({}).then(
    (movies) => {
      res.send({ data: movies });
    },
  ).catch((err) => {
    next(err);
  });
}

function createMovie(req, res, next) {
  const {
    country, director, duration, year, description,
    image, trailer: trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  }).then((card) => {
    res.send(card);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Некорректные данные ${err}`));
    } else {
      next(err);
    }
  });
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params.movieId).then((movie) => {
    if (movie) {
      if (movie.owner.equals(req.user._id)) {
        Movie.findByIdAndDelete(req.params.movieId).then(() => {
          res.status(200).send({ message: 'deleted' });
          return Promise.resolve();
        }).catch((err) => {
          next(err);
        });
      } else {
        next(new ForbiddenError('User is not owner'));
      }
    } else {
      next(new NotFoundError('Card not found'));
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(err);
    }
  });
}

module.exports = { createMovie, deleteMovie, getMovies };
