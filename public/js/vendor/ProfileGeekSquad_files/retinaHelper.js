/* Src File:"_retina/javascript/helpers/retinaHelper.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

define(function(require) {
	var $ = require("jquery");
	var _ = require("lodash");
	var Backbone = require("backbone");

	var RetinaHelper = Backbone.View.extend({

		// Properties

		$scope: null,

		// Backbone

		initialize: function(options){
			if (options) {
				if (options.$scope) {
					this.$scope = options.$scope;
					options.$scope = null;
				}
				if (options.redrawOnWindowChange) this._addWindowListeners();
			}
		},

		// Methods

		redraw: function() {
			this.redrawFragment(this.$scope);
		},

		redrawFragment: function(scope) {
			(window.devicePixelRatio >= 1.5) ? this._renderRetinaGraphics(scope) : this._renderStandardGraphics(scope);
		},

		_addWindowListeners: function() {
			if (window.matchMedia) {
				var standardMediaQuery = window.matchMedia('(-webkit-max-device-pixel-ratio: 1.4999)');
				var retinaMediaQuery = window.matchMedia('(-webkit-min-device-pixel-ratio: 1.5)');

				standardMediaQuery.addListener(_.bind(function(standardMediaQuery) {
					if(standardMediaQuery.matches){
						this._renderStandardGraphics(this.$scope);
					}
				}, this));

				retinaMediaQuery.addListener(_.bind(function(retinaMediaQuery) {
					if(retinaMediaQuery.matches){
						this._renderRetinaGraphics(this.$scope);
					}
				}, this));
			}
		},

		_renderRetinaGraphics: function(scope){
			$(scope).find('.hidpi').each(function(){
				if(!$(this).data('standard-src')) {
					$(this).data('standard-src', $(this).attr('src'));
				}

				$(this).attr('src', $(this).data('retina-src'));
			});
		},

		_renderStandardGraphics: function(scope){
			$(scope).find('.hidpi').each(function(){
				if(!$(this).data('standard-src')) {
					$(this).data('standard-src', $(this).attr('src'));
				}

				$(this).attr('src', $(this).data('standard-src'));
			});
		},

		remove: function() {
			this.$scope = null;
			Backbone.View.prototype.remove.apply(this, arguments);
		}
	});

	return RetinaHelper;
});