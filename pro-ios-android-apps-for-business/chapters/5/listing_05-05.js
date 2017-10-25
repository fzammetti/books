var fs = require("fs");

fs.writeFile("outfile.txt", "I was written by Node.js", function (err) {
  if (err) {
    console.log("Errro1");
  } else {
    console.log("File written, reading back...");
    fs.readFile("outfile.txt", "ascii", function(err, dat) {
      if (err) {
        console.log("Error!");
      } else {
        console.log(dat);
      }
    });
  }
});
