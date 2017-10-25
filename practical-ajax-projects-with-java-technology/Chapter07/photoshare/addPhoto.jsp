<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<html>
  <head>
    <title>PhotoShare - Add Photo</title>
    <!-- Link in stylesheet. -->
    <link rel="stylesheet" href="css/styles.css" type="text/css">
    <script>
      function init() {
        // Set the value of the hidden form field that contains the collection
        // name to that of the selected collection in the dropdown.
        document.getElementById("hiddenCollection").value =
          opener.window.top.fraControl.document.getElementById(
            "collectionsList").value;
        // If this document was loaded as a result of just successfully adding
        // a photo, we need to reload the collection.
        if ("<c:out value='${message}'/>".indexOf("added") != -1) {
          opener.window.top.fraMain.loadCollection();
        }
      }
    </script>
  </head>
  <body onLoad="init();"  class="cssMain">
  <div class="cssMessage"><c:out value="${message}"/><br><br></div>
  <form name="addPhotoForm" enctype="multipart/form-data" method="post"
    action="addPhoto.action">
    <input type="hidden" id="hiddenCollection" name="collection">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" 
      class="cssMain">
      <tr>
        <td colspan="2">Photo Description:&nbsp;</td>
      </td>
      <tr>
        <td colspan="2">
          <textarea name="description" cols="69" rows="10">
            <c:out value="${param.description}"/>
          </textarea>
        </td>
      </tr>
      <tr>
        <td>Your Name:&nbsp;</td>
          <td align="left">
            <input type="text" name="adder" 
              value="<c:out value="${param.adder}"/>">
          </td>
      </tr>
      <tr>
        <td>Photo To Upload:&nbsp;</td>
        <td align="left"><input type="file" name="photo"></td>
      </tr>
      <tr><td colspan="2">&nbsp;</td></tr>
      <tr>
        <td colspan="2"><input type="submit" value="Add Photo"></td>
      </tr>
    </table>
  <form>
  <br>
  <p align="right">
    <input type="button" value="Close Window" onClick="window.close();">
  </p>
  </body>
</html>
