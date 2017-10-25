<html>

  <head>

    <title>The Organizer</title>

    <link rel="stylesheet" href="css/styles.css" type="text/css">

    <script type="text/javascript" src="js/prototype.js"></script>
    <script type="text/javascript" src="js/globals.js"></script>
    <script type="text/javascript" src="js/misc.js"></script>
    <script type="text/javascript" src="js/buttonsAndTabs.js"></script>
    <script type="text/javascript" src="js/notes.js"></script>
    <script type="text/javascript" src="js/tasks.js"></script>
    <script type="text/javascript" src="js/contacts.js"></script>
    <script type="text/javascript" src="js/appointments.js"></script>
    <script type="text/javascript" src="js/account.js"></script>
    <script type="text/javascript" src="js/init.js"></script>

  </head>

  <body onLoad="init();">

    <table border="0" cellpadding="0" cellspacing="0" width="970"
      align="center">
      <tr class="cssTopNav">
        <td height="80" valign="top">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td colspan="2" valign="bottom">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr height="57">
                    <td valign="bottom"><img src="img/spacer.gif" width="5"
                      height="1"><img src="img/dayAtAGlance0.gif"
                      id="dayAtAGlance"
                      onClick="showDayAtAGlance();"
                      onMouseOver="rollover(this);"
                      onMouseOut="rollout(this);"></td>
                    <td valign="bottom"><img src="img/notes0.gif" id="notes"
                      onClick="showNotes();"
                      onMouseOver="rollover(this);"
                      onMouseOut="rollout(this);"></td>
                    <td valign="bottom"><img src="img/tasks0.gif" id="tasks"
                      onClick="showTasks();"
                      onMouseOver="rollover(this);"
                      onMouseOut="rollout(this);"></td>
                    <td valign="bottom"><img src="img/contacts0.gif"
                      id="contacts"
                      onClick="showContacts();"
                      onMouseOver="rollover(this);"
                      onMouseOut="rollout(this);"></td>
                    <td valign="bottom"><img src="img/appointments0.gif"
                      id="appointments"
                      onClick="showAppointments();"
                      onMouseOver="rollover(this);"
                      onMouseOut="rollout(this);"></td>
                    <td valign="bottom"><img src="img/myAccount0.gif"
                      id="myAccount"
                      onClick="showMyAccount();"
                      onMouseOver="rollover(this);"
                      onMouseOut="rollout(this);"></td>
                    <td valign="bottom"><img src="img/logoff0.gif" id="logoff"
                      onClick="logoff();"
                      onMouseOver="rollover(this);"
                      onMouseOut="rollout(this);"></td>
                  </tr>
                </table>
              </td>
              <td align="center" valign="top">
                <img src="img/logo.gif">
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td valign="top">
          <table border="0" cellpadding="0" cellspacing="0" width="770">
            <tr>
              <td class="cssSideNav" valign="top" width="130">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="top">
                      <div align="center">
                        <table border="0" cellpadding="0" cellspacing="0"
                          class="cssSideNav">
                          <tr><td>
                            <img src="img/spacer.gif" width="1" height="6">
                            <img src="img/newNote0.gif" vspace="4"
                              id="newNote" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <img src="img/newTask0.gif" vspace="4"
                              id="newTask" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <img src="img/newContact0.gif" vspace="4"
                              id="newContact" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <img src="img/newAppointment0.gif" vspace="4"
                              id="newAppointment" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <img src="img/dayView0.gif" vspace="4"
                              id="dayView" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <img src="img/weekView0.gif" vspace="4"
                              id="weekView" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <img src="img/monthView0.gif" vspace="4"
                              id="monthView" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <img src="img/yearView0.gif" vspace="4"
                              id="yearView" style="display:none;"
                              onMouseOver="rollover(this);"
                              onMouseOut="rollout(this);">
                            <br>
                            <div id="dateSelector" style="display:none;">
                              Month:<br>
                              <select class="cssSideNav" id="dsMonth"
                                onChange="dsSelectorChange();"
                                cssClass="cssInput0"
                                onfocus="this.className='cssInput1';"
                                onblur="this.className='cssInput0';">
                                <option value="01">JANUARY</option>
                                <option value="02">FEBRUARY</option>
                                <option value="03">MARCH</option>
                                <option value="04">APRIL</option>
                                <option value="05">MAY</option>
                                <option value="06">JUNE</option>
                                <option value="07">JULY</option>
                                <option value="08">AUGUST</option>
                                <option value="09">SEPTEMBER</option>
                                <option value="10">OCTOBER</option>
                                <option value="11">NOVEMBER</option>
                                <option value="12">DECEMBER</option>
                              </select>
                              <br>
                              Day:<br>
                              <select class="cssSideNav" id="dsDay"
                                onChange="dsSelectorChange();"
                                cssClass="cssInput0"
                                onfocus="this.className='cssInput1';"
                                onblur="this.className='cssInput0';">
                                <option value="01">1</option>
                                <option value="02">2</option>
                                <option value="03">3</option>
                                <option value="04">4</option>
                                <option value="05">5</option>
                                <option value="06">6</option>
                                <option value="07">7</option>
                                <option value="08">8</option>
                                <option value="09">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                                <option value="21">21</option>
                                <option value="22">22</option>
                                <option value="23">23</option>
                                <option value="24">24</option>
                                <option value="25">25</option>
                                <option value="26">26</option>
                                <option value="27">27</option>
                                <option value="28">28</option>
                                <option value="29">29</option>
                                <option value="30">30</option>
                                <option value="31">31</option>
                              </select>
                              <br>
                              Year:<br>
                              <select class="cssSideNav" id="dsYear"
                                onChange="dsSelectorChange();"
                                cssClass="cssInput0"
                                onfocus="this.className='cssInput1';"
                                onblur="this.className='cssInput0';">
                                <option value="2006">2006</option>
                                <option value="2007">2007</option>
                                <option value="2008">2008</option>
                                <option value="2009">2009</option>
                                <option value="2010">2010</option>
                                <option value="2011">2011</option>
                                <option value="2012">2012</option>
                                <option value="2013">2013</option>
                                <option value="2014">2014</option>
                                <option value="2015">2015</option>
                                <option value="2016">2016</option>
                                <option value="2017">2017</option>
                                <option value="2018">2018</option>
                                <option value="2019">2019</option>
                                <option value="2020">2020</option>
                              </select>
                            </div>
                          </td></tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              <td class="cssMain" valign="top">
                <span id="mainContent"></span>
                <span id="pleaseWait">Please wait...</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

  </body>

</html>
