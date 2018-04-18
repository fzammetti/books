"use strict";


/**
 * Game object class: player.
 */
class Player extends GameObject {


  /**
   * Constructor.
   */
  constructor(inConfig) {

    // Construct object.
    super((function() {
      return webix.extend(inConfig,
        { pixWidth : 40, pixHeight : 34, frameCount : 2, baseName : "player" }
      );
    }()));

    // Load frames.
    super.loadFrames({
      x : 0, y : 0, playfield : inConfig.playfield, hidden : true, z : 100
    });

    // Put the player at it's starting point.
    this.toStartingPosition();

    // Flags to tell us which direction the player is moving in.
    this.dirUp = false;
    this.dirDown = false;
    this.dirLeft = false;
    this.dirRight = false;

    // The amount of energy the ship has from the crystal and whether it's currently touching
    // the crystal or the planet or neither.
    this.energy = 0;
    this.touchingCrystal = false;
    this.touchingPlanet = false;

  } /* End constructor. */


  /**
   * Position the player to it's starting point.
   */
  toStartingPosition() {

    for (let i = 0; i < this.frameCount; i++) {
      const frame = this[`frame${i}`];
      this.xLoc = 376;
      frame.style.left = `${this.xLoc}px`;
      this.yLoc = 512;
      frame.style.top = `${this.yLoc}px`;
    }

  } /* End toStartingPosition(). */


  /**
   * Move the player.
   */
  move() {

    // Don't move when not visible.
    if (!this.isVisible) { return; }

    // Determine how to move and rotate the player based on direction flags.
    const xMoveSpeed = 5;
    const yMoveSpeed = 5;
    let xAdj = 0;
    let yAdj = 0;
    let degrees = 0;
    if (this.dirUp && !this.dirDown && !this.dirLeft && !this.dirRight) {
      yAdj = -yMoveSpeed;
      degrees = 0;
    } else if (this.dirUp && !this.dirDown && !this.dirLeft && this.dirRight) {
      xAdj = xMoveSpeed;
      yAdj = -yMoveSpeed;
      degrees = 45;
    } else if (!this.dirUp && !this.dirDown && !this.dirLeft && this.dirRight) {
      xAdj = xMoveSpeed;
      degrees = 90
    } else if (!this.dirUp && this.dirDown && !this.dirLeft && this.dirRight) {
      xAdj = xMoveSpeed;
      yAdj = yMoveSpeed;
      degrees = 135;
    } else if (!this.dirUp && this.dirDown && !this.dirLeft && !this.dirRight) {
      yAdj = yMoveSpeed;
      degrees = 180;
    } else if (!this.dirUp && this.dirDown && this.dirLeft && !this.dirRight) {
      xAdj = -xMoveSpeed;
      yAdj = yMoveSpeed;
      degrees = 225;
    } else if (!this.dirUp && !this.dirDown && this.dirLeft && !this.dirRight) {
      xAdj = -xMoveSpeed;
      degrees = 270;
    } else if (this.dirUp && !this.dirDown && this.dirLeft && !this.dirRight) {
      xAdj = -xMoveSpeed;
      yAdj = -yMoveSpeed;
      degrees = 315;
    }
    // Now clear any current classes on the player node.
    for (let i = 0; i < 360; i = i + 45) {
      webix.html.removeCss(this["frame0"], wxGame[`CSS_ROTATE_${i}`]);
      webix.html.removeCss(this["frame1"], wxGame[`CSS_ROTATE_${i}`]);
    }
    // And now, add the new one.
    webix.html.addCss(this["frame0"], wxGame[`CSS_ROTATE_${degrees}`]);
    webix.html.addCss(this["frame1"], wxGame[`CSS_ROTATE_${degrees}`]);

    // Now physically move the player.
    const newX = this.xLoc + xAdj;
    if (newX > 2 && newX < 756) {
      this.xLoc = newX;
    }
    const newY = this.yLoc + yAdj;
    if (newY > 0 && newY < 516) {
      this.yLoc = newY;
    }
    this["frame0"].style.left = `${this.xLoc}px`;
    this["frame1"].style.left = `${this.xLoc}px`;
    this["frame0"].style.top = `${this.yLoc}px`;
    this["frame1"].style.top = `${this.yLoc}px`;

  } /* End move(). */


} /* End Player. */
