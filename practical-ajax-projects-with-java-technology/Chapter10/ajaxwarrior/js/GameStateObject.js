/**
 * This object contains most of our client-side state information.
 */
function GameStateObject() {


  this.activityScroll = new Array();
  this.currentView = null;
  this.previousView = null;
  this.spellCast = false;
  this.weaponSwitched = false;
  this.spellsPlayerHas = null;
  this.weaponsPlayerHas = null;
  this.talkAttackMode = null;
  this.currentWeapon = null;
  this.fireProjectile = false;
  this.projectileTimer = null;
  this.projectileDirection = null;
  this.projectileHit = null;
  this.projectileX = null;
  this.projectileY = null;
  this.projectileEndX = null;
  this.projectileEndY = null;
  this.projectilePreviousX = null;
  this.projectilePreviousY = null;
  this.projectilePreviousTile = null;
  this.projectileMessage = null;
  this.battleEnemyTurn = false;


  // This function returns a string that is a serialized version of this object.
  // This is used when saving the game.
  this.serialize = function() {

    var sgs = "<gameState>";
    sgs += "<talkAttackMode>" + this.talkAttackMode + "</talkAttackMode>";
    sgs += "<currentWeapon>" + this.currentWeapon + "</currentWeapon>";
    sgs += "<activityScroll>";
    for (i = 0; i < this.activityScroll.length; i++) {
      sgs += "<entry>" + this.activityScroll[i] + "</entry>";
    }
    sgs += "</activityScroll>";
    // Only the talkAttackMode field has to be saved.  All others are either
    // known (i.e., currentView will always be the main map view) or
    // transient (i.e., weaponSwitched).
    sgs += "</gameState>";
    return sgs;

  } // End serialize().


  /**
   * This function accepts the serialized string version of the gameState
   * object for a saved game and reconstitutes the current instance.  This
   * returns the game to the state it was in when it was saved, as far as
   * the client-side gameState instance goes.
   */
  this.reconstitute = function(inClientSideGameState) {

    var a = inClientSideGameState.split("~~~");
    this.talkAttackMode = a[0];
    this.currentWeapon = a[1];
    for (i = 2; i < a.length - 1; i++) {
      gameState.activityScroll[i - 1] = a[i];
    }

  } // End reconstitute().


} // End GameStateObject.
