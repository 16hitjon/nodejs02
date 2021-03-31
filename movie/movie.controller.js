const movieModel = require("./movie.model");
const movieView = require("./movie.view");
function listAction(request, response) {
  movieModel
    .getAllDatabaseAsync()
    .then((result) => {
      movieModel
        .getMovieCount()
        .then((result2) =>
          response.send(movieView.renderList(result, request.user, result2))
        );
    })
    .catch((error) => response.send(movieView.renderError(error)));
}
function viewAction(request, response) {
  if (request.params.id) {
    movieModel
      .getMovieDatabase(request.params.id)
      .then((result) => {
        if (result.published == true)
          response.send(movieView.viewMovie(result, request.user));
        else {
          response.redirect(request.baseUrl);
        }
      })
      .catch((error) => response.send(movieView.renderError(error)));
  } else {
    response.redirect(request.baseUrl);
  }
}
function removeAction(request, response) {
  let movie = { id: "-1", title: "", year: "" };
  movieModel
    .getMovieDatabase(request.params.id)
    .then((result) => {
      movie = result;
      if (request.user.username == movie.owner)
        movieModel
          .removeMovieDatabase(request.params.id)
          .then(() => response.redirect(request.baseUrl));
      else
        response.send(
          movieView.renderError("nicht authorisiert! Owner ist:" + movie.owner)
        );
    })
    .catch((error) => response.send(movieView.renderError(error)));
}
function editAction(request, response) {
  let movie = { id: "-1", title: "", year: "" };
  if (request.params.id) {
    movieModel
      .getMovieDatabase(request.params.id)
      .then((result) => {
        response.send(movieView.renderMovie(result, request.user));
      })
      .catch((error) => response.send(movieView.renderError(error)));
  } else {
    response.send(movieView.renderMovie(movie, request.user));
  }
}
function saveAction(request, response) {
  if (request.body.title != "" && request.body.year != 0) {
    const movie = {
      id: request.body.id,
      title: request.body.title,
      year: request.body.year,
      published: request.body.published == "on",
      owner: request.body.owner,
    };
    movieModel
      .saveMovieDatabase(movie)
      .then(() => response.redirect(request.baseUrl))
      .catch((error) => response.send(movieView.renderError(error)));
  } else response.redirect(request.baseUrl);
}
function importAction(request, response) {
  var Validator = require("jsonschema").Validator;
  var v = new Validator();

  if (request.user) {
    try {
      const movies = JSON.parse(
        request.files.importfile.data.toString("ascii")
      );
      movieModel
        .saveMoviesDatabase(movies, request.user.id)
        .then((result) => response.send(movieView.renderImport(result)))
        .catch((error) => response.send(movieView.renderError(result)));
    } catch (error) {
      //Error nur vom JSON.parse(), also weiß man dass es ein fehlerhaftes JSON-Format ist
      response.send(movieView.renderImport("Falsches JSON-Format"));
    }
  } else response.send(movieView.renderImport("Sie sind nicht angemeldet"));
}

module.exports = {
  listAction,
  removeAction,
  editAction,
  saveAction,
  viewAction,
  importAction,
};
