/**
 * This class contains all the graphics functions needed in the game.
 */
function GraphicsSubsystem() {


  // Map sizing variables.
  var gridWidth = 32;
  var gridHeight = 24;
  var tileWidth = 20;
  var tileHeight = 20;

  // The drawing surface.
  var surface = null;


  /**
   * Initialize graphics primitives.
   */
  this.init = function() {

    // Calculate actual pixel width and height of grid.
    var gridPixelWidth = gridWidth * tileWidth;
    var gridPixelHeight = gridHeight * tileHeight;

    // Resize container DIV and create Surface.
    var ds = dojo.byId("divSurface");
    ds.style.width = gridPixelWidth + "px";
    ds.style.height = gridPixelHeight + "px";
    ds.style.display = "";
    surface = dojox.gfx.createSurface(
      "divSurface", gridPixelWidth, gridPixelHeight);

    // Create img elements for background tiles.
    var container = dojo.byId("divContainer");
    for (var y = 0; y < gridHeight; y++) {
      for (var x = 0; x < gridWidth; x++) {
        var i = document.createElement("img");
        i.id = "imgBackground_" + x + "_" + y;
        i.style.position = "absolute";
        i.style.display = "none";
        i.style.left = (x * tileWidth) + "px";
        i.style.top = (y * tileHeight) + "px";
        container.appendChild(i);
      }
    }

  } // End init().


  /**
   * Draw the specified level map on the screen.
   *
   * @param  inLevelMap The map of the level to draw.
   * @return            The starting location for the blob in the form "x,y".
   */
  this.drawLevel = function(inLevelMap) {

    var retVal = "";

    // Clear the surface.
    this.clearSurface();

    // Show all background tiles and set the appropriate graphic.
    for (var y = 0; y < gridHeight; y++) {
      for (var x = 0; x < gridWidth; x++) {
        var tile = dojo.byId("imgBackground_" + x + "_" + y);
        tile.style.display = "";
        tile.src = "img/" + inLevelMap[0].background + ".gif";
      }
    }

    // Overlay the actual play tiles.
    for (var i = 0; i < inLevelMap.length; i++) {

      var xBase = inLevelMap[i].x * tileWidth;
      var yBase = inLevelMap[i].y * tileWidth;
      switch (inLevelMap[i].type) {

        // Bridge piece.
        case "bridge":
          // Nothing to draw, background shines through.
          dojo.byId("imgBackground_" + inLevelMap[i].x + "_" +
            inLevelMap[i].y).style.display = "none";
        break;

        // Dead end.
        case "deadend":
          this.drawDeadEnd(surface, xBase, yBase);
          dojo.byId("imgBackground_" +
            inLevelMap[i].x + "_" + inLevelMap[i].y).style.display = "none";
        break;

        // Rock.
        case "rock":
          this.drawRock(surface, xBase, yBase);
          dojo.byId("imgBackground_" +
            inLevelMap[i].x + "_" + inLevelMap[i].y).style.display = "none";
        break;

        case "skull":
          this.drawSkull(surface, xBase, yBase);
          dojo.byId("imgBackground_" +
            inLevelMap[i].x + "_" + inLevelMap[i].y).style.display = "none";
        break;

        case "start":
          // Nothing to draw, background shines through.
          dojo.byId("imgBackground_" +
            inLevelMap[i].x + "_" + inLevelMap[i].y).style.display = "none";
          // Record the location for the caller.
          retVal = inLevelMap[i].x + "," + inLevelMap[i].y;
        break;

        case "end":
          this.drawDoorway(surface, xBase, yBase);
          dojo.byId("imgBackground_" +
            inLevelMap[i].x + "_" + inLevelMap[i].y).style.display = "none";
        break;

      } // End switch.

    } // End for.

    return retVal;

  } // End drawLevel().


  /**
   * Draw the blob on the screen.
   *
   * @param inBlobX The X tile location the blob is on.
   * @param inBlobY The Y tile location the blob is on.
   */
  this.drawBlob = function(inBlobX, inBlobY) {

    var x = inBlobX * tileWidth;
    var y = inBlobY * tileHeight;
    var b = dojo.byId("imgBlob");
    b.style.display = "";
    b.style.left = x;
    b.style.top = y;

  } // End drawBlob().


  /**
   * Draw text on a surface.
   *
   * @param inSurface The dojox.gfx Surface to draw on.
   * @param inX       The X location to draw the text at.
   * @param inY       The Y location to draw the text at.
   * @param inSize    The size of the text in points.
   * @param inColoc   The color of the text (fill color).
   * @param inText    The text to draw.
   */
  this.drawText = function(inSurface, inX, inY, inSize, inColor, inText) {

    var txt = inSurface.createText({ x : inX, y : inY, text : inText });
    txt.setFont({ family : "Times", size : inSize + "pt", weight : "bold" });
    txt.setFill(inColor);

  } // End drawText().


  /**
   * Draw a skull tile.
   *
   * @param inSurface The surface to draw on.
   * @param inXBase   X location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   * @param inYBase   Y location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   */
  this.drawSkull = function(inSurface, inXBase, inYBase) {

    // Fill background to white.
    inSurface.createRect({
      x : inXBase, y : inYBase, width : 20, height : 20
      }).setStroke({ color : "white" }).setFill("white");

    // Draw skull.
    inSurface.createRect({
      x : inXBase + 4, y : inYBase, width : 12, height : 2
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase + 2, y : inYBase + 2, width : 2, height : 2
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase + 16, y : inYBase + 2, width : 2, height : 2
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase, y : inYBase + 4, width : 2, height : 10
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase + 18, y : inYBase + 4, width : 2, height : 10
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase + 4, y : inYBase + 6, width : 4, height : 5
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase + 12, y : inYBase + 6, width : 4, height : 5
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase + 2, y : inYBase + 14, width : 2, height : 4
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createLine({ x1 : inXBase + 6, y1 : inYBase + 14,
      x2 : inXBase + 6, y2 : inYBase + 17 }).setStroke({
        color : "black" });
    inSurface.createRect({
      x : inXBase + 9, y : inYBase + 14, width : 2, height : 4
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createLine({ x1 : inXBase + 13, y1 : inYBase + 14,
      x2 : inXBase + 13, y2 : inYBase + 17 }).setStroke({
        color : "black" });
    inSurface.createRect({
      x : inXBase + 16, y : inYBase + 14, width : 2, height : 4
      }).setStroke({ color : "black" }).setFill("black");
    inSurface.createRect({
      x : inXBase + 4, y : inYBase + 18, width : 12, height : 2
      }).setStroke({ color : "black" }).setFill("black");

  } // End drawSkull().


  /**
   * Draw a doorway tile.
   *
   * @param inSurface The surface to draw on.
   * @param inXBase   X location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   * @param inYBase   Y location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   */
  this.drawDoorway = function(inSurface, inXBase, inYBase) {

    // Fill background to white.
    inSurface.createRect({
      x : inXBase, y : inYBase, width : 20, height : 20
      }).setStroke({ color : "white" }).setFill("white");

    // Draw the archway.
    inSurface.createRect({ x : inXBase + 4, y : inYBase + 0,
      width : 12, height : 2 }).setStroke({
        color : "black" }).setFill("black");
    inSurface.createRect({ x : inXBase + 2, y : inYBase + 2,
      width : 16, height : 2 }).setStroke({
        color : "black" }).setFill("black");
    inSurface.createRect({ x : inXBase, y : inYBase + 4,
      width : 20, height : 2 }).setStroke({
        color : "black" }).setFill("black");
    inSurface.createRect({ x : inXBase, y : inYBase + 6,
      width : 2, height : 13 }).setStroke({
        color : "black" }).setFill("black");
    inSurface.createRect({ x : inXBase + 18, y : inYBase + 6,
      width : 2, height : 13 }).setStroke({
        color : "black" }).setFill("black");

    // Draw the "perspective" triangle in the middle.
    inSurface.createPolyline([
      { x : inXBase + 4, y : inYBase + 20},
      { x : inXBase + 9, y : inYBase + 15},
      { x : inXBase + 10, y : inYBase + 15},
      { x : inXBase + 15, y : inYBase + 20}
    ]).setFill([0, 0, 0, 1]);

  } // End drawDoorway().


  /**
   * Draw a deadend tile.
   *
   * @param inSurface The surface to draw on.
   * @param inXBase   X location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   * @param inYBase   Y location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   */
  this.drawDeadEnd = function(inSurface, inXBase, inYBase) {

    inSurface.createRect({
      x : inXBase, y : inYBase, width : 20, height : 20
      }).setStroke({ color : "#4e4e4e" }).setFill("#b0b0b0");
    inSurface.createLine({ x1 : inXBase + 1, y1 : inYBase + 4,
      x2 : inXBase + 20, y2 : inYBase + 4 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 1, y1 : inYBase + 9,
      x2 : inXBase + 20, y2 : inYBase + 9 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 1, y1 : inYBase + 14,
      x2 : inXBase + 20, y2 : inYBase + 14 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 4, y1 : inYBase + 1,
      x2 : inXBase + 4, y2 : inYBase + 4 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 14, y1 : inYBase + 1,
      x2 : inXBase + 14, y2 : inYBase + 4 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 9, y1 : inYBase + 5,
      x2 : inXBase + 9, y2 : inYBase + 9 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 4, y1 : inYBase + 10,
      x2 : inXBase + 4, y2 : inYBase + 14 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 14, y1 : inYBase + 10,
      x2 : inXBase + 14, y2 : inYBase + 14 }).setStroke({ color : "#6e6e6e" });
    inSurface.createLine({ x1 : inXBase + 9, y1 : inYBase + 15,
      x2 : inXBase + 9, y2 : inYBase + 19 }).setStroke({ color : "#6e6e6e" });

  } // End drawDeadEnd().


  /**
   * Draw a rock.
   *
   * @param inSurface The surface to draw on.
   * @param inXBase   X location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   * @param inYBase   Y location of the upper left-hand corner serving as the
   *                  relative base for the drawing operations.
   */
  this.drawRock = function(inSurface, inXBase, inYBase) {

    surface.createImage({
      type : "image", width : 20, height : 20, src : "img/rock.gif",
      x : inXBase, y : inYBase
    });

  } // End drawRock().


  /**
   * Clear the surface, then show the "You Win" graphic.
   */
  this.drawWin = function() {

    this.clearSurface();
    var w = 361;
    var h = 80;
    surface.createImage({
      type : "image", width : w, height : h, src : "img/win.gif",
      x : ((gridWidth * tileWidth) - w) / 2,
      y : (((gridHeight * tileHeight) - h) / 2) - 10
    });

  } // End drawWin().


  /**
   * Clear the surface, then show the "You lose" graphic.
   */
  this.drawDead = function() {

    this.clearSurface();
    var w = 422;
    var h = 114;
    surface.createImage({
      type : "image", width : w, height : h, src : "img/dead.gif",
      x : ((gridWidth * tileWidth) - w) / 2,
      y : (((gridHeight * tileHeight) - h) / 2) - 10
    });

  } // End drawDead().


  /**
   * Called to clear the main surface and hide all background tiles.
   */
  this.clearSurface = function() {

    // Clear the surface.
    surface.clear();

    // Hide Qwamp.
    dojo.byId("imgBlob").style.display = "none";

    // Hide all background tiles.
    for (var y = 0; y < gridHeight; y++) {
      for (var x = 0; x < gridWidth; x++) {
        var tile = dojo.byId("imgBackground_" + x + "_" + y);
        tile.style.display = "none";
      }
    }

  } // End clearSurface().


} // End DrawingFunctions().
