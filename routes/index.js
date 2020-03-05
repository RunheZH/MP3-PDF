
var url = require('url');
var qstring = require('querystring');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/musics.db');

// pdfkit related
var PDFDocument = require('pdfkit');
var doc = new PDFDocument();
var fs = require('fs');


db.serialize(function () {
    //make sure a couple of users exist in the database.
    var sqlString = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT)";
    db.run(sqlString);
    sqlString = "INSERT OR REPLACE INTO users VALUES ('adam', 'hello')";
    db.run(sqlString);
    sqlString = "INSERT OR REPLACE INTO users VALUES ('bob', 'world')";
    db.run(sqlString);
    sqlString = "INSERT OR REPLACE INTO users VALUES ('user', 'password')";
    db.run(sqlString);

    //add some music into the database.
    sqlString = "CREATE TABLE IF NOT EXISTS musics (musicid TEXT PRIMARY KEY, pdfdoc TEXT, mp3addr TEXT, jpg TEXT)";
    db.run(sqlString);
    sqlString = "INSERT OR REPLACE INTO musics VALUES ('twinkle_twinkle_little_star', 'pdf/twinkle_twinkle_little_star.pdf', 'mp3/twinkle_twinkle_little_star.mp3', 'jpg/twinkle_twinkle_little_star.jpg')";
    db.run(sqlString);
});

exports.authenticate = function (request, response, next) {
    /*
	Middleware to do BASIC http 401 authentication
	*/
    var auth = request.headers.authorization;
    // auth is a base64 representation of (username:password)
    // so we will need to decode the base64
    if (!auth) {
        //note here the setHeader must be before the writeHead
        response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
        response.writeHead(401, { 'Content-Type': 'text/html' });
        console.log('No authorization found, send 401.');
        response.end();
    }
    else {
        console.log("Authorization Header: " + auth);
        //decode authorization header
        // Split on a space, the original auth
        // looks like "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
        var tmp = auth.split(' ');

        // create a buffer and tell it the data coming in is base64
        var buf = new Buffer(tmp[1], 'base64');

        // read it back out as a string
        // should look like 'ldnel:secret'
        var plain_auth = buf.toString();
        console.log("Decoded Authorization ", plain_auth);

        // extract the userid and password as separate strings
        var credentials = plain_auth.split(':');      // split on a ':'
        var username = credentials[0];
        var password = credentials[1];
        console.log("User: ", username);
        console.log("Password: ", password);

        var authorized = false;
        //check database users table for user
        db.all("SELECT userid, password FROM users", function (err, rows) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].userid == username & rows[i].password == password) authorized = true;
            }
            if (authorized == false) {
                //we had an authorization header by the user:password is not valid
                response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
                response.writeHead(401, { 'Content-Type': 'text/html' });
                console.log('No authorization found, send 401.');
                response.end();
            }
            else
                next();
        });
    }

    //notice no call to next()

}

function addHeader(request, response) {
    // about.html
    var title = 'COMP 4905:';
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('<!DOCTYPE html>');
    response.write('<html><head><title>About</title></head>' + '<body>');
    response.write('<h1>' + title + '</h1>');
    response.write('<hr>');
}

function addFooter(request, response) {
    response.write('<hr>');
    response.write('<h3>' + 'Carleton University' + '</h3>');
    response.write('<h3>' + 'School of Computer Science' + '</h3>');
    response.write('</body></html>');

}

exports.index = function (request, response) {
    // index.html
    response.render('index', { title: 'COMP 4905', body: 'rendered with handlebars' });
}

function parseURL(request, response) {
    var parseQuery = true; //parseQueryStringIfTrue
    var slashHost = true; //slashDenoteHostIfTrue
    var urlObj = url.parse(request.url, parseQuery, slashHost);
    console.log('path:');
    console.log(urlObj.path);
    console.log('query:');
    console.log(urlObj.query);
    return urlObj;

}

exports.users = function (request, response) {
    // users.html
    db.all("SELECT userid, password FROM users", function (err, rows) {
        response.render('users', { title: 'Users:', userEntries: rows });
    })

}

exports.musics = function (request, response) {
    // musics.html
    db.all("SELECT * FROM musics", function (err, rows) {
        response.render('musics', { title: 'Musics:', musicEntries: rows });
    })

}

// TODO
exports.find = function (request, response) {
    // find.html
    console.log("RUNNING FIND MUSICS");

    var urlObj = parseURL(request, response);

    var sql = "SELECT id, music_name FROM musics";

    db.all(sql, function (err, rows) {
        response.render('musics', { title: 'Musics:', musicEntries: rows });
    });
}
