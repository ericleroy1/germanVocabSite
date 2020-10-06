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
  secret: "secretPasswordString",
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


const wordsSchema = new Schema({
  word: String,
  type: String,
  userId: String
});



const Word = mongoose.model("Word", wordsSchema);

app.get('/', (req, res)=>{
  res.render('landing')
});
app.get('/home', (req, res)=>{
  res.render('home')
});
app.get('/nouns', (req, res)=>{
  res.render('nouns')
});
app.get('/verbs', (req, res)=>{
  res.render('verbs')
});
app.get('/adjectives', (req, res)=>{
  res.render('adjectives')
});
app.get('/others', (req, res)=>{
  res.render('others')
});


// app.post('/', (req, res)=>{
//   req.
// })



app.listen(3000, ()=> console.log("Listening on Port 3000"));
