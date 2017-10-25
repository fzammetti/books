<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_notes.gif">
<br><br>

<div class="cssScrollContent">

  <ww:if test="%{!notes.isEmpty()}">
    <ww:iterator value="notes">
      <form>
        <input type="hidden" name="createdDT" value="<ww:property
          value="createdDT"/>">
        <input type="image" src="img/edit0.gif" id="edit" align="absmiddle"
          onmouseover="rollover(this);" onmouseout="rollout(this);"
          onclick="noteRetrieve(this.form);return false;">
        &nbsp;
        Subject: <ww:property value="subject" />
      </form>
    </ww:iterator>
  </ww:if>
  <ww:else>
    There are no notes to display
  </ww:else>

</div>