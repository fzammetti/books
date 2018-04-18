"use strict";


/**
 * Game object class: explosion.
 */
class Explosion extends GameObject {


  /**
   * Constructor.
   */
  constructor(inConfig) {

    // Construct base object.
    super((function() {
      return webix.extend(inConfig,
        { pixWidth : 50, pixHeight : 50, frameCount : 5, baseName : "explosion" }
      );
    }()));

    // Record what explosion number this is.
    this.explosionNumber = inConfig.explosionNumber;

    // Load frames.
    super.loadFrames({
      x  : inConfig.x, y : inConfig.y, n : inConfig.explosionNumber,
      playfield : inConfig.playfield, hidden : true
    });

  } /* End constructor. */


  /**
   * Called at the end of the animation cycle.
   *
   * @param inCollection The collection the object belongs to, uf any.
   */
  animationCallback(inCollection) {

    // Delete frame DOM nodes.
    for (let i = 0; i < this.frameCount; i++) {
      const id = `explosion${this.explosionNumber}${i}`;
      webix.html.remove(webix.toNode(id));
    }

    // Delete the game object from the collection.
    delete inCollection[`e${this.explosionNumber}`];

    // It's a little ugly to have a game object "aware" of the main game object, but in
    // this case it's the easiest approach to know when to show the player again after
    // the explosion completes.
    if (!wxGame.player.isVisible) {
      wxGame.player.show();
    }

  } /* End animationCallback(). */


} /* End Crystal. */
