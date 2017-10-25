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
 * Called to start a new game.
 */
DuelingCards.startGame = function() {

  // Show all images, since they may have been hidden by and just ended game.
  Ext.get("imgPlayerStack").show();
  Ext.get("imgOpponentStack").show();
  Ext.get("imgDealerStack").show();
  for (var i = 0; i < DuelingCards.numActionCards; i++) {
    try {
      Ext.get("upArrowIndicator_" + i).show();
      Ext.get("downArrowIndicator_" + i).show();
      Ext.get("topSuitChangeIndicator_" + i).show();
      Ext.get("bottomSuitChangeIndicator_" + i).show();
      DuelingCards.actionCards[i].elem.show();
      DuelingCards.opponentCards[i].elem.show();
      DuelingCards.playerCards[i].elem.show();
    } catch (e) {
      // Squelch exceptions since we know they might occur and it's fine.
    }
  }

  // Make sure ending graphics are hidden too.
  DuelingCards.images.win.hide();
  DuelingCards.images.lose.hide();

  // Get the difficulty level requested.
  var dForm = Ext.getCmp("menuForm").getForm().getValues();
  var selectedDifficulty = dForm.difficultyText.toLowerCase();

  // Signal to opponent to start the game.
  DuelingCards.workerPool.sendMessage({
    msg : "start_game", difficulty : selectedDifficulty
  }, DuelingCards.opponentWorker);

  // Flag game running and not paused.
  DuelingCards.gameInProgress = true;
  DuelingCards.gamePaused = false;

  // Generate three random decks of cards.
  DuelingCards.genDecks();

  // Draw 30 cards from the dealer's stack for the opponent and the player.
  for (var i = 0; i < DuelingCards.numCardsDealt; i++) {
    DuelingCards.opponentStack.push(DuelingCards.dealerStack.shift());
    DuelingCards.playerStack.push(DuelingCards.dealerStack.shift());
  }

  // The number of cards the player and opponent start with.
  DuelingCards.playerCardsRemaining = DuelingCards.numCardsDealt;
  DuelingCards.opponentCardsRemaining = DuelingCards.numCardsDealt;

  // Simulate clicking all three stack images to deal action cards and show
  // both player and opponent cards.
  DuelingCards.dealerStackImgClick();
  DuelingCards.playerStackImgClick();
  DuelingCards.opponentStackImgClick();

} // End DuelingCards.startGame().


/**
 * Generates four decks of cards in random order.
 */
DuelingCards.genDecks = function() {

  // Creating four decks of cards.
  DuelingCards.dealerStack = new Array();
  for (var i = 0; i < 4; i++) {
    var choosen = new Array(54);
    var cardCount = 0;
    // Choose a card at random, see if it's been used already.  If not, add it
    // to the array and continue.  If it's a duplicate then try another.
    // Note: 54 is 52 cards plus 2 jokers per deck.
    while (cardCount < 54) {
      var nextNumber = DuelingCards.genRandom(1, 54);
      if (!choosen[nextNumber]) {
        choosen[nextNumber] = true;
        var card = DuelingCards.createCardDescriptor();
        if (nextNumber >= 1 && nextNumber <= 13) {
          card.suit = "clubs";
          card.faceValue = nextNumber + 1;
        } else if (nextNumber >= 14 && nextNumber <= 26) {
          card.suit = "diamonds";
          card.faceValue = nextNumber - 12;
        } else if (nextNumber >= 27 && nextNumber <= 39) {
          card.suit = "hearts";
          card.faceValue = nextNumber - 25;
        } else if (nextNumber >= 40 && nextNumber <= 52) {
          card.suit = "spades";
          card.faceValue = nextNumber - 38;
        } else if (nextNumber >= 53 && nextNumber <= 54) {
          card.suit = "joker";
          card.faceValue = 2;
        }
        DuelingCards.dealerStack.push(card);
        cardCount = cardCount + 1;
      }
    }
  }

} // End DuelingCards.genDecks().


/**
 * Utility function for generating a random number in a given range.
 *
 * @param  inMin The minimum number to return.
 * @param  inMax The maximum number to return.
 * @return       A number in the range >=inMin<=inMax.
 */
DuelingCards.genRandom = function(inMin, inMax) {

  return Math.floor((inMax - (inMin - 1)) * Math.random()) + inMin;

}; // End DuelingCards.genRandom().


/**
 * Handles when the dealer's stack image is clicked.
 */
DuelingCards.dealerStackImgClick = function() {

  // Only allow clicks if game is in progress.
  if (!DuelingCards.gameInProgress) { return; }

  for (var i = 0; i < DuelingCards.numActionCards; i++) {
    // Cycle card onto the bottom of the dealer's stack.
    if (DuelingCards.actionCards[i].suit &&
      DuelingCards.actionCards[i].faceValue) {
      var card = DuelingCards.createCardDescriptor();
      card.suit = DuelingCards.actionCards[i].suit;
      card.faceValue = DuelingCards.actionCards[i].faceValue;
      DuelingCards.dealerStack.push(card);
    }
    // Deal the next card off the dealer's stack.
    DuelingCards.dealActionCard(i);
  }
  // Randomize and draw indicators.
  DuelingCards.drawActionCardIndicators();

  // Send message to tell opponent what the action cards are.
  var ac = new Array();
  for (var i = 0; i < DuelingCards.actionCards.length; i++) {
    ac.push({
      suit : DuelingCards.actionCards[i].suit,
      faceValue : DuelingCards.actionCards[i].faceValue,
      singleOrDouble : DuelingCards.actionCards[i].singleOrDouble,
      upOrDown : DuelingCards.actionCards[i].upOrDown,
      suitChangeable : DuelingCards.actionCards[i].suitChangeable
    });
  }
  DuelingCards.workerPool.sendMessage({
    msg : "update_action_cards", actionCards : ac
  }, DuelingCards.opponentWorker);

}; // End DuelingCards.dealerStackImgClick().


/**
 * Handles when the player's stack image is clicked.
 */
DuelingCards.playerStackImgClick = function() {

  // Only allow clicks if game is in progress.
  if (!DuelingCards.gameInProgress) { return; }

  for (var i = 0; i < DuelingCards.numPlayerOpponentCards; i++) {
    DuelingCards.dealPlayerOpponentCard("player", i);
  }

}; // End DuelingCards.playerStackImgClick().


/**
 * Deals five new action cards from the dealer's stack.
 *
 * @param inCardNumber The number of the card to deal, 0-5.
 */
DuelingCards.dealActionCard = function(inCardNumber) {

  // Determine Y location to draw card at and the collection to operate on.
  var yPosition = (DuelingCards.viewSize.height -
    DuelingCards.imageSizes.card.height) / 2;

  var card = DuelingCards.actionCards[inCardNumber];
  var cardType = DuelingCards.dealerStack.shift();
  card.suit = cardType.suit;
  card.faceValue = cardType.faceValue;
  card.elem.set({ src :
    DuelingCards.images[card.suit][card.faceValue-2].getAttributeNS("", "src")
  });

  // Determine X location to start drawing card at.
  var startX = (DuelingCards.viewSize.width -
    (DuelingCards.imageSizes.card.widthWithPadding *
    DuelingCards.numActionCards)) / 2;

  // Deal the card by moving it from the dealer's stack to the final location.
  // Note that cards further away from the dealer take slightly longer to
  // get there.
  card.elem.position("absolute", 2, 10, DuelingCards.dealerStackY);
  card.elem.moveTo(
    startX + (DuelingCards.imageSizes.card.widthWithPadding * inCardNumber),
    yPosition,
    { duration : .5 + (inCardNumber * .5) }
  );

}; // End DuelingCards.dealActionCards().


/**
 * Deals a new player or opponent cards from the player or opponent stack.
 *
 * @param  inWhich      Whether to deal a "player" card or "opponent' card.
 * @param  inCardNumber The number of the card to deal, 0-4.
 */
DuelingCards.dealPlayerOpponentCard = function(inWhich, inCardNumber) {

  // Get the card to update.
  var card = DuelingCards[inWhich + "Cards"][inCardNumber];

  // If there's no card left on the stack then hide the image on the page
  // and remove the cardDescriptor from the acive cards.
  if (DuelingCards[inWhich + "Stack"].length == 0) {
    card.elem.hide();
    return;
  }

  // Determine X/Y location to draw card at and the collection to operate on.
  var startX = ((DuelingCards.viewSize.width -
    (DuelingCards.imageSizes.card.widthWithPadding *
    DuelingCards.numActionCards)) / 2) +
    DuelingCards.imageSizes.card.widthWithPadding;
  var yPosition = null;
  if (inWhich == "player") {
    yPosition = DuelingCards.viewSize.height -
      DuelingCards.imageSizes.card.height - 10;
  } else {
    yPosition = 10;
  }

  // Get the cardDescriptor currently used by that card and push it on
  // the end of the stack, if it has a suit and faceValue.
  if (card.suit && card.faceValue) {
    var savedCard = DuelingCards.createCardDescriptor();
    savedCard.suit = card.suit;
    savedCard.faceValue = card.faceValue;
    DuelingCards[inWhich + "Stack"].push(savedCard);
  }

  // Get the next card off the stack.
  var nextCard = DuelingCards[inWhich + "Stack"].shift();
  card.suit = nextCard.suit;
  card.faceValue = nextCard.faceValue;
  card.elem.set({ src :
    DuelingCards.images[card.suit][card.faceValue-2].getAttributeNS("", "src")
  });

  // Slide the new card into view.
  card.elem.show();
  card.elem.position("absolute", 2,
    startX + (DuelingCards.imageSizes.card.widthWithPadding * inCardNumber),
    yPosition);
  card.elem.slideIn();

  // Hide the stack image as appropriate.
  if (DuelingCards[inWhich + "Stack"].length == 0) {
    Ext.get("img" + Ext.util.Format.capitalize(inWhich) + "Stack").hide();
  }

}; // End DuelingCards.dealPlayerOpponentCard().


/**
 * Handles when the player drops one of their cards on an action card.
 *
 * @param inPlayerCardIndex The index of the card that was dropped, 0-4.
 * @param inActionCardIndex The index of the action card it was dropped on, 0-5.
 */
DuelingCards.handlePlayerDrop = function(inPlayerCardIndex, inActionCardIndex) {

  // Get the cardDescriptor of the card the player dragged and the action
  // card they dropped it on.
  var playerCard = DuelingCards.playerCards[inPlayerCardIndex];
  var actionCard = DuelingCards.actionCards[inActionCardIndex];

  // Now figure out if it was a valid drop.
  if (DuelingCards.isValidDrop(playerCard, actionCard)) {
    // It was valid, so reduce the player's card count and set suit and
    // faceValue fields on the playerCard such that if the game hasn't been
    // won then the call to dealPlayerOpponentCard() results in the card
    // either being replaced with one from the stack or removed from the screen.
    DuelingCards.playerCardsRemaining = DuelingCards.playerCardsRemaining - 1;
    playerCard.suit = null;
    playerCard.faceValue = null;
    // See if the player won.
    if (DuelingCards.playerCardsRemaining == 0) {
      playerCard.elem.hide();
      DuelingCards.doEndGame("win");
      return;
    }
    // Player didn't win, so deal a new action card and a new card from
    // the player's stack.
    DuelingCards.dealActionCard(inActionCardIndex);
    DuelingCards.dealPlayerOpponentCard("player", inPlayerCardIndex);
    DuelingCards.drawActionCardIndicators(inActionCardIndex);
  }

} // End DuelingCards.handlePlayerDrop().


/**
 * Determines if a card dropped on an action card was a valid drop.
 *
 * @param  inDroppedCard The cardDescriptor of the card that was dropped.
 * @param  inActionCard  The cardDescriptor of the card it was dropped on.
 * @return               True if the drop was valid, false if not.
 */
DuelingCards.isValidDrop = function(inDroppedCard, inActionCard) {

  // Quick check: if either card was a joker then the drop is always valid.
  if (inDroppedCard.suit == "joker" || inActionCard.suit == "joker") {
    return true;
  }

  // Check single increment face value.
  var actionCardFaceValue = inActionCard.faceValue;
  if (inActionCard.singleOrDouble == "1" && inActionCard.upOrDown == "up") {
    if (actionCardFaceValue == 14) { actionCardFaceValue = 1; }
    if (inDroppedCard.faceValue != (actionCardFaceValue + 1)) { return false; }
  }

  // Check double increment face value.
  actionCardFaceValue = inActionCard.faceValue;
  if (inActionCard.singleOrDouble == "2" && inActionCard.upOrDown == "up") {
    if (actionCardFaceValue == 13) { actionCardFaceValue = 0; }
    if (actionCardFaceValue == 14) { actionCardFaceValue = 1; }
    if (inDroppedCard.faceValue != (actionCardFaceValue + 2)) { return false; }
  }

  // Check single decrement face value.
  actionCardFaceValue = inActionCard.faceValue;
  if (inActionCard.singleOrDouble == "1" && inActionCard.upOrDown == "down") {
    if (actionCardFaceValue == 2) { actionCardFaceValue = 15; }
    if (inDroppedCard.faceValue != (actionCardFaceValue - 1)) { return false; }
  }

  // Check double decrement face value.
  actionCardFaceValue = inActionCard.faceValue;
  if (inActionCard.singleOrDouble == "2" && inActionCard.upOrDown == "down") {
    if (actionCardFaceValue == 3) { actionCardFaceValue = 16; }
    if (actionCardFaceValue == 2) { actionCardFaceValue = 15; }
    if (inDroppedCard.faceValue != (actionCardFaceValue - 2)) { return false; }
  }

  // Check for matching suit if suit is not changeable.
  if (!inActionCard.suitChangeable && inActionCard.suit != inDroppedCard.suit) {
    return false;
  }

  // All validations passed, drop is valid.
  return true;

} // End DuelingCards.isValidDrop().


/**
 * Called when the game ends.  Displays the appropriate end screen.
 */
DuelingCards.doEndGame = function(inOutcome) {

  // Mark game as over.
  DuelingCards.gameInProgress = false;

  // Hide all images so the ending graphic shows up nice.
  Ext.get("imgPlayerStack").hide();
  Ext.get("imgOpponentStack").hide();
  Ext.get("imgDealerStack").hide();
  for (var i = 0; i < DuelingCards.numActionCards; i++) {
    try {
      Ext.get("upArrowIndicator_" + i).hide();
      Ext.get("downArrowIndicator_" + i).hide();
      Ext.get("topSuitChangeIndicator_" + i).hide();
      Ext.get("bottomSuitChangeIndicator_" + i).hide();
      DuelingCards.actionCards[i].elem.hide();
      DuelingCards.opponentCards[i].elem.hide();
      DuelingCards.playerCards[i].elem.hide();
    } catch (e) {
      // Squelch exceptions since we know they might occur and it's fine.
    }
  }

  // Fade in appropriate image.
  switch (inOutcome) {
    case "win":
      DuelingCards.images.win.fadeIn({ duration : 1 });
    break;
    case "lose":
      DuelingCards.images.lose.fadeIn({ duration : 1 });
    break;
  }

} // End DuelingCards.doEndGame().


/**
 * Shows the title sequence when the application starts up.
 */
DuelingCards.doTitle = function() {

  var imgTitle1 = DuelingCards.images.title1;
  var imgTitle2 = DuelingCards.images.title2;
  var imgTitle3 = DuelingCards.images.title3;

  // Bring in the first line of the title.
  imgTitle1.scale(DuelingCards.imageSizes.title1.width,
    DuelingCards.imageSizes.title1.height, { duration : 1 });
  imgTitle1.moveTo(
    ((DuelingCards.viewSize.width - DuelingCards.imageSizes.title1.width) / 2),
    ((DuelingCards.viewSize.height -
      DuelingCards.imageSizes.title1.height) / 2) - 60,
    { duration : 1, callback : function() {
        // Bring in the second line of the title.
        imgTitle2.show();
        imgTitle2.scale(DuelingCards.imageSizes.title2.width,
          DuelingCards.imageSizes.title2.height,
          { duration : 1 });
        imgTitle2.moveTo(
          ((DuelingCards.viewSize.width -
            DuelingCards.imageSizes.title2.width) / 2),
          ((DuelingCards.viewSize.height -
            DuelingCards.imageSizes.title2.height) / 2),
          { duration : 1, callback : function() {
              // Bring in the third line of the title.
              imgTitle3.show();
              imgTitle3.scale(DuelingCards.imageSizes.title3.width,
                DuelingCards.imageSizes.title3.height,
                { duration : 1 });
              imgTitle3.moveTo(
                ((DuelingCards.viewSize.width -
                  DuelingCards.imageSizes.title3.width) / 2),
                ((DuelingCards.viewSize.height -
                  DuelingCards.imageSizes.title3.height) / 2) + 30,
                { duration : 1, callback : function() {
                    // Flag initialization complete.
                    DuelingCards.initComplete = true;
                  }
                }
              );
            }
          }
        );
      }
    }
  );

} // End DuelingCards.doTitle().
