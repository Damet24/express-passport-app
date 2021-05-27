const { Router } = require('express')
const passport = require('passport');
const router = Router()

const myConnection = require('../database')
const bcrypt = require('bcrypt')
const saltRounds = 10;

router.get('/', (req, res, next) => {
  res.render('main', {title: 'main'})
})

router.get('/signup', (req, res, next) => {
  res.render('signup', {title: 'signup'})
})

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/signin',
  failureRedirect: '/signup',
  passReqToCallback: true
}))

router.get('/signin', (req, res, next) => {
  res.render('signin', {title: 'signin'})
})

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/home',
  failureRedirect: '/signin',
  passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

router.use((req, res, next) => {
  isAuthenticated(req, res, next)
  next()
})

router.get('/home', (req, res, next) => {
  res.render('home')
})


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next()
  }

  return res.redirect('/')
}

module.exports = router
