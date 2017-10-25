package com.apress.ajaxprojects.ajaxwarrior;


import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameState;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameTalkNode;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameTalkReply;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/** Class containing various utility functions.
 */
public final class Utils {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Constructor.
   */
  private Utils() {
  } // End constructor.


  /**
   * This method is called from a number of places to return a response to
   * the client.  The response is a JSON response, and always in the same
   * basic format, regardless of what the response actually is.  This means
   * that in some cases, there may not be any mapData, or some of the other
   * elements may be blank, etc.
   *
   * @param  inException         True if an exception occurred and we are
   *                             writing this JSON message in response to
   *                             that, false otherwise.
   * @param  inMessage           A message to be displayed in the scroll area.
   *                             If null, mg member will not be returned.
   * @param  inChunk             The chunk of map data for the viewport.  Null
   *                             returns blank.
   * @param  inViewUpdated       True if the map view has changed, false if not
   *                             (true means the client will update the
   *                             display).
   * @param  inGameState         The current GameState instance.
   * @param  inPlayerInfoUpdated True if the player info has changed, false
   *                             if not (true means the client will update the
   *                             display).
   * @param  inResponse          The response being generated for this request.
   * @param  inExitedCommunity   True if the player has just exited a community,
   *                             false otherwise.
   * @param  inEnteredStore      True if the player has entered a store, false
   *                             otherwise.
   * @param  inProjectileInfo    This is all the information need on the client
   *                             for when a projectile is fired.
   * @throws IOException         It anything goes wrong.
   */
  public static void writeJSON(final boolean inException,
    final String inMessage, final ArrayList inChunk,
    final boolean inViewUpdated, final GameState inGameState,
    final boolean inPlayerInfoUpdated, final HttpServletResponse inResponse,
    final boolean inExitedCommunity, final boolean inEnteredStore,
    final HashMap inProjectileInfo)
    throws IOException {

    StringBuffer sb = new StringBuffer();

    // This is a response for an exception.
    if (inException) {

      sb.append("{");
      sb.append("\"ex\":\"" + Boolean.toString(inException) + "\",");
      sb.append("\"mg\":\"" + inMessage + "\"");
      sb.append("}");


    // Non-exception (normal) response...
    } else {

      // Deal with any possible null values.
      ArrayList chunk       = null;
      boolean   viewUpdated = false;
      if (inChunk == null) {
        viewUpdated = false;
      } else {
        chunk       = inChunk;
        viewUpdated = inViewUpdated;
      }

      StringBuffer mapData = null;
      // Create StringBuffer from chunk, if any.
      if (viewUpdated) {
        mapData =
          new StringBuffer(Globals.VIEWPORT_WIDTH * Globals.VIEWPORT_HEIGHT);
        String row = null;
        for (Iterator it = chunk.iterator(); it.hasNext();) {
          row = (String)it.next();
          mapData.append(row);
        }
      }

      // Construct JSON.  Note that it is constructed to be about as small as
      // possible, so, we use two-letter codes for the fields rather than more
      // developer-friendly words, so, "hp" instead of "hitPoints" for instance.
      // I would NOT recommend doing that generally, but since we know this is
      // going to be called a lot, we want the message to be as small as
      // possible.  Also, some elements are dropped when they are not necessary.
      // For instance, if the inPlayerInfoUpdated flag is false, there is no
      // point in sending back the player's name, hit points, gold pieces and
      // health.  The caller of this method is of course responsbile for
      // determining what is required and what isn't.
      // mg = message (only if dm == true)
      // dm = display message?
      // cx = current location x (only if in battle)
      // cy = current location y (only if in battle)
      // pn = player name (only if iu == true)
      // ht = health (only if iu == true)
      // hp = hit points (only if iu == true)
      // gp = gold pieces (only if iu == true)
      // iu = player info updated?
      // vu = view updated?
      // di = has player died?
      // wn = has player won?
      // ec = has player just exited a community?
      // mo = current gamde mode
      // ct = chracter type (only if talking to a character)
      // cr = character response (only if talking to a character)
      // r1 = player reply option 1 (only if talking to a character)
      // k1 = karma adjustment for reply 1 (only if talking to a character)
      // t1 = target node for reply 1 (only if talking to a character)
      // r2 = player reply option 2 (only if talking to a character)
      // k2 = karma adjustment for reply 2 (only if talking to a character)
      // t2 = target node for reply 2 (only if talking to a character)
      // r3 = player reply option 3 (only if talking to a character)
      // k3 = karma adjustment for reply 3 (only if talking to a character)
      // t3 = target node for reply 3 (only if talking to a character)
      // md = map viewport chunk data (only if vu == true)
      // es = has player just entered a store?
      // p1 = projectile start X
      // p2 = projectile start Y
      // p3 = projectile stop X
      // p4 = projectile stop Y
      // ph = Did the projectile hit something?
      // pd = Direction projectile was fired in
      sb.append("{");
      if (inMessage == null) {
        sb.append("\"dm\":\"false\",");
      } else {
        sb.append("\"mg\":\"" + inMessage + "\",");
        sb.append("\"dm\":\"true\",");
      }
      if (inGameState.getCurrentMode() == Globals.MODE_BATTLE) {
        sb.append("\"cx\":\"" + inGameState.getCurrentLocationX() + "\",");
        sb.append("\"cy\":\"" + inGameState.getCurrentLocationY() + "\",");
      }
      if (inPlayerInfoUpdated) {
        sb.append("\"pn\":\"" + inGameState.getName() + "\",");
        sb.append("\"ht\":\"" + inGameState.getHealth() + "\",");
        sb.append("\"hp\":\"" + inGameState.getHitPoints()  + "\",");
        sb.append("\"gp\":\"" + inGameState.getGoldPieces() + "\",");
      }
      sb.append("\"iu\":\"" + Boolean.toString(inPlayerInfoUpdated) + "\",");
      sb.append("\"vu\":\"" + Boolean.toString(inViewUpdated) + "\",");
      sb.append("\"di\":\"" + Boolean.toString(inGameState.getPlayerDied()) +
        "\",");
      sb.append("\"wn\":\"" + Boolean.toString(inGameState.getPlayerWon()) +
        "\",");
      sb.append("\"ec\":\"" + Boolean.toString(inExitedCommunity) + "\",");
      sb.append("\"mo\":\"" + inGameState.getCurrentMode() + "\",");
      sb.append("\"es\":\"" + Boolean.toString(inEnteredStore) + "\",");
      if (inGameState.getTalkCharacter() != null) {
        log.debug("About to talk to character : " +
          inGameState.getTalkCharacter());
        GameTalkNode tn =
          inGameState.getTalkCharacter().getTalkConversation().
            getTalkNode(inGameState.getTalkNode());
        sb.append("\"ct\":\"" + inGameState.getTalkCharacter().getType() +
          "\",");
        sb.append("\"cr\":\"" + tn.getResponse() + "\",");
        sb.append("\"r1\":\"" +
          ((GameTalkReply)tn.getReply("1")).getReplyText() + "\",");
        sb.append("\"k1\":\"" +
          ((GameTalkReply)tn.getReply("1")).getKarma() + "\",");
        sb.append("\"t1\":\"" +
          ((GameTalkReply)tn.getReply("1")).getTarget() + "\",");
        sb.append("\"r2\":\"" +
          ((GameTalkReply)tn.getReply("2")).getReplyText() + "\",");
        sb.append("\"k2\":\"" +
          ((GameTalkReply)tn.getReply("2")).getKarma() + "\",");
        sb.append("\"t2\":\"" +
          ((GameTalkReply)tn.getReply("2")).getTarget() + "\",");
        sb.append("\"r3\":\"" +
          ((GameTalkReply)tn.getReply("3")).getReplyText() + "\",");
        sb.append("\"k3\":\"" +
          ((GameTalkReply)tn.getReply("3")).getKarma() + "\",");
        sb.append("\"t3\":\"" +
          ((GameTalkReply)tn.getReply("3")).getTarget() + "\",");
      }
      if (inProjectileInfo != null) {
        sb.append("\"p1\":\"" + (String)inProjectileInfo.get("p1") +
          "\",");
        sb.append("\"p2\":\"" + (String)inProjectileInfo.get("p2") +
          "\",");
        sb.append("\"p3\":\"" + (String)inProjectileInfo.get("p3") + "\",");
        sb.append("\"p4\":\"" + (String)inProjectileInfo.get("p4") + "\",");
        sb.append("\"ph\":\"" + (String)inProjectileInfo.get("ph") + "\",");
        sb.append("\"pd\":\"" + (String)inProjectileInfo.get("pd") + "\",");
      }
      if (viewUpdated) {
        sb.append("\"md\":\"" + mapData.toString() + "\"");
      }
      sb.append("}");

    } // End exception check.

    // Output JSON to response.
    String s = sb.toString();
    log.info("JSON Response = " + s);
    inResponse.setContentLength(s.length());
    inResponse.setContentType("text/plain");
    PrintWriter out = inResponse.getWriter();
    out.print(s);

  } // End writeJSON.


  /**
   * This method returns a descriptive string from a given code.  Generally
   * used to get a descriptive string for a given item code.  Special handling
   * for spells: we get the number of spell cast instances as well.
   *
   * @param  inItemCode  The code from Globals to get a descriptive string for.
   * @param  inGameState The current GameState object.
   * @return             The descriptive string.
   */
  public static String getDescFromCode(final char inItemCode,
    final GameState inGameState) {

    String        s          = null;
    LinkedHashMap inventory  = inGameState.getInventory();
    int           spellCount = 0;
    switch (inItemCode) {
      case Globals.SPELL_FIRE_RAIN:
        spellCount =
          ((Integer)inventory.get(Character.toString(inItemCode))).intValue();
        s = "Fire Rain Spell (" + spellCount + ")";
        break;
      case Globals.SPELL_HEAL_THY_SELF:
        spellCount =
          ((Integer)inventory.get(Character.toString(inItemCode))).intValue();
        s = "Heal Thy Self Spell (" + spellCount + ")";
        break;
      case Globals.SPELL_FREEZE_TIME:
        spellCount =
          ((Integer)inventory.get(Character.toString(inItemCode))).intValue();
        s = "Freeze Time Spell (" + spellCount + ")";
        break;
      case Globals.WEAPON_NONE:
        s = "Bare Hands";
        break;
      case Globals.WEAPON_DAGGER:
        s = "Dagger";
        break;
      case Globals.WEAPON_STAFF:
        s = "Staff";
        break;
      case Globals.WEAPON_MACE:
        s = "Mace";
        break;
      case Globals.WEAPON_SLINGSHOT:
        s = "Slingshot";
        break;
      case Globals.WEAPON_CROSSBOW:
        s = "Crossbow";
        break;
      case Globals.ITEM_KEY_BLUE:
        s = "Blue key";
        break;
      case Globals.ITEM_KEY_SILVER:
        s = "Silver key";
        break;
      case Globals.ITEM_KEY_YELLOW:
        s = "Yellow key";
        break;
      case Globals.ITEM_KEY_GREEN:
        s = "Green key";
        break;
      case Globals.ITEM_KEY_RED:
        s = "Red key";
        break;
      case Globals.ARTIFACT_ANKH:
        s = "Ankh";
        break;
      case Globals.ARTIFACT_STAFF:
        s = "Staff Of Tiuwahha";
        break;
      case Globals.ARTIFACT_MEDALLION:
        s = "Medallion Of The Sub";
        break;
      case Globals.ARTIFACT_SCROLL:
        s = "Life Scroll";
        break;
      case Globals.ARTIFACT_SKULL:
        s = "Crystal Skull";
        break;
      default:
        log.error("** THIS SHOULD NEVER HAPPEN!");
        break;
    }
    return s;

  } // End getDescFromCode().


} // End class.
