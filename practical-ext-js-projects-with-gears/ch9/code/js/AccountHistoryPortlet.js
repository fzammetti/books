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


Ext.namespace("FinanceMaster.Portlets.AccountHistory");


/**
 * Store the chart is bound to.
 */
FinanceMaster.Portlets.AccountHistory.accountHistoryStore =
  new Ext.data.Store({});


/**
 * Return the configuration object for this UI component.
 */
FinanceMaster.Portlets.AccountHistory.getConfig = function() { return {

  title : "Account History", id : "AccountHistory", height : 200,
  layout : "fit"

}; };


/**
 * Method called to refresh the chart in this portlet.
 *
 * @param inRec The AccountRecord for the account.
 */
FinanceMaster.Portlets.AccountHistory.refreshChart = function(inRec) {

  // Clear any old data.
  FinanceMaster.Portlets.AccountHistory.accountHistoryStore =
    new Ext.data.Store({});

  // Get all of the activity records for this account.
  var activity = FinanceMaster.Data.retrieveActivity(
    inRec.get("portfolio"), inRec.get("name") );

  // Populate Store the chart is bound to, based on account type.
  var acctType = inRec.get("type");
  if (acctType == "Checking" || acctType == "Savings") {
    // Calculate running total for Checking and Savings account.
    var balance = 0;
    for (var i = 0; i < activity.length; i++) {
      balance = balance + activity[i].get("amount");
      FinanceMaster.Portlets.AccountHistory.accountHistoryStore.add(
        new FinanceMaster.Data.ActivityRecord({
          pretty_date : activity[i].get("pretty_date"), new_balance : balance
        })
      );
    }
  } else {
    // Not a Checking or Savings account, just use balance from each record.
    for (var j = 0; j < activity.length; j++) {
      FinanceMaster.Portlets.AccountHistory.accountHistoryStore.add(
        new FinanceMaster.Data.ActivityRecord({
          pretty_date : activity[j].get("pretty_date"),
          new_balance : activity[j].get("new_balance")
        })
      );
    }
  }

  // Create chart, removing any old one first.
  var p = Ext.getCmp("AccountHistory");
  var c = Ext.getCmp("ahChart");
  if (c) {
    p.remove(c, true);
  }
  p.add(new Ext.chart.LineChart(
    { xField : "pretty_date", yField : "new_balance", id : "ahChart",
      store : FinanceMaster.Portlets.AccountHistory.accountHistoryStore }
  ));
  p.doLayout();

}; // End FinanceMaster.Portlets.AccountHistory.refreshChart().


/**
 * Subscribe to InitComplete message to do one-time initialization tasks.
 */
FinanceMaster.msgBus.subscribe("InitComplete", function() {

  Ext.getCmp("AccountHistory").collapse();

});


/**
 * Subscribe to PortfolioOpened message so we can show accounts for the
 * newly opened portfolio.
 */
FinanceMaster.msgBus.subscribe("PortfolioOpened", function() {

  Ext.getCmp("AccountHistory").collapse();

});


/**
 * Subscribe to AccountOpened message so we can show history for the
 * newly opened account.
 *
 * @param arguments[0] The AccountRecord of the opened portfolio.
 */
FinanceMaster.msgBus.subscribe("AccountOpened", function() {

  // Expand this portlet.
  var p = Ext.getCmp("AccountHistory");
  p.expand();

  // Get the AccountRecord passed in.
  var rec = arguments[0];

  // Refresh the chart.
  FinanceMaster.Portlets.AccountHistory.refreshChart(rec);

});


/**
 * Subscribe to AccountDeleted message so we can reset this portlet.
 */
FinanceMaster.msgBus.subscribe("AccountDeleted", function() {

  Ext.getCmp("AccountHistory").collapse();

});


/**
 * Subscribe to ActivityAdded message so we can refresh the chart.
 */
FinanceMaster.msgBus.subscribe("ActivityAdded", function() {

  FinanceMaster.Portlets.AccountHistory.refreshChart(
    FinanceMaster.currentAccount);

});


/**
 * Subscribe to ActivityDeleted message so we can refresh the chart.
 */
FinanceMaster.msgBus.subscribe("ActivityDeleted", function() {

  FinanceMaster.Portlets.AccountHistory.refreshChart(
    FinanceMaster.currentAccount);

});
