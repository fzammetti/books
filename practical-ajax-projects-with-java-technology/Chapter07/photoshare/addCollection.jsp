<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<html>
  <head>
    <title>PhotoShare - Add Collection</title>
    <!-- Link in stylesheet. -->
    <link rel="stylesheet" href="css/styles.css" type="text/css">
    <script>
      function init() {
        // If this document was loaded as a result of just successfully adding
        // a collection, we need to update the collection list dropdown.
        if ("<c:out value='${message}'/>".indexOf("added") != -1) {
          opener.window.top.fraMain.updateCollectionsList();
        }
      }
    </script>
  </head>
  <body onLoad="init();" class="cssMain">
  <div class="cssMessage"><c:out value="${message}"/><br><br></div>
  <form name="addCollectionForm" method="post" action="addCollection.action">
    <table border="0" cellpadding="0" cellspacing="0" class="cssMain">
      <tr>
        <td>Collection Name:&nbsp;</td>
        <td>
          <input type="text" size="24" name="name" 
            value="<c:out value="${param.name}"/>">
        </td>
      </tr>
      <tr>
        <td>Your Name:&nbsp;</td>
        <td>
          <input type="text" size="24" name="creator" 
            value="<c:out value="${param.creator}"/>">
        </td>
      </tr>
      <tr><td colspan="2">&nbsp;</td></tr>
      <tr>
        <td colspan="2"><input type="submit" value="Add Collection"></td>
      </tr>
    </table>
  <form>
  <br>
  <p align="right">
    <input type="button" value="Close Window" onClick="window.close();">
  </p>
  </body>
</html>
