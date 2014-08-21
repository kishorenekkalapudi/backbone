define(function(){
	
	return Backbone.View.extend({
		model:null,
		className:'header',
		initialize: function(){
		},
		render: function(){
			this.$el.html('<h1>header view</h1>');

						return this.$el;

					}
	});

});
