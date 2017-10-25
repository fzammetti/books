// Called to show the Please Wait layer when an operation begins.
function showPleaseWait() {
  processing = true;
  // First we center the layer.
  var pleaseWaitDIV = document.getElementById("divPleaseWait");
  var lca;
  if (window.innerWidth) {
    lca = window.innerWidth;
  } else {
    lca = document.body.clientWidth;
  }
  var lcb = pleaseWaitDIV.offsetWidth;
  var lcx = (Math.round(lca / 2)) - (Math.round(lcb / 2));
  var iebody = (document.compatMode &&
    document.compatMode != "BackCompat") ?
    document.documentElement : document.body;
  var dsocleft = document.all ? iebody.scrollLeft : window.pageXOffset;
  pleaseWaitDIV.style.left = (lcx + dsocleft - 120) + "px";
  if (window.innerHeight) {
    lca = window.innerHeight;
  } else {
    lca = document.body.clientHeight;
  }
  lcb = pleaseWaitDIV.offsetHeight;
  lcy = (Math.round(lca / 2)) - (Math.round(lcb / 2));
  iebody = (document.compatMode &&
    document.compatMode != "BackCompat") ?
    document.documentElement : document.body;
  var dsoctop = document.all ? iebody.scrollTop : window.pageYOffset;
  pleaseWaitDIV.style.top = (lcy + dsoctop - 40) + "px";
  // Now actually show it.
  pleaseWaitDIV.style.display = "block";
}

// Hides the Please Wait floatover.
function hidePleaseWait() {
  pleaseWaitDIV = 
    document.getElementById("divPleaseWait").style.display = "none";
  processing = false;
}
