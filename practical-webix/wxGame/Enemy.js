"use strict";


/**
 * Game object class: enemy.
 */
class Enemy extends GameObject {


  /**
   * Constructor.
   */
  constructor(inConfig) {

    // Construct base object.
    super((function() {
      return webix.extend(inConfig,
        { pixWidth : 48, pixHeight : 48, frameCount : 2 }
      );
    }()));

    const x = inConfig.x;
    const y = inConfig.y;
    const type = inConfig.type;
    for (let i = 0; i < this.frameCount; i++) {

      const id = `enemy${x}${y}${i}`;
      const img = webix.html.create("img",
        { id : id, src : `img/enemy${type}-${i}.png`,
          width : this.pixWidth, height : this.pixHeight
        }
      );
      img.style.position = "absolute";
      img.style.display = "none";
      this.moveDirection = "right";

      // Types 2 and 4 move left and animate a little slower than types 1 and 3.
      if (type % 2 === 0) {
        this.moveDirection = "left";
        this.frameSkip = 2;
      }

      // Offset the initial locations and make them all types move at different speeds.
      let leftAdjust = 0;
      if (type === 1) { leftAdjust = 0; this.moveSpeed = 10; }
      if (type === 2) { leftAdjust = 80; this.moveSpeed = 6; }
      if (type === 3) { leftAdjust = 120; this.moveSpeed = 14; }
      if (type === 4) { leftAdjust = 200; this.moveSpeed = 8; }

      this.xLoc = x * 300 + leftAdjust;
      this.startingX = this.xLoc;
      img.style.left = `${this.xLoc}px`;
      this.yLoc = y * 120 + 60;
      this.startingY = this.yLoc;
      img.style.top = `${this.yLoc}px`;
      webix.html.insertBefore(img, null, inConfig.playfield);
      this[`frame${i}`] = webix.toNode(id);

    }

  } /* End constructor. */


  /**
   * Move this enemy.
   */
  move() {

    // Don't move when not visible.
    if (!this.isVisible) { return; }

    // Move left or right, wrapping around to the other side when trigger point is hit.
    if (this.moveDirection === "right") {
      this.xLoc = this.xLoc + this.moveSpeed;
      if (this.xLoc >= 850) {
        this.xLoc = -50;
      }
    } else {
      this.xLoc = this.xLoc - this.moveSpeed;
      if (this.xLoc <= -50) {
        this.xLoc = 850;
      }
    }

    // Reposition them based on new xLoc.
    this["frame0"].style.left = `${this.xLoc}px`;
    this["frame1"].style.left = `${this.xLoc}px`;

  } /* End move(). */


} /* End Enemy. */
