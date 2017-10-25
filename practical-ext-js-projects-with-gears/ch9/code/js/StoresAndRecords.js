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
 * Portfolio record descriptor.
 */
FinanceMaster.Data.PortfolioRecord = Ext.data.Record.create([
  { name : "name" }, { name : "password" }
]);


/**
 * Account record descriptor.
 */
FinanceMaster.Data.AccountRecord = Ext.data.Record.create([
  { name : "portfolio" }, { name : "name" }, { name : "type" },
  { name : "balance" }
]);


/**
 * Account Activity record descriptor.
 */
FinanceMaster.Data.ActivityRecord = Ext.data.Record.create([
  { name : "id" }, { name : "portfolio" }, { name : "account" },
  { name : "date" }, { name : "pretty_date" }, { name : "amount" },
  { name : "new_balance" }, { name : "description" }
]);


/**
 * Portfolios data store.
 */
FinanceMaster.Data.portfoliosStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (FinanceMaster.processStoreEvents) {
          FinanceMaster.Data.createPortfolio(inRecords[0]);
        }
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        if (FinanceMaster.processStoreEvents) {
          FinanceMaster.Data.deletePortfolio(inRecord.get("id"));
        }
      }
    }
  }
});


/**
 * Accounts (for the currently opened portfolio) data store.
 */
FinanceMaster.Data.accountsStore = new Ext.data.GroupingStore({
  sortInfo : { field: "name", direction: "ASC" }, groupField : "type",
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (FinanceMaster.processStoreEvents) {
          FinanceMaster.Data.createAccount(inRecords[0]);
        }
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        if (FinanceMaster.processStoreEvents) {
          FinanceMaster.Data.deleteAccount(inRecord.get("portfolio"),
            inRecord.get("name"));
        }
      }
    }
  }
});
