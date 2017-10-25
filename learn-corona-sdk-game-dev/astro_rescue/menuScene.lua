-- Create a scene object to tie functions to.
local scene = storyboard.newScene();


-- ============================================================================
-- Called when the scene's view does not exist.
-- ============================================================================
function scene:createScene(inEvent)

  utils:log("menuScene", "createScene()");

  self.buildShapes();

  -- If music isn't currently playing then load and play it now.  This only
  -- happens when exiting out of the game.
  if audio.isChannelPlaying(1) == false then
    audio.rewind(titleMusic);
    audio.play(titleMusic, { channel = 1, loops =- 1 });
  end

  -- Create New Game text, center it and attached event handler.
  local txtStartGame =
    display.newText("New Game", 0, 0, native.systemFont, 52);
  txtStartGame.x = display.contentCenterX;
  txtStartGame.y = display.contentCenterY - 170;
  txtStartGame:addEventListener("touch",
    function(inEvent)
      if inEvent.phase == "ended" then
        -- Reset game data for a new game.
        clearGameData();
        -- Deal with title music and transition to gameScene.
        audio.stop(1);
        utils:log("menuScene", "Start Game tapped");
        storyboard.gotoScene("gameScene", "zoomOutIn", 500);
      end
    end
  );
  self.view:insert(txtStartGame);

  -- Create Continue Game text, center it and attached event handler.
  local txtContinueGame =
    display.newText("Continue Game", 0, 0, native.systemFont, 52);
  txtContinueGame.x = display.contentCenterX;
  txtContinueGame.y = display.contentCenterY - 55;
  txtContinueGame:addEventListener("touch",
    function(inEvent)
      if inEvent.phase == "ended" then
        -- Load game data, deal with title music and transition to gameScene.
        loadGameData();
        audio.stop(1);
        utils:log("menuScene", "Continue Game tapped");
        storyboard.gotoScene("gameScene", "zoomOutIn", 500);
      end
    end
  );
  self.view:insert(txtContinueGame);

  -- Create Settings text, center it and attached event handler.
  local txtSettings = display.newText("Settings", 0, 0, native.systemFont, 52);
  txtSettings.x = display.contentCenterX;
  txtSettings.y = display.contentCenterY + 55;
  txtSettings:addEventListener("touch",
    function(inEvent)
      if inEvent.phase == "ended" then
        utils:log("menuScene", "Settings tapped");
        storyboard.gotoScene("settingsScene", "crossFade", 500);
      end
    end
  );
  self.view:insert(txtSettings);

  -- Create Quit text, center it and attached event handler.
  local txtQuit = display.newText("Quit", 0, 0, native.systemFont, 52);
  txtQuit.x = display.contentCenterX;
  txtQuit.y = display.contentCenterY + 170;
  txtQuit:addEventListener("touch",
    function(inEvent)
      if inEvent.phase == "ended" then
        utils:log("menuScene", "Quit tapped");
        audio.fadeOut({ channel = 1, time = 500 } )
        transition.to(scene.view, { alpha = 0, time = 500,
          onComplete = function()
            os.exit();
          end
        });
      end
    end
  );
  self.view:insert(txtQuit);

end -- End createScene().


-- ============================================================================
-- Called BEFORE scene has moved on screen.
-- ============================================================================
function scene:willEnterScene(inEvent)

  utils:log("menuScene", "willEnterScene()");

end -- End willEnterScene().


-- ============================================================================
-- Called AFTER scene has moved on screen.
-- ============================================================================
function scene:enterScene(inEvent)

  utils:log("menuScene", "enterScene()");

end -- End enterScene().


-- ============================================================================
-- Called BEFORE scene moves off screen.
-- ============================================================================
function scene:exitScene(inEvent)

  utils:log("menuScene", "exitScene()");

end -- End exitScene().


-- ============================================================================
-- Called AFTER scene has moved off screen.
-- ============================================================================
function scene:didExitScene(inEvent)

  utils:log("menuScene", "didExitScene()");

end -- End didExitScene().


-- ============================================================================
-- Called prior to the removal of scene's "view" (display group).
-- ============================================================================
function scene:destroyScene(inEvent)

  utils:log("menuScene", "destroyScene()");

end -- End destroyScene().


-- ============================================================================
-- A function that builds up a series of background shapes and starts them
-- rotating.
-- ============================================================================
function scene:buildShapes()

  -- Construct some shapes with mostly random properties.
  for i = 1, 10 do

    local shape = scene.createShape();
    shape.xScale = math.random(1, 3);
    shape.yScale = shape.xScale;
    shape:setReferencePoint(display.CenterReferencePoint);
    shape.x = math.random(display.contentWidth);
    shape.y = math.random(display.contentHeight);
    shape.rotation = math.random(1, 360);
    if math.random(1, 2) == 1 then
      shape.rotateClockwise = true;
    else
      shape.rotateClockwise = false;
    end

    -- This is the function that will produce rotation.
    shape.rotateTransition = function(inShape)
      if inShape.rotateClockwise then
        transition.to(inShape, {
          time = 3000, delta = true, rotation = 360,
          onComplete = inShape.rotateTransition
        });
      else
        transition.to(inShape, {
          time = 3000, delta = true, rotation = -360,
          onComplete = inShape.rotateTransition
        });
      end
    end;

    -- Now start the new shape rotating.
    shape.rotateTransition(shape);

    -- Finally, insert the shape into the view's group.
    scene.view:insert(shape);

  end

end -- End buildShapes().


-- ============================================================================
-- A function that builds a single shape of some random kind.
--
-- @return A DisplayObject.
-- ============================================================================
function scene:createShape()

  local whatShape = math.random(1, 6);
  local shape;

  if whatShape == 1 then
    -- A line.
    shape = display.newLine(0,0, 75,0);
    shape.width = math.random(1, 6);
    shape:setColor(
      math.random(25, 200), math.random(25, 200), math.random(25, 200)
    );
  elseif whatShape == 2 then
    -- A star.
    shape = display.newLine(0,-110, 27,-35);
    shape:append(
      105,-35, 43,16, 65,90, 0,45, -65,90, -43,15, -105,-35, -27,-35, 0,-110
    );
    shape.width = math.random(1, 6);
    shape:setColor(
      math.random(25, 200), math.random(25, 200), math.random(25, 200)
    );
  elseif whatShape == 3 then
    -- A rectangle.
    shape = display.newRect(0,0, 150,100);
    shape.strokeWidth = math.random(1, 6);
    shape:setStrokeColor(
      math.random(25, 200), math.random(25, 200), math.random(25, 200)
    );
    shape:setFillColor(0, 0, 0, 0);
  elseif whatShape == 4 then
    -- A square.
    shape = display.newRect(0,0, 75,75);
    shape.strokeWidth = math.random(1, 6);
    shape:setStrokeColor(
      math.random(25, 200), math.random(25, 200), math.random(25, 200)
    );
    shape:setFillColor(0, 0, 0, 0);
  elseif whatShape == 5 then
    -- A rounded rectangle.
    shape = display.newRoundedRect(0,0, 150,100, 50);
    shape.strokeWidth = math.random(1, 6);
    shape:setStrokeColor(
      math.random(25, 200), math.random(25, 200), math.random(25, 200)
    );
    shape:setFillColor(0, 0, 0, 0);
  elseif whatShape == 6 then
    -- A triangle.
    shape = display.newLine(100,100, 200,100);
    shape:append(150,40, 100,100);
    shape.width = math.random(2, 6);
    shape:setColor(
      math.random(25, 200), math.random(25, 200), math.random(25, 200)
    );
  end

	return shape;

end -- End createShape class.


-- ****************************************************************************
-- ****************************************************************************
-- **********                 EXECUTION BEGINS HERE.                 **********
-- ****************************************************************************
-- ****************************************************************************


utils:log("menuScene", "Beginning execution");

-- Add scene lifecycle event handlers.
scene:addEventListener("createScene", scene);
scene:addEventListener("willEnterScene", scene);
scene:addEventListener("enterScene", scene);
scene:addEventListener("exitScene", scene);
scene:addEventListener("didExitScene", scene);
scene:addEventListener("destroyScene", scene);

return scene;
