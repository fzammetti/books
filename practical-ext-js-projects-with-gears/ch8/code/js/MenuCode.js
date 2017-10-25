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
 * Creates the Menu icon in the upper left-hand corner.
 */
DuelingCards.setupMenu = function() {

  var menu = new Ext.Element(document.createElement("img"));
  menu.set({
    src : DuelingCards.images.menu0.getAttributeNS("", "src"),
    style : "cursor:pointer"
  });
  menu.setSize(DuelingCards.imageSizes.menuButton.width,
    DuelingCards.imageSizes.menuButton.height);
  DuelingCards.contentEl.appendChild(menu);
  menu.position("absolute", 99, 5, 5);
  menu.addListener("mouseover", function() {
    if (DuelingCards.initComplete) {
      this.set({ src : DuelingCards.images.menu1.getAttributeNS("", "src") });
    }
  });
  menu.addListener("mouseout", function() {
    if (DuelingCards.initComplete) {
      this.set({ src : DuelingCards.images.menu0.getAttributeNS("", "src") });
    }
  });
  menu.addListener("click", function() {

    if (DuelingCards.initComplete) {
      // If the title is currently showing, puff it out before showing the
      // Window, otherwise just show the Window immediately.
      if (DuelingCards.images.title1.isVisible()) {
        DuelingCards.images.title1.puff({ duration : 1 });
        DuelingCards.images.title2.puff({ duration : 1 });
        DuelingCards.images.title3.puff({
          duration : 1, callback : DuelingCards.showMenu
        });
      } else {
        DuelingCards.showMenu();
      }
    }
  });

} // End DuelingCards.setupMenu().


/**
 * Shows the menu Window when the Menu button is clicked.
 */
DuelingCards.showMenu = function() {

  // Pause the game if in progress.
  if (DuelingCards.gameInProgress) {
    DuelingCards.gamePaused = true;
    DuelingCards.workerPool.sendMessage({
      msg : "game_paused"
    }, DuelingCards.opponentWorker);
  }

  // Show the menu Window.
  var w = Ext.getCmp("menuWindow");
  if (!w) {
    w = new Ext.Window({
      title : "Dueling Cards Main Menu", closable : false, modal : true,
      width : 372, height : 180, minimizable : false, resizable : false,
      draggable : false, shadowOffset : 8,
      id : "menuWindow", animateTarget : "divSource", listeners : {
        beforeshow : function() {
          // Set fields with current values for pageBackground and cardDeck.
          Ext.getCmp("menuForm").getForm().setValues({
            pageBackground : DuelingCards.pageBackground,
            cardDeck : DuelingCards.cDeck
          });
          // Enable Resume Game Button, if applicable.
          if (DuelingCards.gameInProgress) {
            Ext.getCmp("resumeGameButton").setDisabled(false);
          }
        }
      },
      buttons : [
        /* How To Play Button. */
        { text : "How To Play",
          handler : function() {
            if (DuelingCards.howToPlayShowing) {
              DuelingCards.howToPlayShowing = false;
              var w = Ext.getCmp("menuWindow");
              w.setPosition(w.getPosition()[0], w.getPosition()[1] + 110);
              w.setHeight(180);
            } else {
              DuelingCards.howToPlayShowing = true;
              var w = Ext.getCmp("menuWindow");
              w.setPosition(w.getPosition()[0], w.getPosition()[1] - 110);
              w.setHeight(400);
            }
          }
        },
        /* New Game Button. */
        { text : "New Game",
          handler : function() {
            if (DuelingCards.gameInProgress) {
              Ext.MessageBox.show({
                animEl : "divSource",
                buttons : Ext.MessageBox.YESNO, closable : false,
                msg : "There is a game in progress.  Click YES to abort it " +
                  "and begin a new game, or click NO to continue the " +
                  "game in progress", title : "Start new game?",
                fn : function(inButtonID) {
                  Ext.getCmp("menuWindow").hide();
                  if (inButtonID == "yes") {
                    DuelingCards.startGame();
                  }
                }
              });
            } else {
              Ext.getCmp("menuWindow").hide();
              DuelingCards.startGame();
            }
          }
        },
        /* Resume Game Button. */
        { text : "Resume Game", disabled : true, id : "resumeGameButton",
          handler : function() {
            DuelingCards.gamePaused = false;
            DuelingCards.workerPool.sendMessage({
              msg : "game_resumed"
            }, DuelingCards.opponentWorker);
            Ext.getCmp("menuWindow").hide();
          }
        }
      ],
      items : [
        {
          xtype : "form", id : "menuForm", bodyStyle : "padding:4px",
          frame : true, labelWidth : 130,
          items : [
            { xtype : "combo", width : 100, editable : false, border : false,
              triggerAction : "all", mode : "local", valueField : "val",
              displayField : "disp", name : "pageBackground",
              fieldLabel : "Background", store : new Ext.data.SimpleStore({
                fields : ["val", "disp"], data : [
                  [ "goldRuffles", "Gold Ruffles" ],
                  [ "grey", "Grey" ],
                  [ "marble", "Marble" ],
                  [ "party", "Party" ],
                  [ "sky", "Sky" ]
                ]
              }),
              listeners : {
                select : function(inComboBox, inRecord, inIndex) {
                  DuelingCards.pageBackground = inRecord.get("val");
                  Ext.getBody().setStyle("background-image",
                    "url('img/pageBacks/" + DuelingCards.pageBackground +
                    ".gif')");
                }
              }
            },
            { xtype : "combo", width : 140, editable : false, border : false,
              triggerAction : "all", mode : "local", valueField : "val",
              displayField : "disp", name : "cardDeck",
              fieldLabel : "Card Deck", store : new Ext.data.SimpleStore({
                fields : ["val", "disp"], data : [
                  [ "basicBlue", "Basic Blue" ],
                  [ "basicRed", "Basic Red" ],
                  [ "ashley", "Ashley's Drawing" ]
                ]
              }),
              listeners : {
                select : function(inComboBox, inRecord, inIndex) {
                  DuelingCards.cDeck = inRecord.get("val");
                  // Change the images for each of the three card stacks.
                  Ext.get("imgDealerStack").set({
                    src :
                      DuelingCards.images[DuelingCards.cDeck].getAttributeNS("",
                        "src")
                  });
                  Ext.get("imgOpponentStack").set({
                    src :
                      DuelingCards.images[DuelingCards.cDeck].getAttributeNS("",
                        "src")
                  });
                  Ext.get("imgPlayerStack").set({
                    src :
                      DuelingCards.images[DuelingCards.cDeck].getAttributeNS("",
                        "src")
                  });
                }
              }
            },
            { xtype : "slider", fieldLabel : "Difficulty", width : 100,
              value : 2, increment : 1, minValue : 1, maxValue : 3,
              isFormField : true,
              listeners : {
                change : function(inSlider, inValue) {
                  var dt = Ext.getCmp("difficultyText");
                  switch (inValue) {
                    case 1:
                      dt.setValue("Easy");
                    break;
                    case 2:
                      dt.setValue("Medium");
                    break;
                    case 3:
                      dt.setValue("Hard");
                    break;
                  }
                }
              }
            },
            { xtype : "textfield", readOnly:true, fieldLabel : "&nbsp;",
              style : "background:#dfe8f6;border:0px solid #ffffff",
              labelSeparator : "&nbsp;", id : "difficultyText",
              value : "Medium" }
          ]
        },
        { id : "howToPlayArea", height : 208, autoScroll : true,
          bodyStyle : "background-color:#ffffff;padding:4px",
          html : "<b><u>The Goal</u></b><br>" +
            "The goal of Dueling Cards is to get rid of all your cards " +
            "before your computer opponent does.<br><br>" +
            "<b><u>The Basic Of Play</u></b><br>" +
            "To do this you place your cards on the 'action' cards in the " +
            "middle of the screen.  You simply drag one of your visible " +
            "cards onto an action card and drop it there.  If the drop is " +
            "valid then the action card as well as your card will be " +
            "replaced with new ones.  If the move is not valid your card " +
            "will snap back to its starting position.<br><br>" +
            "What card you can place on which action card is determined by " +
            "the indicators above and below them.  For example, a single " +
            "up arrow above an action card means you can only place the next " +
            "card that would follow that one in ascending order and it must " +
            "be of the same suit.  So, a four of clubs for example can only " +
            "be placed on the three of clubs in that case.  Two arrows " +
            "means the card after the next one (so the five of clubs if the " +
            "action card with the double up arrow above it was the three of " +
            "clubs.  The same goes for down arrows below the action cards, " +
            "but now you must place the card that comes before the action " +
            "card, or two cards before it.  So, a two of clubs could be " +
            "placed on the 3 of clubs action card with a single down arrow " +
            "below it.<br><br>" +
            "If there is a cycling sequence of card suits above or below " +
            "the arrow of a given action card, that means you can place " +
            "any suit you wish down, but you still must follow the rule of " +
            "the arrow.<br><br>" +
            "<b><u>Jokers Truly Are Wild!</u></b><br>" +
            "Jokers in your hand can be put down on " +
            "ANY action card, and likewise, a joker action card will accept " +
            "any card at all placed on it.<br><br>" +
            "<b><u>Dealing New Cards</u></b><br>" +
            "If you cannot find any matches, you can click your stack of " +
            "cards to the left of your visible cards to bring up the next " +
            "five cards on your stack.<br><br>" +
            "You can also click the dealer's stack on the far left to deal " +
            "six new action cards any time you don't see a move you can " +
            "make.<br><br>" +
            "<b><u>The Catch</u></b><br>" +
            "This is called DUELING Cards for a reason though: you are in a " +
            "race to get rid of all your cards before the computer does, and " +
            "the computer is probably faster than you and can drop more than " +
            "one card at a time!  " +
            "The one advantage you have is that your opponent CANNOT request " +
            "new action card from the dealer, only you can.  However, if you " +
            "miss an opportunity by mistake it will be some time before you " +
            "see that opportunity again (the action cards currently showing " +
            "are put on the bottom of the dealer's stack, so you'll see them " +
            "again, but it could be a while!).  So, be careful dealing new " +
            "action cards because not only can you make a mistake but you " +
            "obviously open up new chances for your opponent too.<br><br>" +
            "<b><u>Miscellaneous Stuff</u></b><br>" +
            "You can play this game at three difficulty levels, the only" +
            "difference being how fast the computer makes its moves (every " +
            "7 seconds on easy, every 5 seconds on medium and every 3 " +
            "seconds on hard, assuming there is a valid move to make.<br><br>" +
            "You can also choose from a few different page backgrounds and " +
            "card deck styles.  None of this has any real impact on the game " +
            "of course, other than certain backgrounds you may find more " +
            "comfortable to look at while playing.<br><br>" +
            "This menu can be brought up at any time by clicking the Menu " +
            "button in the upper left-hand corner (which obviously you know " +
            "since that's how you got here to read this!).  The game will be " +
            "paused when the menu is brought up, and you can start a new " +
            "game at any time from here if you've gotten into a no-win " +
            "situation or just know you're getting your butt handed to you!"
        }
      ]
    });
  }
  w.show();

}; // End DuelingCards.showMenu().
