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
 * Initialize the application.
 */
DuelingCards.init = function() {

  // Cache some references for performance.
  DuelingCards.contentEl = Ext.getBody();
  DuelingCards.viewSize = DuelingCards.contentEl.getViewSize();

  // Preload all images.
  DuelingCards.preloadImages();

  // Create menu image and hook up events.
  DuelingCards.setupMenu();

  // Create card "stacks".
  DuelingCards.createCardStackImages();

  // Create card descriptors.
  DuelingCards.createCardDescriptors();

  // Create and position the indicators around each Action card.
  DuelingCards.createAndPositionIndicators();

  // Override drag-and-drop events as necessary.
  Ext.override(Ext.dd.DDProxy, {

    /* Event when a player card begins being dragged. */
    startDrag : function(inX, inY) {
      var playerCard = Ext.get(this.getEl());
      playerCard.addClass("cssDDHover");
    },

    /* Event when a dragged player card hovers over an action card. */
    onDragOver : function(inElement, inTargetID) {
      // Only do something if item is over the drop target.
      if (inTargetID.indexOf("actionCard") != -1) {
        // Record this as the drop target for when dragging stops.
        var dropTarget = Ext.get(inTargetID);
        DuelingCards.lastTarget = dropTarget;
        // Style the drop target.
        dropTarget.addClass("cssDDHover");
      }
    },

    /* Event when a dragged player card leaves an action card. */
    onDragOut : function(inElement, inTargetID) {
      // Clear the recorded drop target.
      DuelingCards.lastTarget = null;
      if (inTargetID.indexOf("actionCard") != -1) {
        // If leaving the destination container, remove the hover style.
        Ext.get(inTargetID).removeClass("cssDDHover");
      }
    },

    /* Event when a dragged player card stops being dragged. */
    endDrag : function() {
      // Clear style on dragged card.
      var playerCard = Ext.get(this.getEl());
      playerCard.removeClass("cssDDHover");
      // Only do more if the item is over a drop target.
      if (DuelingCards.lastTarget) {
        DuelingCards.lastTarget.removeClass("cssDDHover");
        DuelingCards.handlePlayerDrop(playerCard.id.split("_")[1],
          DuelingCards.lastTarget.id.split("_")[1]);
        // Clear lastTarget for next time.
        DuelingCards.lastTarget = null;
      }
    }

  });

  // Configure opponent-related stuff.
  DuelingCards.initOpponent();

  // Run the title sequence.
  DuelingCards.doTitle();

} // End DuelingCards.init().


/**
 * Preloads all images for performance.
 */
DuelingCards.preloadImages = function() {

  // First, preload card images.  There's 14 cards in each suit, so create an
  // img Element for each and add it to the appropriate array in
  // DuelingCards.images.
  for (var i = 2; i < 15; i++) {
    // Clubs.
    var club = new Ext.Element(document.createElement("img"));
    club.set({ src : "img/cardFaces/clubs" + i + ".gif" });
    club.setSize(DuelingCards.imageSizes.card.width,
      DuelingCards.imageSizes.card.height);
    DuelingCards.images.clubs.push(club);
    // Diamonds.
    var diamond = new Ext.Element(document.createElement("img"));
    diamond.set({ src : "img/cardFaces/diamonds" + i + ".gif" });
    diamond.setSize(DuelingCards.imageSizes.card.width,
      DuelingCards.imageSizes.card.height);
    DuelingCards.images.diamonds.push(diamond);
    // Hearts.
    var heart = new Ext.Element(document.createElement("img"));
    heart.set({ src : "img/cardFaces/hearts" + i + ".gif" });
    heart.setSize(DuelingCards.imageSizes.card.width,
      DuelingCards.imageSizes.card.height);
    DuelingCards.images.hearts.push(heart);
    // Spades.
    var spade = new Ext.Element(document.createElement("img"));
    spade.set({ src : "img/cardFaces/spades" + i + ".gif" });
    spade.setSize(DuelingCards.imageSizes.card.width,
      DuelingCards.imageSizes.card.height);
    DuelingCards.images.spades.push(spade);
  }
  // Now load the single Joker image.
  var joker = new Ext.Element(document.createElement("img"));
  joker.set({ src : "img/cardFaces/joker.gif" });
  joker.setSize(DuelingCards.imageSizes.card.width,
    DuelingCards.imageSizes.card.height);
  DuelingCards.images.joker.push(joker);

  // Next, preload the card deck background images.
  var basicBlue = new Ext.Element(document.createElement("img"));
  basicBlue.set({ src : "img/cardBacks/basicBlue.gif" });
  basicBlue.setSize(DuelingCards.imageSizes.card.width,
    DuelingCards.imageSizes.card.height);
  DuelingCards.images.basicBlue = basicBlue;
  var basicRed = new Ext.Element(document.createElement("img"));
  basicRed.set({ src : "img/cardBacks/basicRed.gif" });
  basicRed.setSize(DuelingCards.imageSizes.card.width,
    DuelingCards.imageSizes.card.height);
  DuelingCards.images.basicRed = basicRed;
  var ashley = new Ext.Element(document.createElement("img"));
  ashley.set({ src : "img/cardBacks/ashley.gif" });
  ashley.setSize(DuelingCards.imageSizes.card.width,
    DuelingCards.imageSizes.card.height);
  DuelingCards.images.ashley = ashley;

  // Next, preload indicator images.
  for (var i = 1; i < 3; i++) {
    // upX.
    var indicator = new Ext.Element(document.createElement("img"));
    indicator.set({ src : "img/up" + i + ".gif" });
    indicator.setSize(DuelingCards.imageSizes.arrowIndicator.width,
      DuelingCards.imageSizes.arrowIndicator.height);
    DuelingCards.images["up" + i] = indicator;
    // downX.
    indicator = new Ext.Element(document.createElement("img"));
    indicator.set({ src : "img/down" + i + ".gif" });
    indicator.setSize(DuelingCards.imageSizes.arrowIndicator.width,
      DuelingCards.imageSizes.arrowIndicator.height);
    DuelingCards.images["down" + i] = indicator;
  }
  // Suits_change.
  var indicator = new Ext.Element(document.createElement("img"));
  indicator.set({ src : "img/suits_change.gif" });
  indicator.setSize(DuelingCards.imageSizes.suitChangeIndicator.width,
    DuelingCards.imageSizes.suitChangeIndicator.height);
  DuelingCards.images.suits_change = indicator;

  // Preload the two menu images.
  for (var i = 0; i < 2; i++) {
    var menuImg = new Ext.Element(document.createElement("img"));
    menuImg.set({ src : "img/menu" + i + ".gif" });
    menuImg.setSize(DuelingCards.imageSizes.menuButton.width,
      DuelingCards.imageSizes.menuButton.height);
    DuelingCards.images["menu" + i] = menuImg;
  }

  // Preload the win image.
  DuelingCards.images.win = new Ext.Element(document.createElement("img"));
  DuelingCards.images.win.set({ src : "img/win.gif" });
  DuelingCards.images.win.setSize(DuelingCards.imageSizes.win.width,
    DuelingCards.imageSizes.win.height);
  DuelingCards.contentEl.appendChild(DuelingCards.images.win);
  DuelingCards.images.win.position("absolute", 5,
    (DuelingCards.viewSize.width - DuelingCards.imageSizes.win.width) / 2,
    (DuelingCards.viewSize.height - DuelingCards.imageSizes.win.height) / 2
  );
  DuelingCards.images.win.hide();

  // Preload the lose image.
  DuelingCards.images.lose = new Ext.Element(document.createElement("img"));
  DuelingCards.images.lose.set({ src : "img/lose.gif" });
  DuelingCards.images.lose.setSize(DuelingCards.imageSizes.lose.width,
    DuelingCards.imageSizes.lose.height);
  DuelingCards.contentEl.appendChild(DuelingCards.images.lose);
  DuelingCards.images.lose.position("absolute", 5,
    (DuelingCards.viewSize.width - DuelingCards.imageSizes.lose.width) / 2,
    (DuelingCards.viewSize.height - DuelingCards.imageSizes.lose.height) / 2
  );
  DuelingCards.images.lose.hide();

  // Load the first line of the title.
  DuelingCards.images.title1 =
    new Ext.Element(document.createElement("img"));
  DuelingCards.images.title1.set({ src : "img/title1.gif" });
  DuelingCards.images.title1.setSize(5000, 5000);
  DuelingCards.contentEl.appendChild(DuelingCards.images.title1);
  DuelingCards.images.title1.position("absolute", 100,
    ((DuelingCards.viewSize.width - 5000) / 2),
    ((DuelingCards.viewSize.height - 5000) / 2)
  );

  // Load the second line of the title.
  DuelingCards.images.title2 =
    new Ext.Element(document.createElement("img"));
  DuelingCards.images.title2.set({ src : "img/title2.gif" });
  DuelingCards.images.title2.setSize(5000, 5000);
  DuelingCards.contentEl.appendChild(DuelingCards.images.title2);
  DuelingCards.images.title2.hide();
  DuelingCards.images.title2.position("absolute", 100,
    ((DuelingCards.viewSize.width - 5000) / 2),
    ((DuelingCards.viewSize.height - 5000) / 2)
  );

  // Load the third line of the title.
  DuelingCards.images.title3 =
    new Ext.Element(document.createElement("img"));
  DuelingCards.images.title3.set({ src : "img/title3.gif" });
  DuelingCards.images.title3.setSize(5000, 5000);
  DuelingCards.contentEl.appendChild(DuelingCards.images.title3);
  DuelingCards.images.title3.hide();
  DuelingCards.images.title3.position("absolute", 100,
    ((DuelingCards.viewSize.width - 5000) / 2),
    ((DuelingCards.viewSize.height - 5000) / 2)
  );

  // Pixel of Destiny.
  DuelingCards.images.pixelOfDestiny =
    new Ext.Element(document.createElement("img"));
  DuelingCards.images.pixelOfDestiny.set({ src : "img/pixelOfDestiny.gif" });
  DuelingCards.images.pixelOfDestiny.setSize(1, 1);

} // End DuelingCards.preloadImages().


/**
 * Create the three card stack images.
 */
DuelingCards.createCardStackImages = function() {

  // Create card "stack" for dealer and insert it into the DOM at the
  // appropriate location.
  DuelingCards.dealerStackY =
    (DuelingCards.viewSize.height - DuelingCards.imageSizes.card.height) / 2;
  var dealerStackImg = new Ext.Element(document.createElement("img"));
  dealerStackImg.set({
    src : DuelingCards.images[DuelingCards.cDeck].getAttributeNS("", "src"),
    id : "imgDealerStack", style : "cursor:pointer;"
  });
  dealerStackImg.setSize(DuelingCards.imageSizes.card.width,
    DuelingCards.imageSizes.card.height);
  DuelingCards.contentEl.appendChild(dealerStackImg);
  dealerStackImg.position("absolute", 3, 10, DuelingCards.dealerStackY);
  // Handle click.
  dealerStackImg.addListener("click", DuelingCards.dealerStackImgClick);

  // Create card "stack" for opponent and insert it into the
  // DOM at the appropriate locations.
  var opponentStackImg = new Ext.Element(document.createElement("img"));
  opponentStackImg.set({
    src : DuelingCards.images[DuelingCards.cDeck].getAttributeNS("", "src"),
    id : "imgOpponentStack"
  });
  opponentStackImg.setSize(DuelingCards.imageSizes.card.width,
    DuelingCards.imageSizes.card.height);
  DuelingCards.contentEl.appendChild(opponentStackImg);
  opponentStackImg.position("absolute", 1,
    (DuelingCards.viewSize.width -
      (DuelingCards.imageSizes.card.widthWithPadding *
      DuelingCards.numActionCards)) / 2,
    10);
  opponentStackImg.hide();

  // Create card "stack" for player and insert it into the
  // DOM at the appropriate locations.
  var playerStackImg = new Ext.Element(document.createElement("img"));
  playerStackImg.set({
    src : DuelingCards.images[DuelingCards.cDeck].getAttributeNS("", "src"),
    id : "imgPlayerStack", style : "cursor:pointer"
  });
  playerStackImg.setSize(DuelingCards.imageSizes.card.width,
    DuelingCards.imageSizes.card.height);
  DuelingCards.contentEl.appendChild(playerStackImg);
  playerStackImg.addListener("click", DuelingCards.playerStackImgClick);
  playerStackImg.position("absolute", 1,
    (DuelingCards.viewSize.width -
      (DuelingCards.imageSizes.card.widthWithPadding *
      DuelingCards.numActionCards)) / 2,
    DuelingCards.viewSize.height - DuelingCards.imageSizes.card.height - 10);
  playerStackImg.hide();

} // End DuelingCards.createCardStackImages().


/**
 * Create cardDescriptor objects for the six action cards as well as the five
 * opponent and player cards.
 */
DuelingCards.createCardDescriptors = function() {

  // Create cardDescriptors for action cards and insert them into the
  // DOM at the location of the dealer's stack.
  for (var i = 0; i < DuelingCards.numActionCards; i++) {
    var cardDescriptor = DuelingCards.createCardDescriptor();
    cardDescriptor.elem = new Ext.Element(document.createElement("img"));
    cardDescriptor.elem.set({ id : "actionCard_" + i });
    cardDescriptor.elem.setSize(DuelingCards.imageSizes.card.width,
      DuelingCards.imageSizes.card.height);
    DuelingCards.actionCards.push(cardDescriptor);
    DuelingCards.contentEl.appendChild(cardDescriptor.elem);
    cardDescriptor.elem.position("absolute", 2, 10, DuelingCards.dealerStackY);
    new Ext.dd.DropZone("actionCard_" + i);
  }

  // Create cardDescriptors for the player and opponent's cards.  This
  // includes creating an img element for each and inserting it into the DOM.
  var startX = ((DuelingCards.viewSize.width -
    (DuelingCards.imageSizes.card.widthWithPadding *
    DuelingCards.numActionCards)) / 2) +
    DuelingCards.imageSizes.card.widthWithPadding;
  for (var i = 0; i < DuelingCards.numPlayerOpponentCards; i++) {

    // Opponent cards.
    var cardDescriptor = DuelingCards.createCardDescriptor();
    cardDescriptor.elem = new Ext.Element(document.createElement("img"));
    cardDescriptor.elem.setSize(DuelingCards.imageSizes.card.width,
      DuelingCards.imageSizes.card.height);
    DuelingCards.contentEl.appendChild(cardDescriptor.elem);
    cardDescriptor.elem.position("absolute", 2,
      startX + (DuelingCards.imageSizes.card.widthWithPadding * i), 10);
    cardDescriptor.elem.hide();
    DuelingCards.opponentCards.push(cardDescriptor);

    // Player cards.
    cardDescriptor = DuelingCards.createCardDescriptor();
    cardDescriptor.elem = new Ext.Element(document.createElement("img"));
    cardDescriptor.elem.set({ id : "playerCard_" + i });
    cardDescriptor.elem.setSize(DuelingCards.imageSizes.card.width,
      DuelingCards.imageSizes.card.height);
    DuelingCards.contentEl.appendChild(cardDescriptor.elem);
    cardDescriptor.elem.position("absolute", 2,
      startX + (DuelingCards.imageSizes.card.widthWithPadding * i),
      DuelingCards.viewSize.height - DuelingCards.imageSizes.card.height - 10);
    cardDescriptor.elem.hide();
    DuelingCards.playerCards.push(cardDescriptor);
    new Ext.dd.DDProxy("playerCard_" + i);

  } // End for.

} // End DuelingCards.createCardDescriptors().
