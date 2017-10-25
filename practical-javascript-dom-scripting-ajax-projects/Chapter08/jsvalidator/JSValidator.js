/**
 * ==========================================================================
 * This is the actual JSValidator class where the real action happens.
 * ==========================================================================
 */
function JSValidator() {


  /**
   * This is an instance of the JSValidatorConfig class where all the
   */
  var config = null;


  /**
   * This function must be called to initialize JSValidator.  It is usually
   * called onLoad of the page automatically, but can be called manually if
   * the developers needs the onLoad event.
   */
  this.init = function() {

    // Use Prototype to load the configuration file.
    new Ajax.Request(
      JSVConfig.pathPrefix + JSVConfig.configFile,
      { method: "get", onComplete: this.initCallback }
    );

  } // End init().


  /**
   * This is the AJAX callback function which is called after the config file
   * has been loaded.
   *
   * @param inRequest The request object representing the AJAX call.
   */
  this.initCallback = function(inRequest) {

    var jsDigester = new JSDigester();

    // Create new object when JSValidatorConfig tag encountered.
    jsDigester.addObjectCreate("JSValidatorConfig",
      "JSValidatorConfig");

    // Create new object when JSValidatorConfig/validator tag encountered,
    // populate its properties and add it to the JSValidatorConfig object
    // on the top of the stack.
    jsDigester.addObjectCreate("JSValidatorConfig/validator",
      "JSValidatorValidatorConfig");
    jsDigester.addSetProperties("JSValidatorConfig/validator");
    jsDigester.addSetNext("JSValidatorConfig/validator", "addValidator");

    // Create new object when JSValidatorConfig/message tag encountered,
    // populate its properties and add it to the JSValidatorConfig object
    // on the top of the stack.
    jsDigester.addObjectCreate("JSValidatorConfig/message",
      "JSValidatorMessage");
    jsDigester.addSetProperties("JSValidatorConfig/message");
    jsDigester.addSetNext("JSValidatorConfig/message", "addMessage");

    // Create new object when JSValidatorConfig/form tag encountered,
    // populate its properties and add it to the JSValidatorConfig object
    // on the top of the stack.
    jsDigester.addObjectCreate("JSValidatorConfig/form",
      "JSValidatorForm");
    jsDigester.addSetProperties("JSValidatorConfig/form");
    jsDigester.addSetNext("JSValidatorConfig/form", "addForm");

    // Create new object when JSValidatorConfig/form/validation tag encountered,
    // populate its properties and add it to the JSValidatorForm object
    // on the top of the stack.
    jsDigester.addObjectCreate("JSValidatorConfig/form/validation",
      "JSValidatorFormValidation");
    jsDigester.addSetProperties("JSValidatorConfig/form/validation");
    jsDigester.addSetNext("JSValidatorConfig/form/validation", "addValidation");

    // Create new object when JSValidatorConfig/form/validation/param tag
    // encountered, populate its properties and add it to the
    // JSValidatorFormValidation object on the top of the stack.
    jsDigester.addObjectCreate("JSValidatorConfig/form/validation/param",
      "JSValidatorFormValidationParam");
    jsDigester.addSetProperties("JSValidatorConfig/form/validation/param");
    jsDigester.addSetNext("JSValidatorConfig/form/validation/param",
      "addParam");

    // Parse config.
    config = jsDigester.parse(inRequest.responseText);

    // Add in the basic validators.
    var requiredValidatorConfig = new JSValidatorValidatorConfig();
    requiredValidatorConfig.setId("required");
    requiredValidatorConfig.setSrc("");
    requiredValidatorConfig.setClass("RequiredValidator");
    config.addValidator(requiredValidatorConfig);
    var regexValidatorConfig = new JSValidatorValidatorConfig();
    regexValidatorConfig.setId("regex");
    regexValidatorConfig.setSrc("");
    regexValidatorConfig.setClass("RegexValidator");
    config.addValidator(regexValidatorConfig);
    var minLengthValidatorConfig = new JSValidatorValidatorConfig();
    minLengthValidatorConfig.setId("minLength");
    minLengthValidatorConfig.setSrc("");
    minLengthValidatorConfig.setClass("MinLengthValidator");
    config.addValidator(minLengthValidatorConfig);

    // Add includes for external validators.
    var configuredValidators = config.getValidators();
    for (var validatorID in configuredValidators) {
      var nextValidatorConfig = configuredValidators[validatorID];
      // Only non-basic validators will have a src value specified.
      if (nextValidatorConfig.getSrc() != "") {
        var scriptTag = document.createElement("script");
        scriptTag.src = nextValidatorConfig.getSrc();
        var headTag = document.getElementsByTagName("head").item(0);
        headTag.appendChild(scriptTag);
      }
    }

    // Attach event handlers to fields as defined in config file.
    var configuredForms = config.getForms();
    // Iterate over forms configured.
    for (var formName in configuredForms) {
      var nextFormConfig = configuredForms[formName];
      // Get reference to form being configured.
      var targetForm = document.forms[nextFormConfig.getName()];
      // Attach an onSubmit handler to check if it can submit or not.
      targetForm.onsubmit = jsValidator.processSubmit;
      // Get reference for all validations configured for this form.
      var formValidations = nextFormConfig.getValidations();
      // Iterate over validations defined for this form.
      for (var fieldName in formValidations) {
        // Get the field validation being hooked.
        var nextValidationConfig = formValidations[fieldName];
        // Get the validator definition.
        var validator = config.getValidator(nextValidationConfig.getType());
        // Get the field to hook event to.
        var targetField = targetForm[nextValidationConfig.getField()];
        // Set attribute if this field is initially invalid. and if the field
        // is configured for the highlight action, then highlight it.
        if (nextValidationConfig.getStartInvalid() &&
          nextValidationConfig.getStartInvalid() == "true") {
          targetField.setAttribute("JSValidator_INVALID", "true");
          if (nextValidationConfig.getFailAction() == "highlight") {
            var idToHighlight =
              nextValidationConfig.getParam("idToHighlight").getValue();
            var errorStyleClass =
              nextValidationConfig.getParam("errorStyleClass").getValue();
            $(idToHighlight).className = errorStyleClass;
          }
        }
        // Set event handler.
        targetField[nextValidationConfig.getEvent()] = jsValidator.processEvent;
      }
    }

  } // End init().


  /**
   * This is the callback function that any hooked events will call.
   */
  this.processEvent = function() {

    // Get reference to form, field and validator config objects for the
    // form element that fired the event that called this callback.
    var formConfig = config.getForm(this.form.name);
    var fieldConfig = formConfig.getValidation(this.name);
    var validatorConfig = config.getValidator(fieldConfig.getType());

    // Get a reference to the class that implements the validator defined
    // for this field.  Then, get a new instance of it and call its validate()
    // method.
    var clazz = eval(validatorConfig.getClass());
    clazz = new clazz;
    clazz.setJsValidatorConfig(config);
    clazz.setFieldConfig(fieldConfig);
    clazz.setValidatorConfig(validatorConfig);
    clazz.setField(this);
    // Perform the appropriate action for pass and fail.
    var isValid = clazz.validate();
    if (isValid) {
      // When field was valid, might be some cleanup to do in some cases.
      this.removeAttribute("JSValidator_INVALID");
      if (fieldConfig.getFailAction() == "highlight") {
        var idToHighlight = fieldConfig.getParam("idToHighlight").getValue();
        var okStyleClass =
          fieldConfig.getParam("okStyleClass").getValue();
        $(idToHighlight).className = okStyleClass;
      }
      if (fieldConfig.getFailAction() == "insert") {
        var targetID = fieldConfig.getParam("idToInsertInto").getValue();
        $(targetID).innerHTML = "";
      }
    } else {
      // Field NOT valid, so act according to config.
      this.setAttribute("JSValidator_INVALID", "true");
      switch (fieldConfig.getFailAction()) {
        case "alert":
          var whatMessage = fieldConfig.getParam("message");
          var messageConfig =
            jsValidator.getConfig().getMessage(whatMessage.getValue());
          var message = messageConfig.getText();
          message = jsValidator.replaceTokens(message, fieldConfig.getParams());
          alert(message);
        break;
        case "highlight":
          var idToHighlight = fieldConfig.getParam("idToHighlight").getValue();
          var errorStyleClass =
            fieldConfig.getParam("errorStyleClass").getValue();
          $(idToHighlight).className = errorStyleClass;
        break;
        case "insert":
          var whatMessage = fieldConfig.getParam("message");
          var targetID = fieldConfig.getParam("idToInsertInto").getValue();
          var messageConfig =
            jsValidator.getConfig().getMessage(whatMessage.getValue());
          var message = messageConfig.getText();
          message = jsValidator.replaceTokens(message, fieldConfig.getParams());
          $(targetID).innerHTML = message;
        break;
      }
    }

    return isValid;

  } // End processEvent().


  /**
   * This is the callback function that will be called when the form is
   * submitted.  If any field in the form has the JSValidator_INVALID
   * attribute, then the form cannot be submitted and the message should be
   * displayed.
   */
  this.processSubmit = function() {

    var formValidity = true;
    // If any element of the form has the JSValidator_INVALID attribute, then
    // the form cannot be submitted.
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].getAttribute("JSValidator_INVALID")) {
        formValidity = false;
      }
    }
    if (!formValidity) {
      // Can't be submitted, show configured message.
      var config = jsValidator.getConfig();
      var formConfig = config.getForm(this.name);
      alert(formConfig.getNoSubmitMessage());
    }
    return formValidity;

  } // End processSubmit().


  /**
   * This returns the JSValidatorConfig instance associated with this instance
   * of JSValidator.
   *
   * @return The JSValidatorConfig instance.
   */
  this.getConfig = function() {

    return config;

  } // End getConfig().


  /**
   * Replaces all the tokens in a string with values from the given collection
   * of parameters.
   *
   * @param  inString The string to replace tokens in.
   * @param  inParams The collection of parameters from which tokens come.
   * @return          The string with all tokens replaced.
   */
  this.replaceTokens = function(inString, inParams) {

    // We're going to scan the text looking for tokens, all the while
    // constructing a new string in a StringBuffer from it, with the
    // data replacing the tokens.
    var finalText = "";
    var i = 0;
    while (i < inString.length) {
      // See if the next character is a hash sign, and if the next
      // character after that is an opening brace, as long as
      // that check doesn't put us beyond the end of the string, then we've
      // found the start of a token.
      if (inString.charAt(i) == '#' && inString.charAt(i + 1) == '{') {
        // Now we get the location of the closing token delimiter.  Note that
        // if the developer forgot to close the token, this will probably
        // blow up with a JS error, and at best it just won't work as
        // expected.  We're going to live with that!
        var lIndex = inString.indexOf("}#", i);
        // Now it's a simple matter to get the token name.
        var tokenName = inString.substring(i + 2, lIndex);
        // Look up the replacement value with that name from inParams.
        var tokenValue = "";
        var param = inParams[tokenName];
        if (param) {
          tokenValue = param.getValue();
        }
        finalText += tokenValue;
        // Set i to take us just past the closing token delimiter, and
        // we're done with this token
        i = lIndex + 1;
      } else {
        // The current character being checked was NOT part of a token
        // opening delimiter, so just append the character
        finalText += inString.charAt(i);
      }
      i++;
    }
    return finalText;

  } // End replaceTokens().


} // End JSValidator class.


// ==========================================================================
// ==========================================================================


// Include dependencies.
document.write('<script src="' + JSVConfig.pathPrefix +
  'prototype.js"></script>');
document.write('<script src="' + JSVConfig.pathPrefix +
  'sax.js"></script>');
document.write('<script src="' + JSVConfig.pathPrefix +
  'JSDigester.js"></script>');
document.write('<script src="' + JSVConfig.pathPrefix +
  'JSValidatorObjects.js"></script>');
document.write('<script src="' + JSVConfig.pathPrefix +
  'JSValidatorBasicValidators.js"></script>');

// Instantiate JSValidator.
jsValidator = new JSValidator();

// Set onload event to configure JSValidator, unless told not to.
if (!JSVConfig.manualInit) {
  window.onload = function() {
    jsValidator.init();
  };
}
