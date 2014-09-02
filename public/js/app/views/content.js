define(function(){
	
	return Backbone.View.extend({
		className:'content',
		initialize: function(){
		},
		render: function(){

						this.$el.html('Body view');
		return this.$el;

		}
	});

});
