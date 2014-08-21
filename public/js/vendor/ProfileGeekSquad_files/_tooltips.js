/* Src File:"_tooltips/javascript/_tooltips.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

// the semi-colon before function invocation is a safety net against concatenated scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	/**
	Name of the plug-in

	@property pluginName
	@type string
	@final
	**/

	// Create the defaults once
	var pluginName = "bbytooltip",
		tooltipCounter = 0,
	/**
	Default settings for the tooltip

	@property defaults
	@type object
	**/
		defaults = {
			tooltipid: 'bby-toolTip',
			content: {
				id: null,
				header: null,
				body: null,
				footer: null,
				template: {
					name: null,
					data: {}
				},
				viewobject: null,
				clone: true
			},
			renderedcontent: null,
			position: null,
			adjustpos: "20",
			uiposition: {
				my: "left center",
				at: "right center",
				collision: "flip fit",
				arrowmy:"left+1 center"
			},
			event: "mouseenter",
			style: null,
			delay: 500,
			target: null,
			opentooltip: false
		},
		tooltipList = {},
		tooltipOpen = false,
		contentIds = {},
		lastVisited = '',
		/**
		Public methods for the plugin stored as an array.

		@property methods 
		@type mixed
		**/
		methods = {
			unbindtooltip: function(){
				$(this).each(function(){
					var tooltip = $.data(this, "plugin_" + pluginName);
					if (tooltip) {
						tooltip.unbindTooltip(this);
					}
				});
			},
			updatetooltip: function ( options ) {
				$(this).each(function () {
					var tooltip = $.data(this, "plugin_" + pluginName);
					if (tooltip) {
						tooltip.updateTooltip(this, options);
					} else {
						//do nothing, tooltip errors should not break the site.
						//throw new Error("Tooltip must be initialized before calling update.");
					}
				});
			},
			hidetooltip: function ( options ) {
				$(this).each(function () {
					var tooltip = $.data(this, "plugin_" + pluginName);
					if (tooltip) {
						$('#' + tooltip.options.tooltipid).find('a.close-button').trigger('click');
					} else {
						//do nothing, tooltip errors should not break the site.
						//throw new Error("Tooltip must be initialized before calling hide.");
					}
				});
			},

			//Although destroy is called on specific elements, it will destroy the tooltips for the entire PDP.
			//Use it only when the entire PDP is being refreshed.

			destroy: function(options) {
				this.bbytooltip('unbindtooltip');
				tooltipList = {};
				_.each(contentIds, function(id){
					id.find('*').unbind().removeData();
					id.unbind().removeData();
				});

				contentIds = {};
			}
		};


	/** 
	Parse tooltip data attributes and set options for the tooltip.

	@method parseTooltipData
	@static
	@param element {jQuery object} One or more tooltip trigger element(s).
	@return options {object} tooltip options formed from the data attributes
	**/

	function parseTooltipData(element) {
		var options = {};

		$(element).each(function() {
			var defaults = {
			position: 'left'
			};

			var data = $(this).data();

			for(var key in data) {
				if (key.indexOf('bbytooltip') == -1) continue;

				var name = key.replace('bbytooltip', '').toLowerCase();

				options[name] = defaults[name];

				if (data[key] != undefined) {
					options[name] = data[key];
				}
			}

			options.content = {};

			if (options.id) {
				options.content.id = options.id;
				delete options.id;
			}

			if (options.header) {
				options.content.header = options.header;
				delete options.header;
			}

			if (options.body) {
				options.content.body = options.body;
				delete options.body;
			}

			if (options.footer) {
				options.content.footer = options.footer;
				delete options.footer;
			}

			if (options.templatename) {
				options.content.template = {};
				options.content.template.name = options.templatename;
				delete options.templatename;
			}

			if (options.templatedata) {
				options.content.template.data = options.templatedata;
				delete options.templatedata;
			}

			if (options.clone) {
				options.content.clone = options.clone;
				delete options.clone;
			}

			if (options.target) {
				options.target = '#'+options.target;
			}
		});

		return options;
	}

	/**
	Called when the tooltip is activated. Inserts content, positions and sets handlers on the tooltip, shows the tooltip and triggers the tooltipshow event.

	@method toolTipShow
	@param event {object} the event object
	*/

	//private functions
	function toolTipShow(event) {
		var options = event.data.allOptions;
		var $target = $(event.data.target),
			content,
			$toolTipId = $('#' + options.tooltipid),
			$currentTtContent = $toolTipId.data('content'),
			customStyle = options.style,
			$tooltipClass = $toolTipId.find('.tooltip-style');

		//hide any tooltip that is visible
		for (var tooltip in tooltipList) {
			$("#"+tooltipList[tooltip].tooltipid).hide();
			var offTimer = $(tooltipList[tooltip].trigger).data('offTimer');
			clearTimeout(offTimer);
		}

		//test to see if the tooltips content needs to be cloned
		if (options.content.clone) {
			//clone the cloned object- if the saved cloned object is passed into the dom the cloned events and data will be lost, so we clone it again.
			content = options.renderedcontent.clone(true, true);
		} else {
			//else, resolve the content if it is a function - or if it is an object or string _.results will ignor and not alter the content
			content = _.result(options, 'renderedcontent');
		}

		//test to see if content is changing, this helps prevent uneeded dom manipulation
		if ($currentTtContent != content) {
			//content has changed - switch it
			var theContent;
			//test to see if this content needs to be
			if (options.content.clone) {
				theContent = options.renderedcontent.clone(true, true);
			} else {
				theContent = content;
			}
			if(options.tooltipid !== 'bby-toolTip' && $currentTtContent === undefined){
				$toolTipId.find('.content-wrap').html(theContent);
				$toolTipId.data('content', content);
			}
			if(options.tooltipid == 'bby-toolTip'){
				$toolTipId.find('.content-wrap').html(theContent);
				$toolTipId.data('content', content);
			}
		}

		//swap classes
		if (!$tooltipClass.hasClass(customStyle)){
			//does not have class so we need to remove old classes
			var classes = $tooltipClass.attr('class').split(/\s+/);
			//test to see if there is more then one item in the array
			if (classes.length > 1) {
				//remove the extra class
				$.each(classes, function (index, item) {
					if (item !== 'tooltip-style') {
						$tooltipClass.removeClass(item);
					}
				});
			}
			//check to see if a class should be added
			if (customStyle !== null) {
				$tooltipClass.addClass(customStyle);
			}
		}

		//position the tooltip

		var posTrigger = options.target||event.data.target;

		toolTipPosition($toolTipId, posTrigger, options);

		//show tooltip
		$toolTipId.off('mouseenter', toolTipEnter).on('mouseenter', {target: $target, allOptions: options}, toolTipEnter);
		$toolTipId.find('a.close-button').off('click').on('click', {target: $target, allOptions: options}, function(event) {
			event.preventDefault();
			for (var tooltip in tooltipList) {
				clearTimeout($(tooltipList[tooltip].trigger).data('offTimer'));
			}

			$(this).closest('.base-tooltip').off('mouseleave');
			$(this).closest('.base-tooltip').hide();
			$target.trigger('tooltiphide', event);
		});

		$target.trigger('tooltipshow', event);
	}

	/**
	Called when opentooltip is true to give direct access to the tooltip show event and attach mouse events

	@method attachMouseEvents
	@param event {object} the event object
	*/

	function attachMouseEvents(event){
		var el = event.data.target,
			options = event.data.allOptions;
		$(el).off('mouseenter', toolTipShow).on('mouseenter', {target: el, allOptions: options}, toolTipShow);
		$(el).off('mouseleave', toolTipHide).on('mouseleave', {target: el, allOptions: options}, toolTipHide);
		toolTipShow(event);
	}

	/**
	Called when the tooltip is deactivated. Hides the tooltip after a delay and triggers the tooltiphide event.

	@method toolTipHide
	@param event {object} the event object
	*/

	function toolTipHide(event) {
		var options = event.data.allOptions;
		var $toolTipId = $('#' + options.tooltipid);
		//add delay for event hide
		var target = event.data.target;
		tooltipOpen = false;
		$('html').off('click', closeTooltipOnClick);
		clearTimeout($(target).data('offTimer'));
		if (options.event != 'click') {
			var timeOut = setTimeout(function() {
				$toolTipId.hide();
			}, options.delay);

			//hide tooltip and remove positioning
			$(target).data('offTimer', timeOut);
		} else {
			$toolTipId.hide();
		}
		$(target).trigger('tooltiphide', event);
	}

	/**
	Callback when the focus enters the tooltip. Clears timeout on the target and sets up a mouseleave event for the tooltip.

	@method toolTipEnter
	@param event {object} the event object
	*/

	function toolTipEnter(event) {
		var $target = event.data.target;
		clearTimeout($target.data('offTimer'));
		if (event.data.allOptions.event != 'click') {
			$(this).off('mouseleave', toolTipHide).on('mouseleave', {target: $target, allOptions: event.data.allOptions}, toolTipHide);
		}
		else {
			$(this).off('mouseleave', toolTipHide);
		}
	}

	/**
	Helper method to close the tooltip on click.

	@method closeTooltipOnClick
	@param event {object} the event object
	*/

	function closeTooltipOnClick(event) {
		if (($(event.target).closest('.close-button').length) || ($(event.target).parents('.tooltip-style').length==0)) {
			toolTipHide(event);
		}
	}

	function attachClickEvents(event){
		var el = event.data.target,
			options = event.data.allOptions;

		$(el).off('click', openTooltipOnClick).on('click', {target: el, allOptions: options}, openTooltipOnClick);
		$(el).off('mouseenter', closeTooltips).on('mouseenter',{target: el, allOptions: options}, closeTooltips);


		toolTipShow(event);
		$('html').off('click', closeTooltipOnClick).on('click', {target: event.data.target, allOptions: event.data.allOptions}, closeTooltipOnClick);
		tooltipOpen = true;

	}

	/**
	Helper method to open tooltip on click

	@method openTooltipOnClick
	@param event {object} the event object
	*/

	function openTooltipOnClick(event) {
		event.stopPropagation();
		event.preventDefault();
		
		if (tooltipOpen == false) {
			toolTipShow(event);
			$('html').off('click', closeTooltipOnClick).on('click', {target: event.data.target, allOptions: event.data.allOptions}, closeTooltipOnClick);
			tooltipOpen = true;
		}
	}

	/**
	Helper method to close all other tooltips when hovered over a target

	@method closeTooltips
	@param event {object} the event object
	*/

	function closeTooltips(event) {
		if (lastVisited != event.data.target) {
			lastVisited = event.data.target;
			tooltipOpen = false;
			for (var tooltip in tooltipList) {
				$("#"+tooltipList[tooltip].tooltipid).hide();
				var offTimer = $(tooltipList[tooltip].trigger).data('offTimer');
				clearTimeout(offTimer);
			}
		}
	}

	/**
	Helper method to position the tooltip

	@method toolTipPosition
	@param $toolTipId {object} jQuery object representing the tooltip.
	@param trigger {String} element representing the trigger for the tooltip.
	@param options {object} options for the tooltip.
	*/

	function toolTipPosition($toolTipId, trigger, options){
		var $content = $toolTipId.find('.tooltip-style'),
			offset = parseInt(options.adjustpos, 10);

		$content.css({margin: '0px'});

		$toolTipId.css({
			top: '-9999px',
			left: '-9999px'
		});

		//because the arrows are positioned relative to the 
		//tooltip content - the content must be showing to position them
		$toolTipId.show();

		//move tooltip
		$toolTipId.position({
			of: trigger,
			my: options.uiposition.my,
			at: options.uiposition.at,
			collision: options.uiposition.collision,
			using: function(position, element){
				//if a collision is detected the tooltip flips,
				//to display the arrows correctly the we need to know 
				//if a collision has occured
				var currentPosition = element.horizontal + " " + element.vertical;
				var ttPosition = fillterCurrentPosition(currentPosition);
				var $arrowWrapper = $(this).find('#arrow-wrap');
				var adjustMargin = {};
				var topPosition = position.top;
				var leftPosition = position.left;

				adjustMargin["margin-"+ttPosition] = offset+'px';

				if (ttPosition == "right") {
					leftPosition = position.left - offset;
				}
				if (ttPosition == "bottom") {
					topPosition = position.top - offset;
				}

				$(this).css({top: topPosition, left: leftPosition});

				$content.css(adjustMargin);

				if (!$arrowWrapper.hasClass('tt-arrow-' + ttPosition)){
					$arrowWrapper.removeClass().addClass('tt-arrow-' + ttPosition);
				}			
			}
		});

		//there are two divs that make up the 'arrow' 
		//borders need to be adjusted 
		//so the arrow looks like it is pointing to the content
		positionArrows($toolTipId, trigger, options);
	}

	/**
	Helper method to translate between current position and simplified position of the tooltip.

	@method filterCurrentPosition
	@param currentPosition {String} current positon of the tooltip.
	@return {String} simplified position of the tooltip.
	*/

	function fillterCurrentPosition(currentPosition){
		var position;
		switch(currentPosition) {
			case 'right top':
				position = 'top';
			break;
			case 'right middle':
				position = 'right';
			break;
			case 'right bottom':
				position = 'bottom';
			break;
			case 'left top':
				position = 'top';
			break;
			case 'left middle':
				position = 'left';
			break;
			case 'left bottom':
				position = 'bottom';
			break;
			case 'center bottom':
				position = 'bottom';
			break;
			case 'center top':
				position = 'top';
			break;
			default:
				position = 'none';
			break;
		}
		return position;
	}

	/**
	Helper method to position the arrows for the tooltip.

	@method filterCurrentPosition
	@param $toolTipId {object} jQuery object representing the tooltip.
	@param trigger {String} element representing the trigger for the tooltip.
	@param options {object} options for the tooltip.
	*/

	function positionArrows($toolTipId, trigger, options){
		var $arrowWrapper = $toolTipId.find('#arrow-wrap');
		var $content = $toolTipId.find('.tooltip-style');

		//clear previous settings
		$arrowWrapper.css({
			top: '0px',
			left: '0px'
		});

		//set position
		$arrowWrapper.position({
			of: $content,
			at: options.uiposition.arrowmy,
			my: options.uiposition.at,
			within: $toolTipId,
			using: function(position, element){
				/*redundency needed to display the correct class on the arrow wrapper,
				sometimes a 'fit' or 'flip' is preformed on the tooltip by jQuery
				and at the time of this writing, there is no way to detect a flip or fit,
				so when this happens jQuery reports the position of the tooltip wrapper not
				it's position relative to a target - which is needed to correctly 'point' at
				the target. To fix these rare fring cases, the code from the first positioning initalization is used again.*/
				var currentPosition = element.horizontal + " " + element.vertical;

				var placement;
				switch(currentPosition) {
					case 'right middle':
						placement = 'left';
					break;
					case 'left middle':
						placement = 'right';
					break;
					case 'center bottom':
						placement = 'top';
					break;
					case 'center top':
						placement = 'bottom';
					break;
					default:
						placement = 'none';
					break;
				}

				if (!$(this).hasClass('tt-arrow-' + placement)){
					$(this).removeClass().addClass('tt-arrow-' + placement);
				}

				$(this).css({left: position.left, top: position.top});
			},
			collision: "flip"
		});
	}

	/**

	@class Plugin
	@constructor
	 */

	// The actual plugin constructor
	function Plugin( element, options ) {
		this.element = element;

		//merge incoming options and default options
		this.options = $.extend(true, {}, defaults, options );

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {

		/**
		Starts the initialization of the tooltip.

		@method init
		*/

		init: function() {
			var el, options;

			el = this.element;
			options = this.options;
			//figure out if there is content set
			this._filterContent(el, options, this._renderTooltip);
		},

		/**
		Configures the tooltip properties.

		@method _configTooltips
		*/

		_configTooltips: function(el, options) {

				//set tooltip position
			this._filterTooltipPosition(el, options);

				//attach show/hide events
			this._eventType(el, options);

			options['trigger'] = el;

			var tooltip = {};
			tooltip['tooltipid'] = options.tooltipid;
			tooltip['trigger'] = options.trigger;

			tooltipList["" + pluginName + "-" + tooltipCounter + ""] = tooltip;
			tooltipCounter++;
			$(el).trigger('tooltiprendered');
		},

		/**
		Configures the tooltip content.

		@method _filterContent
		*/

		_filterContent: function(el, options, callback){
			var that = this;
			if (options.content != null) {
				if (typeof options.content == 'function') {
					options.renderedcontent = options.content;
					options.content.clone = false;
					callback.call(that, el, options);
				}
				else if (options.content.template != null && options.content.template.name != null) {
					dust.render(options.content.template.name, options.content.template.data,
						function(err, html) {
							options.renderedcontent = html;
							options.content.clone = false;
							callback.call(that, el, options);
						});
				}
				else if (options.content.id != null) {
					if (options.content.clone) {
						if (!contentIds[options.content.id]) {
							var contentToClone = $('#' + options.content.id);
							contentToClone.removeClass('bbytooltip');
							options.renderedcontent = contentToClone.clone(true, true);
							contentIds[options.content.id] = options.renderedcontent;
							if ($('html').hasClass('ie7')) {
								contentToClone.attr('id', '');
								contentToClone.hide();								
							}
							else {
								contentToClone.remove();
							}							
						} else {
							options.renderedcontent = contentIds[options.content.id].clone(true, true);
						}
					} else {
						options.renderedcontent = $('#' + options.content.id).html();
						options.content.clone = false;
					}

					callback.call(that, el, options);
				}
				else if (options.content.body != null) {
					dust.render('_tooltips/dust/tooltipsFromData', options.content,
						function(err, html) {
							var $content = $(html);
							$content.find("div.content").html(options.content.body);
							options.renderedcontent = $content;
							options.content.clone = false;
							callback.call(that, el, options);
						});
				}
				else if (options.content.viewobject != null) {
					options.renderedcontent = options.content.viewobject;
					options.content.clone = false;
					callback.call(that, el, options);
				}
			}
		},

		/**
		Creates the tooltip element in DOM if required.

		@method _renderTooltip
		*/

		_renderTooltip: function(el, options) {
			var toolTipId = options.tooltipid,
				that = this;

			dust.render("_tooltips/dust/tooltip", {id: toolTipId}, function(err, html) {
				if (!$('#'+toolTipId).length) {
					$('body').append(html);
				}
				that._configTooltips(el, options);
			});

		},

		/**
		Configures the event handlers for tooltip show/hide.

		@method _eventType
		*/

		_eventType: function(el, options) {
			//show tooltip event
			var elementData = {
					data: {
						target: el,
						allOptions: options
					}
				};

			switch(options.event) {
				case 'click':
					//get tooltip target
					//set show target
					//add events for closing on clicking off of tooltip
					if(options.opentooltip){
						$(el).on('openTooltip', {target: el, allOptions: options}, attachClickEvents);
						$(el).trigger('openTooltip').off('openTooltip', attachClickEvents);
					} else {
						$(el).off('click', openTooltipOnClick).on('click', {target: el, allOptions: options}, openTooltipOnClick);
						$(el).off('mouseenter', closeTooltips).on('mouseenter',{target: el, allOptions: options}, closeTooltips);
					}

				break;
				default:
					$(el).off('.returnFalse').on('click.returnFalse', function(event) {
						event.preventDefault();
					});

					if(options.opentooltip){
						$(el).on('openTooltip', {target: el, allOptions: options}, attachMouseEvents);
						$(el).trigger('openTooltip', attachMouseEvents).off('openTooltip', attachMouseEvents);
					} else {
						//add on/mouse leave events
						$(el).off('mouseenter', toolTipShow)
						.on('mouseenter', {target: el, allOptions: options}, toolTipShow);
						$(el).off('mouseleave', toolTipHide).on('mouseleave', {target: el, allOptions: options}, toolTipHide);
					}

				break;
			}
		},

		/**
		Configures the tooltip position.

		@method _filterTooltipPosition
		*/

		_filterTooltipPosition: function(el, options) {
			//test to see if position has been passed in
			//set correct positioning for jQuery UI position

			var uiposition = {};

			if (options.position != null) {
				switch(options.position) {
					case 'left':
						uiposition.my = 'right center';
						uiposition.at = 'left center';
						uiposition.arrowmy = 'right-1 center';
					break;
					case 'right':
						uiposition.my = 'left center';
						uiposition.at = 'right center';
						uiposition.arrowmy = 'left+1 center';
					break;
					case 'top':
						uiposition.my = 'center bottom';
						uiposition.at = 'center top';
						uiposition.arrowmy = 'center bottom-1';
						uiposition.collision = "fit flip";

					break;
					case 'bottom':
						uiposition.my = 'center top';
						uiposition.at = 'center bottom';
						uiposition.arrowmy = 'center top+1';
						uiposition.collision = "fit flip";
					break;
				}

				var setUiposition = $.extend(true, {}, options['uiposition'], uiposition );
				options['uiposition'] = setUiposition;
			}
		}
	};


	Plugin.prototype.updateTooltipOptions = function(element, options) {
		this._filterTooltipPosition(element, options);
		var oldOptions = $(element).data('plugin_bbytooltip').options;
		var newOptions = $.extend(true, {}, oldOptions, options );
		this._eventType(element, newOptions);
		$(element).data('plugin_bbytooltip').options = newOptions;
	};

	Plugin.prototype.unbindTooltip = function(element) {
		if (typeof element === "undefined") {
			throw new TypeError("unbindTooltip called without an element!");
		} else {
			$(element).bbytooltip('hidetooltip');
			var _tooltipInfo = $(element).data();
			$('#'+_tooltipInfo.plugin_bbytooltip.options.tooltipid).removeData("content");
			$(element).removeData("plugin_bbytooltip");
			$(element)
				.off('mouseleave', toolTipHide)
				.off('mouseenter', toolTipShow)
				.off('mouseenter', closeTooltips)
				.off('click', openTooltipOnClick)
				.off('click', closeTooltipOnClick)
				.off('openTooltip', attachClickEvents)
				.off('openTooltip', attachMouseEvents)
				.off('.returnFalse');
		}
	};

	/**
	Updates the tooltip options.

	@method updateTooltip
	*/

	Plugin.prototype.updateTooltip = function(element, options) {
		if (typeof options != 'undefined') {
			if (options.content != null) {
				this._filterContent(element, options, this.updateTooltipOptions);
			}
			else {
				this.updateTooltipOptions(element, options);
			}
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		if (methods[options]) {
			methods[options].apply(this, Array.prototype.slice.call( arguments, 1 ));
		}
		else {
			return this.each(function () {
				var tooltipOptions = options;
				//check if we need to parse data attributes
				if (typeof tooltipOptions == 'undefined') {
					tooltipOptions = parseTooltipData(this);
				}

				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin( this, tooltipOptions ));
				//tooltip has been created - process other requests
				} else {

				}
			});
		}
	};
})( jQuery, window, document );
