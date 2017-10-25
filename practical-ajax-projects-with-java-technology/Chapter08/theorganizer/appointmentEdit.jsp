<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_appointments.gif">
<br><br>

<div class="cssDAAGHeading">
<%
  String requestURI = (String)request.getAttribute("webwork.request_uri");
  requestURI = requestURI.toLowerCase();
  if (requestURI.indexOf("create") != -1) {
    out.println("Create Appointment:");
  } else {
    out.println("Edit Appointment:");
  }
%>
</div>
<br>

<div class="cssScrollContent">

  <ww:form cssClass="cssMain" onsubmit="return false">
    <ww:hidden name="createdDT" value="%{appointment.createdDT}" />
    <ww:hidden name="appointmentDate" value="%{appointment.appointmentDate}" />
    <ww:hidden name="startTime" value="%{appointment.startTime}"/>
    <ww:hidden name="endTime" value="%{appointment.endTime}" />
    <ww:textfield label="Subject" name="subject" maxlength="100" size="40"
      value="%{appointment.subject}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Location" name="location" maxlength="100" size="40"
      value="%{appointment.location}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <tr>
      <td><label>Appointment Date:</label></td>
      <td>
        <ww:select name="appointmentDateMonth" theme="simple"
          list="#{'':'', '01':'January', '02':'February', '03':'March',
          '04':'April', '05':'May', '06':'June', '07':'July', '08':'August',
          '09':'September', '10':'October', '11':'November',
          '12':'December'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
        &nbsp;
        <ww:select name="appointmentDateDay" theme="simple"
          list="#{'':'', '01':'01', '02':'02', '03':'03', '04':'04', '05':'05',
          '06':'06', '07':'07', '08':'08', '09':'09', '10':'10', '11':'11',
          '12':'12', '13':'13', '14':'14', '15':'15', '16':'16', '17':'17',
          '18':'18', '19':'19', '20':'20', '21':'21', '22':'22', '23':'23',
          '24':'24', '25':'25', '26':'26', '27':'27', '28':'28', '29':'29',
          '30':'30', '31':'31'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
        &nbsp;
        <ww:select name="appointmentDateYear" theme="simple"
          list="#{'':'', '2006':'2006', '2007':'2007', '2008':'2008',
          '2009':'2009', '2010':'2010', '2011':'2011', '2012':'2012',
          '2013':'2013', '2014':'2014', '2015':'2015', '2016':'2016',
          '2017':'2017', '2018':'2018', '2019':'2019', '2020':'2020'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
      </td>
    </tr>
    <tr>
      <td><label>Start Time:</label></td>
      <td>
        <ww:select name="startTimeHour" theme="simple"
          list="#{'':'', '1':'1', '2':'2', '3':'3', '4':'4', '5':'5',
          '6':'6', '7':'7', '8':'8', '9':'9', '10':'10', '11':'11',
          '12':'12'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
        &nbsp;
        <ww:select name="startTimeMinute" theme="simple"
          list="#{'':'', '00':'00', '30':'30'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
        &nbsp;
        <ww:select name="startTimeAMPM" theme="simple"
          list="#{'':'', 'AM':'AM', 'PM':'PM'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
      </td>
    </tr>

    <tr>
      <td><label>End Time:</label></td>
      <td>
        <ww:select name="endTimeHour" theme="simple"
          list="#{'':'', '1':'1', '2':'2', '3':'3', '4':'4', '5':'5',
          '6':'6', '7':'7', '8':'8', '9':'9', '10':'10', '11':'11',
          '12':'12'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
        &nbsp;
        <ww:select name="endTimeMinute" theme="simple"
          list="#{'':'', '00':'00', '30':'30'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
        &nbsp;
        <ww:select name="endTimeAMPM" theme="simple"
          list="#{'':'', 'AM':'AM', 'PM':'PM'}"
          cssClass="cssInput0"
          onfocus="this.className='cssInput1';"
          onblur="this.className='cssInput0';" />
      </td>
    </tr>
    <ww:textarea label="Comments" cols="38" rows="15" name="comments"
      value="%{appointment.comments}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <% if (((String)request.getAttribute(
         "webwork.request_uri")).indexOf("appointmentCreate") != -1) {
         // Create %>
      <ww:submit type="image" src="img/save0.gif" id="save"
        onmouseover="rollover(this, 'save');"
        onmouseout="rollout(this, 'save');"
        onclick="appointmentCreate(this.form);return false;" />
    <% } else { %>
      <ww:submit type="image" src="img/save0.gif" id="save"
        onmouseover="rollover(this, 'save');"
        onmouseout="rollout(this, 'save');"
        onclick="appointmentUpdate(this.form);return false;" />
      <ww:submit type="image" src="img/delete0.gif" id="delete"
        onmouseover="rollover(this, 'delete');"
        onmouseout="rollout(this, 'delete');"
        onclick="appointmentDelete(this.form);return false;" />
    <% } %>
  </ww:form>

</div>
