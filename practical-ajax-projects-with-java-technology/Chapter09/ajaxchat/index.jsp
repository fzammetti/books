<%@ taglib prefix="html" uri="http://jakarta.apache.org/struts/tags-html" %>
<%@ taglib prefix="bean" uri="http://jakarta.apache.org/struts/tags-bean" %>
<%@ taglib prefix="logic" uri="http://jakarta.apache.org/struts/tags-logic" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>

<html>

<head>

  <link rel="stylesheet" href="css/styles.css" type="text/css">
  <title><fmt:message key="messages.appTitle" /></title>

</head>

<body class="cssMain" onLoad="LoginActionForm.username.focus();">

  <div class="cssHeading"><fmt:message key="messages.appTitle" /></div>
  <div class="cssAppVersion"><fmt:message key="app.version" /></div>
  <hr/><br/>

  <fmt:message key="messages.welcomeBlock1" />
  <br/><br/>

  <fmt:message key="messages.welcomeBlock2" />
  <br/><br/>

  <logic:messagesPresent>
    <font color="#ff0000">
      <html:messages id="error">
        <bean:write name="error" />
      </html:messages>
    </font>
    <br/><br/>
  </logic:messagesPresent>

  <html:form action="login">
    <fmt:message key="labels.username" /> <html:text property="username"
        size="25" styleClass="cssUsernameInput" />
    <html:submit styleClass="cssButton">
      <fmt:message key="labels.loginButton" />
    </html:submit>
  </html:form>

</body>

</html>
