/**
 * Set this to true to see the fancy version, false for the plain-jane version.
 */
var javaScriptEnabled = true;


/**
 * Called when the index.htm page loads.
 */
function init() {

  if (javaScriptEnabled) {

    // For each item...
    for (var i = 1; i < 9; i++) {

      // Remove the description link.
      document.getElementById("desc" + i).style.display = "none";

      // Hook up the description hover to it.
      var imgObject = document.getElementById("img_" + i)
      imgObject.onmouseover = cart.hoverDescriptionShow;
      imgObject.onmouseout = cart.hoverDescriptionHide;

      // Make the image draggable.
      new MochiKit.DragAndDrop.Draggable("img_" + i, { revert : true });

      // Event handler from drag starting (hides description popups).
      connect(Draggables, 'start', cart.onDragStart);

      // Create a description popup for the item.
      var descPopup = document.createElement("div");
      descPopup.setAttribute("id", "desc_" + i);
      descPopup.innerHTML =
        catalog.getItem(i).getItemDescription();
      descPopup.style.width = "300px";
      descPopup.style.height = "200px";
      descPopup.style.position = "absolute";
      descPopup.style.display = "none";
      descPopup.style.border = "2px solid #ff0000";
      descPopup.style.padding = "4px";
      descPopup.style.backgroundColor = "#efefef";
      document.getElementById("divMain").appendChild(descPopup);

    }

    // Make the shopping cart a drop target.
    new MochiKit.DragAndDrop.Droppable("shoppingCart",
      { ondrop : cart.doOnDrop }
    );

  }

  // Show the cart item count and dollar total.  This only really matters
  // if the user goes to the view cart or checkout pages and then goes back
  // the catalog... when the cart is empty this basically has no effect.
  // Also note that what this function renders would be done by a server-side
  // component if JavaScript was disabled, but we're faking it here.
  cart.updateCartStats();

} // End init().
