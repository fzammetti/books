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
 * Constants that describe how many action cards are visible, how many player
 * and opponent cards are visible and how many cards are dealt to the player
 * and opponent initially.
 */
DuelingCards.numActionCards = 6;
DuelingCards.numPlayerOpponentCards = 5;
DuelingCards.numCardsDealt = 10;


/**
 * The viewport size information.
 */
DuelingCards.viewSize = null;


/**
 * Which of the page backgrounds is currently in use.
 */
DuelingCards.pageBackground = "marble";


/**
 * Which of the Card decks is currently in use.
 */
DuelingCards.cDeck = "basicBlue";


/**
 * The document's body Element.
 */
DuelingCards.contentEl = null;


/**
 * The collection of action card cardDescriptor objects.  The elem attribute
 * will be populated for objects in this array.
 */
DuelingCards.actionCards = new Array();


/**
 * The collection of player card cardDescriptor objects.  The elem attribute
 * will be populated for objects in this array.
 */
DuelingCards.playerCards = new Array();


/**
 * The collection of player card cardDescriptors on the player stack.
 * The elem attribute will be null for objects in this array.
 */
DuelingCards.playerStack = new Array();


/**
 * The collection of dealer card cardDescriptors on the dealer stack.
 * The elem attribute will be null for objects in this array.
 */
DuelingCards.dealerStack = new Array();


/**
 * The Y location of the dealer's deck.  Needed to source animations.
 */
DuelingCards.dealerStackY = 0;


/**
 * Flag to indicate if initialization has completed.  Needed to avoid the
 * resize event during startup.
 */
DuelingCards.initComplete = false;


/**
 * The last recorded drop target for user dragging.
 */
DuelingCards.lastTarget = null;


/**
 * Set to true when the game has been started.
 */
DuelingCards.gameInProgress = false;


/**
 * Set to true when the game is paused because the menu is showing.
 */
DuelingCards.gamePaused = true;


/**
 * The number of cards the player has left.  Used to determine game conclusion.
 */
DuelingCards.playerCardsRemaining = null;


/**
 * The number of cards the opponent has left.  Used to determine game
 * conclusion.
 */
DuelingCards.opponentCardsRemaining = null;


/**
 * The collection of opponent card cardDescriptor objects.  The elem attribute
 * will be populated for objects in this array.
 */
DuelingCards.opponentCards = new Array();


/**
 * The collection of opponent card cardDescriptors on the opponent stack.
 * The elem attribute will be null for objects in this array.
 */
DuelingCards.opponentStack = new Array();


/**
 * The WorkerPool where the opponentWorker will run.
 */
DuelingCards.workerPool = google.gears.factory.create("beta.workerpool");


/**
 * Flag to tell us if the how to play instructions are showing or not.
 */
DuelingCards.howToPlayShowing = false;


/**
 * A collection where preloaded images are stored..
 */
DuelingCards.images = {
  /* Card images. */
  clubs : new Array(), diamonds : new Array(), hearts : new Array(),
  spades : new Array(), joker : new Array(),
  /* Indicator images. */
  down1 : null, up1 : null, down2 : null, up2 : null,
  suits_change : null,
  /* Menu images. */
  menu0 : null, menu1 : null,
  /* Card deck images. */
  basicBlue : null, basicRed : null, ashley : null,
  /* Win and lose images */
  win : null, lose : null,
  /* Title images */
  title1 : null, title2 : null, title3 : null,
  /* The infamous Pixel of Destiny. */
  pixelOfDestiny : null
};


/**
 * The dimensions of all the preloaded images.
 */
DuelingCards.imageSizes = {
  /* Card images. */
  card : { width : 75, widthWithPadding : 85, height : 107 },
  /* Indicator images. */
  arrowIndicator : { width : 48, height : 48 },
  suitChangeIndicator : { width : 32, height : 32 },
  /* Menu images. */
  menuButton : { width :  100, height : 50 },
  /* Win and lose images */
  win : { width : 380, height : 104 },
  lose : { width : 387, height : 110 },
  /* Title images */
  title1 : { width : 386, height : 66 },
  title2 : { width : 310, height : 31 },
  title3 : { width : 204, height : 33 }
};


/**
 * A simple structure that describes a card in play.
 */
DuelingCards.createCardDescriptor = function() { return {
  // The suit of the card ("clubs", "diamonds", "spades", "hearts", "joker").
  suit : null,
  // The value of the card (2-14, n/a when suit is "joker").
  faceValue : null,
  // The img Element for this card.
  elem : null,
  // This field, for action cards only, tells us whether there is a single or
  // double arrow on this card ("1" or "2").
  singleOrDouble : null,
  // This field, for action cards only, tells us whether the next card must be
  // higher or lower than this one ("up" or "down").
  upOrDown : null,
  // This field, for action cards only, tells us whether the suit of the card
  // can be changed (true or false).
  suitChangeable : null
}; }; // End cardDescriptor.
