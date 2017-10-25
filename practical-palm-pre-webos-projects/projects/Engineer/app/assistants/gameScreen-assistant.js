/*
    Engineer - From the book "Practical webOS Projects With the Palm Pre"
    Copyright (C) 2009 Frank W. Zammetti
    fzammetti@etherient.com

    Licensed under the terms of the MIT license as follows:

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to 
    deal in the Software without restriction, including without limitation the 
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
    FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
    IN THE SOFTWARE.
*/


/**
 * The scene's assistant class.
 */
function GameScreenAssistant() { };  


/**
 * Constants for the types of particles.
 */ 
GameScreenAssistant.prototype.PARTICLE_IRIDIUM = 0;
GameScreenAssistant.prototype.PARTICLE_HELIUM = 1;
GameScreenAssistant.prototype.PARTICLE_MCKAYDIUM = 2;
GameScreenAssistant.prototype.PARTICLE_UNOBTANIUM = 3;


/**
 * Constants for the directions a particle is moving, and also used to describe
 * what direction the left hand is moved in.
 */ 
GameScreenAssistant.prototype.DIRECTION_UP = 0;
GameScreenAssistant.prototype.DIRECTION_DOWN = 1;
GameScreenAssistant.prototype.DIRECTION_LEFT = 2;
GameScreenAssistant.prototype.DIRECTION_RIGHT = 3;


/**
 * Constants for the current state a diverter has.
 */
GameScreenAssistant.prototype.DIVERTER_UP_LEFT = 0;
GameScreenAssistant.prototype.DIVERTER_UP_RIGHT = 1;
GameScreenAssistant.prototype.DIVERTER_DOWN_RIGHT = 2;
GameScreenAssistant.prototype.DIVERTER_DOWN_LEFT = 3;
GameScreenAssistant.prototype.DIVERTER_HORIZONTAL = 4;
GameScreenAssistant.prototype.DIVERTER_VERTICAL = 5;


/**
 * Constants representing each of the four diverters.  These are used when
 * calling changeDir() to indicate which diverter is being processed.
 */ 
GameScreenAssistant.prototype.DIVERTER_TOP = 0;
GameScreenAssistant.prototype.DIVERTER_BOTTOM = 1;
GameScreenAssistant.prototype.DIVERTER_LEFT = 2;
GameScreenAssistant.prototype.DIVERTER_RIGHT = 3;


/**
 * Constants for X and Y adjustment values to account for the frame.
 */
GameScreenAssistant.prototype.XADJ = 20;
GameScreenAssistant.prototype.YADJ = 22;


/** 
 * The number of pixels around a diverter that a tap will register (i.e.,
 * a value of 15 means the tap can be up to 15 pixels above, below, to the
 * right or to the left of a diverter and it will still register).
 */
GameScreenAssistant.prototype.TAP_LEEWAY = 15;


/**
 * These are objects, one for each diverter, that contains the bounding area
 * of each diverter.  These values get calculated when the scene is set up.
 */
GameScreenAssistant.prototype.topDiverterBounds = { 
  x1 : null, y1 : null,  x2 : null, y2 : null
};
GameScreenAssistant.prototype.bottomDiverterBounds = {
  x1 : null, y1 : null,  x2 : null, y2 : null
};
GameScreenAssistant.prototype.leftDiverterBounds = {
  x1 : null, y1 : null,  x2 : null, y2 : null
};
GameScreenAssistant.prototype.rightDiverterBounds = {
  x1 : null, y1 : null,  x2 : null, y2 : null
};


/**
 * The 2D context of the canvas the game is drawn on. 
 */
GameScreenAssistant.prototype.ctx = null;


/**
 * A reference to the inveral that runs the main game loop.
 */
GameScreenAssistant.prototype.mainLoopInterval = null;


/**
 * The model for the overheat progress bar.
 */
GameScreenAssistant.prototype.overheatBarModel = { progress : 0 };


/**
 * The current score of the game.
 */
GameScreenAssistant.prototype.score = null;


/**
 * Counter used to tell wehn it's time to randomly change the lights on the
 * frame around the game.
 */
GameScreenAssistant.prototype.lightChangeCounter = null;


/**
 * An array of simple objects, one for each particle currently moving around
 * the track, that describes their current state.
 */
GameScreenAssistant.prototype.particles = new Array(3);


/**
 * A reference to the current image each diverter is showing.
 */
GameScreenAssistant.prototype.topDiverter = null;
GameScreenAssistant.prototype.bottomDiverter = null;
GameScreenAssistant.prototype.leftDiverter = null;
GameScreenAssistant.prototype.rightDiverter = null;


/**
 * A reference to the current image showing for the left and right hands.
 */
GameScreenAssistant.prototype.leftHand = null;
GameScreenAssistant.prototype.rightHand = null;


/**
 * Counter used to determine how long before the hand images are changed back
 * to their "neutral" images.
 */
GameScreenAssistant.prototype.leftHandDelay = null;
GameScreenAssistant.prototype.rightHandDelay = null;


/**
 * The folllwing are all reference to loaded images for various elements
 * used in this game.  Hopefully their names are fairly self-describing!
 * Note that most are just single images, but some represent multiple frames
 * of animation and so are arrays, or they are a serious of images, like the
 * diverter types for example.
 */ 
GameScreenAssistant.prototype.imgPaused = null;
GameScreenAssistant.prototype.imgGenerator = null;
GameScreenAssistant.prototype.imgFrame = null;
GameScreenAssistant.prototype.imgBackground = null;
GameScreenAssistant.prototype.imgLightsLeft = null;
GameScreenAssistant.prototype.imgLightsRight = null;
GameScreenAssistant.prototype.imgConsoleLeftSide = null;
GameScreenAssistant.prototype.imgConsoleRightSide = null;
GameScreenAssistant.prototype.imgConsoleMiddle = null;
GameScreenAssistant.prototype.imgLeftHandNeutral = null;
GameScreenAssistant.prototype.imgLeftHandUp = null;
GameScreenAssistant.prototype.imgLeftHandDown = null;
GameScreenAssistant.prototype.imgLeftHandLeft = null;
GameScreenAssistant.prototype.imgLeftHandRight = null;
GameScreenAssistant.prototype.imgRightHandUp = null;
GameScreenAssistant.prototype.imgRightHandDown = null;
GameScreenAssistant.prototype.imgDiverters = new Array(6);
GameScreenAssistant.prototype.imgParticles = new Array(4);
GameScreenAssistant.prototype.imgParticles[0] = new Array(2);
GameScreenAssistant.prototype.imgParticles[1] = new Array(2);
GameScreenAssistant.prototype.imgParticles[2] = new Array(2);
GameScreenAssistant.prototype.imgParticles[3] = new Array(2);


/**
 * Set up the scene.
 */
GameScreenAssistant.prototype.setup = function() {

  // Calculate bounding rectangles for the four diverters.  Sorry for the ugly
  // use of magic numbers (namely, the X/Y coordinates of the upper left-hand
  // corner of the diverters), but it's the simplest approach I think.
  this.topDiverterBounds = { 
    x1 : this.XADJ + 91 - this.TAP_LEEWAY,
    y1 : this.YADJ + 40 - this.TAP_LEEWAY,
    x2 : this.XADJ + 91 + 19 + this.TAP_LEEWAY,
    y2 : this.YADJ + 40 + 19 + this.TAP_LEEWAY
  };
  this.bottomDiverterBounds = {
    x1 : this.XADJ + 91 - this.TAP_LEEWAY,
    y1 : this.YADJ + 140 - this.TAP_LEEWAY,
    x2 : this.XADJ + 91 + 19 + this.TAP_LEEWAY,
    y2 : this.YADJ + 140 + 19 + this.TAP_LEEWAY
  };
  this.leftDiverterBounds = {
    x1 : this.XADJ + 40 - this.TAP_LEEWAY,
    y1 : this.YADJ + 90 - this.TAP_LEEWAY,
    x2 : this.XADJ + 40 + 19 + this.TAP_LEEWAY,
    y2 : this.YADJ + 90 + 19 + this.TAP_LEEWAY
  };
  this.rightDiverterBounds = {
    x1 : this.XADJ + 141 - this.TAP_LEEWAY,
    y1 : this.YADJ + 90 - this.TAP_LEEWAY,
    x2 : this.XADJ + 141 + 19 + this.TAP_LEEWAY,
    y2 : this.YADJ + 90 + 19 + this.TAP_LEEWAY
  };

  // Set up the overheat progress bar.
  this.controller.setupWidget("pbOverheat",
    { modelProperty : "progress" }, this.overheatBarModel
  ); 

  // Load game frame image.
  this.imgFrame = new Image();
  this.imgFrame.src = "images/mini_game_frame.png";

  // Load game background image.
  this.imgBackground = new Image();
  this.imgBackground.src = "images/game_background.png";

  // Load game frame light images for the left side.
  this.imgLightsLeft = [ ];
  var lightsLeft0 = {
    img : new Image(), width : 20, height : 21, x : 0, y : 22
  };
  lightsLeft0.img.src = "images/mini_game_frame_l0.png"
  this.imgLightsLeft.push(lightsLeft0);
  var lightsLeft1 = {
    img : new Image(), width : 20, height : 20, x : 0, y : 64
  };
  lightsLeft1.img.src = "images/mini_game_frame_l1.png"
  this.imgLightsLeft.push(lightsLeft1);
  var lightsLeft2 = {
    img : new Image(), width : 20, height : 20, x : 0, y : 107
  };
  lightsLeft2.img.src = "images/mini_game_frame_l2.png"
  this.imgLightsLeft.push(lightsLeft2);    
  var lightsLeft3 = {
    img : new Image(), width : 20, height : 20, x : 0, y : 150
  };
  lightsLeft3.img.src = "images/mini_game_frame_l3.png"
  this.imgLightsLeft.push(lightsLeft3);
  var lightsLeft4 = {
    img : new Image(), width : 20, height : 20, x : 0, y : 193
  };
  lightsLeft4.img.src = "images/mini_game_frame_l4.png"
  this.imgLightsLeft.push(lightsLeft4);

  // Load game frame light images for the right side.
  this.imgLightsRight = [ ];
  var lightsRight0 = {
    img : new Image(), width : 20, height : 20, x : 220, y : 20
  };
  lightsRight0.img.src = "images/mini_game_frame_r0.png"
  this.imgLightsRight.push(lightsRight0);
  var lightsRight1 = {
    img : new Image(), width : 20, height : 20, x : 220, y : 62
  };
  lightsRight1.img.src = "images/mini_game_frame_r1.png"
  this.imgLightsRight.push(lightsRight1);
  var lightsRight2 = {
    img : new Image(), width : 20, height : 20, x : 220, y : 107
  };
  lightsRight2.img.src = "images/mini_game_frame_r2.png"
  this.imgLightsRight.push(lightsRight2);
  var lightsRight3 = {
    img : new Image(), width : 20, height : 20, x : 220, y : 150
  };
  lightsRight3.img.src = "images/mini_game_frame_r3.png"
  this.imgLightsRight.push(lightsRight3);
  var lightsRight4 = {
    img : new Image(), width : 20, height : 20, x : 220, y : 193
  };
  lightsRight4.img.src = "images/mini_game_frame_r4.png"
  this.imgLightsRight.push(lightsRight4);            
  
  // Load generator images.
  this.imgGenerator = [ ];
  for (var i = 0; i < 8; i++) {
    this.imgGenerator.push(new Image());
    this.imgGenerator[i].src = "images/nucleus_" + i + ".png";
  }
  
  // Load console images.
  this.imgConsoleLeftSide = new Image();
  this.imgConsoleLeftSide.src = "images/console_left.png";    
  this.imgConsoleMiddle = new Image();
  this.imgConsoleMiddle.src = "images/console_middle.png";
  this.imgConsoleRightSide = new Image();
  this.imgConsoleRightSide.src = "images/console_right.png";    

  // Load hand images.
  this.imgLeftHandNeutral = new Image();
  this.imgLeftHandNeutral.src = "images/left_hand_normal.png";    
  this.imgLeftHandUp = new Image();
  this.imgLeftHandUp.src = "images/left_hand_up.png";
  this.imgLeftHandDown = new Image();
  this.imgLeftHandDown.src = "images/left_hand_down.png";
  this.imgLeftHandLeft = new Image();
  this.imgLeftHandLeft.src = "images/left_hand_left.png";
  this.imgLeftHandRight = new Image();
  this.imgLeftHandRight.src = "images/left_hand_right.png";    
  this.imgRightHandUp = new Image();
  this.imgRightHandUp.src = "images/right_hand_up.png";
  this.imgRightHandDown = new Image();
  this.imgRightHandDown.src = "images/right_hand_down.png";
   
  // Load diverter images.
  this.imgDiverters[0] = new Image();
  this.imgDiverters[0].src = "images/diverter_up_left.png";
  this.imgDiverters[1] = new Image();
  this.imgDiverters[1].src = "images/diverter_up_right.png";
  this.imgDiverters[2] = new Image();
  this.imgDiverters[2].src = "images/diverter_down_right.png";
  this.imgDiverters[3] = new Image();
  this.imgDiverters[3].src = "images/diverter_down_left.png";
  this.imgDiverters[4] = new Image();
  this.imgDiverters[4].src = "images/diverter_horizontal.png";
  this.imgDiverters[5] = new Image();
  this.imgDiverters[5].src = "images/diverter_vertical.png";
  
  // Load particle images.
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 2; x++) {
      this.imgParticles[y][x] = new Image();
      this.imgParticles[y][x].src = 
        "images/particle" + y + "_" + x + ".png";
    }
  }
  
  // Load paused image.
  this.imgPaused = new Image();
  this.imgPaused.src = "images/paused.gif";
  
}; // End GameScreenAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
GameScreenAssistant.prototype.activate = function() {

  // Cache reference to 2D context of the canvas.
  this.ctx = $("mainCanvas").getContext("2d");

  // Listen for tap events on the canvas.  
  Mojo.Event.listen($("mainCanvas"), Mojo.Event.tap, 
    this.tapHandler.bind(this), true);

  // Listen for keypress events on the canvas.  
  Mojo.Event.listen(this.controller.document, Mojo.Event.keypress, 
    this.keypressHandler.bind(this), true);

  // Listen for when the stage is activated.  This happens when the app is
  // brought back into focus after being minimized.
  Mojo.Event.listen(this.controller.stageController.document, 
    Mojo.Event.stageActivate, 
    function() {
      $("imgPaused").hide();
      $("mainCanvas").show();
      $("pbOverheat").show();
      $("divScoreContainer").show();
      this.mainLoopInterval = setInterval(this.mainLoop.bind(this), 33);
    }.bind(this)
  );

  // Listen for when the stage is deactivated.  This happens when the app is
  // minimized (card-ified)
  Mojo.Event.listen(this.controller.stageController.document, 
    Mojo.Event.stageDeactivate, 
    function() {
      clearInterval(this.mainLoopInterval);
      $("imgPaused").show();
      $("mainCanvas").hide();
      $("pbOverheat").hide();
    }.bind(this)
  );

  // Listen for the shaking event so we can cool down the engine.
  this.controller.listen(document, "shaking", function(inEvent) {
    this.keypressHandler( 
      { originalEvent : { keyCode : Mojo.Char.p } } 
    );    
  }.bind(this));

  // Start the game.
  this.startGame();

}; // End GameScreenAssistant.prototype.activate().


/**
 * Start a new game.  All variables are reset, and some UI elements are also
 * reset here.
 */
GameScreenAssistant.prototype.startGame = function() {

  // Reset the overheat progress bar.  This involved a little bit of
  // "black magic" in that we need to change the color of the progress portion's
  // background, and the only way I could see to do this was to go after its
  // Mojo-generated ID directly, which I discovered by examining the app with
  // the inspector.
  this.overheatBarModel.progress = 0;
  this.controller.modelChanged(this.overheatBarModel);
  $("palm_anon_element_0mojo-scene-gameScreenpbOverheat_progress").style.backgroundColor = 
    "#00ff00";
  
  // Reset the score.
  this.score = 0;
  $("divScore").update("0");
  
  // Make sure the frame and lights get painted during the very first frame to
  // avoid a little flickering issue.
  this.lightChangeCounter = 99;
  
  // Diverter default positions.
  this.topDiverter = this.DIVERTER_DOWN_RIGHT;
  this.bottomDiverter = this.DIVERTER_DOWN_LEFT;
  this.leftDiverter = this.DIVERTER_DOWN_RIGHT;
  this.rightDiverter = this.DIVERTER_DOWN_LEFT;
  
  // Create particles and their default descriptions.
  this.particles[0] = { 
    type : null, frame : null, frameDelay : null, direction : null, 
    alive : false, emergeDelay : 0, x : null, y : null
  };
  this.particles[1] = { 
    type : null, frame : null, frameDelay : null, direction : null, 
    alive : false, emergeDelay : 60, x : null, y : null
  };
  this.particles[2] = { 
    type : null, frame : null, frameDelay : null, direction : null, 
    alive : false, emergeDelay : 120, x : null, y : null
  }; 

  // Reset hands to their default positions.
  this.leftHand = this.imgLeftHandNeutral;
  this.rightHand = this.imgRightHandUp;    
  this.leftHandDelay = 0;
  this.rightHandDelay = 0;

  // Kick off the main game loop to run at 30FPS.
  this.mainLoopInterval = setInterval(this.mainLoop.bind(this), 33);

}; // End GameScreenAssistant.prototype.startGame().


/**
 * Called to play a system sound.
 *
 * @param inSound The name of the system sound to play.
 */
GameScreenAssistant.prototype.playSound = function(inSound) {

  this.controller.serviceRequest("palm://com.palm.audio/systemsounds", {
    method : "playFeedback", parameters : {name : inSound }
  });

}; // End GameScreenAssistant.prototype.playSound().


/**
 * The main game loop.  This is where the logic of the game is implemented,
 * along with all screen updates.
 */
GameScreenAssistant.prototype.mainLoop = function() {

  // Randomly flash lights on the frame border and draw the frame.
  this.lightChangeCounter = this.lightChangeCounter + 1;
  // Do this every half a second (every 15 frames).
  if (this.lightChangeCounter > 15) {
    this.lightChangeCounter = 0;
    // Draw the base frame first.
    this.ctx.drawImage(this.imgFrame, 0, 0, 240, 240);
    // Now randomly decide whether each light on both sides is lit or not
    // and draw teh appropriate image.
    for (var i = 0; i < 5; i++) {
      if (Math.floor(Math.random() * 2) == 1) {
        this.ctx.drawImage(this.imgLightsLeft[i].img, 
          this.imgLightsLeft[i].x, this.imgLightsLeft[i].y, 
          this.imgLightsLeft[i].width, this.imgLightsLeft[i].height
        );
      }
      if (Math.floor(Math.random() * 2) == 1) {
        this.ctx.drawImage(this.imgLightsRight[i].img, 
          this.imgLightsRight[i].x, this.imgLightsRight[i].y, 
          this.imgLightsRight[i].width, this.imgLightsRight[i].height
        );        
      }
    }
  }

  // Draw console and hands.
  this.ctx.drawImage(this.imgConsoleLeftSide, 0, 240, 29, 60);
  this.ctx.drawImage(this.imgConsoleMiddle, 108, 240, 37, 60);
  this.ctx.drawImage(this.imgConsoleRightSide, 215, 240, 25, 60);
  this.ctx.drawImage(this.leftHand, 29, 240, 79, 60);
  this.ctx.drawImage(this.rightHand, 145, 240, 70, 60);

  // Reset the hands to their default states so that the previous operation
  // is now completed.
  if (this.leftHand != this.imgLeftHandNeutral) {
    this.leftHandDelay = this.leftHandDelay + 1;
    if (this.leftHandDelay > 2) {
      this.leftHand = this.imgLeftHandNeutral;
    }
  }
  if (this.rightHand != this.imgRightHandUp) {
    this.rightHandDelay = this.rightHandDelay + 1;
    if (this.rightHandDelay > 2) {
      this.rightHand = this.imgRightHandUp;
    }
  }

  // Draw the background.
  this.ctx.drawImage(this.imgBackground, this.XADJ, this.YADJ, 200, 200);
  
  // Draw the nucleus.
  this.ctx.drawImage(this.imgGenerator[Math.floor(Math.random()*8)], 
    this.XADJ + 74, this.YADJ + 73, 53, 53);

  // Draw diverters.
  this.ctx.drawImage(this.imgDiverters[this.topDiverter], 
    this.XADJ + 91, this.YADJ + 40, 19, 19);
  this.ctx.drawImage(this.imgDiverters[this.bottomDiverter], 
    this.XADJ + 91, this.YADJ + 140, 19, 19);
  this.ctx.drawImage(this.imgDiverters[this.leftDiverter], 
    this.XADJ + 40, this.YADJ + 90, 19, 19);
  this.ctx.drawImage(this.imgDiverters[this.rightDiverter], 
    this.XADJ + 141, this.YADJ + 90, 19, 19);
  
  // Draw particles and move them.
  for (var i = 0; i < 3; i++) {

    // The particle has to be "alive" to be moved.
    if (this.particles[i].alive) {

      // Draw it.
      this.ctx.drawImage(
        this.imgParticles[this.particles[i].type][this.particles[i].frame], 
        this.XADJ + this.particles[i].x, this.YADJ + this.particles[i].y, 
        11, 11);

      // Update its animation frame.
      this.particles[i].frameDelay = this.particles[i].frameDelay + 1;
      if (this.particles[i].frameDelay > 2) {
        this.particles[i].frameDelay = 0;
        this.particles[i].frame = this.particles[i].frame + 1;
        if (this.particles[i].frame > 1) {
          this.particles[i].frame = 0;
        }
      }

      // Move the particle based on its current direction.
      switch (this.particles[i].direction) {
        case this.DIRECTION_UP: 
          this.particles[i].y = this.particles[i].y - 1; 
        break;
        case this.DIRECTION_DOWN:
          this.particles[i].y = this.particles[i].y + 1; 
        break;
        case this.DIRECTION_LEFT:  
          this.particles[i].x = this.particles[i].x - 1; 
        break;
        case this.DIRECTION_RIGHT: 
          this.particles[i].x = this.particles[i].x + 1; 
        break;
      }

      // If they sent it back into the generator, subtract from score.
      if (this.particles[i].x == 95 && this.particles[i].y == 94) {
        this.playSound("back_01");
        this.addToScore(-50);
        this.addOverheat(0.2);
        // Kill the particle.
        this.particles[i].alive = false; 
        // Pick a time before it emerges as a new particle again.
        this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
      }

      // Check for "magic coordinates": the corner pieces of the track the
      // particles move on.  When one is hit, adjust the direction of the
      // particle appropriately for that particular corner, based on the
      // current direction of the particle.
      
      // Top.
      if (this.particles[i].x == 95 && this.particles[i].y == 12) { 
        this.particles[i].direction = this.DIRECTION_RIGHT; 
      } 
      // Bottom.
      if (this.particles[i].x == 95 && this.particles[i].y == 177) { 
        this.particles[i].direction = this.DIRECTION_LEFT;  
      } 
      // Left.
      if (this.particles[i].x == 12  && this.particles[i].y == 94) { 
        this.particles[i].direction = this.DIRECTION_UP;    
      } 
      // Right.
      if (this.particles[i].x == 177 && this.particles[i].y == 94) { 
        this.particles[i].direction = this.DIRECTION_DOWN;  
      } 
      // Upper Left Moving Up.
      if (this.particles[i].x == 44  && this.particles[i].y == 44 && 
        this.particles[i].direction == this.DIRECTION_UP) { 
        this.particles[i].direction = this.DIRECTION_RIGHT; 
      } 
      // Upper Left Moving Left.
      if (this.particles[i].x == 44  && this.particles[i].y == 44 && 
        this.particles[i].direction == this.DIRECTION_LEFT) { 
        this.particles[i].direction = this.DIRECTION_DOWN;  
      } 
      // Upper Right Moving Up.
      if (this.particles[i].x == 145 && this.particles[i].y == 44 && 
        this.particles[i].direction == this.DIRECTION_UP) { 
        this.particles[i].direction = this.DIRECTION_LEFT;  
      } 
      // Upper Right Moving Right.
      if (this.particles[i].x == 145 && this.particles[i].y == 44 && 
        this.particles[i].direction == this.DIRECTION_RIGHT) { 
        this.particles[i].direction = this.DIRECTION_DOWN;  
      } 
      // Lower Left Moving Down.
      if (this.particles[i].x == 44  && this.particles[i].y == 144 && 
        this.particles[i].direction == this.DIRECTION_DOWN) { 
        this.particles[i].direction = this.DIRECTION_RIGHT; 
      } 
      // Lower Left Moving Left.
      if (this.particles[i].x == 44  && this.particles[i].y == 144 && 
        this.particles[i].direction == this.DIRECTION_LEFT) { 
        this.particles[i].direction = this.DIRECTION_UP;    
      } 
      // Lower Right Moving Down.
      if (this.particles[i].x == 145 && this.particles[i].y == 144 && 
        this.particles[i].direction == this.DIRECTION_DOWN) { 
        this.particles[i].direction = this.DIRECTION_LEFT;  
      } 
      // Lower Right Moving Right.
      if (this.particles[i].x == 145 && this.particles[i].y == 144 && 
        this.particles[i].direction == this.DIRECTION_RIGHT) { 
        this.particles[i].direction = this.DIRECTION_UP;    
      } 

      // Check for "magic coordinates": the diverters.  Adjust the direction
      // of the particlar appropriately, or kill it if the diverter is
      // invalid (i.e., the particle can't continue).  Also adjust score and
      // engine overheat progress if the type isn't valid.
      
      // Top diverter.
      if (this.particles[i].x == 95 && this.particles[i].y == 44) { 
        this.particles[i].direction = this.changeDir(this.DIVERTER_TOP, 
          this.particles[i].direction);
        // Diverter state not valid when particle arrived, kill it
        if (this.particles[i].direction == -1) { 
          // Kill the particle.
          this.playSound("discardingapp_01");
          this.particles[i].alive = false; 
          // Pick a time before it emerges as a new particle again
          this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
        }
      }
      // Bottom diverter.
      if (this.particles[i].x == 95 && this.particles[i].y == 144) { 
        this.particles[i].direction = 
          this.changeDir(this.DIVERTER_BOTTOM, this.particles[i].direction);
        // Diverter state not valid when particle arrived, kill it
        if (this.particles[i].direction == -1) {
          // Kill the particle.
          this.playSound("discardingapp_01");
          this.particles[i].alive = false;
          // Pick a time before it emerges as a new particle again
          this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
        }
      }
      // Left diverter.
      if (this.particles[i].x == 44 && this.particles[i].y == 94) { 
        this.particles[i].direction = 
          this.changeDir(this.DIVERTER_LEFT, this.particles[i].direction);
        // Diverter state not valid when particle arrived, kill it
        if (this.particles[i].direction == -1) { 
          // Kill the particle.
          this.playSound("discardingapp_01");
          this.particles[i].alive = false; 
          // Pick a time before it emerges as a new particle again
          this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
        }
      }
      // Right diverter.
      if (this.particles[i].x == 145 && this.particles[i].y == 94) { 
        this.particles[i].direction = 
          this.changeDir(this.DIVERTER_RIGHT, this.particles[i].direction);
        // Diverter state not valid when particle arrived, kill it
        if (this.particles[i].direction == -1) { 
          // Kill the particle
          this.playSound("discardingapp_01");
          this.particles[i].alive = false; 
          // Pick a time before it emerges as a new particle again
          this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
        }
      }

      // Check for "magic coordinates": the injector ports.  If it's the right
      // one for the particle, add to the score, otherwise, subtract from it
      // and heat the engine up a bit.
      
      // Top Left
      if (this.particles[i].x == 12 && this.particles[i].y == 12)  { 
        if (this.particles[i].type == this.PARTICLE_IRIDIUM) { 
          this.playSound("browser_01");
          this.addToScore(75); 
        } else {
          this.playSound("delete_01"); 
          this.addToScore(-25);
          this.addOverheat(0.2);
        }
        // Kill the particle
        this.particles[i].alive = false; 
        // Pick a time before it emerges as a new particle again
        this.particles[i].emergeDelay = Math.floor(Math.random() * 100);
      }
      // Top Right
      if (this.particles[i].x == 177 && this.particles[i].y == 12)  { 
        if (this.particles[i].type == this.PARTICLE_HELIUM) { 
          this.playSound("browser_01");
          this.addToScore(75); 
        } else { 
          this.playSound("delete_01"); 
          this.addToScore(-25);
          this.addOverheat(0.2);
        }
        // Kill the particle
        this.particles[i].alive = false;
        // Pick a time before it emerges as a new particle again
        this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
      }
      // Bottom Right
      if (this.particles[i].x == 177 && this.particles[i].y == 177) { 
        if (this.particles[i].type == this.PARTICLE_MCKAYDIUM) { 
          this.playSound("browser_01");
          this.addToScore(75); 
        } else { 
          this.playSound("delete_01"); 
          this.addToScore(-25); 
          this.addOverheat(0.2);
        }
        // Kill the particle
        this.particles[i].alive = false;
        // Pick a time before it emerges as a new particle again
        this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
      }
      // Bottom Left
      if (this.particles[i].x == 12 && this.particles[i].y == 177) { 
        if (this.particles[i].type == this.PARTICLE_UNOBTANIUM) { 
          this.playSound("browser_01");
          this.addToScore(75);
        } else { 
          this.playSound("delete_01"); 
          this.addToScore(-25);
          this.addOverheat(0.2); 
        }
        // Kill the particle
        this.particles[i].alive = false;
        // Pick a time before it emerges as a new particle again
        this.particles[i].emergeDelay = Math.floor(Math.random() * 100); 
      }

    } else { 

      // Particle is currently dead, so see if it's time for it to emerge
      // from the generator and do so if it is.
      this.particles[i].emergeDelay = this.particles[i].emergeDelay - 1;
      if (this.particles[i].emergeDelay < 0) {
        this.playSound("card_01");         
        this.particles[i].x = 95;
        this.particles[i].y = 94;
        this.particles[i].alive = true;
        this.particles[i].frameDelay = 0;
        this.particles[i].frame = Math.floor(Math.random() * 2);
        this.particles[i].type = Math.floor(Math.random() * 4);
        this.particles[i].direction = Math.floor(Math.random() * 4);
      }

    }

  } // End iteration over particles.
 
}; // End GameScreenAssistant.prototype.mainLoop().


/**
 * Changes the direction of a particle hitting a diverter based on the current
 * state of the diverter.
 *
 * @param inDiverter Which diverter the particle is hitting.
 * @param inCurrDir  The direction the particle is currently moving in.
 */
GameScreenAssistant.prototype.changeDir = function(inDiverter, inCurrDir) {

  var retVal = 0;
  var diverterState = 0;

  // Get the current state of the appropriate diverter
  switch (inDiverter) {
    case this.DIVERTER_TOP: diverterState = this.topDiverter; break;
    case this.DIVERTER_BOTTOM: diverterState = this.bottomDiverter; break;
    case this.DIVERTER_LEFT: diverterState = this.leftDiverter; break;
    case this.DIVERTER_RIGHT: diverterState = this.rightDiverter; break;
  }

  // Depending on which direction the particle is moving and the state of the 
  // diverter, change the direction appropriately
  switch (inCurrDir) {

    case this.DIRECTION_UP:
      switch (diverterState) {
        case this.DIVERTER_DOWN_RIGHT: retVal = this.DIRECTION_RIGHT; break; 
        case this.DIVERTER_DOWN_LEFT: retVal = this.DIRECTION_LEFT; break; 
        case this.DIVERTER_VERTICAL: retVal = this.DIRECTION_UP; break; 
        default: retVal = -1; break;
      }
    break;

    case this.DIRECTION_DOWN:
      switch (diverterState) {
        case this.DIVERTER_UP_LEFT: retVal = this.DIRECTION_LEFT; break; 
        case this.DIVERTER_UP_RIGHT: retVal = this.DIRECTION_RIGHT; break; 
        case this.DIVERTER_VERTICAL: retVal = this.DIRECTION_DOWN;  break; 
        default: retVal = -1; break;
      }
    break;

    case this.DIRECTION_LEFT:
      switch (diverterState) {
        case this.DIVERTER_UP_RIGHT: retVal = this.DIRECTION_UP; break; 
        case this.DIVERTER_DOWN_RIGHT: retVal = this.DIRECTION_DOWN; break; 
        case this.DIVERTER_HORIZONTAL: retVal = this.DIRECTION_LEFT;  break;
        default: retVal = -1; break; 
      }
    break;

    case this.DIRECTION_RIGHT:
      switch (diverterState) {
        case this.DIVERTER_UP_LEFT: retVal = this.DIRECTION_UP; break; 
        case this.DIVERTER_DOWN_LEFT: retVal = this.DIRECTION_DOWN; break; 
        case this.DIVERTER_HORIZONTAL: retVal = this.DIRECTION_RIGHT; break; 
        default: retVal = -1; break;
      }
    break;

  }

  return retVal;

}; // End GameScreenAssistant.prototype.changeDir().


/**
 * Called to adjust the overheat progress bar's current progress value by a 
 * given amount.
 *
 * @param inAmount The amount to add to the progress value (can be negative).
 */
GameScreenAssistant.prototype.addOverheat = function(inAmount) {

  // Get the current progress value and add inAmount to it.  Since inAmount
  // can be negative, immediately handle the less than zero possibility.
  var progress = this.overheatBarModel.progress;
  progress = progress + inAmount;
  if (progress < 0) {
    progress = 0;
  }
   
  // Update the model with the new progress value and inform the controller
  // of the model change so the screen gets updated.
  this.overheatBarModel.progress = progress;
  this.controller.modelChanged(this.overheatBarModel);

  // Update the color of the progress bar.
  $("palm_anon_element_0mojo-scene-gameScreenpbOverheat_progress").style.backgroundColor = 
    "#" + 
    Math.round((progress * 255)).toString(16) + 
    Math.round((255 - (progress * 255))).toString(16) +
    "00"; 
  
  // Now see if the game needs to end and if so, show the dialog. 
  if (this.overheatBarModel.progress >= 1) {
    clearInterval(this.mainLoopInterval);
    this.playSound("focusing");
    this.gameOverDialog = this.controller.showDialog({
      template : "gameOver-dialog", assistant : new GameOverAssistant(this),
      preventCancel : true
    });
  }

}; // End GameScreenAssistant.prototype.addOverheat().


/**
 * Called to adjust the current score by a given amount.
 *
 * @param inScore The amount to adjust the score by (can be negative).
 */
GameScreenAssistant.prototype.addToScore = function(inScore) {

  this.score = this.score + inScore;
  if (this.score < 0) {
    this.score = 0;
  }
  $("divScore").update(this.score);

}; // End GameScreenAssistant.prototype.addToScore().


/**
 * Event handler for screen taps.  This will determine what diverter was tapped,
 * if any, and then piggyback on the functionality in the keypressHandler()
 * method so that it's not duplicated.
 *
 * @param inEvent The Event object.
 */    
GameScreenAssistant.prototype.tapHandler = function(inEvent) {

  // "Normalize" the X, Y coordinates so they fall inside the game area and
  // will line up with the diverters properly.
  var x = inEvent.down.x - 40;
  var y = inEvent.down.y - 66;

  // Top diverter.  
  if (x >= this.topDiverterBounds.x1 && x <= this.topDiverterBounds.x2 &&
    y >= this.topDiverterBounds.y1 && y <= this.topDiverterBounds.y2) {
    this.keypressHandler( 
      { originalEvent : { keyCode : Mojo.Char.w } } 
    );
    return;
  } 
  // Bottom diverter.  
  else if (x >= this.bottomDiverterBounds.x1 && 
    x <= this.bottomDiverterBounds.x2 &&
    y >= this.bottomDiverterBounds.y1 && y <= this.bottomDiverterBounds.y2) {
    this.keypressHandler( 
      { originalEvent : { keyCode : Mojo.Char.z } } 
    );
  }
  // Left diverter.  
  else if (x >= this.leftDiverterBounds.x1 && x <= this.leftDiverterBounds.x2 &&
    y >= this.leftDiverterBounds.y1 && y <= this.leftDiverterBounds.y2) {
    this.keypressHandler( 
      { originalEvent : { keyCode : Mojo.Char.a } } 
    );    
  }
  // Right diverter.  
  else if (x >= this.rightDiverterBounds.x1 && 
    x <= this.rightDiverterBounds.x2 &&
    y >= this.rightDiverterBounds.y1 && y <= this.rightDiverterBounds.y2) {
    this.keypressHandler( 
      { originalEvent : { keyCode : Mojo.Char.s } } 
    );
  }
  // Not a diverter, cool down the engine.
  else {
    this.keypressHandler( 
      { originalEvent : { keyCode : Mojo.Char.p } } 
    );
  }

} // End GameScreenAssistant.prototype.tapHandler().


/**
 * Event handler for keypresses.
 *
 * @param inEvent The Event object.
 */
GameScreenAssistant.prototype.keypressHandler = function(inEvent) {

  switch (inEvent.originalEvent.keyCode) {

    // Top diverter (W).
    case Mojo.Char.w: case Mojo.Char.w + 32:
      this.playSound("down2");
      this.topDiverter = this.topDiverter + 1;
      if (this.topDiverter > 5) { this.topDiverter = 0; }
      this.leftHand = this.imgLeftHandUp;
      this.leftHandDelay = 0;
    break;
    
    // Bottom diverter (Z).
    case Mojo.Char.z: case Mojo.Char.z + 32:
      this.playSound("down2");
      this.bottomDiverter = this.bottomDiverter + 1;
      if (this.bottomDiverter > 5) { this.bottomDiverter = 0; }
      this.leftHand = this.imgLeftHandDown;
      this.leftHandDelay = 0;
    break;
    
    // Left diverter (A).
    case Mojo.Char.a: case Mojo.Char.a + 32:
      this.playSound("down2");
      this.leftDiverter = this.leftDiverter + 1;
      if (this.leftDiverter > 5) { this.leftDiverter = 0; }
      this.leftHand = this.imgLeftHandLeft;
      this.leftHandDelay = 0;    
    break;
    
    // Right diverter (S).
    case Mojo.Char.s: case Mojo.Char.s + 32:
      this.playSound("down2");
      this.rightDiverter = this.rightDiverter + 1;
      if (this.rightDiverter > 5) { this.rightDiverter = 0; }
      this.leftHand = this.imgLeftHandRight;
      this.leftHandDelay = 0;    
    break;
    
    // Cooldown (P).
    case Mojo.Char.p: case Mojo.Char.p + 32:
      this.playSound("launch_02");
      this.addOverheat(-0.2);      
      this.rightHand = this.imgRightHandDown;
      this.rightHandDelay = 0;      
    break;
    
  } // End switch.

}; // End GameScreenAssistant.prototype.keypressHandler().
