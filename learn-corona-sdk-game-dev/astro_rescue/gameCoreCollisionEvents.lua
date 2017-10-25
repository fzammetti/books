-- ============================================================================
-- Handle collision events during gameplay.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:collision(inEvent)

  -- All collisions involve the ship, so figure out what object it hit.
  local colObj = inEvent.object1.objName;
  if colObj == "ship" then
    colObj = inEvent.object2.objName;
  end

  -- No collision events when the game isn't currently in the flying phase
  -- UNLESS its with a "crash" object.  It may look a bit strange, but we have
  -- to do it this way to ensure that if the ship lands half on the pad and
  -- half off that we register it as an explosion (without checking for "crash"
  -- here we'll miss that case because when they land we're no longer in the
  -- flying phase, so the first half of this statement would cause us to not
  -- evaluate the rest of the logic and give the player a free pass basically).
  if gc.phase ~= gc.PHASE_FLYING and colObj ~= "crash" then
    return;
  end

  -- Handle the beginning of collision events only.
  if inEvent.phase == "began" then

    -- >>>>>>>>>> If collision is between the ship and anything that it can
    --            crash with (top-level tile, ship, alien UFO, plasma ball).
    if colObj == "crash" then

      utils:log("gameCoreCollisionEvents", "Crash");
      gc:showExplosion(gc.ship.sprite.x, gc.ship.sprite.y);

    -- >>>>>>>>>> If they land on a pad, make sure their velocity is below the
    -- crash threshold, otherwise mark them as landed.
    elseif colObj == "pad" then

      utils:log("gameCoreCollisionEvents", "Pad contact");
      local vX, vY = gc.ship.sprite:getLinearVelocity();
      if vX > 75 or vY > 75 then
        -- Moving too fast, blow them up.
        utils:log(
          "gameCoreCollisionEvents",
          "Pad crash (Too fast: vX(75)=" .. vX .. ", vY(75)=" .. vY .. ")"
        );
        gc:showExplosion(gc.ship.sprite.x, gc.ship.sprite.y);
      else
        -- Velocity is good, we're down!
        utils:log("gameCoreCollisionEvents", "Safely landed");
        gc.ship.sprite:setSequence("noThrust");
        gc.ship.sprite:play();
        gc.ship.thrustVertical = false;
        gc.ship.thrustLeft = false;
        gc.ship.thrustRight = false;
        gc.phase = gc.PHASE_LANDED;
      end

    -- >>>>>>>>>> Entered the landing bay.
    elseif colObj == "bay" then

      utils:log("gameCoreCollisionEvents", "Entered landing bay");
      -- Then transition to the new phase.
      gc:stopAllActivity();
      gc.phase = gc.PHASE_IN_BAY;

    -- >>>>>>>>>> Oops, hit the colonist!
    elseif colObj == "colonist" and gc.colonist.sprite.isVisible == true then

      gc.sfx.screamChannel = audio.play(gc.sfx.scream);

      -- Remove the colonist and reset for the next appearance.  Oh yeah, and
      -- subtract from the score.
      gameData.score = gameData.score - 50;
      if gameData.score < 0 then
        gameData.score = 0;
      end
      gc.colonist.sprite.isVisible = false;
      gc.colonist.appearCounter = 0;

    -- >>>>>>>>>> Gasing up.
    elseif colObj == "fuelPod" then

      gc.sfx.fuelPodPickupChannel = audio.play(gc.sfx.fuelPodPickup);
      gc:showMessage("Got Some Fuel");

      -- Hide fuel pod.
      gc.fuelPod.sprite.isVisible = false;
      gc.fuelPod.sprite.x = -1000;
      gc.fuelPod.sprite.y = -1000;

      -- Add some gas.
      gc.ship.fuel = gc.ship.fuel + 50;
      if gc.ship.fuel > gc.fuelGauge.fill.width then
        gc.ship.fuel = gc.ship.maxFuel;
      end
      gc.updateFuelGauge();

    end

  end -- End began.

end -- End touch().


-- ============================================================================
-- Shows an explosion at a specific location and then calls a callback
-- function when the animation completes.
--
-- @param inX        X location of center of explosion.
-- @param inY        Y location of center of explosion.
-- @param inCallback Function to call when explosion animation completes.
-- ============================================================================
function gc:showExplosion(inX, inY, inCallback)

  utils:log("gameCoreCollisionEvents", "showExplosion()");

  -- First, stop all current game activity.
  gc.stopAllActivity();

  -- Set the appropriate phase.
  gc.phase = gc.EXPLODING;

  -- Vibrate, if the device supports it.
  system.vibrate();

  -- Show the explosion and set up to call the specific callback function when
  -- it completes.
  gc.explosion.sprite.isVisible = true;
  gc.explosion.sprite.x = inX;
  gc.explosion.sprite.y = inY;
  gc.explosion.sprite:setSequence("exploding");
  gc.explosion.sprite:play();
  gc.explosion.callback = inCallback;
  gc.explosion.sprite:addEventListener("sprite",
    function(inEvent)
      if inEvent.target.sequence == "exploding" and
        inEvent.phase == "ended"
      then
        gc.explosion.sprite.isVisible = false;
        gc.phase = gc.PHASE_DEAD;
      end
    end
  );

  -- Also play our explosion sound.
  gc.sfx.explosionChannel = audio.play(gc.sfx.explosion);

end -- End showExplosion().


-- ============================================================================
-- Updates the fuel gauge to reflect the current amount of ship fuel.
-- ============================================================================
function gc:updateFuelGauge()

  -- Get rid of the old fill.
  if gc.fuelGauge.fill ~= nil then
    gc.fuelGauge.fill:removeSelf();
    gc.fuelGauge.fill = nil;
  end

  -- Create a new fill if they have some gas left.
  if gc.ship.fuel > 0 then
    gc.fuelGauge.fill = display.newRect(
      (gc.fuelGauge.shell.x - (gc.fuelGauge.shell.width / 2)) + 3,
      (gc.fuelGauge.shell.y - (gc.fuelGauge.shell.height / 2)) + 3,
      gc.ship.fuel, gc.fuelGauge.shell.height - 5
    );
    gc.fuelGauge.fill:setFillColor(255, 0, 0);
    gc.gameDG:insert(gc.fuelGauge.fill);
  end

end -- End updateFuelGauge().
