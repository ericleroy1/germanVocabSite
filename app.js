const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(session({
  secret: "null",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/germanDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);


const userSchema = new Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(function(req, res, next){
//   let currentUser = req.user;
//   next();
//   console.log(currentUser);
// });


const wordsSchema = new Schema({
  word: String,
  type: String,
  userId: String
});
const Word = mongoose.model("Word", wordsSchema);



app.get('/', (req, res)=>{
  res.render('landing')
});
app.get('/register', (req, res)=>{
  res.render('register')
});
app.get('/login', (req, res)=>{
  res.render('login')
});
app.get('/home', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    res.render('home', {currentUser: currentUser});
  } else {
    res.redirect('/login')
  }
});
app.get('/nouns', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    res.render('nouns', {currentUser: currentUser});
  } else {
    res.redirect('/login')
  }
});
app.get('/verbs', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    res.render('verbs', {currentUser: currentUser});
  } else {
    res.redirect('/login')
  }
});
app.get('/adjectives', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    res.render('adjectives', {currentUser: currentUser});
  } else {
    res.redirect('/login')
  }
});
app.get('/others', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    res.render('others', {currentUser: currentUser});
  } else {
    res.redirect('/login')
  }
});


app.post('/register', (req, res)=>{
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err){
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/home');
      });
    }
  });
});
app.post('/login', (req, res)=>{
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if (err){console.log(err)}
    else {passport.authenticate('local')(req, res, function(){
      res.redirect('/home')
    })}
  });
});


app.listen(3000, ()=> console.log("Listening on Port 3000"));
