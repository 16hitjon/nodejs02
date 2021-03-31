const { deserializeUser } = require("passport");

function renderList(movies, user,count) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    <link rel="stylesheet" href="../style.css">
    </head>
    <body>
    <h1>Filmliste</h1>
    ${
      user
        ? `<p class=blackTextBox>Sie sind angemeldet als <span style="font-style: italic;">${user.username}</span>. Ihr Name lautet <span style="font-style: italic;">${user.fullname}</span>.</p>
        <div><a href="/logout">Logout</a> <a style="margin-left: 15px"href="/movie/edit">Neuer Film</a></div>`
        : `<p class=blackTextBox>Melden Sie sich an, um Ihre Filme hinzuzufügen</p><a href="/login">Login</a>`
    }
    <p>Insgesamt sind ${count} Filme in der Datenbank</p>
    <table class="bigTable">
    <tr><th>Titel</th><th>Jahr</th><th>Öffentlich</th><th>Besitzer</th>
    <th></th><th></th></tr>
    ${movies
      .map((movie) =>
        movie.owner == user?.username || movie.published == 1
          ? `<tr class="trBorder">
    <td>${movie.title}</td><td>${movie.year}</td><td>${
              movie.published == 1 ? `Ja` : `Nein`
            }</td><td>${movie.owner}</td>
    ${
      movie.owner == user?.username
        ? `<td><a href="/movie/remove/${movie.id}">Löschen</a>
    </td><td><a href="/movie/edit/${movie.id}">Ändern</a>
    </td>`
        : `<td><a href="/movie/view/${movie.id}">Ansehen</a></td>`
    }
    </tr>`
          : ``
      )
      .join("")}
    </table>
    <form style="margin-top: 20px"action="movie/import" method="post" enctype="multipart/form-data">
      <label for="importfile">Import-Datei:</label>
      <input type="file" id="importfile" name="importfile">
      <input type="submit" value="Importieren">
    </form>
    </body>
    </html>
    `;
}
function renderError(error) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    </head>
    <body>
    <h1>FilmlisteError</h1>
    <p>${error}</p>
    </body>
    </html>
    `;
}
function renderImport(msg) {
  return`
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>Filmliste</title>
  </head>
  <body>
  <h1>Meldung</h1>
  <p>Import meldet:</p>
  <p>${msg}</p>
  <a href="/movie"> Zurück</a>
  </body>
  </html>
  `;
}
function renderMovie(movie, user) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <h1>Filmliste</h1>
    ${
      user
        ? `<p class=blackTextBox>Sie sind angemeldet als <span style="font-style: italic;">${user.username}</span>. Ihr Name lautet <span style="font-style: italic;">${user.fullname}</span>.</p><div><a href="/logout">Logout</a> <a style="margin-left: 15px"href="/movie/edit">Neuer Film</a></div>`
        : `<p class=blackTextBox>Melden Sie sich an, um Ihre Filme hinzuzufügen</p><a href="/login">Login</a>`
    }
    <form action="/movie/save" method="post">
    <input type="hidden" name="id" value="${movie.id}">
    <input type="hidden" name="owner" value="${user.id}" >
    <table class="smallTable">
    <tr>
    <td><label for="title">Titel:</label></td>
    <td ><input style="width:120%" type="text" id="title" name="title"
    value="${movie.title}"></td>
    </tr>
    <tr>
    <td><label for="year"> Jahr:</label></td>
    <td><input <input style="width:30%" type="number" id="year" name="year"
    value="${movie.year}"></td>
    </tr>
    <tr>
    <td><label for="public">Öffentlich:</label></td>
    <td><input  type="checkbox" id="published" name="published"
    ${movie.published == 1 ? `checked` : ``}
    ></td>
    </tr>
    <tr>
    <td><label >Besitzer:</label></td>
    
    <td><input   type="text"
    value="${user.username}" readonly></td>
    </tr>
    <tr>
    <td><input type="submit" value="Speichern"></td>
    <td><a href="/movie"> Zurück</a></td>
    </tr>
    </table>
    </form>
    </body>
    </html>
    `;
}
function viewMovie(movie, user) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>Filmliste</title>
  
  <link rel="stylesheet" href="/style.css">
  
  </head>
  <body>
  <h1>Filmliste</h1>
  ${
    user
      ? `<p class=blackTextBox>Sie sind angemeldet als <span style="font-style: italic;">${user.username}</span>. Ihr Name lautet <span style="font-style: italic;">${user.fullname}</span>.</p><div><a href="/logout">Logout</a> <a style="margin-left: 15px"href="/movie/edit">Neuer Film</a></div>`
      : `<p class=blackTextBox>Melden Sie sich an, um Ihre Filme hinzuzufügen</p><a href="/login">Login</a>`
  }
      <table class="smallTable">
      <tr class="trBorder"><td style="width: 20%" >Titel:</td><td >${movie.title}</td></tr>
      <tr class="trBorder"><td>Jahr:</td><td>${movie.year}</td></tr>
      <tr class="trBorder"><td>Öffentlich:</td><td>${
        movie.published == 1 ? `Ja` : `Nein`
      }</td></tr>
      <tr class="trBorder" ><td>Besitzer:</td><td>${movie.owner}</td></tr>
      </table>
      <a href="/movie">Zurück</a>
      </div>
      </form>
      </body>
      </html>
      `;
}
module.exports = {
  renderList,
  renderMovie,
  viewMovie,
  renderError,
  renderImport
};
