-- Our core game code.  It's good to decouple it from the scene code.  Note
-- that the gameCore object has to be defined by requiring gameCore first
-- since the others build on it.  Exactly how you break this up into separate
-- files is totally up to you.
gc = require("gameCore");
require("gameCoreInputEvents");
require("gameCoreCollisionEvents");
require("gameCoreMainLoop");

-- Create a scene object to tie functions to.
local scene = storyboard.newScene();


-- Bring in the physics engine.
physics = require("physics");
shapeDefs = require("shapeDefs").physicsData(1.0);


-- ============================================================================
-- Called when the scene's view does not exist.
-- ============================================================================
function scene:createScene(inEvent)

  utils:log("gameScene", "createScene()");

  -- Initialize the core game code.
  gc:init(self.view);

end -- End createScene().


-- ============================================================================
-- Called BEFORE scene has moved on screen.
-- ============================================================================
function scene:willEnterScene(inEvent)

  utils:log("gameScene", "willEnterScene()");

end -- End willEnterScene().


-- ============================================================================
-- Called AFTER scene has moved on screen.
-- ============================================================================
function scene:enterScene(inEvent)

  utils:log("gameScene", "enterScene()");

  -- Start the game running.
  gc:start();

end -- End enterScene().


-- ============================================================================
-- Called BEFORE scene moves off screen.
-- ============================================================================
function scene:exitScene(inEvent)

  utils:log("gameScene", "exitScene()");

  -- Stop the game running.
  gc:stop();

end -- End exitScene().


-- ============================================================================
-- Called AFTER scene has moved off screen.
-- ============================================================================
function scene:didExitScene(inEvent)

  utils:log("gameScene", "didExitScene()");

end -- End didExitScene().


-- ============================================================================
-- Called prior to the removal of scene's "view" (display group).
-- ============================================================================
function scene:destroyScene(inEvent)

  utils:log("gameScene", "destroyScene()");

  -- Give the core game code a chance to do any cleanup it needs to do.
  gc:destroy();

end -- End destroyScene().


-- ****************************************************************************
-- ****************************************************************************
-- **********                 EXECUTION BEGINS HERE.                 **********
-- ****************************************************************************
-- ****************************************************************************


utils:log("gameScene", "Beginning execution");

-- Add scene lifecycle event handlers.
scene:addEventListener("createScene", scene);
scene:addEventListener("willEnterScene", scene);
scene:addEventListener("enterScene", scene);
scene:addEventListener("exitScene", scene);
scene:addEventListener("didExitScene", scene);
scene:addEventListener("destroyScene", scene);

return scene;
