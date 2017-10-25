json = require("json");

local contact1 = {
  firstName = "Frank",
  lastName = "Zammetti",
  phoneNumber = "555-123-4567"

};

local contact2 = {
  firstName = "Robert",
  lastName = "Kennedy",
  phoneNumber = "555-888-9999"
};

local contacts = { contact1, contact2 };

local path = system.pathForFile("contacts.json", system.DocumentsDirectory);
if path ~= nil then
  local fh = io.open(path, "w+");
  fh:write(json.encode(contacts));
  io.close(fh);
end
