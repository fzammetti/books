/**
 * This class represents a shopping cart.
 */
function Cart() {


  /**
   * The collection of items currently in the cart.
   */
  var cartItems = new Array();


  /**
   * Flag: Is the browser IE?  Used for mouse event handling.
   */
  var isIE = window.ActiveXObject ? true : false;


  /**
   * Get existing items, if any, as an array.
   */
  var cartCookie = jscript.storage.getCookie("js_shopping_cart");
  if (cartCookie) {
    var itemsInCart = cartCookie.split("~~");
    for (var i = 0; i < itemsInCart.length; i++) {
      var nextItem = itemsInCart[i];
      var nextItemID = nextItem.split("~")[0];
      var nextItemQuantity = nextItem.split("~")[1];
      var cartItem = new CartItem();
      cartItem.setItemID(nextItemID);
      cartItem.setQuantity(nextItemQuantity);
      cartItems.push(cartItem);
    }
  }


  /**
   * Return the collection of items in the cart.
   *
   * @return An array of CartItem objects.
   */
  this.getCartItems = function() {

    return cartItems;

  } // End getCartItems().


  /**
   * Add a purchased item to the cart.
   *
   * @param inItemToAdd The CartItem to add.
   */
  this.addItem = function(inItemToAdd) {

    cartItems.push(inItemToAdd);
    saveCart();

  } // End getCartItems().


  /**
   * Remove a purchased item from the cart.
   *
   * @param inItemIndex The index in the cartItems array to remove.
   */
  this.deleteItem = function(inItemIndex) {

    cartItems.splice(inItemIndex, 1);
    saveCart();

  } // End deleteItem().


  /**
   * Changes the quantity of an item in the cart.
   *
   * @param inItemIndex   The index in the cartItems array to remove.
   * @param inNewQuantity The new quantity of the item.
   */
  this.updateQuantity = function(inItemIndex, inNewQuantity) {

    var cartItem = cartItems[inItemIndex];
    cartItem.setQuantity(inNewQuantity);
    saveCart();

  } // End updateQuantity().


  /**
   * Returns the number of items currently in the cart.
   *
   * @return The number of items currently in the cart.
   */
  this.getCartItemCount = function() {

    var cartItemCount = 0;
    for (var i = 0; i < cartItems.length; i++) {
      cartItemCount += parseInt(cartItems[i].getQuantity());
    }
    return cartItemCount;

  } // End getCartItemCount().


  /**
   * Returns the total dollar amount of the cart.
   *
   * @return The total dollar amount of the cart.
   */
  this.getCartTotal = function() {

    var cartTotal = 0;
    for (var i = 0; i < cartItems.length; i++) {
      var nextItem = cartItems[i];
      var nextItemQuantity = nextItem.getQuantity();
      var nextItemID = nextItem.getItemID();
      var catalogItem = catalog.getItem(nextItemID);
      cartTotal += nextItemQuantity * catalogItem.getItemPrice();
    }
    return cartTotal;

  } // End getCartTotal().


  /**
   * Saves the cart as a cookie.
   */
  var saveCart = function() {

    // Construct shopping cart string for cookie and store it.
    var shoppingCart = "";
    for (var i = 0; i < cartItems.length; i++) {
      nextItem = cartItems[i];
      if (shoppingCart != "") {
        shoppingCart += "~~";
      }
      shoppingCart += nextItem.serialize();
    }
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate()+7)
    jscript.storage.setCookie("js_shopping_cart", shoppingCart, expireDate);

  } // End saveCart().


  /**
   * Redisplays the current item count and total of the cart.
   */
  this.updateCartStats = function() {

    // Put the total item count and dollar amount of the cart on the screen,
    // if and only if there are items in the cart already.
    var spnCartCountValue = "";
    var spnCartTotalValue = "";
    var cartItemCount = cart.getCartItemCount();
    if (cartItemCount != 0) {
      spnCartCountValue = cartItemCount + " item(s)";
      spnCartTotalValue = cart.getCartTotal();
      // Now some math: the total dollar amount has to be rounded for proper
      // display.  The basic logic harkens back to pre-algebra:
      // * Multiply the number by 10^x
      // * Apply Math.round() to the result
      // * Divide the result by 10^x
      spnCartTotalValue = Math.round(spnCartTotalValue * 100) / 100;
    }
    document.getElementById("spnItemCount").innerHTML = spnCartCountValue;
    document.getElementById("spnCartTotal").innerHTML = spnCartTotalValue;

  } // End updateCartStats().


  /**
   * Deals with the situation where an item is dropped on the cart.
   *
   * @param element The image element that was dropped on the cart.
   */
  this.doOnDrop = function(element) {

    // Get the ID of the item dropped in the cart.
    var itemID = element.id.split("_")[1];

    // Find out how many the user wants.
    var quantity =
      parseInt(prompt("How many would you like to add to your cart?", ""));
    if (!isNaN(quantity) && quantity != 0) {
      // Create a cart item and add it to the cart.
      var cartItem = new CartItem();
      cartItem.setItemID(itemID);
      cartItem.setQuantity(quantity);
      cart.addItem(cartItem);
    }

    // Show the cart item count and dollar total.
    cart.updateCartStats();

  } // End doOnDrop().


  /**
   * Gets the mouse event X coordinate in a cross-browser fashion.
   *
   * @param inEvent The mouse event object.
   */
  this.getMouseX = function(inEvent) {

    var x;
    if (isIE) {
      x = (parseInt(event.clientX ) +
        parseInt(document.body.scrollLeft));
    } else {
      x = parseInt(inEvent.pageX);
    }
    return x;

  } // End getMouseX().


  /**
   * Gets the mouse event Y coordinate in a cross-browser fashion.
   *
   * @param inEvent The mouse event object.
   */
  this.getMouseY = function(inEvent) {

    var y;
    if (isIE) {
      y = (parseInt(event.clientY) + parseInt(document.body.scrollTop));
    } else {
      y = parseInt(inEvent.pageY);
    }
    return y;

  } // End getMouseY().


  /**
   * Called when an image begins to be dragged.  Hides all the description
   * popups on the page.
   */
  this.onDragStart = function() {

    for (var i = 1; i < 9; i++) {
      document.getElementById("desc_" + i).style.display = "none"
    }

  } // End onDragStart().


  /**
   * When the mouse moves over an image, this is called to hide the description.
   *
   * @param inEvent The mouse event object.
   */
  this.hoverDescriptionShow = function(inEvent) {

    var itemID = this.id.split("_")[1];
    var mouseX = cart.getMouseX(inEvent);
    var mouseY = cart.getMouseY(inEvent);
    var descObj = document.getElementById("desc_" + itemID);
    descObj.style.left = mouseX;
    descObj.style.top = mouseY;
    descObj.style.display = "block";

  } // End hoverDescriptionShow().


  /**
   * When the mouse moves off an image, this is called to hide the description.
   *
   * @param inEvent The mouse event object.
   */
  this.hoverDescriptionHide = function(inEvent) {

    var itemID = this.id.split("_")[1];
    document.getElementById("desc_" + itemID).style.display = "none"

  } // End hoverDescriptionHide().


} // End Cart class.


// The one and only instance of the shopping cart.
var cart = new Cart();
