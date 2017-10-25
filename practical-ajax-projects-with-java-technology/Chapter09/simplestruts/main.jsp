<%@ taglib prefix="html" uri="http://jakarta.apache.org/struts/tags-html" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<html:html>
  <head>
    <title><fmt:message key="title" /></title>
  </head>
  <style>
    .cssEntryPrompt {
      font-family         : sans-serif;
      font-size           : 14pt;
      font-style          : italic;
      font-weight         : bold;
    }
    .cssLabel {
      font-family         : sans-serif;
      font-size           : 12pt;
      background-color    : #f0f0f0;
    }
    .cssText {
      font-family         : sans-serif;
      font-size           : 12pt;
      background-color    : #ffff00;
    }
    .cssBtn{
      color               : #050;
      font-family         : sans-serif;
      font-size           : 84%;
      font-weight         : bold;
      background-color    : #fed;
      border              : 1px solid;
      border-top-color    : #696;
      border-left-color   : #696;
      border-right-color  : #363;
      border-bottom-color : #363;
    }
  </style>
  <body>
    <div class="cssEntryPrompt"><fmt:message key="entryPrompt" /></div>
    <br>
    <html:form action="/greetPerson.do">
      <table border="0" cellpadding="2" cellspacing="2">
        <tr>
          <td class="cssLabel"><fmt:message key="firstNamePrompt" />&nbsp;</td>
          <td class="cssText"><html:text property="firstName" /></td>
        </tr>
        <tr>
          <td class="cssLabel"><fmt:message key="lastNamePrompt" />&nbsp;</td>
          <td class="cssText"><html:text property="lastName" /></td>
        </tr>
        <tr>
          <td colspan="2" align="right"><html:submit styleClass="cssBtn"/></td>
        </tr>
      </table>
    </html:form>
  </body>
</html:html>
