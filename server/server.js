/* Testing: (user: user password: password)
http://localhost:3000/index.html
http://localhost:3000/users
*/

//Cntl+C to stop server

var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); 

var app = express(); //create express middleware dispatcher

const PORT = process.env.PORT || 3000
const ROOT_DIR = ['/'];

// view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars'); //use hbs handlebars wrapper

app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
var routes = require('../routes/index');

//some logger middleware functions
function methodLogger(request, response, next) {
    console.log("METHOD LOGGER");
    console.log("================================");
    console.log("METHOD: " + request.method);
    console.log("URL:" + request.url);
    next(); //call next middleware registered
}
/*
function headerLogger(request, response, next) {
    console.log("HEADER LOGGER:")
    console.log("Headers:")
    for (k in request.headers) console.log(k);
    next(); //call next middleware registered
}*/

//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(routes.authenticate); //authenticate user
app.use(favicon(path.join(__dirname, '/public', '/resources/favicon.png')));
app.use(logger('dev'));
app.use(methodLogger);
app.use(express.static(__dirname + '/public'));
//routes
app.get(ROOT_DIR, routes.index);
app.get('/index.html', routes.index);
//app.get('/find', routes.find);
app.get('/users', routes.users);
app.post('/musics/fileupload', routes.fileupload);
app.post('/musics/audioupload', routes.audioupload);
app.post('/musics/csvupload', routes.csvupload);
app.get('/musics', routes.learn);
app.get('/musics/search', routes.search);
app.get('/musics/learn', routes.learn);
app.post('/*', routes.index);

//start server
app.listen(PORT, err => {
    if (err) console.log(err)
    else { console.log(`Server listening on port: ${PORT} CNTL:-C to stop`) }
})
