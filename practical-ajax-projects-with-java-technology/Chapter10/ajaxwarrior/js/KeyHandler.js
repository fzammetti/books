/**
 * Handles all key events on this page.
 */
function keyUp(e) {

  if (xhr.request == null) {

    // Determine the code of the key that was pressed.  This is a
    // cross-browser method, so at the end, keyCodePressed is the value,
    // regardless of browser.
    var ev = (e) ? e : (window.event) ? window.event : null;
    if (ev) {
      keyCodePressed = (ev.charCode) ? ev.charCode:
        ((ev.keyCode) ? ev.keyCode : ((ev.which) ? ev.which : null));
    }

    // The following keys are valid only when viewing inventory or help...
    if (gameState.currentView == Globals.VIEW_INVENTORY
      || gameState.currentView == Globals.VIEW_HELP) {

      // Spacebar just returns to the map view.
      if (keyCodePressed == Globals.KEY_SPACEBAR) {
        showMapView();
      }

    // The following keys are valid only when in a store...
    } else if (gameState.currentView == Globals.VIEW_STORE) {

      switch (keyCodePressed) {

        case Globals.KEY_SPACEBAR:
          showMapView();
        break;
        case Globals.KEY_1:
          purchaseItem(Globals.STORE_ITEM_DAGGER);
        break;
        case Globals.KEY_2:
          purchaseItem(Globals.STORE_ITEM_STAFF);
        break;
        case Globals.KEY_3:
          purchaseItem(Globals.STORE_ITEM_MACE);
        break;
        case Globals.KEY_4:
          purchaseItem(Globals.STORE_ITEM_SLINGSHOT);
        break;
        case Globals.KEY_5:
          purchaseItem(Globals.STORE_ITEM_CROSSBOW);
        break;
        case Globals.KEY_6:
          purchaseItem(Globals.STORE_ITEM_HEALTH_10);
        break;
        case Globals.KEY_7:
          purchaseItem(Globals.STORE_ITEM_HEALTH_15);
        break;
        case Globals.KEY_8:
          purchaseItem(Globals.STORE_ITEM_HEALTH_25);
        break;
        case Globals.KEY_9:
          purchaseItem(Globals.STORE_ITEM_HEALTH_50);
        break;

      }

    // The following keys are valid only when viewing spell casting view...
    } else if (gameState.currentView == Globals.VIEW_SPELL_CASTING) {

      switch (keyCodePressed) {

        case Globals.KEY_SPACEBAR:
          showMapView();
          // showMapView() sets currentView to MAP, but if the previous view
          // was BATTLE, we basically need to override that now.
          if (gameState.previousView == Globals.VIEW_BATTLE) {
            gameState.currentView = gameState.previousView;
          }
        break;
        case Globals.KEY_F:
          if (doesPlayerHaveSpell(Globals.SPELL_FIRE_RAIN)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            castSpell(Globals.SPELL_FIRE_RAIN);
          }
        break;
        case Globals.KEY_H:
          if (doesPlayerHaveSpell(Globals.SPELL_HEAL_THY_SELF)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            castSpell(Globals.SPELL_HEAL_THY_SELF);
          }
        break;
        case Globals.KEY_T:
          if (doesPlayerHaveSpell(Globals.SPELL_FREEZE_TIME)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            castSpell(Globals.SPELL_FREEZE_TIME);
          }
        break;

      }

    // The following keys are valid only when viewing weapon switching view...
    } else if (gameState.currentView == Globals.VIEW_SWITCH_WEAPON) {

      switch (keyCodePressed) {

        case Globals.KEY_SPACEBAR:
          showMapView();
          // showMapView() sets currentView to MAP, but if the previous view
          // was BATTLE, we basically need to override that now.
          if (gameState.previousView == Globals.VIEW_BATTLE) {
            gameState.currentView = gameState.previousView;
          }
        break;
        case Globals.KEY_B:
          showMapView();
          // showMapView() sets currentView to MAP, but if the previous view
          // was BATTLE, we basically need to override that now.
          if (gameState.previousView == Globals.VIEW_BATTLE) {
            gameState.currentView = gameState.previousView;
          }
          switchWeapon(Globals.WEAPON_NONE);
        break;
        case Globals.KEY_D:
          if (doesPlayerHaveWeapon(Globals.WEAPON_DAGGER)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            switchWeapon(Globals.WEAPON_DAGGER);
          }
        break;
        case Globals.KEY_S:
          if (doesPlayerHaveWeapon(Globals.WEAPON_STAFF)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            switchWeapon(Globals.WEAPON_STAFF);
          }
        break;
        case Globals.KEY_M:
          if (doesPlayerHaveWeapon(Globals.WEAPON_MACE)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            switchWeapon(Globals.WEAPON_MACE);
          }
        break;
        case Globals.KEY_L:
          if (doesPlayerHaveWeapon(Globals.WEAPON_SLINGSHOT)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            switchWeapon(Globals.WEAPON_SLINGSHOT);
          }
        break;
        case Globals.KEY_C:
          if (doesPlayerHaveWeapon(Globals.WEAPON_CROSSBOW)) {
            showMapView();
            // showMapView() sets currentView to MAP, but if the previous view
            // was BATTLE, we basically need to override that now.
            if (gameState.previousView == Globals.VIEW_BATTLE) {
              gameState.currentView = gameState.previousView;
            }
            switchWeapon(Globals.WEAPON_CROSSBOW);
          }
        break;

      }

    // The following keys are valid only when a game ending view is showing...
    } else if (gameState.currentView == Globals.VIEW_GAME_END) {

      // Any key just returns to the welcome screen.
      window.location = "index.jsp";

    // The following keys are valid only when battling a character...
    } else if (gameState.currentView == Globals.VIEW_BATTLE) {

      switch (keyCodePressed) {
        case Globals.KEY_SPACEBAR:
          updateActivityScroll("Fire projectile cancelled");
          gameState.fireProjectile = false;
        break;
        case Globals.KEY_LEFT_ARROW:
          if (gameState.fireProjectile) {
            gameState.fireProjectile = false;
            battleMove("projectile_left");
          } else {
            updateActivityScroll("Move West");
            battleMove("left");
          }
        break;
        case Globals.KEY_RIGHT_ARROW:
          if (gameState.fireProjectile) {
            gameState.fireProjectile = false;
            battleMove("projectile_right");
          } else {
            updateActivityScroll("Move East");
            battleMove("right");
          }
        break;
        case Globals.KEY_UP_ARROW:
          if (gameState.fireProjectile) {
            gameState.fireProjectile = false;
            battleMove("projectile_up");
          } else {
            updateActivityScroll("Move North");
            battleMove("up");
          }
        break;
        case Globals.KEY_DOWN_ARROW:
          if (gameState.fireProjectile) {
            gameState.fireProjectile = false;
            battleMove("projectile_down");
          } else {
            updateActivityScroll("Move South");
            battleMove("down");
          }
        break;
        case Globals.KEY_F:
          if (gameState.currentWeapon == Globals.WEAPON_SLINGSHOT ||
            gameState.currentWeapon == Globals.WEAPON_CROSSBOW) {
            updateActivityScroll("File projectile weapon- " +
              "press arrow key for direction, or SPACEBAR to cancel");
            gameState.fireProjectile = true;
          } else {
            updateActivityScroll("Fire projectile- not currently using a " +
              "projectile weapon");
            gameState.fireProjectile = false;
          }
        break;
        case Globals.KEY_C:
          updateActivityScroll("Cast Spell");
          gameState.fireProjectile = false;
          gameState.previousView = gameState.currentView;
          castSpell();
        break;
        case Globals.KEY_W:
          updateActivityScroll("Switch Weapon");
          gameState.fireProjectile = false;
          gameState.previousView = gameState.currentView;
          switchWeapon();
        break;
      }

    // The following keys are valid only when talking to a character...
    } else if (gameState.currentView == Globals.VIEW_TALKING) {

      switch (keyCodePressed) {
        case Globals.KEY_1:
          talkReply(1);
        break;
        case Globals.KEY_2:
          talkReply(2);
        break;
        case Globals.KEY_3:
          talkReply(3);
        break;
        case Globals.KEY_E:
          stopTalking();
        break;
      }

    // The following keys are valid only in the primary map view...
    } else if (gameState.currentView == Globals.VIEW_MAP) {

      switch (keyCodePressed) {
        case Globals.KEY_LEFT_ARROW:
          updateActivityScroll("West");
          updateMap("left");
        break;
        case Globals.KEY_RIGHT_ARROW:
          updateActivityScroll("East");
          updateMap("right");
        break;
        case Globals.KEY_UP_ARROW:
          updateActivityScroll("North");
          updateMap("up");
        break;
        case Globals.KEY_DOWN_ARROW:
          updateActivityScroll("South");
          updateMap("down");
        break;
        case Globals.KEY_E:
          updateActivityScroll("Enter Community");
          enterCommunity();
        break;
        case Globals.KEY_H:
          updateActivityScroll("Help");
          showHelp();
        break;
        case Globals.KEY_C:
          updateActivityScroll("Cast Spell");
          gameState.previousView = gameState.currentView;
          castSpell();
        break;
        case Globals.KEY_P:
          updateActivityScroll("Pick Up");
          pickUpItem();
        break;
        case Globals.KEY_I:
          updateActivityScroll("Inventory");
          displayInventory();
        break;
        case Globals.KEY_S:
          updateActivityScroll("Save Game");
          saveGame();
        break;
        case Globals.KEY_W:
          updateActivityScroll("Switch Weapon");
          gameState.previousView = gameState.currentView;
          switchWeapon();
        break;
        case Globals.KEY_A:
          toggleTalkAttack();
        break;
        default:
          updateActivityScroll("What?");
        break;

      } // End switch.

    } // End view branch.

  } // End xhr.request check.

  return false;

} // End keyUp().
