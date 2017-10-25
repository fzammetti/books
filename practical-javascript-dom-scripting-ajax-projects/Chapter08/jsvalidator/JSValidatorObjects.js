/**
 * ==========================================================================
 * JSValidatorValidatorImpl is the base class for all the validator that
 * JSValidator can use.
 * ==========================================================================
 */
function JSValidatorValidatorImpl() {

  this.jsValidatorConfig = null;
  this.formConfig = null;
  this.fieldConfig = null;
  this.validatorConfig = null;
  this.field = null;

  this.setJsValidatorConfig = function(inJsValidatorConfig) {
    this.jsValidatorConfig = inJsValidatorConfig;
  }
  this.getJsValidatorConfig = function() {
    return this.jsValidatorConfig;
  }

  this.setFormConfig = function(inFormConfig) {
    this.formConfig = inFormConfig;
  }
  this.getFormConfig = function() {
    return this.formConfig;
  }

  this.setFieldConfig = function(inFieldConfig) {
    this.fieldConfig = inFieldConfig;
  }
  this.getFieldConfig = function() {
    return this.fieldConfig;
  }

  this.setValidatorConfig = function(inValidatorConfig) {
    this.validatorConfig = inValidatorConfig;
  }
  this.getValidatorConfig = function() {
    return this.validatorConfig;
  }

  this.setField = function(inField) {
    this.field = inField;
  }
  this.getField = function() {
    return this.field;
  }

  this.validate = function() { }

} // End JSValidatorValidatorImpl class.


/**
 * ==========================================================================
 * JSValidatorConfig is the top-level class of the class hierarchy that
 * stores the configuration information parsed from a JSValidator XML
 * configuration file.
 * ==========================================================================
 */
function JSValidatorConfig() {

  var validators = new Object();
  var messages = new Object();
  var forms = new Object();

  this.addValidator = function(inValidatorConfig) {
    validators[inValidatorConfig.getId()] = inValidatorConfig;
  }
  this.getValidators = function() {
    return validators;
  }
  this.getValidator = function(inID) {
    return validators[inID];
  }

  this.addMessage = function(inMessage) {
    messages[inMessage.getId()] = inMessage;
  }
  this.getMessages = function() {
    return messages;
  }
  this.getMessage = function(inID) {
    return messages[inID];
  }

  this.addForm = function(inForm) {
    forms[inForm.getName()] = inForm;
  }
  this.getForms = function() {
    return forms;
  }
  this.getForm = function(inName) {
    return forms[inName];
  }

  this.toString = function() {
    return "JSValidatorConfig=[" +
    "validators=" + validators + "," +
    "messages=" + messages + "," +
    "forms=" + forms + "]";
  }

} // End JSValidatorConfig class.


/**
 * ==========================================================================
 * JSValidatorValidatorConfig is a class that defines a pluggable validator
 * that JSValidator can make use of.
 * ==========================================================================
 */
function JSValidatorValidatorConfig() {

  var id = null;
  var src = null;
  var clazz = null;

  this.getId = function() {
    return id;
  }
  this.setId = function(inID) {
    id = inID;
  }

  this.getSrc = function() {
    return src;
  }
  this.setSrc = function(inSRC) {
    src = inSRC;
  }

  this.getClass = function() {
    return clazz;
  }
  this.setClass = function(inClass) {
    clazz = inClass;
  }

  this.toString = function() {
    return "JSValidatorValidatorConfig=[" +
    "id=" + id + "," +
    "src=" + src + "," +
    "clazz=" + clazz + "]";
  }

} // End JSValidatorValidatorConfig class.


/**
 * ==========================================================================
 * JSValidatorMessage is a class that defines a validation failure message that
 * JSValidator can make use of.
 * ==========================================================================
 */
function JSValidatorMessage() {

  var id = null;
  var text = null;

  this.getId = function() {
    return id;
  }
  this.setId = function(inID) {
    id = inID;
  }

  this.getText = function() {
    return text;
  }
  this.setText = function(inText) {
    text = inText;
  }

  this.toString = function() {
    return "JSValidatorMessage=[" +
    "id=" + id + "," +
    "text=" + text + "]";
  }

} // End JSValidatorMessage class.


/**
 * ==========================================================================
 * JSValidatorForm is a class that defines all the validations configured for a
 * given HTML form.
 * ==========================================================================
 */
function JSValidatorForm() {

  var name = null;
  var noSubmitMessage = null;
  var validations = new Object;

  this.getName = function() {
    return name;
  }
  this.setName = function(inName) {
    name = inName;
  }

  this.getNoSubmitMessage = function() {
    return noSubmitMessage;
  }
  this.setNoSubmitMessage = function(inNoSubmitMessage) {
    noSubmitMessage = inNoSubmitMessage;
  }

  this.addValidation = function(inValidation) {
    validations[inValidation.getField()] = inValidation;
  }
  this.getValidations = function() {
    return validations;
  }
  this.getValidation = function(inField) {
    return validations[inField];
  }

  this.toString = function() {
    return "JSValidatorForm=[" +
    "name=" + name + ", " +
    "validations=" + validations + "]";
  }

} // End JSValidatorForm class.


/**
 * ==========================================================================
 * JSValidatorFormValidation is a class which defines a single validation on a
 * single field in a form.
 * ==========================================================================
 */
function JSValidatorFormValidation() {

  var field = null;
  var event = null;
  var type = null;
  var failAction = null;
  var startInvalid = null;
  var params = new Object();

  this.getField = function() {
    return field;
  }
  this.setField = function(inField) {
    field = inField;
  }

  this.getEvent = function() {
    return event;
  }
  this.setEvent = function(inEvent) {
    event = inEvent;
  }

  this.getType = function() {
    return type;
  }
  this.setType = function(inType) {
    type = inType;
  }

  this.getFailAction = function() {
    return failAction;
  }
  this.setFailAction = function(inFailAction) {
    failAction = inFailAction;
  }

  this.getStartInvalid = function() {
    return startInvalid;
  }
  this.setStartInvalid = function(inStartInvalid) {
    startInvalid = inStartInvalid;
  }

  this.addParam = function(inParam) {
    params[inParam.getName()] = inParam;
  }
  this.getParams = function() {
    return params;
  }
  this.getParam = function(inName) {
    return params[inName];
  }

  this.toString = function() {
    return "JSValidatorFormValidation=[" +
    "field=" + field + "," +
    "event=" + event + "," +
    "type=" + type + "," +
    "failAction=" + failAction + "," +
    "startInvalid=" + startInvalid + "," +
    "params=" + params + "]";
  }

} // End JSValidatorFormValidation class.


/**
 * ==========================================================================
 * JSValidatorFormValidationParam is a class which defines a parameter used by a
 * field validation.
 * ==========================================================================
 */
function JSValidatorFormValidationParam() {

  var name = null;
  var value = null;

  this.getName = function() {
    return name;
  }
  this.setName = function(inName) {
    name = inName;
  }

  this.getValue = function() {
    return value;
  }
  this.setValue = function(inValue) {
    value = inValue;
  }

  this.toString = function() {
    return "JSValidatorFormValidation=[" +
    "name=" + name + "," +
    "value=" + value + "]";
  }

} // End JSValidatorFormValidationParam class.
