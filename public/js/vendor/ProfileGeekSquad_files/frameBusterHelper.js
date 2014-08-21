/* Src File:"_frameBuster/javascript/helpers/frameBusterHelper.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

define(function(require) {
	var Backbone = require("backbone");
	 var FrameBusterHelper = Backbone.View.extend({
		/**
		 * The FrameBusterHelper class prevents the page from being inserted into an iFrame on
		 * a non-whitelisted site.
		 *
		 * @class FrameBusterHelper
		 * @constructor
		 * @extends Backbone.View
		 *
		 * @param {Object} options The Backbone options.
		 */
		initialize: function(options) {
			Backbone.View.prototype.initialize.call(this, options);
			
			if(typeof options.redirect == 'undefined') {
				options.redirect = true;
			}
		
			if(options.whitelist) {
				this.validate(options.whitelist, options.redirect);
			}
		},
		
		/**
		 * Validates the specified list of URIs to prevent the page from being inserted into
		 * an iFrame on a non-whitelisted site.
		 *
		 * @method validate
		 *
		 * @param {Array} whitelist The list of URIs to validate.
		 * @param {Boolean} redirect Redirect automatically if the site is a non-whitelisted site. Defaults to true.
		 *
		 * @return {Boolean} True if URIs are valid; false if they are unauthorized.
		 */
		validate: function(whitelist, redirect) {
			if(typeof redirect == 'undefined') {
				redirect = true;
			}
			
			var browserUrl = new String((window.location != window.parent.location) ? document.referrer : document.location);
			
			if(whitelist) {
				whitelist.push(window.location.host);
			
				if(!this.startsWith(browserUrl.substring(browserUrl.indexOf("://") + 3, browserUrl.length), whitelist)) {
					if(top != self) {
						if(redirect) {
							top.location = location;
						}
						else {
							return false;
						}
					}
				}
				
				return true;
			}
			else {
				if(top != self) {
					if(redirect) {
						top.location = location;
					}
					else {
						return false;
					}
				}
			}
		},
			
		/**
		 * Checks to see if the specified string contains any of the strings in the given
		 * array as a prefix.
		 *
		 * @method startsWith
		 *
		 * @param {String} The string to search.
		 * @param {Array} The array of strings to search for.
		 *
		 * @private
		 *
		 * @return {Boolean} True if a match is found; false if not.
		 */
		startsWith: function(string, array) {
			for(var i=0; i<array.length; i++) {
				if(string.indexOf(this.trim(array[i]) + '/') == 0) {
					return true;
				}
			}
			
			return false;
		},
		
		/**
		 * Removes whitespace from the specifed string.
		 *
		 * @method trim
		 *
		 * @param {String} string The string to trim.
		 *
		 * @private
		 *
		 * @return {String} A new string with the beginning and ending whitespace trimmed.
		 */
		trim: function(string) {
			return (string.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, ''));
		}
	});
	
	return FrameBusterHelper;
});