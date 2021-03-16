const movieModel = require("./movie.model");
const movieView = require("./movie.view");
function listAction(request, response) {
  movieModel
    .getAllDatabase()
    .then((result) => response.send(movieView.renderList(result, request.user)))
    .catch((error) => response.send(movieView.renderError(error)));
  //response.send(movieView.renderList(movieModel.getAllDatabase(),request.user));
}
function viewAction(request, response) {
  if (request.params.id) {
    console.log("hier1");
    movieModel
      .getMovieDatabase(request.params.id)
      .then((result) => {
        if (result[0].published == true)
          response.send(movieView.viewMovie(result[0], request.user));
        else {
          response.redirect(request.baseUrl);
        }
      })
      .catch((error) => response.send(movieView.renderError(error)));
  } else {
    console.log("hier3");
    response.redirect(request.baseUrl);
  }
}
function removeAction(request, response) {
  let movie = { id: "-1", title: "", year: "" };
  movieModel
    .getMovieDatabase(request.params.id)
    .then((result) => {
      movie = result[0];
      if (request.user.username == movie.owner)
        movieModel
          .removeMovieDatabase(request.params.id)
          .then(() => response.redirect(request.baseUrl));
      else console.log("nicht authorisiert! Owner ist:" + movie.owner);
    })
    .catch((error) => response.send(movieView.renderError(error)));
}
function editAction(request, response) {
  let movie = { id: "-1", title: "", year: "" };
  if (request.params.id) {
    console.log("hier1");
    movieModel
      .getMovieDatabase(request.params.id)
      .then((result) => {
        //result ist in einem Array in einem RowDataPacket
        console.log(result[0]);
        response.send(movieView.renderMovie(result[0], request.user));
      })
      .catch((error) => response.send(movieView.renderError(error)));
  } else {
    console.log("hier2");
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
module.exports = {
  listAction,
  removeAction,
  editAction,
  saveAction,
  viewAction,
};
