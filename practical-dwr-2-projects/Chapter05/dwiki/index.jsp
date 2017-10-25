<html>

  <head>

    <title>DWIKI - A DWR-Based Wiki</title>

    <link rel="stylesheet" href="css/styles.css" type="text/css">

    <!-- DWR imports. -->
    <script src="dwr/engine.js"></script>
    <script src="dwr/util.js"></script>
    <script src="dwr/interface/ArticleDAO.js"></script>

    <!-- Application code imports. -->
    <script src="js/RolloversClass.js"></script>
    <script src="js/DWikiClass.js"></script>

  </head>

  <body onLoad="DWiki.init();">

    <table width="90%" border="0" align="center" cellpadding="0"
      cellspacing="0">

      <!-- Top section. -->
      <tr>
        <td class="cssTop">
          <img src="img/logo.gif">
        </td>
        <td align="right" class="cssTop" valign="top">
          <span id="userInfo">
            <%
              if (request.getUserPrincipal() != null) {
            %>
              <%=request.getUserPrincipal().getName()%>
            <%
              } else {
            %>
              Anonymous User
            <%
              }
            %>
          </span>
          |
          <a href="loginOk.jsp" target="_new">Login</a>
        </td>
      </tr>

      <!-- Top menu. -->
      <tr>
        <td colspan="2" class="cssTopNav" align="center">
          <img src="img/article0.gif" id="article" class="cssClickable"
            onClick="DWiki.articleClicked();"
            onMouseOver="Rollovers.imgOver(this);"
            onMouseOut="Rollovers.imgOut(this);">
          <img src="img/edit0.gif" id="edit" class="cssClickable"
            onClick="DWiki.editClicked();"
            onMouseOver="Rollovers.imgOver(this);"
            onMouseOut="Rollovers.imgOut(this);">
          <img src="img/history0.gif" id="history" class="cssClickable"
            onClick="DWiki.historyClicked();"
            onMouseOver="Rollovers.imgOver(this);"
            onMouseOut="Rollovers.imgOut(this);">
          <img src="img/comments0.gif" id="comments" class="cssClickable"
            onClick="DWiki.commentsClicked();"
            onMouseOver="Rollovers.imgOver(this);"
            onMouseOut="Rollovers.imgOut(this);">
        </td>
      </tr>

      <!-- Main content area. -->
      <tr>
        <td colspan="2">

          <!-- Left menu. -->
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td valign="top" class="cssLeftNav">
                <img src="img/frontPage0.gif" id="frontPage"
                  class="cssClickable" onClick="DWiki.getArticle('FrontPage');"
                  onMouseOver="Rollovers.imgOver(this);"
                  onMouseOut="Rollovers.imgOut(this);"><br>
                <img src="img/allArticlesIndex0.gif" id="allArticlesIndex"
                  class="cssClickable"
                  onClick="DWiki.getArticle('AllArticlesIndex');"
                  onMouseOver="Rollovers.imgOver(this);"
                  onMouseOut="Rollovers.imgOut(this);"><br>
                <img src="img/search0.gif" id="search"
                  class="cssClickable"
                  onClick="DWiki.getArticle('Search');"
                  onMouseOver="Rollovers.imgOver(this);"
                  onMouseOut="Rollovers.imgOut(this);"><br>
                <img src="img/help0.gif" id="help"
                  class="cssClickable" onClick="DWiki.getArticle('DWikiHelp');"
                  onMouseOver="Rollovers.imgOver(this);"
                  onMouseOut="Rollovers.imgOut(this);"><br>
              </td>

              <!-- Main content area. -->
              <td width="100%" class="cssArticle" valign="top">

                <!-- Loading message. -->
                <span id="loadingMessage">Loading...</span>

                <!-- Article content. -->
                <span id="articleContents" style="display:none;"></span>

                <!-- Article editing display. -->
                <span id="articleEditing" style="display:none;">
                  You are now editing the article
                  entitled: <b><span id="articleEditing_title">&nbsp;</span></b>
                  <br><br>
                  <textarea id="articleEditing_text"
                    cols="80" rows="10"></textarea>
                  <br><br>
                  <input type="button" value="Click To Save Changes"
                    onClick="DWiki.updateArticle();">
                </span>

                <!-- Article history. -->
                <span id="articleHistory" style="display:none;"></span>

                <!-- Article comments. -->
                <span id="articleComments" style="display:none;"></span>

              </td>
            </tr>

            <!-- Footer. -->
            <tr valign="middle">
              <td height="22" colspan="2" class="cssFooter" align="center"
                id="statusBar">
                Powered By <a href="http://getahead.org/dwr">DWR</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>

    </table>

  </body>

</html>
