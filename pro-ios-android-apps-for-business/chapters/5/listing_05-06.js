var fs = require("fs");

var callback1 = function(err) {
  if (err) {
    console.log("Errro1");
  } else {
    console.log("File written, reading back...");
    fs.readFile("outfile.txt", "ascii", callback2);
  }
};

var callback2 = function(err, dat) {
  if (err) {
    console.log("Error!");
  } else {
    console.log(dat);
  }
};

fs.writeFile("outfile.txt", "I was written by Node.js", callback1);
