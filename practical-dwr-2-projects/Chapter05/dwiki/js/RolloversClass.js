/**
 * This class deals with the rollover effects on the top and left navigation
 * bars.
 */
function RolloversClass() {


  /**
   * Image preloads for image rollovers.
   */
  var frontPage0 = new Image(113, 22);
  frontPage0.src = "img/frontPage0.gif";
  var frontPage1 = new Image(113, 22);
  frontPage1.src = "img/frontPage1.gif";
  var allArticlesIndex0 = new Image(113, 22);
  allArticlesIndex0.src = "img/allArticlesIndex0.gif";
  var allArticlesIndex1 = new Image(113, 22);
  allArticlesIndex1.src = "img/allArticlesIndex1.gif";
  var search0 = new Image(113, 22);
  search0.src = "img/search0.gif";
  var search1 = new Image(113, 22);
  search1.src = "img/search1.gif";
  var help0 = new Image(113, 22);
  help0.src = "img/help0.gif";
  var help1 = new Image(113, 22);
  help1.src = "img/help1.gif";
  var article0 = new Image(113, 22);
  article0.src = "img/article0.gif";
  var article1 = new Image(113, 22);
  article1.src = "img/article1.gif";
  var edit0 = new Image(113, 22);
  edit0.src = "img/edit0.gif";
  var edit1 = new Image(113, 22);
  edit1.src = "img/edit1.gif";
  var history0 = new Image(113, 22);
  history0.src = "img/history0.gif";
  var history1 = new Image(113, 22);
  history1.src = "img/history1.gif";
  var comments0 = new Image(113, 22);
  comments0.src = "img/comments0.gif";
  var comments1 = new Image(113, 22);
  comments1.src = "img/comments1.gif";


  /**
   * Function called when certain images are hovered over, for rollover effect.
   *
   * @param inImg The image object being hovered over.
   */
  this.imgOver = function(inImg) {

    var imgName = inImg.id;
    var img1 = eval(imgName + "1");
    inImg.src = img1.src;

  } // End imgOver().


  /**
   * Function called when certain images are no longer hovered over, for
   * rollover effect.
   *
   * @param inImg The image object no longer being hovered over.
   */
  this.imgOut = function(inImg) {

    if (inImg.id != DWiki.currentMode) {
      var imgName = inImg.id;
      var img0 = eval(imgName + "0");
      inImg.src = img0.src;
    }

  } // End imgOut().


} // End class.


// The one and only instance of RolloversClass.
var Rollovers = new RolloversClass();
