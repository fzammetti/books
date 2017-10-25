<%@ taglib prefix="ww" uri="webwork" %>

<img src="img/head_myAccount.gif">
<br><br>

<div class="cssScrollContent">

  <ww:if test="message!=null">
    <div class="cssError"><ww:property value="message" /></div>
  </ww:if>
  <ww:else>
    <div class="cssError">&nbsp;</div>
  </ww:else>

  <ww:form cssClass="cssMain" onsubmit="return false">
    <ww:textfield label="Password" name="password" value="%{password}"
      cssClass="cssInput0"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <ww:textfield label="Re-Enter Password" name="password_2"
      value="%{password_2}" cssClass="cssInput0"
      onfocus="this.className='cssInput1';"
      onblur="this.className='cssInput0';" />
    <ww:submit type="image" src="img/save0.gif" id="save"
      onmouseover="rollover(this, 'save');"
      onmouseout="rollout(this, 'save');"
      onclick="accountUpdate(this.form);return false;" />
    <ww:submit type="image" src="img/delete0.gif" id="delete"
      onmouseover="rollover(this, 'delete');"
      onmouseout="rollout(this, 'delete');"
      onclick="accountDelete(this.form);return false;" />
  </ww:form>

</div>
