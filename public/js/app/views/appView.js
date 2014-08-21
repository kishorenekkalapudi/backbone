define(function(require){
var backbone=require('backbone');
    var header=require('js/app/views/header.js');
    var content=require('js/app/views/content.js');

	
	return Backbone.View.extend({
		className:'main',
		initialize: function(){
		},
		render: function(){

            var components = [];
            components.push(new header().render());
            components.push(new content().render());

           this.$el.empty().append(components);



		}
	});

});
