/* Src File:"_libraries/javascript/require/config.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

(function(){
	//The following line will have the manifest info injected into the object at build-time (release mode)
	var manifest = {"__manifest__": ""}; //Looks for object with only one property '__manifest__' set. replaces from '{' to '}' with the manifest map

	//environment detection
	var baseUrl;

	var hostRx			= /\/\/(.*?)\//,
			portRx			= /:\d+$/,
			librariesRx = /^(.*\/)_libraries\/javascript\/libraries(\-[a-f0-9]{32})?\.js$/,
			urlRx       = /^https?:\/\/[^\/]+\/?/;
	var isNode = false;

	if (typeof module !== 'undefined' && module.exports) {
		isNode = true;
	}

	var testMode = typeof __karma__ !== 'undefined';

	// This function should return the image server hostname associated with libraries.js
	function getLibServerRoot() {

		//iterate over the script tages currently on the dom, searching for libraries.js
		var scripts = document.getElementsByTagName("script");
		var srcMap = {};
		for (var i=scripts.length-1; i>=0; i--) {
			var srcUrl = scripts[i].src;
			if (librariesRx.test(srcUrl)) {
				return librariesRx.exec(srcUrl)[1];
			}
		}
		return null;
	}

	function detectBaseUrl() {
		if (isNode === true) return '.';
		if (testMode === true) return '/base/bin';

		if (location.host === 'www.bestbuy.com' || location.host === 'bestbuy.com') {
			return '//js.bbystatic.com/';
		} else if (location.host === 'www-ssl.bestbuy.com') {
			return '//js-ssl.bbystatic.com/';
		} else if(location.host === 'www.qa.bestbuy.com' || location.host === 'bby-qa2.bestbuy.com' || 'bby-qa3.bestbuy.com') {
			if(getLibServerRoot()) {
				return getLibServerRoot();
			} else if(window.imgServer) {
				return urlRx.exec(window.imgServer)[0];
			} else {
				return '//js.cloud-test.bbystatic.com/';
			}
		} else if (getLibServerRoot()) {
			return getLibServerRoot();
		} else {
			return '//js.cloud-test.bbystatic.com/';
		}
	}

	var config = {
		waitSeconds: 30,
		baseUrl: detectBaseUrl(),
		shim: {
			'backbone': {
				exports: "Backbone"
			},
			'jquery': {
				exports: '$'
			},
			'underscore': {
				exports: '_'
			},
			'lodash': {
				exports: '_'
			},
			'sinon': {
				exports: 'sinon'
			},
			'http://images.bestbuy.com/BestBuy_US/store/js/bby-infrastructure.js': {
				deps: ['http://images.bestbuy.com/BestBuy_US/store/js/jQuery/plugins/ku4j-min.js']
			},
			'http://images.bestbuy.com/BestBuy_US/store/js/bby-cart.js': {
				deps: ['http://images.bestbuy.com/BestBuy_US/store/js/bby-infrastructure.js']
			},
			'http://bestbuy.ugc.bazaarvoice.com/static/3545w/bvapi.js': {
				exports: '$BV'
			},
			'http://bestbuy.ugc.bazaarvoice.com/bvstaging/static/3545w/bvapi.js': {
				exports: '$BV'
			},
			'_libraries/javascript/jquery-ui-1.10.3/jquery.ui.datepicker': {
				deps: ['_libraries/javascript/jquery-ui-1.10.3/jquery.ui.core']
			},
			'_libraries/javascript/jquery-ui-1.10.3/jquery.ui.tabs': {
				deps: ['_libraries/javascript/jquery-ui-1.10.3/jquery.ui.widget']
			},
			'_libraries/javascript/jquery-ui-1.10.3/jquery.ui.widget': {
				deps: ['_libraries/javascript/jquery-ui-1.10.3/jquery.ui.core']
			},
			'swfobject': {
				exports: 'swfobject'
			},
			'dust-helpers': ['dust'],
			'deep-model': ['backbone'],
			'modelbinder': {
				deps: ['backbone'],
				exports: "Backbone.ModelBinder"
			},
			'stickit': {
				deps: ['backbone'],
				exports: "Backbone.Stickit"
			},
			'eventmanager-backbone': ['eventmanager', 'backbone'],
			'eventmanager-debugmode': ['eventmanager'],

			// enabling require support until the following libraries can be refactored

			'_headerFooter/javascript/_headerFooter': {
				exports: 'globalNavigation'
			},
			'alert': {
				exports: 'Alert'
			},
			'alertview': {
				exports: 'AlertView'
			},
			'tooltips': {
				deps: ['_libraries/javascript/jquery-ui-1.10.3/jquery.ui.position', '_tooltips/dust/tooltipsFromData', '_tooltips/dust/tooltip']
			}
		},
		paths: {
			'ace': '_libraries/javascript/ace',
			'alert': '_alerts/javascript/models/alert',
			'alertview': '_alerts/javascript/views/alertView',
			'backbone': '_libraries/javascript/backbone',
			'bootstrap': 'ja/_libraries/bootstrap',
			'breadcrumb': '_breadcrumb/javascript/views/breadcrumbView',
			'CartButtonController': '_cartButton/javascript/CartButtonController',
			'chai': '_libraries/javascript/testing/chai-1.6.1',
			'chai-backbone': '_libraries/javascript/testing/chai-backbone-0.9.2',
			'chai-bootstrap': '_libraries/javascript/testing/chai-bootstrap',
			'chai-changes': '_libraries/javascript/testing/chai-changes-1.3.1',
			'ccm': '_cookieManager/javascript/_cookieManager',
			'dust-helpers': '_libraries/javascript/dust-helpers-1.1.1',
			'dustjs': '_libraries/javascript/dust-core-2.2.2',
			'dust': '_libraries/javascript/dust-core-2.2.2',
			'eventmanager': '_libraries/javascript/eventmanager/eventmanager',
			'eventmanager-backbone': '_libraries/javascript/eventmanager/backbone-integration',
			'eventmanager-debugmode': '_libraries/javascript/eventmanager/debug-mode',
			'EnvironmentCheckerView': '_environment/javascript/views/environmentCheckerView',
			'FrameBusterHelper': '_frameBuster/javascript/helpers/frameBusterHelper',
			'imagegallery': '_imageGallery/javascript/views/imageGalleryView',
			'media-player': '_libraries/javascript/mediaelement-and-player',
			'MegaSuperGalleryView': '_megaSuperGallery/javascript/views/MegaSuperGalleryView',
			'musicplayer': '_musicPlayer/javascript/views/MusicPlayerView',
			'popup': '_popup/javascript/_popup',
			'retina-helper': '_retina/javascript/helpers/retinaHelper',
			'sinon': '_libraries/javascript/testing/sinon-1.7.1',
			'sinon-chai': '_libraries/javascript/testing/sinon-chai-2.4.0',
			'stickit': '_libraries/javascript/backbone.stickit',
			'swfobject': '_libraries/javascript/swfobject-2.2',
			'tooltips': '_tooltips/javascript/_tooltips',
			'text': '_libraries/javascript/require/text',
			'jquery': '_libraries/javascript/jquery-1.8.3',
			'modelbinder': '_libraries/javascript/backbone.model-binder',
			'libraries': '_libraries/javascript/libraries',
            'q': '_libraries/javascript/q-1.0.0',
            'bluebird': '_libraries/javascript/bluebird-1.2.2',
            'lodash': '_libraries/javascript/lodash.compat',
            'deep-model': '_libraries/javascript/deep-model',
			'HydrateSku': '_hydrateSku/javascript/hydrateSku'
		},
		bundles: {
			'libraries': ['jquery', 'underscore', 'lodash', 'backbone', 'dust', 'dust-helpers', 'eventmanager'],
			'chai-bootstrap': ['chai', 'sinon', 'sinon-chai', 'chai-changes', 'chai-backbone']
		},
		map: {
			'*': {
				'underscore': 'lodash',
				'lib': '_libraries/javascript/require'
			}
		},
		config: {
			text: {
				useXhr: function(url, protocol, hostname, port) {
					return hostname === '127.0.0.1' || hostname === 'localhost';
				}
			}
		}
	};

	if (!isNode && window.define && define.amd) {
		define('manifest', manifest);
	}

	if (isNode === true) {
		exports = module.exports = config;
	} else if (window.require) {
		require.config(config);
		require.manifest = manifest;

		var requireLoad = require.load;
		require.load = function(context, moduleName, url) {
			var baseUrl = require.toUrl('.').slice(0,-1),
				relativeUrl = url.replace(baseUrl,''),
				newUrl;

				newUrl = manifest[relativeUrl] ? baseUrl + manifest[relativeUrl] : url;

			requireLoad.call(this, context, moduleName, newUrl);
		};

		if (testMode === true) {
			var tests = Object.keys(__karma__.files).filter(function(file){
				return (/Spec\.js$/).test(file);
			});
			require.config({
				deps: tests,
				callback: __karma__.start
			});
		}

	} else {
		window.require = config;
	}

}());
