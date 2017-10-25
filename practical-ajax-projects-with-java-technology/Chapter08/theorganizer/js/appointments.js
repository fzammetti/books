/**
 * Called to show the Appointments view.
 */
function showAppointments() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "appointmentList.action", {
      method : "post",
      postBody : "view=day&month=" + $("dsMonth").value +
        "&day=" + $("dsDay").value + "&year=" + $("dsYear").value,
      onSuccess : function(resp) {
        currentView = "appointments";
        subView = "dayView";
        setupSidebarButtons("newAppointment", "dayView", "weekView",
          "monthView", "yearView", "dateSelector");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End showAppointments().


/**
 * Called to show the view for creating a new appointment.
 */
function doNewAppointment() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "appointmentCreateShow.action", {
      method : "post",
      onSuccess : function(resp) {
        subView = null;
        setupSidebarButtons("newAppointment", "dayView", "weekView",
          "monthView", "yearView");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End doNewAppointment().


/**
 * Function called to create a new appointment.
 */
function appointmentCreate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateAppointment(inForm)) {
      showPleaseWait();
      // Populate the three hidden fields from the constituent parts.
      inForm.appointmentDate.value = inForm.appointmentDateMonth.value + "/" +
        inForm.appointmentDateDay.value + "/" +
        inForm.appointmentDateYear.value;
      inForm.startTime.value = inForm.startTimeHour.value + ":" +
        inForm.startTimeMinute.value + inForm.startTimeAMPM.value;
      inForm.endTime.value = inForm.endTimeHour.value + ":" +
        inForm.endTimeMinute.value + inForm.endTimeAMPM.value;
      new Ajax.Updater("mainContent", "appointmentCreate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          setupSidebarButtons("newAppointment", "dayView", "weekView",
            "monthView", "yearView");
          hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End appointmentCreate().


/**
 * Function called to Retrieve an existing appointment for editing.
 */
function appointmentRetrieve(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Request("appointmentRetrieve.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        $("mainContent").innerHTML = resp.responseText;
        // Set the appointment date <select> dropdown.
        locateDDValue($("appointmentRetrieve_appointmentDateMonth"),
          $("appointmentRetrieve_appointmentDate").value.substring(0, 2));
        locateDDValue($("appointmentRetrieve_appointmentDateDay"),
          $("appointmentRetrieve_appointmentDate").value.substring(3, 5));
        locateDDValue($("appointmentRetrieve_appointmentDateYear"),
          $("appointmentRetrieve_appointmentDate").value.substring(6, 10));
        // Set the start time <select> dropdown.
        var startTime = $("appointmentRetrieve_startTime").value;
        var colonIndex = startTime.indexOf(":");
        var hour = startTime.substring(0, colonIndex);
        var minute = startTime.substring(colonIndex + 1, colonIndex + 3);
        var meridian = startTime.substring(startTime.length - 2,
          startTime.length);
        locateDDValue($("appointmentRetrieve_startTimeHour"), hour);
        locateDDValue($("appointmentRetrieve_startTimeMinute"), minute);
        locateDDValue($("appointmentRetrieve_startTimeAMPM"), meridian);
        // Set the end time <select> dropdown.
        var endTime = $("appointmentRetrieve_endTime").value;
        colonIndex = endTime.indexOf(":");
        hour = endTime.substring(0, colonIndex);
        minute = endTime.substring(colonIndex + 1, colonIndex + 3);
        meridian = endTime.substring(endTime.length - 2, endTime.length);
        locateDDValue($("appointmentRetrieve_endTimeHour"), hour);
        locateDDValue($("appointmentRetrieve_endTimeMinute"), minute);
        locateDDValue($("appointmentRetrieve_endTimeAMPM"), meridian);
        subView = null;
        setupSidebarButtons("newAppointment", "dayView", "weekView",
          "monthView", "yearView");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End appointmentRetrieve().


/**
 * Function called to save an updated appointment.
 */
function appointmentUpdate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateAppointment(inForm)) {
      showPleaseWait();
      // Populate the three hidden fields from the constituent parts.
      inForm.appointmentDate.value = inForm.appointmentDateMonth.value + "/" +
        inForm.appointmentDateDay.value + "/" +
        inForm.appointmentDateYear.value;
      inForm.startTime.value = inForm.startTimeHour.value + ":" +
        inForm.startTimeMinute.value + inForm.startTimeAMPM.value;
      inForm.endTime.value = inForm.endTimeHour.value + ":" +
        inForm.endTimeMinute.value + inForm.endTimeAMPM.value;
      new Ajax.Updater("mainContent", "appointmentUpdate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          subView = null;
          setupSidebarButtons("newAppointment", "dayView", "weekView",
            "monthView", "yearView");
          hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End appointmentUpdate().


/**
 * Function called to delete an existing appointment.
 */
function appointmentDelete(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "appointmentDelete.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons("newAppointment", "dayView", "weekView",
          "monthView", "yearView");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End appointmentDelete().


/**
 * Called to show the week view.
 */
function doWeekView() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "appointmentList.action", {
      method : "post",
      postBody : "view=week&month=" + $("dsMonth").value +
        "&day=" + $("dsDay").value + "&year=" + $("dsYear").value,
      onSuccess : function(resp) {
        currentView = "appointments";
        subView = "weekView";
        setupSidebarButtons("newAppointment", "dayView", "weekView",
          "monthView", "yearView", "dateSelector");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End doWeekView().


/**
 * Called to show the month view.
 */
function doMonthView() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "appointmentList.action", {
      method : "post",
      postBody : "view=month&month=" + $("dsMonth").value +
        "&day=" + $("dsDay").value + "&year=" + $("dsYear").value,
      onSuccess : function(resp) {
        currentView = "appointments";
        subView = "monthView";
        setupSidebarButtons("newAppointment", "dayView", "weekView",
          "monthView", "yearView", "dateSelector");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End doMonthView().


/**
 * Called to show the year view.
 */
function doYearView() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "appointmentList.action", {
      method : "post",
      postBody : "view=year&month=" + $("dsMonth").value +
        "&day=" + $("dsDay").value + "&year=" + $("dsYear").value,
      onSuccess : function(resp) {
        currentView = "appointments";
        subView = "yearView";
        setupSidebarButtons("newAppointment", "dayView", "weekView",
          "monthView", "yearView", "dateSelector");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End doYearView().


/**
 * This function is called when any of the fields in the dsSelector are
 * changed.  It updated the appropriate view.
 */
function dsSelectorChange() {

  if (subView == "dayView") {
    showAppointments();
  }
  if (subView == "weekView") {
    doWeekView();
  }
  if (subView == "monthView") {
    doMonthView();
  }
  if (subView == "yearView") {
    doYearView();
  }

} // End dsSelectorChange().


/**
 * This function is called when an appointment is being saved (created or
 * updated) to validate user input.
 */
function validateAppointment(inForm) {

  if (inForm.subject.value == "") {
    alert("You must enter a subject");
    inForm.subject.focus();
    return false;
  }
  if (inForm.appointmentDateMonth.value == "") {
    alert("You must enter a month for the appoinment");
    inForm.appointmentDateMonth.focus();
    return false;
  }
  if (inForm.appointmentDateDay.value == "") {
    alert("You must enter a day for the appoinment");
    inForm.appointmentDateDay.focus();
    return false;
  }
  if (inForm.appointmentDateYear.value == "") {
    alert("You must enter a year for the appoinment");
    inForm.appointmentDateYear.focus();
    return false;
  }
  if (inForm.startTimeHour.value == "") {
    alert("You must enter an hour for the start time");
    inForm.startTimeHour.focus();
    return false;
  }
  if (inForm.startTimeMinute.value == "") {
    alert("You must enter a minute for the start time");
    inForm.startTimeMinute.focus();
    return false;
  }
  if (inForm.startTimeAMPM.value == "") {
    alert("You must enter a meridian (AM/PM) for the start time");
    inForm.startTimeAMPM.focus();
    return false;
  }
  if (inForm.endTimeHour.value == "") {
    alert("You must enter an hour for the end time");
    inForm.endTimeHour.focus();
    return false;
  }
  if (inForm.endTimeMinute.value == "") {
    alert("You must enter a minute for the end time");
    inForm.endTimeMinute.focus();
    return false;
  }
  if (inForm.endTimeAMPM.value == "") {
    alert("You must enter a meridian (AM/PM) for the end time");
    inForm.endTimeAMPM.focus();
    return false;
  }
  return true;

} // End validateAppointment().
