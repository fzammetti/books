var os = require("os");

console.log("\nTemporary directory .. " + os.tmpdir());
console.log("\nEndianness ........... " +
  os.endianness() == "LE" ? "Low-endian" : "High-endian"
);
console.log("\nHost name ............ " + os.hostname());
console.log("\nOS type .............. " + os.type());
console.log("\nOS release ........... " + os.release());
console.log("\nTotal system memory .. " + os.totalmem());
console.log("\nCPU information ...... " + JSON.stringify(os.cpus()));
console.log("\nNIC infoormation ..... " +
  JSON.stringify(os.networkInterfaces())
);
