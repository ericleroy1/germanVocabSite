const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const ObjectId = require('mongodb').ObjectID;



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
const db = mongoose.connection;

const wordsSchema = new Schema({
  word: String,
  timeStamp: Date,
  frequency: Number,
  status: Number
});
const Word = mongoose.model("Word", wordsSchema);

const userSchema = new Schema({
  email: String,
  password: String,
  nouns: [wordsSchema],
  verbs: [wordsSchema],
  adjectives: [wordsSchema],
  others: [wordsSchema]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

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
    let nouns = req.user.nouns;
    res.render('nouns', {currentUser: currentUser, nounsList: nouns});
  } else {
    res.redirect('/login')
  }
});
app.get('/verbs', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    let verbs = req.user.verbs;
    res.render('verbs', {currentUser: currentUser, verbsList: verbs});
  } else {
    res.redirect('/login')
  }
});
app.get('/adjectives', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    let adjectives = req.user.adjectives;
    res.render('adjectives', {currentUser: currentUser, adjectivesList: adjectives});
  } else {
    res.redirect('/login')
  }
});
app.get('/others', (req, res)=>{
  if (req.isAuthenticated()){
    let currentUser = req.user.username;
    let others = req.user.others;
    res.render('others', {currentUser: currentUser, othersList: others});
  } else {
    res.redirect('/login')
  }
});
app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/')
});

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

app.post('/homeNoun', (req, res)=>{
  const newWord = new Word({
    word: req.body.noun,
    timeStamp: Date.now(),
    frequency: 1,
    status: 1
  });
  User.findOne({
    username: req.user.username
  }, function(err, foundUser){
    foundUser.nouns.push(newWord);
    foundUser.save();
  });
  res.redirect('/home')
});

app.post('/homeVerb', (req, res)=>{
  const newWord = new Word({
    word: req.body.verb,
    timeStamp: Date.now(),
    frequency: 1,
    status: 1
  });
  User.findOne({
    username: req.user.username
  }, function(err, foundUser){
    foundUser.verbs.push(newWord);
    foundUser.save();
  });
  res.redirect('/home')
});

app.post('/homeAdjective', (req, res)=>{
  const newWord = new Word({
    word: req.body.adjective,
    timeStamp: Date.now(),
    frequency: 1,
    status: 1
  });
  User.findOne({
    username: req.user.username
  }, function(err, foundUser){
    foundUser.adjectives.push(newWord);
    foundUser.save();
  });
  res.redirect('/home')
});

app.post('/homeOther', (req, res)=>{
  const newWord = new Word({
    word: req.body.other,
    timeStamp: Date.now(),
    frequency: 1,
    status: 1
  });
  User.findOne({
    username: req.user.username
  }, function(err, foundUser){
    foundUser.others.push(newWord);
    foundUser.save();
  });
  res.redirect('/home')
});

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

app.post ('/redNoun', function(req, res){
db.collections.users.updateOne(
  {},
  {$set: {"nouns.$[element].status": 1}},
  {multi: true,
  arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
);
  res.redirect('/nouns');
});
app.post('/yellowNoun', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"nouns.$[element].status": 2}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/nouns');
});
app.post('/greenNoun', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"nouns.$[element].status": 3}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/nouns');
});



app.post ('/redVerb', function(req, res){
db.collections.users.updateOne(
  {},
  {$set: {"verbs.$[element].status": 1}},
  {multi: true,
  arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
);
  res.redirect('/verbs');
});
app.post('/yellowVerb', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"verbs.$[element].status": 2}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/verbs');
});
app.post('/greenVerb', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"verbs.$[element].status": 3}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/verbs');
});



app.post ('/redAdjective', function(req, res){
db.collections.users.updateOne(
  {},
  {$set: {"adjectives.$[element].status": 1}},
  {multi: true,
  arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
);
  res.redirect('/adjectives');
});
app.post('/yellowAdjective', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"adjectives.$[element].status": 2}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/adjectives');
});
app.post('/greenAdjective', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"adjectives.$[element].status": 3}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/adjectives');
});



app.post ('/redOther', function(req, res){
db.collections.users.updateOne(
  {},
  {$set: {"others.$[element].status": 1}},
  {multi: true,
  arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
);
  res.redirect('/others');
});
app.post('/yellowOther', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"others.$[element].status": 2}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/others');
});
app.post('/greenOther', (req, res)=>{
  db.collections.users.updateOne(
    {},
    {$set: {"others.$[element].status": 3}},
    {multi: true,
    arrayFilters: [{"element._id": ObjectId(req.body.inputId)}]}
  );
  res.redirect('/others');
});

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

app.post('/delete', function(req, res){
  Word.findByIdAndRemove(req.body.inputId, function(err){
    if(err){
      console.log(err)
    } else {
      console.log("Item removed");
    }
  });
  res.redirect('/home')
})














app.listen(3000, ()=> console.log("Listening on Port 3000"));
