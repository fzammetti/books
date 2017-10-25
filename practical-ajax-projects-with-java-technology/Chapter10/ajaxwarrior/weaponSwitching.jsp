<%@ page language="java" import="java.util.*,com.apress.ajaxprojects.ajaxwarrior.*,com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameState" %>

<table border="0" cellpadding="4" cellspacing="0" class="cssInventory" align="center" width="100%">

<%

  GameState gameState = (GameState)session.getAttribute("gameState");
  LinkedHashMap inventory = gameState.getInventory();

  String weaponsPlayerHas = "";
  out.println("<tr><td align=\"center\">");
  out.println("<u>Switch Weapon</u><br><br>");
  out.println("</td></tr>");
  // Bare hands are always available!
  out.println("<tr>");
  out.println("<td valign=\"middle\">");
  out.println("B: Bare Hands");
  out.println("</td>");
  out.println("</tr>");
  weaponsPlayerHas += Globals.WEAPON_NONE;
  // Iterate over inventory and render markup for each item.
  for (Iterator it = inventory.keySet().iterator(); it.hasNext();) {
    out.println("<tr>");
    out.println("<td valign=\"middle\">");
    String key = (String)it.next();
    char   c   = key.charAt(0);
    weaponsPlayerHas += c + " ";
    switch (c) {
      case Globals.WEAPON_DAGGER:
        out.print("D: Dagger");
      break;
      case Globals.WEAPON_STAFF:
        out.print("S: Staff");
      break;
      case Globals.WEAPON_MACE:
        out.print("M: Mace");
      break;
      case Globals.WEAPON_SLINGSHOT:
        out.print("L: Slingshot");
      break;
      case Globals.WEAPON_CROSSBOW:
        out.print("C: Crossbow");
      break;
    }
    out.println("</td>");
    out.println("</tr>");
  } // End iteration.
  weaponsPlayerHas += "dummy";

%>

  <tr>
    <td align="center" colspan="2">
      <br><br><br>
      -- Press SPACEBAR to return to game (no switch) --
    </td>
  </tr>
</table>
<script>gameState.weaponsPlayerHas = "<%=weaponsPlayerHas%>";</script>
