package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.MapHandler;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.LinkedHashMap;


/**
 * This class stores all information pertaining to the current state of the
 * game.
 */
public class GameState implements Serializable {


  /**
   * Player's current X location on the current map.
   */
  private int currentLocationX;


  /**
   * Player's current Y location on the current map.
   */
  private int currentLocationY;


  /**
   * Flag to tell us if we are in a community or not.
   */
  private boolean inCommunity;


  /**
   * Player's X location on the main map, saved when entering a community.
   */
  private int mainLocationX;


  /**
   * Player's Y location on the main map, saved when entering a community.
   */
  private int mainLocationY;


  /**
   * Player's X location on the current map, saved when entering battle.
   */
  private int mapLocationX;


  /**
   * Player's Y location on the current map, saved when entering battle.
   */
  private int mapLocationY;


  /**
   * Player's name.
   */
  private String name;


  /**
   * Player's health.
   */
  private int health;


  /**
   * Player's hit points.
   */
  private int hitPoints;


  /**
   * Player's gold pieces.
   */
  private int goldPieces;


  /**
   * Flag: Is the player currently in attack mode?
   */
  private boolean attackMode;


  /**
   * The MapHandler object associated with this game.
   */
  private MapHandler mapHandler;


  /**
   * This is a Map of all the items the player is currently holding.
   */
  private LinkedHashMap inventory;


  /**
   * This is the current mode the game is in.
   */
  private char currentMode;


  /**
   * This is a flag that gets set when the player has won.
   */
  private boolean playerWon;


  /**
   * This is a flag that gets set when the player has died.
   */
  private boolean playerDied;


  /**
   * The GameCharacter object the player is currently talking to, if any.
   */
  private GameCharacter talkCharacter;


  /**
   * What node in the conversation is current, if player is talking to a
   * character.
   */
  private String talkNode;


  /**
   * The current karma value of the character the player is talking to.
   */
  private int karma;


  /**
   * This is the character the playing is doing battle with.
   */
  private GameCharacter battleCharacter;


  /**
   * This is the weapon the player is currently using.  If a blank space, then
   * player is using their bare hands.
   */
  private char currentWeapon;


  /**
   * Flag: Has the Freeze Time spell been cast?
   */
  private boolean freezeTime;


  /**
   * Counter for how many moves are left for Freeze Time spell.
   */
  private int freezeTimeCounter;


  /**
   * This is the number of battle wins the player must get before the next
   * hit point increase.
   */
  private int winsToHPIncrease;


  /**
   * This is a counter of how many wins the player has had since the last
   * hit point increase.
   */
  private int numBattleWins;


  /**
   * This is the client-side GameState object representation.
   */
  private ClientSideGameState clientSideGameState;


  /**
   * Mutator for clientSideGameState.
   *
   * @param inClientSideGameState New value for clientSideGameState.
   */
  public void setClientSideGameState(
    final ClientSideGameState inClientSideGameState) {

    clientSideGameState = inClientSideGameState;

  } // End setClientSideGameState().


  /**
   * Accessor for clientSideGameState.
   *
   * @return Value of clientSideGameState.
   */
  public ClientSideGameState getClientSideGameState() {

    return clientSideGameState;

  } // End getClientSideGameState().


  /**
   * Mutator for numBattleWins.
   *
   * @param inNumBattleWins New value for numBattleWins.
   */
  public void setNumBattleWins(final int inNumBattleWins) {

    numBattleWins = inNumBattleWins;

  } // End setNumBattleWins().


  /**
   * Accessor for numBattleWins.
   *
   * @return Value of numBattleWins.
   */
  public int getNumBattleWins() {

    return numBattleWins;

  } // End getNumBattleWins().


  /**
   * Mutator for winsToHPIncrease.
   *
   * @param inWinsToHPIncrease New value for winsToHPIncrease.
   */
  public void setWinsToHPIncrease(final int inWinsToHPIncrease) {

    winsToHPIncrease = inWinsToHPIncrease;

  } // End setWinsToHPIncrease().


  /**
   * Accessor for winsToHPIncrease.
   *
   * @return Value of winsToHPIncrease.
   */
  public int getWinsToHPIncrease() {

    return winsToHPIncrease;

  } // End getWinsToHPIncrease().


  /**
   * Mutator for freezeTime.
   *
   * @param inFreezeTime New value for freezeTime.
   */
  public void setFreezeTime(final boolean inFreezeTime) {

    freezeTime        = inFreezeTime;
    freezeTimeCounter = Globals.SPELL_FREEZE_TIME_SKIPS;

  } // End setFreezeTime().


  /**
   * Accessor for freezeTime.
   *
   * @return Value of freezeTime.
   */
  public boolean isTimeFrozen() {

    return freezeTime;

  } // End isTimeFrozen().


  /**
   * Mutator for freezeTimeCounter.
   *
   * @param inFreezeTimeCounter New value for freezeTimeCounter.
   */
  public void setFreezeTimeCounter(final int inFreezeTimeCounter) {

    freezeTimeCounter = inFreezeTimeCounter;

  } // End setFreezeTimeCounter().


  /**
   * Accessor for freezeTimeCounter.
   *
   * @return Value of freezeTimeCounter.
   */
  public int getFreezeTimeCounter() {

    return freezeTimeCounter;

  } // End getFreezeTimeCounter().


  /**
   * Mutator for currentWeapon.
   *
   * @param inCurrentWeapon New value for currentWeapon.
   */
  public void setCurrentWeapon(final char inCurrentWeapon) {

    currentWeapon = inCurrentWeapon;

  } // End setCurrentWeapon().


  /**
   * Accessor for currentWeapon.
   *
   * @return Value of currentWeapon.
   */
  public char getCurrentWeapon() {

    return currentWeapon;

  } // End getCurrentWeapon().


  /**
   * Mutator for karma.
   *
   * @param inKarma New value for karma.
   */
  public void setKarma(final int inKarma) {

    karma = inKarma;

  } // End setKarma().


  /**
   * Accessor for karma.
   *
   * @return Value of karma.
   */
  public int getKarma() {

    return karma;

  } // End getKarma().


  /**
   * Mutator for talkNode.
   *
   * @param inTalkNode New value for talkNode.
   */
  public void setTalkNode(final String inTalkNode) {

    talkNode = inTalkNode;

  } // End setTalkNode().


  /**
   * Accessor for talkNode.
   *
   * @return Value of talkNode.
   */
  public String getTalkNode() {

    return talkNode;

  } // End getTalkNode().


  /**
   * Mutator for talkCharacter.
   *
   * @param inTalkCharacter New value for talkCharacter.
   */
  public void setTalkCharacter(final GameCharacter inTalkCharacter) {

    talkCharacter = inTalkCharacter;

  } // End setTalkCharacter().


  /**
   * Accessor for talkCharacter.
   *
   * @return Value of talkCharacter.
   */
  public GameCharacter getTalkCharacter() {

    return talkCharacter;

  } // End getTalkCharacter().


  /**
   * Mutator for playerWon.
   *
   * @param inPlayerWon New value for playerWon.
   */
  public void setPlayerWon(final boolean inPlayerWon) {

    playerWon = inPlayerWon;

  } // End setPlayerWon().


  /**
   * Accessor for playerWon.
   *
   * @return Value of playerWon.
   */
  public boolean getPlayerWon() {

    return playerWon;

  } // End getPlayerWon().


  /**
   * Mutator for playerDied.
   *
   * @param inPlayerDied New value for playerDied.
   */
  public void setPlayerDied(final boolean inPlayerDied) {

    playerDied = inPlayerDied;

  } // End setPlayerDied().


  /**
   * Accessor for playerDied.
   *
   * @return Value of playerDied.
   */
  public boolean getPlayerDied() {

    return playerDied;

  } // End getPlayerDied().


  /**
   * Mutator for currentLocationX.
   *
   * @param inCurrentLocationX Value to set.
   */
  public void setCurrentLocationX(final int inCurrentLocationX) {

    currentLocationX = inCurrentLocationX;

  } // End setCurrentLocationX.


  /**
   * Accessor for currentLocationX.
   *
   * @return Current value.
   */
  public int getCurrentLocationX() {

    return currentLocationX;

  } // End getCurrentLocationX.


  /**
   * Mutator for currentLocationY.
   *
   * @param inCurrentLocationY Value to set.
   */
  public void setCurrentLocationY(final int inCurrentLocationY) {

    currentLocationY = inCurrentLocationY;

  } // End setCurrentLocationY.


  /**
   * Accessor for currentLocationY.
   *
   * @return Current value.
   */
  public int getCurrentLocationY() {

    return currentLocationY;

  } // End getCurrentLocationY.


  /**
   * Mutator for mainLocationX.
   *
   * @param inMainLocationX New value for mainLocationX.
   */
  public void setMainLocationX(final int inMainLocationX) {

    mainLocationX = inMainLocationX;

  } // End setMainLocationX().


  /**
   * Accessor for mainLocationX.
   *
   * @return Value of mainLocationX.
   */
  public int getMainLocationX() {

    return mainLocationX;

  } // End getMainLocationX().


  /**
   * Mutator for mainLocationY.
   *
   * @param inMainLocationY New value for mainLocationY.
   */
  public void setMainLocationY(final int inMainLocationY) {

    mainLocationY = inMainLocationY;

  } // End setMainLocationY().


  /**
   * Accessor for mainLocationY.
   *
   * @return Value of mainLocationY.
   */
  public int getMainLocationY() {

    return mainLocationY;

  } // End getMainLocationY().


  /**
   * Mutator for mapLocationX.
   *
   * @param inMapLocationX Value to set.
   */
  public void setMapLocationX(final int inMapLocationX) {

    mapLocationX = inMapLocationX;

  } // End setMapLocationX.


  /**
   * Accessor for mapLocationX.
   *
   * @return Current value.
   */
  public int getMapLocationX() {

    return mapLocationX;

  } // End getMapLocationX.


  /**
   * Mutator for mapLocationY.
   *
   * @param inMapLocationY Value to set.
   */
  public void setMapLocationY(final int inMapLocationY) {

    mapLocationY = inMapLocationY;

  } // End setMapLocationY.


  /**
   * Accessor for mapLocationY.
   *
   * @return Current value.
   */
  public int getMapLocationY() {

    return mapLocationY;

  } // End getMapLocationY.


  /**
   * Mutator for inCommunity.
   *
   * @param inInCommunity New value for inCommunity.
   */
  public void setInCommunity(final boolean inInCommunity) {

    inCommunity = inInCommunity;

  } // End setInCommunity().


  /**
   * Accessor for inCommunity.
   *
   * @return Value of inCommunity.
   */
  public boolean getInCommunity() {

    return inCommunity;

  } // End getInCommunity().


  /**
   * Mutator for mapHandler.
   *
   * @param inMapHandler Value to set.
   */
  public void setMapHandler(final MapHandler inMapHandler) {

    mapHandler = inMapHandler;

  } // End setMapHandler.


  /**
   * Accessor for mapHandler.
   *
   * @return Current value.
   */
  public MapHandler getMapHandler() {

    return mapHandler;

  } // End getMapHandler.


  /**
   * Mutator for name.
   *
   * @param inName Value to set.
   */
  public void setName(final String inName) {

    name = inName;

  } // End setName.


  /**
   * Accessor for name.
   *
   * @return Current value.
   */
  public String getName() {

    return name;

  } // End getName.


  /**
   * Mutator for health.
   *
   * @param inHealth Value to set.
   */
  public void setHealth(final int inHealth) {

    health = inHealth;

  } // End setHealth.


  /**
   * Accessor for health.
   *
   * @return Current value.
   */
  public int getHealth() {

    return health;

  } // End getHealth.


  /**
   * Mutator for hitPoints.
   *
   * @param inHitPoints Value to set.
   */
  public void setHitPoints(final int inHitPoints) {

    hitPoints = inHitPoints;

  } // End setHitPoints.


  /**
   * Accessor for hitPoints.
   *
   * @return Current value.
   */
  public int getHitPoints() {

    return hitPoints;

  } // End getHitPoints.


  /**
   * Mutator for goldPieces.
   *
   * @param inGoldPieces Value to set.
   */
  public void setGoldPieces(final int inGoldPieces) {

    goldPieces = inGoldPieces;

  } // End setGoldPieces.


  /**
   * Accessor for goldPieces.
   *
   * @return Current value.
   */
  public int getGoldPieces() {

    return goldPieces;

  } // End getGoldPieces.


  /**
   * Mutator for inventory.
   *
   * @param inInventory Value to set.
   */
  public void setInventory(final LinkedHashMap inInventory) {

    inventory = inInventory;

  } // End setInventory.


  /**
   * Accessor for inventory.
   *
   * @return Current value.
   */
  public LinkedHashMap getInventory() {

    return inventory;

  } // End getInventory.


  /**
   * Mutator for attackMode.
   *
   * @param inAttackMode New value for attackMode.
   */
  public void setAttackMode(final boolean inAttackMode) {

    attackMode = inAttackMode;

  } // End setAttackMode().


  /**
   * Accessor for attackMode.
   *
   * @return Value of attackMode.
   */
  public boolean getAttackMode() {

    return attackMode;

  } // End getAttackMode().


  /**
   * Mutator for currentMode.
   *
   * @param inCurrentMode New value for currentMode.
   */
  public void setCurrentMode(final char inCurrentMode) {

    currentMode = inCurrentMode;

  } // End setCurrentMode().


  /**
   * Accessor for currentMode.
   *
   * @return Value of currentMode.
   */
  public char getCurrentMode() {

    return currentMode;

  } // End getCurrentMode().


  /**
   * Method to add an item to inventory.  Note that for most items, the
   * inValue parameter will be null, i.e., for adding Key A, there is only
   * one, so the value doesn't really matter.  For spells though, the
   * inValue will be the number of spell instances to add.
   *
   * @param inItem  Item to add (Map key).
   * @param inValue The value of the item to add (Map value).
   */
  public void addToInventory(final char inItem, final Object inValue) {

    // If the item being added is a spell, what we want to do is increase the
    // count for that spell by 1, if there are any in inventory already, or just
    // add if fresh if it is not there already.
    if (inItem == Globals.SPELL_FIRE_RAIN ||
      inItem == Globals.SPELL_HEAL_THY_SELF ||
      inItem == Globals.SPELL_FREEZE_TIME) {
      Integer iSpellCount = (Integer)inventory.get(Character.toString(inItem));
      if (iSpellCount == null) {
        iSpellCount = new Integer(0);
      }
      int spellCount = iSpellCount.intValue();
      spellCount += ((Integer)inValue).intValue();
      inventory.put(Character.toString(inItem), new Integer(spellCount));
    } else {
      // The item is NOT a spell, just add it outright.
      inventory.put(Character.toString(inItem), inValue);
    }

  } // End addToInventory.


  /**
   * Method to delete an item from inventory.  Provides special handing for
   * spells (i.e., reduce the count and only remove it when it reaches zero).
   *
   * @param inItem Item to remove.
   */
  public void removeFromInventory(final char inItem) {

    // If the item being removed is a spell, what we want to do is reduce the
    // count for that spell by 1, and if it reaches zero, only then do we
    // actually remove the element from the map.
    if (inItem == Globals.SPELL_FIRE_RAIN ||
      inItem == Globals.SPELL_HEAL_THY_SELF ||
      inItem == Globals.SPELL_FREEZE_TIME) {
      int spellCount =
        ((Integer)inventory.get(Character.toString(inItem))).intValue();
      spellCount--;
      if (spellCount == 0) {
        inventory.remove(Character.toString(inItem));
      } else {
        inventory.put(Character.toString(inItem), new Integer(spellCount));
      }
    } else {
      // The item is NOT a spell, just remove it outright.
      inventory.remove(Character.toString(inItem));
    }

  } // End getInventory.


  /**
   * This is called when the player exits battle to restore the location
   * on the previous map.
   */
  public void restoreMapLocation() {

    currentLocationX = mapLocationX;
    currentLocationY = mapLocationY;

  } // End restoreMapLocation.


  /**
   * This is called when the player exits a community to restore the location
   * on the main map.
   */
  public void restoreMainLocation() {

    currentLocationX = mainLocationX;
    currentLocationY = mainLocationY;

  } // End restoreMainLocation.


  /**
   * Called to determine if the player has won the game.
   */
  public void checkGameWon() {

    if (inventory.get(Character.toString(Globals.ARTIFACT_ANKH))    != null &&
      inventory.get(Character.toString(Globals.ARTIFACT_SKULL))     != null &&
      inventory.get(Character.toString(Globals.ARTIFACT_STAFF))     != null &&
      inventory.get(Character.toString(Globals.ARTIFACT_MEDALLION)) != null &&
      inventory.get(Character.toString(Globals.ARTIFACT_SCROLL))    != null) {
      playerWon = true;
    }

  } // End checkGameWon().


  /**
   * Mutator for battleCharacter.
   *
   * @param inBattleCharacter New value for battleCharacter.
   */
  public void setBattleCharacter(final GameCharacter inBattleCharacter) {

    battleCharacter = inBattleCharacter;

  } // End setBattleCharacter().


  /**
   * Accessor for battleCharacter.
   *
   * @return Value of battleCharacter.
   */
  public GameCharacter getBattleCharacter() {

    return battleCharacter;

  } // End getBattleCharacter().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]={");
    boolean firstPropertyDisplayed = false;
    try {
      Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
