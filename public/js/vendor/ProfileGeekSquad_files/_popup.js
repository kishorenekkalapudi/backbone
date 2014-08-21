/* Src File:"_popup/javascript/_popup.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

(function($) {
	var methods = {
		init: function(options) {
			return this.each(function() {
				var $this = $(this);
				
				options = $.extend({}, $.fn.bbypopup.defaults, options);
				
				var htmlData = $this.data();
				
				for(var key in htmlData) {
					if(key.indexOf('bbypopup') == -1) continue;
					
					var name = key.replace('bbypopup', '').toLowerCase();
					
					if($.fn.bbypopup.defaults[name] != undefined) {
						var value = htmlData[key];
						options[name] = value;
					}
				}
				
				$this.data('bbypopup', {
					target: $this,
					options: options,
					internal: {}
				});
				
				var newWindow;
				var winLeft;
				var winTop;
				var url = $this.attr('href');
				var features = 'toolbar='+options.toolbar+',location='+options.location+',status='+options.status+',menubar='+options.menubar+',scrollbars='+options.scrollbars+',resizable='+options.resizable+',width='+options.width+',height='+options.height;
				var name = options.name;
				
				$this.attr('href', '#');
				$this.click(function(){
					if (options.center) {
						winLeft = ((screen.width - (parseInt(options.width))) / 2);
						winTop = ((screen.height - (parseInt(options.height))) / 2);
						features = features + ',left=' + winLeft + ',top=' + winTop;
					}
					newWindow = window.open(url, name, features);
					newWindow.focus();
					return false;
				});
			});
		},

		destroy: function() {
			return this.each(function() {
				var $this = $(this);
				$this.unbind('click');
				$this.removeData('bbypopup');
			});
		}
	};
	
	$.fn.bbypopup = function(method) {
		if(methods[method]) return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
    else if(typeof method === 'object' || !method) return methods.init.apply(this, arguments);
    else $.error('Method ' +  method + ' does not exist on jQuery.bbypopup');
	}

	$.fn.bbypopup.defaults = {
		name: 'popup',
		status: 'no',
		toolbar: 'no',
		location: 'no',
		menubar: 'no',
		resizable: 'yes',
		scrollbars: 'yes',
		width: 600,
		height: 500,
		center: true
	};
})(jQuery);