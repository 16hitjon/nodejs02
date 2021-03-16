const { deserializeUser } = require("passport");

function renderList(movies, user) {
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
        ? `<p class=blackTextBox>Sie sind angemeldet als <span style="font-style: italic;">${user.username}</span>. Ihr Name lautet <span style="font-style: italic;">${user.firstname} ${user.lastname}</span>.</p><div><a href="/logout">Logout</a> <a style="margin-left: 15px"href="/movie/edit">Neuer Film</a></div>`
        : `<p class=blackTextBox>Melden Sie sich an, um Ihre Filme hinzuzufügen</p><a href="/login">Login</a>`
    }
    <table>
    <tr><th>Titel</th><th>Jahr</th><th>Öffentlich</th><th>Besitzer</th>
    <th></th><th></th></tr>
    ${movies
      .map((movie) =>
        movie.owner == user?.username || movie.published == 1
          ? `<tr>
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
function renderMovie(movie, user) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    <style>
    table,
    td {
      width: 10%;
    }
    .blackTextBox{
      background-color: black;
      color: rgb(196, 196, 196);
      width:fit-content
    }
</style>
    </head>
    <body>
    <h1>Filmliste</h1>
    ${
      user
        ? `<p class=blackTextBox>Sie sind angemeldet als <span style="font-style: italic;">${user.username}</span>. Ihr Name lautet <span style="font-style: italic;">${user.firstname} ${user.lastname}</span>.</p><div><a href="/logout">Logout</a> <a style="margin-left: 15px"href="/movie/edit">Neuer Film</a></div>`
        : `<p class=blackTextBox>Melden Sie sich an, um Ihre Filme hinzuzufügen</p><a href="/login">Login</a>`
    }
    <form action="/movie/save" method="post">
    <input type="hidden" name="id" value="${movie.id}">
    <input type="hidden" name="owner" value="${user.id}" >
    <table>
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
  <style>
    table,
    td {
      border-collapse: collapse;
    }
    
    th {
      background-color: black;
      color: white;
    }
    
    tr {
      border-bottom: 1px solid black;
    }
    .blackTextBox{
      background-color: black;
      color: rgb(196, 196, 196);
      width:fit-content
    }
    .rightItem{
      
      margin-left:1000
    }
</style>
  </head>
  <body>
  <h1>Filmliste</h1>
  ${
    user
      ? `<p class=blackTextBox>Sie sind angemeldet als <span style="font-style: italic;">${user.username}</span>. Ihr Name lautet <span style="font-style: italic;">${user.firstname} ${user.lastname}</span>.</p><div><a href="/logout">Logout</a> <a style="margin-left: 15px"href="/movie/edit">Neuer Film</a></div>`
      : `<p class=blackTextBox>Melden Sie sich an, um Ihre Filme hinzuzufügen</p><a href="/login">Login</a>`
  }
      <table style="width: 200px">
      <tr><td>Titel:</td><td style="width: auto" >${movie.title}</td></tr>
      <tr><td>Jahr:</td><td>${movie.year}</td></tr>
      <tr><td>Öffentlich:</td><td>${movie.published == 1 ? `Ja` : `Nein`}</td></tr>
      <tr><td>Besitzer:</td><td>${movie.owner}</td></tr>
      </table>
      <a href="/movie">Zurück</a>
      </div>
      </form>
      </body>
      </html>
      `;
}
module.exports = { renderList, renderMovie, viewMovie, renderError };