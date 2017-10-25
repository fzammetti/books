<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_notes.gif">
<br><br>

<div class="cssDAAGHeading">
<%
  String requestURI = (String)request.getAttribute("webwork.request_uri");
  requestURI = requestURI.toLowerCase();
  if (requestURI.indexOf("create") != -1) {
    out.println("Create Note:");
  } else {
    out.println("Edit Note:");
  }
%>
</div>
<br>

<div class="cssScrollContent">

  <ww:form cssClass="cssMain" onsubmit="return false">
    <ww:hidden name="createdDT" value="%{note.createdDT}" />
    <ww:textfield label="Subject" name="subject" value="%{note.subject}"
      cssClass="cssInput0" maxlength="100" size="52"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <ww:textarea label="Text" cols="49" rows="15" name="text"
      value="%{note.text}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <% if (((String)request.getAttribute(
         "webwork.request_uri")).indexOf("noteCreate") != -1) { // Create %>
      <ww:submit type="image" src="img/save0.gif" id="save"
        onmouseover="rollover(this, 'save');"
        onmouseout="rollout(this, 'save');"
        onclick="noteCreate(this.form);return false;" />
    <% } else { // Edit %>
      <ww:submit type="image" src="img/save0.gif" id="save"
        onmouseover="rollover(this, 'save');"
        onmouseout="rollout(this, 'save');"
        onclick="noteUpdate(this.form);return false;" />
      <ww:submit type="image" src="img/delete0.gif" id="delete"
        onmouseover="rollover(this, 'delete');"
        onmouseout="rollout(this, 'delete');"
        onclick="noteDelete(this.form);return false;" />
    <% } %>
  </ww:form>

</div>
