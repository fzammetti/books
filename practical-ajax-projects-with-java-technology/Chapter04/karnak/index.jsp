<%@ taglib prefix="ajax" uri="javawebparts/taglib/ajaxtags" %>

<html>
  <head>
    <title>Karnak: Type-Ahead Suggestions</title>
    <link rel="StyleSheet" href="css/styles.css" type="text/css" media="screen">
  </head>

  <body background="img/background.jpg">
    <h2>Practical Ajax Projects With Java</h2>
    <hr width="100%">
    <br><br>
    <center>
      <h2>
        <img src="img/karnak.gif" align="center" hspace="10"
          width="123" height="160">
        <img src="img/title.gif">
      </h2>
      <br>
      <div style="font-size:16pt;font-weight:bold;font-style:italic;">
        As you type, Karnak will offer suggestions.  Click a suggestion to
        fill in the textbox.
      </div>
      <br><br>
      <form name="TypeAheadSuggestionsForm" onSubmit="return false;">
        <input type="text" name="enteredTextbox" class="cssUserInput"
        style="width:300px;"><ajax:event ajaxRef="TypeAheadSuggestionsForm/enteredTextChange"/>
        <br>
        <div id="suggestions" class="cssSuggestionsDiv"></div>
      </form>
    </center>
  </body>

</html>
<ajax:enable />
