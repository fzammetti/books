<%@ page language="java" import="java.util.*,com.apress.ajaxprojects.ajaxwarrior.*,com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameState" %>

<table border="0" cellpadding="4" cellspacing="0" class="cssInventory" align="center" width="100%">

<%
GameState gameState = (GameState)session.getAttribute("gameState");
LinkedHashMap   inventory = gameState.getInventory();

String spellsPlayerHas = "";
if (inventory.isEmpty()) {
  // Nothing in inventory, just a simple display.
  out.println("<tr><td align=\"center\">");
  out.println("<u>Cast A Spell</u>");
  out.println("<br><br><br><br>");
  out.println("You currently have no spell scrolls.");
  out.println("</td><tr>");
} else {
  // We have some inventory, so first render the header.
  out.println("<tr><td align=\"center\">");
  out.println("<u>Cast A Spell</u><br><br>");
  out.println("</td></tr>");
  // Iterate over inventory and render markup for each item.
  for (Iterator it = inventory.keySet().iterator(); it.hasNext();) {
    out.println("<tr>");
    out.println("<td valign=\"middle\">");
    String key = (String)it.next();
    char   c   = key.charAt(0);
    spellsPlayerHas += c + " ";
    switch (c) {
      case Globals.SPELL_FIRE_RAIN:
        out.print("F: Fire Rain");
      break;
      case Globals.SPELL_HEAL_THY_SELF:
        out.print("H: Heal Thy Self");
      break;
      case Globals.SPELL_FREEZE_TIME:
        out.print("T: Freeze Time");
      break;
    }
    out.println("</td>");
    out.println("</tr>");
  } // End iteration.
  spellsPlayerHas += "dummy";
}
%>

  <tr>
    <td align="center" colspan="2">
      <br><br><br>
      -- Press SPACEBAR to return to game (no spell cast) --
    </td>
  </tr>
</table>
<script>gameState.spellsPlayerHas = "<%=spellsPlayerHas%>";</script>
