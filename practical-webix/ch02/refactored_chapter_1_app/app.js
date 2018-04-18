const MyApp = {

  init : function() {
    webix.ready(function() {
      webix.ui(this.uiDefinition);
    }.bind(this))
  },

  buttonClick : function() {
    webix.message({ type : "error", text : "See?<br><br>Wasn't that fun?!" });
  }

};
MyApp.init();
