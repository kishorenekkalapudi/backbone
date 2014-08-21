/* Src File:"_analytics/javascript/survey.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

/* 201210021230 : Survey code */
/* TSA : 201207170000 : Added custom param for ab test cookie */
/* TSA : 201210021230 : Added custom param for track.isCloud */
var Survey = {
	version : '201210021230',
	debug : false,
	dev : true,
	lang : '',
	currentSurveyName : '',
	currentSurvey : null,
	custom : {
		params : {
			cookies : [ {
				name : 'TLSessionId',
				value : 'Survey.base.utils.cookies.get("TLTSID")'
			}, {
				name : 'Id',
				value : 'Survey.base.utils.cookies.get("TLTSID")'
			}, {
				name : 'SessionID',
				value : 'Survey.base.utils.cookies.get("JSESSIONID")'
			}, {
				name : 'abTestCSI',
				value : 'Survey.base.utils.cookies.get("abTestCSI")'
			} ],
			track : [ {
				name : 'bbyKeyWords',
				value : 'track.searchTerm' // || Survey.base.utils.getQueryParameterByName(\'searchterm\') || Survey.base.utils.getQueryParameterByName(\'st\')'
			}, {
				name : 'CartProds',
				value : 'track.skuList'
			}, {
				name : 'OrderDate',
				value : 'track.sysDate'
			}, {
				name : 'OrderId',
				value : 'track.orderId'
			}, {
				name : 'paymentType',
				value : 'track.payTypeList'
			}, {
				name : 'ProfileId',
				value : 'track.profileId'
			}, {
				name : 'rzId',
				value : 'track.rzId'
			}, {
				name : 'rzTier',
				value : 'track.rzTier'
			}, {
				name : 'isCloud',
				value : 'track.isCloud'
			} ],
			document : [ {
				name : 'src',
				value : 'document.location'
			} ]
		},
		//surveys: array of surveys (name and settings per survey)
		surveys : [ {
			name : 'confirmit',
			settings : {
				percentage : 2, //0 //percentage
				translations : [ {
					lang : 'es',
					percentage : 10
				} ],
				wait : 3, //seconds
				checkOpener : {
					timer : 3, //seconds
					interval : null //setInterval object
				},
				openerTimeout : 10, //seconds
				updateVisit : {
					timer : 5, //seconds
					interval : null //setInterval object
				},
				survey : {
					URL : 'http://survey.confirmit.com/wix/p2037721124.aspx',
					width : '800', //pixels
					height : '600', //pixels
					translations : [ {
						lang : 'es',
						URL : 'http://survey.confirmit.com/wix/p2091469847.aspx'
					} ]
				},
				surveyParams : '',
				invite : {
					title : 'Invitation to participate in a survey',
					file : 'invite.html',
					html : undefined,
					width : '610', //pixels
					height : '325', //pixels
					translations : [ {
						lang : 'es',
						title : 'Invitaciï¿½n a participar en una encuesta',
						file : 'invite_es.html',
						html : undefined
					} ],
					rules : {
						start_pages : [ '*' ],
						exclude_pages : [],
						page_views : 3
					}
				},
				watch : {
					windowHandle : {},
					title : 'Survey - Confirmit - Watch',
					file : 'watch.html',
					html : undefined,
					width : '600', //pixels
					height : '375', //pixels
					translations : [ {
						lang : 'es',
						title : 'Encuesta - Confirmit - Reloj',
						file : 'watch_es.html',
						html : undefined
					} ],
					rules : {
						invite : 'start',
						show : 'exit'
					}
				},
				cookies : {
					//survey invite seen
					invite : {
						name : 'srvy_ci_i',
						length : 90, //days
						translations : [ {
							lang : 'es',
							name : 'es_srvy_ci_i'
						} ]
					},
					//survey invite accepted - visit info
					visit : {
						name : 'srvy_ci_v',
						length : null, // for SESSION only
						translations : [ {
							lang : 'es',
							name : 'es_srvy_ci_v'
						} ]
					},
					//survey opted out
					optedout : {
						name : 'srvy_ci_x',
						length : 365, //days
						translations : [ {
							lang : 'es',
							name : 'es_srvy_ci_x'
						} ]
					}
				}
			}
		} ]
	},
	site : {
		settings : {
			codePath : '/BestBuy_US/js/survey/',
			sitePath : '/survey/',
			translations : [ {
				lang : 'es',
				codePath : '/BestBuy_US/js/survey/',
				sitePath : '/survey/'
			} ],
			baseSurveyJS : 'survey.js',
			baseSurveyCSS : 'survey.css',
			jQueryPath : '/BestBuy_US/store/vendor/jquery/',
			jQueryFile : 'jquery-1.7.min.js',
			lightboxPath : '/colorbox/',
			lightboxJS : 'jquery.colorbox.js',
			lightboxCSS : 'jquery.colorbox.css',
			currentHost : document.location.host,
			currentSitePort : document.location.port,
			isSecure : ((document.location.protocol === 'https:') ? true : false),
			sites : [ {
				webPre : 'www',
				sslWebPre : 'www-ssl',
				files : 'images',
				sslFiles : 'images-ssl',
				domain : 'bestbuy.com'
			}, {
				webPre : 'espanol',
				sslWebPre : 'espanol-ssl',
				files : 'images',
				sslFiles : 'images-ssl',
				domain : 'bestbuy.com'
			}, {
				webPre : 'preview',
				sslWebPre : 'espanol-ssl',
				files : 'images',
				sslFiles : 'images-ssl',
				domain : 'bestbuy.com'
			}, {
				webPre : 'www.qa',
				sslWebPre : 'www.qa',
				files : 'images.qa',
				sslFiles : 'images.qa',
				domain : 'bestbuy.com'
			}, {
				webPre : 'bby-qa2',
				sslWebPre : 'bby-qa2',
				files : 'images-qa2',
				sslFiles : 'images-qa2',
				domain : 'bestbuy.com'
			}, {
				webPre : 'bby-qa3',
				sslWebPre : 'bby-qa3',
				files : 'images-qa3',
				sslFiles : 'images-qa3',
				domain : 'bestbuy.com'
			}, {
				webPre : 'www.cit',
				sslWebPre : 'www.cit',
				files : 'images-qa3',
				sslFiles : 'images-qa3',
				domain : 'bestbuy.com'
			}, {
				webPre : 'cloud-test',
				sslWebPre : 'cloud-test',
				files : 'images',
				sslFiles : 'images-ssl',
				domain : 'bestbuy.com'
			} ]
		}
	},
	base : {
		utils : {},
		interact : {},
		params : {
			plugin : [ {
				name : 'Flash',
				value : '((navigator.plugins.length>0&&typeof navigator.plugins["Shockwave Flash"]!=="undefined")?navigator.plugins["Shockwave Flash"].description.match(\/\\d+\/g).join("."):(typeof ActiveXObject!=="undefined")?new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").match(\/\\d+\/g).join("."):"NA")'
			} ],
			browser : [ {
				name : 'OS',
				value : 'navigator.oscpu'
			}, {
				name : 'Browser',
				value : 'Survey.browser.name+" "+Survey.browser.version'
			}, {
				name : 'Locale',
				value : 'navigator.browserLanguage||navigator.language'
			} ],
			document : [ {
				name : 'URL',
				value : 'document.URL'
			}, {
				name : 'Terms',
				value : 'track.searchTerm' // || Survey.base.utils.getQueryParameterByName(\'searchterm\') || Survey.base.utils.getQueryParameterByName(\'st\')'
			}, {
				name : 'Site',
				value : 'document.location.hostname'
			}, {
				name : 'Referrer',
				value : 'document.referrer'
			} ],
			code : [ {
				name : 'pageViews',
				value : 'Survey.base.utils.getPageViewCount();'
			}, {
				name: 'lastTime',
				value: '(new Date).getTime()'
			} ]
		}
	},
	watch : {},
	browser : {
		name : '',
		version : ''
	},
	test : {
		cookie : {
			name : 'srvy_t',
			length : 7 //days
		}
	}
};

//TSA : 201206080115 : Added a global var for Survey.base.utils - set when document ready
//TSA : 201206080115 : Added a global vars for Survey.base.utils.CookieInfo - set in initialization
var gSBU = null,
	gSBUCI_invite = null,
	gSBUCI_visit = null,
	gSBUCI_optedout = null,
	gSTCI = null;

Survey.base.prototype = {};

Survey.base.utils = {
	getCookieInfo : function (sCookieName) {
		"use strict";
		//gSBU.log('Survey.base.utils.getCookieInfo:start');
		//load the properties for the cookie 
		var	oSCSSC = Survey.currentSurvey.settings.cookies[sCookieName],
			oCookieInfo = {
				name : '',
				length : oSCSSC.length
			},
			i;
		if (Survey.lang.indexOf('en') > -1) {
			//english site - set cookie name
			oCookieInfo.name = oSCSSC.name;
		} else {
			//loop through translations for cookie name
			for (i = 0; i < oSCSSC.translations.length; i += 1) {
				if (Survey.lang.indexOf(oSCSSC.translations[i].lang) > -1) {
					//translation found - set cookie name
					oCookieInfo.name = oSCSSC.translations[i].name;
				}
			}
		}
		//gSBU.log('Survey.base.utils.getCookieInfo:returning CookieInfo');
		return oCookieInfo;
	},
	setBrowserInfo : function () {
		"use strict";
		//gSBU.log('Survey.base.utils.getBrowserInfo:start');
		var nAgt = navigator.userAgent,
			browserName  = navigator.appName,
			fullVersion  = String() + parseFloat(navigator.appVersion),
			majorVersion = parseInt(navigator.appVersion, 10),
			nameOffset,
			verOffset,
			ix;
		// In Opera, the true version is after "Opera" or after "Version"
		if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
			browserName = 'Opera';
			fullVersion = nAgt.substring(verOffset + 6);
			if ((verOffset = nAgt.indexOf('Version')) !== -1) {
				fullVersion = nAgt.substring(verOffset + 8);
			}
		} else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) { // In MSIE, the true version is after "MSIE" in userAgent
			browserName = 'Microsoft Internet Explorer';
			fullVersion = nAgt.substring(verOffset + 5);
		} else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) { // In Chrome, the true version is after "Chrome"
			browserName = 'Chrome';
			fullVersion = nAgt.substring(verOffset + 7);
		} else if ((verOffset = nAgt.indexOf('Safari')) !== -1) { // In Safari, the true version is after "Safari" or after "Version"
			browserName = 'Safari';
			fullVersion = nAgt.substring(verOffset + 7);
			if ((verOffset = nAgt.indexOf('Version')) !== -1) {
				fullVersion = nAgt.substring(verOffset + 8);
			}
		} else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) { // In Firefox, the true version is after "Firefox"
			browserName = 'Firefox';
			fullVersion = nAgt.substring(verOffset + 8);
		} else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) { // In most other browsers, "name/version" is at the end of userAgent
			browserName = nAgt.substring(nameOffset, verOffset);
			fullVersion = nAgt.substring(verOffset + 1);
			if (browserName.toLowerCase() === browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}
		// trim the fullVersion string at semicolon/space if present
		if ((ix = fullVersion.indexOf(';')) !== -1) {
			fullVersion = fullVersion.substring(0, ix);
		}
		if ((ix = fullVersion.indexOf(' ')) !== -1) {
			fullVersion = fullVersion.substring(0, ix);
		}
		majorVersion = parseInt(String() + fullVersion, 10);
		if (isNaN(majorVersion)) {
			fullVersion  = String() + parseFloat(navigator.appVersion);
			majorVersion = parseInt(navigator.appVersion, 10);
		}
		Survey.browser.name = browserName;
		Survey.browser.version = fullVersion;
		//gSBU.log(' Browser name  = ' + browserName + '\n Full version = ' + fullVersion + '\n Major version = ' + majorVersion + '\n navigator.appName = ' + navigator.appName + '\n navigator.userAgent = ' + navigator.userAgent);
		//gSBU.log('Survey.base.utils.getBrowserInfo:end');
	},
	getPageViewCount : function () {
		"use strict";
		//gSBU.log('Survey.base.utils.getPageViewCount:start');
		var oSBUC = gSBU.cookies,
			nViews = 1;
		if (typeof oSBUC.getvalue(gSBUCI_visit.name, 'pageViews') !== 'undefined') {
			if (oSBUC.getvalue(gSBUCI_visit.name, 'URL') !== document.URL) {
				//gSBU.log('Survey.base.utils.getPageViewCount:pageViews:increment');
				nViews = parseInt(oSBUC.getvalue(gSBUCI_visit.name, 'pageViews'), 10) + 1;
			} else {
				//gSBU.log('Survey.base.utils.getPageViewCount:pageViews:same');
				nViews = parseInt(oSBUC.getvalue(gSBUCI_visit.name, 'pageViews'), 10);
			}
		}
		//gSBU.log('Survey.base.utils.getPageViewCount:pageViews:first');
		return nViews;
	},
	getQueryParameterByName : function (name) {
		"use strict";
		//gSBU.log('Survey.base.utils.getQueryParameterByName:start');
		name = window.escape(window.unescape(name));
		var regex = new RegExp("[?&]" + name + "(?:=([^&]*))?", "i"),
			match = regex.exec(window.location.search),
			value = null;
		if (match !== null) {
			value = match[1];
		} else {
			//gSBU.log('Survey.base.utils.getQueryParameterByName:null');
			return null;
		}
		if (value.length === 0) {
			return null;
		}
		//gSBU.log('Survey.base.utils.getQueryParameterByName:found:' + value);
		return value;
	},
	checkForSurvey : function () {
		"use strict";
		//gSBU.log('Survey.base.utils.checkForSurvey:start');
		var i,
			oSCS = Survey.custom.surveys;
		if (Survey.currentSurvey === null) {
			for (i = 0; i < oSCS.length; i += 1) {
				Survey.currentSurvey = oSCS[i];
				//only using the confirmit survey - for now
				if (Survey.currentSurvey.name === Survey.currentSurveyName) {
					//gSBU.log('Survey.base.utils.checkForSurvey:survey found');
					return true;
				}
			}
		} else {
			//gSBU.log('Survey.base.utils.checkForSurvey:survey already set');
            //survey was already set
			return true;
		}
		//gSBU.log('Survey.base.utils.checkForSurvey:survey not found');
		//survey not found
		return false;
	},
	log : function (sInfo) {
		"use strict";
		if (Survey.debug) {
			if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
				console.log(sInfo);
			} else {
				var sStatus;
				sStatus = window.status + ' > ' + sInfo;
				sStatus = sStatus.substring(sStatus.length - 85, 85);
				window.status = sStatus;
			}
		}
	},
	chance : function (nPercentage) {
		"use strict";
		//gSBU.log('Survey.base.utils.chance:start');
		//random number between 1 and 100
		if ((Math.floor(Math.random() * (100)) + 1) <= nPercentage) {
			//gSBU.log('Survey.base.utils.chance');
			return true;
		}
		return false;
	},
	gatherParams : function () {
		"use strict";
		//gSBU.log('Survey.base.utils.gatherParams:start');
		var sParams = '',
			i,
			j,
			arrItems,
			oItem,
			oSBP = Survey.base.params,
			oSCP = Survey.custom.params;
		//get base params
		for (i in oSBP) {
			//if (oSBP.hasOwnProperty(i)) { //not compatible with IE8
			arrItems = oSBP[i];
			for (j = 0; j < arrItems.length; j += 1) {
				oItem = arrItems[j];
				if (typeof eval(oItem.value) !== 'undefined') {
					sParams += '&' + oItem.name + '=' + window.escape(eval(oItem.value));
				}
			}
			//}
		}
		//get custom params
		for (i in oSCP) {
			//if (oSCP.hasOwnProperty(i)) { //not compatible with IE8
			arrItems = oSCP[i];
			for (j = 0; j < arrItems.length; j += 1) {
				oItem = arrItems[j];
				if (typeof eval(oItem.value) !== 'undefined') {
					sParams += '&' + oItem.name + '=' + window.escape(eval(oItem.value));
				}
			}
			//}
		}
		//custom pageParams set on the page from project/code-behind, get picked up here
		//syntax on page var - pageParams = [ {name1: 'name_here1'}, {value2: 'value_here2'} ] or
		// var pageParams = [];
		// pageParams.push({name1: 'name_here1'});
		// pageParams.push({name2: 'name_here2'});
		//get params set on page
		if (typeof window.pageParams !== 'undefined') {
			for (j = 0; j < window.pageParams.length; j += 1) {
				oItem = window.pageParams[j];
				if (typeof eval(oItem.value) !== 'undefined') {
					sParams += '&' + oItem.name + '=' + window.escape(eval(oItem.value));
				}
			}
		}
		//gSBU.log('Survey.base.utils.gatherParams:' + sParams);
		return sParams;
	},
	updateVisit : function () {
		"use strict";
		Survey.base.utils.log('Survey.base.utils.updateVisit:start');
		var	oSCS = Survey.currentSurvey.settings;
		if (gSBU.cookies.get(gSBUCI_invite.name) && ((gSBU.cookies.getvalue(gSBUCI_invite.name, 'status') === 'invited_accepted_closed') || (gSBU.cookies.getvalue(gSBUCI_invite.name, 'status') === 'invited_accepted_surveyed'))) {
			//gSBU.log('Survey.base.utils.updateVisit:clearInterval and remove visit cookie');
			//visit no longer needs to be tracked - cleanup
			window.clearInterval(oSCS.updateVisit.interval);
			gSBU.cookies.remove(gSBUCI_visit.name);
			return;
		}
		//gSBU.log('Survey.base.utils.updateVisit:set visit cookie with latest');
		//update the visit cookie with params
		gSBU.cookies.set(gSBUCI_visit.name, 'params=' + gSBU.gatherParams(), gSBUCI_visit.length);
		//gSBU.log('Survey.base.utils.updateVisit:end');
	}
};
Survey.base.utils.cookies = {
	get : function (name) {
		"use strict";
		//gSBU.log('Survey.base.utils.cookies.get:name:' + name);
		// Declare variables.
		var cookieName = name + '=',
			cookieArray = document.cookie.split(';'),
			i,
			oCookie;
		for (i = 0; i < cookieArray.length; i += 1) {
			oCookie = cookieArray[i];
			while (oCookie.charAt(0) === ' ') {
				oCookie = oCookie.substring(1, oCookie.length);
			}
			if (oCookie.indexOf(cookieName) === 0) {
				return window.unescape(oCookie.substring(cookieName.length, oCookie.length));
			}
		}
		return null;
	},
	getvalue : function (name, value) {
		"use strict";
		//gSBU.log('Survey.base.utils.cookies.getvalue:name:' + name + ',value:' + value);
		// Declare variables.
		var oCookie = gSBU.cookies.get(name),
			subElements,
			subElemPairs,
			subNameValues,
			i,
			j;
		if (oCookie !== null) {
			subElements = oCookie.split("&");
			subElemPairs = [];
			subNameValues = [];
			// Obtain sub-element names and values.
			for (i = 0; i < subElements.length; i += 1) {
				subElemPairs[i] = subElements[i].split("=");
			}
			// Place sub-element name-value pairs in an associative array.
			for (j = 0; j < subElemPairs.length; j += 1) {
				subNameValues[subElemPairs[j][0]] = subElemPairs[j][1];
			}
			// Example sub-element value request.
			return window.unescape(subNameValues[value]);
		}
		return undefined;
	},
	set : function (name, value, daystoexpire) {
		"use strict";
		//gSBU.log('Survey.base.utils.cookies.set:name:' + name + ',value:' + value);
		var oDate = new Date();
		oDate.setDate(oDate.getDate() + daystoexpire);
		document.cookie = name + '=' + window.escape(value)	+ ';path=/;domain=.' + Survey.site.utils.currentDomain() + ((typeof daystoexpire === 'undefined' || daystoexpire === null) ? ''	: ';expires=' + oDate.toGMTString());
		return;
	},
	remove : function (name) {
		"use strict";
		//gSBU.log('Survey.base.utils.cookies.remove:name:' + name);
		gSBU.cookies.set(name, '', -1);
	}
};
Survey.base.utils.files = {
    onload_queue : [],
    dom_loaded : false,
	hasJSCSSFile : function (sFileName, sID, sFileType) {
		"use strict";
		//gSBU.log('Survey.base.utils.files.hasJSCSSFile:start');
		var oFileRef = document.getElementById(sID);
		if (typeof oFileRef !== 'undefined' && oFileRef !== null) {
			if (oFileRef.getAttribute('type') === sFileType	&& oFileRef.getAttribute('src') === sFileName) {
				//gSBU.log('file already added');
				return true;
			}
		} else {
			return false;
		}
	},
	loadJSCSSFile : function (sFileName, sID, sFileType, fnCallback) {
		"use strict";
		//gSBU.log('Survey.base.utils.files.loadJSCSSFile:start');
		var oFileRef,
			oHead, //TSA : 201205231415 : code injection update
			oSBUF = gSBU.files;
		//dev environment - don't use min versions
		if (!Survey.dev && (sFileName.indexOf('-min.') === -1)) {
			//gSBU.log('Survey.base.utils.files.loadJSCSSFile: get min files if prod');
			sFileName = sFileName.replace('.js', '-min.js').replace('.css', '-min.css');
		}
		if (oSBUF.hasJSCSSFile(sFileName, sID, sFileType)) {
			//file is already included on the page
			//gSBU.log('Survey.base.utils.files.loadJSCSSFile:file already on page');
			return;
		}
		if (sFileType === 'js') {
			//filename is a external JavaScript file
			oFileRef = document.createElement('script');
			oFileRef.language = 'javascript';
			oFileRef.type = 'text/javascript';
		} else if (sFileType === 'css') {
			//filename is an external CSS file	
			oFileRef = document.createElement('link');
			oFileRef.rel = 'stylesheet';
			oFileRef.type = 'text/css';
		}
		//TSA : 201205231415 : code injection update
		oFileRef.id = sID;
		oFileRef.async = true;
		if (typeof fnCallback !== 'undefined' && fnCallback !== null) {
			oFileRef.onload = oFileRef.onreadystatechange = function () {
				if (oSBUF.dom_loaded) {
					fnCallback();
				} else {
					oSBUF.onload_queue.push(fnCallback);
				}
				// clean up for IE and Opera
				oFileRef.onload = null;
				oFileRef.onreadystatechange = null;
			};
		}
//		if (typeof oFileRef !== 'undefined') {
//			//prep for a callback if passed in
//			if (typeof fnCallback !== 'undefined') {
//				if (oFileRef.readyState) {  //IE
//					oFileRef.onreadystatechange = function () {
//						if (oFileRef.readyState === "loaded" || oFileRef.readyState === "complete") {
//							oFileRef.onreadystatechange = null;
//							fnCallback();
//						}
//					};
//				} else {  //Others
//					oFileRef.onload = fnCallback();
//				}
//			}
		//set the file name on the href/src
		if (sFileType === 'js') {
			oFileRef.src =  sFileName + '?v=' + Survey.version;
		} else if (sFileType === 'css') {
			oFileRef.href = sFileName + '?v=' + Survey.version;
		}
		//append the script object to the head elements
		//document.getElementsByTagName('head')[0].appendChild(oFileRef);
		//TSA : 201205231415 : code injection update
		oHead = document.getElementsByTagName('head')[0];
		oHead.appendChild(oFileRef);
//		}
		//gSBU.log('Survey.base.utils.files.loadJSCSSFile:end');
	},
	removeJSCSSFile : function (sID, sFileType) {
		"use strict";
		//gSBU.log('Survey.base.utils.files.removeJSCSSFile:start');
		var oFiles,
			i,
			oFile,
			oParent;
		if (sFileType === 'js') {
			//gSBU.log('Survey.base.utils.files.removeJSCSSFile:js');
			oFiles = document.getElementsByTagName('script');
		} else if (sFileType === 'css') {
			//gSBU.log('Survey.base.utils.files.removeJSCSSFile:css');
			oFiles = document.getElementsByTagName('link');
		}
		if (typeof oFiles !== 'undefined') {
			for (i = 0; i < oFiles.length; i += 1) {
				oFile = oFiles[i];
				if (oFile.id === sID) {
					oParent = oFile.parentNode;
					//gSBU.log('Survey.base.utils.files.removeJSCSSFile:found');
					break;
				}
				//gSBU.log('Survey.base.utils.files.removeJSCSSFile:not found');
			}
		}
		if (typeof oParent !== 'undefined' && typeof oFile !== 'undefined') {
			//gSBU.log('Survey.base.utils.files.removeJSCSSFile:removing');
			oParent.removeChild(oFile);
			//gSBU.log('Survey.base.utils.files.removeJSCSSFile:removed');
		}
		//gSBU.log('Survey.base.utils.files.removeJSCSSFile:end');
	}
};
Survey.base.interact = {
	showInvite : function () {
		"use strict";
		//gSBU.log('Survey.base.interact:showInvite:start');
		var oSCS = Survey.currentSurvey.settings,
			oSSU = Survey.site.utils,
			sHREF = false,
			sHTML = false,
			i;
		//check for language
		if (Survey.lang.indexOf('en') > -1) {
			//english
			sHREF = (typeof oSCS.invite.file !== 'undefined') ?
					oSSU.filepath(Survey.currentSurveyName, true) + oSCS.invite.file
					: false;
			sHTML = (typeof oSCS.invite.html !== 'undefined') ?
					oSCS.invite.html.replace(/#IMAGESERVER#/g, oSSU.imageServer())
					: false;
		} else {
			//not english...espanol
			for (i = 0; i < oSCS.invite.translations.length; i += 1) {
				if (Survey.lang.indexOf(oSCS.invite.translations[i].lang) > -1) {
					sHREF = (typeof oSCS.invite.translations[i].file !== 'undefined') ?
							oSSU.filepath(Survey.currentSurveyName, true) + oSCS.invite.translations[i].file
							: false;
					sHTML = (typeof oSCS.invite.translations[i].html !== 'undefined') ?
							oSCS.invite.translations[i].html.replace(/#IMAGESERVER#/g, oSSU.imageServer())
							: false;
				}
			}
		}
		//pause here to make sure that colorbox is loaded
		setTimeout('var o=null', 1500);
		//set and load lightbox
		jQuery.colorbox({
			href : sHREF,
			html : sHTML,
			fastIframe : false,
			overlayClose : false,
			transition : 'fade',
			speed : 500,
			//scrolling : false,
			escKey : false,
			iframe : false,
			opacity: .5,
			innerWidth: oSCS.invite.width,
			innerHeight: oSCS.invite.height - 10,
			//width : oSCS.invite.width,
			//height : oSCS.invite.height,
			title: false,
			onComplete : function () {
				gSBU.cookies.set(gSBUCI_invite.name, 'status=invited', gSBUCI_invite.length);
				jQuery('#survey_header div img').each(function () {
					if (jQuery(this).attr('id') === 'bby') {
						jQuery(this).attr('src', oSSU.filepath('', false) + jQuery(this).attr('id') + 'logo.png');
					} else {
						jQuery(this).attr('src', oSSU.filepath('', false) + jQuery(this).attr('id') + '/' + jQuery(this).attr('id') + 'logo.png');
					}
					//gSBU.log('colorbox:loaded:populate images:' + jQuery(this).attr('src'));
				});
				//gSBU.log('colorbox:completed loading');
			},
			onClose : function () {
				//gSBU.log('colorbox:closed');
			},
			onCleanup : function () {
				//gSBU.log('colorbox:closing');
				//remove survey css, no longer needed
				gSBU.files.removeJSCSSFile('survey_css', 'css');
			}
		}).resize();
		//gSBU.log('Survey.base.interact:showInvite:end');
	},
	inviteGuest : function () {
		"use strict";
		//gSBU.log('Survey.base.interact.inviteGuest:start');
		var oSBUF = gSBU.files,
			oSSU = Survey.site.utils;
		if (typeof jQuery.colorbox === 'undefined') {
			//gSBU.log('Survey.base.interact.inviteGuest:jQuery.colorbox not found');
			oSBUF.loadJSCSSFile(oSSU.filepath(Survey.site.settings.lightboxPath, false) + Survey.site.settings.lightboxCSS, 'survey_lightbox_css', 'css', function () {
				//gSBU.log('Survey.base.interact.inviteGuest:Loading colorbox.js');
				oSBUF.loadJSCSSFile(oSSU.filepath(Survey.site.settings.lightboxPath, false) + Survey.site.settings.lightboxJS, 'survey_lightbox_js', 'js', function () {
					//gSBU.log('Survey.base.interact.inviteGuest:Loading survey.css');
					oSBUF.loadJSCSSFile(oSSU.filepath('', false) + Survey.site.settings.baseSurveyCSS, 'survey_css', 'css', function () {
						//gSBU.log('Survey.base.interact.inviteGuest:Loading ShowInvite');
						Survey.base.interact.showInvite();
					});
				});
			});
			//gSBU.log('Survey.base.interact.inviteGuest:jQuery.colorbox js and css and survey css loaded');
		} else {
			oSBUF.loadJSCSSFile(oSSU.filepath('', false) + Survey.site.settings.baseSurveyCSS, 'survey_css', 'css', function () {
				//gSBU.log('Survey.base.interact.inviteGuest:Loading ShowInvite');
				Survey.base.interact.showInvite();
			});
			//gSBU.log('Survey.base.interact.inviteGuest: Survey css loaded');
		}
		//gSBU.log('Survey.base.interact.inviteGuest:end');
	},
	optOut : function () {
		"use strict";
		//gSBU.log('Survey.base.interact.optOut:start');
		//save cookie
		gSBU.cookies.set(gSBUCI_optedout.name, 'status=optout', gSBUCI_optedout.length);
		//gSBU.log('Survey.base.interact.optOut:end');
	},
	closeInvite : function () {
		"use strict";
		//gSBU.log('Survey.base.interact.closeInvite:start');
		if (gSBU.checkForSurvey()) {
			//save cookie
			gSBU.cookies.set(gSBUCI_invite.name, 'status=invited_closed', gSBUCI_invite.length);
			//future: track cancellation
			//close the lightbox
			jQuery.colorbox.close();
		}
		//gSBU.log('Survey.base.interact.closeInvite:end');
	}
};

Survey.watch.prototype = {};

Survey.watch.interact = {
	showSurvey : function () {
		"use strict";
		//gSBU.log('Survey.watch.interact.showSurvey:start');
		if (gSBU.checkForSurvey()) {
			var oSCS = Survey.currentSurvey.settings,
				oSBUC = gSBU.cookies,
				sLastParams,
				sURL,
				i;
			window.clearInterval(oSCS.checkOpener.interval);
			//save invite cookie
			oSBUC.set(gSBUCI_invite.name, 'status=invited_accepted_surveyed',
				gSBUCI_invite.length);
			sLastParams = window.unescape(oSBUC.get(gSBUCI_visit.name).substring(oSBUC.get(gSBUCI_visit.name).indexOf('=') + 2));
			if (Survey.lang.indexOf('en') > -1) {
				sURL = oSCS.survey.URL;
			} else {
				for (i = 0; i < oSCS.survey.translations.length; i += 1) {
					if (Survey.lang.indexOf(oSCS.survey.translations[i].lang) > -1) {
						sURL = oSCS.survey.translations[i].URL;
						break;
					}
				}
			}
			document.location.href = sURL + "?" + sLastParams;
			window.resizeTo(oSCS.survey.width, oSCS.survey.height);
			window.focus();
		}
		//gSBU.log('Survey.watch.interact.showSurvey:end');
	},
	checkOpener : function () {
		"use strict";
		//gSBU.log('Survey.watch.interact.checkOpener:start');
		var nLastTime,
			nNow;
		try {
			//check for visit cookie 
			if (window.opener.document === null || typeof window.opener.document === 'undefined') {
				//gSBU.log('Survey.watch.interact.checkOpener:window.opener.document is not available');
				if (gSBU.cookies.get(gSBUCI_visit.name) && gSBU.cookies.getvalue(gSBUCI_visit.name, 'lastTime')) {
					nLastTime = parseInt(gSBU.cookies.getvalue(gSBUCI_visit.name, 'lastTime'), 10);
					nNow = (new Date()).getTime();
					if ((nNow - nLastTime) < (Survey.currentSurvey.settings.openerTimeout * 1000)) {
						//gSBU.log('Survey.watch.interact.checkOpener: catch(e):openerTimeout still valid');
						// keep monitoring, user is still active
						return;
					}
				}
				//opener document not available - user must have navigated away
				Survey.watch.interact.showSurvey();
			} else {
				//gSBU.log('Survey.watch.interact.checkOpener:window.opener.document is available');
				//nothing to do...
				return;
			}
		} catch (e) {
			//gSBU.log('Survey.watch.interact.checkOpener: catch(e):' + e);
			//if (!window.opener) {
			//	Survey.watch.interact.showSurvey();
			//}
			//check for opener by looking at survey cookie time
			if (gSBU.cookies.get(gSBUCI_visit.name) && gSBU.cookies.getvalue(gSBUCI_visit.name, 'lastTime')) {
				nLastTime = parseInt(gSBU.cookies.getvalue(gSBUCI_visit.name, 'lastTime'), 10);
				nNow = (new Date()).getTime();
				if ((nNow - nLastTime) < (Survey.currentSurvey.settings.openerTimeout * 1000)) {
					//gSBU.log('Survey.watch.interact.checkOpener: catch(e):openerTimeout still valid');
					// keep monitoring, user is still active
					return;
				}
			}
			//the user abandoned the site/completed their visit - load the Survey
			Survey.watch.interact.showSurvey();
		} finally {
			//got this far. Is something wrong?
			//gSBU.log('Survey.watch.interact.checkOpener:finally');
			//cleanup?
		}
		//gSBU.log('Survey.watch.interact.checkOpener:end');
	},
	showWatch : function () {
		"use strict";
		//gSBU.log('Survey.watch.interact.showWatch:start');
		//initialize unset base survey params for cookie/url
		try {
			if (gSBU.checkForSurvey()) {
				var i,
					oWin = Survey.currentSurvey.settings.watch.windowHandle,
					oSCS = Survey.currentSurvey.settings,
					oSSS = Survey.site.settings,
					oSSU = Survey.site.utils,
					sHREF = false,
					sHTML = false,
					windowWidth = oSCS.watch.width,
					windowHeight = oSCS.watch.height,
					windowLeft = parseInt((screen.availWidth / 2) - (windowWidth / 2), 10),
					windowTop = parseInt((screen.availHeight / 2) - (windowHeight / 2), 10),
					windowSize = 'width=' + windowWidth	+ ',height=' + windowHeight + 'left=' + windowLeft + ',top=' + windowTop + 'screenX=' + windowLeft + ',screenY=' + windowTop,
					windowParms = 'directories=no,menubar=no,scrollbars=yes,resizable=yes,status=yes,toolbar=no,location=no,' + windowSize;
				//gSBU.log('Survey.watch.interact.showWatch:properties set');
				//check for language
				if (Survey.lang.indexOf('en') > -1) {
					//gSBU.log('Survey.watch.interact.showWatch:English survey');
					//english -- oSSU.filepath(Survey.currentSurveyName, true)
					sHREF = (typeof oSCS.watch.file !== 'undefined') ? oSSU.filepath(Survey.currentSurveyName, true) + oSCS.watch.file : false;
					sHTML = (typeof oSCS.watch.html !== 'undefined') ? oSCS.watch.html.replace(/#IMAGESERVER#/g, oSSU.imageServer()) : false;
				} else {
					//gSBU.log('Survey.watch.interact.showWatch:not English survey');
					//not english -- oSSU.filepath(Survey.currentSurveyName, true)
					for (i = 0; i < oSCS.watch.translations.length; i += 1) {
						if (Survey.lang.indexOf(oSCS.invite.translations[i].lang) > -1) {
							sHREF = (typeof oSCS.watch.translations[i].file !== 'undefined') ? oSSU.filepath(Survey.currentSurveyName, true) + oSCS.watch.translations[i].file : false;
							sHTML = (typeof oSCS.watch.translations[i].html !== 'undefined') ? oSCS.watch.translations[i].html.replace(/#IMAGESERVER#/g, oSSU.imageServer()) : false;
						}
					}
				}
				//set visit cookie
				gSBU.updateVisit();
				//future: track watch window viewing
				if (sHREF) {
					//add on images path
					sHREF += "?imagepath=" + window.escape((oSSS.isSecure) ? "https:" : "http:") + oSSU.imageServer();
					//gSBU.log('Survey.watch.interact.showWatch:href');
					//open the new window with the href
					oWin = window.open(sHREF,
							'survey_watch',
							windowParms);
					if (!oWin) {
						//gSBU.log('Survey.watch.interact.showWatch:href:!oWin');
						setTimeout(function () {
							Survey.currentSurvey.settings.watch.windowHandle = window.open('',
									'survey_watch',
									windowParms);
							Survey.currentSurvey.settings.watch.windowHandle.document.location.href = sHREF;
						}, 1000);
					}
				} else if (sHTML) {
					//gSBU.log('Survey.watch.interact.showWatch:html');
					oWin = window.open('',
							'survey_watch',
							windowParms);
					if (!oWin) {
						//gSBU.log('Survey.watch.interact.showWatch:html:!oWin');
						oWin = window.open('',
								'survey_watch',
								windowParms);
					}
					//gSBU.log('Survey.watch.interact.showWatch:html:writing html:start');
					//open the document for writing
					oWin.document.open("text/html", "replace");
					oWin.document.write(sHTML);
					//close the document to writing
					oWin.document.close();
					//gSBU.log('Survey.watch.interact.showWatch:html:writing html:end');
				}
				if (oWin) {
					//gSBU.log('Survey.watch.interact.showWatch:oWin loaded');
					oWin.blur();
					//oWin.document.domain = Survey.site.utils.currentDomain();
				}
				//gSBU.log('Survey.watch.interact.showWatch:start visit cookie timer');
				//set interval for visit cookie updates
				oSCS.updateVisit.interval = window.setInterval('Survey.base.utils.updateVisit()', (oSCS.updateVisit.timer * 1000));
				window.self.focus();
				//gSBU.log('Survey.watch.interact.showWatch:set invite cookie');
				//save invite cookie
				gSBU.cookies.set(gSBUCI_invite.name, 'status=invited_accepted',
						gSBUCI_invite.length);
				//gSBU.log('Survey.watch.interact.showWatch:lightbox close');
				//close the lightbox
				jQuery.colorbox.close();
			}
		} catch (e) {
			//gSBU.log('Survey.watch.interact.showWatch:catch(e):' + e);
		} finally {
			//cleanup
			//gSBU.log('Survey.watch.interact.showWatch:finally');
		}
		//gSBU.log('Survey.watch.interact.showWatch:end');
	},
	hideWatch : function () {
		"use strict";
		//gSBU.log('Survey.watch.interact.hideWatch:start');
		window.self.blur();
		window.opener.focus();
		//gSBU.log('Survey.watch.interact.hideWatch:end');
	},
	closeWatch : function () {
		"use strict";
		//gSBU.log('Survey.watch.interact.closeWatch:start');
		if (gSBU.checkForSurvey()) {
			var oSBUC = gSBU.cookies,
				gSBUCI_invite = gSBU.getCookieInfo('invite'),
				oSBUCI_visit = gSBU.getCookieInfo('visit');//,
				//oSCSC = Survey.currentSurvey.settings.cookies;
			if (oSBUC.getvalue(gSBUCI_invite.name, 'status') !== 'invited_accepted_surveyed') {
				//gSBU.log('Survey.watch.interact.closeWatch:no survey taken');
				//save cookie
				oSBUC.set(gSBUCI_invite.name, 'status=invited_accepted_closed', gSBUCI_invite.length);
			}
			//remove visit cookie
			oSBUC.remove(oSBUCI_visit.name);
		}
		//gSBU.log('Survey.watch.interact.closeWatch:end');
	}
};

Survey.site.prototype = {};

Survey.site.utils = {
	imageServer : function () {
		"use strict";
		//gSBU.log('Survey.site.utils.imageServer - start');
		var i,
			oSSS = Survey.site.settings,
			oSSU = Survey.site.utils,
			oSite;
		for (i = 0; i < oSSS.sites.length; i += 1) {
			//gSBU.log('index:' + i + ' value:' + oSSS.sites[i].webPre);
			if (oSSS.sites[i].webPre.indexOf(oSSU.currentDomainPrefix()) > -1 || oSSS.sites[i].sslWebPre.indexOf(oSSU.currentDomainPrefix()) > -1) {
				oSite = oSSS.sites[i];
				//gSBU.log('Survey.site.utils.imageServer - ' + '//' + ((oSSS.isSecure) ? oSite.sslFiles : oSite.files) + '.' + oSite.domain);
				return ('//' + ((oSSS.isSecure) ? oSite.sslFiles : oSite.files) + '.' + oSite.domain);
			}
		}
		//gSBU.log('Survey.site.utils.imageServer - null');
		return null; // no match for domain or path
	},
	filepath : function (sSubPath, bWebFile) {
		"use strict";
		//gSBU.log('Survey.site.settings.filepath - ' + sSubPath);
		var i,
			retPath,
			sSitePath,
			sCodePath,
			oSSS = Survey.site.settings,
			oSSU = Survey.site.utils;
		for (i = 0; i < oSSS.sites.length; i += 1) {
			if (oSSS.sites[i].webPre.indexOf(oSSU.currentDomainPrefix()) > -1 || oSSS.sites[i].sslWebPre.indexOf(oSSU.currentDomainPrefix()) > -1) {
				retPath = '';
				sSitePath = oSSS.sitePath;
				sCodePath = oSSS.codePath;
				if (typeof bWebFile === 'undefined' || bWebFile === null) {
					bWebFile = false;
				}
				//add translation path
				if (Survey.lang !== '' || Survey.lang !== 'en') {
					for (i = 0; i < oSSS.translations.length; i += 1) {
						if (Survey.lang.indexOf(oSSS.translations[i].lang) > -1) {
							sSitePath = oSSS.translations[i].sitePath;
							sCodePath = oSSS.translations[i].codePath;
							break;
						}
					}
				}
				//use survey codepath + subpath
				//gSBU.log('Survey.site.settings.filepath - ' + ((bWebFile) ? sSitePath : oSSU.imageServer() + sCodePath) + ((typeof sSubPath === 'undefined' || sSubPath === null || sSubPath.length === 0) ? '' : sSubPath + '/'));
				retPath = ((bWebFile) ? sSitePath : oSSU.imageServer() + sCodePath) + ((typeof sSubPath === 'undefined' || sSubPath === null || sSubPath.length === 0) ? '' : sSubPath + '/');
				return retPath;
			}
		}
		//gSBU.log('Survey.site.settings.filepath - null');
		return null; // no match for domain or path
	},
	currentDomain : function () {
		"use strict";
		//gSBU.log('Survey.site.settings.currentDomain:start');
		var i,
			oSSS = Survey.site.settings;
		for (i = 0; i < oSSS.sites.length; i += 1) {
			if ((oSSS.currentHost.indexOf(oSSS.sites[i].webPre) > -1 || oSSS.currentHost.indexOf(oSSS.sites[i].sslWebPre) > -1 || oSSS.currentHost.indexOf(oSSS.sites[i].files) > -1 || oSSS.currentHost.indexOf(oSSS.sites[i].sslFiles) > -1) && (oSSS.currentHost.indexOf(oSSS.sites[i].domain) > -1)) {
				return oSSS.sites[i].domain;
			}
		}
	},
	currentDomainPrefix : function () {
		"use strict";
		//gSBU.log('Survey.site.settings.currentDomainPrefix:start');
		var oSSS = Survey.site.settings,
			oSSU = Survey.site.utils;
		return oSSS.currentHost.replace(':' + oSSS.currentSitePort, '').replace('.' + oSSU.currentDomain(), '');
	}
};

Survey.test.prototype = {};

Survey.test.utils = {
	setTestCookie : function () {
		"use strict";
		//gSBU.log('Survey.test.utils.setTestCookie:start');
		var oSBUC = gSBU.cookies;
			//oSCSC = Survey.currentSurvey.settings.cookies;
		oSBUC.set(gSTCI.name, 'testing', gSTCI.length);
		oSBUC.remove(gSBUCI_invite.name);
		oSBUC.remove(gSBUCI_visit.name);
		oSBUC.remove(gSBUCI_optedout.name);
		//gSBU.log('Survey.test.utils.setTestCookie:end');
	},
	clearTestCookie : function () {
		"use strict";
		//gSBU.log('Survey.test.utils.clearTestCookie:start');
		gSBU.cookies.remove(gSTCI.name);
		//gSBU.log('Survey.test.utils.clearTestCookie:end');
	},
	clearAllCookies : function () {
		"use strict";
		//gSBU.log('Survey.test.utils.clearAllCookies:start');
		var oSBUC = gSBU.cookies;
		oSBUC.remove(gSTCI.name);
		oSBUC.remove(gSBUCI_invite.name);
		oSBUC.remove(gSBUCI_visit.name);
		oSBUC.remove(gSBUCI_optedout.name);
		//gSBU.log('Survey.test.utils.clearAllCookies:end');
	}
};

Survey.base.init = function () {
	"use strict";
	//gSBU.log('Survey.base.init:start');
	if (gSBU.checkForSurvey()) {
		var oSCS = Survey.currentSurvey.settings,
			i;
		//gSBU.log('Survey.base.init:load the custom survey code');
		//check for language
		if (Survey.lang.indexOf('en') < 0) {
			//set percentage for "other" language
			for (i = 0; i < oSCS.translations.length; i += 1) {
				if (Survey.lang.indexOf(oSCS.translations[i].lang) > -1) {
					oSCS.percentage = oSCS.translations[i].percentage;
				}
			}
		}
		//check for testing cookie
		if (gSBU.cookies.get(gSTCI.name)) {
			//gSBU.log('Survey.base.init:testing cookie found');
			oSCS.percentage = 100;
		}
		//check for opt out cookie
		if (gSBU.cookies.get(gSBUCI_optedout)) {
			//gSBU.log('Survey.base.init:opted out cookie found');
			return;
		}
		//check to see if invite is under way
		if (gSBU.cookies.get(gSBUCI_invite.name) && ((gSBU.cookies.getvalue(gSBUCI_invite.name, 'status') === 'invited_accepted_closed') || (gSBU.cookies.getvalue(gSBUCI_invite.name, 'status') === 'invited_accepted_surveyed'))) {
			//gSBU.log('Survey.base.init:invited:accepted:closed|surveyed');
			//watch was closed by user or survey opened survey - remove the visit cookie
			gSBU.cookies.remove(gSBUCI_visit.name);
			return;
		}
		if (gSBU.cookies.get(gSBUCI_invite.name) && gSBU.cookies.getvalue(gSBUCI_invite.name, 'status') === 'invited_accepted') {
			//invite or watch still underway
			//survey presented
			//gSBU.log('Survey.base.init:previously invited:set interval timer to set visit cookie');
			oSCS.updateVisit.interval = window.setInterval('Survey.base.utils.updateVisit()', (oSCS.updateVisit.timer * 1000));
			window.onbeforeunload = function () {
				//alert('watch window unloading');
				//gSBU.log('Survey.base.init:previously invited:make sure visit is updated right before leaving current page');
				gSBU.updateVisit();
			};
			return;
		}
		//return a random integer between 0 and 100 - use percentage in settings
		if (gSBU.chance(oSCS.percentage) && !gSBU.cookies.get(gSBUCI_invite.name)) {
			//invite has not been given
			//check rules
			//if(oSCS.invite.rules.start === '*' || typeof oSCS.invite.rules.exclude === 'undefined'
			//	|| (typeof oSCS.invite.rules.exclude !== 'undefined' && document.location.href.indexOf(oSCS.invite.rules.exclude) === -1)){
			//guest gets the survey
			//call invite
			setTimeout('Survey.base.interact.inviteGuest()', oSCS.wait * 1000);
			//}
		}
	} else {
		//no survey
		//gSBU.log('Survey.base.init:no survey');
		return;
	}
	//gSBU.log('Survey.base.init:end');
};

Survey.watch.init = function () {
	"use strict";
	//gSBU.log('Survey.watch.init:start');
	if (gSBU.checkForSurvey()) {
		//gSBU.log('Survey.watch.init:load the custom survey code');
		//document.domain = Survey.site.utils.currentDomain();
		var oSCSSCO = Survey.currentSurvey.settings.checkOpener;
		//setInterval for checkOpener
		oSCSSCO.interval = window.setInterval('Survey.watch.interact.checkOpener()', (oSCSSCO.timer * 1000));
		window.onbeforeunload = function () {
			//alert('watch window unloading');
			//gSBU.log('watch window unloading');
			Survey.watch.interact.closeWatch();
		};
	}
	//gSBU.log('Survey.watch.init:end');
};
Survey.test.init = function () {
	"use strict";
	//gSBU.log('Survey.test.init:start');
	if (gSBU.checkForSurvey()) {
		//gSBU.log('Survey.test.init:load the custom survey code');
		//not much to do here as survey is initialized
		return;
	}
	//gSBU.log('Survey.test.init:no survey');
};
//load init code when the site is loaded
Survey.initialization = function () {
	"use strict";
	//gSBU.log('Survey.intialization - start');
	var constSURVEYNAME = 'confirmit',
		i,
		len,
		oMetaTags,
		oMeta;
	Survey.currentSurveyName = constSURVEYNAME;
	Survey.lang = document.getElementsByTagName('html')[0].lang || navigator.browserLanguage || navigator.language || 'en-US';
	//TSA : 201206080115 : Added a global vars for Survey.base.utils.CookieInfo - set here for each cookie type
	if (gSBU.checkForSurvey()) {
		gSBUCI_invite = gSBU.getCookieInfo('invite');
		gSBUCI_visit = gSBU.getCookieInfo('visit');
		gSBUCI_optedout = gSBU.getCookieInfo('optedout');
		gSTCI = Survey.test.cookie;
	}
	Survey.dev = (Survey.site.utils.currentDomainPrefix() === "www") ? false : true;
	gSBU.setBrowserInfo();
	//TSA : 201205231415 : code injection update
	gSBU.files.dom_loaded = true;
	len = gSBU.files.onload_queue.length;
	for (i = 0; i < len; i += 1) {
		gSBU.files.onload_queue[i]();
	}
	gSBU.files.onload_queue = null;
	//end - code injection update
	if (window.opener) {
		//gSBU.log('Survey.watch.init - call');
		// we're in the watch window
		Survey.watch.init();
	} else if (document.location.href.indexOf('/manage.html') > -1) {
		//gSBU.log('Survey.test.init - call');
		Survey.test.init();
		oMetaTags = document.getElementsByTagName("meta");
		len = oMetaTags.length;
		for (i = 0; i < len; i += 1) {
			oMeta = oMetaTags[i];
			if (oMeta.name === "code-version") {
				document.getElementById('pgVersion').innerHTML = "Page version: " + oMeta.content;
			}
		}
		document.getElementById('jsVersion').innerHTML = "Code version: " + Survey.version;
	} else {
		//gSBU.log('Survey.base.init - call');
		//we're in the site
		Survey.base.init();
	}
	//gSBU.log('Survey - initialized');
};
//load init code when the site is loaded
jQuery(document).ready(function () {
	"use strict";
	//TSA : 201206080115 : Added a global var for Survey.base.utils - set it here
	gSBU = Survey.base.utils;
	//gSBU.log('Page - ready');
	Survey.initialization();
});