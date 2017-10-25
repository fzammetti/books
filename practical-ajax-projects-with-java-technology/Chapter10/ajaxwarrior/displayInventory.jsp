<%@ page language="java" import="java.util.*,com.apress.ajaxprojects.ajaxwarrior.*,com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameState" %>

<table border="0" cellpadding="4" cellspacing="0" class="cssInventory" align="center" width="100%">

<%
GameState     gameState = (GameState)session.getAttribute("gameState");
LinkedHashMap inventory = gameState.getInventory();

if (inventory.isEmpty()) {
  // Nothing in inventory, just a simple display.
  out.println("<tr><td align=\"center\" colspan=\"2\">");
  out.println("<u>Inventory</u>");
  out.println("<br><br><br><br>");
  out.println("You are currently holding nothing.");
  out.println("</td></tr>");
} else {
  // We have some inventory, so first render the header.
  out.println("<tr><td align=\"center\" colspan=\"2\">");
  out.println("<u>Inventory</u><br><br>");
  out.println("</td></tr>");
  boolean firstColumn = true;
  int i = 0;
  // Iterate over inventory and render markup for each item.
  for (Iterator it = inventory.keySet().iterator(); it.hasNext();) {
    i++;
    if (firstColumn) {
      out.println("<tr>");
      out.println("<td valign=\"middle\" width=\"50%\">");
    } else {
      out.println("<td valign=\"middle\" align=\"right\" width=\"50%\">");
    }
    String key         = (String)it.next();
    char   c           = key.charAt(0);
    String description = Utils.getDescFromCode(c, gameState);
    if (!firstColumn) {
      out.println(description + "&nbsp;&nbsp;");
    }
    switch (c) {
      case Globals.SPELL_FIRE_RAIN:
      case Globals.SPELL_HEAL_THY_SELF:
      case Globals.SPELL_FREEZE_TIME:
        out.print("<img src=\"img/item_spell_scroll.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ITEM_KEY_BLUE:
        out.print("<img src=\"img/item_key_blue.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ITEM_KEY_SILVER:
        out.print("<img src=\"img/item_key_silver.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ITEM_KEY_YELLOW:
        out.print("<img src=\"img/item_key_yellow.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ITEM_KEY_GREEN:
        out.print("<img src=\"img/item_key_green.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ITEM_KEY_RED:
        out.print("<img src=\"img/item_key_red.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ARTIFACT_ANKH:
        out.print("<img src=\"img/artifact_ankh.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ARTIFACT_STAFF:
        out.print("<img src=\"img/artifact_staff.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ARTIFACT_MEDALLION:
        out.print("<img src=\"img/artifact_medallion.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ARTIFACT_SCROLL:
        out.print("<img src=\"img/artifact_scroll.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
      case Globals.ARTIFACT_SKULL:
        out.print("<img src=\"img/artifact_skull.gif\" align=\"absmiddle\" width=\"16\" height=\"16\">");
      break;
    }
    if (firstColumn) {
      out.println("&nbsp;&nbsp;" + description);
    }
    out.println("&nbsp;&nbsp;&nbsp;&nbsp;</td>");
    // If we just rendered the first column, just move on to the next.  If we
    // just rendered the second column, we need to close the row.
    if (firstColumn) {
      firstColumn = false;
    } else {
      out.println("</tr>");
      firstColumn = true;
    }
  } // End iteration.
  // If we only had one item in the inventory, we still need a second column
  // so go ahead and render that if applicable.
  if (i == 1) {
    out.println("<td valign=\"middle\" width=\"50%\">&nbsp;</td></tr>");
  }
}
%>

  <tr>
    <td align="center" colspan="2">
      <br><br><br>
      -- Press SPACEBAR to return to game --
    </td>
  </tr>
</table>