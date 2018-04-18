var http = require("http");
var server = http.createServer(function (inRequest, inResponse) {
  inResponse.writeHead(200, { "Content-Type" : "text/plain"} );
  inResponse.end("Hello from my first Node server!");
});
server.listen(80, "127.0.0.1");
