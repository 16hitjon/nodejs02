const { v4: uuid } = require("uuid");
const mysql = require("mysql");
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
function saveMovieDatabase(movie) {
  const database = new Database();
  let sql = "";
  if (movie.id == "-1") {
    //wenn ein neues angelegt wird
    console.log("neuer Film");
    console.log("Title:"+movie.title);
    console.log("year:"+movie.year);
    console.log("published:"+movie.published);
    console.log("ownerID:"+movie.owner);

    sql = ` INSERT INTO movies (title,year,published,owner)
    VALUES(?,?,?,?)`;
    return database.queryClose(sql, [
      movie.title,
      movie.year,
      movie.published,
      movie.owner,
    ]);
  } else {
    //Wenn ein bestehendes verändert wird
    console.log("ändere Film");
    
    sql = ` UPDATE movies SET  title =?,year =?,published =?
        WHERE id = ?;`;
    return database.queryClose(sql, [
      movie.title,
      movie.year,
      movie.published,
      movie.id,
    ]);
  }
}
//statt remove
function removeMovieDatabase(id) {
  console.log('delete Movie');
  const database = new Database();
  const sql = `DELETE
  FROM movies
  WHERE id = ?;`;
  return database.queryClose(sql,[id]);
}
//statt get
function getMovieDatabase(id) {
  console.log('ID:'+id);
  const database = new Database();
  const sql = ` SELECT movies.id, title, year, published,
  users.username AS owner
  FROM movies, users
  WHERE movies.owner = users.id
  AND movies.id = ?;`;
  return database.queryClose(sql,[id]);
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
module.exports = {
  getAllDatabase,
  getAllDatabaseAsync,
  getMovieDatabase,
  removeMovieDatabase,
  saveMovieDatabase,
};
