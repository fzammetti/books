<html>
  <head>
    <title>advanceddwr</title>
    <script type="text/javascript" src="dwr/interface/URLReader.js"></script>
    <script type="text/javascript" src="dwr/engine.js"></script>
    <script>
      function readURL() {
        URLReader.read(
          {
            callback : function(inResp) {
              document.getElementById("divURL").innerHTML = inResp;
            }
          }
        );
      }
    </script>
  </head>
  <body>
    <input type="button" value="Click to read from another URL"
      onClick="readURL();">
    <br>
    <div id="divURL"
      style="width:100%;height:300px;border:1px solid #000000;"></div>
  </body>
</html>
