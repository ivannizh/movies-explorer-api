const routerMovie = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { movieIdInParamsData, createMovieData } = require('../middlewares/validatons');

routerMovie.get('/api/movies/', getMovies);
routerMovie.post('/api/movies/', createMovieData, createMovie);
routerMovie.delete('/api/movies/:movieId', movieIdInParamsData, deleteMovie);

module.exports = routerMovie;
