socket = require("socket");

server, err = socket.tcp();
if server == nil then
  print(err);
  os.exit();
end

server:setoption("reuseaddr", true);

res, err = server:bind("*", 0);
if res == nil then
  print(err);
  os.exit();
end

res, err = server:listen(5);
if res == nil then
  print(err);
  os.exit();
end

Runtime:addEventListener("enterFrame",
  function()
    server:settimeout(0);
    local client, _ = server:accept();
    if client ~= nil then
      local receivedContent, _ = client:receive("*l");
      if (receivedContent ~= nil) then
        print(receivedContent);
        if receivedContent == "ping" then
          client:send("pong");
        end
      end
      client:close();
    end
  end
);

local _, port = server:getsockname();
print("localhost listening on port " .. port);
