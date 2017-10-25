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


Ext.namespace("FinanceMaster.Portlets.PortfolioDistribution");


/**
 * Store the chart is bound to.
 */
FinanceMaster.Portlets.PortfolioDistribution.accountsStore =
  new Ext.data.Store({});


/**
 * Return the configuration object for this UI component.
 */
FinanceMaster.Portlets.PortfolioDistribution.getConfig = function() { return {

  title : "Portfolio Distribution", id : "PortfolioDistribution", height : 200,
  layout : "fit"

}; };


/**
 * Method called to refresh the chart in this portlet.
 *
 * @param inRec The PortfolioRecord for the portfolio.
 */
FinanceMaster.Portlets.PortfolioDistribution.refreshChart = function(inRec) {

  // Clear any old data.
  FinanceMaster.Portlets.PortfolioDistribution.accountsStore =
    new Ext.data.Store({});

  // Get all of the account records for this account.
  var accounts = FinanceMaster.Data.retrieveAccounts(inRec.get("name"));

  // Generate a MixedCollection keyed by account types and determine the
  // balance of each type.
  var mc = new Ext.util.MixedCollection();
  for (var i = 0; i < accounts.length; i++) {
    var acctType = accounts[i].get("type");
    var balance = 0;
    if (mc.containsKey(acctType)) {
      balance = mc.get(acctType);
    }
    balance = balance + accounts[i].get("balance");
    mc.add(acctType, balance);
  }

  // Now go through the elements in the MixedCollection and for each add
  // an AccountRecord to the store the chart is bound to.
  mc.eachKey(function(inKey, inItem) {
    FinanceMaster.Portlets.PortfolioDistribution.accountsStore.add(
      new FinanceMaster.Data.AccountRecord({ type : inKey, balance : inItem })
    );
  });

  // Create chart, removing any old one first.
  var p = Ext.getCmp("PortfolioDistribution");
  var c = Ext.getCmp("pdChart");
  if (c) {
    p.remove(c, true);
  }
  p.add(new Ext.chart.PieChart(
    { dataField : "balance", id : "pdChart", categoryField : "type",
      store : FinanceMaster.Portlets.PortfolioDistribution.accountsStore }
  ));
  p.doLayout();

}; // End FinanceMaster.Portlets.PortfolioDistribution.refreshChart().


/**
 * Subscribe to InitComplete message to do one-time initialization tasks.
 */
FinanceMaster.msgBus.subscribe("InitComplete", function() {

  Ext.getCmp("PortfolioDistribution").collapse();

});


/**
 * Subscribe to PortfolioOpened message so we can show accounts for the
 * newly opened portfolio.
 *
 * @param arguments[0] The PortfolioRecord of the opened portfolio.
 */
FinanceMaster.msgBus.subscribe("PortfolioOpened", function() {

  var p = Ext.getCmp("PortfolioDistribution");
  p.expand();

  // Get the PortfolioRecord passed in.
  var rec = arguments[0];

  // Refresh the chart.
  FinanceMaster.Portlets.PortfolioDistribution.refreshChart(rec);

});


/**
 * Subscribe to ActivityAdded message so we can refresh the chart.
 */
FinanceMaster.msgBus.subscribe("ActivityAdded", function() {

  FinanceMaster.Portlets.PortfolioDistribution.refreshChart(
    FinanceMaster.currentPortfolio);

});


/**
 * Subscribe to ActivityDeleted message so we can refresh the chart.
 */
FinanceMaster.msgBus.subscribe("ActivityDeleted", function() {

  FinanceMaster.Portlets.PortfolioDistribution.refreshChart(
    FinanceMaster.currentPortfolio);

});
