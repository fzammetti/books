/**
 * This validator checks to be sure a string is in the valid date form
 * MM/DD/YYYY and that each of the components is a valid value.
 */
function DateValidator() {

  this.validate = function() {

    // Get the configured format of the field.
    var format = this.fieldConfig.getParam("format").getValue();

    // Make sure the value is the same length as the format.
    if (this.field.value.length != format.length) {
      return false;
    }

    // Now iterate over the value.  If any character doesn't match the format,
    // it's a reject.  Note that M, D and Y characters in the format
    // correlate to any numeric character.
    for (var i = 0; i < format.length; i++) {
      if (format.charAt(i).toUpperCase() == "M" ||
        format.charAt(i).toUpperCase() == "D" ||
        format.charAt(i).toUpperCase() == "Y") {
        // Character at this position should be a numeric.
        if (this.field.value.charAt(i) < '0' ||
          this.field.value.charAt(i) > '9') {
          return false;
        }
      } else {
        // Format doesn't specify a numeric value at this position, so just
        // be sure the character mathes exactly.
        if (format.charAt(i) != this.field.value.charAt(i)) {
          return false;
        }
      }
    }

    return true;

  } // End validate().

} // End DateValidator().

// DateValidator extends JSValidatorValidatorImpl.
DateValidator.prototype = new JSValidatorValidatorImpl;
