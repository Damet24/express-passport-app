const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const myConnection = require('../database')
const bcrypt = require('bcrypt')
const saltRounds = 10;

passport.serializeUser((user, done) => {
  done(null, user[0].id_users)
})

passport.deserializeUser((id, done) => {
  myConnection.query(`select * from users where id_users = ${id}`, function(err, result){
    if(err) throw err
    done(null, result)
  })
})

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  let query = `select * from users where email = '${email}'`
  myConnection.query(query, function (err, result) {
    console.log(result.length);
    if(result == 0){

      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          let query = `insert into users(name, email, user_password, phone_number)value('${req.body.name}', '${email}', '${hash}', '${req.body.phone}')`

          myConnection.query(query, function (err, result) {
            myConnection.query(`select id_users from users where email = '${email}'`, function (err, result) {
              done(null, false, req.flash('successMessage', 'Successful signup'))
            })
          })
        })
      })
    }
    else {
      done(null, false, req.flash('signupMessage','the email is aready taken'))
    }
  })
}))

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  let query = `select * from users where email = '${email}'`
  myConnection.query(query, function (err, qResult) {
    if(qResult.length != 0)
    {
      let hash = qResult[0].user_password
      bcrypt.compare(password, hash, function(err, result) {
        if(result){
          done(null, qResult)
        }
        else{
          done(null, false, req.flash('signinMessage','Incorrect password'))
        }
      })
    }
    else{
      done(null, false, req.flash('signinMessage','the user not exists'))
    }
  })
}))
