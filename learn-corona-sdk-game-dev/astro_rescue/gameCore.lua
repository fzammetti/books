-- ============================================================================
-- Our gameCore object will store our main game code.  We define the fields of
-- the object here but functions get added later (you could add the fields
-- later as well, but organizationally I prefer this form).
-- ============================================================================
local gameCore = {

  -- Our level data.
  levelData = require("levelData"),

  -- The DisplayGroup for the gameScene.
  gameDG = nil,

  -- The DisplayGroup for the current level.  Anything that should be destroyed
  -- when moving to a new level should go here.
  levelDG = nil,

  -- How far down the background and mothership are drawn from the top edge
  -- of the screen.  This is to give us room for our status bar.
  topYAdjust = 34,

  -- What phase of the game we're in, and constants for each phase.
  PHASE_FLYING = 1,
  PHASE_DEAD = 2,
  PHASE_IN_BAY = 3,
  PHASE_LANDED = 4,
  phase = nil,

  -- Reference to the popup seen when the player dies or completes a level.
  popup = nil,

  -- Reference to the score text up top.
  scoreText = nil,

  -- Our ship.
  ship = {
    sequenceData = {
      { name = "noThrust", start = 1, count = 4, time = 250 },
      { name = "thrustUp", start = 5, count = 4, time = 250 },
      { name = "thrustRight", start = 9, count = 4, time = 250 },
      { name = "thrustLeft", start = 13, count = 4, time = 250 },
      { name = "thrustUpRight", start = 17, count = 4, time = 250 },
      { name = "thrustUpLeft", start = 21, count = 4, time = 250 }
    },
    sprite = nil,
    thrustVertical = nil,
    thrustLeft = nil,
    thrustRight = nil,
    colonistsOnboard = nil,
    fuel = nil,
    maxFuel = nil
  },

  -- The colonist that is currently being rescued, as well as the
  -- indicators for colonists onboard the ship.
  colonist = {
    sequenceData = {
      { name = "materializing", start = 1, count = 10, time = 1000,
        loopCount = 1
      },
      { name = "standing", start = 11, count = 10, time = 1000 },
      { name = "indicator_onboardShip", start = 21, count = 1 },
      { name = "indicator_pendingRescue", start = 31, count = 1 },
      { name = "walking_right", start = 41, count = 2 },
      { name = "walking_left", start = 51, count = 2 }
    },
    sprite = nil,
    appearCounter = 0,
    FRAMES_BETWEEN_APPEARANCES = 60,
    indicators = { },
    lastAppearancePoint = nil
  },

  -- Explosion graphics.
  explosion = {
    sequenceData = {
      name = "exploding", start = 1, count = 5, time = 500, loopCount = 1
    },
    sprite = nil,
    callback = nil
  },

  -- References to the control elements.
  controls = {
    left = nil,
    right = nil,
    vertical = nil
  },

  -- Reference to a fuel pod currently on the screen.
  fuelPod = {
    sprite = nil,
    rotate = function()
      transition.to(gc.fuelPod.sprite, {
        time = 1000, delta = true, rotation = 360,
        onComplete = function()
          gc.fuelPod.rotate();
        end
      });
    end,
    appearanceRangeFrames = { min = 150, max = 600 },
    framesSinceLastAppearance = nil
  },

  -- Resources related to the fuel gauge.
  fuelGauge = {
    shell = nil,
    fill = nil
  },

  -- Speed warning symbol.
  warningSign = {
    sprite = nil,
    tween = nil,
    fadingIn = true,
    flash = function()
      local aVar = 0;
      if gc.warningSign.fadingIn == true then
        aVar = 1;
      end
      gc.warningSign.tween = transition.to(gc.warningSign.sprite, {
        time = 250, alpha = aVar,
        onComplete = function()
          gc.warningSign.fadingIn = not gc.warningSign.fadingIn;
          gc.warningSign.flash();
        end
      });
    end,
  },

  -- An alien UFO that attacks the player periodically.
  alienUFO = {
    sequenceData = {
      { name = "default", start = 1, count = 4, time = 200 }
    },
    sprite = nil,
    appearanceRangeFrames = { min = 300, max = 750 },
    frameSinceLastAppearance = 0,
    exitPoint = nil,
    tween = nil,
  },

  -- The plasma ball the alien UFO fires at the player's ship.
  plasmaBall = {
    sequenceData = {
      { name = "default", start = 1, count = 4, time = 200 }
    },
    sprite = nil,
    tween = nil
  },

  -- Sound effects used throughout the game.
  sfx = {
    scream = nil,
    screamChannel = nil,
    fuelPodPickup = nil,
    fuelPodPickupChannel = nil,
    sos = nil,
    sosChannel = nil,
    explosion = nil,
    explosionChannel = nil,
    thrusters = nil,
    thrustersChannel = nil
  }

};


-- ============================================================================
-- Initialize the game.  We do one-time setup tasks here.  This is called
-- from createScene() in gameScene.
--
-- @param inDisplayGroup The DisplayGroup for the gameScene.
-- ============================================================================
function gameCore:init(inDisplayGroup)

  utils:log("gameCore", "init()");

  -- Save reference to the DisplayGroup for gameScene.
  gc.gameDG = inDisplayGroup;

  -- Start physics engine and turn gravity on.
  physics.start(true);
  physics.setDrawMode("normal");
  physics.setGravity(0, 1);

  -- Load graphical resources.
  gc.loadGraphics();

  -- Load sound effects,
  gc.sfx.scream = audio.loadSound("scream.wav");
  gc.sfx.fuelPodPickup = audio.loadSound("fuelPodPickup.wav");
  gc.sfx.sos = audio.loadSound("sos.wav");
  gc.sfx.explosion = audio.loadSound("explosion.wav");
  gc.sfx.thrusters = audio.loadSound("thrusters.wav");

  -- Draw the current level.
  gc.drawCurrentLevel();

  -- Now reset level state so we're good to go.
  gc.resetLevel();

end -- End init().


-- ============================================================================
-- Load all graphical resources for the game.
-- ============================================================================
function gameCore:loadGraphics()

  -- ********** Create the "static" elements on the screen. **********

  -- Background.
  local starfield = display.newImage("starfield1.png", true);
  starfield.x = display.contentCenterX;
  starfield.y = display.contentCenterY + gc.topYAdjust;
  gc.gameDG:insert(starfield);

  -- Score text.
  gc.scoreText = display.newText("Score: ", 0, 2, native.systemFont, 28);
  gc.gameDG:insert(gc.scoreText);

  -- Fuel gauge.
  gc.fuelGauge.shell = display.newImage("fuelGauge.png", true);
  gc.fuelGauge.shell.x = display.contentCenterX;
  gc.fuelGauge.shell.y = gc.fuelGauge.shell.height / 2;
  gc.gameDG:insert(gc.fuelGauge.shell);
  gc.fuelGauge.fill = display.newRect(
    (gc.fuelGauge.shell.x - (gc.fuelGauge.shell.width / 2)) + 3,
    (gc.fuelGauge.shell.y - (gc.fuelGauge.shell.height / 2)) + 3,
    gc.fuelGauge.shell.width - 5,
    gc.fuelGauge.shell.height - 5
  );
  gc.fuelGauge.fill:setFillColor(255, 0, 0);
  gc.gameDG:insert(gc.fuelGauge.fill);
  gc.ship.maxFuel = gc.fuelGauge.fill.width;

  -- Mothership (the mothership itself and the overlayed bay).
  local mothershipSprite = display.newSprite(
    graphics.newImageSheet("mothership.png",
      { width = 800, height = 60, numFrames = 1 }
    ),
    { name = "default", start = 1, count = 1, time = 500 }
  );
  mothershipSprite.objName = "crash";
  mothershipSprite.x = display.contentCenterX;
  mothershipSprite.y = (mothershipSprite.height / 2) + gc.topYAdjust;
  physics.addBody(mothershipSprite, "static", shapeDefs:get("mothership1"));
  mothershipSprite.isFixedRotation = true;
  mothershipSprite:setSequence("default");
  mothershipSprite:play();
  gc.gameDG:insert(mothershipSprite);
  local mothershipMiddle = display.newImage("mothershipMiddle.png", true);
  mothershipMiddle.x = display.contentCenterX;
  mothershipMiddle.y = mothershipSprite.height + 32;
  mothershipMiddle.objName = "bay";
  physics.addBody(
    mothershipMiddle, "static", { density = 1, friction = 2, bounce = 0 }
  );
  gc.gameDG:insert(mothershipMiddle);

  -- Speed warning sign.
  gc.warningSign.sprite = display.newImage("warningSign.png", true);
  gc.warningSign.sprite.x =
    gc.warningSign.sprite.width - (gc.warningSign.sprite.width / 2) + 2;
  gc.warningSign.sprite.y =
    gc.warningSign.sprite.height + mothershipSprite.height + 10;
  gc.warningSign.sprite.alpha = 0;
  gc.gameDG:insert(gc.warningSign.sprite);

  --Vertical thrust control.
  if usingAccelerometer == false then
    gc.controls.vertical = display.newImage("controlVertical.png", true);
    gc.controls.vertical.x =
      (display.contentWidth - (gc.controls.vertical.width / 2)) - 20;
    gc.controls.vertical.y =
      display.contentCenterY + gc.controls.vertical.height + 40;
    gc.controls.vertical.alpha = .2;
    gc.controls.vertical.controlName = "vertical";
    gc.controls.vertical:addEventListener("touch", gc);
    gc.gameDG:insert(gc.controls.vertical);
  end

  -- Horizontal thrust controls.  Note that the right control is
  -- just the left graphic but mirrored (saves texture memory).
  if usingAccelerometer == false then
    gc.controls.left = display.newImage("controlHorizontal.png", true);
    gc.controls.left.x = (gc.controls.left.width / 2) + 20;
    gc.controls.left.y = display.contentCenterY + gc.controls.left.height + 40;
    gc.controls.left.alpha = .2;
    gc.controls.left.controlName = "left";
    gc.controls.left:addEventListener("touch", gc);
    gc.gameDG:insert(gc.controls.left);
    gc.controls.right = display.newImage("controlHorizontal.png", true);
    gc.controls.right.x =
      (gc.controls.right.width / 2) + 40 + gc.controls.right.width;
    gc.controls.right.y =
      display.contentCenterY + gc.controls.right.height + 40;
    gc.controls.right.alpha = .2;
    gc.controls.right.controlName = "right";
    gc.controls.right:addEventListener("touch", gc);
    gc.controls.right:scale(-1, 1);
    gc.gameDG:insert(gc.controls.right);
  end

  -- ********** Create the "dynamic" elements. **********

  -- Ship.
  gc.ship.sprite = display.newSprite(
    graphics.newImageSheet("ship.png",
      { width = 48, height = 48, numFrames = 24 }
    ),
    gc.ship.sequenceData
  );
  physics.addBody(
    gc.ship.sprite, "dynamic", { density = 1, friction = 1, bounce = 0 }
  );
  gc.ship.sprite.isFixedRotation = true;
  gc.ship.sprite.objName = "ship";
  gc.gameDG:insert(gc.ship.sprite);

  -- Colonist currently awaiting rescue.
  gc.colonist.sprite = display.newSprite(
    graphics.newImageSheet("colonist.png",
      { width = 32, height = 32, numFrames = 60 }
    ),
    gc.colonist.sequenceData
  );
  gc.colonist.sprite.objName = "colonist";
  physics.addBody(
    gc.colonist.sprite, "static", { isSensor = true }
  );
  gc.colonist.sprite:addEventListener("sprite",
    function(inEvent)
      if inEvent.target.sequence == "materializing" and
        inEvent.phase == "ended"
      then
        -- They were materializing, now they're done and just standing there
        -- waiting for the ship to get them.
        gc.colonist.sprite:setSequence("standing");
        gc.colonist.sprite:play();
      end
    end
  );
  gc.gameDG:insert(gc.colonist.sprite);

  -- Explosion.
  gc.explosion.sprite = display.newSprite(
    graphics.newImageSheet("explosion.png",
      { width = 70, height = 70, numFrames = 5 }
    ),
    gc.explosion.sequenceData
  );
  gc.explosion.sprite.isVisible = false;
  gc.gameDG:insert(gc.explosion.sprite);

  -- Fuel pod.
  gc.fuelPod.sprite = display.newImage("fuelPod.png", true);
  gc.fuelPod.sprite.objName = "fuelPod";
  gc.fuelPod.sprite.isVisible = false;
  gc.fuelPod.sprite.x = -1000;
  gc.fuelPod.sprite.y = -1000;
  physics.addBody(gc.fuelPod.sprite, "static", { isSensor = true });
  gc.gameDG:insert(gc.fuelPod.sprite);

  -- Alien UFO.
  gc.alienUFO.sprite = display.newSprite(
    graphics.newImageSheet("alienUFO.png",
      { width = 48, height = 48, numFrames = 4 }
    ),
    gc.alienUFO.sequenceData
  );
  physics.addBody(gc.alienUFO.sprite, "static", { isSensor = true });
  gc.alienUFO.sprite.x = -1000;
  gc.alienUFO.sprite.y = -1000;
  gc.alienUFO.sprite.isVisible = false;
  gc.alienUFO.sprite.objName = "crash";
  gc.alienUFO.sprite:setSequence("default");
  gc.alienUFO.sprite:play();
  gc.gameDG:insert(gc.alienUFO.sprite);

  -- Plasma ball.
  gc.plasmaBall.sprite = display.newSprite(
    graphics.newImageSheet("plasmaBall.png",
      { width = 24, height = 24, numFrames = 4 }
    ),
    gc.plasmaBall.sequenceData
  );
  physics.addBody(gc.plasmaBall.sprite, "static", { isSensor = true });
  gc.plasmaBall.sprite.x = -1000;
  gc.plasmaBall.sprite.y = -1000;
  gc.plasmaBall.sprite.isVisible = false;
  gc.plasmaBall.sprite.objName = "crash";
  gc.plasmaBall.sprite:setSequence("default");
  gc.plasmaBall.sprite:play();
  gc.gameDG:insert(gc.plasmaBall.sprite);

end -- End loadGraphics().


-- ============================================================================
-- Resets the game at the start of a level.
-- ============================================================================
function gameCore:resetLevel()

  utils:log("gameCore", "resetLevel()");

  -- Reset state (aka variables) as needed.

  gc.phase = gc.PHASE_FLYING;
  gc.popup = nil;

  gc.ship.thrustVertical = false;
  gc.ship.thrustLeft = false;
  gc.ship.thrustRight = false;
  gc.ship.colonistsOnboard = 0;
  gc.ship.fuel = gc.ship.maxFuel;
  gc:updateFuelGauge();
  gc.ship.sprite:setSequence("noThrust");
  gc.ship.sprite:play();
  gc.ship.sprite.isVisible = true;
  gc.ship.sprite.x = display.contentCenterX;
  gc.ship.sprite.y = 70 + (gc.ship.sprite.height / 2) + gc.topYAdjust;
  gc.ship.sprite:setLinearVelocity(0, 0);
  gc.ship.sprite.isBodyActive = true;

  gc.colonist.appearCounter = 0;
  gc.colonist.lastAppearancePoint = nil;
  gc.colonist.sprite.isVisible = false;

  gc.explosion.callback = nil;

  gc.fuelPod.framesSinceLastAppearance = 0;
  gc.fuelPod.sprite.isVisible = false;
  gc.fuelPod.sprite.x = -1000;
  gc.fuelPod.sprite.y = -1000;

  if gc.warningSign.tween ~= nil then
    transition.cancel(gc.warningSign.tween);
  end
  gc.warningSign.tween = nil;
  gc.warningSign.sprite.alpha = 0;
  gc.warningSign.fadingIn = true;
  gc.warningSign.sprite.isVisible = false;
  gc.warningSign.flash();

  if gc.alienUFO.tween ~= nil then
    transition.cancel(gc.alienUFO.tween);
  end
  gc.alienUFO.framesSinceLastAppearance = 0;
  gc.alienUFO.sprite.isVisible = false;
  gc.alienUFO.sprite.x = -1000;
  gc.alienUFO.sprite.y = -1000;
  gc.alienUFO.tween = nil;

  if gc.plasmaBall.tween ~= nil then
    transition.cancel(gc.plasmaBall.tween);
  end
  gc.plasmaBall.sprite.isVisible = false;
  gc.plasmaBall.sprite.x = -1000;
  gc.plasmaBall.sprite.y = -1000;
  gc.plasmaBall.tween = nil;

  -- The colonists rescued indicators need to be done here as well.  We
  -- first have to clean up any existing indicators, then draw the new ones.
  -- Colonists onboard ship indicators.  Loop counts backwards but we insert
  -- them into the colonists array forward so that indicator #1 is the left-most
  -- one even though the set of indicators is on the right side of the screen.
  for i = 1, #gc.colonist.indicators, 1 do
    gc.colonist.indicators[i]:removeSelf();
    gc.colonist.indicators[i] = nil;
  end
  local indNum = 1;
  gc.colonist.indicators = { };
  for i = gc.levelData[gameData.level][16].colonistsToRescue, 1, -1 do
    gc.colonist.indicators[indNum] = display.newSprite(
      graphics.newImageSheet("colonist.png",
        { width = 32, height = 32, numFrames = 60 }
      ),
      gc.colonist.sequenceData
    );
    gc.colonist.indicators[indNum]:setSequence("indicator_pendingRescue");
    gc.colonist.indicators[indNum]:play();
    gc.colonist.indicators[indNum].x = display.contentWidth - (
      ((i - 1) * gc.colonist.indicators[indNum].width) +
        gc.colonist.indicators[indNum].width / 2
    );
    gc.colonist.indicators[indNum].y =
    gc.colonist.indicators[indNum].height / 2;
    gc.gameDG:insert(gc.colonist.indicators[indNum]);
    indNum = indNum + 1;
  end

  -- Bring element to the foreground as necessary.  Note that this assumes
  -- that drawCurrentLevel() has already been called.
  if usingAccelerometer == false then
    gc.controls.left:toFront();
    gc.controls.right:toFront();
    gc.controls.vertical:toFront();
  end
  gc.ship.sprite:toFront();
  gc.colonist.sprite:toFront();
  gc.warningSign.sprite:toFront();
  gc.fuelPod.sprite:toFront();
  gc.alienUFO.sprite:toFront();
  gc.plasmaBall.sprite:toFront();

  -- Update score.  Note that there is a bit of a trick in order to get the
  -- text to be properly left-aligned.  Basically, you need to change the
  -- default top-left reference point to center, change the text and then
  -- change the reference point and then reset the X/Y location.  If you don't
  -- do all this then what happens is the text winds up hanging off the left
  -- side of the screen a bit.  It moves from where it's initially placed in
  -- the init() method after the text is changed.  This hack gets around that.
  -- Note that if you need to use scaling then you should set the X and Y
  -- scaling both to 1 before changing the text, then set it to
  -- display.contentScaleX and display.contentScaleY after, that will allow
  -- you to have left-aligning at the same time as using scaling.
  gc.scoreText:setReferencePoint(display.CenterReferencePoint);
  gc.scoreText.text = "Score: " .. gameData.score;
  gc.scoreText:setReferencePoint(display.TopLeftReferencePoint);
  gc.scoreText.x = 0;
  gc.scoreText.y = 2;

end -- End resetLevel().


-- ============================================================================
-- Starts the game running.  This is called from enterScene() in gameScene.
-- ============================================================================
function gameCore:start()

  utils:log("gameCore", "start()");

  -- Activate multitouch.
  if usingAccelerometer == false then
    system.activate("multitouch")
  end

  -- Add listeners for main loop and collision detection.
  Runtime:addEventListener("enterFrame", gc);
  Runtime:addEventListener("collision", gc);

  -- If using accelerometer-based control then we need to activate a touch
  -- listener on Runtime so any screen press is vertical thrust, and also
  -- our accelerometer input of course.
  if usingAccelerometer == true then
    Runtime:addEventListener("touch", gc);
    Runtime:addEventListener("accelerometer", gc);
  end

end -- End start().


-- ============================================================================
-- Stops the game running.  This is called from exitScene() in gameScene.
-- ============================================================================
function gameCore:stop()

  utils:log("gameCore", "stop()");

  -- Dectivate multitouch.
  if usingAccelerometer == false then
    system.deactivate("multitouch")
  end

  -- Stop the physics engine.
  physics.stop();

  -- Add listeners for main loop and collision detection.
  Runtime:removeEventListener("enterFrame", gc);
  Runtime:removeEventListener("collision", gc);

  -- If using accelerometer-based control then we need to activate a touch
  -- listener on Runtime so any screen press is vertical thrust, and also
  -- our accelerometer input of course.
  if usingAccelerometer == true then
    Runtime:removeEventListener("touch", gc);
    Runtime:removeEventListener("accelerometer", gc);
  end

end -- End stop().


-- ============================================================================
-- Destroy any resources created for the game.
-- ============================================================================
function gameCore:destroy()

  utils:log("gameCore", "destroy()");

  -- Audio.  All must be stopped if playing, disposed of an nil'd.
  if gc.sfx.screamChannel ~= nil then
    audio.stop(gc.sfx.screamChannel);
  end
  audio.dispose(gc.sfx.scream);
  gc.sfx.screamChannel = nil;
  gc.sfx.scream = nil;
  if gc.sfx.fuelPodPickupChannel ~= nil then
    audio.stop(gc.sfx.fuelPodPickupChannel);
  end
  audio.dispose(gc.sfx.fuelPodPickup);
  gc.sfx.fuelPodPickup = nil;
  gc.sfx.fuelPodPickupChannel = nil;
  if gc.sfx.sosChannel ~= nil then
    audio.stop(gc.sfx.sosChannel);
  end
  audio.dispose(gc.sfx.sos);
  gc.sfx.sos = nil;
  gc.sfx.sosChannel = nil;
  if gc.sfx.explosionChannel ~= nil then
    audio.stop(gc.sfx.explosionChannel);
  end
  audio.dispose(gc.sfx.explosion);
  gc.sfx.explosion = nil;
  gc.sfx.explosionChannel = nil;
  if gc.sfx.thrustersChannel ~= nil then
    audio.stop(gc.sfx.thrustersChannel);
  end
  audio.dispose(gc.sfx.thrusters);
  gc.sfx.thrusters = nil;
  gc.sfx.thrustersChannel = nil;

  -- Graphics.
  gc.scoreText:removeSelf();
  gc.scoreText = nil;
  gc.ship.sprite:removeSelf();
  gc.ship.sprite = nil;
  gc.colonist.sprite:removeSelf();
  gc.colonist.sprite = nil;
  gc.explosion.sprite:removeSelf();
  gc.explosion.sprite = nil;
  if usingAccelerometer == false then
    gc.controls.left:removeSelf();
    gc.controls.left = nil;
    gc.controls.right:removeSelf();
    gc.controls.right = nil;
    gc.controls.vertical:removeSelf();
    gc.controls.vertical = nil;
  end
  gc.fuelPod.sprite:removeSelf();
  gc.fuelPod.sprite = nil;
  gc.fuelGauge.shell:removeSelf();
  gc.fuelGauge.shell = nil;
  gc.fuelGauge.fill:removeSelf();
  gc.fuelGauge.fill = nil;
  gc.warningSign.sprite:removeSelf();
  gc.warningSign.sprite = nil;
  gc.alienUFO.sprite:removeSelf();
  gc.alienUFO.sprite = nil;
  gc.plasmaBall.sprite:removeSelf();
  gc.plasmaBall.sprite = nil;
  for i = 1, #gc.colonist.indicators, 1 do
    gc.colonist.indicators[i]:removeSelf();
    gc.colonist.indicators[i] = nil;
  end

  -- Display Groups.  Note that gameDG already had removeSelf() called on it
  -- as part of the scene transition so we just need to nil the reference.
  gc.levelDG:removeSelf();
  gc.levelDG = nil;
  gc.gameDG = nil;

end -- End destroy().


-- ============================================================================
-- Draws the current level on the screen.  This deals with all elements except
-- our ship and colonists.
-- ============================================================================
function gameCore:drawCurrentLevel()

  utils:log("gameCore", "drawCurrentLevel()");

  -- If this isn't the first time here we need to clean up the graphics from
  -- the last level drawing.
  if gc.levelDG ~= nil then
    gc.levelDG:removeSelf();
  end

  -- DisplayGroup for the elements of the level.
  gc.levelDG = display.newGroup();

  -- Now use the level data to draw the dynamic parts of the level.
  for y = 1, 15, 1 do
    for x = 1, 25, 1 do
      -- Calculate pixel location for the tile.
      local pX = 32 * (x - 1);
      local pY = 32 * (y - 1);
      -- Get the code for the tile to draw.
      local tileType = gc.levelData[gameData.level][y][x];
      -- Create the appropriate graphic and insert into the levelDG.
      if tileType ~= " " then
        local material = "Dirt";
        if tileType == "4" or tileType == "5" or tileType == "6" then
          material = "Metal";
        end
        local tile;
        if tileType == "1" or tileType == "4" then
          tile = display.newImage("tile" .. material .. "Fill.png", true);
          tile.objName = "crash";
        end
        if tileType == "2" or tileType == "5" then
          tile = display.newImage("tile" .. material .. "Top.png", true);
          tile.objName = "crash";
          physics.addBody(
            tile, "static", { density = 1, friction = 2, bounce = 0 }
          );
        elseif tileType == "3" or tileType == "6" then
          tile = display.newImage("tile" .. material .. "Pad.png", true);
          tile.objName = "pad";
          physics.addBody(
            tile, "static", { density = 1, friction = 2, bounce = 0 }
          );
        end
        tile:setReferencePoint(display.TopLeftReferencePoint);
        tile.x = pX;
        tile.y = pY;
        gc.levelDG:insert(tile);
      end
    end
  end

  -- Now insert the DisplayGroup that contains all our tiles into the main
  -- DisplayGroup for the scene.
  gc.gameDG:insert(gc.levelDG);

end -- End drawCurrentLevel().


-- ============================================================================
-- Show a small, transient, expanding and fading message in the middle
-- of the screen.
--
-- @param inMsg The message to display
-- ============================================================================
function gameCore:showMessage(inMsg)

  utils:log("gameCore", "showMessage(): inMsg = " .. inMsg);

  -- Create message text.
  local msgText = display.newText(inMsg, 0, 0, nil, 20);
  msgText:setTextColor(255, 255, 0);
  msgText.x = display.contentCenterX;
  msgText.y = display.contentCenterY;
  msgText.alpha = 1;
  msgText.xScale = 1.0;
  msgText.yScale = 1.0;

  transition.to(msgText,
    { time = 1000, alpha = 0, xScale = 30.0, yScale = 30.0,
      onComplete = function(inTarget)
        inTarget:removeSelf();
        inTarget = nil;
      end
    }
  );

end -- End showMessage().


-- ============================================================================
-- Stops all in-game activity.  This includes making sure the ship isn't
-- moving, alien UFO and plasma ball stop and thrust sound stops.
-- ============================================================================
function gameCore:stopAllActivity()

  -- Stop all tweens.
  if gc.warningSign.tween ~= nil then
    transition.cancel(gc.warningSign.tween);
  end
  if gc.alienUFO.tween ~= nil then
    transition.cancel(gc.alienUFO.tween);
  end
  if gc.plasmaBall.tween ~= nil then
    transition.cancel(gc.plasmaBall.tween);
  end

  -- Hide graphics.
  gc.alienUFO.sprite.isVisible = false;
  gc.plasmaBall.sprite.isVisible = false;
  gc.ship.sprite.isVisible = false;

  -- We need to deactivate physics on the ship temporarily, and this requires
  -- a delay since this is called from inside an collision handler.
  timer.performWithDelay(10,
    function()
      gc.ship.sprite.isBodyActive = false;
    end
  );

  -- Stop thrust sound.
  if gc.sfx.thrustersChannel ~= nil then
    audio.stop(gc.sfx.thrustersChannel);
  end

end -- End stopAllActivity().


-- ****************************************************************************
-- All done defining gameCore, return it.
-- ****************************************************************************
return gameCore;
