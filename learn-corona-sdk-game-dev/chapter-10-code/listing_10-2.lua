require "sqlite3"

print("SQLite Version: " .. sqlite3.version());

db = sqlite3.open(system.pathForFile("app.db", system.DocumentsDirectory));

db:exec([[
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY autoincrement,
    firstName TEXT,
    lastName TEXT,
    phoneNumber TEXT
  );
]]);

db:exec([[
  INSERT INTO contacts (firstName, lastName, phoneNumber) VALUES (
    "Bill",
    "Cosby",
    "555-123-4567"
  );
]]);

db:exec([[
  INSERT INTO contacts (firstName, lastName, phoneNumber) VALUES (
    "Robert",
    "Kennedy",
    "555-888-9999"
  );
]]);

for r in db:nrows("SELECT * FROM contacts") do
  print(
    r.id .. " = " .. r.firstName .. " " .. r.lastName .. " : " .. r.phoneNumber
  );
end
