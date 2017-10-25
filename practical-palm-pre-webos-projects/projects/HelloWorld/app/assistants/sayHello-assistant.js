function SayHelloAssistant() { };  

SayHelloAssistant.prototype.txtNameModel = { value : "" };

SayHelloAssistant.prototype.setup = function() {

  this.controller.setupWidget("txtName", 
    { maxLength : 15 }, this.txtNameModel
  );

  this.controller.setupWidget("btnGreet", { }, { label : "Greet Me" } ); 
  Mojo.Event.listen(this.controller.get("btnGreet"), Mojo.Event.tap, 
    this.greet.bind(this)
  ); 

};

SayHelloAssistant.prototype.greet = function() {

  this.controller.showAlertDialog({
    onChoose : function(inValue) { },
    title : "Greetings!",
    message : "Hello, " + this.txtNameModel.value,
    choices : [
      { label : "Ok", value : "" }
    ]
  }); 

};
