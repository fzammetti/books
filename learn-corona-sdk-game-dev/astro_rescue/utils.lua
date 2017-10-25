-- The utils object.
local utils = {

  -- Are we running in the simulator?
  isSimulator = false,

  -- Are we running on an iOS device?
  isIOS = false,

  -- Are we running on an Android device?
  isAndroid = false,

  -- Are we running on a Windows desktop?
  isWin = false,

  -- Are we running on a Mac OS X desktop?
  isMac = false

};


-- Set various flags in utils object.
if string.lower(system.getInfo("environment")) == "simulator" then
  utils.isSimulator = true;
end
if string.lower(system.getInfo("platformName")) == "iphone os" then
  utils.isIOS = true;
end
if string.lower(system.getInfo("platformName")) == "android" then
  utils.isAndroid = true;
end
if string.lower(system.getInfo("platformName")) == "win" then
  utils.isWin = true;
end
if string.lower(system.getInfo("platformName")) == "mac os x" then
  utils.isMac = true;
end


-- ============================================================================
-- Simple common logging function.  Note that this uses json.encode(), which
-- sometimes won't properly encode user data.
--
-- @param inFilename The name of the calling lua file.  Required.
-- @param inMessage  Text message to display.  Required.
-- @param inObject   An optional object to log.  If not nil then json.encode()
--                   is used to convert to a string.
-- ============================================================================
function utils:log(inFilename, inMessage, inObject)

  -- If inObject is nil then we'll print a blank string, but otherwise we'll
  -- encode it and prefix it with a separator.
  if inObject == nil then
    inObject = " ";
  else
    inObject = " - " .. json.encode(inObject);
  end

  -- Construct and print it.
  local logMessage = inFilename .. " - " .. inMessage .. inObject;
  print(logMessage);

end -- End log().


-- ============================================================================
-- Constructs an audio filename appropriate for the current platform.  This
-- takes care of switching between .ogg and .m4a files for Android and iOS
-- devices respectively.  For a Windows desktop we use the .ogg version and
-- for a Mac OS X desktop we use the .m4a version.
--
-- @param inAudioName The name of the audio file to play without extension.
-- ============================================================================
function utils:getAudioFilename(inAudioName)

  if utils.isIOS == true then
    return inAudioName .. ".m4a";
  elseif utils.isAndroid == true then
    return inAudioName .. ".ogg";
  elseif utils.isWin == true then
    return inAudioName .. ".ogg";
  elseif utils.isMac == true then
    return inAudioName .. ".m4a";
  else
    -- Should never happen, but just in case, at least we send SOMETHING back.
    return inAudioName .. ".ogg";
  end

end -- End getAudioFilename().


-- ****************************************************************************
-- All done defining utils, return it.
-- ****************************************************************************
return utils;
