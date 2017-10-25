<%@ taglib prefix="ww" uri="webwork" %>

<ww:if test="view.equalsIgnoreCase('day')">
  <img src="img/head_dayView.gif">
</ww:if>
<ww:if test="view.equalsIgnoreCase('week')">
  <img src="img/head_weekView.gif">
</ww:if>
<ww:if test="view.equalsIgnoreCase('month')">
  <img src="img/head_monthView.gif">
</ww:if>
<ww:if test="view.equalsIgnoreCase('year')">
  <img src="img/head_yearView.gif">
</ww:if>
  <br><br>

<div class="cssScrollContent">

  <ww:if test="%{!appointments.isEmpty()}">
    <ww:iterator value="appointments">
      <form>
        <input type="hidden" name="createdDT" value="<ww:property
          value="createdDT"/>">
        <table border="0" cellpadding="0" cellspacing="0" class="cssMain">
          <tr>
            <td>
              <input type="image" src="img/edit0.gif" id="edit"
                align="absmiddle" onmouseover="rollover(this);"
                onmouseout="rollout(this);"
                onclick="appointmentRetrieve(this.form);return false;">
            </td>
            <td width="10">&nbsp;</td>
            <td>
              Date: <ww:property value="appointmentDate" />
              <br>
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
