var models = require('../models');
var Sequelize = require('sequelize');


exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId, { include: [ models.Comment ] })
      .then(function(quiz) {
          if (quiz) {
            req.quiz = quiz;
            next();
          } else { 
            throw new Error('No existe quizId=' + quizId);
          }
        })
        .catch(function(error) { next(error); });
};


exports.index = function(req, res, next) {
  
  
  models.Quiz.findAll()
    .then(function(quizzes) {
      if(req.params.format=='json'){
                res.render('quizzes/index_json.ejs', { quizzes: quizzes, layout: false} );
      }
      else {
      res.render('quizzes/index.ejs', { quizzes: quizzes});
         };
    })
    .catch(function(error) {
      next(error);
    });
  
};

exports.new = function(req, res, next) {
  var quiz = models.Quiz.build({question: "", answer: ""});
  res.render('quizzes/new', {quiz: quiz});
};

exports.create = function(req, res, next){
  var quiz = models.Quiz.build({ question : req.body.quiz.question,
                                 answer : req.body.quiz.answer});
  quiz.save({fields: ["question", "answer"]})
     .then(function(quiz) {
      req.flash('success', 'Quiz creado con éxito');
      res.redirect('/quizzes');
     })
     .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('quizzes/new', {quiz: quiz});
    })
     .catch(function(error) {
      req.flash('error', 'Error al crear un Quiz: ' +error.message);
      next(error);
     });
};

exports.search = function(req, res, next) {
  models.Quiz.findAll({where: ["question like ?", '%'+req.query.search.split(" ").join("%")+'%']})
    .then(function(quizzes) {
      res.render('quizzes/index.ejs', { quizzes: quizzes});
    })
    .catch(function(error) {
      next(error);
    });
};


exports.edit = function(req, res, next){
  var quiz = req.quiz;
  res.render('quizzes/edit', {quiz: quiz});
};

exports.update = function(req, res, next) {

  req.quiz.question = req.body.quiz.question;
  req.quiz.answer   = req.body.quiz.answer;

  req.quiz.save({fields: ["question", "answer"]})
    .then(function(quiz) {
    req.flash('success', 'Quiz editado con éxito.');
      res.redirect('/quizzes'); // Redirección HTTP a lista de preguntas.
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      }; 
      res.render('quizzes/edit', {quiz: req.quiz});
    })
    .catch(function(error) {
    req.flash('error', 'Error al editar el Quiz: '+error.message);
      next(error);
    });
};

exports.destroy = function(req, res, next){
  req.quiz.destroy()
    .then( function(){
      req.flash('success', 'Quiz borrado con éxito');
      res.redirect('/quizzes');
    })
    .catch(function(error){
      req.flash('error', 'Error al editar el Quiz' +error.message);
    });
};

exports.show = function(req, res, next){
  var answer = req.query.answer || '';
    if(req.params.format=='json'){
       res.render('quizzes/show_json.ejs', { quiz: req.quiz, layout: false} );
    }
    else {
  res.render('quizzes/show', {quiz: req.quiz,
                answer: answer});
  };
};