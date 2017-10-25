/**
 * This class represents one item in the shopping cart.
 */
function CartItem() {


  /**
   * The ID of the item.
   */
  var itemID = "";


  /**
   * The quantity of the item in the cart.
   */
  var quantity = 0;


  /**
   * Setter.
   *
   * @param inItemID New value.
   */
  this.setItemID = function(inItemID) {

    itemID = inItemID;

  } // End setItemID().


  /**
   * Getter.
   *
   * @return The current value of the field.
   */
  this.getItemID = function() {

    return itemID;

  } // End getItemID().


  /**
   * Setter.
   *
   * @param inQuantity New value.
   */
  this.setQuantity = function(inQuantity) {

    quantity = inQuantity;

  } // End setQuantity().


  /**
   * Getter.
   *
   * @return The current value of the field.
   */
  this.getQuantity = function() {

    return quantity;

  } // End getQuantity().


  /**
   * Returns a serialized version of the item suitable for writing out to the
   * cookie.
   */
  this.serialize = function() {

    return itemID + "~" + quantity;

  } // End serialize().


  /**
   * Overriden toString() method.
   *
   * @return A meaningful string representation of the object.
   */
  this.toString = function() {

    return "CartItem : [ " +
      "itemID='" + itemID + "', " +
      "quantity='" + quantity + "' ]";

  } // End toString().


} // End CartItem class.
