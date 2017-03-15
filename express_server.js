var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var cookieParser = require('cookie-parser')
app.use(cookieParser())

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "xg9nb6": {
    id: "xg9nb6",
    email: "test@test.com",
    password: "test"
  },
   "test555": {
    id: "test555",
    email: "test555@test.com",
    password: "test555"
  }
};


app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user_id: req.cookies["user_id"] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user_id: req.cookies["user_id"] };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  // console.log(userID, users[userID]);
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_login", templateVars);
});

function generateRandomString() {
  var shortString = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
    shortString += charset.charAt(Math.floor(Math.random() * charset.length));
  }
    return shortString;
}

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

app.post("/urls/:id/delete", (req, res) => {
  console.log (delete urlDatabase[req.params.id]);
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.redirect("/urls/");
});

app.post("/urls/:id", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  delete urlDatabase[req.params.id];
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.editLongURL;
  res.redirect("/urls/" + shortURL);
});


app.post("/login", (req, res) => {
  let match = 0;
  for (var user in users) {
    if (users[user].email === req.body.email && users[user].password === req.body.password) {
      res.cookie('user_id', user);
      match++;
    }
  }
  if (match === 0) {
    res.status(403).send('Invalid e-mail/password combo');
  } else {
    res.redirect("/");
  }
});


app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/");
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Error!');
  } else {
  var userID = generateRandomString();
  users[userID] = {
    "id": userID,
    "email": req.body.email,
    "password": req.body.password
  }
  res.cookie('user_id', userID);
}

console.log(users);
  res.redirect("/");
});



app.get("/u/:shortURL", (req, res) => {
  let shortCode = req.params.shortURL;
  let longURL = urlDatabase[shortCode];
  console.log(shortCode, longURL);
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




