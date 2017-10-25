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


Ext.namespace("FinanceMaster.OpenPortfolioWindow");


/**
 * Return the configuration object for this UI component.
 *
 * @param  inClosable Whether the Window is closable or not.
 * @return            A config object describing the Window.
 */
FinanceMaster.OpenPortfolioWindow.getConfig = function(inClosable) { return {

  closable : inClosable, modal : true, width : 350, height : 210,
  minimizable : false, resizable : false, draggable : false,
  id : "winOpenPortfolio", shadowOffset : 8,
  title : "Welcome to Finance Master!",
  items : [
    { frame : true,
      html : "To begin, " +
        "Select the portfolio you want to open, enter the associated " +
        "password, and click Open.<br><br>To create a new portfolio, " +
        "enter it's name, a password to secure it, and click New Portfolio"
    },
    /* The entry form. */
    { xtype : "form", id : "frmOpenPortfolio", frame : true,
      monitorValid : true,
      items : [
        { xtype : "combo", fieldLabel : "Portfolio",
          name : "name", allowBlank : false, editable : true,
          triggerAction : "all", mode : "local",
          store : FinanceMaster.Data.portfoliosStore,
          valueField : "name", displayField : "name"
        },
        { xtype : "textfield", fieldLabel : "Password", name : "password",
          allowBlank : false }
      ],
      buttons : [
        /* Open button. */
        { text : "Open", formBind : true, icon : "img/Open.gif",
          cls : "x-btn-text-icon",
          handler : function() {
            FinanceMaster.OpenPortfolioWindow.openClick();
          }
        },
        /* New Portfolio button. */
        { text : "New Portfolio", formBind : true, icon : "img/New.gif",
          cls : "x-btn-text-icon",
          handler : function() {
            FinanceMaster.OpenPortfolioWindow.newClick();
          }
        }
      ]
    }
  ]

}; }; // End FinanceMaster.OpenPortfolioWindow.getConfig().


/**
 * Handles click event for Open button.
 */
FinanceMaster.OpenPortfolioWindow.openClick = function() {

  var vals = Ext.getCmp("frmOpenPortfolio").getForm().getValues();
  if (FinanceMaster.OpenPortfolioWindow.openPortfolio(
    vals.name, vals.password)) {
    Ext.getCmp("winOpenPortfolio").close();
  }

}; // End FinanceMaster.OpenPortfolioWindow.openClick().


/**
 * Handles click event for New Portfolio button.
 */
FinanceMaster.OpenPortfolioWindow.newClick = function() {

  // Get the name of the portfolio.
  var vals = Ext.getCmp("frmOpenPortfolio").getForm().getValues();
  // Make sure it doesn't already exist (user might have typed a name rather
  // than selected one, and it might already be in the list).
  if (FinanceMaster.Data.portfoliosStore.getById(vals.name)) {
    if (FinanceMaster.OpenPortfolioWindow.openPortfolio(
      vals.name, vals.password)) {
      Ext.getCmp("winOpenPortfolio").close();
    }
  } else {
    // Create the portfolio by creating a Record and adding it to the Store.
    var rec = new FinanceMaster.Data.PortfolioRecord({
      name : vals.name, password : vals.password
    }, vals.name);
    FinanceMaster.Data.portfoliosStore.add(rec);
    // Now open it.  Note: checking the return value SHOULD be superfluous,
    // but we'll do it anyway.
    if (FinanceMaster.OpenPortfolioWindow.openPortfolio(
      vals.name, vals.password)) {
      Ext.getCmp("winOpenPortfolio").close();
    }
  }

}; // End FinanceMaster.OpenPortfolioWindow.newClick().


/**
 * Opens a named portfolio, if it exists, and if the password provided is
 * correct.
 *
 * @param  inName     The name of the portfolio to open.
 * @param  inPassword The password for the named portfolio.
 * @return            True if the portfolio was opened, false if not.
 */
FinanceMaster.OpenPortfolioWindow.openPortfolio = function(inName, inPassword) {

  // Look up the portfolio.
  var rec = FinanceMaster.Data.portfoliosStore.getById(inName);

  if (rec) {
    // Portfolio exists.
    if (inPassword == rec.get("password")) {
      // Password was correct, go ahead and open the portfolio.
      FinanceMaster.currentPortfolio = rec;
      FinanceMaster.msgBus.publish("PortfolioOpened", rec);
      return true;
    } else {
      // Password was incorrect.
      Ext.MessageBox.alert("Portfolio not opened",
        "The password you entered was incorrect.  Please try again.");
      return false;
    }
  } else {
    // Portfolio does not exist.
    Ext.MessageBox.alert("Portfolio not opened",
      "The portfolio '" + inName + "' was not found.<br><br>" +
      "If you are trying to open an existing portfolio, please " +
      "select it from the list.  If you are trying to create a new " +
      "portfolio, please click the New Portfolio button.");
    return false;
  }

}; // FinanceMaster.OpenPortfolioWindow.openPortfolio().
