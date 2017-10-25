/**
 * This is a user extension to Ext JS that provides a messaging bus like the
 * OpenAjax HUB, but using Ext JS as the basis instead.
 *
 * This was based on code presented by Doug Hendricks in Ext JS forums and
 * subsequently modified by Frank W. Zammetti.  Original message thread here:
 * https://extjs.com/forum/showthread.php?t=42942
 *
 * To use this bus, execute this once per page:
 * Ext.ux.msgBus = new Ext.ux.MessageBus();
 *
 * That creates an instance of the bus.
 *
 * To subscribe to a message: supply a function (or reference to a function)
 * to execute in response to the given message. param1 is the event name and
 * param2 is the function to execute.  The arguments to the callback is a
 * variable list of arguments of any type.  For example"
 * Ext.ux.msgBus.subscribe("test", function() {
 *   console.log(arguments);
 * });
 *
 * To publish a message: param1 is the event name, after that is any number
 * of arguments of any type.  For example:
 * Ext.ux.msgBus.publish("test", "this is only a test");
 */


/**
 * Create Ext.ux namespace for all User eXtensions.
 */
Ext.namespace("Ext.ux");


/**
 * Construct a messaging bus where an interested entity can subscribe to a type
 * of event which is then published and reacted to.
 */
Ext.ux.MessageBus = function(config) {
  Ext.apply(this, config || {});
  Ext.ux.MessageBus.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.MessageBus, Ext.util.Observable, {
  events : {},
  publish : function(inTopic) {
    var topic = String(inTopic);
    this.events[topic] || (this.addEvents(topic));
    return this.fireEvent.apply(this,
      [topic].concat(Array.prototype.slice.call(arguments, 1)));
  }
});
Ext.apply(Ext.ux.MessageBus.prototype, {
  subscribe : Ext.ux.MessageBus.prototype.on,
  unsubscribe : Ext.ux.MessageBus.prototype.un,
  destroy : Ext.ux.MessageBus.prototype.purgeListeners
});
