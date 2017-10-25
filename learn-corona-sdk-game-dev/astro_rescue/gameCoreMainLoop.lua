-- ============================================================================
-- Our main game loop, executed each frame.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:enterFrame(inEvent)

  -- If an explosion is in progress, do nothing.
  if gc.phase == gc.EXPLODING then
    return;
  end

  -- If ship is dead show our dead popup.
  if gc.phase == gc.PHASE_DEAD then
    gc.showDeadPopup();
    return;
  end

  -- If ship is in the bay then show our level over graphics.
  if gc.phase == gc.PHASE_IN_BAY then
    gc.showEnteredBayPopup();
    return;
  end

  -- Ok, game's in progress so it's time to go to work!  Update the ship.
  gc.processShip(inEvent);

  -- Update (or show a new) colonist to be rescued.
  gc.processColonist(inEvent);

  -- Handle fuel pod appearances.
  gc.processFuelPod(inEvent);

  -- Deal with the alien UFO, if any, or show one if it's time.
  gc.processAlienUFO(inEvent);

end -- End enterFrame().


-- ============================================================================
-- Update the ship.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:processShip(inEvent)

  -- If ship is thrusting vertically and they have fuel then apply force.
  if gc.ship.thrustVertical == true and gc.ship.fuel > 0 then
    gc.ship.sprite:applyLinearImpulse(
      0, -.4, gc.ship.sprite.x, gc.ship.sprite.y
    );
  end

  -- If ship is thrusting left and they have fuel then apply force.
  if gc.ship.thrustLeft == true and gc.ship.fuel > 0 then
    -- The force is greater when using on-screen controls because the player
    -- can more precisely control it, so to be fair we'll use a much smaller
    -- amount of force for accelerometer control.
    local forceAmount = .2;
    if usingAccelerometer == true then
      forceAmount = .1;
    end
    gc.ship.sprite:applyLinearImpulse(
      forceAmount, 0, gc.ship.sprite.x, gc.ship.sprite.y
    );
  end

  -- If ship is thrusting right and they have fuel then apply force.
  if gc.ship.thrustRight == true and gc.ship.fuel > 0 then
    -- The force is greater when using on-screen controls because the player
    -- can more precisely control it, so to be fair we'll use a much smaller
    -- amount of force for accelerometer control.
    local forceAmount = .2;
    if usingAccelerometer == true then
      forceAmount = .1;
    end
    gc.ship.sprite:applyLinearImpulse(
      -forceAmount, 0, gc.ship.sprite.x, gc.ship.sprite.y
    );
  end

  -- Now check to see if the ship goes off the screen.  If so, they're dead.
  if gc.ship.sprite.x < 0 or
    gc.ship.sprite.x > display.contentWidth
  then
    utils:log("gameCoreMainLoop", "Ship went off screen");
    gc.phase = gc.PHASE_DEAD;
    gc.ship.sprite.isVisible = false;
  end

  -- If thrusting, update fuel bar.
  if gc.ship.thrustVertical == true or gc.ship.thrustLeft == true or
    gc.ship.thrustRight == true
  then
    gc.ship.fuel = gc.ship.fuel - 2;
    -- Need to recreate the fill so it winds up in the right place and is
    -- the right width (you run into some issues if you try to just adjust
    -- the width on the existing element in terms of X position).
    if gc.ship.fuel <= 0 then
      gc.ship.sprite:setSequence("noThrust");
      gc.ship.sprite:play();
      gc.ship.thrustVertical = false;
      gc.ship.thrustLeft = false;
      gc.ship.thrustRight = false;
    end
    gc.updateFuelGauge();
  end

  -- If they're going too fast then flash the warning sign.
  local vX, vY = gc.ship.sprite:getLinearVelocity();
  if vX > 75 or vY > 75 then
    gc.warningSign.sprite.isVisible = true;
  else
    gc.warningSign.sprite.isVisible = false;
  end

end -- End processShip().


-- ============================================================================
-- Update (or show a new) colonist to be rescued.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:processColonist(inEvent)

  -- If there's currently a colonist and the ship has landed then we have
  -- to move the colonist towards the ship and deal with when they reach it.
  if gc.colonist.sprite.isVisible == true and gc.phase == gc.PHASE_LANDED then

    -- Calculate delta between colonist's X location and the ship's.
    local deltaX = math.abs(gc.colonist.sprite.x - gc.ship.sprite.x);

    -- Colonist has reached the ship, hide the sprite.
    if deltaX <= 1 then

      gc.colonist.sprite.isVisible = false;
      -- If there's still colonists to rescue then reset the colonist
      -- for the next appearance and update the indicators.
      gc.ship.colonistsOnboard = gc.ship.colonistsOnboard + 1;
      if gc.ship.colonistsOnboard <=
        gc.levelData[gameData.level][16].colonistsToRescue
      then
        gc.colonist.indicators[gc.ship.colonistsOnboard]:setSequence(
          "indicator_onboardShip"
        );
        gc.colonist.indicators[gc.ship.colonistsOnboard]:play();
        gc.colonist.appearCounter = 0;
        gc:showMessage("Got 'em!");
      end

    -- Colonist hasn't reached the ship yet.
    elseif deltaX > 1 and deltaX <= 140 then

      -- Move them left or right as appropriate and also set appropriate walk
      -- animation.
      if gc.ship.sprite.x > gc.colonist.sprite.x then
        gc.colonist.sprite.x = gc.colonist.sprite.x + 2;
        if gc.colonist.sprite.sequence ~= "walking_right" then
          gc.colonist.sprite:setSequence("walking_right");
          gc.colonist.sprite:play();
        end
      elseif gc.ship.sprite.x < gc.colonist.sprite.x then
        gc.colonist.sprite.x = gc.colonist.sprite.x - 2;
        if gc.colonist.sprite.sequence ~= "walking_left" then
          gc.colonist.sprite:setSequence("walking_left");
          gc.colonist.sprite:play();
        end
      end

    end

  end

  -- See if it's time to show a colonist, if there isn't one already present
  -- and if the ship isn't full.
  gc.colonist.appearCounter = gc.colonist.appearCounter + 1;
  if gc.colonist.sprite.isVisible == false and

    gc.ship.colonistsOnboard < 3 and
    gc.colonist.appearCounter >= gc.colonist.FRAMES_BETWEEN_APPEARANCES

  -- If the ship is already landed then reset the appearCount so that the
  -- player has to lift off before a colonist will appear.
  then

    if gc.phase == gc.PHASE_LANDED then
      gc.colonist.appearCounter = 0;
      return;
    end

    -- Figure out where to put him.  To do this we pick one of the colonist
    -- appearance tiles from the level data at random and then calculate X/Y
    -- off that and make sure it's not the same point as last time.
    local whichTile = math.random(1, #gc.levelData[gameData.level][17]);
    while whichTile == gc.colonist.lastAppearancePoint do
      whichTile = math.random(1, #gc.levelData[gameData.level][17]);
    end

    -- Translate tile coordinates to pixel coordinates.
    local tileCoordinates = gc.levelData[gameData.level][17][whichTile];
    local pX = 32 * (tileCoordinates.x - 1);
    local pY = (32 * (tileCoordinates.y - 1)) - 16;
    gc.colonist.sprite.x = pX;
    gc.colonist.sprite.y = pY;

    -- Finally, start the materialization animation sequence and show him.
    gc.colonist.sprite:setSequence("materializing");
    gc.colonist.sprite:play();
    gc.colonist.sprite.isVisible = true;

    -- Play SOS so the player knows to get the colonist.
    gc.sfx.sosChannel = audio.play(gc.sfx.sos);

  end

end -- End processColonist().


-- ============================================================================
-- Handle fuel pod appearances.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:processFuelPod(inEvent)

  -- Only do work if there's no fuel pod currently on screen.
  if gc.fuelPod.sprite.isVisible == false then

    gc.fuelPod.framesSinceLastAppearance =
      gc.fuelPod.framesSinceLastAppearance + 1;

    -- Once the minimum number of frames has elapsed then we start deciding if
    -- we should show a new fuel pod.  There's a 5% chance with every frame
    -- inside the range, and if we hit the max then we automatically show it.
    if gc.fuelPod.framesSinceLastAppearance >=
      gc.fuelPod.appearanceRangeFrames.min
    then
      local num = math.random(1, 100);
      if num >= 95 or gc.fuelPod.framesSinceLastAppearance >=
        gc.fuelPod.appearanceRangeFrames.max
      then
        -- Reset for the next appearance.
        gc.fuelPod.framesSinceLastAppearance = 0;
        gc.showFuelPod();
      end
    end

  end

end -- End processFuelPod().


-- ============================================================================
-- Deal with the alien UFO, if any, or show one if it's time.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:processAlienUFO(inEvent)

  -- Only do work if there's no fuel pod currently on screen.
  if gc.alienUFO.sprite.isVisible == false then

    gc.alienUFO.framesSinceLastAppearance =
      gc.alienUFO.framesSinceLastAppearance + 1;

    -- Once the minimum number of frames has elapsed then we start deciding if
    -- we should show a new fuel pod.  There's a 5% chance with every frame
    -- inside the range, and if we hit the max then we automatically show it.
    if gc.alienUFO.framesSinceLastAppearance >=
      gc.alienUFO.appearanceRangeFrames.min
    then
      local num = math.random(1, 100);
      if num >= 95 or gc.alienUFO.framesSinceLastAppearance >=
        gc.alienUFO.appearanceRangeFrames.max
      then
        -- Reset for the next appearance.
        gc.alienUFO.framesSinceLastAppearance = 0;
        gc.showAlienUFO();
      end
    end

  end

end -- End processAlienUFO().


-- ============================================================================
-- Show a fuel pod at a random location.
-- ============================================================================
function gc:showFuelPod()

  utils:log("gameCoreMainLoop", "showFuelPod()");

  -- Randomly choose one of the appearance points.
  local whichTile = math.random(1, #gc.levelData[gameData.level][18]);
  local tileCoordinates = gc.levelData[gameData.level][18][whichTile];

  -- Place it and show it.
  gc.fuelPod.sprite.isVisible = true;
  gc.fuelPod.sprite.alpha = 1;
  gc.fuelPod.sprite.x = 32 * (tileCoordinates.x - 1);
  gc.fuelPod.sprite.y = (32 * (tileCoordinates.y - 1)) - 16;

  -- Start it rotating.
  gc.fuelPod.rotate();

  -- Start it fading out too.  When it's completely fade, hide it again so
  -- the main loop logic will begin counting down to another appearane.
  transition.to(gc.fuelPod.sprite, {
    time = 10000, alpha = 0,
    onComplete = function(inTarget)
      inTarget.isVisible = false;
      inTarget.x = -1000;
      inTarget.y = -1000;
    end
  });

end -- End showFuelPod().


-- ============================================================================
-- Show an alien UFO.
-- ============================================================================
function gc:showAlienUFO()

  utils:log("gameCoreMainLoop", "showAlienUFO()");

  -- Randomly choose one of the appearance points.
  local whichTile = math.random(1, #gc.levelData[gameData.level][19]);
  local tileCoordinates = gc.levelData[gameData.level][19][whichTile];

  -- Place it and show it.
  gc.alienUFO.sprite.isVisible = true;
  gc.alienUFO.sprite.y = 32 * tileCoordinates.y;

  -- Make sure it starts off-screen and figure out it's exit point X coordinate.
  if tileCoordinates.x == 1 then
    gc.alienUFO.sprite.x = 0 - gc.alienUFO.sprite.width;
    gc.alienUFO.exitPoint = display.contentWidth + gc.alienUFO.sprite.width;
  else
    gc.alienUFO.sprite.x = display.contentWidth + gc.alienUFO.sprite.width;
    gc.alienUFO.exitPoint = 0 - gc.alienUFO.sprite.width;
  end

  -- Randomly pick a point along its path where the alien UFO will fire.
  local firePoint = math.random(1, display.contentWidth);

  -- Now start it moving towards its exit point.
  gc.alienUFO.tween = transition.to(gc.alienUFO.sprite, {
    time = 3500, x = firePoint,
    onComplete = function()
      -- Fire a plasma ball at the ship.
      gc.plasmaBall.sprite.isVisible = true;
      gc.plasmaBall.sprite.x = gc.alienUFO.sprite.x;
      gc.plasmaBall.sprite.y = gc.alienUFO.sprite.y;
      gc.plasmaBall.tween = transition.to(
        gc.plasmaBall.sprite, {
          time = 3000, x = gc.ship.sprite.x, y = gc.ship.sprite.y,
          onComplete = function()
            gc.plasmaBall.sprite.isVisible = false;
            gc.plasmaBall.sprite.x = -1000;
            gc.plasmaBall.sprite.y = -1000;
          end
        }
      );
      -- Continue moving the alien UFO to its exit point.
      gc.alienUFO.tween = transition.to(gc.alienUFO.sprite, {
        time = 3500, x = gc.alienUFO.exitPoint,
        onComplete = function()
          gc.alienUFO.sprite.isVisible = false;
          gc.alienUFO.sprite.x = -1000;
          gc.alienUFO.sprite.y = -1000;
          gc.alienUFO.frameSinceLastAppearance = 0;
        end
      });
    end
  });

end -- End showAlienUFO().


-- ============================================================================
-- Show the popup when the player dies.
-- ============================================================================
function gc:showDeadPopup()

  if gc.popup == nil then

    -- Use a native alert.  Not as pretty as building one ourselves but this
    -- IS a learning exercise in a book after all!
    gc.popup = native.showAlert(
      "Oops", "You died. Tough luck!", { "Try Again", "Quit" },
      function(inEvent)
        gc.popup = nil;
        -- Cancelled will mean quit, since it has to mean SOMETHING.
        if inEvent.action == "cancelled" then
          storyboard.gotoScene("menuScene", "zoomOutIn", 500);
        else
          -- First button is index 1, which is Try Again.
          if inEvent.index == 1 then
            gc.resetLevel();
          else
            -- Otherwise, back to the menuScene we go.
            storyboard.gotoScene("menuScene", "zoomOutIn", 500);
          end
        end
      end
    );

  end

end -- End showDeadPopup().


-- ============================================================================
-- Show the popup when the player enters the bay.
-- ============================================================================
function gc:showEnteredBayPopup()

  if gc.popup == nil then

    -- Use a native alert.  Not as pretty as building one ourselves but this
    -- IS a learning exercise in a book after all!
    gameData.score = gameData.score + (gc.ship.colonistsOnboard * 100);

    -- If there's no next level then the game is over.
    if gc.levelData[gameData.level + 1] == nil then

      storyboard.gotoScene("endingScene", "zoomOutIn", 500);

    else

      -- Save our progress, bumping up the level first so they will continue
      -- the game on the next level.
      gameData.level = gameData.level + 1;
      saveGameData();

      gc.popup = native.showAlert(
        "Good work",
        gc.ship.colonistsOnboard .. " colonists rescued x 100 points =" ..
        gc.ship.colonistsOnboard * 100,
        { "Next Level", "Quit" },
        function(inEvent)
          gc.popup = nil;
          -- Cancelled will mean quit, since it has to mean SOMETHING.
          if inEvent.action == "cancelled" then
            storyboard.gotoScene("menuScene", "zoomOutIn", 500);
          else
            -- First button is index 1, which is Next Level.  We need to draw
            -- the new level (which clears out the old one) and reset all
            -- game state for the new level.
            if inEvent.index == 1 then
              gc.drawCurrentLevel();
              gc.resetLevel();
            else
              -- Otherwise, back to the menuScene we go.
              storyboard.gotoScene("menuScene", "zoomOutIn", 500);
            end
          end
        end
      );

    end

  end

end -- End showEnteredBayPopup().
