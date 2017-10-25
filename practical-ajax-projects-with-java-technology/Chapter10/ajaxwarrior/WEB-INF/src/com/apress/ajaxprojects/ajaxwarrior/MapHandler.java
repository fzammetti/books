package com.apress.ajaxprojects.ajaxwarrior;


import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameCharacter;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameConversations;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameItem;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameMaps;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.Random;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class contains methods for working with the game maps, as well as stores
 * things like the items and character arrays for each.
 */
public class MapHandler implements Serializable {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The collection of items placed on main map.
   */
  private ArrayList mainItems;


  /**
   * The collection of items placed on townA map.
   */
  private ArrayList townAItems;


  /**
   * The collection of items placed on townB map.
   */
  private ArrayList townBItems;


  /**
   * The collection of items placed on village map.
   */
  private ArrayList villageItems;


  /**
   * The collection of items placed on castle map.
   */
  private ArrayList castleItems;


  /**
   * The collection of characters placed on main map.
   */
  private ArrayList mainCharacters;


  /**
   * The collection of characters placed on townA map.
   */
  private ArrayList townACharacters;


  /**
   * The collection of characters placed on townB map.
   */
  private ArrayList townBCharacters;


  /**
   * The collection of characters placed on village map.
   */
  private ArrayList villageCharacters;


  /**
   * The collection of characters placed on castle map.
   */
  private ArrayList castleCharacters;


  /**
   * String name of the current map.
   */
  private String currentMapString;


  /**
   * Pointer to the map that is currently in use.
   */
  private ArrayList currentMap = GameMaps.mainMap;


  /**
   * Pointer to the previous map that was used before battle began.
   */
  private ArrayList previousMap;


  /**
   * Pointer to the items collection that is currently in use.
   */
  private ArrayList currentItems = mainItems;


  /**
   * Pointer to the characters collection that is currently in use.
   */
  private ArrayList currentCharacters = mainCharacters;


  /**
   * The battle map currently in use.
   */
  private ArrayList battleMap;


  /**
   * Random number generator.
   */
  private Random generator;


  /**
   * Constructor.  Executed once per game when StartGameCommand is called.
   */
  public MapHandler() {

    generator = new Random(new Date().getTime());

    // ---------- Place static items on all maps. ----------

    // ***** Main.
    placeItems("main");
    // Place Silver key.
    GameItem silverKey = new GameItem();
    silverKey.setType(Globals.ITEM_KEY_SILVER);
    silverKey.setXLocation(10);
    silverKey.setYLocation(90);
    mainItems.add(silverKey);
    // Place Medallion
    GameItem medallion = new GameItem();
    medallion.setType(Globals.ARTIFACT_MEDALLION);
    medallion.setXLocation(61);
    medallion.setYLocation(58);
    mainItems.add(medallion);
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\nitemsmainItems=\n" + mainItems);
    }

    // ***** Town A.
    placeItems("town_a");
    // Place Staff.
    GameItem staff = new GameItem();
    staff.setType(Globals.ARTIFACT_STAFF);
    staff.setXLocation(14);
    staff.setYLocation(79);
    townAItems.add(staff);
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\ntownAItems=\n" + townAItems);
    }

    // ***** Town B.
    placeItems("town_b");
    // Place Skull.
    GameItem skull = new GameItem();
    skull.setType(Globals.ARTIFACT_SKULL);
    skull.setXLocation(46);
    skull.setYLocation(51);
    townBItems.add(skull);
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\ntownBItems=\n" + townBItems);
    }

    // ***** Village.
    placeItems("village");
    // Place Yellow key.
    GameItem yellowKey = new GameItem();
    yellowKey.setType(Globals.ITEM_KEY_YELLOW);
    yellowKey.setXLocation(82);
    yellowKey.setYLocation(92);
    villageItems.add(yellowKey);
    // Place Ankh.
    GameItem ankh = new GameItem();
    ankh.setType(Globals.ARTIFACT_ANKH);
    ankh.setXLocation(46);
    ankh.setYLocation(65);
    villageItems.add(ankh);
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\nvillageItems=\n" + villageItems);
    }

    // ***** Castle.
    placeItems("castle");
    // Place Blue key.
    GameItem blueKey = new GameItem();
    blueKey.setType(Globals.ITEM_KEY_BLUE);
    blueKey.setXLocation(9);
    blueKey.setYLocation(76);
    castleItems.add(blueKey);
    // Place Scroll.
    GameItem scroll = new GameItem();
    scroll.setType(Globals.ARTIFACT_SCROLL);
    scroll.setXLocation(50);
    scroll.setYLocation(27);
    castleItems.add(scroll);
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\ncastleItems=\n" + castleItems);
    }

    // ---------- Place characters on all maps. ----------

    // ***** Main.
    placeCharacters("main");
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\nmainCharacters=\n" + mainCharacters);
    }

    // ***** Town A.
    placeCharacters("town_a");
    // Place Red Keymaster.
    GameCharacter redKeymaster = new GameCharacter();
    redKeymaster.setImmobile(true);
    redKeymaster.setType(Globals.CHARACTER_PEASANT);
    redKeymaster.setXLocation(15);
    redKeymaster.setYLocation(15);
    redKeymaster.setBelligerent(false);
    redKeymaster.setHitPoints(20);
    redKeymaster.setHealth(100);
    redKeymaster.setWeapon(Globals.WEAPON_STAFF);
    redKeymaster.setRedKeymaster(true);
    redKeymaster.setTalkConversation(
      GameConversations.getConversation("peasant_red_keymaster"));
    townACharacters.add(redKeymaster);
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\ntownACharacters=\n" + townACharacters);
    }

    // ***** Town B.
    placeCharacters("town_b");
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\ntownBCharacters=\n" + townBCharacters);
    }

    // ***** Village.
    placeCharacters("village");
    // Placeeen Keymaster.
    GameCharacter greenKeymaster = new GameCharacter();
    greenKeymaster.setImmobile(true);
    greenKeymaster.setType(Globals.CHARACTER_MONK);
    greenKeymaster.setXLocation(85);
    greenKeymaster.setYLocation(85);
    greenKeymaster.setBelligerent(false);
    greenKeymaster.setHitPoints(20);
    greenKeymaster.setHealth(100);
    greenKeymaster.setWeapon(Globals.WEAPON_DAGGER);
    greenKeymaster.setGreenKeymaster(true);
    greenKeymaster.setTalkConversation(
      GameConversations.getConversation("monk_green_keymaster"));
    villageCharacters.add(greenKeymaster);
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\nvillageCharacters=\n" + villageCharacters);
    }

    // ***** Castle.
    placeCharacters("castle");
    if (log.isDebugEnabled()) {
      log.debug("\n\n\n\n\ncastleCharacters=\n" + castleCharacters);
    }

    // Make the main map active.
    switchMap("main");

  } // End constructor.


  /**
   * Returns a chunk of the map data.  This chunk represents the player's
   * viewport into the map, the small 13x13 chunk of it they see at a time.
   * It is constructed by getting the chunk from the actual map, then
   * overlaying items and characters onto the chunk.
   *
   * @param  inCurrentLocationX The current X location of the player.
   * @param  inCurrentLocationY The current Y location of the player.
   * @return                    The chunk of map data for the viewport.
   */
  public ArrayList getChunk(final int inCurrentLocationX,
    final int inCurrentLocationY) {

    int x = 0;
    int y = 0;

    // Get the actual map chunk.
    ArrayList chunk = getBaseMapChunk(inCurrentLocationX, inCurrentLocationY);

    // Now go through the collection of items and place any that
    // are within view.
    for (Iterator it = currentItems.iterator(); it.hasNext();) {
      GameItem item = (GameItem)it.next();
      x = item.getXLocation();
      y = item.getYLocation();
      // If the next item in the collection is within the viewport, replace
      // the appropriate tile with the appropriate character tile.
      if (x >= inCurrentLocationX &&
        x <= (inCurrentLocationX + (Globals.VIEWPORT_WIDTH - 1)) &&
        y >= inCurrentLocationY &&
        y <= (inCurrentLocationY + (Globals.VIEWPORT_HEIGHT - 1))) {
        int row = y - inCurrentLocationY;
        int col = x - inCurrentLocationX;
        StringBuffer targetRow =
          new StringBuffer((String)chunk.get(row));
        targetRow.replace(col, col + 1, Character.toString(item.getType()));
        chunk.set(row, targetRow.toString());
      }
    }

    // Now go through the collection of game characters and place any that
    // are within view.
    for (Iterator it = currentCharacters.iterator(); it.hasNext();) {
      GameCharacter character = (GameCharacter)it.next();
      x = character.getXLocation();
      y = character.getYLocation();
      // If the next character in the collection is within the viewport, replace
      // the appropriate tile with the appropriate character tile.
      if (x >= inCurrentLocationX &&
        x <= (inCurrentLocationX + (Globals.VIEWPORT_WIDTH - 1)) &&
        y >= inCurrentLocationY &&
        y <= (inCurrentLocationY + (Globals.VIEWPORT_HEIGHT - 1))) {
        int row = y - inCurrentLocationY;
        int col = x - inCurrentLocationX;
        StringBuffer targetRow =
          new StringBuffer((String)chunk.get(row));
        targetRow.replace(col, col + 1,
          Character.toString(character.getType()));
        chunk.set(row, targetRow.toString());
      }
    }

    return chunk;

  } // End getChunk().


  /**
   * This method gets the chunk of the underlying current map, NOT including
   * items and characters.
   *
   * @param  inCurrentLocationX The current X location of the player.
   * @param  inCurrentLocationY The current Y location of the player.
   * @return                    Chunk of underlying map.
   */
  public ArrayList getBaseMapChunk(final int inCurrentLocationX,
    final int inCurrentLocationY) {

    ArrayList chunk = new ArrayList();
    for (int y = 0; y < Globals.VIEWPORT_HEIGHT; y++) {
      String row = (String)currentMap.get(inCurrentLocationY + y);
      chunk.add(row.substring(inCurrentLocationX,
        inCurrentLocationX + Globals.VIEWPORT_WIDTH));
    }
    return chunk;

  } // End getBaseMapChunk();


  /**
   * Method to get the tile the player is currently on.
   *
   * @param  inChunk            The map chunk representing the viewport.
   * @return                    The tile code the player is currently on.
   */
  public char getPlayerTile(final ArrayList inChunk) {

    String centerRow = (String)inChunk.get(6);
    return centerRow.charAt(6);

  } // End getPlayerTile().


  /**
   * Switches which map is currently in use.  This is used when entering or
   * exiting a community.
   *
   * @param inWhichMap The name of the map to map current.
   */
  public void switchMap(final String inWhichMap) {

    log.info("Switching to map " + inWhichMap);
    if (inWhichMap.equalsIgnoreCase("previous")) {
      // This is a special case, it should only be called when exiting from
      // battle.
      currentMap = previousMap;
    }
    if (inWhichMap.equalsIgnoreCase("main")) {
      currentMap        = GameMaps.mainMap;
      currentItems      = mainItems;
      currentCharacters = mainCharacters;
      currentMapString  = inWhichMap;
    } else if (inWhichMap.equalsIgnoreCase("town_a")) {
      currentMap        = GameMaps.townAMap;
      currentItems      = townAItems;
      currentCharacters = townACharacters;
      currentMapString  = inWhichMap;
    } else if (inWhichMap.equalsIgnoreCase("town_b")) {
      currentMap        = GameMaps.townBMap;
      currentItems      = townBItems;
      currentCharacters = townBCharacters;
      currentMapString  = inWhichMap;
    } else if (inWhichMap.equalsIgnoreCase("village")) {
      currentMap        = GameMaps.villageMap;
      currentItems      = villageItems;
      currentCharacters = villageCharacters;
      currentMapString  = inWhichMap;
    } else if (inWhichMap.equalsIgnoreCase("castle")) {
      currentMap        = GameMaps.castleMap;
      currentItems      = castleItems;
      currentCharacters = castleCharacters;
      currentMapString  = inWhichMap;
    }

  } // End switchMap().


  /**
   * This method randomly places static items (i.e., gold, health packs, etc.)
   * on a specified map (in the appropriate overlay map more precisely).
   *
   * @param inWhichMap The name of the map to generate items overlay map for.
   */
  private void placeItems(final String inWhichMap) {

    // Determine which map we're generating for and get a pointer to the
    // corresponding item list.
    ArrayList targetCollection  = null;
    ArrayList mapBeingPopulated = null;
    int       numberOfItems     = 0;
    if (inWhichMap.equalsIgnoreCase("main")) {
      log.info("Generating items on map 'main'...");
      mainItems         = new ArrayList();
      targetCollection  = mainItems;
      mapBeingPopulated = GameMaps.mainMap;
      numberOfItems     = Globals.NUM_ITEMS_ON_MAIN_MAP;
    } else if (inWhichMap.equalsIgnoreCase("town_a")) {
      log.info("Generating items on map 'town_a'...");
      townAItems        = new ArrayList();
      targetCollection  = townAItems;
      mapBeingPopulated = GameMaps.townAMap;
      numberOfItems     = Globals.NUM_ITEMS_ON_TOWNA_MAP;
    } else if (inWhichMap.equalsIgnoreCase("town_b")) {
      log.info("Generating items on map 'town_b'...");
      townBItems        = new ArrayList();
      targetCollection  = townBItems;
      mapBeingPopulated = GameMaps.townBMap;
      numberOfItems     = Globals.NUM_ITEMS_ON_TOWNB_MAP;
    } else if (inWhichMap.equalsIgnoreCase("village")) {
      log.info("Generating items on map 'village'...");
      villageItems      = new ArrayList();
      targetCollection  = villageItems;
      mapBeingPopulated = GameMaps.villageMap;
      numberOfItems     = Globals.NUM_ITEMS_ON_VILLAGE_MAP;
    } else if (inWhichMap.equalsIgnoreCase("castle")) {
      log.info("Generating items on map 'castle'...");
      castleItems       = new ArrayList();
      targetCollection  = castleItems;
      mapBeingPopulated = GameMaps.castleMap;
      numberOfItems     = Globals.NUM_ITEMS_ON_CASTLE_MAP;
    }

    // Now generate an Item the number of times appropriate for the map
    // being populated.  For each item, determine its type, and all other
    // characteristics.
    for (int i = 0; i < numberOfItems; i++) {
      GameItem item = new GameItem();
      // Select item type.   0_thru_2
      int type = generator.nextInt(3);
      switch (type) {
        // Health.
        case 0:
          item.setType(Globals.ITEM_HEALTH);
          // (0_thru_9)+1 = 1_thru_10
          item.setValue(generator.nextInt(10) + 1);
          break;
        // Gold.
        case 1:
          item.setType(Globals.ITEM_GOLD);
          // (0_thru_24)+1 = 1_thru_25
          item.setValue(generator.nextInt(25) + 1);
          break;
        // Spell Scroll.
        case 2:
          item.setType(Globals.ITEM_SPELL_SCROLL);
          // (0_thru_2)+1 = 1_thru_3
          item.setValue(generator.nextInt(3) + 1);
          // Set the type of spell.  0_thru_2
          switch (generator.nextInt(3)) {
            case 0:
              item.setSpellType(Globals.SPELL_FIRE_RAIN);
              break;
            case 1:
              item.setSpellType(Globals.SPELL_HEAL_THY_SELF);
              break;
            case 2:
              item.setSpellType(Globals.SPELL_FREEZE_TIME);
              break;
            default:
              log.error("** THIS SHOULD NEVER HAPPEN!");
              break;
          }
          break;
        default:
          log.error("** THIS SHOULD NEVER HAPPEN!");
          break;
      } // End switch.

      // Now determine a location and check to be sure its a valid tile.  Do
      // this until we have a safe location to place the item on.
      pickTile: while (true) {
        // 1_thru_99
        int x = generator.nextInt(Globals.MAP_WIDTH - 1) + 1;
        // 1_thru_99
        int y = generator.nextInt(Globals.MAP_HEIGHT - 1);
        // Get character code of target tile.
        String row                = (String)mapBeingPopulated.get(y);
        char   tileBeingOverlayed = row.charAt(x);
        // Target tile must be one of our item-safe tiles, must not be where
        // the player begins, must be within the player's reach, and must not
        // already have an item.
        if (isItemSafeTile(tileBeingOverlayed) &&
          x != Globals.PLAYER_START_X && y != Globals.PLAYER_START_X &&
          x >= 15 && x <= (Globals.MAP_WIDTH - 15) &&
          y >= 15 && y <= (Globals.MAP_HEIGHT - 15)) {
          boolean tileIsUnoccupied = true;
          for (Iterator it = targetCollection.iterator(); it.hasNext();) {
            GameItem gi = (GameItem)it.next();
            if (x == gi.getXLocation() && y == gi.getYLocation()) {
              tileIsUnoccupied = false;
              break;
            }
          }
          if (tileIsUnoccupied) {
            item.setXLocation(x);
            item.setYLocation(y);
            break pickTile;
          }
        }
      } // End pickTile.

      // Finally, add the item to the collection of items for the
      // map being populated.
      targetCollection.add(item);

    } // End for.


  } // End placeItems().


  /**
   * This method randomly places characters on the map.  Note that it always
   * fills the collection for the specified map.  In other words, if this is
   * being called to initially populate the map, you will get X number of
   * characters created.  If it is called when a character dies in battle,
   * then X - #OnMap will be added (so the net result is that calling with will
   * always result in there being X number of characters on the map).
   *
   * @param inWhichMap Which map to add characters to.
   */
  private void placeCharacters(final String inWhichMap) {

    // Determine which map we're generating for and get a pointer to the
    // corresponding character list.
    ArrayList targetCollection   = null;
    int       numberOfCharacters = 0;
    if (inWhichMap.equalsIgnoreCase("main")) {
      log.info("Generating characters on map 'main'...");
      if (mainCharacters == null) {
        mainCharacters = new ArrayList();
      }
      targetCollection   = mainCharacters;
      numberOfCharacters =
        Globals.NUM_CHARACTERS_ON_MAIN_MAP - targetCollection.size();
    } else if (inWhichMap.equalsIgnoreCase("town_a")) {
      log.info("Generating characters on map 'town_a'...");
      if (townACharacters == null) {
        townACharacters = new ArrayList();
      }
      targetCollection   = townACharacters;
      numberOfCharacters =
        Globals.NUM_CHARACTERS_ON_TOWNA_MAP - targetCollection.size();
    } else if (inWhichMap.equalsIgnoreCase("town_b")) {
      log.info("Generating characters on map 'town_b'...");
      if (townBCharacters == null) {
        townBCharacters = new ArrayList();
      }
      targetCollection   = townBCharacters;
      numberOfCharacters =
        Globals.NUM_CHARACTERS_ON_TOWNB_MAP - targetCollection.size();
    } else if (inWhichMap.equalsIgnoreCase("village")) {
      log.info("Generating characters on map 'village'...");
      if (villageCharacters == null) {
        villageCharacters = new ArrayList();
      }
      targetCollection   = villageCharacters;
      numberOfCharacters =
        Globals.NUM_CHARACTERS_ON_VILLAGE_MAP - targetCollection.size();
    } else if (inWhichMap.equalsIgnoreCase("castle")) {
      log.info("Generating characters on map 'castle'...");
      if (castleCharacters == null) {
        castleCharacters = new ArrayList();
      }
      targetCollection   = castleCharacters;
      numberOfCharacters =
        Globals.NUM_CHARACTERS_ON_CASTLE_MAP - targetCollection.size();
    }

    // Now generate a Character the number of times appropriate for the map
    // being populated.  For each character, determine its type, and all other
    // characteristics.  Since each character type can have different
    // characteristics, there's a lot to fill in.
    for (int i = 0; i < numberOfCharacters; i++) {

      // Create the character randomly.
      GameCharacter character = createCharacter(i);

      // Now determine a location.
      charPickLocation(inWhichMap, character);

      // Finally, add to the appropriate collection.
      targetCollection.add(character);

    } // End for.

  } // End placeCharacters().


  /**
   * This method deletes a character from the collection for the specified map.
   * This is called when the player defeats a character in battle.
   *
   * @param inID The ID of the character to remove.
   */
  public void removeCharacter(final String inID) {

    // Determine which map we're generating for and get a pointer to the
    // corresponding character list.
    ArrayList targetCollection = null;
    log.info("currentMapString = " + currentMapString);
    if (currentMapString.equalsIgnoreCase("main")) {
      log.info("removing character from map 'main'...");
      targetCollection = mainCharacters;
    } else if (currentMapString.equalsIgnoreCase("town_a")) {
      log.info("removing character from map 'town_a'...");
      targetCollection = townACharacters;
    } else if (currentMapString.equalsIgnoreCase("town_b")) {
      log.info("removing character from map 'town_b'...");
      targetCollection = townBCharacters;
    } else if (currentMapString.equalsIgnoreCase("village")) {
      log.info("removing character from map 'village'...");
      targetCollection = villageCharacters;
    } else if (currentMapString.equalsIgnoreCase("castle")) {
      log.info("removing character from map 'castle'...");
      targetCollection = castleCharacters;
    }

    // Iterate over the collection and find the character with the specified
    // ID, then remove it.
    int i = -1;
    for (Iterator it = targetCollection.iterator(); it.hasNext();) {
      i++;
      GameCharacter gc = (GameCharacter)it.next();
      if (inID.equalsIgnoreCase(gc.getId())) {
        // i is now the index of the character to delete.
        break;
      }
    }
    targetCollection.remove(i);

  } // End removeCharacter().


  /**
   * This method is used to randomly create a new character.
   *
   * @param  inIndex When creatimg more than one character, as when a map is
   *                 initially populated, this is the index of the loop used
   *                 to create all of them.  If creating a single chracter,
   *                 just pass any number.
   * @return         A new GameCharacter.
   */
  public GameCharacter createCharacter(final int inIndex) {

    int           b         = 0;
    int           w         = 0;
    GameCharacter character = new GameCharacter();

    // Construct unique ID for this character.  0_thru_999
    int randomID = generator.nextInt(1000);
    character.setId("" + inIndex + randomID + new Date().getTime());

    // Set initial movement direction and count.  0_thru_3
    int newDir = generator.nextInt(4);
    switch (newDir) {
      case 0:
        character.setMoveDir('n');
        break;
      case 1:
        character.setMoveDir('s');
        break;
      case 2:
        character.setMoveDir('e');
        break;
      case 3:
        character.setMoveDir('w');
        break;
      default:
        log.error("** THIS SHOULD NEVER HAPPEN!");
        break;
    }
    character.setMoveCount(0);
    // Select character type and belligerency.  0_thru_6
    int type = generator.nextInt(7);

    switch (type) {

      // Demon.
      case 0:
        character.setTalkConversation(null);
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_DEMON);
        // Demons are always belligerent.
        character.setBelligerent(true);
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(16) + 10);
        character.setHealth(generator.nextInt(51) + 50);
        // 0_thru_2
        w = generator.nextInt(3);
        switch (w) {
          case 0:
            character.setWeapon(Globals.WEAPON_DAGGER);
            break;
          case 1:
            character.setWeapon(Globals.WEAPON_MACE);
            break;
          case 2:
            character.setWeapon(Globals.WEAPON_SLINGSHOT);
            break;
          default:
            log.error("** THIS SHOULD NEVER HAPPEN!");
            break;
        }
        break;
      // Guard.
      case 1:
        // 0_thru_2 + 1 = 1_thru_3
        b = generator.nextInt(3) + 1;
        character.setTalkConversation(
          GameConversations.getConversation("guard_" + b));
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_GUARD);
        // Guards will be belligerent about 20% of the time.  0_thru_100
        b = generator.nextInt(101);
        if (b < 20) {
          character.setBelligerent(true);
        }
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(26) + 15);
        character.setHealth(generator.nextInt(21) + 80);
        // 0_thru_4
        w = generator.nextInt(5);
        switch (w) {
          case 0:
            character.setWeapon(Globals.WEAPON_DAGGER);
            break;
          case 1:
            character.setWeapon(Globals.WEAPON_STAFF);
            break;
          case 2:
            character.setWeapon(Globals.WEAPON_MACE);
            break;
          case 3:
            character.setWeapon(Globals.WEAPON_SLINGSHOT);
            break;
          case 4:
            character.setWeapon(Globals.WEAPON_CROSSBOW);
            break;
          default:
            log.error("** THIS SHOULD NEVER HAPPEN!");
            break;
        }
        break;
      // Monk.
      case 2:
        // 0_thru_1 + 1 = 1_thru_2
        b = generator.nextInt(2) + 1;
        // 0_thru_1 + 1 = 1_thru_2
        character.setTalkConversation(
          GameConversations.getConversation("monk_" + b));
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_MONK);
        // Monks are never belligerent.
        character.setBelligerent(false);
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(11) + 5);
        character.setHealth(generator.nextInt(51) + 50);
        // 0_thru_1
        w = generator.nextInt(2);
        switch (w) {
          case 0:
            character.setWeapon(Globals.WEAPON_DAGGER);
            break;
          case 1:
            character.setWeapon(Globals.WEAPON_STAFF);
            break;
          default:
            log.error("** THIS SHOULD NEVER HAPPEN!");
            break;
        }
        break;
      // Serpent.
      case 3:
        character.setTalkConversation(null);
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_SERPENT);
        // Serpents will be belligerent about 70% of the time.  0_thru_100
        b = generator.nextInt(101);
        if (b < 70) {
          character.setBelligerent(true);
        }
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(11) + 5);
        character.setHealth(generator.nextInt(31) + 70);
        // Serpents always have a crossbow (how they fire it without arms
        // I don't know, but let's not dwell on it!)
        character.setWeapon(Globals.WEAPON_CROSSBOW);
        break;
      // Skeleton.
      case 4:
        character.setTalkConversation(null);
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_SKELETON);
        // Skeletons are always belligerent.
        character.setBelligerent(true);
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(36) + 5);
        character.setHealth(generator.nextInt(41) + 10);
        // 0_thru_1
        w = generator.nextInt(2);
        switch (w) {
          case 0:
            character.setWeapon(Globals.WEAPON_DAGGER);
            break;
          case 1:
            character.setWeapon(Globals.WEAPON_MACE);
            break;
          default:
            log.error("** THIS SHOULD NEVER HAPPEN!");
            break;
        }
        break;
      // Thief.
      case 5:
        // 0_thru_2 + 1 = 1_thru_3
        b = generator.nextInt(3) + 1;
        character.setTalkConversation(
          GameConversations.getConversation("thief_" + b));
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_THIEF);
        // Thiefs will be belligerent about 50% of the time.  0_thru_100
        b = generator.nextInt(101);
        if (b < 50) {
          character.setBelligerent(true);
        }
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(15) + 1);
        character.setHealth(generator.nextInt(51) + 50);
        // 0_thru_2
        w = generator.nextInt(3);
        switch (w) {
          case 0:
            character.setWeapon(Globals.WEAPON_DAGGER);
            break;
          case 1:
            character.setWeapon(Globals.WEAPON_SLINGSHOT);
            break;
          case 2:
            character.setWeapon(Globals.WEAPON_CROSSBOW);
            break;
          default:
            log.error("** THIS SHOULD NEVER HAPPEN!");
            break;
        }
        break;
      // Troll.
      case 6:
        character.setTalkConversation(null);
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_TROLL);
        // Trolls will be belligerent about 60% of the time.  0_thru_100
        b = generator.nextInt(101);
        if (b < 60) {
          character.setBelligerent(true);
        }
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(21) + 10);
        character.setHealth(generator.nextInt(31) + 70);
        // Trolls always have maces.
        character.setWeapon(Globals.WEAPON_MACE);
        break;
      // Peasant.
      case 7:
        // 0_thru_1 + 1 = 1_thru_2
        b = generator.nextInt(2) + 1;
        character.setTalkConversation(
          GameConversations.getConversation("peasant_" + b));
        character.setImmobile(false);
        character.setType(Globals.CHARACTER_PEASANT);
        // Peasants are never belligerent.
        character.setBelligerent(false);
        character.setGreenKeymaster(false);
        character.setRedKeymaster(false);
        character.setHitPoints(generator.nextInt(5) + 1);
        character.setHealth(generator.nextInt(31) + 10);
        // Preasents always have daggers.
        character.setWeapon(Globals.WEAPON_DAGGER);
        break;
      default:
        log.error("** THIS SHOULD NEVER HAPPEN!");
        break;

    } // End switch.

    return character;

  } // End createCharacter();


  /**
   * This method is used to place a character on a specified map randomly.
   *
   * @param inWhichMap  Which map to add the character to.  If this is null,
   *                    then currentMap is used.
   * @param inCharacter The GameCharacter instance to place.
   */
  public void charPickLocation(final String inWhichMap, final
    GameCharacter inCharacter) {

    // Determine which map we're generating for.
    ArrayList mapBeingPopulated = null;
    ArrayList targetCollection  = null;
    if (inWhichMap == null) {
      log.debug("Picking location for character after battle win...");
      // Remember, at this point, currentMap still points to the battle map,
      // but we actually need the true map we were on before battle, so we need
      // to use previousMap here.  currentCharacters is of course still the
      // correct character collection to use.
      mapBeingPopulated = previousMap;
      targetCollection  = currentCharacters;
    } else {
      log.debug("Picking location for character during initial population...");
      if (inWhichMap.equalsIgnoreCase("main")) {
        mapBeingPopulated = GameMaps.mainMap;
        targetCollection = mainCharacters;
      } else if (inWhichMap.equalsIgnoreCase("town_a")) {
        mapBeingPopulated = GameMaps.townAMap;
        targetCollection = townACharacters;
      } else if (inWhichMap.equalsIgnoreCase("town_b")) {
        mapBeingPopulated = GameMaps.townBMap;
        targetCollection = townBCharacters;
      } else if (inWhichMap.equalsIgnoreCase("village")) {
        mapBeingPopulated = GameMaps.villageMap;
        targetCollection = villageCharacters;
      } else if (inWhichMap.equalsIgnoreCase("castle")) {
        mapBeingPopulated = GameMaps.castleMap;
        targetCollection = castleCharacters;
      }
    }

    pickTile: while (true) {
      // 0_thru_99
      int x = generator.nextInt(100);
      // 0_thru_99
      int y = generator.nextInt(100);
      // Get character code of target tile.
      String row                = (String)mapBeingPopulated.get(y);
      char   tileBeingOverlayed = row.charAt(x);
      // Target tile must not be a no-walk tile, must not be
      // where the player begins, and must not already have a character.
      if (!isCharacterNoWalkTile(tileBeingOverlayed) &&
        (x != Globals.PLAYER_START_X && y != Globals.PLAYER_START_Y)) {
        boolean tileIsUnoccupied = true;
        for (Iterator it = targetCollection.iterator(); it.hasNext();) {
          GameCharacter gc = (GameCharacter)it.next();
          if (x == gc.getXLocation() && y == gc.getYLocation()) {
            tileIsUnoccupied = false;
            break;
          }
        }
        if (tileIsUnoccupied) {
          inCharacter.setXLocation(x);
          inCharacter.setYLocation(y);
          break pickTile;
        }
      }
    } // End pickTile.

    // If inWhichMap is null, then this is being called as a result of a
    // character dieing in battle and a new one being added.  So, we need to
    // add this character now to the current collection.
    if (inWhichMap == null) {
      targetCollection.add(inCharacter);
    }

  } // End charPickLocation().


  /**
   * This method returns the GameItem instance at a given map location.
   *
   * @param  inCurrentLocationX The current X location of the player.
   * @param  inCurrentLocationY The current Y FOcation of the player.
   * @return                    The GameItem instance of the item found.
   */
  public GameItem getItem(final  int inCurrentLocationX,
    final int inCurrentLocationY) {

    // Calculate the X and Y coordinates the player is standing on.
    int x = inCurrentLocationX + Globals.VIEWPORT_HALF_WIDTH;
    int y = inCurrentLocationY + Globals.VIEWPORT_HALF_HEIGHT;
    // Now iterate over the collection of items for the current map and when
    // we find the item with those X/Y coordinates, return item to caller.
    int i = 0;
    GameItem gi = null;
    for (Iterator it = currentItems.iterator(); it.hasNext();) {
      gi = (GameItem)it.next();
      if (x == gi.getXLocation() && y == gi.getYLocation()) {
        break;
      }
      i++;
    }
    return gi;

  } // End getItem().


  /**
   * This method is used when an item is picked up to remove that item from
   * the collection of items for this map.
   *
   * @param  inCurrentLocationX The current X location of the player.
   * @param  inCurrentLocationY The current Y FOcation of the player.
   */
  public void removeItem(final int inCurrentLocationX,
    final int inCurrentLocationY) {

    // Calculate the X and Y coordinates the player is standing on.
    int x = inCurrentLocationX + Globals.VIEWPORT_HALF_WIDTH;
    int y = inCurrentLocationY + Globals.VIEWPORT_HALF_HEIGHT;

    // Iterate over the collection of items for the current map and when
    // we find the item with those X/Y coordinates, remove it.
    int i = 0;
    for (Iterator it = currentItems.iterator(); it.hasNext();) {
      GameItem gi = (GameItem)it.next();
      if (x == gi.getXLocation() && y == gi.getYLocation()) {
        break;
      }
      i++;
    }
    currentItems.remove(i);

  } // End removeItem().


  /**
   * This method checks to see if a specified tile is one the player can walk
   * on.  This is used when updating the map.
   *
   * @param  inTileChar The tile being check.
   * @return            True if the tile is a no walk tile, false otherwise.
   */
  public boolean isNoWalkTile(final char inTileChar) {

    boolean retVal = false;
    for (int i = 0; i < Globals.PLAYER_NO_WALK_TILES.length(); i++) {
      if (inTileChar == Globals.PLAYER_NO_WALK_TILES.charAt(i)) {
        retVal = true;
        break;
      }
    }
    return retVal;

  } // End isNoWalkTile().


  /**
   * This method checks to see if a specified tile is one a character can walk
   * on.  This is used when updating the map, or moving characters.
   *
   * @param  inTileChar The tile being check.
   * @return            True if the tile is a no walk tile, false otherwise.
   */
  public boolean isCharacterNoWalkTile(final char inTileChar) {

    boolean retVal = false;
    for (int i = 0; i < Globals.CHARACTER_NO_WALK_TILES.length(); i++) {
      if (inTileChar == Globals.CHARACTER_NO_WALK_TILES.charAt(i)) {
        retVal = true;
        break;
      }
    }
    return retVal;

  } // End isCharacterNoWalkTile().


  /**
   * This method checks to see if a specified tile is an item tile that the
   * player can pick up.
   *
   * @param  inTileChar The tile being check.
   * @return            True if the tile is an item tile, false otherwise.
   */
  public boolean isItemTile(final char inTileChar) {

    boolean retVal = false;
    for (int i = 0; i < Globals.ITEM_TILES.length(); i++) {
      if (inTileChar == Globals.ITEM_TILES.charAt(i)) {
        retVal = true;
        break;
      }
    }
    return retVal;

  } // End isItemTile().


  /**
   * This method checks to see if a specified tile is an item-safe tile that
   * an item can be placed on.
   *
   * @param  inTileChar The tile being check.
   * @return            True if the tile is an item-safe tile, false otherwise.
   */
  public boolean isItemSafeTile(final char inTileChar) {

    boolean retVal = false;
    for (int i = 0; i < Globals.ITEM_SAFE_TILES.length(); i++) {
      if (inTileChar == Globals.ITEM_SAFE_TILES.charAt(i)) {
        retVal = true;
        break;
      }
    }
    return retVal;

  } // End isItemSafeTile().


  /**
   * This method moves the characters on the current map.
   *
   * @param inMapMoveDir      This is the direction the map was moved already.
   *                          This is for when this method is called from
   *                          updateMap() and the player actually moved.  In
   *                          that case, we need to take that into account for
   *                          enemy movements to avoid two-tile leaps caused by
   *                          the player moving the opposite direction as the
   *                          character.
   * @param inPlayerLocationX The current X location of the player.
   * @param inPlayerLocationY The current Y location of the player.
   */
  public void moveCharacters(final char inMapMoveDir,
    final int inPlayerLocationX, final int inPlayerLocationY) {

    for (Iterator it = currentCharacters.iterator(); it.hasNext();) {

      // Get needed info on the next character to move.
      GameCharacter character = (GameCharacter)it.next();
      // Quick rejection: if player is immobile, we're done.
      if (character.isImmobile()) {
        continue;
      }
      // Continue getting info.
      int  charLocationX     = character.getXLocation();
      int  charLocationY     = character.getYLocation();
      int  previousLocationX = charLocationX;
      int  previousLocationY = charLocationY;
      int  moveCount         = character.getMoveCount();
      char moveDir           = character.getMoveDir();

      // Calculate the X and Y difference in the location of the player and
      // this character.  To do so, we figure out how many tiles are to the
      // left and right of the player.  Then we add those values to the
      // current location of the player (so we have the player's true X/Y
      // coordinates, not the coordinates of the upper left-hand corner like
      // we normally deal with).  Finally, we subtract the character's X and Y
      // coordinates from those of the player, and take the absolute value.
      // If the difference is more than the viewport size, they are in pursuit.
      int playerX = inPlayerLocationX + Globals.VIEWPORT_HALF_WIDTH;
      int playerY = inPlayerLocationY + Globals.VIEWPORT_HALF_HEIGHT;
      int xDiff = Math.abs(charLocationX - playerX);
      int yDiff = Math.abs(charLocationY - playerY);
      // If the character is belligerent, and if they are close enough to the
      // player to pursue (within one viewport's width/height), then pursue.
      // If they are not belligerent, or not close enough, just move without
      // regard for the player.
      if (character.isBelligerent() &&
        xDiff <= Globals.VIEWPORT_WIDTH &&
        yDiff <= Globals.VIEWPORT_HEIGHT) {
        // If the character is one tile away from the player diagonally, don't
        // move the character.  This allows the player a chance to get away
        // from the attacker a little bit.  It avoids an undesirable situation
        // where if the player moves in a different direction with an enemy
        // pursuing, the enemy immediately jumps onto them because both X
        // and Y would get updated at the same time.  We don't want an enemy
        // to be able to attack the player diagonally.
        if (xDiff == 1 && yDiff == 1) {
          break;
        }
        if (charLocationX < playerX) {
          charLocationX++;
          if (inMapMoveDir == 'w') {
            charLocationX = previousLocationX;
          }
        }
        if (charLocationX > playerX) {
          charLocationX--;
          if (inMapMoveDir == 'e') {
            charLocationX = previousLocationX;
          }
        }
        if (charLocationY < playerY) {
          charLocationY++;
          if (inMapMoveDir == 's') {
            charLocationY = previousLocationY;
          }
        }
        if (charLocationY > playerY) {
          charLocationY--;
          if (inMapMoveDir == 'n') {
            charLocationY = previousLocationY;
          }
        }
        // Get character code of target tile.
        String row                = (String)currentMap.get(charLocationY);
        char   tileBeingOverlayed = row.charAt(charLocationX);
        // Target tile must not be a no-walk tile.  If it is, the character
        // will just freeze (so the player can use things like water to block
        // the approach of an enemy for instance).
        if (isCharacterNoWalkTile(tileBeingOverlayed) ||
          isTileAlreadyOccupied(charLocationX, charLocationY)) {
          charLocationX = previousLocationX;
          charLocationY = previousLocationY;
          // Also, set the moveCount to a high value so that if the player
          // moves out of range, the character will immediately begin moving
          // in a new direction.
          moveCount = 100;
        }

      } else {
        // Character is NOT belligerent, or is out of range of the player,
        // so just move without regard to the position of the player.
        if (moveCount > Globals.CHARACTER_MOVE_COUNT) {
          // They have moved the maximum number of tiles in the current
          // direction that they are supposed to, so pick a new direction and
          // reset the move count.
          moveCount = 0;
          // 0_thru_3
          int newDir = generator.nextInt(4);
          switch (newDir) {
            case 0:
              moveDir = 'n';
              break;
            case 1:
              moveDir = 's';
              break;
            case 2:
              moveDir = 'e';
              break;
            case 3:
              moveDir = 'w';
              break;
            default:
              log.error("** THIS SHOULD NEVER HAPPEN!");
              break;
          }
        } else {
          // Still moving... first, should we skip this move?  70% of the time
          // the character will move.
          if (generator.nextInt(101) > 30) {
            moveCount++;
            switch (moveDir) {
              case 'n':
                charLocationY--;
                if (inMapMoveDir == 's') {
                  charLocationY = previousLocationY;
                }
                break;
              case 's':
                charLocationY++;
                if (inMapMoveDir == 'n') {
                  charLocationY = previousLocationY;
                }
                break;
              case 'e':
                charLocationX++;
                if (inMapMoveDir == 'w') {
                  charLocationX = previousLocationX;
                }
                break;
              case 'w':
                charLocationX--;
                if (inMapMoveDir == 'e') {
                  charLocationX = previousLocationX;
                }
                break;
              default:
                log.error("** THIS SHOULD NEVER HAPPEN!");
                break;
            } // End switch.
            // Get character code of target tile.
            String row                = (String)currentMap.get(charLocationY);
            char   tileBeingOverlayed = row.charAt(charLocationX);
            // Target tile must not be a no-walk tile.  If it is, we need to
            // choose a new direction, and reset the character's location.
            if (isCharacterNoWalkTile(tileBeingOverlayed) ||
              isTileAlreadyOccupied(charLocationX, charLocationY)) {
              charLocationX = previousLocationX;
              charLocationY = previousLocationY;
              moveCount = 0;
              // 0_thru_3
              int newDir = generator.nextInt(4);
              switch (newDir) {
                case 0:
                  moveDir = 'n';
                  break;
                case 1:
                  moveDir = 's';
                  break;
                case 2:
                  moveDir = 'e';
                  break;
                case 3:
                  moveDir = 'w';
                  break;
                default:
                  log.error("** THIS SHOULD NEVER HAPPEN!");
                  break;
              } // End switch.
            } // End if isCharacterNoWalkTile.
          } // End random no move check.
        } // End else moveCount check.

      } // End beligerency check.

      // One final check: map bounds checks.  Can't move off the map!
      if (charLocationX < 2) {
        charLocationX = 2;
      }
      if (charLocationY < 2) {
        charLocationY = 2;
      }
      if (charLocationX > Globals.MAP_WIDTH - 2) {
        charLocationX = previousLocationX;
      }
      if (charLocationY > Globals.MAP_HEIGHT - 2) {
        charLocationY = previousLocationY;
      }

      // Set the updated location on the character, as well as the moveCount
      // and moveDirection.
      character.setXLocation(charLocationX);
      character.setYLocation(charLocationY);
      character.setMoveCount(moveCount);
      character.setMoveDir(moveDir);

    } // End iteration.

  } // End moveCharacters().


  /**
   * This method is called to determine if the tile a character is about to
   * move on to is already occupied by another character.  This is mostly
   * for when belligerent characters are in pursuit of the player os that they
   * won't all wind up bunching up on the same tile, they will instead form
   * a nice orderly line.
   *
   * @param  inX X location of the tile character will occupy.
   * @param  inY Y location of the tile character will occupy.
   * @return     True is the tile is already occupied, false if not.
   */
  private boolean isTileAlreadyOccupied(final int inX, final int inY) {

    boolean retVal = false;
    for (Iterator it = currentCharacters.iterator(); it.hasNext();) {
      GameCharacter gc = (GameCharacter)it.next();
      if (inX == gc.getXLocation() && inY == gc.getYLocation()) {
        retVal = true;
        break;
      }
    }
    return retVal;

  } // End isTileAlreadyOccupied().


  /**
   * This method is called to determine if the player and a character are
   * occupying the same tile.  If they are, the applicable GameCharacter
   * instance is returned.
   *
   * @param  inCurrentLocationX The current X location of the player.
   * @param  inCurrentLocationY The current Y location of the player.
   * @param  inChunk            The map chunk representing the current viewport.
   * @return                    The GameCharacter instance the player is
   *                            beginning combat with, or null if combat does
   *                            not begin.
   */
  public GameCharacter touchingCharacter(final int inCurrentLocationX,
    final int inCurrentLocationY, final ArrayList inChunk) {

    GameCharacter gc = null;
    char playerTile = getPlayerTile(inChunk);
    // Calculate the true X/Y coordinate of the player.
    int x = inCurrentLocationX + Globals.VIEWPORT_HALF_WIDTH;
    int y = inCurrentLocationY + Globals.VIEWPORT_HALF_HEIGHT;
    // See if the tile the player is on is a character tile.
    for (int i = 0; i < Globals.CHARACTER_TILES.length(); i++) {
      if (playerTile == Globals.CHARACTER_TILES.charAt(i)) {
        // Ok, the tile the player is on is a character.  Now we need to find
        // the character.
        for (Iterator it = currentCharacters.iterator(); it.hasNext();) {
          GameCharacter g = (GameCharacter)it.next();
          if (x == g.getXLocation() && y == g.getYLocation()) {
            gc = g;
          }
        }
        break;
      }
    }
    return gc;

  } // End touchingCharacter.


  /**
   * Mutator for currentMapString.
   *
   * @param inCurrentMapString New value for currentMapString.
   */
  public void setCurrentMapString(final String inCurrentMapString) {

    currentMapString = inCurrentMapString;

  } // End setCurrentMapString().


  /**
   * Accessor for currentMapString.
   *
   * @return Value of currentMapString.
   */
  public String getCurrentMapString() {

    return currentMapString;

  } // End getCurrentMapString().


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


  /**
   * This method creates a new battle map, which is really nothing but a
   * single viewport-sized map filled with the ground tile the player was
   * standing on when battle begun.
   *
   * @param  inCurrX     The current X location of the player.
   * @param  inCurrY     The current Y location of the player.
   * @param  inCharacter The GameCharacter instance the player is battling.
   * @return             The battle map.
   */
  public ArrayList createBattleMap(final int inCurrX, final int inCurrY,
    final GameCharacter inCharacter) {

    ArrayList chunk = getBaseMapChunk(inCurrX, inCurrY);
    char playerTile = getPlayerTile(chunk);
    // Now generate our battle map, which is the size of our viewport, filling
    // it with nothing but the tile the player was standing on (which should
    // always be a ground tile, i.e., dirt, etc.)
    battleMap = new ArrayList();
    for (int y = 0; y < Globals.VIEWPORT_HEIGHT; y++) {
      battleMap.add(StringUtils.repeat(
        Character.toString(playerTile), Globals.VIEWPORT_WIDTH));
    }
    // Now get the battle map, with the character superimposed into it.
    ArrayList bm = getBattleMap(inCharacter);
    previousMap = currentMap;
    currentMap  = battleMap;

    // Return the battle map.
    return bm;

  } // End createBattleMap().


  /**
   * This method returns the battle map AFTER it has already been created.
   * This is used when the player moves for isntance.
   *
   * @param  inCharacter The GameCharacter instance the player is battling.
   * @return             Battle map.
   */
  public ArrayList getBattleMap(final GameCharacter inCharacter) {

    int col = inCharacter.getXLocation();
    int row = inCharacter.getYLocation();
    ArrayList bm = new ArrayList(battleMap);
    StringBuffer targetRow =
      new StringBuffer((String)bm.get(row));
    targetRow.replace(col, col + 1, Character.toString(inCharacter.getType()));
    bm.set(row, targetRow.toString());
    return bm;

  } // End getBattleMap().


} // End class.
