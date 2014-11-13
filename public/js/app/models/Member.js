define(
function(require){

// var backbone=require('backbone');
var appView=require('js/app/views/appView.js');
return Backbone.Model.extend({
	defaults:{
		areaCode:123,
		number:123
	},
	url:'/rest/api/members',
	  fetch: function(options) {
             var self = this;
             var opts = {
                 success: function(data) {
                         self.trigger('readyToRender');
                 },
                 error: function() {
                     self.trigger('renderOnError');
                     self.trigger('recError')
                 }
             };
             // Combine options and custom handlers, apply to fetch prototype, call.
             (_.bind(Backbone.Model.prototype.fetch, this, _.extend({}, options, opts)))();
         },

	parse:function  (argument) {
		return argument;
	},
         sync: function(method, model, options) {
             options.data = JSON.stringify(_.pick(this.attributes, 'areaCode', 'number'));
             return Backbone.sync(method, model, options);
        }

});
	
});