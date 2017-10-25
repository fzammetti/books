package com.apress.ajaxprojects.ajaxwarrior;


/**
 * This class contains global constants used throughout the application.
 */
public class Globals {

  // Map codes - Main map tile constants.
  public static final char   TILE_BLANK                    = '_';
  public static final char   TILE_BRIDGE                   = 'b';
  public static final char   TILE_FOREST_THIN              = 'f';
  public static final char   TILE_FOREST_THICK             = 'F';
  public static final char   TILE_GRASS                    = 'g';
  public static final char   TILE_MOUNTAINS_THIN           = 'm';
  public static final char   TILE_MOUNTAINS_THICK          = 'M';
  public static final char   TILE_TOWN_A                   = '1';
  public static final char   TILE_TOWN_B                   = '2';
  public static final char   TILE_WATER_SHALLOW            = '(';
  public static final char   TILE_WATER_DEEP               = '[';
  public static final char   TILE_BOULDER                  = 'L';
  public static final char   TILE_CASTLE_LEFT              = '3';
  public static final char   TILE_CASTLE_MIDDLE            = '<';
  public static final char   TILE_CASTLE_RIGHT             = '4';
  public static final char   TILE_SWAMP                    = 's';
  public static final char   TILE_VILLAGE                  = 'v';
  public static final char   TILE_WALL_BRICK               = '5';
  public static final char   TILE_WALL_HIDDEN_RED          = 'h';
  public static final char   TILE_WALL_HIDDEN_GREEN        = 'i';
  public static final char   TILE_WALL_HIDDEN_SILVER       = 'j';
  public static final char   TILE_WALL_HIDDEN_YELLOW       = 'k';
  public static final char   TILE_WALL_HIDDEN_BLUE         = 'l';
  public static final char   TILE_COLUMN                   = 'c';
  public static final char   TILE_FLOOR_BRICK              = '@';
  public static final char   TILE_FLOOR_BRICK_STORE        = 'x';
  public static final char   TILE_FLOOR_WOOD               = '#';
  public static final char   TILE_FLOOR_WOOD_STORE         = 'y';
  public static final char   TILE_FLOOR_MARBLE             = '$';
  public static final char   TILE_FLOOR_DIRT               = '%';
  public static final char   TILE_STORE_1                  = 'w';
  public static final char   TILE_STORE_2                  = 'z';
  public static final char   TILE_STORE_3                  = 'R';
  public static final char   TILE_STORE_BLANK              = '=';

  // Map codes - Items constants.
  public static final char   ITEM_GOLD                     = 'G';
  public static final char   ITEM_HEALTH                   = 'H';
  public static final char   ITEM_KEY_BLUE                 = 'A';
  public static final char   ITEM_KEY_SILVER               = 'B';
  public static final char   ITEM_KEY_YELLOW               = 'C';
  public static final char   ITEM_KEY_GREEN                = 'D';
  public static final char   ITEM_KEY_RED                  = 'E';
  public static final char   ITEM_SPELL_SCROLL             = 'S';

  // Map codes - Artifacts constants.
  public static final char   ARTIFACT_ANKH                 = 'V';
  public static final char   ARTIFACT_STAFF                = 'W';
  public static final char   ARTIFACT_MEDALLION            = 'X';
  public static final char   ARTIFACT_SCROLL               = 'Y';
  public static final char   ARTIFACT_SKULL                = 'Z';

  // Map codes - Projectile constants.
  public static final char   PROJECTILE_ARROW_EAST         = 'N';
  public static final char   PROJECTILE_ARROW_NORTH        = 'O';
  public static final char   PROJECTILE_ARROW_SOUTH        = 'P';
  public static final char   PROJECTILE_ARROW_WEST         = 'Q';

  // Constants for our character graphics.
  public static final char   CHARACTER_PLAYER              = '+';
  public static final char   CHARACTER_DEMON               = '{';
  public static final char   CHARACTER_GUARD               = '}';
  public static final char   CHARACTER_MONK                = '|';
  public static final char   CHARACTER_SERPENT             = ':';
  public static final char   CHARACTER_SKELETON            = '^';
  public static final char   CHARACTER_THIEF               = '&';
  public static final char   CHARACTER_TROLL               = '*';
  public static final char   CHARACTER_PEASANT             = '?';

  // Constants for our weapons.
  public static final char   WEAPON_NONE                   = '-';
  public static final char   WEAPON_DAGGER                 = '0';
  public static final char   WEAPON_STAFF                  = 'a';
  public static final char   WEAPON_MACE                   = 'u';
  public static final char   WEAPON_SLINGSHOT              = 'T';
  public static final char   WEAPON_CROSSBOW               = 'U';
  public static final int    WEAPON_NONE_DAMAGE            = 2;
  public static final int    WEAPON_DAGGER_DAMAGE          = 5;
  public static final int    WEAPON_STAFF_DAMAGE           = 10;
  public static final int    WEAPON_MACE_DAMAGE            = 15;
  public static final int    WEAPON_SLINGSHOT_DAMAGE       = 20;
  public static final int    WEAPON_CROSSBOW_DAMAGE        = 25;
  public static final double DAMAGE_BASIS                  = .2;
  public static final int    HIT_POINT_DIVIDER             = 2;
  public static final int    COMBAT_MAX_DAMAGE             = 20;

  // Constants for our items in stores.
  public static final char   STORE_ITEM_DAGGER             = '6';
  public static final char   STORE_ITEM_STAFF              = '7';
  public static final char   STORE_ITEM_MACE               = '8';
  public static final char   STORE_ITEM_SLINGSHOT          = '9';
  public static final char   STORE_ITEM_CROSSBOW           = 'd';
  public static final char   STORE_ITEM_HEALTH_10          = 'e';
  public static final char   STORE_ITEM_HEALTH_15          = 'n';
  public static final char   STORE_ITEM_HEALTH_25          = 'r';
  public static final char   STORE_ITEM_HEALTH_50          = 't';
  public static final int    STORE_ITEM_DAGGER_PRICE       = 100;
  public static final int    STORE_ITEM_STAFF_PRICE        = 300;
  public static final int    STORE_ITEM_MACE_PRICE         = 500;
  public static final int    STORE_ITEM_SLINGSHOT_PRICE    = 750;
  public static final int    STORE_ITEM_CROSSBOW_PRICE     = 1000;
  public static final int    STORE_ITEM_HEALTH_10_PRICE    = 50;
  public static final int    STORE_ITEM_HEALTH_15_PRICE    = 75;
  public static final int    STORE_ITEM_HEALTH_25_PRICE    = 150;
  public static final int    STORE_ITEM_HEALTH_50_PRICE    = 250;

  // Constants for our spells.
  public static final char   SPELL_FIRE_RAIN               = '`';
  public static final char   SPELL_HEAL_THY_SELF           = ';';
  public static final char   SPELL_FREEZE_TIME             = '.';
  public static final char   SPELL_FREEZE_TIME_SKIPS       = 15;

  // Constants for the various game modes.
  public static final char   MODE_NORMAL                   = 'o';
  public static final char   MODE_BATTLE                   = 'p';
  public static final char   MODE_TALKING                  = 'q';

  // This constants is a string which contains the codes that
  // the player cannot walk on to.
  public static final String PLAYER_NO_WALK_TILES          = "_FM([L345c";

  // This constants is a string which contains the codes that
  // a character cannot walk on to.
  public static final String CHARACTER_NO_WALK_TILES       =
    "_bFM12([L3<4v5ijklcxyGHABCDESVWXYZ{}|:^&*?";

  // This constants is a string which contains the codes that
  // the player can pick up, i.e., items.
  public static final String ITEM_TILES                    = "GHABCDESVWXYZ";

  // This constants is a string which contains the codes that
  // are valid for an item to be placed on.
  public static final String ITEM_SAFE_TILES               = "fgms@#$%";

  // This constant is a string which contains the codes that
  // represent characters, minus the player.
  public static final String CHARACTER_TILES               = "{}|:^&*?";

  // Map and viewport constants.
  public static final int    MAP_WIDTH                     = 100;
  public static final int    MAP_HEIGHT                    = 100;
  public static final int    VIEWPORT_WIDTH                = 13;
  public static final int    VIEWPORT_HEIGHT               = 13;
  public static final int    VIEWPORT_HALF_WIDTH           = 6;
  public static final int    VIEWPORT_HALF_HEIGHT          = 6;

  // Constants for the size of an individual tile.
  public static final int    TILE_WIDTH                    = 32;
  public static final int    TILE_HEIGHT                   = 32;

  // How many items will be randomly placed on each map.
  public static final int    NUM_ITEMS_ON_MAIN_MAP         = 15;
  public static final int    NUM_ITEMS_ON_TOWNA_MAP        = 6;
  public static final int    NUM_ITEMS_ON_TOWNB_MAP        = 6;
  public static final int    NUM_ITEMS_ON_VILLAGE_MAP      = 4;
  public static final int    NUM_ITEMS_ON_CASTLE_MAP       = 10;

  // How many characters will be randomly placed on each map.
  public static final int    NUM_CHARACTERS_ON_MAIN_MAP    = 20;
  public static final int    NUM_CHARACTERS_ON_TOWNA_MAP   = 15;
  public static final int    NUM_CHARACTERS_ON_TOWNB_MAP   = 15;
  public static final int    NUM_CHARACTERS_ON_VILLAGE_MAP = 10;
  public static final int    NUM_CHARACTERS_ON_CASTLE_MAP  = 18;

  // Starting location for player when entering a community.
  public static final int    COMMUNITY_STARTING_X          = 0;
  public static final int    COMMUNITY_STARTING_Y          = 33;

  // This is the amount of tiles a character will move in a given direction
  // before changing directions.
  public static final int    CHARACTER_MOVE_COUNT          = 4;

  // This is how many wins are required in battle before the player receives
  // a hit point increase.  Note that with each hit point increase, this value
  // is increased by itself.  So, the first increase is after 5 wins, the
  // next after 10, then 15, etc.
  public static final int    HIT_POINT_INCREASE_INCREMENT  = 5;

  // Player characteristics values.
  public static final int    PLAYER_START_X                = 40;
  public static final int    PLAYER_START_Y                = 40;
  public static final int    PLAYER_START_HEALTH           = 100;
  public static final int    PLAYER_START_HIT_POINTS       = 1;
  public static final int    PLAYER_START_GOLD_PIECES      = 10;
  public static final int    PLAYER_MAX_HEALTH             = 100;
  public static final int    PLAYER_MAX_HIT_POINTS         = 500;
  public static final int    PLAYER_MAX_GOLD_PIECES        = 10000;

  /**
   * This is the session attribute that will be set when a game is properly
   * started, and which will be checked for by the SessionCheckerFilter.
   */
  public static final String GAME_PROPERLY_STARTED         =
    "game_has_been_properly_started";


} // End class.
