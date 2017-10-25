/**
 * This function deals with casting a spell.  It handles all aspects of that
 * game function.
 */
function castSpell(inWhichSpell) {

  if (xhr.request == null) {

    if (inWhichSpell) {
      // Actually cast spell.
      gameState.spellCast = true;
      sendAJAX(castSpell, "castSpell.command", "?whichSpell=" + inWhichSpell,
        null);
    } else {
      gameState.spellCast = false;
      // Show spell casting view.
      sendAJAX(castSpell, "showCastSpell.command", "", null);
    }

  } else {

    if (gameState.spellCast) {
      // Result of actually casting a spell.
      updatePlayerInfo(xhr.json.pn, xhr.json.ht, xhr.json.hp, xhr.json.gp);
      updateActivityScroll(xhr.json.mg);
    } else {
      // Switch to spell cast view.
      showSecondaryView(xhr.request.responseText,
        Globals.VIEW_SPELL_CASTING);
      // Evaluate the returned script block so we get our list of spells
      // that the player can cast.  Split it so we have an array later.
      if (xhr.request.responseText.
        match(/<script([^>]{0,100})>([\w|\W]{0,10000})<\/script>/gi)) {
        eval(RegExp.$2);
        gameState.spellsPlayerHas = gameState.spellsPlayerHas.split(" ");
      }
    }
    return true;

  } // End xhr.request == null if.

} // End castSpell().


/**
 * This function is called from the castSpell() function to determine it the
 * player has a specified spell or not.
 */
function doesPlayerHaveSpell(inSpellCode) {

  var hasIt = false;
  for (i = 0; i < gameState.spellsPlayerHas.length; i++) {
    if (gameState.spellsPlayerHas[i] == inSpellCode) {
      hasIt = true;
      break;
    }
  }
  return hasIt;

} // End doesPlayerHaveSpell().
