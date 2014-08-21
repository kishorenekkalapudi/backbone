/* Src File:"_breadcrumb/javascript/views/breadcrumbView.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

define(function(require) {
	var Backbone = require("backbone");
	require("tooltips");
	require("popup");


	var BreadcrumbView = Backbone.View.extend({

		// Backbone

		events: {
			'click a.print-action': 'onClickPrint'
		},

		// Rendering

		postRender: function() {
			this.$('.bbypopup').bbypopup();
			this.$('.bbytooltip-trigger').bbytooltip();

			return this;
		},

		// UI Events

		onClickPrint: function(event) {
			event.preventDefault();
			window.print();
		}
	});

	return BreadcrumbView;
});