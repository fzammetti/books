<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_contacts.gif">
<br><br>

<div class="cssScrollContent">

  <ww:if test="%{!contacts.isEmpty()}">
    <ww:iterator value="contacts">
      <form>
        <input type="hidden" name="createdDT" value="<ww:property
          value="createdDT"/>">
        <input type="image" src="img/edit0.gif" id="edit" align="absmiddle"
          onmouseover="rollover(this);" onmouseout="rollout(this);"
          onclick="contactRetrieve(this.form);return false;">
        &nbsp;
        Name: <ww:property value="lastName" />, <ww:property value="firstName" />
      </form>
    </ww:iterator>
  </ww:if>
  <ww:else>
    There are no contacts to display
  </ww:else>

</div>
