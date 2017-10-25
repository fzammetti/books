smtp = require("socket.smtp");

msg = smtp.message({
  headers = {
    to = "fzammetti@etherient.com",
    subject = "Corona rocks!"
  },
  body = "Yeah, so, that was fun."
});

r, e = smtp.send({
   from = "fzammetti@omnytex.com",
   rcpt = "fzammetti@etherient.com",
   source = msg,
   server = "zammetti.com",
   port = "587",
   user = "XXX",
   password = "YYY"
});

if (e) then
  print("Error: ", e)
end
