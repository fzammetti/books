<%@ taglib prefix="ajax" uri="javawebparts/taglib/ajaxtags" %>

<html>

  <head>

    <link rel="stylesheet" href="css/styles.css" type="text/css">
    <title>AjaxReader</title>

    <script>


      // This variable deternmines what state our view is in.  Possible values:
      // 0 = Initial, when the page first loads
      // 1 = Headlines showing
      // 2 = Article showing
      var viewState = 0;


      // This variable stores the last link that was clicked when viewing
      // headlines for a feed.  This is used to open the article in a
      // new window.
      var lastClickedLink = null;


      // Image preloads.
      var open_in_new_window_0 = new Image();
      open_in_new_window_0.src = "img/open_in_new_window_0.gif";
      var open_in_new_window_1 = new Image();
      open_in_new_window_1.src = "img/open_in_new_window_1.gif";
      var refresh_headlines_0 = new Image();
      refresh_headlines_0.src = "img/refresh_headlines_0.gif";
      var refresh_headlines_1 = new Image();
      refresh_headlines_1.src = "img/refresh_headlines_1.gif";
      var collapse_sidebar_0 = new Image();
      collapse_sidebar_0.src = "img/collapse_sidebar_0.gif";
      var collapse_sidebar_1 = new Image();
      collapse_sidebar_1.src = "img/collapse_sidebar_1.gif";
      var expand_sidebar_0 = new Image();
      expand_sidebar_0.src = "img/expand_sidebar_0.gif";
      var expand_sidebar_1 = new Image();
      expand_sidebar_1.src = "img/expand_sidebar_1.gif";
      var save_feed_0 = new Image();
      save_feed_0.src = "img/save_feed_0.gif";
      var save_feed_1 = new Image();
      save_feed_1.src = "img/save_feed_1.gif";
      var delete_feed_0 = new Image();
      delete_feed_0.src = "img/delete_feed_0.gif";
      var delete_feed_1 = new Image();
      delete_feed_1.src = "img/delete_feed_1.gif";


      // This function is called onLoad to initialize things.
      function init() {
        // Size the divIFrame div so it takes up the whole window.  There is
        // a browser bug that causes setting the height to 100%, as we'd want
        // to do, to not work.  So, we need to do it via scripting.  And
        // of course, there is a difference between IE and FF in how it counts
        // the size of the document, so some branching logic is in order.  We
        // will use the typical check for the XMLHttpRequest object to
        // determine which browser we're running in.
        var dh = document.body.offsetHeight;
        if (window.XMLHttpRequest) {
          dh = dh - 84;
        } else {
          dh = dh - 120;
        }
        document.getElementById("divIFrame").style.height = dh + "px";
        window.frames["ifContent"].document.open();
        window.frames["ifContent"].document.write(
          "Please click a feed to view headlines...");
        window.frames["ifContent"].document.close();
        document.forms[0].feedTitle.value = "";
        document.forms[0].feedURL.value = "";
        document.forms[0].feedTitleEdit.value = "";
        document.forms[0].feedURLEdit.value = "";
        viewState = 0;

      } // End init().


      // Called when a feed is clicked in the feed list to show headlines.
      // This is also called when the Refresh Headlines button is clicked,
      // hence the need for the event to be passed in.
      function showFeedHeadlines(inEvent, inFeedTitle, inFeedURL) {

        lastClickedLink = null;

        // When the page is first shown and user clicks Refresh button, that
        // isn't a valid condition, so quickly reject that with a message.
        if (viewState == 0 && inEvent == "refresh") {
          alert("Please select a feed first");
          return;
        }
        // When an article is showing...
        if (viewState == 2) {
          // We need to recreate the iFrame within the divIFrame div.  This
          // gets around browser security restrictions since we can't touch
          // the iFrame in most ways once an external article is showing.
          // Unfortunately, there doesn't appear to be a cross-browser way to
          // do this, so we have to branch based on browser type.  We'll use
          // the same check of XMLHttpRequest, even though we are not actually
          // using that object, since that is a pretty good way to determine
          // whether we're using IE vs. some other browser.
          if (window.XMLHttpRequest){
            var newIF = document.createElement("iframe");
            newIF.setAttribute("name", "ifContent");
            newIF.setAttribute("width", "100%");
            newIF.setAttribute("height", "100%");
            newIF.setAttribute("frameborder", "no");
            var dif = document.getElementById("divIFrame");
            dif.appendChild(newIF);
          } else {
            document.getElementById("divIFrame").innerHTML =
              "<iframe name=\"ifContent\" width=\"100" + "%" + "\" " +
              "height=\"100" + "%" + "\" frameborder=\"no\"></iframe>"
          }
        }
        // When refresh is clicked and a feed is shown...
        if (inEvent == "refresh") {
          inFeedTitle = feedForm.feedTitle.value;
          inFeedURL = feedForm.feedURL.value;
        }
        // Set values in form.
        feedForm.feedTitle.value = inFeedTitle;
        feedForm.feedURL.value = inFeedURL;
        feedForm.feedTitleEdit.value = inFeedTitle;
        feedForm.feedURLEdit.value = inFeedURL;
        // Write out contents to iFrame.
        window.frames["ifContent"].document.open();
        window.frames["ifContent"].document.write(
          "Please wait, retrieving headlines...");
        window.frames["ifContent"].document.close();
        // Call our manual Ajax function (which AjaxTags wrote for us) to do
        // the actual headlines refresh, and also udpate the view state
        // appropriately.
        doRefreshHeadlines();
        viewState = 1;
      } // End showFeedHeadlines().


      // Called to collapse or expand the sidebar so more of the feed
      // headlines or an article can be seen.
      function collapseExpandSidebar() {

        var tds = document.getElementById("tdSidebar");
        var o = document.getElementById("btnExpandCollapseSidebar");
        if (o.getAttribute("whichButton") == "collapse") {
          tds.style.display = "none";
          o.setAttribute("whichButton", "expand");
          o.src = "img/expand_sidebar_0.gif";
        } else {
          tds.style.display = "block";
          o.setAttribute("whichButton", "collapse");
          o.src = "img/collapse_sidebar_0.gif";
        }

      } // End collapseExpandSidebar().


      // Called when a link in the iFrame is clicked.
      function linkClicked(inLinkUri) {

        lastClickedLink = inLinkUri;
        viewState = 2;

      } // End linkClicked().


      // Called to open article in a new window.
      function openInNewWindow() {
        if (lastClickedLink != null) {
          var winOpts = "menubar,resizable,scrollbars,titlebar,status," +
            "toolbar,width=640px,height=480px,top=0px,left=0px";
          window.open(lastClickedLink, "Print", winOpts);
        }
      }


    </script>


  </head>

  <body onLoad="init();" class="cssMain">

    <!-- Ajax event to continually update our feed list. -->
    <ajax:timer ajaxRef="page/listFeeds" startOnLoad="true" frequency="1000" />

    <!-- Function to be called when a feed is clicked. -->
    <ajax:manual ajaxRef="page/showHeadlines"
      manualFunction="doRefreshHeadlines" />

    <table border="1" cellpadding="0" cellspacing="0" bordercolor="#000000"
      width="100%" height="100%" class="cssMain" id="outerTable">
      <tr>
        <!-- Sidebar. -->
        <td width="250" id="tdSidebar" class="cssSidebar">
          <table border="0" cellpadding="4" cellspacing="0" width="100%"
            height="100%" class="cssMain">
            <tr>
              <!-- Feed Maintenance. -->
              <td height="200" valign="top">
                <form name="feedForm" onSubmit="return false;">
                  <input type="hidden" name="feedTitle">
                  <input type="hidden" name="feedURL">
                  Feed Title:<br>
                  <input type="text" name="feedTitleEdit" size="30"
                    maxlength="50" class="cssTextbox"
                    onFocus="this.className='cssTextboxActive';"
                    onBlur="this.className='cssTextbox';">
                  <br><br>
                  Feed URL:<br>
                  <input type="text" name="feedURLEdit" size="30"
                    maxlength="100" class="cssTextbox"
                    onFocus="this.className='cssTextboxActive';"
                    onBlur="this.className='cssTextbox';">
                  <br><br>
                  <input type="image" src="img/save_feed_0.gif"
                    hspace="2" valign="absmiddle" border="0"
                    onMouseOver="this.src=save_feed_1.src;"
                    onMouseOut="this.src=save_feed_0.src;"><ajax:event ajaxRef="feedForm/saveFeed" />
                  &nbsp;&nbsp;&nbsp;
                  <input type="image" src="img/delete_feed_0.gif"
                    hspace="2" valign="absmiddle" border="0"
                    onMouseOver="this.src=delete_feed_1.src;"
                    onMouseOut="this.src=delete_feed_0.src;"><ajax:event ajaxRef="feedForm/deleteFeed" />
                </form>
                <hr width="100%" color="#000000">
              </td>
            </td>
            <tr>
              <!-- Feed List. -->
              <td valign="top">
                <div class="cssFeedList" id="divFeedList">
                  Please wait,<br>retrieving feed list...
                </div>
              </td>
            </tr>
          </table>
        </td>
        <!-- Main content. -->
        <td>
          <table border="0" cellpadding="4" cellspacing="0" width="100%"
            height="100%" class="cssMain">
            <tr height="60" id="topBar">
              <!-- Control and title. -->
              <td width="100%" valign="middle" class="cssControlTitle">
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                  height="100%" class="cssMain">
                  <tr>
                    <td width="220">
                      <img src="img/rssreader_title.gif" valign="absmiddle">
                    </td>
                    <td align="right">
                      <input type="image" src="img/refresh_headlines_0.gif"
                        hspace="10" valign="absmiddle" border="0"
                        onMouseOver="this.src=refresh_headlines_1.src;"
                        onMouseOut="this.src=refresh_headlines_0.src;"
                        onClick="showFeedHeadlines('refresh', '', '');">
                      <input type="image" src="img/collapse_sidebar_0.gif"
                        id="btnExpandCollapseSidebar" hspace="10"
                        valign="absmiddle" border="0"
                        onMouseOver="this.src=eval(this.getAttribute('whichButton')+'_sidebar_1').src;"
                        onMouseOut="this.src=eval(this.getAttribute('whichButton')+'_sidebar_0').src;"
                        onClick="collapseExpandSidebar();"
                        whichButton="collapse">
                      <input type="image" src="img/open_in_new_window_0.gif"
                        hspace="10" valign="absmiddle" border="0"
                        onMouseOver="this.src=open_in_new_window_1.src;"
                        onMouseOut="this.src=open_in_new_window_0.src;"
                        onClick="openInNewWindow();">
                    </td>
                  </tr>
                  <!-- Divider line. -->
                  <tr height="10">
                    <td class="cssDividerRow" valign="top" colspan="2">
                      <hr width="100%" color="#000000">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Content. -->
            <tr>
              <td valign="top">
                <div id="divIFrame"><iframe name="ifContent" width="100%"
                  height="100%" frameborder="no"></iframe></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>


  </body>

<ajax:enable debug="false" />
</html>
