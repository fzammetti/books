<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_contacts.gif">
<br><br>

<div class="cssDAAGHeading">
<%
  String requestURI = (String)request.getAttribute("webwork.request_uri");
  requestURI = requestURI.toLowerCase();
  if (requestURI.indexOf("create") != -1) {
    out.println("Create Contact:");
  } else {
    out.println("Edit Contact:");
  }
%>
</div>
<br>

<div class="cssScrollContent">

  <ww:form cssClass="cssMain" onsubmit="return false">
    <ww:hidden name="createdDT" value="%{contact.createdDT}" />
    <ww:textfield label="First Name" name="firstName"
      value="%{contact.firstName}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="25" size="26"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Middle Name" name="middleName"
      value="%{contact.middleName}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="25" size="26"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Last Name" name="lastName"
      value="%{contact.lastName}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="25" size="26"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Home Phone" name="homePhone"
      value="%{contact.homePhone}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Home Address 1" name="homeAddress1"
      value="%{contact.homeAddress1}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Home Address 2" name="homeAddress2"
      value="%{contact.homeAddress2}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Home Address 3" name="homeAddress3"
      value="%{contact.homeAddress3}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Home Address 4" name="homeAddress4"
      value="%{contact.homeAddress4}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Personal eMail" name="personalEMail"
      value="%{contact.personalEMail}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Personal IM" name="personalIM"
      value="%{contact.personalIM}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Personal FAX" name="personalFAX"
      value="%{contact.personalFAX}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Personal Cell" name="personalCell"
      value="%{contact.personalCell}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Personal Pager" name="personalPager"
      value="%{contact.personalPager}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Spouse" name="spouse"
      value="%{contact.spouse}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #1" name="child1"
      value="%{contact.child1}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #2" name="child2"
      value="%{contact.child2}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #3" name="child3"
      value="%{contact.child3}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #4" name="child4"
      value="%{contact.child4}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #5" name="child5"
      value="%{contact.child5}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #6" name="child6"
      value="%{contact.child6}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #7" name="child7"
      value="%{contact.child7}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Child #8" name="child8"
      value="%{contact.child8}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Company" name="company"
      value="%{contact.company}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="75" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Title" name="title"
      value="%{contact.title}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="75" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Department" name="department"
      value="%{contact.department}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="75" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work Phone" name="workPhone"
      value="%{contact.workPhone}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work Address 1" name="workAddress1"
      value="%{contact.workAddress1}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work Address 2" name="workAddress2"
      value="%{contact.workAddress2}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work Address 3" name="workAddress3"
      value="%{contact.workAddress3}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work Address 4" name="workAddress4"
      value="%{contact.workAddress4}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work eMail" name="workEMail"
      value="%{contact.workEMail}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work IM" name="workIM"
      value="%{contact.workIM}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work FAX" name="workFAX"
      value="%{contact.workFAX}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work Cell" name="workCell"
      value="%{contact.workCell}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Work Pager" name="workPager"
      value="%{contact.workPager}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Assistant" name="assistant"
      value="%{contact.assistant}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Manager" name="manager"
      value="%{contact.manager}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other Phone" name="otherPhone"
      value="%{contact.otherPhone}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other Address 1" name="otherAddress1"
      value="%{contact.otherAddress1}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other Address 2" name="otherAddress2"
      value="%{contact.otherAddress2}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="other Address 3" name="otherAddress3"
      value="%{contact.otherAddress3}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="other Address 4" name="otherAddress4"
      value="%{contact.otherAddress4}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other eMail" name="otherEMail"
      value="%{contact.otherEMail}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="100" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other IM" name="otherIM"
      value="%{contact.otherIM}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="50" size="42"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other FAX" name="otherFAX"
      value="%{contact.otherFAX}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other Cell" name="otherCell"
      value="%{contact.otherCell}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Other Pager" name="otherPager"
      value="%{contact.otherPager}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';" maxlength="15" size="16"
      onblur="this.className='cssInput0';" />
    <ww:textarea label="Comments" cols="39" rows="15" name="comments"
      value="%{contact.comments}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <% if (((String)request.getAttribute(
         "webwork.request_uri")).indexOf("contactCreate") != -1) { // Create %>
      <ww:submit type="image" src="img/save0.gif" id="save"
        onmouseover="rollover(this, 'save');"
        onmouseout="rollout(this, 'save');"
        onclick="contactCreate(this.form);return false;" />
    <% } else { %>
      <ww:submit type="image" src="img/save0.gif" id="save"
        onmouseover="rollover(this, 'save');"
        onmouseout="rollout(this, 'save');"
        onclick="contactUpdate(this.form);return false;" />
      <ww:submit type="image" src="img/delete0.gif" id="delete"
        onmouseover="rollover(this, 'delete');"
        onmouseout="rollout(this, 'delete');"
        onclick="contactDelete(this.form);return false;" />
    <% } %>
  </ww:form>

</div>
