const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const db = require('./db/index')
const bodyParser = require('body-parser')

const app = express();

//importando models
const User = require('./models/User')

//requiriendo rutas
const indexRouter = require('./routes/index');

//requiriendo passport
const cookieParser = require('cookie-parser');
const session = require("express-session")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

//middleware morgan
app.use(logger('dev'));

/* app.use(express.urlencoded({ extended: false })); */
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//configurando passport
app.use(session({
  secret: "cats"
})
);

app.use(cookieParser());

//usar passport
app.use(passport.initialize())
app.use(passport.session())


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (username, password, done) => {
    User.findOne({
      where: { email: username }
    })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'El usuario no existe en la db' })
        }

        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Contrasena incorrecta!' })
        }

        return done(null, user)
      })
      .catch(done)
  }
))

//serializer y deserializer de passport
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user)
    })
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.sync({ force: false })
  .then(() => {
    console.log('el server anda bien!');
  })

module.exports = app;
