/*
    Code Cabinet - From the book "Practical webOS Projects With the Palm Pre"
    Copyright (C) 2009 Frank W. Zammetti
    fzammetti@etherient.com

    Licensed under the terms of the MIT license as follows:

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to 
    deal in the Software without restriction, including without limitation the 
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
    FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
    IN THE SOFTWARE.
*/


/**
 * The scene's assistant class.
 */
function CategoryAddAssistant() { };  


/**
 * The model for the txtCategoryName TextField.  The value property of this
 * object gets updated with the entered value.
 */
CategoryAddAssistant.prototype.txtCategoryNameModel = { value : "" };


/**
 * Set up the scene.
 */
CategoryAddAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, codeCabinet.appMenuAttributes, 
    codeCabinet.appMenuModel); 

  // Set up the Category Name TextField, pointing it to txtDategoryNameModel.
  this.controller.setupWidget("categoryAdd_txtCategoryName", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30 },
    this.txtCategoryNameModel
  );

  // Setup up model for and hook up event handler to the Add Button.
  this.controller.setupWidget("categoryAdd_btnAdd", { },
    { label : "Add", buttonClass : "affirmative" }
  ); 
  Mojo.Event.listen(this.controller.get("categoryAdd_btnAdd"), Mojo.Event.tap, 
    this.add.bind(this)
  ); 

}; // End CategoryAddAssistant.prototype.setup().


/**
 * Handle the Ok button's tap event.
 */
CategoryAddAssistant.prototype.add = function() {

  // If the user entered something, add the category.
  if (this.txtCategoryNameModel.value && 
    this.txtCategoryNameModel.value.strip() != "") {
    // Tell DAO to create the database record.
    dao.createCategory(this.txtCategoryNameModel.value);
    // Go back to the category list scene.
    this.controller.stageController.popScene();
  } else {
    Mojo.Controller.errorDialog(
      "I'm sorry but you must enter a name for this category."
    );
  }

}; // CategoryAddAssistant.prototype.add().

