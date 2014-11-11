var express = require("express");
var app = express();
app.get("/", function(req, res) {
	res.send("Hello, " + req.query.name + "!");
	res.end();
}).listen(41051);
console.log('Server running at http://mathlab.utsc.utoronto.ca:your_port/');