/**
 * ===========================================================================
 * JSDigester class.
 * ===========================================================================
 */
function JSDigester() {

  // Some constants for what event is occurring.
  this.EVENT_BEGIN = 1;
  this.EVENT_BODY = 2;
  this.EVENT_END = 3;

  // The path of the element currently being processed.
  this.currentPath = null;

  // The collection of rules configured for this JSDigester instance.
  this.rules = new Array();

  // The stack of objects created as the incoming XML is parsed.
  this.objectStack = [];

  // The root object of the stack.
  this.rootObject = null;

  // This is the logger JSDigester will use.  The logger class can be any class
  // you want, as long as it supports five known methods: trace(), debug(),
  // info(), warn(), error() and fatal().
  this.log = null;

  // The SAX parser used to process the incoming XML.
  this.saxParser = new SAXParser();

  // Initialize this JSDigester instance.
  this.init();

} // End JSDigester().


/**
 * Initialize this class as a SAX document handler.
 */
JSDigester.prototype.init = function() {

  // Tell the SAX parsed that this instance of JSDigester is the document
  // handler.
  this.saxParser.setDocumentHandler(this);

} // End init().


/**
 * Set the logger that JSDigester will use.
 *
 * @param inLogger The log instance to use.
 */
JSDigester.prototype.setLogger = function(inLogger) {

  this.log = inLogger;

} // End setLogger().


/**
 * Called by client code to parse an XML string.
 *
 * @param  inXMLString The string of XML to parse.
 * @return The final object to be popped off the stack.
 */
JSDigester.prototype.parse = function(inXMLString) {

  if (this.log) {
    this.log.trace("JSDigester.parse()...");
    this.log.debug("inXMLString = " + inXMLString);
  }
  // Remove all items from the object stack, just in case this isn't the
  // first parse this instance of JSDigester has performed.
  this.objectStack.splice(0);
  // Clear current path and root object.
  this.currentPath = "";
  this.rootObject = null;
  // Ask the SAX parser to parse the incoming XML.
  if (this.log) {
    this.log.debug("Calling SAX parser...");
  }
  this.saxParser.parse(inXMLString);
  if (this.log) {
    this.log.debug("SAX parser returned");
  }
  // Return the root object on the stack.
  if (this.log) {
    this.log.debug("Returning root object: " + this.rootObject);
  }
  return this.rootObject;

} // End parse().


/**
 * Push an object onto the stack.
 *
 * @param inObj The object to push onto the stack.
 */
JSDigester.prototype.push = function(inObj) {

  if (this.log) {
    this.log.trace("Pushing object onto stack: " + inObj);
  }
  this.objectStack.push(inObj);

} // End push().


/**
 * Pop an object offf the stack.
 *
 * @return inObj The object popped off the stack.
 */
JSDigester.prototype.pop = function() {

  if (this.log) {
    this.log.trace("Popping object from stack...");
  }
  this.rootObject = this.objectStack.pop();
  if (this.log) {
    this.log.trace("Object popped was: " + this.rootObject);
  }
  return this.rootObject;

} // End pop().


/**
 * Function called by the SAX parser when the document begins.  Not needed
 * for JSDigester processing, but present to fulfill the SAX interface contract.
 */
JSDigester.prototype.startDocument = function() {

  if (this.log) {
    this.log.trace("startDocument()");
  }

}


/**
 * Called by the SAX parser when a new element is encountered.
 *
 * @param inName       The name of the element.
 * @param inAttributes The attributes of the element.
 */
JSDigester.prototype.startElement = function(inName, inAttributes) {

  if (this.log) {
    this.log.trace("startElement()");
  }
  // If this is not the first element encountered, start by adding a forward
  // slash (the path separator).
  if (this.currentPath != "") {
    this.currentPath += "/";
  }
  if (this.log) {
    this.log.debug("currentPath = " + this.currentPath);
  }
  // Build up the path of the current element.
  this.currentPath += inName;
  if (this.log) {
    this.log.debug("New value for currentPath = " + this.currentPath);
  }
  // Fire all the rules associated with this element.
  this.fireRules(this.EVENT_BEGIN, inName, inAttributes, null);

} // End startElement().


/**
 * Called by the SAX parsed when text is encountered within an element.
 *
 * @param inText The text contained within the element.
 */
JSDigester.prototype.characters = function(inText) {

  if (this.log) {
    this.log.trace("characters()");
  }
  this.fireRules(this.EVENT_BODY, null, null, inText);

} // End characters().


/**
 * Called by the SAX parser when an element's closing tag is encountered.
 *
 * @param inName       The name of the element.
 */
JSDigester.prototype.endElement = function(inName) {

  if (this.log) {
    this.log.trace("endElement()");
  }
  this.fireRules(this.EVENT_END, inName, null, null);
  // Chop this element off the path.
  var i = this.currentPath.lastIndexOf("/");
  this.currentPath = this.currentPath.substr(0, i);
  if (this.log) {
    this.log.debug("Value of currentPath is now " + this.currentPath);
  }

} // End endElement().


/**
 * Function called by the SAX parser when the document ends.  Not needed
 * for JSDigester processing, but present to fulfill the SAX interface contract.
 */
JSDigester.prototype.endDocument = function() {

  if (this.log) {
    this.log.trace("endDocument()");
  }

}


/**
 * This is where most of the work in JSDigester occurs.  The fireRules method
 * is responsible for firing whatever rules apply for the current element.
 * Depeneding on which event calls this will determine which method on each
 * rule to call.
 *
 * @param inEvent      The code for the event being processed.
 * @param inName       The name of the element being processed.
 * @param inAttributes The attributes of the element being procssed.
 * @param inText       The text contained within the element being processed.
 */
JSDigester.prototype.fireRules = function(inEvent, inName, inAttributes,
  inText) {

  if (this.log) {
    this.log.trace("fireRules() for currentPath=" + this.currentPath);
  }
  var ruleIndex = 0;
  if (inEvent != this.EVENT_BEGIN) {
    ruleIndex = this.rules.length - 1;
  }
  if (this.log) {
    this.log.debug("ruleIndex = " + ruleIndex);
  }
  for (var ruleCounter = 0; ruleCounter < this.rules.length; ruleCounter++) {
    var rule = this.rules[ruleIndex];
    if (this.log) {
      this.log.debug("Checking rule " + rule.getRuleType() +
        " for path " + rule.getPath());
    }
    if (rule.getPath() == this.currentPath) {
      switch (inEvent) {
        case this.EVENT_BEGIN:
          if (this.log) {
            this.log.trace("Calling rule BEGIN");
          }
          rule.begin(inAttributes);
        break;
        case this.EVENT_BODY:
          if (this.log) {
            this.log.trace("Calling rule BODY");
          }
          rule.body(inText);
        break;
        case this.EVENT_END:
          if (this.log) {
            this.log.trace("Calling rule END");
          }
          rule.end(inName);
        break;
      }
    } else {
      if (this.log) {
        this.log.debug("Rule not applicable to this path, so not firing");
      }
    }
    if (inEvent == this.EVENT_BEGIN) {
      ruleIndex++;
    } else {
      ruleIndex--;
    }
  }

} // End fireRules().


/**
 * Add an ObjecrCreate rule to the collection of rules.
 *
 * @param inPath      The path to fire the rule for.
 * @param inClassName The name of the JavaScript class to create.
 */
JSDigester.prototype.addObjectCreate = function(inPath, inClassName) {

  if (this.log) {
    this.log.debug("Adding ObjectCreateRule: inPath=" + inPath + " -- " +
      "inClassName=" + inClassName);
  }
  this.rules.push(new ObjectCreateRule(inPath, inClassName, this));

} // End addObjectCreate().


/**
 * Add a SetProperties rule to the collection of rules.
 *
 * @param inPath The path to fire the rule for.
 */
JSDigester.prototype.addSetProperties = function(inPath) {

  if (this.log) {
    this.log.debug("Adding SetPropertiesRule: inPath=" + inPath);
  }
  this.rules.push(new SetPropertiesRule(inPath, this));

} // End addSetProperties().


/**
 * Add a BeanPropertySetter rule to the collection of rules.
 *
 * @param inPath The path to fire the rule for.
 * @param inMethod The method to call on the object to do the set.
 */
JSDigester.prototype.addBeanPropertySetter = function(inPath, inMethod) {

  if (this.log) {
    this.log.debug("Adding BeanPropertySetterRule: inPath=" + inPath + " -- " +
      "inMethod=" + inMethod);
  }
  this.rules.push(new BeanPropertySetterRule(inPath, inMethod, this));

} // End addBeanPropertySetter().

/**
 * Add an AddSetNext rule to the collection of rules.
 *
 * @param inPath   The path to fire the rule for.
 * @param inMethod The method to call on the next object.
 */
JSDigester.prototype.addSetNext = function(inPath, inMethod) {

  if (this.log) {
    this.log.debug("Adding SetNextRule: inPath=" + inPath + " -- " +
      "inMethod=" + inMethod);
  }
  this.rules.push(new SetNextRule(inPath, inMethod, this));

} // End addSetNext().


/**
 * ===========================================================================
 * ObjectCreateRule class.
 * ===========================================================================
 */
function ObjectCreateRule(inPath, inClassName, inJSDigester) {

  // Set rule type and path to fire for.
  this.ruleType = "ObjectCreateRule";
  this.path = inPath;
  // Set the JavaScript class to instamtiate.
  this.className = inClassName;
  // Record JSDigester instance the instance of this class belongs to.
  this.jsDigester = inJSDigester;

} // End ObjectCreateRule().


/**
 * xxxx
 */
ObjectCreateRule.prototype.getRuleType = function() {

  return this.ruleType;

} // End getRuleType().


/**
 * xxxx
 */
ObjectCreateRule.prototype.getPath = function() {

  return this.path;

} // End getPath().


/**
 * xxxx
 */
ObjectCreateRule.prototype.begin = function(inAttributes) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("ObjectCreateRule.begin(): " + inAttributes);
  }
  var protoObj = eval(this.className);
  this.jsDigester.push(new protoObj());

} // End begin().


/**
 * xxxx
 */
ObjectCreateRule.prototype.body = function(inText) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("ObjectCreateRule.body(): " + inText);
  }

}


/**
 * xxxx
 */
ObjectCreateRule.prototype.end = function(inName) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("ObjectCreateRule.end(): " + inName);
  }
  this.jsDigester.pop();

} // End end().


/**
 * ===========================================================================
 * SetPropertiesRule class.
 * ===========================================================================
 */
function SetPropertiesRule(inPath, inJSDigester) {

  // Set rule type and path to fire for.
  this.ruleType = "SetPropertiesRule";
  this.path = inPath;
  // Record JSDigester instance the instance of this class belongs to.
  this.jsDigester = inJSDigester;

} // End SetPropertiesRule().


/**
 * xxxx
 */
SetPropertiesRule.prototype.getRuleType = function() {

  return this.ruleType;

} // End getRuleType().


/**
 * xxxx
 */
SetPropertiesRule.prototype.getPath = function() {

  return this.path;

} // End getPath().


/**
 * xxxx
 */
SetPropertiesRule.prototype.begin = function(inAttributes) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("SetPropertiesRule.begin(): " + inAttributes);
  }
  var obj = this.jsDigester.pop();
  for (var i = 0; i < inAttributes.length; i++) {
    var nextAttribute = inAttributes[i];
    var keyVal = nextAttribute.split("=");
    var key = keyVal[0];
    var val = keyVal[1];
    key = "set" + key.substring(0, 1).toUpperCase() + key.substring(1);
    if (this.jsDigester.log) {
      this.jsDigester.log.debug("SetPropertiesRule.begin() - key=" + key +
        "val=" + val);
    }
    obj[key](val);
  }
  this.jsDigester.push(obj);

} // End begin().


/**
 * xxxx
 */
SetPropertiesRule.prototype.body = function(inText) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("SetPropertiesRule.body(): " + inText);
  }

}


/**
 * xxxx
 */
SetPropertiesRule.prototype.end = function(inName) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("SetPropertiesRule.end()" + inName);
  }

}


/**
 * ===========================================================================
 * BeanPropertySetterRule class.
 * ===========================================================================
 */
function BeanPropertySetterRule(inPath, inMethod, inJSDigester) {

  // Set rule type and path to fire for.
  this.ruleType = "BeanPropertySetterRule";
  this.path = inPath;
  // Set the method to call to do the set.
  this.setMethod = inMethod;
  // Record JSDigester instance the instance of this class belongs to.
  this.jsDigester = inJSDigester;

} // End BeanPropertySetterRule().


/**
 * xxxx
 */
BeanPropertySetterRule.prototype.getRuleType = function() {

  return this.ruleType;

} // End getRuleType().


/**
 * xxxx
 */
BeanPropertySetterRule.prototype.getPath = function() {

  return this.path;

} // End getPath().


/**
 * xxxx
 */
BeanPropertySetterRule.prototype.begin = function(inAttributes) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("BeanPropertySetterRule.begin(): " + inAttributes);
  }

}


/**
 * xxxx
 */
BeanPropertySetterRule.prototype.body = function(inText) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("BeanPropertySetterRule.body(): " + inText);
  }
  var obj = this.jsDigester.pop();
  if (this.jsDigester.log) {
    this.jsDigester.log.debug("BeanPropertySetterRule.body() - obj=" + obj);
  }
  obj[this.setMethod](inText);
  this.jsDigester.push(obj);

} // End body().


/**
 * xxxx
 */
BeanPropertySetterRule.prototype.end = function(inName) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("BeanPropertySetterRule.end(): " + inName);
  }

}


/**
 * ===========================================================================
 * SetNextRule class.
 * ===========================================================================
 */
function SetNextRule(inPath, inMethod, inJSDigester) {

  // Set rule type and path to fire for.
  this.ruleType = "SetNextRule";
  this.path = inPath;
  // Set the method on the next object to call.
  this.setMethod = inMethod;
  // Record JSDigester instance the instance of this class belongs to.
  this.jsDigester = inJSDigester;

} // End SetNextRule().


/**
 * xxxx
 */
SetNextRule.prototype.getRuleType = function() {

  return this.ruleType;

} // End getRuleType().


/**
 * xxxx
 */
SetNextRule.prototype.getPath = function() {

  return this.path;

} // End getPath().


/**
 * xxxx
 */
SetNextRule.prototype.begin = function(inAttributes) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("SetNextRule.begin(): " + inAttributes);
  }

}


/**
 * xxxx
 */
SetNextRule.prototype.body = function(inText) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("SetNextRule.body(): " + inText);
  }

}


/**
 * xxxx
 */
SetNextRule.prototype.end = function(inName) {

  if (this.jsDigester.log) {
    this.jsDigester.log.debug("SetNextRule.end(): " + inName);
  }
  var childObj  = this.jsDigester.pop();
  var parentObj = this.jsDigester.pop();
  if (this.jsDigester.log) {
    this.jsDigester.log.debug("SetNextRule.end() - childObj=" + childObj +
      "parentObj=" + parentObj);
  }
  parentObj[this.setMethod](childObj);
  this.jsDigester.push(parentObj);
  this.jsDigester.push(childObj);

} // End end().
