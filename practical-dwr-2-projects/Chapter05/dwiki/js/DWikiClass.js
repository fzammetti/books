/**
 * This is the main JavaScript for the DWiki application.
 */
function DWikiClass() {


  /**
   * This is the current Article object.
   */
  this.currentArticle = null;


  /**
   * This is the current mode (Article, Edit, History, Comments) that the user
   * is working in.
   */
  this.currentMode = null;


  /**
   * This is the timer used to show countdown to edit lock expiration.
   */
  this.lockTimer = null;


  /**
   * This is the number of seconds remaining before the edit lock expires.
   */
  this.lockCountdown = null;


  /**
   * This is the markup that is by default in the status bar area.
   */
  this.statusBarMarkup = "Powered By " +
    "<a href=\"http://getahead.org/dwr\">DWR</a>";


  /**
   * This function is called onLoad of index.jsp to show the Front Page, and
   * perform any other client-side initialization the Wiki requires.
   */
  this.init = function() {

    this.getArticle("FrontPage");

  } // End init().


  /**
   * Show the loading message, and hide any content.  Used when calls to the
   * server are made.
   */
  this.showLoading = function() {

    dwr.util.byId("articleContents").style.display = "none";
    dwr.util.byId("articleEditing").style.display = "none";
    dwr.util.byId("articleHistory").style.display = "none";
    dwr.util.byId("articleComments").style.display = "none";
    dwr.util.byId("loadingMessage").style.display = "";

  } // End showLoading().


  /**
   * Called to switch between the four modes: article (viewing), edit,
   * history and comments.
   *
   * @param One of four values: "article", "edit", "history" or "comments".
   */
  this.switchMode = function(inMode) {

    // Begin by resetting everything to a generic state.
    this.currentMode = "";
    Rollovers.imgOut(dwr.util.byId("article"));
    Rollovers.imgOut(dwr.util.byId("edit"));
    Rollovers.imgOut(dwr.util.byId("history"));
    Rollovers.imgOut(dwr.util.byId("comments"));
    dwr.util.byId("articleContents").style.display = "none";
    dwr.util.byId("articleEditing").style.display = "none";
    dwr.util.byId("articleHistory").style.display = "none";
    dwr.util.byId("articleComments").style.display = "none";
    dwr.util.byId("loadingMessage").style.display = "none";
    this.currentMode = inMode;

    // Now branch based on the new mode.
    if (inMode == "article") {
      dwr.util.byId("articleContents").style.display = "";
      var lastEdited = "";
      // Insert last updated line, if present (for a new article, it wouldn't).
      if (this.currentArticle.lastEdited != null) {
        lastEdited = "<br><hr><br>Last edited " +
          this.currentArticle.lastEdited +
          " by " + this.currentArticle.lastEditedBy;
      }
      dwr.util.byId("articleContents").innerHTML = "<pre>" +
        this.currentArticle.text + "</pre>" + lastEdited;
    } else if (inMode == "edit") {
      dwr.util.byId("articleEditing").style.display = "";
    } else if (inMode == "history") {
      dwr.util.byId("articleHistory").style.display = "";
    } else if (inMode == "comments") {
      dwr.util.byId("articleComments").style.display = "";
    }
    Rollovers.imgOver(dwr.util.byId(this.currentMode));

  } // End switchMode().


  /**
   * This function is called to create a new article.
   *
   * @param inArticleTitle The title of the article to create.
   */
  this.addArticle = function(inArticleTitle) {

    if (dwr.util.getValue("userInfo").replace(/^\s*(.*\S|.*)\s*$/, '$1') ==
      "Anonymous User") {
      alert("You must be a registered user to add this article");
    } else {
      ArticleDAO.addArticle(inArticleTitle,
        {
          callback : function(inResp) {
            DWiki.getArticle(inArticleTitle);
          }
        }
      );
    }

  } // End addArticle().


  /**
   * This function is called to retrieve and display a specified article.
   *
   * @param inArticleTitle The title of the article to get.
   * @param inExtraData1   First extra bit of data.  Only currently needed for
   *                       search functionality.
   * @param inExtraData2   Second extra bit of data.  Only currently needed for
   *                       search functionality.
   */
  this.getArticle = function(inArticleTitle, inExtraData1, inExtraData2) {

    this.showLoading();
    ArticleDAO.getArticle(inArticleTitle, inExtraData1, inExtraData2, true,
      {
        callback : function(inResp) {
          DWiki.currentArticle = inResp;
          DWiki.switchMode("article");
        }
      }
    );

  } // End getArticle().


  /**
   * Called when the Article link on top is clicked.
   */
  this.articleClicked = function() {

    if (this.currentMode != "article") {
      this.switchMode("article");
    }

  } // End articleClicked().


  /**
   * Called when the Edit link on top is clicked.
   */
  this.editClicked = function() {

    // Disallow this function for certain "system" articles.
    if (this.currentArticle.title != "DWikiHelp" &&
      this.currentArticle.title != "AllArticlesIndex" &&
      this.currentArticle.title != "Search" &&
      this.currentArticle.title != "SearchResults") {
      if (dwr.util.getValue("userInfo").replace(/^\s*(.*\S|.*)\s*$/, '$1') ==
        "Anonymous User") {
        alert("You must be a registered user to edit this article");
      } else {
        if (this.currentArticle.articleExists == false) {
          alert("This article must be created before it can be edited.  " +
            "Click the link below to create it.");
          return;
        }
        // Only switch to edit mode if not already there.
        if (this.currentMode != "edit") {
          this.showLoading();
          ArticleDAO.lockArticleForEditing(this.currentArticle.title,
            {
              callback : function(inResp) {
                if (inResp.indexOf("ok") != -1) {
                  // Article is available for editing.  Response was in the
                  // form ok=yyy=zzz, where yyy is the number of seconds the
                  // edit lock lasts, and zzz is the text of the article,
                  // so we need to split to get that value.
                  DWiki.lockCountdown = inResp.split("=")[1];
                  DWiki.switchMode("edit");
                  dwr.util.byId("articleEditing_title").innerHTML =
                    DWiki.currentArticle.title;
                  document.getElementById("articleEditing_text").value =
                    inResp.split("=")[2];
                  // Start the lock expiration countdown.
                  DWiki.lockTimer = setTimeout("DWiki.updateLockTimer()", 0);
                } else if (inResp.indexOf("lockedBy" != -1)) {
                  // Article is locked by someone else, can't edit it.  Response
                  // was in the form lockedBy=yyy, where yyy is the username
                  // that has the article locked, so we need to split it to get
                  // that value.
                  var respArray = inResp.split("=");
                  DWiki.switchMode(DWiki.currentMode);
                  alert("Article is already locked by " + respArray[1] +
                    " for " + respArray[2] + " more seconds");
                } else {
                  // Some unknown error occured, so article can't be edited.
                  DWiki.switchMode(DWiki.currentMode);
                  alert("Article could not be locked for editing, " +
                    "reason unknown");
                }
              }
            }
          );
        }
      }
    } else {
      alert("This function is not available for this article");
    }

  } // End editClicked().


  /**
   * This function is called once per second while an article is being edited.
   * It counts down to the edit lock expiration, showing the time remaining in
   * the status bar.  Once the time expires, a message is displayed saying
   * changes will be lost (not the nicest thing to do, but easy to implement!).
   */
  this.updateLockTimer = function() {

    if (DWiki.lockCountdown == 0) {
      // Edit lock has expired.
      dwr.util.byId("statusBar").innerHTML = DWiki.statusBarMarkup;
      alert("Your edit lock on this article has expired.  Your changes will " +
        "be lost.");
      DWiki.lockTimer = null;
      return;
    }
    // Edit lock still hasn't expired, update UI and prepare next iteration.
    dwr.util.byId("statusBar").innerHTML = "Edit lock will expire in " +
      DWiki.lockCountdown + " seconds";
    DWiki.lockCountdown = DWiki.lockCountdown - 1;
    DWiki.lockTimer = setTimeout("DWiki.updateLockTimer()", 1000);

  } // End updateLockTimer().


  /**
   * Called when the History link on top is clicked.
   */
  this.historyClicked = function() {

    // Disallow this function for certain "system" articles.
    if (this.currentArticle.title != "DWikiHelp" &&
      this.currentArticle.title != "AllArticlesIndex" &&
      this.currentArticle.title != "Search" &&
      this.currentArticle.title != "SearchResults") {
      if (this.currentMode == "history") {
        return;
      }
      this.showLoading();
      ArticleDAO.getArticleHistory(this.currentArticle.title,
        {
          callback : function(inResp) {
            DWiki.switchMode("history");
            dwr.util.byId("articleHistory").innerHTML = inResp;
          }
        }
      );
    } else {
      alert("This function is not available for this article");
    }

  } // End historyClicked().


  /**
   * Called when a history item is clicked.  This toggles the text being shown
   * or not.
   *
   * @param inID The ID of the history item being toggled.
   */
  this.toggleHistory = function(inID) {

    var historyDiv = dwr.util.byId(inID);
    if (historyDiv.style.display == "none") {
      historyDiv.style.display = "";
    } else {
      historyDiv.style.display = "none";
    }

  } // End toggleHistory().


  /**
   * Called when the Comments link on top is clicked.
   *
   * @param inForceUpdate If true, the comments will be updated, regardless
   *                      of the current mode.  This is used after a comment is
   *                      added to update the display so it shows up.
   */
  this.commentsClicked = function(inForceUpdate) {

    // Disallow this function for certain "system" articles.
    if (this.currentArticle.title != "DWikiHelp" &&
      this.currentArticle.title != "AllArticlesIndex" &&
      this.currentArticle.title != "Search" &&
      this.currentArticle.title != "SearchResults") {
      if (this.currentMode == "comments" && inForceUpdate != true) {
        return;
      }
      this.showLoading();
      ArticleDAO.getArticleComments(this.currentArticle.title,
        {
          callback : function(inResp) {
            DWiki.switchMode("comments");
            dwr.util.byId("articleComments").innerHTML = inResp;
          }
        }
      );
    } else {
      alert("This function is not available for this article");
    }

  } // End commentsClicked().


  /**
   * Called to save a comment for the current article.
   *
   */
  this.addComment = function() {

    ArticleDAO.addComment(
      {
        articleTitle : this.currentArticle.title,
        text : dwr.util.getValue("commentText")
      },
      {
        callback : function(inResp) {
          DWiki.commentsClicked(true);
        }
      }
    );

  } // End addComment().


  /**
   * Called when the save link is clicked when editing an article.
   */
  this.updateArticle = function() {

    if (this.lockTimer == null) {
      alert("Your lock on this article has expired.  You will need to " +
        "re-acquire it by clicking the Article link above, then clicking the " +
        "Edit link again");
      return;
    }
    this.currentArticle.text = dwr.util.getValue("articleEditing_text");
    ArticleDAO.updateArticle(this.currentArticle, true,
      {
        callback : function(inResp) {
          clearTimeout(DWiki.lockTimer);
          DWiki.lockTimer = null;
          dwr.util.byId("statusBar").innerHTML = DWiki.statusBarMarkup;
          DWiki.getArticle(DWiki.currentArticle.title);
        }
      }
    );

  } // End updateArticle().


} // End class.


// The one and only instance of DWikiClass.
var DWiki = new DWikiClass();
