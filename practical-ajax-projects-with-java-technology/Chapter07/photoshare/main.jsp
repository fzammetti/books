<%@ taglib prefix="jstags" uri="javawebparts/taglib/jstags" %>

<html>
  <head>
    <title>PhotoShare</title>

    <!-- Link in stylesheet. -->
    <link rel="stylesheet" href="css/styles.css" type="text/css">

    <!-- Render JDSigester code. -->
    <jstags:jsDigester renderScriptTags="true" />

    <!-- Import global variables. -->
    <script src="js/Globals.js"></script>

    <!-- Import Dojo for Ajax and event functionality. -->
    <script src="js/dojo.js"></script>

    <!-- Import PhotoShare objects. -->
    <script src="js/Collection.js"></script>
    <script src="js/Photo.js"></script>

    <!-- Import code for image growing. -->
    <script src="js/ImageGrowing.js"></script>

    <!-- Import code for Please Wait floatover. -->
    <script src="js/PleaseWait.js"></script>

    <!-- Import code that handles events fired from the control frame. -->
    <script src="js/ControlEvents.js"></script>

    <!-- Import code related to the filmstrip. -->
    <script src="js/Filmstrip.js"></script>

    <!-- Import miscellaneous PhotoShare code. -->
    <script src="js/misc.js"></script>

  </head>
  <body onLoad="init();" class="cssMainNoPadding">

    <!-- Please Wait floatover div. -->
    <div id="divPleaseWait" class="cssPleaseWait">
      <img src="img/pleasewait.gif" hspace="4" vspace="8" align="absmiddle">
      Please wait, processing...
    </div>

    <!-- Split the screen in two columns, one for the filmstrip, the -->
    <!-- other for the photo landing pad viewing area. -->
    <table width="100%" cellpading="0" cellspacing="0" border="0"
      class="cssMain"><tr>

      <td width="100" align="center" valign="middle">

        <!-- Up button. -->
        <img src="img/up_button_0.gif" id="up_button" class="cssUpButton"
          onMouseOver="buttonOver(this);this.style.cursor='pointer';"
          onMouseOut="buttonOut(this);this.style.cursor='normal';">

        <!-- Hide area for top of filmstrip. -->
        <img src="img/film_tile_hide.gif" class="cssFilmstripTopHide">
        <br>

        <!-- Filmstrip photo "holes". -->
        <img src="img/film_tile.gif" id="filmTile0" class="cssFilmTile0">
        <img src="img/film_tile.gif" id="filmTile1" class="cssFilmTile1">
        <img src="img/film_tile.gif" id="filmTile2" class="cssFilmTile2">
        <img src="img/film_tile.gif" id="filmTile3" class="cssFilmTile3">
        <img src="img/film_tile.gif" id="filmTile4" class="cssFilmTile4">

        <!-- Placeholders for images on filmstrip. -->
        <img onClick="imgClick(0);" arrayIndex="" src="img/film_placeholder.gif"
          width="64" height="64" id="pic0"
          onMouseOver="this.style.cursor='pointer';"
          onMouseOut="this.style.cursor='normal';"
          style="position:absolute;top:16px;left:19px;z-index:200;">
        <img onClick="imgClick(1);" arrayIndex="" src="img/film_placeholder.gif"
          width="64" height="64" id="pic1"
          onMouseOver="this.style.cursor='pointer';"
          onMouseOut="this.style.cursor='normal';"
          style="position:absolute;top:96px;left:19px;z-index:200;">
        <img onClick="imgClick(2);" arrayIndex="" src="img/film_placeholder.gif"
          width="64" height="64" id="pic2"
          onMouseOver="this.style.cursor='pointer';"
          onMouseOut="this.style.cursor='normal';"
          style="position:absolute;top:176px;left:19px;z-index:200;">
        <img onClick="imgClick(3);" arrayIndex="" src="img/film_placeholder.gif"
          width="64" height="64" id="pic3"
          onMouseOver="this.style.cursor='pointer';"
          onMouseOut="this.style.cursor='normal';"
          style="position:absolute;top:256px;left:19px;z-index:200;">
        <img onClick="imgClick(4);" arrayIndex="" src="img/film_placeholder.gif"
          width="64" height="64" id="pic4"
          onMouseOver="this.style.cursor='pointer';"
          onMouseOut="this.style.cursor='normal';"
          style="position:absolute;top:336px;left:19px;z-index:200;">

        <!-- The growing image. -->
        <img src="img/film_placeholder.gif" id="imgGrowing"
          class="cssImageGrowing">

        <!-- Hide area for bottom of filmstrip. -->
        <img src="img/film_tile_hide.gif"
          style="position:absolute;top:408px;left:6px;z-index:300;">

        <!-- Down button. -->
        <img src="img/down_button_0.gif" id="down_button"
          style="position:absolute;top:418px;left:23px;z-index:400;"
          onMouseOver="buttonOver(this);this.style.cursor='pointer';"
          onMouseOut="buttonOut(this);this.style.cursor='normal';">

      </td>

      <td align="center" valign="middle">

        <!-- Landing pad. -->
        <div id="landingPad" style="position:absolute;left:116px;top:10px;width:640px;height:480px;background-color:#eaeaea;z-index:10;">
          <div id="landingPadText" style="display:block;">
            <table width="80%" cellpading="4" cellspacing="0" border="0"
              class="cssMain"><tr><td>
              <br>
              Welcome to PhotoShare!
              <br><br><br>
              PhotoShare is an Ajax-based application that you can use to share
              photographs with friends, family, and indeed complete strangers,
              if that is what you would like to do.
              <br><br><br>
              A few notes before you start to play:
              <br>
              <ul>
                <li>PhotoShare has been designed with a minimum screen size of
                  1024x768 pixels.  It will of course work at lower resolutions,
                  but your experience may not be optimal (i.e., more scrolling
                  to do).<br><br>
                <li>PhotoShare is designed, by default, to show photographs at
                  VGA resolution, that is, 640x480 pixels.  If a photo is not
                  naturally that size, it will be stretched or shrunk to fit these
                  dimensions.  However, you can click the Actual Size button at
                  any time to see the photo in its natural size.  This will
                  most times result in scrollbars appearing so you can see the
                  entire photo.<br><br>
                <li>Because PhotoShare uses HTML frames, you should feel free to
                  resize the various sections as you feel appropriate.
              </ul>
              <br>
              Other than that, have fun!  You should probably begin by creating
              a collection, since you won't be able to do much else before that.
              Then add a few photos and enjoy!
          </td></tr></table>
          </div>
        </div>
        <!-- Shadow for landing pad. -->
        <div id="shadow1" style="position:absolute;left:117px;top:11px;width:640px;height:480px;background-color:#000000;z-index:8;"></div>
        <div id="shadow2" style="position:absolute;left:118px;top:12px;width:640px;height:480px;background-color:#202020;z-index:7;"></div>
        <div id="shadow3" style="position:absolute;left:119px;top:13px;width:640px;height:480px;background-color:#404040;z-index:6;"></div>
        <div id="shadow4" style="position:absolute;left:120px;top:14px;width:640px;height:480px;background-color:#606060;z-index:5;"></div>
        <div id="shadow5" style="position:absolute;left:121px;top:15px;width:640px;height:480px;background-color:#808080;z-index:4;"></div>
        <div id="shadow6" style="position:absolute;left:122px;top:16px;width:640px;height:480px;background-color:#a0a0a0;z-index:3;"></div>
        <div id="shadow7" style="position:absolute;left:123px;top:17px;width:640px;height:480px;background-color:#c0c0c0;z-index:2;"></div>
        <div id="shadow8" style="position:absolute;left:124px;top:18px;width:640px;height:480px;background-color:#e0e0e0;z-index:1;"></div>
        <div id="shadow9" style="position:absolute;left:124px;top:18px;width:640px;height:480px;background-color:#fafafa;z-index:0;"></div>

      </td>

    </tr></table>
  </body>
</html>