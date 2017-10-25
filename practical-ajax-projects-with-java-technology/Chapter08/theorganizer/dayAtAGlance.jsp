<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_dayAtAGlance.gif">
<br><br>

<div class="cssScrollContent">

  <div class="cssDAAGHeading">Tasks due today:</div>
  <ww:if test="%{!tasks.isEmpty()}">
    <ww:iterator value="tasks">
      <form>
        <input type="hidden" name="createdDT" value="<ww:property
          value="createdDT"/>">
        <table border="0" cellpadding="0" cellspacing="0" class="cssDAAGItem">
          <tr>
            <td width="1">
              <input type="image" src="img/edit0.gif" id="edit"
                align="absmiddle" onmouseover="rollover(this);"
                onmouseout="rollout(this);"
                onclick="taskRetrieve(this.form);return false;">
            </td>
            <td width="10">&nbsp;</td>
            <td>
              Subject: <ww:property value="subject" />
            </td>
          </tr>
        </table>
      </form>
    </ww:iterator>
  </ww:if>
  <ww:else>
    There are no tasks to display
  </ww:else>

  <br><br><br>

  <div class="cssDAAGHeading">Appointments for today:</div>
  <ww:if test="%{!appointments.isEmpty()}">
    <ww:iterator value="appointments">
      <form>
        <input type="hidden" name="createdDT" value="<ww:property
          value="createdDT"/>">
        <table border="0" cellpadding="0" cellspacing="0" class="cssMain">
          <tr>
            <td width="1">
              <input type="image" src="img/edit0.gif" id="edit"
                align="absmiddle" onmouseover="rollover(this);"
                onmouseout="rollout(this);"
                onclick="appointmentRetrieve(this.form);return false;">
            </td>
            <td width="10">&nbsp;</td>
            <td>
              Subject: <ww:property value="subject" />
              <br>
              Time:
              <ww:property value="startTime" />
              -
              <ww:property value="endTime" />
              <br>
              Location: <ww:property value="location" />
            </td>
          </tr>
        </table>
      </form>
    </ww:iterator>
  </ww:if>
  <ww:else>
    There are no appointments to display for today
  </ww:else>

</div>
