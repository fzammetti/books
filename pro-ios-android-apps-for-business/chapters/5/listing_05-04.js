var fs = require("fs");

fs.readFile("testfile.txt", "ascii", function(err, dat) {
  if (err) {
    console.log("Error!");
  } else {
    console.log(dat);
  }
});
