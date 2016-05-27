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

// sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function(){ //sync() crea la tabla quiz
	return Quiz.count().then(function(c){ //la tabla se inicializa si está vacía
			if(c===0){
				return Quiz.bulkCreate([ {question:'Capital de Italia', answer: 'Roma'}, {question:'Capital de Portugal', answer: 'Lisboa'}]).then(function(){
						console.log('Base de datos inicializada con datos');
					});
			}
		});
}).catch(function(error){
	console.log("Error sincronizando las tablas de la BBDD:", error);
	process.exit(1);
});

exports.Quiz = Quiz;
