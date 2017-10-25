-- ============================================================================
-- Handle touch events during gameplay.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:touch(inEvent)

  -- Don't do anything unless we're currently flying or landed.
  if gc.phase ~= gc.PHASE_FLYING and gc.phase ~= gc.PHASE_LANDED then
    return;
  end

  if inEvent.phase == "began" then

    -- If one of our control elements is touched then start thrust in
    -- that direction, but only if there's fuel left.  Also note handling for
    -- when using accelerometer control (no target).
    if (inEvent.target == nil or inEvent.target.controlName == "vertical") and
      gc.ship.fuel > 0
    then

      gc.ship.thrustVertical = true;
      gc.sfx.thrustersChannel = audio.play(gc.sfx.thrusters, { loops = -1 });

      -- Also, make sure if they're currently landed we restart the physics
      -- engine and flip the landed flag.
      if gc.phase == gc.PHASE_LANDED then
        gc.phase = gc.PHASE_FLYING;
      end

    -- For left thrust, don't do it if the ship is landed.
    elseif inEvent.target.controlName == "left" and gc.ship.fuel > 0 and
      gc.phase ~= gc.PHASE_LANDED then

      gc.ship.thrustLeft = true;
      gc.sfx.thrustersChannel = audio.play(gc.sfx.thrusters, { loops = -1 });

    -- For right thrust, don't do it if the ship is landed.
    elseif inEvent.target.controlName == "right" and gc.ship.fuel > 0 and
      gc.phase ~= gc.PHASE_LANDED then

      gc.ship.thrustRight = true;
      gc.sfx.thrustersChannel = audio.play(gc.sfx.thrusters, { loops = -1 });

    end

  elseif inEvent.phase == "ended" then

    -- If one of our control elements is stops being touched then stop
    -- thrust in that direction.  Also note handling for
    -- when using accelerometer control (no target).
    if inEvent.target == nil or inEvent.target.controlName == "vertical" then
      gc.ship.thrustVertical = false;
    elseif inEvent.target.controlName == "left" then
      gc.ship.thrustLeft = false;
    elseif inEvent.target.controlName == "right" then
      gc.ship.thrustRight = false;
    end
    if gc.ship.thrustVertical == false and gc.ship.thrustLeft == false and
      gc.ship.thrustRight == false
    then
      audio.stop(gc.sfx.thrustersChannel);
    end

  end

  -- Enable the correct thrust animation on the ship.
  local tV = gc.ship.thrustVertical;
  local tL = gc.ship.thrustLeft;
  local tR = gc.ship.thrustRight;
  if tV == true and tL == false and tR == false then
    gc.ship.sprite:setSequence("thrustUp");
    gc.ship.sprite:play();
  elseif tV == false and tL == true and tR == false then
    gc.ship.sprite:setSequence("thrustRight");
    gc.ship.sprite:play();
  elseif tV == false and tL == false and tR == true then
    gc.ship.sprite:setSequence("thrustLeft");
    gc.ship.sprite:play();
  elseif tV == true and tL == true and tR == false then
    gc.ship.sprite:setSequence("thrustUpRight");
    gc.ship.sprite:play();
  elseif tV == true and tL == false and tR == true then
    gc.ship.sprite:setSequence("thrustUpLeft");
    gc.ship.sprite:play();
  else
    gc.ship.sprite:setSequence("noThrust");
    gc.ship.sprite:play();
  end

end -- End touch().


-- ============================================================================
-- Handle accelerometer events.
--
-- @param inEvent The event object describing the event.
-- ============================================================================
function gc:accelerometer(inEvent)

  -- Don't do anything unless we're currently flying (i.e., game is ongoing).
  if gc.phase ~= gc.PHASE_FLYING then
    return;
  end

  -- Check yGravity to determine if we should thrust.  Remember, we're in
  -- landscape mode so it's y we need to check, not x!
  if gc.ship.fuel > 0 and gc.phase ~= gc.PHASE_LANDED then
    if inEvent.yGravity > .4 then
      gc.ship.thrustLeft = true;
      gc.ship.thrustRight = false;
      gc.sfx.thrustersChannel = audio.play(gc.sfx.thrusters, { loops = -1 });
    elseif inEvent.yGravity < -.4 then
      gc.ship.thrustLeft = false;
      gc.ship.thrustRight = true;
      gc.sfx.thrustersChannel = audio.play(gc.sfx.thrusters, { loops = -1 });
    else
      gc.ship.thrustLeft = false;
      gc.ship.thrustRight = false;
      audio.stop(gc.sfx.thrustersChannel);
    end
  end

end -- End accelerometer().
