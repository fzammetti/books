"use strict";


/**
 * Game object class: planet.
 */
class Planet extends GameObject {


  /**
   * Constructor.
   */
  constructor(inConfig) {

    // Construct object.
    super((function() {
      return webix.extend(inConfig,
        { pixWidth : 64, pixHeight : 64, frameCount : 1, baseName : "planet" }
      );
    }()));

    // Load frames.
    super.loadFrames({
      x : 0, y : 492, playfield : inConfig.playfield, hidden : true
    });

    // Randomly position the planet somewhere.  Any time it collides with the player, try again.
    // When we have a good position, show the planet.
    while (this.randomlyPosition()) { this.randomlyPosition(); }

  } /* End constructor. */


} /* End Planet. */
