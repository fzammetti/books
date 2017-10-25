local lfs = require("lfs");

-- List files in the documents directory.
for f in lfs.dir(system.pathForFile("", system.DocumentsDirectory)) do
  print(f);
end

print("------------------------------------------------------------");

-- Add a directory to the temporary directory.
tempDir = system.pathForFile("", system.TemporaryDirectory);
if lfs.chdir(tempDir) then
  lfs.mkdir("A_New_Directory");
  for f in lfs.dir(tempDir) do
    print(f);
  end
end

print("------------------------------------------------------------");

-- Update timestampe of access on the new directory.
dirPath = system.pathForFile("A_New_Directory", system.TemporaryDirectory);
lfs.touch(dirPath);
attrs = lfs.attributes(dirPath);
print(attrs.modification);

print("------------------------------------------------------------");

-- Now delete that new directory.
lfs.rmdir("A_New_Directory");
for f in lfs.dir(tempDir) do
  print(f);
end
