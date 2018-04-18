"use strict";


class GameObject {


  /**
   * Constructor.
   */
  constructor(inConfig) {

    this.currentFrame = 0;
    this.frameSkipCount = 0;
    this.frameSkip = 0;
    this.xLoc = 0;
    this.yLoc = 0;
    this.baseName = inConfig.baseName;
    this.pixWidth = inConfig.pixWidth;
    this.pixHeight = inConfig.pixHeight;
    this.frameCount = inConfig.frameCount;
    this.isVisible = true;

  } /* End constructor. */


  /**
   * Load the frames for this object.
   *
   * @param inConfig An object with the following properties:
   *                 x ....... X location.
   *                 y ....... Y location.
   *                 z ....... Z index.
   *                 n ....... A value to insert after the base name in the ID.
   *                 hidden .. True if the object is initially hidden.
   */
  loadFrames(inConfig) {

    for (let i = 0; i < this.frameCount; i++) {
      const id = `${this.baseName}${inConfig.n}${i}`;
      const img = webix.html.create("img",
        { id : id, src : `img/${this.baseName}-${i}.png`,
          width : this.pixWidth, height : this.pixHeight
        }
      );
      img.style.position = "absolute";
      img.style.left = `${inConfig.x}px`;
      this.xLoc = inConfig.x;
      img.style.top = `${inConfig.y}px`;
      this.yLoc = inConfig.y;
      if (inConfig.hidden) {
        img.style.display = "none";
      }
      if (inConfig.z) {
        img.style.zIndex = inConfig.z;
      }
      webix.html.insertBefore(img, null, inConfig.playfield);
      this[`frame${i}`] = webix.toNode(id);
    }

  } /* End loadFrames(). */


  /**
   * Animate this object.
   *
   * @param inCollection The collection the object belongs to, uf any.
   */
  animate(inCollection) {

    // Don't animate when not visible.
    if (!this.isVisible) { return; }

    // Adjust how often the animation occurs.
    this.frameSkipCount++;
    if (this.frameSkipCount < this.frameSkip) {
      return;
    }
    this.frameSkipCount = 0;

    // Hide the img of the current frame.
    this[`frame${this.currentFrame}`].style.display = "none";
    // Bump to the next frame, reset when it's time to wrap around.
    this.currentFrame++;
    if (this.currentFrame === this.frameCount) {
      this.currentFrame = 0;
      if (this.animationCallback) {
        this.animationCallback(inCollection);
      }
    }
    // Show the new current frame's img.
    this[`frame${this.currentFrame}`].style.display = "";

  } /* End animate(). */


  /**
   * Show the object.
   */
  show() {

    for (let i = 0; i < this.frameCount; i++) {
      this[`frame${i}`].style.display = "";
    }
    this.isVisible = true;

  } /* End show(). */


  /**
   * Hide the object.
   */
  hide() {

    for (let i = 0; i < this.frameCount; i++) {
      this[`frame${i}`].style.display = "none";
    }
    this.isVisible = false;

  } /* End hide(). */


  /**
   * Randomly position this game object.
   *
   * @return boolean True if the player and this object collided (meaning the object
   *                 needs to be repositioned), false if not.
   */
  randomlyPosition() {

    // Choose a new location, avoiding the edges of the screen.
    const min = Math.ceil(70);
    const max = Math.floor(730);
    this.xLoc = Math.floor(Math.random() * (max - min + 1)) + min;

    // Hide and move the object.
    for (let i = 0; i < this.frameCount; i++) {
      this[`frame${i}`].style.display = "none";
      this[`frame${i}`].style.left = `${this.xLoc}px`;
    }

    // See if this object hits the player.  If not then show the object.
    const didCollide =  wxGame.collision(this);
    if (!didCollide) {
      for (let i = 0; i < this.frameCount; i++) {
        this[`frame${i}`].style.display = "";
      }
    }

    return didCollide;

  } /* End randomlyPosition(). */


  /**
   * Move game object to a specified location.
   */
  moveTo(inX, inY) {

    for (let i = 0; i < this.frameCount; i++) {
      this[`frame${i}`].style.left = `${inX}px`;
      this[`frame${i}`].style.top = `${inY}px`;
    }

  } /* End moveTo(). */


} /* End GameObject. */
