const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash');
const morgan = require('morgan')
const app = express()

//settings
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))

require('./passport/local-auth')

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser('secret'))
app.use(session({
  secret: 'secret',
  reseve: true,
  saveUnitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) =>{
  app.locals.signupMessage = req.flash('signupMessage')
  app.locals.signinMessage = req.flash('signinMessage')
  app.locals.successMessage = req.flash('successMessage')
  app.locals.user = req.user
  next()
})

//Routes
app.use(require('./routes/routes'))

//listen the server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'))
})
