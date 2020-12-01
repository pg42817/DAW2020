var express = require('express');
var router = express.Router();

var Student = require('../controllers/student')
var StudentModel = require('../models/student')

/* GET home page. */
router.get('/', function(req, res, next) {
  Student.list()
    .then(data => res.render('students', { list: data }))
    .catch(err => res.render('error', {error: err}))
  ; 
});

router.get('/students', function(req, res) {
  // Data retrieve
  Student.list()
    .then(data => res.render('students', { list: data }))
    .catch(err => res.render('error', {error: err}))
  ;
});

router.get(/\/students\/(A|PG)[0-9]+$/,function(req,res){
  var parse = req.url.split('/');
  var id = parse[parse.length-1];
  Student.lookUp(id)
    .then(data=>res.render('student_profile',{ info: data }))
    .catch(err => res.render('error', {error: err}))
})

router.get('/students/register',function(req,res){
    res.render('register');
})


router.post('/students',function(req,res){
  var nome = req.body.nome;
  var numero = req.body.numero;
  var git = req.body.git;
  var tpcs= req.body.tpcs;
  if(req.body._method=='put')
  {
    let estudante = new StudentModel({
      nome:nome,
      numero:numero,
      git:git,
      tpc:tpcs
    });
    Student.delete(numero)
    Student.insert(estudante)
    .then(res.render('index'))
    .catch(err => res.render('error', {error: err}))
  }
  else{
    var tpc = [];
    for (let i = 1; i < 9; i++) {
    for (let j = 0; j < tpcs.length; j++) {
      if(tpcs[j]==i)
      {
        tpc[i-1]=1;
        break;
      }
      else{
        tpc[i-1]=0
      }
    }
  }
  let estudante = new StudentModel({
    nome:nome,
    numero:numero,
    git:git,
    tpc:tpc
  }); 
    Student.insert(estudante)
    .then(res.render('index'))
    .catch(err => res.render('error', {error: err}))
  }
})
router.get(/\/students\/edit\/(A|PG)[0-9]+$/,function(req,res){
  var parse = req.url.split('/');
  var id = parse[parse.length-1];
  Student.lookUp(id)
  .then(data => res.render('edit', { info: data }))
	.catch(err => res.render('error', { error: err }));
})

router.get(/\/students\/delete\/(A|PG)[0-9]+$/,function(req,res){
  var parse = req.url.split('/');
  var id = parse[parse.length-1];
  Student.delete(id)
  .then(data => res.render('index'))
	.catch(err => res.render('error', { error: err }));
})

module.exports = router;
