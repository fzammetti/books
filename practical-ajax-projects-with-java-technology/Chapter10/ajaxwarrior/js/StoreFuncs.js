/**
 * This function is called when the player steps on a store trigger tile.
 */
function showStore() {

  if (xhr.request == null) {

    sendAJAX(showStore, "store.jsp", "", null);

  } else {

    showSecondaryView(xhr.request.responseText, Globals.VIEW_STORE);
    return true;

  } // End xhr.request == null if.

} // End showStore().


/**
 * This function is called when the player purchases an item in a store.
 */
function purchaseItem(inWhichItem) {

  if (xhr.request == null) {

    sendAJAX(purchaseItem, "purchaseItem.command", "?whichItem=" +
      inWhichItem, null);

  } else {

    updateActivityScroll(xhr.json.mg);
    return true;

  } // End xhr.request == null if.

} // End purchaseItem().
