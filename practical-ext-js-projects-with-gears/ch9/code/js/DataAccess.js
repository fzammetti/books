/*
    Finance Master - From the book "Practical Ext JS Projects With Gears"
    Copyright (C) 2008 Frank W. Zammetti
    fzammetti@omnytex.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses.
*/


/**
 * The name of the Gears database the application will be using.
 */
FinanceMaster.Data.databaseName = "FinanceMaster";


/**
 * SQL statements for the operations dealing with portfolios.
 */
FinanceMaster.Data.sqlCreatePortfoliosTable =
  "CREATE TABLE IF NOT EXISTS portfolios (name TEXT, password TEXT)";
FinanceMaster.Data.sqlCreatePortfolio =
  "INSERT INTO portfolios (name, password) VALUES (?, ?)";
FinanceMaster.Data.sqlRetrievePortfolios = "SELECT * FROM portfolios " +
  "ORDER BY name";


/**
 * SQL statements for the operations dealing with accounts.
 */
FinanceMaster.Data.sqlCreateAccountsTable =
  "CREATE TABLE IF NOT EXISTS accounts (portfolio TEXT, name TEXT, type TEXT)";
FinanceMaster.Data.sqlCreateAccount =
  "INSERT INTO accounts (portfolio, name, type) VALUES (?, ?, ?)";
FinanceMaster.Data.sqlRetrieveAccounts =
  "SELECT * FROM accounts WHERE portfolio=? ORDER BY type, name";
FinanceMaster.Data.sqlDeleteAccount = "DELETE FROM accounts WHERE " +
  "portfolio=? AND name=?";


/**
 * SQL statements for the operations dealing with account activity.
 */
FinanceMaster.Data.sqlCreateActivityTable =
  "CREATE TABLE IF NOT EXISTS activity (id INT, portfolio TEXT, " +
  "account TEXT, date INT, amount FLOAT, new_balance INT, description TEXT)";
FinanceMaster.Data.sqlCreateActivity =
  "INSERT INTO activity (id, portfolio, account, date, amount, " +
  "new_balance, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
FinanceMaster.Data.sqlRetrieveActivity =
  "SELECT * FROM activity where portfolio=? AND account=? ORDER BY date ASC";
FinanceMaster.Data.sqlDeleteActivity = "DELETE FROM activity " +
  "WHERE id=?";
FinanceMaster.Data.sqlDeleteActivityInAccount = "DELETE FROM activity " +
  "WHERE portfolio=? AND account=?";


/**
 * A couple of miscellaneous SQL statements.
 */
FinanceMaster.Data.sqlGetSavingsCheckingBalance = "SELECT SUM(amount) " +
  "AS balance FROM activity WHERE portfolio=? AND account=?";
FinanceMaster.Data.sqlGetOtherBalance = "SELECT new_balance AS balance " +
  "FROM activity WHERE portfolio=? AND account=? ORDER BY date DESC LIMIT 1";


/**
 * Initialize the data access layer.
 *
 * @return "ok" if initialization was successful, "no_gears" if Gears isn't
 *         available, or a freeform error string in any other case.
 *
 */
FinanceMaster.Data.init = function() {

  var initReturn = "ok";
  try {
    // Test for Gears.
    if (!window.google || !google.gears) {
      initReturn = "no_gears";
    } else {
      // Create tables, if necessary.
      var db = google.gears.factory.create("beta.database");
      db.open(FinanceMaster.Data.databaseName);
      db.execute(FinanceMaster.Data.sqlCreatePortfoliosTable);
      db.execute(FinanceMaster.Data.sqlCreateAccountsTable);
      db.execute(FinanceMaster.Data.sqlCreateActivityTable);
      db.close();
    }
  } catch (e) {
    initReturn = e;
  }

  return initReturn;

}; // End FinanceMaster.Data.init().


// ******************************** PORTFOLIO ********************************


/**
 * Called to create a portfolio record in the portfolios table in the
 * database.
 *
 * @param inRecord A PortfolioRecord instance.
 */
FinanceMaster.Data.createPortfolio = function(inRecord) {

  // Write it out
  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  db.execute(FinanceMaster.Data.sqlCreatePortfolio, [
    inRecord.get("name"), inRecord.get("password")
  ] );
  db.close();

}; // End FinanceMaster.Data.createPortfolio().


/**
 * Retrieves one or more portfolios.
 *
 * @return An array of PortfolioRecord objects.  The array can be empty, but
 *         null will never be returned.
 */
FinanceMaster.Data.retrievePortfolios = function() {

  // Open database and execute query.
  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  var rs = db.execute(FinanceMaster.Data.sqlRetrievePortfolios);

  // Iterate over results, adding to results array.
  var results = [ ];
  while (rs.isValidRow()) {
    results.push(new FinanceMaster.Data.PortfolioRecord({
      name : rs.fieldByName("name"), password : rs.fieldByName("password")
    }, rs.fieldByName("name")));
    rs.next();
  }
  rs.close();
  db.close();

  // Return matches, or an empty array if none.
  return results;

}; // End FinanceMaster.Data.retrievePortfolios().


// ********************************* ACCOUNT *********************************


/**
 * Called to create a account record in the accounts table in the
 * database.
 *
 * @param inRecord An AccountRecord instance.
 */
FinanceMaster.Data.createAccount = function(inRecord) {

  // Write it out
  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  db.execute(FinanceMaster.Data.sqlCreateAccount, [
    inRecord.get("portfolio"), inRecord.get("name"), inRecord.get("type")
  ] );
  db.close();

}; // End FinanceMaster.Data.createAccount().


/**
 * Retrieves one or more accounts.
 *
 * @param  inPortfolio The name of the portfolio to retrieve account for.
 * @return             An array of AccountRecord objects.  The array can be
 *                     empty, but null will never be returned.
 */
FinanceMaster.Data.retrieveAccounts = function(inPortfolio) {

  // Open database and execute query.
  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  var rs = db.execute(FinanceMaster.Data.sqlRetrieveAccounts, [ inPortfolio ] );

  // Iterate over results, adding to results array.
  var results = [ ];
  while (rs.isValidRow()) {
    results.push(new FinanceMaster.Data.AccountRecord({
      portfolio : rs.fieldByName("portfolio"), name : rs.fieldByName("name"),
      type : rs.fieldByName("type")
    }, rs.fieldByName("name")));
    rs.next();
  }
  rs.close();
  db.close();

  // Now calculate the current balance of the account and add it to the records.
  for (var i = 0; i < results.length; i++) {
    results[i].set("balance", FinanceMaster.Data.getAccountBalance(
      inPortfolio, results[i].get("name"), results[i].get("type") ));
  }

  // Return matches, or an empty array if none.
  return results;

}; // End FinanceMaster.Data.retrieveAccounts().


/**
 * Deletes a account.
 *
 * @param inPortfolio The name of the portfolio the account belongs to.
 * @param inAccount   The name of the account to delete.
 */
FinanceMaster.Data.deleteAccount = function(inPortfolio, inAccount) {

  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  // Need to delete both activity records and the account record.
  db.execute(FinanceMaster.Data.sqlDeleteActivityInAccount, [
    inPortfolio, inAccount
  ] );
  db.execute(FinanceMaster.Data.sqlDeleteAccount, [ inPortfolio, inAccount ] );
  db.close();

}; // End FinanceMaster.Data.deleteAccount().


// ********************************* ACTIVITY ********************************


/**
 * Called to create an account activoty record in the activity table in the
 * database.
 *
 * @param inRecord An ActivityRecord instance.
 */
FinanceMaster.Data.createActivity = function(inRecord) {

  // Write it out
  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  db.execute(FinanceMaster.Data.sqlCreateActivity, [
    inRecord.get("id"), inRecord.get("portfolio"), inRecord.get("account"),
    inRecord.get("date").getTime(), inRecord.get("amount"),
    inRecord.get("new_balance"), inRecord.get("description")
  ] );
  db.close();

}; // End FinanceMaster.Data.createActivity().


/**
 * Retrieves one or more activity records for a given account.
 *
 * @param  inPortfolio The name of the portfolio the account is in.
 * @param  inAccount   The name of the account to retrieve activity for.
 * @return             An array of ActivityRecord objects.  The array can be
 *                     empty, but null will never be returned.
 */
FinanceMaster.Data.retrieveActivity = function(inPortfolio, inAccount) {

  // Open database and execute query.
  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  var rs = db.execute(FinanceMaster.Data.sqlRetrieveActivity, [ inPortfolio,
    inAccount ] );

  // Iterate over results, adding to results array.
  var results = [ ];
  while (rs.isValidRow()) {
    var d = new Date();
    d.setTime(rs.fieldByName("date"));
    results.push(new FinanceMaster.Data.ActivityRecord({
      id : rs.fieldByName("id"),
      portfolio : rs.fieldByName("portfolio"),
      account : rs.fieldByName("account"),
      date : d, pretty_date : d.format("m/d/Y"),
      amount : rs.fieldByName("amount"),
      new_balance : rs.fieldByName("new_balance"),
      description : rs.fieldByName("description")
    }, rs.fieldByName("id")));
    rs.next();
  }
  rs.close();
  db.close();

  // Return matches, or an empty array if none.
  return results;

}; // End FinanceMaster.Data.retrieveActivity().


/**
 * Deletes a activity for a given account.
 *
 * @param inID The ID of the activity record to delete.
 */
FinanceMaster.Data.deleteActivity = function(inID) {

  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  db.execute(FinanceMaster.Data.sqlDeleteActivity, [ inID ] );
  db.close();

}; // End FinanceMaster.Data.deleteActivity().


// ******************************* MISCLLANEOUS ******************************


/**
 * Calculates the balance for a specified account.
 *
 * @param  inPortfolio The name of the portfolio the account is in.
 * @param  inAccount   The name of the account to calculate a balance for.
 * @param  inType      The type of the account.
 * @return             A numeric value that is the current balance of the
 *                     specified account in the specified portfolio.
 */
FinanceMaster.Data.getAccountBalance = function(inPortfolio, inAccount,
  inType) {

  // Open database and execute query appropriate for account type.
  var sql = FinanceMaster.Data.sqlGetOtherBalance;
  if (inType == "Checking" || inType == "Savings") {
    sql = FinanceMaster.Data.sqlGetSavingsCheckingBalance;
  }
  var db = google.gears.factory.create("beta.database");
  db.open(FinanceMaster.Data.databaseName);
  var rs = db.execute(sql, [ inPortfolio, inAccount ] );

  // Get the balance to return.
  var balance = 0;
  if (rs.isValidRow()) {
    balance = rs.fieldByName("balance");
  }
  rs.close();
  db.close();

  // Return balance.
  return balance;

}; // End FinanceMaster.Data.getAccountBalance().
