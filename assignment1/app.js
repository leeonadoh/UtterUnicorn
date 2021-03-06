// app.js Node.js server

"use strict;"   // flag JS errors 

/* Module dependencies:
 *
 * require() loads a nodejs "module" - basically a file.  Anything
 * exported from that file (with "exports") can now be dotted off
 * the value returned by require(), in this case e.g. eatz.api
 * The convention is use the same name for variable and module.
 */
var https = require('https'),   // ADD CODE
    // NOTE, use the version of "express" linked to the assignment handout
    express = require("express"), // Express Web framework   ... ADD CODE
    fs = require("fs"),
    // config exports an object that defines attributes such as "port"
    config = require("./config"),  // app's local config - port#, etc
    eatz = require('./routes/eatz.js');  // route handlers   ... ADD CODE

var app = express();  // Create Express app server

// Configure app server
app.configure(function() {
    // use PORT environment variable, or local config file value
    app.set('port', process.env.PORT || config.port);

    // change param value to control level of logging  ... ADD CODE
    app.use(express.logger('dev'));  // 'default', 'short', 'tiny', 'dev'

    // use compression (gzip) to reduce size of HTTP responses
    app.use(express.compress());

    // parses HTTP request-body and populates req.body
    app.use(express.bodyParser({
        uploadDir: __dirname + '/public/img/uploads',
        keepExtensions: true
    }));

    // session config
    app.use(express.cookieParser()); // populates req.signedCookies
    app.use(express.session({key: config.sessionKey,
        secret: config.sessionSecret,
        cookie: {maxAge:config.sessionTimeout} }));

    // Perform route lookup based on URL and HTTP method,
    // Put app.router before express.static so that any explicit
    // app.get/post/put/delete request is called before static
    app.use(app.router);

    // location of app's static content ... may need to ADD CODE
    app.use(express.static(__dirname + "/public"));

    // return error details to client - use only during development
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

// App routes (API) - route-handlers implemented in routes/eatz.js

// Heartbeat test of server API
app.get('/', eatz.api);

// Retrieve a single dish by its id attribute
app.get('/dishes/:id', eatz.getDish);

// Upload an image file and perform image processing on it
app.post('/dishes/image', eatz.uploadImage);

app.get('/dishes', eatz.getDishes);
app.post('/dishes', eatz.addDish);
app.put('/dishes/:id', eatz.editDish);
app.delete('/dishes/:id', eatz.deleteDish);

// ADD CODE to support other routes listed on assignment handout
// Routes for user authentication. 
app.post('/auth', eatz.signup); // User sign up.
app.get('/auth', eatz.isAuthenticated); // Check if client is authorized.
app.put('/auth', eatz.logInOrOff);


var options = {
  key: fs.readFileSync('key.pem'),  // RSA private-key
  cert: fs.readFileSync('cert.pem')  // RSA public-key certificate
};

// Start HTTP server
https.createServer(options, app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode",
    		app.get('port'), config.env );
});
