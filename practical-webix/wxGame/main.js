"use strict";


/**
 * The name game class.
 */
class WXGAME {


  /**
   * Constructor.
   */
  constructor() {

    // Player's current score.
    this.score = 0;

    // Our game objects.  Will be created in start().
    this.enemies = [ ];
    this.player = null;
    this.crystal = null;
    this.planet = null;

    // Key code constants for key events.
    this.KEY_UP = 38;
    this.KEY_DOWN = 40;
    this.KEY_LEFT = 37;
    this.KEY_RIGHT = 39;

    // Count of how many explosions are currently on the screen and
    // a reference to each.
    this.explosionCount = 0;
    this.explosions = { };

    // Add classes for the player movement rotations.
    for (let i = 0; i < 360; i = i + 45) {
      this[`CSS_ROTATE_${i}`] = webix.html.createCss({
        "transform" : `rotate(${i}deg)`,
        "-webkit-transform" : `rotate(${i}deg)`,
        "-moz-transform" : `rotate(${i}deg)`,
        "-o-transform" : `rotate(${i}deg)`,
        "-ms-transform" : `rotate(${i}deg)`
      });
    }

    // As Jagger said: "Start me up!"
    webix.ready(this.start.bind(this));

  } /* End constructor. */


  /**
   * Kick off the fun.
   */
  start() {

    // Draw the basic UI skeleton.
    webix.ui({
      type : "clean",
      cols : [
        { },
        { width : 800, type : "clean",
          rows : [
            { },
            { type : "clean", height : 600,
              rows : [
                { view : "toolbar", id : "header", height : 40,
                  elements : [
                    { id : "score", width : 90, view : "template", template : "Score: 0000" },
										{ view : "chart", type : "barH", padding : 5,
										  value : "#count#", id : "energyBar", color : "green",
										  xAxis : {
										    start : 0, end : 100, step : 1, lines : false,
										    color : "#ffffff"
										  },
										  data : [ { id  : "energy", count : 0 } ]
										}
                  ]
                },
                { id : "playfield", css : "cssPlayfield" }
              ]
            },
            { }
          ]
        },
        { }
      ]
    });

    // Get a reference to the playfield's DOM node since we'll
    this.playfield = $$("playfield").$view;

    // Create all of our enemies.
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 3; x++) {
        this.enemies.push(new Enemy({
          type : y + 1, x : x, y : y, playfield : this.playfield
        }));
      }
    }

    // Create our player, crystal and planet.
    this.player = new Player({ playfield : this.playfield });
    this.crystal = new Crystal({ playfield : this.playfield });
    this.planet = new Planet({ playfield : this.playfield });

    // Wrap the player's animate() function to implement the energy transfer function.
    this.player.animate = webix.wrap(this.player.animate, this.transferEnergy.bind(this));

    // Hook key events.
    document.onkeydown = this.keyHandler.bind(this);
    document.onkeyup = this.keyHandler.bind(this);

    // Start the game running.
    setInterval(this.run.bind(this), 100);

  } /* End start(). */


  /**
   * The main game run method, called every 250ms.
   */
  run() {

    // Give the player a chance to move.
    this.player.move();

    // Give the player and crystal a chance to animate.
    this.player.animate();
    this.crystal.animate();

    // Give any active explosions a chance to animate.
    for (let e in this.explosions) {
      if (this.explosions.hasOwnProperty(e)) {
        this.explosions[e].animate(this.explosions);
      }
    }

    // Now give each enemy a chance to animate and move and also check for collision
    // with the player for each.
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].animate();
      this.enemies[i].move(this.playfield);
      if (wxGame.collision(this.enemies[i])) {
        // Player collided with this enemy, show an explosion.
        this.explosions[`e${this.explosionCount}`] = new Explosion({
          playfield : this.playfield, explosionNumber : this.explosionCount++,
          x : this.player.xLoc - 10, y : this.player.yLoc - 5
        });
        // Adjust score, clear ship energy and reset bar.
        this.adjustScore(-50);
        this.player.energy = 0;
				$$("energyBar").updateItem("energy", { count : 0 });
        // As the explosion occurs, the player is hidden and returned ot it's starting piont.
        this.player.hide();
        this.player.toStartingPosition();
      }
    }

    // If the player collides with the crystal, juice up the ship.
    this.player.touchingCrystal = wxGame.collision(this.crystal);

    // If the player collides with the planet, transfer energy to planet.
    this.player.touchingPlanet = wxGame.collision(this.planet);

  } /* End run(). */


  /**
   * Handle key events.
   *
   * @param inEvent The key event.
   */
  keyHandler(inEvent) {

    // Normalize key event across browser types and determine key code.
    const evt = (inEvent) ? inEvent : (window.event) ? window.event : null;
    const keyCode = (evt.charCode) ? evt.charCode:
      ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : null));

    // We only care about cursor keys.
    switch (keyCode) {
      case this.KEY_UP: this.player.dirUp = (inEvent.type === "keydown"); break;
      case this.KEY_DOWN: this.player.dirDown = (inEvent.type === "keydown"); break;
      case this.KEY_LEFT: this.player.dirLeft = (inEvent.type === "keydown"); break;
      case this.KEY_RIGHT: this.player.dirRight = (inEvent.type === "keydown"); break;
    }

  } /* End keyHandler(). */


  /**
   * Check for collision between the player and a specified game object.
   *
   * @param  inObject The object to check for collision with.
   * @return boolean  True if a collision occurred, false if not.
   */
  collision(inObject) {

    // Abort if the player isn't visible (i.e., when they are 'splodin).
    if (!this.player.isVisible || !inObject.isVisible) { return false; }

    // Bounding boxes.
    const left1 = this.player.xLoc;
    const left2 = inObject.xLoc;
    const right1 = left1 + this.player.pixWidth;
    const right2 = left2 + inObject.pixWidth;
    const top1 = this.player.yLoc;
    const top2 = inObject.yLoc;
    const bottom1 = top1 + this.player.pixHeight;
    const bottom2 = top2 + inObject.pixHeight;

    // Bounding box checks.  It isn't perfect collision detection, but it's good
    // enough for government work.
    if (bottom1 < top2) {
      return false;
    }
    if (top1 > bottom2) {
      return false;
    }
    if (right1 < left2) {
      return false;
    }
    return left1 <= right2;

  } /* End collision(). */


  /**
   * Transfers that sweet, sweet alien energy either from the crystal to the ship or
   * from the ship to the planet.
   */
  transferEnergy() {

    if (this.player.touchingCrystal && this.player.energy < 100) {
      // Transferring energy from crystal to ship.
      this.player.energy = this.player.energy + 5;
      // Set value on the bar.
			$$("energyBar").updateItem("energy", { count : this.player.energy });
      if (this.player.energy === 100) {
        // Filled up, randomly position crystal.
        while (this.crystal.randomlyPosition()) { this.crystal.randomlyPosition(); }
      }
    } else if (this.player.touchingPlanet && this.player.energy > 0) {
      // Transferring energy from ship to crystal.
      this.player.energy = this.player.energy - 5;
      // Set value on the bar.
			$$("energyBar").updateItem("energy", { count : this.player.energy });
      if (this.player.energy === 0) {
        // Filled up, so randomly position planet, bump score and reset bar.
        while (this.planet.randomlyPosition()) { this.planet.randomlyPosition(); }
        this.blowUpAllEnemies();
        this.adjustScore(100);
				$$("energyBar").updateItem("energy", { count : 0 });
      }
    }

  } /* End transferEnergy(). */


  /**
   * Adjusts the score by a given amount, positive or negative.
   *
   * @param inAmount The amount to adjust the score by,
   */
  adjustScore(inAmount) {

    this.score = this.score + inAmount;
    if (this.score < 0) {
      this.score = 0;
    }
    $$("score").setHTML(`Score: ${this.score}`);

  } /* End adjustScore(). */


  /**
   * Blow up all enemies.
   */
  blowUpAllEnemies() {

    // Hide all enemies, move them to their starting positions, and explode each.
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.hide();
      enemy.moveTo(enemy.startingX, enemy.startingY);
      this.explosions[`e${this.explosionCount}`] = new Explosion({
        playfield : this.playfield, explosionNumber : this.explosionCount++,
        x : enemy.xLoc, y : enemy.yLoc
      });
    }

    // Wait 1 seconds, then show all enemies again.
    webix.delay(function() {
      for (let i = 0; i < this.enemies.length; i++) { this.enemies[i].show(); }
    }, this, [ ], 1000);

  } /* End blowUpAllEnemies(). */


} /* End WXGAME. */


// The one and only instance of WXGame.
const wxGame = new WXGAME();
