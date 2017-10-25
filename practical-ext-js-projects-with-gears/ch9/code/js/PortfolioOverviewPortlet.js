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


Ext.namespace("FinanceMaster.Portlets.PortfolioOverview");


/**
 * A Store for the options in the Account Type ComboBox.
 */
FinanceMaster.Portlets.PortfolioOverview.accountTypesStore =
  new Ext.data.Store({});
FinanceMaster.Portlets.PortfolioOverview.accountTypeVals =
  [ "Checking", "Investment", "Loan", "Retirement", "Savings" ];
for (var i = 0;
  i < FinanceMaster.Portlets.PortfolioOverview.accountTypeVals.length; i++) {
  FinanceMaster.Portlets.PortfolioOverview.accountTypesStore.add(
    new Ext.data.Record(
      { type : FinanceMaster.Portlets.PortfolioOverview.accountTypeVals[i] }
    )
  );
}


/**
 * Return the configuration object for this UI component.
 */
FinanceMaster.Portlets.PortfolioOverview.getConfig = function() { return {

  title : "Portfolio Overview", id : "PortfolioOverview", height : 200,
  layout : "fit",
  items : [
    { xtype : "grid", store : FinanceMaster.Data.accountsStore,
      sm : new Ext.grid.RowSelectionModel( { singleSelect : true } ),
      id : "FinanceMaster.Portlets.PortfolioOverview.grdAccounts",
      columns : [
        { header : "Name", dataIndex : "name" },
        { header : "Type", dataIndex : "type" },
        { header : "Current Balance", align : "right",
          id : "FinanceMaster.Portlets.PortfolioOverview.grdAccounts_balance",
          dataIndex : "balance", renderer : Ext.util.Format.usMoney }
      ],
      view : new Ext.grid.GroupingView({
        forceFit : true,
        groupTextTpl : '{text} ({[values.rs.length]} ' +
          '{[values.rs.length > 1 ? "Items" : "Item"]})'
      }),
      listeners : {
        rowclick : function(inGrid, inRowIndex, inEventObject) {
          // Enable delete button.
          Ext.getCmp(
            "FinanceMaster.Portlets.PortfolioOverview.btnDelete").enable();
          // Open the selected account.
          FinanceMaster.currentAccount =
            inGrid.getSelectionModel().getSelected();
          FinanceMaster.msgBus.publish("AccountOpened",
            FinanceMaster.currentAccount);
        }
      }
    }
  ],
  tbar : [
    { text : "Add Account", icon : "img/Add.gif",
      cls : "x-btn-text-icon",
      handler : function() {
        new Ext.Window({
          closable : true, modal : true, width : 350, height : 170,
          minimizable : false, resizable : false, draggable : false,
          id : "FinanceMaster.Portlets.PortfolioOverview.winAddAccount",
          shadowOffset : 8, title : "Add an account",
          items : [
            { frame : true,
              html : "Enter a name for the new account, select its type, " +
                "and click Ok.  Click Cancel if you decide not to " +
                "add an account at this time."
            },
            /* The entry form. */
            { xtype : "form", frame : true, monitorValid : true,
              id : "FinanceMaster.Portlets.PortfolioOverview.frmAddAccount",
              items : [
                { xtype : "textfield", fieldLabel : "Name", name : "name",
                  allowBlank : false },
                { xtype : "combo", fieldLabel : "Type",
                  name : "type", allowBlank : false, editable : false,
                  triggerAction : "all", mode : "local",
                  store :
                    FinanceMaster.Portlets.PortfolioOverview.accountTypesStore,
                  valueField : "type", displayField : "type"
                }
              ],
              buttons : [
                /* Ok button. */
                { text : "Ok", formBind : true, icon : "img/Ok.gif",
                  cls : "x-btn-text-icon",
                  handler : function() {
                    FinanceMaster.Portlets.PortfolioOverview.addAccount();
                  }
                },
                /* Cancel button. */
                { text : "Cancel", icon : "img/Cancel.gif",
                  cls : "x-btn-text-icon",
                  handler : function() {
                    Ext.getCmp(
                      "FinanceMaster.Portlets.PortfolioOverview.winAddAccount"
                    ).close();
                  }
                }
              ]
            }
          ]
        }).show('divSource');
      }
    },
    "-",
    { text : "Delete Account", icon : "img/Delete.gif", disabled : true,
      cls : "x-btn-text-icon",
      id : "FinanceMaster.Portlets.PortfolioOverview.btnDelete",
      handler : function() {
        FinanceMaster.Portlets.PortfolioOverview.deleteAccount();
      }
    }
  ]

}; };


/**
 * Handles click event for Ok button.
 */
FinanceMaster.Portlets.PortfolioOverview.addAccount = function() {

  // Get the entered values.
  var vals = Ext.getCmp(
    "FinanceMaster.Portlets.PortfolioOverview.frmAddAccount"
  ).getForm().getValues();
  // Check to be sure the account doesn't already exist in this portfolio.
  var rec = FinanceMaster.Data.accountsStore.getById(vals.name);
  if (rec) {
    Ext.MessageBox.alert("Could not create account",
      "An account with the name '" + vals.name +
      "' already exists in this portfolio.  Please choose another name.");
    return;
  } else {
    // Create a new AccountRecord and add it to the accountsStore.
    rec = new FinanceMaster.Data.AccountRecord({
      portfolio : FinanceMaster.currentPortfolio.get("name"),
      name : vals.name, type : vals.type, balance : 0
    }, vals.name);
    FinanceMaster.Data.accountsStore.add(rec);
    Ext.getCmp(
      "FinanceMaster.Portlets.PortfolioOverview.winAddAccount").close();
  }

}; // End FinanceMaster.AddAccountWindow.okButtonClick().


/**
 * Called to delete the currently selected account record.
 */
FinanceMaster.Portlets.PortfolioOverview.deleteAccount = function() {

  Ext.MessageBox.confirm("Confirm Deletion",
    "Are you sure you want to delete the selected account?",
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {
        // Remove Record from Store.
        FinanceMaster.Data.accountsStore.remove(
          Ext.getCmp(
            "FinanceMaster.Portlets.PortfolioOverview.grdAccounts"
          ).getSelectionModel().getSelected()
        );
        // Disable delete button.
        Ext.getCmp(
          "FinanceMaster.Portlets.PortfolioOverview.btnDelete").disable();
        // Publish AccountDeleted message.
        FinanceMaster.msgBus.publish("AccountDeleted");
      }
    }
  );

}; // End FinanceMaster.Portlets.PortfolioOverview.deleteAccount().


/**
 * Subscribe to InitComplete message to do one-time initialization tasks.
 */
FinanceMaster.msgBus.subscribe("InitComplete", function() {

  Ext.getCmp("PortfolioOverview").collapse();

});


/**
 * Subscribe to PortfolioOpened message so we can show accounts for the
 * newly opened portfolio.
 *
 * @param arguments[0] The PortfolioRecord of the opened portfolio.
 */
FinanceMaster.msgBus.subscribe("PortfolioOpened", function() {

  Ext.getCmp("PortfolioOverview").expand();

  // Get the PortfolioRecord passed in.
  var rec = arguments[0];

  // Query for all the accounts in the portfolio.
  var accounts = FinanceMaster.Data.retrieveAccounts(rec.get("name"));

  // Populate the accountsStore so it shows up in the Grid.
  FinanceMaster.Data.accountsStore.removeAll();
  FinanceMaster.processStoreEvents = false;
  for (var i = 0; i < accounts.length; i++) {
    FinanceMaster.Data.accountsStore.add(accounts[i]);
  }
  FinanceMaster.processStoreEvents = true;

});
