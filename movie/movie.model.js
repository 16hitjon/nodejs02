const { v4: uuid } = require("uuid");
const mysql = require("mysql");
const { response } = require("express");
const connectionProperties = {
  host: "localhost",
  user: "root",
  password: "",
  database: "movie-db",
};

class Database {
  constructor() {
    this.connection = mysql.createConnection(connectionProperties);
  }
  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }
  queryClose(sql, params) {
    const ret = this.query(sql, params);
    this.close();
    return ret;
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}
//statt save
async function saveMovieDatabase(movie) {
  const database = new Database();
  if (movie.id == "-1") {
    //wenn ein neues angelegt wird
    const sql1 = ` SELECT id FROM movies
      WHERE title=?;`;
    const sql2 = ` INSERT INTO movies (title,year,published,owner)
    VALUES(?,?,?,?)`;

   const result1 = await database.query(sql1, [movie.title]);
      if (result1.length == 0) {
        result = await database.queryClose(sql2, [
          movie.title,
          movie.year,
          movie.published,
          movie.owner,
        ]);
        return Promise.resolve(result);
      } else {
        console.log("Filmnamen bereits vergeben");
      }
    ;
  } else {
    //Wenn ein bestehendes verändert wird
    sql1 = ` SELECT id FROM movies
    WHERE title=?
    AND id != ?;`;
    sql2 = ` UPDATE movies SET  title =?,year =?,published =?
        WHERE id = ?;`;
    const result1 = await database.query(sql1, [movie.title, movie.id]);
    console.log(result1);
    if (result1.length == 0) {
      result = await database.queryClose(sql2, [
        movie.title,
        movie.year,
        movie.published,
        movie.id,
      ]);
      return Promise.resolve(result);
    } else {
      Promise.reject("Filmnamen bereits vergeben");
    }
  }
}
//for import
async function saveMoviesDatabase(movies, userID) {
  const database = new Database();
  const sqlStart = `START TRANSACTION;`;
  const sql1 = ` SELECT id FROM movies
          WHERE title=?;`;
  const sql2 = ` INSERT INTO movies (title,year,published,owner)
        VALUES(?,?,?,?)`;
  const sql3 = `COMMIT;`;
  const sql4 = `ROLLBACK;`;
  let ret;
  try {
    await database.query(sqlStart);
    await movies.forEach(async (movie) => {
      const result1 = await database.query(sql1, [movie.title]);
      if (result1.length == 0) {
        await database.query(sql2, [movie.title, movie.year, false, userID]);
      } else {
        !ret
          ? (ret = `Film mit dem Titel ${movie.title} bereits vorhanden`)
          : {};
      }
    });
    //die Filme die Problemlos importiert wurden sollen importiert bleiben/ sonst müsste das so sein:
    //await database.query(sql3);
    //ret ? {await database.query(sql4);} : {ret = `Filme erfolgreich importiert`;await database.query(sql3);}}

    await database.query(sql3);
    ret ? {} : (ret = `Filme erfolgreich importiert`);
    return Promise.resolve(ret);
  } catch (error) {
    try {
      await database.query(sql4);
    } catch (error) {}
    console.log(error);
    throw error;
  }
}
//statt remove
function removeMovieDatabase(id) {
  const database = new Database();
  const sql = `DELETE
  FROM movies
  WHERE id = ?;`;
  return database.queryClose(sql, [id]);
}
//statt get
async function getMovieDatabase(id) {
  const database = new Database();
  const sql = ` SELECT movies.id, title, year, published,
  users.username AS owner
  FROM movies, users
  WHERE movies.owner = users.id
  AND movies.id = ?;`;
  const result1 = await database.queryClose(sql, [id]);
  return result1.length ? result1[0] : null;
}
//statt getAll
function getAllDatabase() {
  const database = new Database();
  const sql = ` SELECT movies.id, title, year, published,
  users.username AS owner, CONCAT(users.firstname, ' ',
  users.secondname) AS fullname
  FROM movies, users
  WHERE movies.owner = users.id
  ORDER BY title;`;
  return database.queryClose(sql);
}
async function getAllDatabaseAsync() {
  try {
    const database = new Database();
    const sql = ` SELECT movies.id, title, year, published,
    users.username AS owner, CONCAT(users.firstname, ' ',
    users.secondname) AS fullname
    FROM movies, users
    WHERE movies.owner = users.id
    ORDER BY title;`;
    const result = await database.queryClose(sql);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}
async function getMovieCount() {
  const database = new Database();
  const sql = ` SELECT COUNT(*) AS anzahl
  FROM movies;`;
  const result = await database.queryClose(sql);
  return result[0].anzahl;
}
module.exports = {
  getAllDatabase,
  getAllDatabaseAsync,
  getMovieDatabase,
  removeMovieDatabase,
  saveMovieDatabase,
  saveMoviesDatabase,
  getMovieCount,
};
