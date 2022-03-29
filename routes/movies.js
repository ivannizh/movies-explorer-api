const routerMovie = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { movieIdInParamsData, createMovieData } = require('../middlewares/validatons');

routerMovie.get('', getMovies);
routerMovie.post('', createMovieData, createMovie);
routerMovie.delete('/:movieId', movieIdInParamsData, deleteMovie);

module.exports = routerMovie;
