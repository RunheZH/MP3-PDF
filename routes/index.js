
var url = require('url');
var qstring = require('querystring');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/musics.db');
var formidable = require('formidable');
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
    sqlString = "CREATE TABLE IF NOT EXISTS musics (musicid TEXT PRIMARY KEY, pdfdoc TEXT, mp3addr TEXT, img TEXT, csv TEXT)";
    db.run(sqlString);
    sqlString = "INSERT OR REPLACE INTO musics VALUES ('twinkle_twinkle_little_star', 'pdf/twinkle_twinkle_little_star.pdf', 'mp3/twinkle_twinkle_little_star.mp3', 'img/twinkle_twinkle_little_star.jpg', 'csv/twinkle_twinkle_little_star.csv')";
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

exports.learn = function (request, response) {
    // learn.html

    var urlObj = parseURL(request, response);

    if (urlObj.query.music_id) {
        music_id = urlObj.query.music_id;
    }
    else {
        music_id = "twinkle_twinkle_little_star";
    }

    var sql = "SELECT * FROM musics WHERE musicid='" + music_id + "'";

    db.all(sql, function (err, rows) {
        response.render('learn', { title: 'Musics:', musicEntries: rows });
    })

}

exports.search = function (request, response) {

    var urlObj = parseURL(request, response);

    var sql = "SELECT * FROM musics WHERE musicid='" + urlObj.query.search + "'";

    db.all(sql, function (err, rows) {
        if (rows.length == 0) {
            response.render('index', { title: 'Hello', body: 'Could not find music sheet with music id = ' + urlObj.query.search })
        }
        else {
            response.render('play', { title: 'Musics:', musicEntries: rows })
        }
    });
}

exports.fileupload = function (request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        var oldpath = files.fileToUpload.path;
        var newpath = __dirname + "/../server/public/musics/img/" + files.fileToUpload.name;
        var fileName = files.fileToUpload.name.split('.')[0];
        
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            sqlString = "INSERT OR REPLACE INTO musics VALUES ('" + fileName + "', NULL, NULL, 'img/" + files.fileToUpload.name + "', NULL)";
            db.run(sqlString);
            //response.write('File uploaded!');
            db.all("SELECT * FROM musics WHERE musicid=\"" + fileName + "\"", function (err, rows){
                response.render('learn', {title: 'Musics:', musicEntries: rows});
            });
        });
    });
}

exports.audioupload = function (request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        var oldpath = files.audioToUpload.path;
        var newpath = __dirname + "/../server/public/musics/mp3/" + files.audioToUpload.name;
        var audioName = files.audioToUpload.name.split('.')[0];

        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            sqlString = "UPDATE musics SET mp3addr='mp3/" + files.audioToUpload.name + "' WHERE musicid='" + audioName + "'";
            db.run(sqlString);
            //response.write('File uploaded!');
            db.all("SELECT * FROM musics WHERE musicid=\"" + audioName + "\"", function (err, rows) {
                response.render('learn', { title: 'Musics:', musicEntries: rows });
            });
        });
    });
}

exports.csvupload = function (request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        var oldpath = files.csvToUpload.path;
        var newpath = __dirname + "/../server/public/musics/csv/" + files.csvToUpload.name;
        var csvName = files.csvToUpload.name.split('.')[0];

        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            sqlString = "UPDATE musics SET csv='csv/" + files.csvToUpload.name + "' WHERE musicid='" + csvName + "'";
            db.run(sqlString);
            //response.write('File uploaded!');
            db.all("SELECT * FROM musics WHERE musicid=\"" + csvName + "\"", function (err, rows) {
                response.render('play', { title: 'Musics:', musicEntries: rows });
            });
        });
    });
}