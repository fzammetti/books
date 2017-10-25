<html>
  <head>
    <title>PhotoShare - Control</title>
    <!-- Link in stylesheet. -->
    <link rel="stylesheet" href="css/styles.css" type="text/css">
    <script>
      // Preload all images for buttons in this frame.
      var add_collection_0 = new Image();
      add_collection_0.src = "img/add_collection_0.gif";
      var add_collection_1 = new Image();
      add_collection_1.src = "img/add_collection_1.gif";
      var delete_collection_0 = new Image();
      delete_collection_0.src = "img/delete_collection_0.gif";
      var delete_collection_1 = new Image();
      delete_collection_1.src = "img/delete_collection_1.gif";
      var add_photo_0 = new Image();
      add_photo_0.src = "img/add_photo_0.gif";
      var add_photo_1 = new Image();
      add_photo_1.src = "img/add_photo_1.gif";
      var delete_photo_0 = new Image();
      delete_photo_0.src = "img/delete_photo_0.gif";
      var delete_photo_1 = new Image();
      delete_photo_1.src = "img/delete_photo_1.gif";
      var print_0 = new Image();
      print_0.src = "img/print_0.gif";
      var print_1 = new Image();
      print_1.src = "img/print_1.gif";
      var download_0 = new Image();
      download_0.src = "img/download_0.gif";
      var download_1 = new Image();
      download_1.src = "img/download_1.gif";
      var rotate_0 = new Image();
      rotate_0.src = "img/rotate_0.gif";
      var rotate_1 = new Image();
      rotate_1.src = "img/rotate_1.gif";
      var actual_size_0 = new Image();
      actual_size_0.src = "img/actual_size_0.gif";
      var actual_size_1 = new Image();
      actual_size_1.src = "img/actual_size_1.gif";
      var default_size_0 = new Image();
      default_size_0.src = "img/default_size_0.gif";
      var default_size_1 = new Image();
      default_size_1.src = "img/default_size_1.gif";
    </script>
  </head>
  <body class="cssMain">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0"
      border="0" class="cssMain"><tr>
      <td width="140" align="left" valign="top">
        Collection:<br>
        <span id="spnCollectionsList">
          <select id="collectionsList" class="cssMain"></select>
        </span>
      </td>
      <td align="center" valign="middle">
        <input type="image" src="img/add_collection_0.gif"
          id="btnAddCollection"
          onMouseOver="this.src=add_collection_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=add_collection_0.src;this.style.cursor='normal';">
        <input type="image" src="img/delete_collection_0.gif"
          id="btnDeleteCollection"
          onMouseOver="this.src=delete_collection_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=delete_collection_0.src;this.style.cursor='normal';">
        <input type="image" src="img/add_photo_0.gif" id="btnAddPhoto"
          onMouseOver="this.src=add_photo_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=add_photo_0.src;this.style.cursor='normal';">
        <input type="image" src="img/delete_photo_0.gif" id="btnDeletePhoto"
          onMouseOver="this.src=delete_photo_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=delete_photo_0.src;this.style.cursor='normal';">
        <input type="image" src="img/print_0.gif" id="btnPrintPhoto"
          onMouseOver="this.src=print_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=print_0.src;this.style.cursor='normal';">
        <input type="image" src="img/download_0.gif" id="btnDownloadPhoto"
          onMouseOver="this.src=download_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=download_0.src;this.style.cursor='normal';">
        <input type="image" src="img/rotate_0.gif" id="btnRotatePhoto"
          onMouseOver="this.src=rotate_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=rotate_0.src;this.style.cursor='normal';">
        <input type="image" src="img/actual_size_0.gif" id="btnActualSize"
          onMouseOver="this.src=actual_size_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=actual_size_0.src;this.style.cursor='normal';">
        <input type="image" src="img/default_size_0.gif" id="btnDefaultSize"
          onMouseOver="this.src=default_size_1.src;this.style.cursor='pointer';"
          onMouseOut="this.src=default_size_0.src;this.style.cursor='normal';">
      </td>
    </tr></table>
  </body>
</html>