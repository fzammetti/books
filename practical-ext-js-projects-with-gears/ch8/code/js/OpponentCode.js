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
 * Initializes opponent-related stuff.
 */
DuelingCards.initOpponent = function() {

  // Register WorkerPool callback.
  DuelingCards.workerPool.onmessage = DuelingCards.workerPoolCallback;

  // Convert the opponentWorkerFunction to a string so it can be used by the
  // WorkerPool.createWorker() method.
  var s = DuelingCards.opponentWorkerFunction.toString();

  // Trim opening and closing function portions of the string.
  s = s.substr(14);
  s = s.substring(0, s.length - 2);

  // Create the opponentWorker.
  DuelingCards.opponentWorker = DuelingCards.workerPool.createWorker(s);

} // End DuelingCards.initOpponent().


/**
 * This is the opponent worker code that implements opponent logic.
 */
DuelingCards.opponentWorkerFunction = function() {

  // The collection of opponent card cardDescriptor objects.  This duplicates
  // the DuelingCards.opponentCards collection internal to this Worker.
  var opponentCards = null;

  // The collection of action card cardDescriptor objects.  This duplicates
  // the DuelingCards.actionCards collection internal to this Worker.
  var actionCards = null;

  // The difficulty level the game was started at: 7=easy, 5=medium, or 3=hard.
  var difficulty = null;

  // The Gears Timer object we'll use to process game loop events.
  var timer = google.gears.factory.create("beta.timer");

  // Reference to the interval created to fire the gameLoop() method
  // periodically.
  var gameLoopInterval = null;

  // Reference to the message sender, i.e., the WorkerPool outside this Worker.
  var sender = null;

  /**
   * Method called when messages are sent from outside the WorkerPool.
   *
   * @param inMessagesText The text of the message (not used, but must be
   *                       present to fulfill the method contract).
   * @param inSenderID     The ID of the sender Worker or WorkerPool (not used,
   *                       but must be present to fulfill the method contract).
   * @param inMsg          The message object containing all details of the
   *                       received message.
   */
  google.gears.workerPool.onmessage = function(
    inMessageText, inSenderID, inMsg) {

    switch (inMsg.body.msg) {

      // Handle start_game message.  Sent when a new game is starting.
      case "start_game":
        sender = inMsg.sender;
        // Set up difficulty settings.
        if (inMsg.body.difficulty == "easy") {
          difficulty = 7;
        } else if (inMsg.body.difficulty == "medium") {
          difficulty = 5;
        } else if (inMsg.body.difficulty == "hard") {
          difficulty = 3;
        }
        gameLoopInterval = timer.setInterval(gameLoop, difficulty * 1000);
      break;

      // Handle end_game message.  Sent when either the player or opponent
      // wins the game.
      case "end_game":
        timer.clearInterval(gameLoopInterval);
      break;

      // Handle game_paused message.  Sent when the menu is shown.
      case "game_paused":
        timer.clearInterval(gameLoopInterval);
      break;

      // Handle game_resumed message.  Sent when the menu is dismissed and
      // the game is resumed.
      case "game_resumed":
        gameLoopInterval = timer.setInterval(gameLoop, difficulty * 1000);
      break;

      // Handle update_action_cards message.  Sent when any of the action cards
      // is replaced.
      case "update_action_cards":
        timer.clearInterval(gameLoopInterval);
        // Save local reference to the action cards.
        actionCards = new Array();
        for (var i = 0; i < inMsg.body.actionCards.length; i++) {
          actionCards.push(inMsg.body.actionCards[i]);;
        }
        gameLoopInterval = timer.setInterval(gameLoop, difficulty * 1000);
      break;

      // Handle update_opponent_cards message.  Sent when any of the opponent's
      // visible cards is replaced.
      case "update_opponent_cards":
        timer.clearInterval(gameLoopInterval);
        // Save local reference to the opponent's cards.
        opponentCards = new Array();
        for (var i = 0; i < inMsg.body.opponentCards.length; i++) {
          opponentCards.push(inMsg.body.opponentCards[i]);;
        }
        gameLoopInterval = timer.setInterval(gameLoop, difficulty * 1000);
      break;

    } // End switch.

  }; // End onmessage.

  /**
   * This is the main game loop method called every X seconds, based on
   * selected difficulty, to make opponent moves.
   */
  function gameLoop() {

    // Cycle through the action cards and for each figure out what
    // card is needed and see if the opponent is showing that card.
    var usedCards = new Array(6);
    var noMatchesFound = true;
    for (var i = 0; i < 6; i++) {
      var faceValue = actionCards[i].faceValue;
      if (actionCards[i].singleOrDouble == "1" &&
        actionCards[i] == "up") {
        if (faceValue == 14) { faceValue = 1; }
        faceValue = faceValue + 1
      }
      if (actionCards[i].singleOrDouble == "2" &&
        actionCards[i].upOrDown == "up") {
        if (faceValue == 13) { faceValue = 0; }
        if (faceValue == 14) { faceValue = 1; }
        faceValue = faceValue + 2;
      }
      if (actionCards[i].singleOrDouble == "1" &&
        actionCards[i].upOrDown == "down") {
        if (faceValue == 2) { faceValue = 15; }
        faceValue = faceValue - 1;
      }
      if (actionCards[i].singleOrDouble == "2" &&
        actionCards[i].upOrDown == "down") {
        if (faceValue == 3) { faceValue = 16; }
        if (faceValue == 2) { faceValue = 15; }
        faceValue = faceValue - 2;
      }

      // Now that we know what card is required, see if that one is
      // showing.
      for (j = 0; j < 5; j++) {
        if (!usedCards[j]) {
          var matchFound = false;
          if (opponentCards[j].suit == "joker" ||
            actionCards[i].suit == "joker") {
            matchFound = true;
          }
          if (opponentCards[j].faceValue == faceValue) {
            if (actionCards[i].suitChangeable ||
              actionCards[i].suit == opponentCards[j].suit) {
              matchFound = true;
            }
          }
          // Drop any matches found onto the action cards.
          if (matchFound) {
            noMatchesFound = false
            usedCards[j] = true;
            google.gears.workerPool.sendMessage({
              msg : "match_found",
              actionCard : i, opponentCard : j
            }, sender);
            break;
          }
        }
      } // End iteration over opponent's cards.
    } // End iteration over action cards.

    // If no matches are found the simulate the opponent clicking their stack.
    if (noMatchesFound) {
      google.gears.workerPool.sendMessage({
        msg : "opponent_stack_img_click"
      }, sender);
    }

  }; // End gameLoop().

}; // End DuelingCards.opponentWorkerFunction().


/**
 * This method is the callback method registered with the Gears WorkerPool.  It
 * handles all messages sent from the opponentWorker.
 *
 * @param inMessageText Not used, required to fulfill method signature contract.
 * @param inSenedID     Not used, required to fulfill method signature contract.
 * @param inMsg         The message object that contains all pertinent details
 *                      about the sent message.
 */
DuelingCards.workerPoolCallback = function(inMessageText, inSenderID, inMsg) {

  // Worker requested a log message be output.
  switch (inMsg.body.msg) {

    // Opponent found a match.
    case "match_found":
      var oCard = DuelingCards["opponentCards"][inMsg.body.opponentCard].elem;
      var aCard = DuelingCards["actionCards"][inMsg.body.actionCard].elem;
      oCard.moveTo(aCard.getX(), aCard.getY(), { duration : 2,
        callback : function() {
          var opponentCard =
            DuelingCards.opponentCards[inMsg.body.opponentCard];
          DuelingCards.opponentCardsRemaining =
            DuelingCards.opponentCardsRemaining - 1;
          opponentCard.suit = null;
          opponentCard.faceValue = null;
          // See if the opponent won.
          if (DuelingCards.opponentCardsRemaining == 0) {
            DuelingCards.workerPool.sendMessage({
              msg : "end_game"
            }, DuelingCards.opponentWorker);
            opponentCard.elem.hide();
            DuelingCards.doEndGame("lose");
            return;
          }
          // Opponent didn't win, so deal a new action card and a new card from
          // the opponent's stack.
          DuelingCards.dealActionCard(inMsg.body.actionCard);
          DuelingCards.dealPlayerOpponentCard("opponent",
            inMsg.body.opponentCard);
          DuelingCards.drawActionCardIndicators(inMsg.body.actionCard);
          // Send to the opponent an updated array of both action cards and
          // their own cards so the OpponentWorker's internal state is
          // consistent with what the main game code knows about.
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
          var oc = new Array();
          for (var i = 0; i < DuelingCards.opponentCards.length; i++) {
            oc.push({
              suit : DuelingCards.opponentCards[i].suit,
              faceValue : DuelingCards.opponentCards[i].faceValue
            });
          }
          DuelingCards.workerPool.sendMessage({
            msg : "update_action_cards", actionCards : ac
          }, DuelingCards.opponentWorker);
          DuelingCards.workerPool.sendMessage({
            msg : "update_opponent_cards", opponentCards : oc
          }, DuelingCards.opponentWorker);
        }
      });
    break;

    // Opponent needs five new cards off their stack.
    case "opponent_stack_img_click":
      if (DuelingCards.opponentCardsRemaining > 5) {
        DuelingCards.opponentStackImgClick();
      }
    break;

  } // End switch.

}; // End DuelingCards.workerPoolCallback().


/**
 * Handles when the opponent's stack image is "clicked".  The user can't
 * literally click the opponent's stack, this is only ever called
 * automatically, but it's named this way to be consistent with the methods
 * for dealing with dealer and player stack clicks.
 */
DuelingCards.opponentStackImgClick = function() {

  // Deal 5 news cards for the opponent.
  for (var i = 0; i < 5; i++) {
    DuelingCards.dealPlayerOpponentCard("opponent", i);
  }

  // Send message to tell opponent what the action cards are.
  var oc = new Array();
  for (var i = 0; i < DuelingCards.opponentCards.length; i++) {
    oc.push({
      suit : DuelingCards.opponentCards[i].suit,
      faceValue : DuelingCards.opponentCards[i].faceValue
    });
  }
  DuelingCards.workerPool.sendMessage({
    msg : "update_opponent_cards", opponentCards : oc
  }, DuelingCards.opponentWorker);

}; // End DuelingCards.opponentStackImgClick().
