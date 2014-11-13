define(function(require){
var backbone=require('backbone');
    var header=require('js/app/views/header.js');
    var content=require('js/app/views/content.js');

	
	return Backbone.View.extend({
		className:'main',
		initialize: function(){

            this.model.save({}, {

                url: '/post',

                type: 'POST',

                contentType: 'application/json',

                success: _.bind(function() {
                }, this),
                error: _.bind(function(model, response) {

                }, this),

            })
		},
		render: function(){
			
            var components = [];
            components.push(new header().render());
            components.push(new content({model:this.model}).render());

           this.$el.empty().append(components);



		}
	});

});
