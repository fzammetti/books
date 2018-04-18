MyApp.uiDefinition = {
  view : "layout", type : "wide",
  rows : [
    /* Row 1 */
    { type : "header", template : "Hello" },
    /* Row 2 */
    { template : "Greetings, human!" },
    /* Row 3 */
    { gravity : 2,
      cols : [
        { css : "col1", template : "Webix" },
        { view : "resizer" },
        { css : "col2", template : "Is" },
        { view : "resizer" },
        { css : "col3", template : "Cool" }
      ]
    },
    /* Row 4 */
    { type : "header", template : "Goodbye"  },
    /* Row 5 */
    { height : 50,
      cols : [
        { template : "Farewell thee well!" },
        { view : "button", width : 150, type : "iconButton",
          icon : "users", label : "Click for fun", click : MyApp.buttonClick
        }
      ]
    }
  ]
};
