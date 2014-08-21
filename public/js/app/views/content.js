define(function(){
	
	return Backbone.View.extend({
		className:'content',
		initialize: function(){
		},
		render: function(){

						this.$el.html('<h1>Body view</h1>');
		return this.$el;

		}
	});

});
