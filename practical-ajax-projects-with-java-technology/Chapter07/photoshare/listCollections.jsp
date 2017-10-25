<% /*
      This JSP is responsible for rendering the markup for the collections
      select dropdown in the control frame.  It uses the collections request
      attribute set there by the ListCollections Action.
    */
%>
<%@ page language="java" import="java.util.*" %>
<select id="collectionsList" class="cssMain" 
  onChange="parent.fraMain.loadCollection();">
  <option value="none">--Select--</option>
  <%
    HashMap collections = (HashMap)request.getAttribute("collections");
    for (Iterator it = collections.keySet().iterator(); it.hasNext();) {
      String name = (String)it.next();
  %>
      <option value="<%=name%>"><%=name%></option>
  <%
    }
  %>
</select>
