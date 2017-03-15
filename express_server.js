var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
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

app.get("/u/:shortURL", (req, res) => {
  let shortCode = req.params.shortURL;
  let longURL = urlDatabase[shortCode];
  console.log(shortCode, longURL);
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




