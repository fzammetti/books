var dns = require("dns");

dns.lookup("www.apress.com", function(inError, inAddress) {
  if (inError) {
    console.log("Error: " + inError);
  } else {
    console.log(
      "Address for www.apress.com = " + JSON.stringify(inAddress)
    );
    dns.reverse(inAddress, function(inError, inDomains) {
      if (inError) {
        console.log("Error: " + inError);
      } else {
        console.log(
          "Domain for IP " + inAddress + " = " + JSON.stringify(inDomains)
        );
      }
    });
  }
});
