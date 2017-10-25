var util = require("util");

console.log(util.format("%d:%d%s", 6, 54, "am"));
util.log("I am a timestamped message");
var o = { firstName : "John", lastName : "Sheridan" };
console.log(util.inspect(o, { colors : true }));
var a = [ 1, 2, 3 ];
console.log(util.isArray(a));
console.log(util.isDate(a));
