define(function(){
	
	return Backbone.View.extend({
		className:'content',
		initialize: function(){
			memberFetch=this.model.fetch();
			this.model.on('readyToRender',_.bind(function() {
				// body...
				console.log(this.model);
			},this))

		},
		render: function(){

						this.$el.html('Body view');
		return this.$el;

		}
	});

});
