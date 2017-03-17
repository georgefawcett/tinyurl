const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'], //
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    user_id: "xg9nb6"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    user_id: "testing"
  },
  "test12": {
    url: "http://www.tsn.ca",
    user_id: "testing"
  }
};

const users = {
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
  },
  "testing":
   { id: "testing",
     email: "222@222.com",
     password: "$2a$10$exGslNOyBmWQdgXI/wt76OSlmSC/tmQvaoXVhPyUukXkQWLLBr5HS"
   }
};


app.get("/", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const userID = req.session.user_id;
    const templateVars = { user: users[userID] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].url, owner: urlDatabase[req.params.id].user_id, user: userID };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { urls: urlDatabase, user: users[userID] };
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
  const shortURL = generateRandomString();
  const userID = req.session.user_id;
  urlDatabase[shortURL] = { url: req.body.longURL, user_id: userID };
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  const templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.body.shortURL;
  urlDatabase[shortURL].url = req.body.editLongURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const bcrypt = require('bcrypt');
  var match = 0;
  for (var user in users) {
    if (users[user].email === req.body.email && bcrypt.compareSync(req.body.password, users[user].password)) {
      req.session.user_id = user;
      match++;
    }
  }
  if (match === 0) {
    res.status(403).send('Invalid e-mail/password combination');
  } else {
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Error!');
  } else {
  var userID = generateRandomString();
  const bcrypt = require('bcrypt');
  const hashed_password = bcrypt.hashSync(req.body.password, 10);
  users[userID] = {
    "id": userID,
    "email": req.body.email,
    "password": hashed_password
  }
  req.session.user_id = userID;
}

  res.redirect("/urls");
});



app.get("/u/:shortURL", (req, res) => {
  const shortCode = req.params.shortURL;
  const longURL = urlDatabase[shortCode].url;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`tinyApp is listening on port ${PORT}`);
});
