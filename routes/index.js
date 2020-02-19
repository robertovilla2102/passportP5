const express = require('express');
const router = express.Router();
const passport = require('passport')

//requiriendo modelos
const User = require('../models/User')


//middleware autentication
const isLogedIn = (req, res, next) => {
  console.log('se ejecuta');

  if (req.isAuthenticated()) {
    console.log('pase el middleware');
    next()
  } else {
    console.log('entre aca porque no pase el md!');
    res.redirect('/login')
  }
}

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/public', (req, res, next) => {
  res.render('public')
})

router.get('/private', isLogedIn, (req, res) => {
  res.render('private')
});

// rutas de POST
router.post('/register', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      console.log('Este es el user creado!', user);
      res.redirect('/login')
    })
    .catch(next)
})

  / router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log('USER', req.user)
    console.log('Autentico OK')
    res.redirect('/private')
  })

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'chequelize' });
});

module.exports = router
