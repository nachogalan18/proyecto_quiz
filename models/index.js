var path = require('path');

var Sequelize = require('sequelize');


var url, storage;

if (!process.env.DATABASE_URL) {
    url = "sqlite:///";
    storage = "quiz.sqlite";
} else {
    url = process.env.DATABASE_URL;
    storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url, {storage: storage, omitNull: true});

var Quiz = sequelize.import(path.join(__dirname,'quiz'));
var Comment = sequelize.import(path.join(__dirname,'comment'));
var User = sequelize.import(path.join(__dirname,'user'));
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

User.hasMany(Comment, {foreignKey: 'AuthorId'});
Comment.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

exports.Quiz = Quiz;

exports.Comment = Comment;

exports.User = User;