<%@ page language="java" import="com.apress.ajaxprojects.ajaxwarrior.Globals" %>

/**
 * This object contains most of our constant variables and preloaded images
 * used throughout the code.
 */
function GlobalsObject() {

  // Viewport Sizes.
  this.TILE_WIDTH = <%=Globals.TILE_WIDTH%>;
  this.TILE_HEIGHT = <%=Globals.TILE_HEIGHT%>;
  this.VIEWPORT_WIDTH = <%=Globals.VIEWPORT_WIDTH%>;
  this.VIEWPORT_HEIGHT = <%=Globals.VIEWPORT_HEIGHT%>;
  this.VIEWPORT_HALF_WIDTH = <%=Globals.VIEWPORT_HALF_WIDTH%>;
  this.VIEWPORT_HALF_HEIGHT = <%=Globals.VIEWPORT_HALF_HEIGHT%>;

  // Talk And Attack Modes.
  this.PLAYER_TALK_MODE = "talk";
  this.PLAYER_ATTACK_MODE = "attack";

  // Transparent pixel.
  this.imgTransparent = new Image(1, 1);
  this.imgTransparent.src = "img/transparent.gif";

  // Projectile Images.
  this.imgPROJECTILE_ARROW_LEFT = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgPROJECTILE_ARROW_LEFT.src = "img/projectile_arrow_left.gif";
  this.imgPROJECTILE_ARROW_RIGHT = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgPROJECTILE_ARROW_RIGHT.src = "img/projectile_arrow_right.gif";
  this.imgPROJECTILE_ARROW_UP = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgPROJECTILE_ARROW_UP.src = "img/projectile_arrow_up.gif";
  this.imgPROJECTILE_ARROW_DOWN = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgPROJECTILE_ARROW_DOWN.src = "img/projectile_arrow_down.gif";

  // Store Items.
  this.STORE_ITEM_DAGGER = "<%=Globals.STORE_ITEM_DAGGER%>";
  this.STORE_ITEM_STAFF = "<%=Globals.STORE_ITEM_STAFF%>";
  this.STORE_ITEM_MACE = "<%=Globals.STORE_ITEM_MACE%>";
  this.STORE_ITEM_SLINGSHOT = "<%=Globals.STORE_ITEM_SLINGSHOT%>";
  this.STORE_ITEM_CROSSBOW = "<%=Globals.STORE_ITEM_CROSSBOW%>";
  this.STORE_ITEM_HEALTH_10 = "<%=Globals.STORE_ITEM_HEALTH_10%>";
  this.STORE_ITEM_HEALTH_15 = "<%=Globals.STORE_ITEM_HEALTH_15%>";
  this.STORE_ITEM_HEALTH_25 = "<%=Globals.STORE_ITEM_HEALTH_25%>";
  this.STORE_ITEM_HEALTH_50 = "<%=Globals.STORE_ITEM_HEALTH_50%>";

  // Weapons.
  this.WEAPON_NONE = "<%=Globals.WEAPON_NONE%>";
  this.WEAPON_DAGGER = "<%=Globals.WEAPON_DAGGER%>";
  this.WEAPON_STAFF = "<%=Globals.WEAPON_STAFF%>";
  this.WEAPON_MACE = "<%=Globals.WEAPON_MACE%>";
  this.WEAPON_SLINGSHOT = "<%=Globals.WEAPON_SLINGSHOT%>";
  this.WEAPON_CROSSBOW = "<%=Globals.WEAPON_CROSSBOW%>";

  // Spells.
  this.SPELL_FIRE_RAIN = "<%=Globals.SPELL_FIRE_RAIN%>";
  this.SPELL_HEAL_THY_SELF = "<%=Globals.SPELL_HEAL_THY_SELF%>";
  this.SPELL_FREEZE_TIME = "<%=Globals.SPELL_FREEZE_TIME%>";

  // Game Modes.
  this.MODE_NORMAL = "<%=Globals.MODE_NORMAL%>";
  this.MODE_BATTLE = "<%=Globals.MODE_BATTLE%>";
  this.MODE_TALKING = "<%=Globals.MODE_TALKING%>";

  // Client-Side Views.
  this.VIEW_MAP = document.getElementById("divMap");
  this.VIEW_HELP = document.getElementById("divHelp");
  this.VIEW_INVENTORY = document.getElementById("divInventory");
  this.VIEW_SPELL_CASTING = document.getElementById("divSpellCasting");
  this.VIEW_SWITCH_WEAPON = document.getElementById("divWeaponSwitching");
  this.VIEW_GAME_END = document.getElementById("divGameEnd");
  this.VIEW_TALKING = document.getElementById("divTalkingReplies");
  this.VIEW_STORE = document.getElementById("divStore");
  this.VIEW_BATTLE = "battle";

  // Border.
  this.imgTALKING = new Image();
  this.imgTALKING.src = "img/border_talking.gif";
  this.imgATTACKING = new Image();
  this.imgATTACKING.src = "img/border_attacking.gif";

  // Character Tiles.
  this.CHARACTER_PLAYER = "<%=Globals.CHARACTER_PLAYER%>";
  this.CHARACTER_DEMON = "<%=Globals.CHARACTER_DEMON%>";
  this.CHARACTER_GUARD = "<%=Globals.CHARACTER_GUARD%>";
  this.CHARACTER_MONK = "<%=Globals.CHARACTER_MONK%>";
  this.CHARACTER_SERPENT = "<%=Globals.CHARACTER_SERPENT%>";
  this.CHARACTER_SKELETON = "<%=Globals.CHARACTER_SKELETON%>";
  this.CHARACTER_THIEF = "<%=Globals.CHARACTER_THIEF%>";
  this.CHARACTER_TROLL = "<%=Globals.CHARACTER_TROLL%>";
  this.CHARACTER_PEASANT = "<%=Globals.CHARACTER_PEASANT%>";
  this.imgCHARACTER_PLAYER = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_PLAYER.src = "img/character_player.gif";
  this.imgCHARACTER_DEMON = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_DEMON.src = "img/character_demon.gif";
  this.imgCHARACTER_GUARD = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_GUARD.src = "img/character_guard.gif";
  this.imgCHARACTER_MONK = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_MONK.src = "img/character_monk.gif";
  this.imgCHARACTER_SERPENT = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_SERPENT.src = "img/character_serpent.gif";
  this.imgCHARACTER_SKELETON = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_SKELETON.src = "img/character_skeleton.gif";
  this.imgCHARACTER_THIEF = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_THIEF.src = "img/character_thief.gif";
  this.imgCHARACTER_TROLL = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_TROLL.src = "img/character_troll.gif";
  this.imgCHARACTER_PEASANT = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_PEASANT.src = "img/character_peasant.gif";
  this.imgCHARACTER_PLAYER_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_PLAYER_BATTLE.src = "img/character_player_battle.gif";
  this.imgCHARACTER_DEMON_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_DEMON_BATTLE.src = "img/character_demon_battle.gif";
  this.imgCHARACTER_GUARD_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_GUARD_BATTLE.src = "img/character_guard_battle.gif";
  this.imgCHARACTER_MONK_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_MONK_BATTLE.src = "img/character_monk_battle.gif";
  this.imgCHARACTER_SERPENT_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_SERPENT_BATTLE.src = "img/character_serpent_battle.gif";
  this.imgCHARACTER_SKELETON_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_SKELETON_BATTLE.src = "img/character_skeleton_battle.gif";
  this.imgCHARACTER_THIEF_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_THIEF_BATTLE.src = "img/character_thief_battle.gif";
  this.imgCHARACTER_TROLL_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_TROLL_BATTLE.src = "img/character_troll_battle.gif";
  this.imgCHARACTER_PEASANT_BATTLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgCHARACTER_PEASANT_BATTLE.src = "img/character_peasant_battle.gif";

  // Characters talking images.
  this.imgCHARACTER_GUARD_TALKING = new Image(
    <%=Globals.TILE_WIDTH%> * <%=Globals.MAP_WIDTH%>,
    <%=Globals.TILE_HEIGHT%> * <%=Globals.MAP_HEIGHT%>);
  this.imgCHARACTER_GUARD_TALKING.src = "img/talking_guard.gif";
  this.imgCHARACTER_MONK_TALKING = new Image(
    <%=Globals.TILE_WIDTH%> * <%=Globals.MAP_WIDTH%>,
    <%=Globals.TILE_HEIGHT%> * <%=Globals.MAP_HEIGHT%>);
  this.imgCHARACTER_MONK_TALKING.src = "img/talking_monk.gif";
  this.imgCHARACTER_PEASANT_TALKING = new Image(
    <%=Globals.TILE_WIDTH%> * <%=Globals.MAP_WIDTH%>,
    <%=Globals.TILE_HEIGHT%> * <%=Globals.MAP_HEIGHT%>);
  this.imgCHARACTER_PEASANT_TALKING.src = "img/talking_peasant.gif";
  this.imgCHARACTER_THIEF_TALKING = new Image(
    <%=Globals.TILE_WIDTH%> * <%=Globals.MAP_WIDTH%>,
    <%=Globals.TILE_HEIGHT%> * <%=Globals.MAP_HEIGHT%>);
  this.imgCHARACTER_THIEF_TALKING.src = "img/talking_thief.gif";

  // Map Items.
  this.ITEM_GOLD = "<%=Globals.ITEM_GOLD%>";
  this.ITEM_HEALTH = "<%=Globals.ITEM_HEALTH%>";
  this.ITEM_KEY_BLUE = "<%=Globals.ITEM_KEY_BLUE%>";
  this.ITEM_KEY_SILVER = "<%=Globals.ITEM_KEY_SILVER%>";
  this.ITEM_KEY_YELLOW = "<%=Globals.ITEM_KEY_YELLOW%>";
  this.ITEM_KEY_GREEN = "<%=Globals.ITEM_KEY_GREEN%>";
  this.ITEM_KEY_RED = "<%=Globals.ITEM_KEY_RED%>";
  this.ITEM_SPELL_SCROLL = "<%=Globals.ITEM_SPELL_SCROLL%>";
  this.imgITEM_GOLD = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_GOLD.src = "img/item_gold.gif";
  this.imgITEM_HEALTH = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_HEALTH.src = "img/item_health.gif";
  this.imgITEM_KEY_BLUE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_KEY_BLUE.src = "img/item_key_blue.gif";
  this.imgITEM_KEY_SILVER = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_KEY_SILVER.src = "img/item_key_silver.gif";
  this.imgITEM_KEY_YELLOW = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_KEY_YELLOW.src = "img/item_key_yellow.gif";
  this.imgITEM_KEY_GREEN = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_KEY_GREEN.src = "img/item_key_green.gif";
  this.imgITEM_KEY_RED = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_KEY_RED.src = "img/item_key_red.gif";
  this.imgITEM_SPELL_SCROLL = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgITEM_SPELL_SCROLL.src = "img/item_spell_scroll.gif";

  // Artifacts.
  this.ARTIFACT_ANKH = "<%=Globals.ARTIFACT_ANKH%>";
  this.ARTIFACT_MEDALLION = "<%=Globals.ARTIFACT_MEDALLION%>";
  this.ARTIFACT_SCROLL = "<%=Globals.ARTIFACT_SCROLL%>";
  this.ARTIFACT_SKULL = "<%=Globals.ARTIFACT_SKULL%>";
  this.ARTIFACT_STAFF = "<%=Globals.ARTIFACT_STAFF%>";
  this.imgARTIFACT_ANKH = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgARTIFACT_ANKH.src = "img/artifact_ankh.gif";
  this.imgARTIFACT_MEDALLION = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgARTIFACT_MEDALLION.src = "img/artifact_medallion.gif";
  this.imgARTIFACT_SCROLL = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgARTIFACT_SCROLL.src = "img/artifact_scroll.gif";
  this.imgARTIFACT_SKULL = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgARTIFACT_SKULL.src = "img/artifact_skull.gif";
  this.imgARTIFACT_STAFF = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgARTIFACT_STAFF.src = "img/artifact_staff.gif";

  // Base Map Tiles.
  this.TILE_BLANK = "<%=Globals.TILE_BLANK%>";
  this.TILE_BRIDGE = "<%=Globals.TILE_BRIDGE%>";
  this.TILE_FOREST_THIN = "<%=Globals.TILE_FOREST_THIN%>";
  this.TILE_FOREST_THICK = "<%=Globals.TILE_FOREST_THICK%>";
  this.TILE_GRASS = "<%=Globals.TILE_GRASS%>";
  this.TILE_MOUNTAINS_THIN = "<%=Globals.TILE_MOUNTAINS_THIN%>";
  this.TILE_MOUNTAINS_THICK = "<%=Globals.TILE_MOUNTAINS_THICK%>";
  this.TILE_TOWN_A = "<%=Globals.TILE_TOWN_A%>";
  this.TILE_TOWN_B = "<%=Globals.TILE_TOWN_B%>";
  this.TILE_WATER_SHALLOW = "<%=Globals.TILE_WATER_SHALLOW%>";
  this.TILE_WATER_DEEP = "<%=Globals.TILE_WATER_DEEP%>";
  this.TILE_BOULDER = "<%=Globals.TILE_BOULDER%>";
  this.TILE_CASTLE_LEFT = "<%=Globals.TILE_CASTLE_LEFT%>";
  this.TILE_CASTLE_MIDDLE = "<%=Globals.TILE_CASTLE_MIDDLE%>";
  this.TILE_CASTLE_RIGHT = "<%=Globals.TILE_CASTLE_RIGHT%>";
  this.TILE_COLUMN = "<%=Globals.TILE_COLUMN%>";
  this.TILE_FLOOR_BRICK = "<%=Globals.TILE_FLOOR_BRICK%>";
  this.TILE_FLOOR_WOOD = "<%=Globals.TILE_FLOOR_WOOD%>";
  this.TILE_FLOOR_BRICK_STORE = "<%=Globals.TILE_FLOOR_BRICK_STORE%>";
  this.TILE_FLOOR_WOOD_STORE = "<%=Globals.TILE_FLOOR_WOOD_STORE%>";
  this.TILE_FLOOR_MARBLE = "<%=Globals.TILE_FLOOR_MARBLE%>";
  this.TILE_FLOOR_DIRT = "<%=Globals.TILE_FLOOR_DIRT%>";
  this.TILE_SWAMP = "<%=Globals.TILE_SWAMP%>";
  this.TILE_VILLAGE = "<%=Globals.TILE_VILLAGE%>";
  this.TILE_WALL_BRICK = "<%=Globals.TILE_WALL_BRICK%>";
  this.TILE_WALL_HIDDEN_RED = "<%=Globals.TILE_WALL_HIDDEN_RED%>";
  this.TILE_WALL_HIDDEN_BLUE = "<%=Globals.TILE_WALL_HIDDEN_BLUE%>";
  this.TILE_WALL_HIDDEN_GREEN = "<%=Globals.TILE_WALL_HIDDEN_GREEN%>";
  this.TILE_WALL_HIDDEN_YELLOW = "<%=Globals.TILE_WALL_HIDDEN_YELLOW%>";
  this.TILE_WALL_HIDDEN_SILVER = "<%=Globals.TILE_WALL_HIDDEN_SILVER%>";
  this.TILE_STORE_1 = "<%=Globals.TILE_STORE_1%>";
  this.TILE_STORE_2 = "<%=Globals.TILE_STORE_2%>";
  this.TILE_STORE_3 = "<%=Globals.TILE_STORE_3%>";
  this.TILE_STORE_BLANK = "<%=Globals.TILE_STORE_BLANK%>";
  this.imgTILE_BLANK = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_BLANK.src = "img/tile_blank.gif";
  this.imgTILE_BRIDGE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_BRIDGE.src = "img/tile_bridge.gif";
  this.imgTILE_FOREST_THIN = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FOREST_THIN.src = "img/tile_forest_thin.gif";
  this.imgTILE_FOREST_THICK = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FOREST_THICK.src = "img/tile_forest_thick.gif";
  this.imgTILE_GRASS = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_GRASS.src = "img/tile_grass.gif";
  this.imgTILE_MOUNTAINS_THIN = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_MOUNTAINS_THIN.src = "img/tile_mountains_thin.gif";
  this.imgTILE_MOUNTAINS_THICK = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_MOUNTAINS_THICK.src = "img/tile_mountains_thick.gif";
  this.imgTILE_TOWN_A = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_TOWN_A.src = "img/tile_town_a.gif";
  this.imgTILE_TOWN_B = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_TOWN_B.src = "img/tile_town_b.gif";
  this.imgTILE_WATER_SHALLOW = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WATER_SHALLOW.src = "img/tile_water_shallow.gif";
  this.imgTILE_WATER_DEEP = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WATER_DEEP.src = "img/tile_water_deep.gif";
  this.imgTILE_BOULDER = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_BOULDER.src = "img/tile_boulder.gif";
  this.imgTILE_CASTLE_LEFT = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_CASTLE_LEFT.src = "img/tile_castle_left.gif";
  this.imgTILE_CASTLE_MIDDLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_CASTLE_MIDDLE.src = "img/tile_castle_middle.gif";
  this.imgTILE_CASTLE_RIGHT = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_CASTLE_RIGHT.src = "img/tile_castle_right.gif";
  this.imgTILE_COLUMN = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_COLUMN.src = "img/tile_column.gif";
  this.imgTILE_FLOOR_BRICK = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FLOOR_BRICK.src = "img/tile_floor_brick.gif";
  this.imgTILE_FLOOR_BRICK_STORE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FLOOR_BRICK_STORE.src = "img/tile_floor_brick_store.gif";
  this.imgTILE_FLOOR_WOOD = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FLOOR_WOOD.src = "img/tile_floor_wood.gif";
  this.imgTILE_FLOOR_WOOD_STORE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FLOOR_WOOD_STORE.src = "img/tile_floor_wood_store.gif";
  this.imgTILE_FLOOR_MARBLE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FLOOR_MARBLE.src = "img/tile_floor_marble.gif";
  this.imgTILE_FLOOR_DIRT = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_FLOOR_DIRT.src = "img/tile_floor_dirt.gif";
  this.imgTILE_SWAMP = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_SWAMP.src = "img/tile_swamp.gif";
  this.imgTILE_VILLAGE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_VILLAGE.src = "img/tile_village.gif";
  this.imgTILE_WALL_BRICK = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WALL_BRICK.src = "img/tile_wall_brick.gif";
  this.imgTILE_WALL_HIDDEN_RED = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WALL_HIDDEN_RED.src = "img/tile_wall_hidden_red.gif";
  this.imgTILE_WALL_HIDDEN_GREEN = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WALL_HIDDEN_GREEN.src = "img/tile_wall_hidden_green.gif";
  this.imgTILE_WALL_HIDDEN_BLUE = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WALL_HIDDEN_BLUE.src = "img/tile_wall_hidden_blue.gif";
  this.imgTILE_WALL_HIDDEN_YELLOW = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WALL_HIDDEN_YELLOW.src = "img/tile_wall_hidden_yellow.gif";
  this.imgTILE_WALL_HIDDEN_SILVER = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_WALL_HIDDEN_SILVER.src = "img/tile_wall_hidden_silver.gif";
  this.imgTILE_STORE_1 = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_STORE_1.src = "img/tile_store_1.gif";
  this.imgTILE_STORE_2 = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_STORE_2.src = "img/tile_store_2.gif";
  this.imgTILE_STORE_3 = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_STORE_3.src = "img/tile_store_3.gif";
  this.imgTILE_STORE_BLANK = new Image(<%=Globals.TILE_WIDTH%>,
    <%=Globals.TILE_HEIGHT%>);
  this.imgTILE_STORE_BLANK.src = "img/tile_store_blank.gif";

  // Key Codes.
  this.KEY_SPACEBAR = 32;
  this.KEY_LEFT_ARROW = 37;
  this.KEY_RIGHT_ARROW = 39;
  this.KEY_UP_ARROW = 38;
  this.KEY_DOWN_ARROW = 40;
  this.KEY_1 = 49;
  this.KEY_2 = 50;
  this.KEY_3 = 51;
  this.KEY_4 = 52;
  this.KEY_5 = 53;
  this.KEY_6 = 54;
  this.KEY_7 = 55;
  this.KEY_8 = 56;
  this.KEY_9 = 57;
  this.KEY_A = 65;
  this.KEY_B = 66;
  this.KEY_C = 67;
  this.KEY_D = 68;
  this.KEY_E = 69;
  this.KEY_F = 70;
  this.KEY_H = 72;
  this.KEY_I = 73;
  this.KEY_L = 76;
  this.KEY_M = 77;
  this.KEY_P = 80;
  this.KEY_S = 83;
  this.KEY_T = 84;
  this.KEY_U = 85;
  this.KEY_W = 87;

} // End GlobalsObject.
