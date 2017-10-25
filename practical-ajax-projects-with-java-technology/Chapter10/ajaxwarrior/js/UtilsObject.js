function UtilsObject() {

  /**
   * Center a given layer on the screen horizontally.
   */
  this.layerCenterH = function(layerCenterObj) {

    var lca;
    var lcb;
    var lcx;
    var iebody;
    var dsocleft;
    if (window.innerWidth) {
      lca = window.innerWidth;
    } else {
      lca = document.body.clientWidth;
    }
    lcb = layerCenterObj.offsetWidth;
    lcx = (Math.round(lca / 2)) - (Math.round(lcb / 2));
    iebody = (document.compatMode &&
      document.compatMode != "BackCompat") ?
      document.documentElement : document.body;
    dsocleft = document.all ? iebody.scrollLeft : window.pageXOffset;
    layerCenterObj.style.left = lcx + dsocleft + "px";

  } // End layerCenterH().


  /**
   * Center a given layer on the screen vertically.
   */
  this.layerCenterV = function(layerCenterObj) {

    var lca;
    var lcb;
    var lcy;
    var iebody;
    var dsoctop;
    if (window.innerHeight) {
      lca = window.innerHeight;
    } else {
      lca = document.body.clientHeight;
    }
    lcb = layerCenterObj.offsetHeight;
    lcy = (Math.round(lca / 2)) - (Math.round(lcb / 2));
    iebody = (document.compatMode &&
      document.compatMode != "BackCompat") ?
      document.documentElement : document.body;
    dsoctop = document.all ? iebody.scrollTop : window.pageYOffset;
    layerCenterObj.style.top = lcy + dsoctop + "px";

  } // End layerCenterV().

} // End Utils.
