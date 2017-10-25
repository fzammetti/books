package com.apress.ajaxprojects.theorganizer.daos;


import com.apress.ajaxprojects.theorganizer.Globals;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


/**
 * Data Access Object (DAO) for working with Accounts.
 */
public class AccountDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The DriverManagerDataSource this instance of the DAO will use.
   */
  private DriverManagerDataSource dataSource;


  /**
   * Constructor.
   */
  public AccountDAO() {

    dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Globals.dbDriver);
    dataSource.setUrl(Globals.dbURL);
    dataSource.setUsername(Globals.dbUsername);
    dataSource.setPassword(Globals.dbPassword);

  } // End constructor.


  /**
   * Method to create a new account.
   *
   * @param inAccount The AccountObject instance to create.
   */
  public void accountCreate(final AccountObject inAccount) {

    log.debug("AccountDAO.accountCreate()...");

    log.info("AccountObject to create : " + inAccount);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "INSERT INTO accounts (" +
      "username, password" +
      ") VALUES (" +
      "'" + inAccount.getUsername() + "', " +
      "'" + inAccount.getPassword() + "'" +
      ")");

    log.debug("AccountDAO.accountCreate() Done");

  } // End accountCreate().


  /**
   * Method to retrieve an account.
   *
   * @param  inUsername The username of the account to retrieve.
   * @return            An AccountObject instance.
   */
  public AccountObject accountRetrieve(final String inUsername) {

    log.debug("AccountDAO.accountRetrieve()...");

    log.debug("username to retrieve : " + inUsername);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    List rows = jt.queryForList(
      "SELECT * FROM accounts WHERE username='" + inUsername + "'"
    );
    AccountObject account = null;
    if (rows != null && !rows.isEmpty()) {
      account = new AccountObject();
      Map m = (Map)rows.get(0);
      account.setUsername((String)m.get("USERNAME"));
      account.setPassword((String)m.get("PASSWORD"));
    }
    log.info("Retrieved AccountObject : " + account);

    log.debug("AccountDAO.accountRetrieve() Done");
    return account;

  } // End accountRetrieve().


  /**
   * Method to update an existing account.
   *
   * @param inAccount The AccountObject instance to update.
   */
  public void accountUpdate(final AccountObject inAccount) {

    log.debug("AccountDAO.accountUpdate()...");

    log.info("AccountObject to update : " + inAccount);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "UPDATE accounts SET " +
      "password='"       + inAccount.getPassword() + "' " +
      "WHERE username='" + inAccount.getUsername() + "'"
    );
    log.debug("AccountDAO.accountUpdate() Done");

  } // End accountUpdate().


  /**
   * Method to delete an account.
   *
   * @param inAccount The AccountObject instance to delete.
   */
  public void accountDelete(final AccountObject inAccount) {

    log.debug("AccountDAO.accountDelete()...");

    log.info("AccountObject to delete : " + inAccount);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "DELETE FROM accounts " +
      "WHERE username='"      + inAccount.getUsername() + "'"
    );
    log.debug("AccountDAO.accountDelete() Done");

  } // End accountDelete().


} // End class.
