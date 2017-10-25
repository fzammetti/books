/**
 * ======================================================================
 * Draw the console.
 * ======================================================================
 */
function drawConsole() {

  // These are the parts of the game console that do not need to be redrawn
  // with each frame.
  blit(consoleImages["imgGameFrame"], 0, 0);
  blit(consoleImages["imgConsoleLeft"], 0, 240);
  blit(consoleImages["imgConsoleMiddle"], 108, 240);
  blit(consoleImages["imgConsoleRight"], 215, 240);

} // End drawConsole().


/**
 * ======================================================================
 * Update the console lights.
 * ======================================================================
 */
function updateLights() {

  // Every half a second we are going to light some lights and restore others
  gameState.lightChangeCounter++;

  if (gameState.lightChangeCounter > 12) {

    gameState.lightChangeCounter = 0;

    // Hide the frame and lights so we start fresh.
    consoleImages["imgGameFrame"].style.display = "none";
    consoleImages["imgGameFrameLeftLight1"].style.display = "none";
    consoleImages["imgGameFrameLeftLight2"].style.display = "none";
    consoleImages["imgGameFrameLeftLight3"].style.display = "none";
    consoleImages["imgGameFrameLeftLight4"].style.display = "none";
    consoleImages["imgGameFrameLeftLight5"].style.display = "none";
    consoleImages["imgGameFrameRightLight1"].style.display = "none";
    consoleImages["imgGameFrameRightLight2"].style.display = "none";
    consoleImages["imgGameFrameRightLight3"].style.display = "none";
    consoleImages["imgGameFrameRightLight4"].style.display = "none";
    consoleImages["imgGameFrameRightLight5"].style.display = "none";

    // Draw mini-game area frame
    blit(consoleImages["imgGameFrame"], 0, 0);

    // Turn each light on or off randomly.
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameLeftLight1"], 0, 22);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameLeftLight2"], 0, 64);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameLeftLight3"], 0, 107);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameLeftLight4"], 0, 150);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameLeftLight5"], 0, 193);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameRightLight1"], 220, 20);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameRightLight2"], 220, 62);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameRightLight3"], 220, 107);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameRightLight4"], 220, 150);
    }
    if (jscript.math.genRandomNumber(0, 1) == 1) {
      blit(consoleImages["imgGameFrameRightLight5"], 220, 193);
    }
  }

} // End updateLights().


/**
 * ======================================================================
 * Update the hands.
 * ======================================================================
 */
function updateHands() {

  // Clear all images to prepare for proper display.
  consoleImages["imgLeftHandUp"].style.display = "none";
  consoleImages["imgLeftHandDown"].style.display = "none";
  consoleImages["imgLeftHandLeft"].style.display = "none";
  consoleImages["imgLeftHandRight"].style.display = "none";
  consoleImages["imgLeftHandUL"].style.display = "none";
  consoleImages["imgLeftHandUR"].style.display = "none";
  consoleImages["imgLeftHandDL"].style.display = "none";
  consoleImages["imgLeftHandDR"].style.display = "none";
  consoleImages["imgRightHandDown"].style.display = "none";

  // Display appropriate left-hand image.
  if (gameState.playerDirectionUp && !gameState.playerDirectionDown &&
    !gameState.playerDirectionLeft && !gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandUp"], 29, 240);
  } else if (!gameState.playerDirectionUp && gameState.playerDirectionDown &&
    !gameState.playerDirectionLeft && !gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandDown"], 29, 240);
  } else if (!gameState.playerDirectionUp && !gameState.playerDirectionDown &&
    gameState.playerDirectionLeft && !gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandLeft"], 29, 240);
  } else if (!gameState.playerDirectionUp && !gameState.playerDirectionDown &&
    !gameState.playerDirectionLeft && gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandRight"], 29, 240);
  } else if (gameState.playerDirectionUp && !gameState.playerDirectionDown &&
    gameState.playerDirectionLeft && !gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandUL"], 29, 240);
  } else if (gameState.playerDirectionUp && !gameState.playerDirectionDown &&
    !gameState.playerDirectionLeft && gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandUR"], 29, 240);
  } else if (!gameState.playerDirectionUp && gameState.playerDirectionDown &&
    gameState.playerDirectionLeft && !gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandDL"], 29, 240);
  } else if (!gameState.playerDirectionUp && gameState.playerDirectionDown &&
    !gameState.playerDirectionLeft && gameState.playerDirectionRight) {
    blit(consoleImages["imgLeftHandDR"], 29, 240);
  } else {
    blit(consoleImages["imgLeftHandNormal"], 29, 240);
  }

  // Display appropriate left-hand image.
  if (gameState.playerAction) {
    blit(consoleImages["imgRightHandDown"], 145, 240);
  } else {
    blit(consoleImages["imgRightHandUp"], 145, 240);
  }

} // End updateHands().
