/**
 * This validator checks to be sure something was entered in a required field.
 */
function RequiredValidator() {

  this.validate = function() {

    var retVal = true;
    if (this.field.value == "") {
      retVal = false;
    }
    return retVal;

  } // End validate().

} // End RequiredValidator().

// RequiredValidator extends JSValidatorValidatorImpl.
RequiredValidator.prototype = new JSValidatorValidatorImpl;


/**
 * This validator applies a regex expression to a field value and returned
 * whether the value matches the regex or not.
 */
function RegexValidator() {

  this.validate = function() {

    var retVal = true;
    var parm = this.fieldConfig.getParam("regex");
    var regx = parm.getValue();
    if (!this.field.value.match(regx)) {
      retVal = false;
    }
    return retVal;

  } // End validate().

} // End RegexValidator().

// RegexValidator extends JSValidatorValidatorImpl.
RegexValidator.prototype = new JSValidatorValidatorImpl;


/**
 * This validator ensures an entry has a minimum length.
 */
function MinLengthValidator() {

  this.validate = function() {

    var retVal = true;
    if (this.field.value.length <
      this.fieldConfig.getParam("minLength").getValue()) {
      retVal = false;
    }
    return retVal;

  } // End validate().

} // End MinLengthValidator().

// MinLengthValidator extends JSValidatorValidatorImpl.
MinLengthValidator.prototype = new JSValidatorValidatorImpl;
