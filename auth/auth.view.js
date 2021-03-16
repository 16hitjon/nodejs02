function login(error) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Filmliste: Login</title>
    </head>
    <body>
    <h1>Benutzeranmeldung</h1>
    <p>
    ${error ? 'Benutzername und/oder Passwort falsch' : ''}
    </p>
    <form action="/login" method="POST">
    <table>
    <tr>
    <td><label for="username">Benutzername:</label></td>
    <td><input type="text" id="username" name="username" value="sepp" autofocus></td>
    </tr>
    <tr>
    <td><label for="password">Passwort:</label></td>
    <td><input type="password" id="password" name="password" value="sepp"></td>
    </tr>
    <tr><td><input type="submit" value="Anmelden"></td><td><a href="/movie">Zurück</a></td></tr>
    </table>
    </form>
    </body>
    </html>`;
   }
   module.exports = { login };