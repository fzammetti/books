-- Create a scene object to tie functions to.
local scene = storyboard.newScene();


-- Our ending music.
local endingMusic;

-- Our captured full-screen image.
local capturedImage;


-- ============================================================================
-- Called when the scene's view does not exist.
-- ============================================================================
function scene:createScene(inEvent)

  utils:log("endingScene", "createScene()");

  -- Music.
  endingMusic = audio.loadStream(utils:getAudioFilename("endingMusic"));
  audio.play(endingMusic, { channel = 2, loops =- 1, fadein = 500 });

  -- Background gradient.
  local bgGradient = display.newRect(
    self.view, 0, 0, display.contentWidth, display.contentHeight
  );
  bgGradient:setFillColor(
    graphics.newGradient( { 255, 0, 0 }, { 0, 0, 0 } )
  );

  -- Thank you.
  local txt1 = display.newText(
    self.view, "Thanks for playing!", 0, 0, native.systemFontBold, 72
  );
  txt1:setReferencePoint(display.CenterReferencePoint);
  txt1.x = display.contentCenterX;
  txt1.y = display.contentCenterY - 50;
  txt1:setTextColor(
    graphics.newGradient( { 255, 255, 255 }, { 255, 255, 0 } )
  );

  -- Final score.
  local txt2 = display.newText(
    self.view, "Final Score: " .. gameData.score, 0, 0,
    native.systemFontBold, 72
  );
  txt2:setReferencePoint(display.CenterReferencePoint);
  txt2.x = display.contentCenterX;
  txt2.y = display.contentCenterY + 50;
  txt2:setTextColor(
    graphics.newGradient( { 255, 255, 255 }, { 255, 255, 0 } )
  );

  -- With that out of the way, let's clear our saved game so they're starting
  -- from scratch next time.
  clearGameData();

  -- Capture the completed screen now.
  capturedImage = display.captureScreen();
  self.view:insert(capturedImage);

  -- Now remove all graphics we just created.
  bgGradient:removeSelf();
  bgGradient = nil;
  txt1:removeSelf();
  txt1 = nil;
  txt2:removeSelf();
  txt2 = nil;

  -- Center the captured graphic.  This effectively makes it look just like
  -- we drew all the resources separately (which we of course did to begin
  -- with!) but now it's all one giant DisplayObject.
  capturedImage.x = display.contentCenterX;
  capturedImage.y = display.contentCenterY;

  -- Create a mask over the remaining DisplayObject and start it offset to
  -- the left.  Also set up some variables we need for our animation.
  capturedImage:setMask(graphics.newMask("circlemask.png"));
  capturedImage.maskDir = 1;
  capturedImage.maskXNext = (display.contentWidth / 3);
  capturedImage.maskXDir = 1;
  capturedImage.maskScaleX = 4;
  capturedImage.maskScaleY = 4;

  -- The function called to do animation.  It simply bounces the mask left and
  -- right to give us something of a "spotlight" effect.
  capturedImage.transition = function()
    capturedImage.tween = transition.to(capturedImage, {
      time = 2000, maskX = capturedImage.maskXNext,
      transition = easing.inOutQuad,
      onComplete = function()
        if capturedImage.maskXDir == 1 then
          capturedImage.maskXDir = 2;
          capturedImage.maskXNext = -(display.contentWidth / 3);
          capturedImage.transition();
        else
          capturedImage.maskXDir = 1;
          capturedImage.maskXNext = (display.contentWidth / 3);
          capturedImage.transition();
        end
      end
    });
  end;

  -- Start the animation.  We could do this from enterScene, but it looks a
  -- little better if it's started here before the scene transition happens.
  capturedImage.transition();

end -- End createScene().


-- ============================================================================
-- Called BEFORE scene has moved on screen.
-- ============================================================================
function scene:willEnterScene(inEvent)

  utils:log("endingScene", "willEnterScene()");

end -- End willEnterScene().


-- ============================================================================
-- Called AFTER scene has moved on screen.
-- ============================================================================
function scene:enterScene(inEvent)

  utils:log("endingScene", "enterScene()");

  -- Add event listener (not tied to a specific object).
  Runtime:addEventListener("touch", scene);

end -- End enterScene().


-- ============================================================================
-- Called BEFORE scene moves off screen.
-- ============================================================================
function scene:exitScene(inEvent)

  utils:log("endingScene", "exitScene()");

  -- Remove event listener (not tied to a specific object).
  Runtime:removeEventListener("touch", scene);

  -- Stop music.
  audio.stop(2);

  -- Stop our spotlight tween too.
  transition.cancel(capturedImage.tween);

end -- End exitScene().


-- ============================================================================
-- Called AFTER scene has moved off screen.
-- ============================================================================
function scene:didExitScene(inEvent)

  utils:log("endingScene", "didExitScene()");

end -- End didExitScene().


-- ============================================================================
-- Called prior to the removal of scene's "view" (display group).
-- ============================================================================
function scene:destroyScene(inEvent)

  utils:log("endingScene", "destroyScene()");

  -- Clean up audio resources (the music).
  audio.dispose(endingMusic);
  endingMusic = nil;

  -- Clean up graphics.
  capturedImage:removeSelf();
  capturedImage = nil;

end -- End destroyScene().


-- ============================================================================
-- Handle touch events for this scene.
-- ============================================================================
function scene:touch(inEvent)

  utils:log("endingScene", "touch()");

  -- Only trigger when a finger is lifted.
  if inEvent.phase == "ended" then
    utils:log("endingScene", "Going to menuScene");
    storyboard.gotoScene("menuScene", "zoomOutIn", 500);
  end

  return true;

end -- End touch().


-- ****************************************************************************
-- ****************************************************************************
-- **********                 EXECUTION BEGINS HERE.                 **********
-- ****************************************************************************
-- ****************************************************************************


utils:log("endingScene", "Beginning execution");

-- Add scene lifecycle event handlers.
scene:addEventListener("createScene", scene);
scene:addEventListener("willEnterScene", scene);
scene:addEventListener("enterScene", scene);
scene:addEventListener("exitScene", scene);
scene:addEventListener("didExitScene", scene);
scene:addEventListener("destroyScene", scene);

return scene;
