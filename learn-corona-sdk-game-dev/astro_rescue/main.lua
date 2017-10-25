-- ****************************************************************************
-- GLOBAL IMPORTS
-- ****************************************************************************

json = require("json");
utils = require("utils");
storyboard = require("storyboard");
storyboard.purgeOnSceneChange = true;


-- ****************************************************************************
-- GLOBAL VARIABLES
-- ****************************************************************************

-- Title screen music.
titleMusic = nil;
titleMusicChannel = nil;

-- Flag: True if using accelerometer input for horizontal motion.
usingAccelerometer = false;

-- This object will store all our game data that needs to be saved.
gameData = {

  -- The level currently being played.
  level = 1,

  -- Current score.
  score = 0

};


-- ============================================================================
-- Saves our game data to persistent storage, overwriting existing file
-- if any.
-- ============================================================================
function saveGameData()

  local path = system.pathForFile("gameData.json", system.DocumentsDirectory);
  if path ~= nil then
    local fh = io.open(path, "w+");
    fh:write(json.encode(gameData));
    io.close(fh);
  end

end -- End saveGameData().


-- ============================================================================
-- Loads our game data from persistent storage.  If no save file found then
-- calls clear() to get defaults and save to file.
-- ============================================================================
function loadGameData()

  local path = system.pathForFile("gameData.json", system.DocumentsDirectory);
  if path ~= nil then
    local fh = io.open(path, "r");
    if fh == nil then
      clearGameData();
    else
      gameData = json.decode(fh:read("*a"));
      io.close(fh);
    end
  end

end -- End loadGameData().


-- ============================================================================
-- Resets game state to defaults and deletes file, if any, from persistent
-- storage.
-- ============================================================================
function clearGameData()

  gameData.level = 1;
  gameData.score = 0;
  saveGameData();

end -- End clearGameData().


-- ****************************************************************************
-- ****************************************************************************
-- **********              ACTUAL EXECUTION BEGINS HERE              **********
-- ****************************************************************************
-- ****************************************************************************

-- Fix for Kindle Fire menu bar.  Basically it scales the stage to 20 pixels
-- smaller than the screen size, which accounts for the 20-pixel tall
-- menu bar on the Kindle, then shifts the stage up those 20 pixels (and
-- also left/right accordingly since in letterbox mode it'll be stretched
-- equally in all directions).  This only happens for Kindle Fire, but it
-- should fix the cutting off at the bottom at the cost of a little bit of
-- extra black space on the sides.
if (system.getInfo("model") == "Kindle Fire") then
  local deviceScreen = {
    left = display.screenOriginX, top = display.screenOriginY,
    right = display.contentWidth - display.screenOriginX,
    bottom = display.contentHeight - display.screenOriginY
  }
  local kFireScale = 580 / 600;
  local stage = display.getCurrentStage();
  local stageShift = 10 * display.contentScaleY;
  local screenWidth = deviceScreen.right - deviceScreen.left;
  local xShift = ((screenWidth / kFireScale) - screenWidth) / 2;
  stage:setReferencePoint(display.CenterReferencePoint);
  stage:scale(kFireScale, kFireScale);
  stage.yOrigin = stage.yOrigin - stageShift;
  stage.yReference = stage.yReference + stageShift;
  deviceScreen.left = deviceScreen.left - xShift;
  deviceScreen.right = deviceScreen.right + xShift;
end


-- Turn off status bar.
display.setStatusBar(display.HiddenStatusBar);


-- Initial startup info.
os.execute("cls");
utils:log("main", "ASTRO RESCUE STARTING...");
utils:log("main", "Environment: " .. system.getInfo("environment"));
utils:log("main", "Model: " .. system.getInfo("model"));
utils:log("main", "Device ID: " .. system.getInfo("deviceID"));
utils:log("main", "Platform Name: " .. system.getInfo("platformName"));
utils:log("main", "Platform Version: " .. system.getInfo("version"));
utils:log("main", "Corona Version: " .. system.getInfo("version"));
utils:log("main", "Corona Build: " .. system.getInfo("build"));
utils:log("main", "display.contentWidth: " .. display.contentWidth);
utils:log("main", "display.contentHeight: " .. display.contentHeight);
utils:log("main", "display.fps: " .. display.fps);
utils:log("main", "audio.totalChannels: " .. audio.totalChannels);


-- Seed random number generator.
math.randomseed(os.time());


-- Make sure channels 1 and 2 are reserved for title and ending music.
audio.reserveChannels(2);

-- Start the title scene.
utils:log("appInit", "Going to titleScene");
storyboard.gotoScene("titleScene", "flip", 500);
