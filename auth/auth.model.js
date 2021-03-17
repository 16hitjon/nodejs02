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
   
      function get(username) {
        const database = new Database();
        const sql = ` SELECT id, username, passwordhash, CONCAT(firstname, ' ',
        secondname) AS fullname
        FROM users
        WHERE username=?;`;
        return database.queryClose(sql,[username]);
      }
      module.exports = { get };