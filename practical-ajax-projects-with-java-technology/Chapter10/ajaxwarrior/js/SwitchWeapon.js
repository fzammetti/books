/**
 * This function deals with switching weapons.  It handles all aspects of that
 * game function.
 */
function switchWeapon(inWhichWeapon) {

  if (xhr.request == null) {

    if (inWhichWeapon) {
      // Actually switch weapons.
      gameState.weaponSwitched = true;
      gameState.currentWeapon = inWhichWeapon;
      sendAJAX(switchWeapon, "switchWeapon.command", "?whichWeapon=" +
        inWhichWeapon, null);
    } else {
      gameState.weaponSwitched = false;
      // Show weapon switching view.
      sendAJAX(switchWeapon, "showSwitchWeapon.command", "", null);
    }

  } else {

    if (gameState.weaponSwitched) {
      // Result of actually switching weapon.
      updateActivityScroll(xhr.json.mg);
    } else {
      // Switch to weapon switching view.
      showSecondaryView(xhr.request.responseText,
        Globals.VIEW_SWITCH_WEAPON);
      // Evaluate the returned script block so we get our list of weapons
      // that the player has.  Split it so we have an array later.
      if (xhr.request.responseText.
        match(/<script([^>]{0,100})>([\w|\W]{0,10000})<\/script>/gi)) {
        eval(RegExp.$2);
        gameState.WeaponsPlayerHas = gameState.weaponsPlayerHas.split(" ");
      }
    }
    return true;

  } // End xhr.request == null if.

} // End switchWeapon().



/**
 * This function is called from the switchWeapon() function to determine it
 * the player has a specified weapon or not.
 */
function doesPlayerHaveWeapon(inWeaponCode) {

  var hasIt = false;
  for (i = 0; i < gameState.weaponsPlayerHas.length; i++) {
    if (gameState.weaponsPlayerHas[i] == inWeaponCode) {
      hasIt = true;
      break;
    }
  }
  return hasIt;

} // End doesPlayerHaveWeapon().
