/**
 * jscript.datetime package
 *
 * This package contains utility functions for working with dates and times.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.datetime = function() { }


/**
 * This function will return the number of days in a given month and year,
 * taking leap years into account.
 *
 * @param  inMonth The month, where January = 1 and December = 12.
 * @param  inYear  The year to check the month in.
 * @return         The number of days in the specified month and year.
 */
jscript.datetime.getNumberDaysInMonth = function(inMonth, inYear) {

  inMonth = inMonth - 1;
  var leap_year = this.isLeapYear(inYear);
  if (leap_year) {
    leap_year = 1;
  } else {
    leap_year = 0;
  }
  if (inMonth == 3 || inMonth == 5 || inMonth == 8 || inMonth == 10) {
    return 30;
  } else if (inMonth == 1) {
    return 28 + leap_year;
  } else {
    return 31;
  }

} // End getNumberDaysInMonth().


/**
 * This function will determine if a given year is a leap year.
 *
 * @param  inYear The year to check.
 * @return        True if inYear is a leap year, false if not.
 */
jscript.datetime.isLeapYear = function(inYear) {

  if ((inYear % 4 == 0 && !(inYear % 100 == 0)) || inYear % 400 == 0) {
    return true;
  } else {
    return false;
  }

} // End isLeapYear().
