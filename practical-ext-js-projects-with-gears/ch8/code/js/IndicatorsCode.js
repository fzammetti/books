/*
    Dueling Cards - From the book "Practical Ext JS Projects With Gears"
    Copyright (C) 2008 Frank W. Zammetti
    fzammetti@omnytex.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses.
*/


/**
 *
 */
DuelingCards.createAndPositionIndicators = function() {

  // Determine starting X location for positioning idicators.
  var startX = (DuelingCards.viewSize.width -
    (DuelingCards.imageSizes.card.widthWithPadding *
    DuelingCards.numActionCards)) / 2;

  // Determine Y location for arrow indicators on top.
  var upArrowY =
    ((DuelingCards.viewSize.height - DuelingCards.imageSizes.card.height) / 2) -
      DuelingCards.imageSizes.arrowIndicator.width;

  // Determine Y location for suit change indicators on top.
  var suitChangeYTop = upArrowY -
    DuelingCards.imageSizes.suitChangeIndicator.height - 4;

  // Determine Y location for arrow indicators on bottom.
  var downArrowY =
    ((DuelingCards.viewSize.height - DuelingCards.imageSizes.card.height) / 2) +
    DuelingCards.imageSizes.card.height;

  // Determine Y location for suit change indicators on bottom.
  var suitChangeYBottom = downArrowY +
    DuelingCards.imageSizes.arrowIndicator.height + 4;

  for (var i = 0; i < DuelingCards.numActionCards; i++) {

    // Create up arrow indicators.
    var img = new Ext.Element(document.createElement("img"));
    img.set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src"),
      id : "upArrowIndicator_" + i
    });
    img.setSize(DuelingCards.imageSizes.arrowIndicator.width,
      DuelingCards.imageSizes.arrowIndicator.height);
    DuelingCards.contentEl.appendChild(img);
    img.position("absolute", 1, startX +
      (DuelingCards.imageSizes.card.widthWithPadding * i) +
        ((DuelingCards.imageSizes.card.width -
        DuelingCards.imageSizes.arrowIndicator.width) / 2),
      upArrowY);

    // Create down arrow indicators.
    img = new Ext.Element(document.createElement("img"));
    img.set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src"),
      id : "downArrowIndicator_" + i
    });
    img.setSize(DuelingCards.imageSizes.arrowIndicator.width,
      DuelingCards.imageSizes.arrowIndicator.height);
    DuelingCards.contentEl.appendChild(img);
    img.position("absolute", 1, startX +
      (DuelingCards.imageSizes.card.widthWithPadding * i) +
        ((DuelingCards.imageSizes.card.width -
        DuelingCards.imageSizes.arrowIndicator.width) / 2),
      downArrowY);

    // Create suit change indicator on top.
    img = new Ext.Element(document.createElement("img"));
    img.set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src"),
      id : "topSuitChangeIndicator_" + i
    });
    img.setSize(DuelingCards.imageSizes.suitChangeIndicator.width,
      DuelingCards.imageSizes.suitChangeIndicator.height);
    DuelingCards.contentEl.appendChild(img);
    img.position("absolute", 1, startX +
      (DuelingCards.imageSizes.card.widthWithPadding * i) +
        ((DuelingCards.imageSizes.card.width -
        DuelingCards.imageSizes.suitChangeIndicator.width) / 2),
      suitChangeYTop);

    // Create suit change indicator on bottom.
    img = new Ext.Element(document.createElement("img"));
    img.set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src"),
      id : "bottomSuitChangeIndicator_" + i
    });
    img.setSize(DuelingCards.imageSizes.suitChangeIndicator.width,
      DuelingCards.imageSizes.suitChangeIndicator.height);
    DuelingCards.contentEl.appendChild(img);
    img.position("absolute", 1, startX +
      (DuelingCards.imageSizes.card.widthWithPadding * i) +
        ((DuelingCards.imageSizes.card.width -
        DuelingCards.imageSizes.suitChangeIndicator.width) / 2),
      suitChangeYBottom);

  } // End for.

} // End DuelingCards.createAndPositionIndicators().


/**
 * Draws the action card indicators.  Can also change one or more indicators.
 *
 * @param inWhichToChange If null then all indicators are changed.  If a
 *                        number 0-5 then only that card will be changed.
 */
DuelingCards.drawActionCardIndicators = function(inWhichToChange) {

  for (var i = 0; i < DuelingCards.numActionCards; i++) {

    var card = DuelingCards.actionCards[i];
    if (inWhichToChange == null || inWhichToChange == i) {
      // Change this card.  Randomly decide if the next card must go up or
      // down, by one or two, whether the color can be changed and whether
      // the suit can be changed.
      card.singleOrDouble = DuelingCards.genRandom(0, 1) == 0 ? "1" : "2";
      card.upOrDown = DuelingCards.genRandom(0, 1) == 0 ? "up" : "down";
      card.suitChangeable = DuelingCards.genRandom(0, 1) == 0 ? false : true;
    }

    // Set all indicators around this card to the Pixel Of Destiny to start.
    Ext.get("upArrowIndicator_" + i).set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src")
    });
    Ext.get("downArrowIndicator_" + i).set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src")
      });
    Ext.get("topSuitChangeIndicator_" + i).set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src")
    });
    Ext.get("bottomSuitChangeIndicator_" + i).set({
      src : DuelingCards.images.pixelOfDestiny.getAttributeNS("", "src")
    });

    // Now switch the image on the appropriate elements to the correct images.
    var arrow = Ext.get("upArrowIndicator_" + i);
    if (card.upOrDown == "down") {
      arrow = Ext.get("downArrowIndicator_" + i);
    }
    arrow.set({
      src :
        DuelingCards.images[card.upOrDown + card.singleOrDouble].getAttributeNS(
          "", "src")
    });

    // Now do the same for the suit change indicator.
    if (card.suitChangeable) {
      var suitChangeIndicator = null;
      if (card.upOrDown == "up") {
        suitChangeIndicator = Ext.get("topSuitChangeIndicator_" + i);
      } else {
        suitChangeIndicator = Ext.get("bottomSuitChangeIndicator_" + i);
      }
      suitChangeIndicator.set({
        src : DuelingCards.images["suits_change"].getAttributeNS("", "src")
      });
    }

  } // End for.

}; // End DuelingCards.drawActionCardIndicators().
