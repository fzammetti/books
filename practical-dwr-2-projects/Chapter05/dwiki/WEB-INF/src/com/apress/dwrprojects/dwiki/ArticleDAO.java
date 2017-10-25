package com.apress.dwrprojects.dwiki;


import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Data Access Object for working with Articles.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ArticleDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ArticleDAO.class);


  /**
   * SQL for adding an article.
   */
  private static final String SQL_ADD_ARTICLE =
    "INSERT INTO articles (title, creator, created, text, lastedited, " +
    "lasteditedby) VALUES ('${articleTitle}', 'SYSTEM', " +
    "CURRENT_TIMESTAMP, '${text}', CURRENT_TIMESTAMP, 'SYSTEM')";


  /**
   * SQL for getting a single article.
   */
  private static final String SQL_GET_ARTICLE =
    "SELECT * FROM articles WHERE title='${articleTitle}'";


  /**
   * SQL for adding a history item for an article.
   */
  private static final String SQL_ADD_ARTICLE_HISTORY =
    "INSERT INTO articlehistory (articletitle, previoustext, newtext, " +
    "edited, editedby) VALUES ('${articleTitle}', '${previousText}', " +
    "'${newText}', CURRENT_TIMESTAMP, '${editedBy}')";


  /**
   * SQL for getting a single article's history.
   */
  private static final String SQL_GET_ARTICLE_HISTORY =
    "SELECT * FROM articlehistory WHERE articletitle='${articleTitle}'";


  /**
   * SQL for adding a comment for an article.
   */
  private static final String SQL_ADD_ARTICLE_COMMENT =
    "INSERT INTO articlecomments (articletitle, text, " +
    "posted, poster) VALUES ('${articleTitle}', '${text}', " +
    "CURRENT_TIMESTAMP, '${poster}')";


  /**
   * SQL for getting a single article's comments.
   */
  private static final String SQL_GET_ARTICLE_COMMENTS =
    "SELECT * FROM articlecomments WHERE articletitle='${articleTitle}'";


  /**
   * SQL for getting a list of all articles.
   */
  private static final String SQL_GET_ARTICLES =
    "SELECT title, creator, created FROM articles";


  /**
   * SQL for updating an article.
   */
  private static final String SQL_UPDATE_ARTICLE =
    "UPDATE articles SET text='${text}', lastedited=CURRENT_TIMESTAMP, " +
    "lasteditedby='${lastEditedBy}', lockedby='${lockedBy}', " +
    "locktime='${lockTime}' WHERE title='${title}'";


  /**
    * SQL for searching for articles by title.
    */
  private static final String SQL_FIND_ARTICLE_BY_TITLE =
    "SELECT * FROM articles WHERE UCASE(title) " +
    "LIKE UCASE('%${searchText}%')";


  /**
    * SQL for searching for articles by article text.
    */
  private static final String SQL_FIND_ARTICLE_BY_TEXT =
    "SELECT * FROM articles WHERE UCASE(text) LIKE UCASE('%${searchText}%')";


  /**
    * SQL for searching for articles by both article title and text.
    */
  private static final String SQL_FIND_ARTICLE_BY_BOTH =
    "SELECT * FROM articles WHERE UCASE(title) LIKE " +
    "UCASE('%${searchText}%') OR UCASE(text) LIKE UCASE('%${searchText}%')";


  /**
   * The DatabaseWorker instance all methods of this class instance will use.
   */
  private DatabaseWorker databaseWorker;


  /**
   * Constuctor for this class.  It instantiates a DatabaseWorker object that
   * all methods will use.
   */
  public ArticleDAO() throws Exception {

    super();

    log.trace("ArticleDAO.ArticleDAO() - Entry");

    try {

      // Need a DatabaseWorker instance.
      databaseWorker = new DatabaseWorker();

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

    log.trace("ArticleDAO.ArticleDAO() - Exit");

  } // End constructor.


  /**
   * Adds a new article to the Wiki.
   *
   * @param  inTitle    The title of the article being added.
   * @return            The Article object representing the newly added article.
   * @throws Exception  If anything goes wrong.
   */
  public Article addArticle(final String inArticleTitle) throws Exception {

    log.trace("ArticleDAO.addArticle() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.addArticle() - inArticleTitle = " + inArticleTitle);
      }

      // Construct Map of parameters for SQL query.
      HashMap<String, Object> vals = new HashMap<String, Object>();
      vals.put("articleTitle", inArticleTitle);
      vals.put("text", new Freemarker().run("newArticle.ftl", new HashMap()));

      // Now write the record, then read it back so we can return it.
      databaseWorker.executeUpdate(SQL_ADD_ARTICLE, vals);
      Article article = getArticle(inArticleTitle, null, null, true);

      log.trace("ArticleDAO.addArticle() - Exit");
      return article;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addArticle().


  /**
   * Gets a single article.
   *
   * @param  inArticleTitle    The title of the article to retrieve.
   * @param  inExtraData1      First extra bit of data.  Only currently needed
   *                           for search functionality.
   * @param  inExtraData2      Second extra bit of data.  Only currently needed
   *                           forsearch functionality.
   * @param  inDoLinkExpansion When true, article links are "expanded" so they
   *                           are clickable.  When false, they are just plain
   *                           text (this is needed for editing).
   * @return                   The Article object, or null if not found.
   * @throws Exception         If anything goes wrong.
   */
  public Article getArticle(final String inArticleTitle,
    final String inExtraData1, final String inExtraData2,
      final boolean inDoLinkExpansion) throws Exception {

    log.trace("ArticleDAO.getArticle() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getArticle() - inArticleTitle = " +
          inArticleTitle);
        log.debug("ArticleDAO.getArticle() - inExtraData1 = " +
          inExtraData1);
        log.debug("ArticleDAO.getArticle() - inExtraData2 = " +
          inExtraData2);
        log.debug("ArticleDAO.getArticle() - inDoLinkExpansion = " +
          inDoLinkExpansion);
      }

      Article article = null;
      boolean doLinkExpansion = inDoLinkExpansion;

      // There are a couple of "special" article titles that could be received
      // here.  Deal with those first.
      if (inArticleTitle.equals("AllArticlesIndex")) {
        article = getAllArticles();
        doLinkExpansion = false;
      } else if (inArticleTitle.equals("DWikiHelp")) {
        article = getStaticArticle("DWikiHelp", new HashMap());
      } else if (inArticleTitle.equals("Search")) {
        article = getStaticArticle("Search", new HashMap());
        doLinkExpansion = false;
      } else if (inArticleTitle.equals("SearchResults")) {
        article = search(inExtraData1, inExtraData2);
        doLinkExpansion = false;
      } else {

        // Construct Map of parameters for SQL query.
        HashMap<String, String> vals = new HashMap<String, String>();
        vals.put("articleTitle", inArticleTitle);

        List articles = databaseWorker.executeQuery(SQL_GET_ARTICLE, vals);

        article = new Article();
        if (articles.size() == 0) {
          // An article with the specified title wasn't found, so create the
          // default "does not exist" page.  This DOES NOT affect the database, it
          // just gives the client the proper thing to display.
          log.debug("Article NOT found, creating default");
          doLinkExpansion = false;
          article.setArticleExists(false);
          article.setTitle("inArticleTitle");
          article.setCreated(new Timestamp(new java.util.Date().getTime()));
          article.setCreator("SYSTEM");
          Map<String, Object> tokens = new HashMap<String, Object>();
          tokens.put("articleTitle", inArticleTitle);
          article.setText(new Freemarker().run("nonexistentArticle.ftl",
            tokens));
        } else {
          // Article was found, so populate an Article object from it.
          log.debug("ArticleDAO.getArticle() - Article found");
          Map m = (Map)articles.get(0);
          article.setTitle((String)m.get("TITLE"));
          article.setCreated((Timestamp)m.get("CREATED"));
          article.setCreator((String)m.get("CREATOR"));
          article.setText((String)m.get("TEXT"));
          article.setLastEdited((Timestamp)m.get("LASTEDITED"));
          article.setLastEditedBy((String)m.get("LASTEDITEDBY"));
          article.setLockedBy((String)m.get("LOCKEDBY"));
          article.setLockTime((Timestamp)m.get("LOCKTIME"));
        }

      }

      // Call the article link expansion function.  Don't do this if the
      // doLinkExpansion flag is false.  This is needed in some cases, like when
      // the article is new for example.
      if (doLinkExpansion) {
        article.setText(expandLinks(article.getText()));
      }

      // Return the Article object constructed above.
      log.debug("ArticleDAO.getArticle() - article = " + article);
      log.trace("ArticleDAO.getArticle() - Exit");
      return article;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getArticle().


  /**
   * This function "expands" any article link words.  This means we
   * tokenize the string, breaking on space, so that each token is basically
   * a word.  Then, for each word, we check if the first letter is a capital
   * letter.  If it is, and it isn't proceeded by our no-link indicator
   * character, then we replace it with the appropriate link code.
   * This is protected in case you want to implement a more intelligent
   * approach to doing this (this is a simple method that should generally
   * be good enough, but probably isn't optimal).
   *
   * @param  inText The text to expand links in.
   * @return        The value of inText, with all article links expanded.
   */
  protected String expandLinks(final String inText) {

    log.trace("ArticleDAO.expandLinks() - Entry");

    // Create a buffer.  We'll be rebuilding inText from each token.  This
    // is likely more efficient than trying to do a replace when we find a
    // link to expand.
    StringBuffer sb = new StringBuffer(inText.length() + 1024);

    // Tokenize on all whitespace characters (just using space yields incorrect
    // results).
    StringTokenizer st = new StringTokenizer(inText, " \t\n\r\f\b\0", true);
    while (st.hasMoreTokens()) {
      String nextWord = st.nextToken();
      if (nextWord.length() > 1) {
        if (nextWord.charAt(0) == '~') {
          // First character was tilde, so we need to strip it.
          nextWord = nextWord.substring(1);
        } else {
          if (Character.isUpperCase(nextWord.charAt(0))) {
            nextWord = new StringBuffer(512).append(
              "<a href=\"javascript:void(0);\" ").append(
              "onClick=\"DWiki.getArticle('").append(nextWord).append(
              "');\">").append(nextWord).append("</a>").toString();
          }
        }
      }
      // Regardless of whether the word was changed or not, or if it was a
      // delimiter or not, append it.
      sb.append(nextWord);
    }

    if (log.isDebugEnabled()) {
      log.debug("ArticleDAO.expandLinks() - sb.toString() = " + sb.toString());
    }

    log.trace("ArticleDAO.expandLinks() - Exit");
    return sb.toString();

  } // End expandLinks().


  /**
   * Get all articles.  This WILL NOT include the text of the article.
   *
   * @return           An Article object, where the text of the article is the
   *                   list of all articles.
   * @throws Exception If anything goes wrong.
   */
  private Article getAllArticles() throws Exception {

    log.trace("ArticleDAO.getAllArticles() - Entry");

    try {

      // Get list of all articles and log results.
      List articles = databaseWorker.executeQuery(
        SQL_GET_ARTICLES, new HashMap());
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getAllArticles() - articles = " + articles);
      }

      // Now construct a single Article object, where the text is the results of
      // executing a Freemarker template, using the results from the above
      // query, to generate the markup for the UI to display.
      Map<String, Object> tokens = new HashMap<String, Object>();
      tokens.put("articles", articles);
      Article article = getStaticArticle("AllArticlesIndex", tokens);

      log.trace("ArticleDAO.getAllArticles() - Exit");
      return article;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getAllArticles().


  /**
   * This method returns an Article object that contains a "static" article,
   * that is, one of the special articles always present on DWiki, like the
   * help article and all article list article.
   *
   * @return An Article object containing the article data.
   */
  private Article getStaticArticle(final String inTitle, final Map inTokens)
    throws Exception {

    log.trace("ArticleDAO.getStaticArticle() - Entry");

    try {

      Article article = new Article();
      article.setTitle(inTitle);
      article.setCreator("SYSTEM");
      article.setCreated(new Timestamp(new java.util.Date().getTime()));
      article.setText(new Freemarker().run(inTitle + ".ftl", inTokens));

      log.trace("ArticleDAO.getStaticArticle() - Exit");
      return article;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getStaticArticle().


  /**
   * Update a given article.
   *
   * @param  inArticle      The Article object being updated.
   * @param  inWriteHistory When true, a history record is written for this
   *                        update, when false, it's not.
   * @param  inRequest      The request object being serviced.
   * @throws Exception      If anything goes wrong.
   */
  public void updateArticle(final Article inArticle,
    final boolean inWriteHistory, final HttpServletRequest inRequest)
    throws Exception {

    log.trace("articleDAO.updateArticle() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.updateArticle() - inArticle = " + inArticle);
      }

      // Get the original text of the article.
      String originalText =
        getArticle(inArticle.getTitle(), null, null, false).getText();

      // Construct Map of parameters for SQL query.
      HashMap<String, String> vals = new HashMap<String, String>();
      vals.put("text", inArticle.getText());
      vals.put("title", inArticle.getTitle());
      vals.put("lastEditedBy", inRequest.getUserPrincipal().getName());
      if (inArticle.getLockedBy() == null) {
        vals.put("lockedBy", "");
        vals.put("lockTime",
          new Timestamp(new java.util.Date().getTime()).toString());
      } else {
        vals.put("lockedBy", inArticle.getLockedBy());
        vals.put("lockTime", inArticle.getLockTime().toString());
      }

      // Execute the update.
      databaseWorker.executeUpdate(SQL_UPDATE_ARTICLE, vals);

      // Finally, write the history record.
      if (inWriteHistory == true) {
        ArticleHistoryItem historyItem = new ArticleHistoryItem();
        historyItem.setArticleTitle(inArticle.getTitle());
        historyItem.setPreviousText(originalText);
        historyItem.setNewText(inArticle.getText());
        historyItem.setEditedBy(inRequest.getUserPrincipal().getName());
        addArticleHistory(historyItem);
      }

      log.trace("ArticleDAO.updateArticle() - Exit");

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End updateArticle().


  /**
   * Adds a history record for a given article.
   *
   * @param  inArticleHistoryItem The ArticleHistoryItem object to add.
   * @throws Exception            If anything goes wrong.
   */
  private void addArticleHistory(final ArticleHistoryItem inArticleHistoryItem)
    throws Exception {

    log.trace("ArticleDAO.addArticleHistory() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.addArticleHistory() - inArticleHistoryItem = " +
          inArticleHistoryItem);
      }

      // Construct Map of parameters for SQL query.
      HashMap<String, String> vals = new HashMap<String, String>();
      vals.put("articleTitle", inArticleHistoryItem.getArticleTitle());
      vals.put("previousText", inArticleHistoryItem.getPreviousText());
      vals.put("newText", inArticleHistoryItem.getNewText());
      vals.put("editedBy", inArticleHistoryItem.getEditedBy());

      // Execute the update.
      databaseWorker.executeUpdate(SQL_ADD_ARTICLE_HISTORY, vals);

      log.trace("ArticleDAO.addArticleHistory() - Exit");

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addArticleHistory().


  /**
   * Get all the history records for a given article.
   *
   * @param  inArticleTitle The title of the article to retrieve history for.
   * @return                A string, which is the markup to insert of all the
   *                        history for the article.
   * @throws Exception      If anything goes wrong.
   */
  public String getArticleHistory(final String inArticleTitle)
    throws Exception {

    log.trace("ArticleDAO.getArticleHistory() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getArticleHistory() - inArticleTitle = " +
          inArticleTitle);
      }

      // Construct Map of parameters for SQL query.
      HashMap<String, String> vals = new HashMap<String, String>();
      vals.put("articleTitle", inArticleTitle);

      // Get list of all history for the article.
      List historyItems = databaseWorker.executeQuery(
        SQL_GET_ARTICLE_HISTORY, vals);
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getArticleHistory() - historyItems = " +
          historyItems);
      }

      // Construct Map of parameters for Freemarker template.
      Map<String, Object> tokens = new HashMap<String, Object>();
      tokens.put("historyItems", historyItems);
      String output = new Freemarker().run("ArticleHistory.ftl", tokens);
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getArticleHistory() - output = " +
          output);
      }

      log.trace("ArticleDAO.getArticleHistory() - Exit");
      return output;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getArticleHistory().


  /**
   * Adds a comment for a given article.
   *
   * @param  inArticleComment The ArticleCommentItem object to add.
   * @param  inRequest        The request object being serviced.
   * @throws Exception        If anything goes wrong.
   */
  public void addComment(final ArticleComment inArticleComment,
    final HttpServletRequest inRequest) throws Exception {

    log.trace("ArticleDAO.addArticleComment() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.addArticleComment() - inArticleComment = " +
          inArticleComment);
      }

      // Construct Map of parameters for SQL query.
      HashMap<String, String> vals = new HashMap<String, String>();
      vals.put("articleTitle", inArticleComment.getArticleTitle());
      vals.put("text", inArticleComment.getText());
      vals.put("poster", inRequest.getUserPrincipal().getName());

      // Execute the update.
      databaseWorker.executeUpdate(SQL_ADD_ARTICLE_COMMENT, vals);

      log.trace("ArticleDAO.addArticleComment() - Exit");

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addArticleComment().


  /**
   * Get all the comments for a given article.
   *
   * @param  inArticleTitle The title of the article to retrieve comments for.
   * @param  inRequest      The request object being serviced.
   * @return                A string, which is the markup to insert of all the
   *                        comments for the article, plus the add comment
   *                        form.
   * @throws Exception      If anything goes wrong.
   */
  public String getArticleComments(final String inArticleTitle,
    final HttpServletRequest inRequest) throws Exception {

    log.trace("ArticleDAO.getArticleComments() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getArticleComments() - inArticleTitle = " +
          inArticleTitle);
      }

      // Construct Map of parameters for SQL query.
      HashMap<String, String> vals = new HashMap<String, String>();
      vals.put("articleTitle", inArticleTitle);

      // Get list of all comments for the article.
      List commentItems = databaseWorker.executeQuery(
        SQL_GET_ARTICLE_COMMENTS, vals);
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getArticleComments() - commentItems = " +
          commentItems);
      }

      // Construct Map of parameters for Freemarker template.
      Map<String, Object> tokens = new HashMap<String, Object>();
      tokens.put("commentItems", commentItems);
      tokens.put("dwikiUser", inRequest.isUserInRole("dwiki_user"));
      String output = new Freemarker().run("ArticleComments.ftl", tokens);
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.getArticleComments() - output = " +
          output);
      }

      log.trace("ArticleDAO.getArticleComments() - Exit");
      return output;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getArticleComments().


  /**
   * Finds all articles with the given text in the title, text, or both.
   * This WILL NOT include the text of the article.  This simply look for the
   * specified text anywhere in the specified place, nothing more complex
   * than that.
   *
   * @param  inSearchText
   * @param  inSearchWhat
   * @return                  An Article object, where the text of the article
   *                          is the search results.
   * @throws Exception        If anything goes wrong.
   */
  private Article search(final String inSearchText, final String inSearchWhat)
    throws Exception {

    log.trace("ArticleDAO.search() - Entry");

    try {

      // Log incoming parameters.
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.search() - inSearchText = " + inSearchText);
        log.debug("ArticleDAO.search() - inSearchWhat = " + inSearchWhat);
      }

      // Fill a Map with the search text for SQL token replacement later.
      HashMap<String, Object> vals = new HashMap<String, Object>();
      vals.put("searchText", inSearchText);

      // Determine what SQL query to use.
      String sql = null;
      if (inSearchWhat.equals("title")) {
        sql = SQL_FIND_ARTICLE_BY_TITLE;
      } else if (inSearchWhat.equals("text")) {
        sql = SQL_FIND_ARTICLE_BY_TEXT;
      } else if (inSearchWhat.equals("both")) {
        sql = SQL_FIND_ARTICLE_BY_BOTH;
      }

      // Perform the query, getting list of articles.
      List articles = databaseWorker.executeQuery(sql, vals);
      if (log.isDebugEnabled()) {
        log.debug("ArticleDAO.search() - articles = " + articles);
      }

      // Now construct a single Article object, where the text is the results of
      // executing a Freemarker template, using the results from the above
      // query, to generate the markup for the UI to display.
      Map<String, Object> tokens = new HashMap<String, Object>();
      tokens.put("articles", articles);
      Article article = getStaticArticle("SearchResults", tokens);

      log.trace("ArticleDAO.search() - Exit");
      return article;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End search().


  /**
   * This method is called to get a lock on an article for editing.
   *
   * @param inArticleTitle The title of the article to lock.
   * @param  inRequest     The request object being serviced.
   * @return               A string, which gives the UI information about
   *                       what to do next.  If the string is in the form
   *                       ok=xxx=yyy, then the article is now locked for the
   *                       user, and the number of seconds before expiration is
   *                       xxx, and the text with no link expansions done is
   *                       yyy.  If the string is lockedBy=xxx=yyy, then the
   *                       user cannot lock the article because someone else is
   *                       editing it, and xxx is the name of the user who has
   *                       the lock and yyy is the time remaining on that lock.
   * @throws Exception     If anything goes wrong.
   */
  public String lockArticleForEditing(final String inArticleTitle,
    final HttpServletRequest inRequest) throws Exception {

    log.trace("ArticleDAO.lockArticleForEditing() - Entry");

    try {

      Article article = getArticle(inArticleTitle, null, null, false);
      String retVal = "";

      if (article.getLockedBy() == null ||
        article.getLockedBy().equals(inRequest.getUserPrincipal().getName())) {

        // Article is not currently being editd, or is locked by the current
        // user, so lock it and start editing.
        log.debug("Article NOT locked, acquiring lock on behalf of user");
        article.setLockedBy(inRequest.getUserPrincipal().getName());
        article.setLockTime(new Timestamp(new java.util.Date().getTime()));
        updateArticle(article, false, inRequest);
        retVal = "ok=" + Config.getEditLockTime() + "=" + article.getText();

      } else {

        // Article is locked by someone else.  Now, we need to see if their lock
        // has expired.  If so, lock it for the current user and let them start
        // editing, otherwise tell them no.
        log.debug("Article WAS locked, checking for lock expiration");
        int editLockTime = Integer.parseInt(Config.getEditLockTime());
        long numMillis = 1000 * editLockTime;
        long lockDiff = new Timestamp(new java.util.Date().getTime()).getTime() -
          article.getLockTime().getTime();
        if (lockDiff > numMillis) {
          log.debug("Lock has expired, acquiring lock on behalf of new user");
          // Lock has expired, so lock it for the new user.
          article.setLockedBy(inRequest.getUserPrincipal().getName());
          article.setLockTime(new Timestamp(new java.util.Date().getTime()));
          updateArticle(article, false, inRequest);
          retVal = "ok=" + Config.getEditLockTime();
        } else {
          log.debug("Lock has NOT expired, informing user they cannot edit");
          retVal = "lockedBy=" + article.getLockedBy() + "=" +
            (editLockTime - (lockDiff / 1000));
        }

      }

      // Return result string.
      log.trace("ArticleDAO.lockArticleForEditing() - Exit");
      return retVal;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End lockArticleForEditing().


} // End class.
