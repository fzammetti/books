/**
 * This array holds the images for all the rollovers.
 */
var rolloverImages = new Array();


/**
 * Flag: Are tabs and buttons enabled?  They will not be during AJAX
 * requests.
 */
var tabsButtonsEnabled = true;


/**
 * This is what view is currently showing.  Valid values are:
 * dayAtAGlance, notes, tasks, contacts, appointments and myAccount.
 */
var currentView = "dayAtAGlance";


/**
 * This is what sub view is currently showing.  This is used for instance in
 * the Appointments view to determine if we are looking at the day view,
 * week view, month view or year view.
 */
var subView = null;