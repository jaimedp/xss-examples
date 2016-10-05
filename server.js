var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

function xssOff(req, res, next) {
  res.append('X-XSS-Protection', 0);
  next();
}

function csp(req, res, next) {
  res.append('Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com");
  next();
}

app.use(csp);

app.get('/', function (req, res) {

  var html = '\
  <html>\
  <body>\
  <form action="hello" method="get">\
    What is your name:<br>\
    <textarea cols="40" name="name"></textarea><br>\
    <button type="submit">Send</button>\
  </form>\
  </body>\
  </html>';

  res.send(html);
});

app.get('/hello', function (req, res) {
  var name = req.query.name;

  res.send('<html><body><h3>Hello ' + name + ' </h3></body></html>');
});























//---------------------------------------------------


app.get('/b64', function (req, res) {

  var html = '\
  <html>\
  <body>\
  <form action="b64" method="post">\
    base64:<br>\
    <textarea cols="40" name="name"></textarea><br>\
    <button type="submit">Send</button>\
  </form>\
  </body>\
  </html>';

  res.send(html);
});

app.post('/b64', function (req, res) {
  var name = req.body.name;
  var n = new Buffer(name, 'base64').toString()

  res.send('<html><body><h3>Result:</h3>' + n + '</body></html>');
});






























//----------------------------------------------------




var todos = [];



app.get('/todo', function (req, res) {
  var html = '<html><body>\
    <form method="post"><input name="todo" size="30"><button type="submit">Add Todo</button></form>\
    <h3>Todos:</h3>\
    <ul><li>' + todos.join('<li>') + '</ul>';

  res.send(html);
});

app.post('/todo', function (req, res) {
  var todo = req.body.todo;
  console.log('got ', todo);
  todos.push(todo);

  res.redirect('/todo');
});




































app.get('/api/todo', function (req, res) {
  res.send(todos);
});

app.post('/api/todo', function (req, res) {
  todos.push(req.body.todo);
  res.send(todos);
});
































app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});