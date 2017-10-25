-- Create a scene object to tie functions to.
local scene = storyboard.newScene();

-- Load widget library and set theme.
local widget = require("widget");
widget.setTheme("theme_ios");


-- ============================================================================
-- Called when the scene's view does not exist.
-- ============================================================================
function scene:createScene(inEvent)

  utils:log("settingsScene", "createScene()");

  -- Title.
  local txtTitle = display.newText("Settings", 0, 0, native.systemFont, 72);
  txtTitle.x = display.contentCenterX;
  txtTitle.y = 50;
  self.view:insert(txtTitle);

  -- Accelerometer control label.
  local txtAccelerometerControl = display.newText(
    "Accelerometer Control", 0, 0, native.systemFont, 48
  );
  txtAccelerometerControl:setReferencePoint(display.TopLeftReferencePoint);
  txtAccelerometerControl.x = 30;
  txtAccelerometerControl.y = display.contentCenterY - 20;
  self.view:insert(txtAccelerometerControl);

  -- Accelerometer control switch.
  local wgtAccelerometerControl = widget.newSwitch{
    left = display.contentWidth - 140, top = display.contentCenterY - 10,
    initialSwitchState = usingAccelerometer,
    onPress = function(inEvent)
      usingAccelerometer = inEvent.target.isOn;
    end
  };
  wgtAccelerometerControl:scale(2, 2);
  wgtAccelerometerControl:setReferencePoint(display.TopLeftReferencePoint);
  self.view:insert(wgtAccelerometerControl);

  -- Button to go back to main menu.
  self.view:insert(widget.newButton{
    left = display.contentCenterX - 120, top = display.contentHeight - 65,
    label = "Back To Main Menu", fontSize = 24,
    width = 260, height = 60, cornerRadius = 8,
    onEvent = function()
      utils:log("settingsScene", "Back To Main Menu tapped");
      storyboard.gotoScene("menuScene", "crossFade", 500);
    end
  });

end -- End createScene().


-- ============================================================================
-- Called BEFORE scene has moved on screen.
-- ============================================================================
function scene:willEnterScene(inEvent)

  utils:log("settingsScene", "willEnterScene()");

end -- End willEnterScene().


-- ============================================================================
-- Called AFTER scene has moved on screen.
-- ============================================================================
function scene:enterScene(inEvent)

  utils:log("settingsScene", "enterScene()");

end -- End enterScene().


-- ============================================================================
-- Called BEFORE scene moves off screen.
-- ============================================================================
function scene:exitScene(inEvent)

  utils:log("settingsScene", "exitScene()");

end -- End exitScene().


-- ============================================================================
-- Called AFTER scene has moved off screen.
-- ============================================================================
function scene:didExitScene(inEvent)

  utils:log("settingsScene", "didExitScene()");

end -- End didExitScene().


-- ============================================================================
-- Called prior to the removal of scene's "view" (display group).
-- ============================================================================
function scene:destroyScene(inEvent)

  utils:log("settingsScene", "destroyScene()");

end -- End destroyScene().


-- ****************************************************************************
-- ****************************************************************************
-- **********                 EXECUTION BEGINS HERE.                 **********
-- ****************************************************************************
-- ****************************************************************************


utils:log("settingsScene", "Beginning execution");

-- Add scene lifecycle event handlers.
scene:addEventListener("createScene", scene);
scene:addEventListener("willEnterScene", scene);
scene:addEventListener("enterScene", scene);
scene:addEventListener("exitScene", scene);
scene:addEventListener("didExitScene", scene);
scene:addEventListener("destroyScene", scene);

return scene;
