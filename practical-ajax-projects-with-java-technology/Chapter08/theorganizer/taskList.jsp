<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_tasks.gif">
<br><br>

<div class="cssScrollContent">

  <ww:if test="%{!tasks.isEmpty()}">
    <ww:iterator value="tasks">
      <form>
        <input type="hidden" name="createdDT" value="<ww:property
          value="createdDT"/>">
        <input type="image" src="img/edit0.gif" id="edit" align="absmiddle"
          onmouseover="rollover(this);" onmouseout="rollout(this);"
          onclick="taskRetrieve(this.form);return false;">
        &nbsp;
        Subject: <ww:property value="subject" />
      </form>
    </ww:iterator>
  </ww:if>
  <ww:else>
    There are no tasks to display
  </ww:else>

</div>
