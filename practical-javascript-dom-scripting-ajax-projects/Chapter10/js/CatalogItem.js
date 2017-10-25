/**
 * This class represents one item in the catalog.
 */
function CatalogItem() {


  /**
   * The ID of the item.
   */
  var itemID = "";


  /**
   * The title of the item.
   */
  var itemTitle = "";


  /**
   * The description of the item.
   */
  var itemDescription = "";


  /**
   * The URL to the image of the item.
   */
  var itemImageURL = "";


  /**
   * The price for one of the items.
   */
  var itemPrice = 0;


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
   * @param inItemTitle New value.
   */
  this.setItemTitle = function(inItemTitle) {

    itemTitle = inItemTitle;

  } // End setItemTitle().


  /**
   * Getter.
   *
   * @return The current value of the field.
   */
  this.getItemTitle = function() {

    return itemTitle;

  } // End getItemTitle().


  /**
   * Setter.
   *
   * @param inItemDescription New value.
   */
  this.setItemDescription = function(inItemDescription) {

    itemDescription = inItemDescription;

  } // End setItemDescription().


  /**
   * Getter.
   *
   * @return The current value of the field.
   */
  this.getItemDescription = function() {

    return itemDescription;

  } // End getItemDescription().


  /**
   * Setter.
   *
   * @param inItemImageURL New value.
   */
  this.setItemImageURL = function(inItemImageURL) {

    itemImageURL = inItemImageURL;

  } // End setItemImageURL().


  /**
   * Getter.
   *
   * @return The current value of the field.
   */
  this.getItemImageURL = function() {

    return itemImageURL;

  } // End getItemImageURL().


  /**
   * Setter.
   *
   * @param inItemPrice New value.
   */
  this.setItemPrice = function(inItemPrice) {

    itemPrice = inItemPrice;

  } // End setItemPrice().


  /**
   * Getter.
   *
   * @return The current value of the field.
   */
  this.getItemPrice = function() {

    return itemPrice;

  } // End getItemPrice().


  /**
   * Overriden toString() method.
   *
   * @return A meaningful string representation of the object.
   */
  this.toString = function() {

    return "CatalogItem : [ " +
      "itemID='" + itemID + "', " +
      "itemTitle='" + itemTitle + "', " +
      "itemDescription='" + itemDescription + "', " +
      "itemImageURL='" + itemImageURL + "', " +
      "itemPrice='" + itemPrice + "' ]";

  } // End toString().


} // End CatalogItem class.
