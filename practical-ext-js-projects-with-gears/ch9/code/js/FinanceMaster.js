/*
  Retirement - Enter last balance, show last balance
  Investment - Enter last balance, show last balance
  Loan - Enter last balance, show last balance
  Savings - Enter last amount in/out, show calculated balance
  Checking - Enter last amount in/out, show calculated balance
*/





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
 * MessageBus instance for publish/subscribe model.
 */
FinanceMaster.msgBus = new Ext.ux.MessageBus();


/**
 * Cookie provider that sets expiration on cookies to one year.
 */
FinanceMaster.cookieProvider = new Ext.state.CookieProvider({
  expires : new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365))
});


/**
 * Flag to tell us if Store events should be processed.
 */
FinanceMaster.processStoreEvents = false;


/**
 * An object that tells us the position of each portlet.  This will be
 * overridden with the stored cookie value, if any, but here we define the
 * defaults that will be written out the first time.
 */
FinanceMaster.portletPositions = [
  [ "PortfolioOverview", "PortfolioDistribution" ],
  [ "AccountActivity", "AccountHistory" ]
];


/**
 * The PortfolioRecord of the currently opened portfolio.
 */
FinanceMaster.currentPortfolio = null;


/**
 * The AccountRecord of the currently opened account.
 */
FinanceMaster.currentAccount = null;


/**
 * Modify form field prototype so that field labels are disabled when a field
 * is disabled.
 * Courtesy of vmoale4: https://extjs.com/forum/showthread.php?p=142569
 */
Ext.form.Field.prototype.disable =
  Ext.form.Field.prototype.disable.createInterceptor(function() {
  if (this.container) {
    this.container.parent().addClass("x-item-disabled");
  }
});
Ext.form.Field.prototype.enable =
  Ext.form.Field.prototype.enable.createInterceptor(function() {
  if (this.container) {
    this.container.parent().removeClass("x-item-disabled");
  }
});


/**
 * Initialization method, called from Ext.onReady().
 */
FinanceMaster.init = function() {

  // Initialize data access.
  var initResult = FinanceMaster.Data.init();
  switch (initResult) {
    case "ok":
      // Nothing to do in this case.
    break;
    case "no_gears":
      Ext.MessageBox.show({
        title : "Gears Not Available", buttons : Ext.MessageBox.OK,
        msg : "<br>" +
          "I'm sorry but Google Gears is not installed on your computer, " +
          "or is unavailable for some reason (like you disabled the " +
          "browser plugin for example)." +
          "<br><br>" +
          "If you do not have Gears installed, please visit " +
          "<a href=\"http://gears.google.com/\" target=\"new\">" +
          "the Gears home page</a> to install it." +
          "<br><br>" +
          "If you do have it installed, please try enabling the plugin in " +
          "whatever fashion is applicable in the browser you are using, " +
          "and reload this application.", animEl : "divSource"
      });
      return;
    break;
    default:
      Ext.MessageBox.alert("Initialization Failed",
        "Data access could not be initialized.  Reason: " + initResult);
      return;
    break;
  }

  // Get list of existing portfolios and put them in the portfoliosStore.
  var portfolios = FinanceMaster.Data.retrievePortfolios();
  for (var i = 0; i < portfolios.length; i++) {
    FinanceMaster.Data.portfoliosStore.add(portfolios[i]);
  }

  // Construct two arrays of portlet config objects, one for each column,
  // based on the value in the stored cookie (if any).
  var columnConfigs = new Array();
  columnConfigs[0] = new Array();
  columnConfigs[1] = new Array();
  for (var j = 0; j < 2; j++) {
    for (var k = 0; k < 4; k++) {
      var config = FinanceMaster.getPortlet(j, k);
      if (config) {
        columnConfigs[j].push(config);
      }
    }
  }

  // Build the UI.
  var viewport = new Ext.Viewport({ layout : "border",
    items : [
      /* Header. */
      { region : "north", height : 80, border : false,
        html : "<table border=\"0\" width=\"99%\"><tr>" +
          "<td><img src=\"img/FinanceMaster.gif\"></td>" +
          "<td align=\"right\"><a href=\"javascript:void(null);\" " +
          "onClick=\"new Ext.Window(" +
          "FinanceMaster.OpenPortfolioWindow.getConfig(true))." +
          "show('divSource');\">" +
          "Switch Portfolio</a></td></tr></table>"
      },
      /* Main content. */
      { xtype : "portal", region : "center", border : false,
        items : [
          { columnWidth : .5, style : "padding:10px 0px 10px 10px",
            items : columnConfigs[0]
          },
          { columnWidth : .5, style : "padding:10px 10px 10px 10px",
            items : columnConfigs[1]
          }
        ],
        listeners : {
          /* Handle the resize event to adjust divSource's top attribute. */
          resize : function(inComponent, inAdjWidth, inAdjHeight, inRawWidth,
            inRawHeight) {
            Ext.get("divSource").applyStyles(
              "top:" + Ext.getBody().getViewSize().height + "px;");
          },
          /* Portlet dropped. */
          drop : function(e) {
            // Remove portlet from its current position.
            for (var i = 0; i < 2; i++) {
              var j = FinanceMaster.portletPositions[i].indexOf(e.panel.id);
              if (j != -1) {
                FinanceMaster.portletPositions[i].splice(j, 1);
              }
            }
            // Insert portlet into new position.
            FinanceMaster.portletPositions[e.columnIndex].splice(
              e.position, 0, e.panel.id);
            // Store the new cookie value.
            for (var k = 0; k < 2; k++) {
              var cookieValue = FinanceMaster.portletPositions[k].join(",");
              // Cookies must always have a value, but when all the portlets are
              // in one column, it wouldn't.  So, we'll store a single space in
              // that case so that calling split() on it doesn't break.
              if (Ext.isEmpty(cookieValue)) {
                cookieValue = " ";
              }
              FinanceMaster.cookieProvider.set(
                "portletPositions" + k, cookieValue);
            }
          }
        }
      }
    ]
  });

  // Use our custom cookie provider.
  Ext.state.Manager.setProvider(FinanceMaster.cookieProvider);

  // Initialize QuickTips for form validation messages.
  Ext.QuickTips.init();
  Ext.form.Field.prototype.msgTarget = "side";

  // Request which portfolio to open.
  new Ext.Window(
    FinanceMaster.OpenPortfolioWindow.getConfig(false)).show("divSource");

  // Set flag to indicate Stores should now process events.
  FinanceMaster.processStoreEvents = true;

  // Let portlets do one-time initializations as required.
  FinanceMaster.msgBus.publish("InitComplete");

}; // End init().


/**
 * This function is called during initialization to get the config for the
 * portlet in a given column and position.  This information is stored in
 * cookies.
 *
 * @param  inColumn   The column being constructed.
 * @param  inPosition The position being constructed.
 * @return            The config object for the appropriate portlet.
 */
FinanceMaster.getPortlet = function(inColumn, inPosition) {

  // Process stored portletPositions cookies, if they exist.
  for (var i = 0; i < 2; i++) {
    var portletPositions = FinanceMaster.cookieProvider.get(
      "portletPositions" + i);
    if (portletPositions) {
      // Cookie found.  Now, account for case where the cookie is empty,
      // as happens when all the portlets are in one column.
      if (portletPositions == " ") {
        FinanceMaster.portletPositions[i] = new Array();
      } else {
        FinanceMaster.portletPositions[i] = portletPositions.split(",");
      }
    } else {
      // Cookie not found, write the default values out.
      FinanceMaster.cookieProvider.set("portletPositions" + i,
        FinanceMaster.portletPositions[i].join(","));
    }
  }

  // Get reference to namespace for the portlet at the position specified.
  var portletNamespace = FinanceMaster.Portlets[
    FinanceMaster.portletPositions[inColumn][inPosition]
  ];

  // Return the appropriate config object, or null if not found.
  if (portletNamespace) {
    return portletNamespace.getConfig();
  } else {
    return null;
  }

}; // End getPortlet().
