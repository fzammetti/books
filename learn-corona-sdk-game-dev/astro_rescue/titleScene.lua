-- Create a scene object to tie functions to.
local scene = storyboard.newScene();


-- Background images and rotation value.
local bg1;
local bg2;
local rot = 0;


-- ============================================================================
-- Called when the scene's view does not exist.
-- ============================================================================
function scene:createScene(inEvent)

  utils:log("titleScene", "createScene()");

  -- Load and start playing our title music.
  titleMusic = audio.loadStream(utils:getAudioFilename("titleMusic"));
  audio.play(titleMusic, { channel = 1, loops =- 1, fadein = 500 });

  -- Background images.
  bg1 = display.newImage("titleBackground.png", true);
  bg1.x = display.contentWidth / 2;
  bg1.y = display.contentHeight / 2;
  bg1.xScale = 2;
  bg1.yScale = 2;
  self.view:insert(bg1);
  bg2 = display.newImage("titleBackground.png", true);
  bg2.x = display.contentWidth / 2;
  bg2.y = display.contentHeight / 2;
  bg2.xScale = 2;
  bg2.yScale = 2;
  bg2.alpha = .5;
  self.view:insert(bg2);

  -- Load and display title header graphic centered on the screen.
  local gfxTitleHeader = display.newImage("titleHeader.png", true);
  gfxTitleHeader.x = display.contentCenterX;
  gfxTitleHeader.y = display.contentCenterY;
  self.view:insert(gfxTitleHeader);

end -- End createScene().


-- ============================================================================
-- Called BEFORE scene has moved on screen.
-- ============================================================================
function scene:willEnterScene(inEvent)

  utils:log("titleScene", "willEnterScene()");

end -- End willEnterScene().


-- ============================================================================
-- Called AFTER scene has moved on screen.
-- ============================================================================
function scene:enterScene(inEvent)

  utils:log("titleScene", "enterScene()");

  -- Add event listener (not tied to a specific object).
  Runtime:addEventListener("touch", scene);

  -- Add event listener for doing the background animation.
  Runtime:addEventListener("enterFrame", scene);

end -- End enterScene().


-- ============================================================================
-- Called BEFORE scene moves off screen.
-- ============================================================================
function scene:exitScene(inEvent)

  utils:log("titleScene", "exitScene()");

  -- Remove event listener (not tied to a specific object).
  Runtime:removeEventListener("touch", scene);

  -- Remove event listener for doing the background animation.
  Runtime:removeEventListener("enterFrame", scene);

end -- End exitScene().


-- ============================================================================
-- Called AFTER scene has moved off screen.
-- ============================================================================
function scene:didExitScene(inEvent)

  utils:log("titleScene", "didExitScene()");

end -- End didExitScene().


-- ============================================================================
-- Called prior to the removal of scene's "view" (display group).
-- ============================================================================
function scene:destroyScene(inEvent)

  utils:log("titleScene", "destroyScene()");

  -- Clear up after ourselves.
  bg1:removeSelf();
  bg1 = nil;
  bg2:removeSelf();
  bg2 = nil;

end -- End destroyScene().


-- ============================================================================
-- Handle touch events for this scene.
-- ============================================================================
function scene:touch(inEvent)

  utils:log("titleScene", "touch()");

  -- Only trigger when a finger is lifted.
  if inEvent.phase == "ended" then
    utils:log("titleScene", "Going to menuScene");
    storyboard.gotoScene("menuScene", "crossFade", 500);
  end

  return true;

end -- End touch().


-- ============================================================================
-- enterFrame event processing.
-- ============================================================================
function scene:enterFrame(inEvent)

  bg1.rotation = rot;
  bg2.rotation = -rot;
  rot = rot + 1;
  if rot == 359 then
    rot = 0;
  end

end -- End enterFrame().


-- ****************************************************************************
-- ****************************************************************************
-- **********                 EXECUTION BEGINS HERE.                 **********
-- ****************************************************************************
-- ****************************************************************************


utils:log("titleScene", "Beginning execution");

-- Add scene lifecycle event handlers.
scene:addEventListener("createScene", scene);
scene:addEventListener("willEnterScene", scene);
scene:addEventListener("enterScene", scene);
scene:addEventListener("exitScene", scene);
scene:addEventListener("didExitScene", scene);
scene:addEventListener("destroyScene", scene);

return scene;
