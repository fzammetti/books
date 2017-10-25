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


Ext.namespace("FinanceMaster.Portlets.AccountActivity");


/**
 * Activity (for the currently opened account) data store.
 */
FinanceMaster.Portlets.AccountActivity.activityStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (FinanceMaster.processStoreEvents) {
          FinanceMaster.Data.createActivity(inRecords[0]);
        }
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        if (FinanceMaster.processStoreEvents) {
          FinanceMaster.Data.deleteActivity(inRecord.get("id"));
        }
      }
    }
  }
});


/**
 * Return the configuration object for this UI component.
 */
FinanceMaster.Portlets.AccountActivity.getConfig = function() { return {

  title : "Account Activity", id : "AccountActivity", height : 200,
  layout : "fit",
  items : [
    /* Activity Grid. */
    { xtype : "listview", singleSelect : true,
      store : FinanceMaster.Portlets.AccountActivity.activityStore,
      id : "FinanceMaster.Portlets.AccountActivity.grdActivity",
      columns : [
        { header : "Date", sortable : true, dataIndex : "date", width : .1,
          tpl : '{date:date("m/d/Y")}'
        },
        { header : "Deposit", sortable : true, dataIndex : "amount",
          width : .1, hidden : true, align : "right",
          tpl : '<tpl if="amount &gt;= 0">{amount}</tpl>'
        },
        { header : "Withdrawal", sortable : true, dataIndex : "amount",
          width : .1, hidden : true, align : "right",
          tpl : '<tpl if="amount &lt; 0">{amount}</tpl>'
        },
        { header : "New Balance", sortable : true, dataIndex : "new_balance",
          width : .1, hidden : true,
          tpl : '<tpl if="new_balance &gt; 0">{new_balance}</tpl>'
        },
        { header : "Description", sortable : true, dataIndex : "description" }
      ],
      listeners: {
        click : function(inListView, inSelections) {
          // Enable delete button.
          Ext.getCmp(
            "FinanceMaster.Portlets.AccountActivity.btnDelete").enable();
          return true;
        }
      }
    }
  ],
  tbar : [
    /* Add Activity Button. */
    { text : "Add Activity", icon : "img/Add.gif", disabled : true,
      cls : "x-btn-text-icon",
      id : "FinanceMaster.Portlets.AccountActivity.btnAdd",
      handler : function() {
        // Create and show the Add Activity Window. */
        new Ext.Window({
          closable : true, modal : true, width : 350, height : 290,
          minimizable : false, resizable : false, draggable : false,
          id : "FinanceMaster.Portlets.AccountActivity.winAddActivity",
          shadowOffset : 8, title : "Add activity entry",
          items : [
            { frame : true,
              html : "Select the date of the activity, enter either a " +
                "deposit or withdrawal amount (for Checking and Savings " +
                "accounts) or the new balance of the account (for all other " +
                "account types) and then click Ok to save the activity.  " +
                "Click Cancel if you decide not to add an activity entry at " +
                "this time."
            },
            /* The entry form. */
            { xtype : "form", frame : true, monitorValid : true,
              id : "FinanceMaster.Portlets.AccountActivity.frmAddActivity",
              items : [
                { xtype : "datefield", fieldLabel : "Date", name : "date",
                  allowBlank : false,
                  id : "FinanceMaster.Portlets.AccountActivity.addDate" },
                { xtype : "textfield", fieldLabel : "Deposit", name : "deposit",
                  id : "FinanceMaster.Portlets.AccountActivity.addDeposit" },
                { xtype : "textfield", fieldLabel : "Withdrawal",
                  name : "withdrawal",
                  id : "FinanceMaster.Portlets.AccountActivity.addWithdrawal" },
                { xtype : "textfield", fieldLabel : "New Balance",
                  name : "new_balance",
                  id : "FinanceMaster.Portlets.AccountActivity.addNewBalance" },
                { xtype : "textfield", fieldLabel : "Description",
                  name : "description" }
              ],
              buttons : [
                /* Ok button. */
                { text : "Ok", formBind : true, icon : "img/Ok.gif",
                  cls : "x-btn-text-icon",
                  handler : function() {
                    FinanceMaster.Portlets.AccountActivity.addActivity();
                  }
                },
                /* Cancel button. */
                { text : "Cancel", icon : "img/Cancel.gif",
                  cls : "x-btn-text-icon",
                  handler : function() {
                    Ext.getCmp(
                      "FinanceMaster.Portlets.AccountActivity.winAddActivity"
                    ).close();
                  }
                }
              ]
            }
          ]
        }).show("divSource");
        // Enable/disable fields on Window as applicahle.
        var accountType = FinanceMaster.currentAccount.get("type");
        if (accountType == "Checking" || accountType == "Savings") {
          Ext.getCmp(
            "FinanceMaster.Portlets.AccountActivity.addDeposit").enable();
          Ext.getCmp(
            "FinanceMaster.Portlets.AccountActivity.addWithdrawal").enable();
          Ext.getCmp(
            "FinanceMaster.Portlets.AccountActivity.addNewBalance").disable();
        } else {
          Ext.getCmp(
            "FinanceMaster.Portlets.AccountActivity.addDeposit").disable();
          Ext.getCmp(
            "FinanceMaster.Portlets.AccountActivity.addWithdrawal").disable();
          Ext.getCmp(
            "FinanceMaster.Portlets.AccountActivity.addNewBalance").enable();
        }
      }
    },
    "-",
    /* Delete Activity Button. */
    { text : "Delete Activity", icon : "img/Delete.gif", disabled : true,
      cls : "x-btn-text-icon",
      id : "FinanceMaster.Portlets.AccountActivity.btnDelete",
      handler : function() {
        FinanceMaster.Portlets.AccountActivity.deleteActivity();
      }
    }
  ]

}; };


/**
 * Called to delete the currently selected activity record.
 */
FinanceMaster.Portlets.AccountActivity.deleteActivity = function() {

  Ext.MessageBox.confirm("Confirm Deletion",
    "Are you sure you want to delete the selected detail record?",
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {
        // Remove Record from Store.
        var selectedRecord = Ext.getCmp(
          "FinanceMaster.Portlets.AccountActivity.grdActivity"
        ).getSelectedRecords()
        selectedRecord = selectedRecord[0];
        FinanceMaster.Portlets.AccountActivity.activityStore.remove(
          selectedRecord);
        // Disable delete button.
        Ext.getCmp(
          "FinanceMaster.Portlets.AccountActivity.btnDelete").disable();
        // Recalculate the balance of the account and update the current
        // AccountRecord.
        FinanceMaster.currentAccount.set("balance",
          FinanceMaster.Data.getAccountBalance(
            FinanceMaster.currentPortfolio.get("name"),
            FinanceMaster.currentAccount.get("name"),
            FinanceMaster.currentAccount.get("type")
          )
        );
        // Lastly, publish the ActivityDeleted message for interested
        // subscribers.
        FinanceMaster.msgBus.publish("ActivityDeleted");
      }
    }
  );

}; // End FinanceMaster.Portlets.AccountActivity.deleteActivity().


/**
 * Handles click event for Ok button.
 */
FinanceMaster.Portlets.AccountActivity.addActivity = function() {

  // Get the entered values, and the date specially.
  var vals = Ext.getCmp(
    "FinanceMaster.Portlets.AccountActivity.frmAddActivity"
  ).getForm().getValues();
  var addDate =
    Ext.getCmp("FinanceMaster.Portlets.AccountActivity.addDate").getValue();

  // Quick validation #1: make sure both Deposit and Withdrawl weren't
  // entered together.
  if (!Ext.isEmpty(vals.deposit) && !Ext.isEmpty(vals.withdrawal)) {
    Ext.MessageBox.alert("Cannot Add Activity",
      "Please enter an amount for either Deposit or Withdrawl, but not both");
    return;
  }

  // Quick validation #2: make sure at least one of Deposit, Withdrawal or
  // New Balance is entered
  if (Ext.isEmpty(vals.deposit) && Ext.isEmpty(vals.withdrawal) &&
    Ext.isEmpty(vals.new_balance)) {
    Ext.MessageBox.alert("Cannot Add Activity",
      "Please enter an amount (Deposit or Withdrawal for Checking and " +
      "Savings account, New Balance for all other account types)");
    return;
  }

  // Create a new ActivityRecord and add it to the activityStore.
  var recID = new Date().getTime();
  var amount = vals.deposit;
  if (!amount && !vals.new_balance) {
    amount = vals.withdrawal * -1;
  }
  rec = new FinanceMaster.Data.ActivityRecord({
    id : recID, date : addDate,
    portfolio : FinanceMaster.currentPortfolio.get("name"),
    account : FinanceMaster.currentAccount.get("name"),
    amount : amount, new_balance : vals.new_balance,
    description : vals.description
  }, recID);
  FinanceMaster.Portlets.AccountActivity.activityStore.add(rec);
  Ext.getCmp("FinanceMaster.Portlets.AccountActivity.winAddActivity").close();

  // Recalculate the balance of the account and update the current
  // AccountRecord.
  FinanceMaster.currentAccount.set("balance",
    FinanceMaster.Data.getAccountBalance(
      FinanceMaster.currentPortfolio.get("name"),
      FinanceMaster.currentAccount.get("name"),
      FinanceMaster.currentAccount.get("type")
    )
  );

  // Lastly, publish the ActivityAdded message for interested subscribers.
  FinanceMaster.msgBus.publish("ActivityAdded");

}; // FinanceMaster.Portlets.AccountActivity.addActivity().


/**
 * Subscribe to InitComplete message to do one-time initialization tasks.
 */
FinanceMaster.msgBus.subscribe("InitComplete", function() {

  Ext.getCmp("AccountActivity").collapse();

});


/**
 * Subscribe to PortfolioOpened message so we can collapse this portlet.
 */
FinanceMaster.msgBus.subscribe("PortfolioOpened", function() {

  Ext.getCmp("AccountActivity").collapse();
  Ext.getCmp("FinanceMaster.Portlets.AccountActivity.btnAdd").disable();
  Ext.getCmp("FinanceMaster.Portlets.AccountActivity.btnDelete").disable();

});


/**
 * Subscribe to AccountOpened message so we can show activity for the
 * newly opened account.
 *
 * @param arguments[0] The AccountRecord of the opened portfolio.
 */
FinanceMaster.msgBus.subscribe("AccountOpened", function() {

  Ext.getCmp("AccountActivity").expand();
  Ext.getCmp("FinanceMaster.Portlets.AccountActivity.btnAdd").enable();
  Ext.getCmp("FinanceMaster.Portlets.AccountActivity.btnDelete").disable();

  // Get the AccountRecord passed in.
  var rec = arguments[0];

  // Get all of the activity records for this account.
  var activity = FinanceMaster.Data.retrieveActivity(
    rec.get("portfolio"), rec.get("name"));

  // Populate activity store.
  FinanceMaster.processStoreEvents = false;
  FinanceMaster.Portlets.AccountActivity.activityStore.removeAll();
  for (var i = 0; i < activity.length; i++) {
    FinanceMaster.Portlets.AccountActivity.activityStore.add(activity[i]);
  }
  FinanceMaster.processStoreEvents = true;

});


/**
 * Subscribe to AccountDeleted message so we can reset this portlet.
 */
FinanceMaster.msgBus.subscribe("AccountDeleted", function() {

  Ext.getCmp("AccountActivity").collapse();
  Ext.getCmp("FinanceMaster.Portlets.AccountActivity.btnAdd").disable();
  Ext.getCmp("FinanceMaster.Portlets.AccountActivity.btnDelete").disable();

});
