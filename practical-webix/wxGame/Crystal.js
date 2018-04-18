"use strict";


/**
 * Game object class: crystal.
 */
class Crystal extends GameObject {


  /**
   * Constructor.
   */
  constructor(inConfig) {

    // Construct object.
    super((function() {
      return webix.extend(inConfig,
        { pixWidth : 32, pixHeight : 30, frameCount : 4, baseName : "crystal" }
      );
    }()));

    // Load frames.
    super.loadFrames({
      x : 0, y : 2, playfield : inConfig.playfield, hidden : true
    });

    // Randomly position the crystal (horizontally that is).
    this.randomlyPosition();

  } /* End constructor. */


} /* End Crystal. */
