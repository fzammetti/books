function utils:log(inFilename, inMessage, inObject)

  if inObject == nil then
    inObject = " ";
  else
    inObject = " - " .. json.encode(inObject);
  end

  local logMessage = inFilename .. " - " .. inMessage .. inObject;
  print(logMessage);

  if logToFile == true then
    if logFile == nil then
      local path = system.pathForFile("log.txt", system.DocumentsDirectory);
      logFile = io.open(path, "w");
      if logFile == nil then
        logFile = io.open(path, "w");
      end
    end
    logFile:write(logMessage .. "\n");
  end

end
