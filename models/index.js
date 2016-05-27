var path = require ('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
//    DATABASE_URL = sqlite:///
//    DATABASE_STORAGE = quiz.sqlite
// Usar BBDD Postgres:
//    DATABASE_URL = postgres://user:passwd@host:port/database

var url, storage;

if(!process.env.DATABASE_URL) {
  url= "sqlite:///";
  storage = "quiz.sqlite";
} else {
  url = process.env.DATABASE_URL;
  storage = proccess.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize (url, 
                              { storage: storage,
                                ommitNull: true
                              });
                              
//Importar la definicion de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz;
