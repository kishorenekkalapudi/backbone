/* Src File:"_analytics/javascript/analytics.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

/**
 * Included files: liveManager.js, s_code.js, survey.js, trackEvent.js, trackingFiles.js
 * @description This file is the amalgam of all analytics javascript.
 */
function analyticsError(e)	{
	//console.log(e);
}

//dependencies
/* START OF LINE: 11 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* Src File:"_analytics/javascript/liveManager.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

/**
 * @name liveManager
 * @version 201310042245
 *
 * @description A utility script for controlling when other javascript scripts are loaded on the page.
 * The script can delay loading of a script until the footer of the page is loaded.
 */

var Lm = {
	q:{}, // Q of events to execute after scripts load?  Used by trackEvent.INIT?
	l:[], // The queue of scripts loaded or to be loaded on the page.  Queue is filled by Function A and consumed by function LOAD.
	f:{}, // Todo: define
	p:0,  // Todo: define..  Number representing current script to load?  
	o:0,  // Todo: define..  Constant representing 0?
	h:location.hostname,
	/**
	 * Function A - Load or Queue Scripts
	 *
	 * Either add object with script metadata (a) to Lm.l or create a script object on the DOM right away based on the boolean value of a.c.
	 *
	 * @param a - a passed in object that holds metadata for the script to be loaded.
	 *        a.a - Script Name
	 *        a.b - Script URI/Location
	 *        a.c - When to load  (0 - load now, 1 - Queue)
	 *        a.d - not used by this function (contains script to be eval'd after script loads and callsback).
	 *        a.e - Code to eval before the "script" is added to the page
	 * @param b - only used locally Todo: refactor variable declaration
	 * @param c - only used locally Todo: refactor variable declaration
	 * @param d - only used locally Todo: refactor variable declaration
	 */
	A:function(a, b, c, d) {  // Todo Refactor:  The function currently violates its contract by declaring variables in its constructor.
		if (a.c) this.l.push(a); // Boolean evaluation.  If a.c is 1 (True) then queue load request.
		if (this.config.load[a.a]) { // Boolean evaluation.  Script name (a.a) has to be in the Lm.config object (and set to 1/true) or don't load.
			if (typeof a.e !== "undefined") {
				try {
					eval(a.e); // Things to eval before the "script" loads
				} catch(e) {
					//removed console.log
					analyticsError(e);
				}
			}
			//EAM: replaced old script loading with simpler loading
			if(typeof a.b !== "undefined")	{
				try	{
					eval(a.b);
				}	catch(e)	{
					analyticsError(e);
				}
			}
		}
	},
	/**
	 * Function LOAD - Callback for scripts called after by external scripts after they load -- via Lm.LOAD("scriptName").
	 *
	 * @param a - The name of the script that is calling back
	 * @param b - only used locally Todo: refactor variable declaration
	 * @param c - only used locally Todo: refactor variable declaration
	 * @param d - only used locally Todo: refactor variable declaration
	 */
	LOAD:function(a, b, c, d) { // Todo Refactor:  The function currently violates its contract by declaring variables in its constructor.
		this.f[a] = 0; // Todo: Should this be 'this' or 'Lm'?
		c = this.l.length;
		for (b = this.p; b < c; b++) { // Iterate from current position to the end of the queue.  Todo refactor: implement a FIFO shift, and get rid of 'p'?
			d = this.l[b];  // this is the object that was queued by the A function (earlier)
			if (this.f[d.a] == 0) {
				this.f[d.a] = ++this.p; // increment current position in the list.
				if (typeof d.d !== "undefined") {
					try {
						eval(d.d); // Things to eval now that the script (a) has loaded.
					} catch(e) {
						//replaced console.log
						analyticsError(e);
					}
				}
			} else return;
		}
		if (this.p == c && this.o == 0) {
			this.o = 1;
		}
	},
	/**
	 * Function EV - Add EventListner
	 * @param a - Element
	 * @param b - Event
	 * @param c - Function/Callback
	 * @param d - if d is 1, then instrument element with "on"+event (IE specific)?
	 */
	EV:function(a, b, c, d) {
		if (a.addEventListener) {
			a.addEventListener(b, c, false);
		} else if (a.attachEvent) {
			a.attachEvent(((d == 1) ? "" : "on") + b, c);
		}
	}
};	//end of Lm object

Lm.config = { // Load and configuration object
	domain:".bestbuy.com",
	sc_acct:"bbymainprod",
	sc_kiosk:"bbykioskprod",
	sc_esp:"bbyspanishprod",
	sc_acctdev:"bbymaindev",
	sc_kioskdev:"bbykioskdev",
	sc_espdev:"bbyspanishdev",
	//TSA : 201205201800 : set this dynamically
	//TSA : 201205311415 : updated to use Lm.h and to add stores.
	//TSA : 201211182010 : added m and m-ssl for mDot pages scraping dotCom for content
	dev: ((Lm.h.indexOf("www.bestbuy.com") === 0 
			|| Lm.h.indexOf("www-ssl.bestbuy.com") === 0 
			|| Lm.h.indexOf("kiosk.bestbuy.com") === 0
			|| Lm.h.indexOf("kiosk-ssl.bestbuy.com") === 0
			|| Lm.h.indexOf("espanol.bestbuy.com") === 0
			|| Lm.h.indexOf("espanol-ssl.bestbuy.com") === 0
			|| Lm.h.indexOf("stores.bestbuy.com") === 0
			|| Lm.h.indexOf("m.bestbuy.com") === 0
			|| Lm.h.indexOf("m-ssl.bestbuy.com") === 0) ? 0 : 1),
	//TSA : 201310042225 : cj (commission junction) tag removed - no longer needed
	//TSA : 201310042245 : bluekai tag and code removed - implemented via BrightTag TMS
	load:{trackEvent:1,s_code:1,clickStream:1,ace:1,cnet:1}
};	//end of Lm.config

Lm.lc = "201310042245"; // Version for cache busting
Lm.pre = imgServer + "js/tracking/"; // relative URI for scripts //TSA : 201205181400 : use imgServer for Path
Lm.lite = false;

//these Lm.A calls need to happen when the page is done loading
$(function ()	{
	Lm.A({a:"s_code",c:1}); // Omniture script
	Lm.A({a:"trackEvent",c:1,d:"trackEvent.INIT();if(track.catId!=='pcat17005'){trackEvent.event('event.view',track);}"});  // TrackEvent
	
	//TSA : 201206112030 : clickStream tracking added
	//TSA : 20120801 : bUseClickStream is set in CSEE assets 1218137429655, 1218349623155, and 1218245281850
	if (typeof bUseClickStream !== "undefined" && bUseClickStream)	{
		Lm.A({a:"clickStream",b:"includeClickStream()",c:1,d:"Lm.clickStream.INIT(track);"});  // clickStream
	}
	
	//TSA : 201310042225 : cj (commission junction) tag removed - no longer needed
	
	if (typeof track.ea !== "undefined" && track.ea !== "" && typeof track.catId !== "undefined")	{
		Lm.A({a:"ace",b:"includeAce()",c:1,d:"Lm.ace.INIT(track);"});
	}

	if (!Lm.lite)	{
		Lm.A({a:"cnet",b:"includeCnet()",c:0}); // Cnet
	}
	
	//called here instead of on page load as we need the other stuff above to fire
	if($('html').hasClass('ie'))	{
		setTimeout(function()	{
			Lm.ONLOAD();
		}, 1000);
	}	else	{
		$(window).load(function()	{
			Lm.ONLOAD();
		});
	}
	//some scripts depend on Lm.o to tell when LiveManager is done loading
	Lm.o = 1;
});

Lm.ONLOAD = function() {
	//replace calling Lm.LOAD in all the files
	if(typeof Lm.ace !== 'undefined')	{
		Lm.ace.INIT(track);
	}
	if(typeof trackEvent !== 'undefined')	{
		trackEvent.INIT();
		if (track.catId !== 'pcat17005'){
			trackEvent.event('event.view', track);
		}
	}
	if(typeof Lm.clickStream !== 'undefined')	{
		Lm.clickStream.INIT(track);
	}
	//old ONLOAD calls
	//TSA : 201310042245 : bluekai tag and code removed - implemented via BrightTag TMS
	if (typeof Lm.ace !== "undefined")	{
		Lm.ace.SEND();
	}
	if (typeof Lm.cnet !== "undefined")	{
		Lm.cnet.INIT(track);
	}
	if(track.templateName == "PDH" && ($.url().fsegment().toString().indexOf('reviews') !== -1 || $.url().segment().toString().indexOf('reviews') !== -1))	{
		fireAnalyticsEvents(null, true, true);
	}
};
Lm.ONERROR = function(a, b, c) {
	if (Lm.erf != 1) {
		Lm.error = (typeof a == "string") ? (a + "-" + c) : "Unknown";
		Lm.erf = 1;
	}
};
//EAM: commented to prevent duplicate and early events from firing
//Lm.EV(window, "load", Lm.ONLOAD, null);
Lm.EV(window, "error", Lm.ONERROR, null);
/* END OF LINE: 11 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* START OF LINE: 14 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* Src File:"_analytics/javascript/s_code.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

/* SiteCatalyst code version: H.25.3.
Copyright 1996-2013 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com */

var s_account="";
var s=s_gi(s_account);

/* Code block to fix the issue with Safari Top Sites refresh */
if(navigator && navigator.loadPurpose && navigator.loadPurpose == 'preview') {
	s.t=new Function("return ''");
}
/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
//s.charSet="UTF-8";
/* Conversion Config */
//s.currencyCode="USD";
/* Link Tracking Config */
s.trackDownloadLinks=true;
s.trackExternalLinks=true;
s.trackInlineStats=true;
s.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
s.linkInternalFilters="javascript:,bestbuy.com";
s.linkLeaveQueryString=false;
s.linkTrackVars="None";
s.linkTrackEvents="None";

/* WARNING: Changing any of the below variables will cause drastic
changes to how your visitor data is collected.  Changes should only be
made when instructed to do so by your account manager.*/

/* Plugin Config */
s.usePlugins=true;
s.doPlugins = function (s) {
	/* TA: 201111071422: PLA DSA */
	s.extensionType=s.getQueryParam('extensionType');
	
	if(s.extensionType&&(s.extensionType.indexOf('pla')==0
			|| s.extensionType.indexOf('pe')==0
			|| s.extensionType.indexOf('dsa')==0)){
		
		s.eVar74=s.extensionType+":";
		
		if(!s.getQueryParam('s_kwcid')){
			s.eVar48='Google Extensions';
		}
		
		s.skuId=s.getQueryParam('skuId');
		s.extensionPath=s.getQueryParam('extensionPath');
		
		if(s.skuId){
			s.eVar74=s.eVar74+s.skuId;
		}else if(s.extensionPath){
			s.eVar74=s.eVar74+s.extensionPath;
		}
	}
	
	if(s.getQueryParam('s_kwcid')&&!s.eVar74){
		s.eVar74='SearchCenter';
	}
	
	/* manageQueryParam v1.2 */
	s.pageURL=s.manageQueryParam('s_kwcid',1,1);

	/* clickPast */
	s.tempSCCT = s.getQueryParam('s_kwcid');
	s.tempSCCT = s.getValOnce(s.tempSCCT,'s_tempSCCT',0);
	s.clickPast(s.tempSCCT,'event48','event49');


	/*prev page:link check and remove if in header or footer*/
	if(s.prop13){
		if(s.prop13.indexOf('hdr_')>=0||s.prop13.indexOf('ubr_')>=0||s.prop13.indexOf('ft_')>=0){
			s.prop13='';
		}
		s.eVar51=s.prop13;
		if(s.linkTrackVars.indexOf('prop13')>=0){
			s.linkTrackVars=s.linkTrackVars+',eVar51';
		}
	}

	/*TrackTnT*/
	s.tnt = s.trackTNT();
	
	//TSA - 201207261800 - adding CampaignID and SubscriberID for Exact Target integration
	/* Collect message ID and recipient ID for genesis integration */
	var s_recipient = s.getQueryParam('SubscriberID');
	var s_message = s.getQueryParam('CampaignID');
	if (s_recipient) { s.eVar53=s_recipient; }
	if (s_message) { s.eVar52=s_message; }

	//TSA - 2012011081145 - referrer was google (logged-in user) ... reset keyword
	s.referrer=s.repl(document.referrer,'q=&','q=%5Bkeyword%20not%20specified%5D&');
	
	//TSA - 201306271355 - added per dio request - code from web analytics demystified
	/*Monetate Data Collection*/
	window.MT_flag=window.MT_flag||s.c_r('mt.s_monetateFlag');
	window.SC_flag=window.SC_flag||'';
	if(MT_flag){
		s.eVar65='Monetate;'+MT_flag;
	}else{
		SC_flag='no test';
	}
	
};
s.visitorNamespace="bestbuy";

s.trackingServer="metrics.bestbuy.com";
s.trackingServerSecure="smetrics.bestbuy.com";
s.dc=122;

/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here.                 */

/*
 * Plugin: getQueryParam 2.3
 */
s.getQueryParam = new Function("p","d","u",""
+"var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
+"on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
+".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"
+"1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="
+"=p.length?i:i+1)}return v");
s.p_gpv = new Function("k","u",""
+"var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
+"=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf = new Function("t","k",""
+"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+"epa(v)}return ''");

/*
 * Plugin: manageQueryParam v1.2 - swap parameters in query string
 */
s.manageQueryParam=new Function("p","w","e","u",""
+"var s=this,x,y,i,qs,qp,qv,f,b;u=u?u:(s.pageURL?s.pageURL:''+s.wd.lo"
+"cation);u=u=='f'?''+s.gtfs().location:u+'';x=u.indexOf('?');qs=x>-1"
+"?u.substring(x,u.length):'';u=x>-1?u.substring(0,x):u;x=qs.indexOf("
+"'?'+p+'=');if(x>-1){y=qs.indexOf('&');f='';if(y>-1){qp=qs.substring"
+"(x+1,y);b=qs.substring(y+1,qs.length);}else{qp=qs.substring(1,qs.le"
+"ngth);b='';}}else{x=qs.indexOf('&'+p+'=');if(x>-1){f=qs.substring(1"
+",x);b=qs.substring(x+1,qs.length);y=b.indexOf('&');if(y>-1){qp=b.su"
+"bstring(0,y);b=b.substring(y,b.length);}else{qp=b;b='';}}}if(e&&qp)"
+"{y=qp.indexOf('=');qv=y>-1?qp.substring(y+1,qp.length):'';var eui=0"
+";while(qv.indexOf('%25')>-1){qv=unescape(qv);eui++;if(eui==10)break"
+";}qv=s.rep(qv,'+',' ');qv=escape(qv);qv=s.rep(qv,'%25','%');qv=s.re"
+"p(qv,'%7C','|');qv=s.rep(qv,'%7c','|');qp=qp.substring(0,y+1)+qv;}i"
+"f(w&&qp){if(f)qs='?'+qp+'&'+f+b;else if(b)qs='?'+qp+'&'+b;else qs='"
+"?'+qp}else if(f)qs='?'+f+'&'+qp+b;else if(b)qs='?'+qp+'&'+b;else if"
+"(qp)qs='?'+qp;return u+qs;");
/*
* Plugin: clickPast - version 1.0
*/
s.clickPast = new Function("scp","ct_ev","cp_ev","cpc",""
+"var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc)"
+"{cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev"
+";s.c_w(cpc,1,0);}else{if(s.c_r(cpc)>=1){s.events=ev+cp_ev;s.c_w(cpc"
+",0,0);}}}");
s.p_fo = new Function("n",""
+"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
+"new Object;return 1;}else {return 0;}");
/*
 * Plugin: getValOnce_v1.0
 */
s.getValOnce = new Function("v","c","e",""
+"var s=this,a=new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c"
+");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return"
+" v==k?'':v");
/*
 * Plugin Utility: Replace v1.0
 */
s.repl = new Function("x","o","n",""
+"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
+"substring(i+o.length);i=x.indexOf(o,i+l)}return x");

/*
* TNT Integration Plugin v1.0
*/
s.trackTNT = new Function("v","p","b",""
+"var s=this,n='s_tnt',p=p?p:n,v=v?v:n,r='',pm=false,b=b?b:true;if(s."
+"getQueryParam){pm=s.getQueryParam(p);}if(pm){r+=(pm+',');}if(s.wd[v"
+"]!=undefined){r+=s.wd[v];}if(b){s.wd[v]='';}return r;");


/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s.version='H.25.3';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(s.rep(m,\"\\\\\",\"\\\\"
+"\\\\\"),\"\\n\",\"\\\\n\"),\"\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}retur"
+"n y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=function(o){return o};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;ret"
+"urn 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',f=\"+~!*()'\",i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComponent("
+"x);for(i=0;i<f.length;i++) {n=f.substring(i,i+1);if(x.indexOf(n)>=0)x=s.rep(x,n,\"%\"+n.charCodeAt(0).toString(16).toUpperCase())}}else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.su"
+"bstring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+"
+"','%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00"
+"'+x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x){var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Function('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unesc"
+"ape(x)}return y');return tcf(x)}else return unescape(x)}return y};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r"
+";z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a=a.substring(0,c);if(t.substring("
+"0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf'"
+",f);return s.fsg};s.mpc=function(m,a){var s=this,c,l,n,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(v&&v=='prerender'){if(!s.mpq){s.mpq=new Array;l=s.sp('webkitvisibilitychange,visi"
+"bilitychange',',');for(n=0;n<l.length;n++){s.d.addEventListener(l[n],new Function('var s=s_c_il['+s._in+'],c,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(s.mpq&&v==\"visible\"){whil"
+"e(s.mpq.length>0){c=s.mpq.shift();s[c.m].apply(s,c.a)}s.mpq=0}'),false)}}c=new Object;c.m=m;c.a=a;s.mpq.push(c);return 1}return 0};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\")"
+";s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.li"
+"nkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostnam"
+"e,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'"
+".','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<"
+"0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-6"
+"0);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':''"
+");return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i"
+";l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tc"
+"f=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s"
+".wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0"
+";return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return "
+"s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)fo"
+"r(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=function(){};s.mr=function(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackin"
+"gServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un),im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase()"
+";else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.version+(s.t"
+"cn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047)}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[u"
+"n]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;retur"
+"n ''}imn+='_'+s.rc[un];s.rc[un]++}if(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im=s.wd[imn];if("
+"!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.bcr();s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nr"
+"s){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if(s.useForcedLinkTracking||s.bcf){if(!s.forcedLinkTrackingTimeout)s.forcedLinkTrackingTimeout=250;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'"
+"].bcr()',s.forcedLinkTrackingTimeout);}else if((s.lnk||s.eo)&&(!ta||ta=='_self'||ta=='_top'||(s.wd.name&&ta==s.wd.name))){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return '"
+"'}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=="
+"'s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,l=0,q,a,b='',c='',t;if(x&&x.length>255){y=''+x"
+";i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase();j=0;if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='https://')j+=8;i=h.indexOf(\"/\",j);if(i>0){h=h."
+"substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l=',q,ie,start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l=',p,ei,';if(l&&q){a=s.sp(q,'&');if(a&&a.length"
+">1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'+c;else c=''}i=253-(q.length-c.length)-y.lengt"
+"h;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f){var s=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextData\")k=\"c\";if(v){for(sk in v)if((!f||sk.subst"
+"ring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=0)&&(!Object||!Object.prototype||!Object.prototype[sk])){nfm=0;if(nfl)for(nfn=0;nfn<nfl.length;nfn++)if(sk.substring(0,nf"
+"l[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.substring(f.length);if(sk.length>0){nke=sk.indexOf('.');if(nke>0){nk=sk.substring(0,nke);nf=(f?f:'')+nk+'.';if(!n"
+"fl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='boolean'){if(sv)sv='true';else sv='false'}if(sv){if(vfp=='retrieveLightData'&&f.indexOf('.contextData.')<0){sp=sk."
+"substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='channel')sk='ch';else if(sk=='campaign')sk='v0';else if(s.num(ss)){if(sp=='prop')sk='c'+ss;else if(sp=='eVar')sk='v'+"
+"ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}if(qs!='')qs+='&.'+k}return qs};s.hav=function(){var s=this,qs='',l,fv='',"
+"fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s.vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType){fv=s.linkTrackVars;fe=s.linkTrackEvents;if(s.pe){mn=s.pe.substring("
+"0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;if(fe){fe=','+fe+',';if(fv)fv+=',events,'}if (s.events2)e=(e?',':'')+"
+"s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(!v)if(k=='events'&&e){v=e;e=''}if(v&&(!fv||fv.indexOf(','+k+',')>=0)&&k!='linkName'&&k!="
+"'linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pageURL'){q='g';if(v.length>255){s.pageURLRest=v.substring(255);v=v.substrin"
+"g(0,255);}}else if(k=='pageURLRest')q='-g';else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'){q='vmf';if(s.ssl&"
+"&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1"
+"';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider')q='vvp';else if(k"
+"=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';else if(k=='javascri"
+"ptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q='ct';else if(k=='h"
+"omepage')q='hp';else if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextData'){qs+=s.s2q('c',s[k],fv,k,0);v=''}else if(k"
+"=='lightProfileID')q='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProfileID)v=''}else if(k=='retrieveLightProfiles')"
+"q='mtsr';else if(k=='deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eV"
+"ar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'"
+"';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLow"
+"erCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h"
+"=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.substring(0,1)!='#'&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','lt"
+"ef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=this;s.t();s.lnk=0;if(b)return this[b](e);return true');s.bcr=function(){var s=this;if(s."
+"bct&&s.bce)s.bct.dispatchEvent(s.bce);if(s.bcf){if(typeof(s.bcf)=='function')s.bcf();else if(s.bct&&s.bct.href)s.d.location=s.bct.href}s.bct=s.bce=s.bcf=0};s.bc=new Function('e','if(e&&e.s_fe)retur"
+"n;var s=s_c_il['+s._in+'],f,tcf,t,n,nrs;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;if(!s.bbc)s.useForcedLinkTracking=0;else if(!s.useForcedLinkTracking){s.b.removeEventListener(\"click\",s.bc,true);"
+"s.bbc=s.useForcedLinkTracking=0;return}else s.b.removeEventListener(\"click\",s.bc,false);s.eo=e.srcElement?e.srcElement:e.target;nrs=s.nrs;s.t();s.eo=0;if(s.nrs>nrs&&s.useForcedLinkTracking&&e.tar"
+"get){t=e.target.target;if(e.target.dispatchEvent&&(!t||t==\\'_self\\'||t==\\'_top\\'||(s.wd.name&&t==s.wd.name))){e.stopPropagation();e.stopImmediatePropagation();e.preventDefault();n=s.d.createEve"
+"nt(\"MouseEvents\");n.initMouseEvent(\"click\",e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget);n.s_f"
+"e=1;s.bct=e.target;s.bce=n;}}');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o."
+"protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<"
+"0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;if(o.tagUrn||(o.scopeName&&o.scopeName.toUpperCase()!='HTML'))return '';t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE')t='';if(t){if"
+"((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.protocol;c="
+"o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' ','');x=2}else "
+"if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s_oidt=x}}"
+"return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&s.un.indexOf('"
+",')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,',','rq',0)};s."
+"sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[un]=q;return 0}"
+";s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Object.prototype"
+"||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'='+s.ape("
+"x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o.onclick?\"\"+"
+"o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie||!s.ismac||s.a"
+"pv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener){if(s.n&&s.n.userAgent.indexOf('WebKit')>=0&&s.d.createEvent){s.bbc=1;s.useForcedLinkTracking=1;s.b"
+".addEventListener('click',s.bc,true)}s.b.addEventListener('click',s.bc,false)}else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=function(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+"
+"s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e))return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&"
+"m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.substring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s"
+".uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowerCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.to"
+"LowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};s.sa=function(un){var s=this;if(s.un&&s.mpc('sa',arguments))return;s.un=un;"
+"if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r,l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Ar"
+"ray;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','"
+"_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r"
+"._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s[g+\"_c\"],m,x,f=0;if(s.mpc(\"m_a\",arguments))return;i"
+"f(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf(\""
+"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl.le"
+"ngth;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexOf("
+"'function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadModu"
+"le(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else g="
+"\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],o="
+"s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!o."
+"l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/javascr"
+"ipt\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,f2"
+")}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.voa=function(vo,r){var s=th"
+"is,l=s.va_g,i,k,v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData\")&&s[k])for(x in s[k])if(!v[x])v[x]=s[k][x];s[k]=v}}};s.vob=function("
+"vo){var s=this,l=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo"
+"=s.dll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0')"
+";s.dl=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.gfid=function(){v"
+"ar s=this,d='0123456789ABCDEF',k='s_fid',fid=s.c_r(k),h='',l='',i,j,m=8,n=4,e=new Date,y;if(!fid||fid.indexOf('-')<0){for(i=0;i<16;i++){j=Math.floor(Math.random()*m);h+=d.substring(j,j+1);j=Math.fl"
+"oor(Math.random()*n);l+=d.substring(j,j+1);m=n=16}fid=h+'-'+l;}y=e.getYear();e.setYear(y+2+(y<1900?1900:0));if(!s.c_w(k,fid,e))fid=0;return fid};s.applyADMS=function(){var s=this,vb=new Object;if(s"
+".wd.ADMS&&!s.visitorID&&!s.admsc){if(!s.adms)s.adms=ADMS.getDefault();if(!s.admsq){s.visitorID=s.adms.getVisitorID(new Function('v','var s=s_c_il['+s._in+'],l=s.admsq,i;if(v==-1)v=0;if(v)s.visitorI"
+"D=v;s.admsq=0;if(l){s.admsc=1;for(i=0;i<l.length;i++)s.t(l[i]);s.admsc=0;}'));if(!s.visitorID)s.admsq=new Array}if(s.admsq){s.vob(vb);vb['!visitorID']=0;s.admsq.push(vb);return 1}else{if(s.visitorI"
+"D==-1)s.visitorID=0}}return 0};s.track=s.t=function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/108"
+"00000)%10+sed,y=tm.getYear(),vt=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.g"
+"tfs(),ta=-1,q='',qs='',code='',vb=new Object;if(s.mpc('t',arguments))return;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc',"
+"'true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;"
+"if(a.forEach){j='1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next){j='1.7';if(a.reduce){j='1.8';if(j.trim){j='1.8.1';if(Date.pa"
+"rse){j='1.8.2';if(Object.create)j='1.8.5'}}}}}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.w"
+"d.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElement.offsetWidth;bh=s.d.documentElemen"
+"t.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Functi"
+"on('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';'"
+";if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugin"
+"s=p;s.td=1}if(vo){s.vob(vb);s.voa(vo)}s.fid=s.gfid();if(s.applyADMS())return '';if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);if(!s.abort){var l=s.wd.location,r=tfs.document.referrer;"
+"if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oid"
+"t,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if(!n||t=='BODY')o='';if(o){oc=o.onclick?''+o.onclick:'';i"
+"f((oc.indexOf('s_gs(')>=0&&oc.indexOf('.s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.li"
+"nkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');s.pev1=(h?s.ape(h):'');s.pev2=(l?s.ape(l):'')}else trk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.o"
+"t(o);i=o.sourceIndex;if(o.dataset&&o.dataset.sObjectId){s.wd.s_objectID=o.dataset.sObjectId;}else if(o.getAttribute&&o.getAttribute('data-s-object-id')){s.wd.s_objectID=o.getAttribute('data-s-objec"
+"t-id');}else if(s.useForcedLinkTracking){s.wd.s_objectID='';oc=o.onclick?''+o.onclick:'';if(oc){var ocb=oc.indexOf('s_objectID'),oce,ocq,ocx;if(ocb>=0){ocb+=10;while(ocb<oc.length&&(\"= \\t\\r\\n\""
+").indexOf(oc.charAt(ocb))>=0)ocb++;if(ocb<oc.length){oce=ocb;ocq=ocx=0;while(oce<oc.length&&(oc.charAt(oce)!=';'||ocq)){if(ocq){if(oc.charAt(oce)==ocq&&!ocx)ocq=0;else if(oc.charAt(oce)==\"\\\\\")o"
+"cx=!ocx;else ocx=0;}else{ocq=oc.charAt(oce);if(ocq!='\"'&&ocq!=\"'\")ocq=0}oce++;}oc=oc.substring(ocb,oce);if(oc){o.s_soid=new Function('s','var e;try{s.wd.s_objectID='+oc+'}catch(e){}');o.s_soid(s"
+")}}}}}if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else t"
+"rk=0}if(trk||qs){s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retri"
+"eveLightProfiles=s.deleteLightProfiles=''}s.sq(qs)}}}else s.dl(vo);if(vo)s.voa(vb,1);s.abort=0;s.pageURLRest=s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s"
+".pg)s.wd.s_lnk=s.wd.s_eo=s.wd.s_linkName=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo,f){var s=this;s.lnk=o;s.linkType=t;s.linkName=n;if(f){s.bct=o;s.bcf=f}s.t(vo)};s.trackLig"
+"ht=function(p,ss,i,vo){var s=this;s.lightProfileID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){var s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l."
+"length;i++){t=l[i];if(t&&t._c=='s_l'&&t.tagContainerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n"
+",x.u,x.d)}if(t.ml)for(x in t.ml)if(s[x]){y=s[x];x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf('s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i"
+"++){x=t.mmq[i];if(s[x.m]){y=s[x.m];if(y[x.f]&&typeof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=windo"
+"w;s.ssl=(s.wd.location.protocol.toLowerCase().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s."
+"n.userAgent;s.ns6=s.u.indexOf('Netscape6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft In"
+"ternet Explorer');s.isns=(apn=='Netscape');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if("
+"s.apv>3)s.apv=parseFloat(i)}else if(s.ns6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCha"
+"rCode(256)).toUpperCase();s.em=(i=='%C4%80'?2:(i=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='timestamp,dynamicVariablePrefix,visitorID,fid,vmk,visitorMigrationKey,visitorMigrationServer,v"
+"isitorMigrationServerSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCode,lightProfileID,lightStoreForSeconds,lightIncrementBy,r"
+"etrieveLightProfiles,deleteLightProfiles,retrieveLightData';s.va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='timestamp,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,contextData,lightProfileID,"
+"lightStoreForSeconds,lightIncrementBy';s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,events2,products,linkName,linkType';var n;for(n=1;"
+"n<=75;n++){s.vl_t+=',prop'+n+',eVar'+n;s.vl_m+=',prop'+n+',eVar'+n}for(n=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,reso"
+"lution,colorDepth,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,pageURLRest,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',tracki"
+"ngServer,trackingServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountM"
+"atch,trackDownloadLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTr"
+"ackVars,_1_referrer,un';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=new Object;s.retrieveLightData=new Object;if(!ss)s.wds();if(pg){s.wd.s_co=function(o){return o};s.wd.s_gs=function"
+"(un){s_gi(un,1,1).t()};s.wd.s_dc=function(un){s_gi(un,1).t()}}",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,j,x,s;if(un){un=un.toLowerCase();if(l)for(j=0;j<2;j++)for(i=0;i<l.length;i++){s=l[i];x=s._c;if((!x||x=='s_c'||(j>0&&x=='s_l'))&&(s.oun==un||(s.fs&&s.sa&&s.fs(s.oun,un)))){if(s.sa)s.sa(un);if(x=='s_c')return s}else s=0}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a<5||v.indexOf('Opera')>=0||u.indexOf('Opera')>=0)c=s_ft(c);if(!s){s=new Object;if(!w.s_c_in){w.s_c_il=new Array;w.s_c_in=0}s._il=w.s_c_il;s._in=w.s_c_in;s._il[s._in]=s;w.s_c_in++;}s._c='s_c';(new Function("s","un","pg","ss",c))(s,un,pg,ss);return s}
function s_giqf(){var w=window,q=w.s_giq,i,t,s;if(q)for(i=0;i<q.length;i++){t=q[i];s=s_gi(t.oun);s.sa(t.un);s.setTagContainer(t.tagContainerName)}w.s_giq=0}s_giqf()
try{Lm.s_code=s;}catch(ex){};
//EAM: removed Lm.LOAD("s_code") to prevent it from loading early
/* END OF LINE: 14 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* START OF LINE: 17 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* Src File:"_analytics/javascript/trackEvent.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */


/***
 * @name trackEvent
 * @version 2.02.201307231800
 *
 */
var trackEvent = {
	version : "201307231800", // Version for cache busting
	isInit : false, //has trackEvent been initialized?
	c : 0, // number of time _R has been called?
	pc : 0, // constant for 0?
	v : {}, // Right side of the 'map' which will contain Omniture values.
	b : {}, // The 'track' object on the page?
	p : {}, // trackEvent often is assigned to this.
	q : 0, // ???
	df : 0, // ??? //page and section definition
	pl : [], // Plugin array
	ple : [], // Plugin array for events?
	plc : 0, // Plugin count? Which plugin we're on?
	i : new Image(), // Image object
	ga : {}, // Google analytics?
	ud : "undefined", // constant for 'undefined'
	sCurrentProducts : "",
	sCookieProducts : "",
	pageLoadTracked : false, // has the initial page load call happened?
	cProduct : function() {
		'use strict';
		this.sku = "";
		this.quantity = 0;
		this.price = 0;
		this.ffType = 0;
		this.cost = 0;
		this.events = [];
		this.eVars = [];
		// Functions
		this.toProductString = function(bCalculatePrice) {
			var sProduct = ";",
				idx;

			sProduct += this.sku + ";" + this.quantity + ";" +
				((typeof bCalculatePrice !== 'undefined' && bCalculatePrice === true) ? (this.quantity * this.price) : this.price) +
				";"; //quantity * price required (for thank you page) to correctly track cart
			// Do events
			if (typeof this.events !== 'undefined' && this.events.length > 0) {
				for (idx = 0; idx < this.events.length - 1; idx += 1) {
					sProduct += this.events[idx];
					if ((idx + 1) < this.events.length) {
						sProduct += "|";
					}
				}
				sProduct += this.events[this.events.length - 1] + ";";

			} else {
				sProduct += ";";
			}

			// Do eVars
			if (typeof this.eVars !== 'undefined' && this.eVars.length > 0) {
				for (idx = 0; idx < this.eVars.length - 1; idx += 1) {
					sProduct += this.eVars[idx];
					if ((idx + 1) < this.eVars.length) {
						sProduct += "|";
					}
				}
				sProduct += this.eVars[this.eVars.length - 1] + ";";

			} else {
				sProduct += ";";
			}
			//              if (this.events != undefined && this.events.length == 0 && this.events.length == 0) {
			//              r += ";";
			//              }

			return sProduct;
		};
		this.addEvt = function(event) {
			if (typeof this.events === 'undefined') {
				this.events = [];
			}
			this.events.push(event);
		};
		this.addEVar = function(eVar) {
			if (typeof this.eVars === 'undefined') {
				this.eVars = [];
			}
			this.eVars.push(eVar);
		};
	},
	products : {//A container to put products in...
		list : [],
		add : function(oProduct) {
			'use strict';
			this.list.push(oProduct);
		},
		remove : function(sSkuId) {
			'use strict';
			var idx;
			for (idx = 0; idx < this.list.length; idx += 1) {
				if (this.list[idx] === sSkuId) {
					this.list.splice(idx, 1);
				}
			}
		},
		addList : function(arrProducts) {
			'use strict';
			this.list = arrProducts;
		},
		render : function(bCalculate) {
			'use strict';
			var sProducts = "",
				idx;
			if (this.list.length > 0) {
				for (idx = 0; idx < this.list.length - 1; idx += 1) {
					sProducts += this.list[idx].toProductString(bCalculate) + ",";
				}
				sProducts += this.list[this.list.length - 1].toProductString(bCalculate);
			}
			return sProducts;
		},
		findProduct : function(sSkuId) {
			'use strict';
			var idx;
			for (idx = 0; idx < this.list.length; idx += 1) {
				if (this.list[idx] === sSkuId) {
					return this.list[idx];
				}
			}
		},
		getProducts : function() {
			'use strict';
			return this.list;
		},
		getTrackProductsCookie : function() {
			'use strict';
			var oCookie = trackEvent._GetCookieValue(trackEvent.ns + '_product');
			if (typeof oCookie !== 'undefined' && oCookie.length > 0) {
				return unescape(oCookie);
			}
			return '';
		},
		saveTrackProductsCookie : function(sProductString) {
			'use strict';
			document.cookie = trackEvent.ns + '_product=' + ((sProductString.length > 0) ? escape(sProductString) : "") + ";;path=/;domain=" + Lm.config.domain + ";";
			return;
		},
		getInCartCookie : function() {
			'use strict';
			var oCookie = trackEvent._RC();
			if (typeof oCookie !== 'undefined' && typeof oCookie.inCart !== 'undefined' && oCookie.inCart.length > 0) {
				return unescape(oCookie.inCart);
			}
			return '';
		},
		saveInCartCookie : function(sProductString, sType) {
			'use strict';
			if (typeof sType !== 'undefined' && sType.length > 0) {
				trackEvent._SaveCookie('inCart', sProductString, sType);
			} else {
				trackEvent._SaveCookie('inCart', sProductString);
			}
			return;
		},
		getCartItemCount : function() {
			'use strict';
			var sCartItems = trackEvent._GetCookieValue('CartItemCount');
			if (typeof sCartItems !== 'undefined' && sCartItems.length > 0) {
				return parseInt(sCartItems, 10);
			}
			return 0;
		},
		extractProductObj : function(sProduct) {
			'use strict';
			var oProduct = {
					sku : '',
					qty : '',
					price : '',
					events : [],
					evars : []
				},
				arrProduct = sProduct.split(';');
			if (typeof sProduct !== 'undefined' && sProduct.length > 0 && arrProduct[1].length > 0) {
				oProduct.sku = arrProduct[1];
				oProduct.qty = ((arrProduct[2].length > 0) ? arrProduct[2] : '');
				oProduct.price = ((arrProduct[3].length > 0) ? arrProduct[3] : '');
				oProduct.events = ((arrProduct[4].length > 0) ? arrProduct[4].split('|') : []);
				oProduct.evars = ((arrProduct[5].length > 0) ? arrProduct[5].split('|') : []);
			} else {
				oProduct = null;
			}
			return oProduct;
		},
		baseProductString : function(sProduct) {
			'use strict';
			var oProd = this.extractProductObj(sProduct),
				sProd = null;
			if (oProd !== null) {
				sProd = ';' + oProd.sku + ';' + oProd.qty + ';' + oProd.price + ';;';
			}

			return sProd;
		},
		fullProductString : function(sProduct) {
			'use strict';
			var oProd = this.extractProductObj(sProduct),
				sProd = null;
			if (oProd !== null) {
				sProd = ';' + oProd.sku + ';' + oProd.qty + ';' + oProd.price + ';' + oProd.events.join('|') + ';' + oProd.evars.join('|');
			}

			return sProd;
		}
	},

	/**
	 *
	 * @method _S - Set? Omniture value.
	 *
	 * maps the incoming variable 'b' to 'v' and 'this.b' using the map and the
	 * variable name 'a' 'v' contains the value mapped to the Omniture
	 * parameters 'b' contains the original variables and their values
	 *
	 * @param paramNameBBY -
	 *            BBY internal value (left-side of map)
	 * @param paramNameOmniture -
	 *            Omniture value (right-side of map)
	 * @param sAppend -
	 *            Append to existing Omniture "v" value? If an "a" is passed in.
	 * @param d -
	 *            TODO refactor: NEVER PASSED IN. Only used locally.
	 * @param e -
	 *            TODO refactor: NEVER PASSED IN. Only used locally.
	 * @return void
	 */
	_S : function(paramNameBBY, paramNameOmniture, sAppend) {
		'use strict';
		//try {
		var arrMapItems,
			idx;
		if (typeof this.map[paramNameBBY] !== 'undefined') {
			arrMapItems = this.map[paramNameBBY].split(",");

			for (idx = 0; idx < arrMapItems.length; idx += 1) {
				if (typeof sAppend !== "undefined" && sAppend === "a" && typeof this.v[arrMapItems[idx]] !== "undefined") {
					this.v[arrMapItems[idx]] += "," + paramNameOmniture;
				} else {
					this.v[arrMapItems[idx]] = paramNameOmniture;
				}
				this.b[paramNameBBY] = this.v[arrMapItems[idx]];
			}
		}
		//} catch (ex) {
		//console.info('_S: paramNameBBY: ' + paramNameBBY + ', paramNameOmniture: ' + paramNameOmniture + ': exception: ' + ex);
		//}
	},

	/***************************************************************************
	 *
	 * Function _R - Send to Omniture then clear.
	 *
	 * delegates to send, then clear, then increments the call counter
	 *
	 * this.c++ gets incremented everytime.. (calls?)
	 */
	_R : function() {
		'use strict';
		this.send(); // function 'send' calls s_code/Omniture
		this.clr(); // resets the 'b' and 'v' variables
		this.c += 1; // Increments the times omniture has been called?
	},

	/***************************************************************************
	 *
	 * Function _A - ???
	 *
	 * if the event 'sEvt' is recognized all of the plugins are called
	 * 'custom(sEvt,oTrack)' then parses through all of the event args 'oTrack' and calls _S
	 * to set the values calls _R function to finish processing
	 *
	 * @param sEvt
	 * @param oTrack
	 */
	_A : function(sEvt, oTrack) {
		'use strict';
		var oItem;
		sEvt = sEvt.toLowerCase();
		if (this.events.indexOf(sEvt) > -1 && this.custom(sEvt, oTrack, this.pl)) {
			for (oItem in oTrack) {
				if (typeof oTrack[oItem] !== "function") {
					if (this.map[oItem] !== null) {
						this._S(oItem, oTrack[oItem]);
					}
				}
			}
			this._R(); // Send to Omniture
		}
	},

	/***************************************************************************
	 *
	 * Function event - ???
	 *
	 * main function for events sets the event type 'a' and then delegates to
	 * the _A function
	 */
	event : function(a, b) {
		'use strict';
		if ((typeof b !== 'undefined' && typeof b.suppress !== 'undefined') ? !this._SU(a, b) : true) {
			this._evt = a;
			this._A(a, b);
		}
	},

	/**
	 * determine whether or not to suppress the event
	 * TSA: 20111222: Need to find out when we can get rid of suppress (_SU).  Only used by BazaarVoice.
	 */
	_SU : function(a, b, c, d, e, f, g, h, i, j, k) {
		'use strict';
		if (b.suppress === 'bvrr') {
			// j == isvisible
			// k == addClickFunction
			// determine whether the content is visible and whether or not
			// to include a onclick function on the tab
			if (window.location.hash === '#tabbed-customerreviews') {
				j = k = true;
			} else {
				// determine if the tab for ratings and reviews is selected
				c = document.getElementById('tabbed-customerreviews');
				if (c) {
					c = c.className; // This is really confusing, but it
					// appears c (Element)is now re-purposed
					// as (String) className
					if (c.indexOf('ui-tabs-hide') > -1 || c.indexOf('ui-tabs-panel') === -1) {
						j = false;
						k = true;
					}
				} else {
					j = true;
					k = false;
				}
			}

			// add the function to the onclick of the tab
			if (k) {
				// console.time("bvrr");
				// remove suppress from string so this method is not
				// called again on tab select
				b.suppress = undefined;
				// b=JSON.stringify(b);
				window.tabSuppressTrackEvent = function() {
					window.trackEvent.event('event.view', b);
				};
				// add call to trackevent to onclick on tab for future use
				d = document.getElementById('tabbed-customerreviews').parentNode.children;
				for (e in d) {
					if (typeof d[e] !== 'undefined' && d[e].id === 'renderedtabs') {
						f = d[e].children;
						if (f) {
							for (g in f) {
								if (typeof f[g] !== 'undefined') {
									h = f[g].children;
									if (h) {
										for (i in h) {
											if (typeof h[i] !== 'undefined' && h[i].tagName === 'A' && h[i].getAttribute('href').indexOf('#tabbed-customerreviews') !== -1) {
												a = h[i].getAttribute('onclick');
												if (a.toString().indexOf('window.tabSuppressTrackEvent') === -1) {
													h[i].onclick = //function () {
													window.tabSuppressTrackEvent();
													//};
												}
											}
										}
									}
								}
							}
						}
					}
				}
				//                    jQuery('#renderedtabs>li>a[href="#tabbed-customerreviews"][onclick!="window.tabSuppressTrackEvent"]').click(function () {
				//                        console.info('jQuery:click');
				//                        window.tabSuppressTrackEvent();
				//                    });
			}
			// if not visible then return true to suppress
			// console.timeEnd("bvrr");
			return !j;
		}
		return false;
	},

	//Method to track a link - old... not used internally by trackEvent
	_LC : function(evt) {
		'use strict';
		if ((evt.which && (evt.which === 1)) || (evt.button && (evt.button === 1))) {
			var oTE = trackEvent,
				oElem = ((document.all) ? window.event.srcElement : this),
				sTagName = oElem.tagName,
				i;

			for (i = 0; i < 5; i += 1) {
				if (sTagName && sTagName.toLowerCase() !== "a" && sTagName.tagName !== "area") {
					oElem = oElem.parentElement;
				}
			}
			oTE.to = oElem;
			oTE.event("link", oTE.sTagName);
		}
	},

	_QP : function(a) {
		'use strict';
		var q = location.search.substring(1),
			v = q.split("&"),
			l = v.length,
			i,
			p;

		for (i = 0; i < l; i += 1) {
			p = v[i].split("=");
			if (p[0] === a) {
				return p[1];
			}
		}
	},

	/**
	 * reads the value name
	 *  from the cookie
	 */
	_GetCookieValue : function(name) {
		'use strict';
		var oCookie = document.cookie,
			nStart = oCookie.indexOf(name + "="), //start index of value
			nEnd,
			value = '';

		if (nStart > -1) {
			//get end index of value 
			nEnd = oCookie.indexOf(";", nStart + 1);
			//verify end index
			nEnd = (nEnd > 0) ? nEnd : oCookie.length;
			//get value
			value = ((nEnd > nStart) ? oCookie.substring(nStart + name.length + 1, nEnd) : '');
		}
		return value;
	},
	
	/**
	 * depracated - use _GetCookieValue
	 */
	_RCV : function (name) {
		return _GetCookieValue(name);
	},

	/**
	 * reads the base cookie and returns it as an object
	 */
	_RC : function() {
		'use strict';
		var sBaseCookie = this._RB(),
			oCookie = {};

		//eval("b=new Object(" + a + ")"); // TODO refactor: can't this just be
		// returned as JSON instead of
		// eval'ing?
		if (sBaseCookie.length > 0) {
			if (JSON) {
				oCookie = JSON.parse(sBaseCookie.replace(/'/g, "\""));
			} else if (jQuery) {
				oCookie = jQuery.parseJSON(sBaseCookie.replace(/'/gi, '"')); //TSA : 201110041415 : Re-factored
			} else {
				oCookie = eval("new Object(" + sBaseCookie + ")");
			}
		}
		return oCookie;
	},

	/**
	 * extract the base cookie using the namespace as the key
	 */
	_RB : function(a, b, c) {
		'use strict';
		a = document.cookie;
		b = a.indexOf(this.ns + "=");
		if (b === -1) {
			return "";
		}
		c = a.indexOf(";", b += 1);
		if (c < 0) {
			c = a.length;
		}
		return "" + a.substring(this.ns.length + b, c);
	},

	/**
	 * save the cookie
	 */
	_SaveCookie : function(a, b, c, m, d, e, f, g) {
		'use strict';
		b = escape(b); // TODO refactor: encodeURI?
		d = this._RC();
		if (c === "i") {
			if (d[a] !== null) {
				return 0;
			}
		} else if (c === "a") {
			b = (d[a] !== null) ? (b - 0) + (d[a] - 0) : b;
		} else if (c === "ap" || c === "au") {
			if (d[a] === null) {
				b = new Array("" + b);
			} else {
				e = eval(d[a]);  // TODO security: Validate before eval'ing
				//                  console.info(e);
				//                  var h = JSON.parse(d[a]); //optional eval replacement?
				//                  console.info(h);
				/*
				 * // Make this into a validate function? e = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u
				 * \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + text +
				 * ')');
				 *
				 */
				if (c === "au") {
					f = {};
					for (g = 0; g < e.length; g += 1) {
						f[e[g]] = 1;
					}
					if (f[b] !== null) {
						return 0;
					}
					f[b] = 1;
					b = [];
					for (g in f) {
						if (typeof f[g] !== "function") {
							b.push(g);
						}
					}
					g = b.length;
					m = (typeof m !== "undefined") ? m : g;
					if (m < g) {
						b = b.slice(g - m, g);
					}
				} else {
					e.push(b);
					b = e;
				}
			}
			b = '["' + b.join('","') + '"]';
		}
		if (c === "d") {
			delete d[a];
		} else {
			d[a] = b;
		}
		a = [];
		for (b in d) {
			if (typeof d[b] !== "function") {
				a.push("'" + b + "'" + ":'" + d[b] + "'");
			}
		}
		document.cookie = this.ns + "={" + (a.join(",")) + "};path=/;domain=" +
			Lm.config.domain + ";expires=Thu, 31 Dec 2099 00:00:00 GMT";

		return 1;
	},

	/**
	 * save cookie
	 * this method has been depracated.  please use _SaveCookie
	 *
	 */
	_SC : function(a, b, c, m, d, e, f, g) {
		'use strict';
		return this._SaveCookie(a, b, c, m, d, e, f, g);
	},

	/**
	 * executes all of the functions in the plugin 'pl' array
	 * sEventType   = event type
	 * oTrack       = track object
	 * arrPlugins   = plugin array
	 */
	custom : function(sEventType, oTrack, arrPlugins) {
		'use strict';
		var idx;
		for (idx in arrPlugins) {
			if (typeof arrPlugins[idx] !== "function") {
				try {
					//reset the plugin counter
					this.plc = 0;
					if (!arrPlugins[idx]._E(sEventType, oTrack)) {
						return false;
					}
				} catch (ex) {
					this.ple.push("pl[" + idx + "]:plc[" + this.plc + "]:" + ((typeof ex !== "undefined") ? ("" + ex).replace(",", " ") : ""));
				}
			}
		}
		return true;
	},

	/**
	 * reset the variable arrays 'v' and 'b'
	 */
	clr : function(a, b, c) {
		'use strict';
		a = this.base.split(",");
		b = {};
		for (c = 0; c < a.length; c += 1) {
			if (typeof this.b[a[c]] !== "undefined") {
				b[a[c]] = this.b[a[c]];
			}
		}
		this.b = b;
		this.v = {};
	},

	/**
	 * utility function that splits a string 'a' by the character 'b' and joins
	 * it back together with character 'c'
	 */
	rep : function(a, b, c) {
		'use strict';
		return (a.split(b).join(c));
	},
	/**
	 * TSA : 20120716
	 * utility function that takes the product(s) string and extracts the SKU
	 * returning all found skus as a comma-delimited string
	 */
	extractSKUs : function(sProdString) {
		'use strict';
		var arrProduct = sProdString.split(','),
			SKUs = [],
			idx = 0,
			nStart,
			nEnd;

		for (idx = 0; idx < arrProduct.length; idx += 1) {
			nStart = 1;
			nEnd = arrProduct[idx].substring(nStart).indexOf(';') + 1;
			SKUs.push(arrProduct[idx].substring(nStart, nEnd));
		}
		return SKUs.toString();
	},
	/**
	 * TSA : 20120716
	 * utility function that finds the accessory SKUs in the PDP Accessories tab
	 * returns all the skus || returns all checked SKUs
	 */
	findPDPAccessoryTabSKUs : function(bChecked) {
		'use strict';
		var sSelector = 'div.suggestedproduct>div.prodpricing>div.addtocart>input',
			sSKUs = '';

		if (bChecked) {
			sSelector += ':checked';
		} else {
			sSelector += ':checkbox';
		}
		jQuery(sSelector).each(function() {
			sSKUs += jQuery(this).attr('value').split(',')[1] += ',';
		});
		return sSKUs;
	},

	/**
	 * sends the variables to Omniture through the s_code script
	 */
	send : function() {
		'use strict';
		if (Lm.config.load.s_code) {
			this.v = this.scrub(this.v);
			try {
				//var oDT = new Date(),
				//    sDate = (oDT.getMonth() + 1) + "-" + oDT.getDate() + "-" + oDT.getFullYear();

				switch (this._evt) {
				case "event.link":
					var sLinkName = "";

					if (typeof this.v.prop38 !== "undefined") {
						this.s_code.linkTrackEvents = "None";

						if ((typeof this.v.prop14 !== "undefined") && (typeof this.v.eVar14 !== "undefined")) {
							//lightbox tracking calls
							this.s_code.linkTrackVars = "pageName,prop38,prop14,eVar14";

							if ((typeof this.v.events !== "undefined") && (this.v.events === "event7")) {
								// tab click in lbox
								this.s_code.linkTrackVars += ",products,eVar3,eVar35,eVar2,events";
								this.s_code.linkTrackEvents = "event7";
								//console.debug("lbox tab click");
								//TSA : 201207121900 : Added clickStream tracking for accessory viewing from lbox
								if (typeof Lm.clickStream !== 'undefined' && Lm.clickStream !== null) {
									Lm.clickStream.viewSuggestedAccessory('lboxSuggestedAccessory', this.extractSKUs(this.b.d_product));
								}

							} else if ((typeof this.v.events !== "undefined") && (this.v.events.indexOf("event10") > -1)) {
								// plan add in lbox
								this.s_code.linkTrackVars += ",products,eVar7,events";
								this.s_code.linkTrackEvents = "scAdd,event5,event10"; //TSA : 20120924 shouldn't be passed ... ,scOpen

								//TSA : 201207121900 : Added clickStream tracking for accessory viewing from lbox
								if (typeof Lm.clickStream !== 'undefined' && Lm.clickStream !== null) {
									Lm.clickStream.cartAddSuggestedAccessory('lboxSuggestedAccessory', 'addToCart', this.extractSKUs(this.b.d_product));
								}
								//TSA : 20120917 : Persistent Cart
								this.s_code.linkTrackVars += ",eVar40";

							} else {
								// product and Special and Pre-Order/?Other? add in lbox
								this.s_code.linkTrackVars += ",products,eVar7,events";
								this.s_code.linkTrackEvents = this.v.events;
								//console.debug("lbox add other");
								//TSA : 201207121900 : Added clickStream tracking for accessory viewing from lbox
								if (typeof Lm.clickStream !== 'undefined' && Lm.clickStream !== null) {
									Lm.clickStream.cartAddSuggestedAccessory('lboxSuggestedAccessory', 'addToCart', this.extractSKUs(this.b.d_product));
								}
								//TSA : 20120917: Persistent Cart
								this.s_code.linkTrackVars += ",eVar40";
							}

						} else if (typeof this.v.eVar21 !== "undefined" && typeof this.v.eVar22 !== "undefined") {//rzId and rzTier being passed
							this.s_code.linkTrackVars = "prop21,eVar21,eVar22";
							sLinkName = this.v.prop13;

						} else if (typeof this.v.eVar12 !== "undefined") {
							//launch a new window
							this.s_code.linkTrackVars = "pageName,eVar12,prop13,prop38";

						} else {
							//close, gotocart from lbox
							this.s_code.linkTrackVars = "prop38";
						}

						//link name from clickAction
						sLinkName = this.v.prop38;

					} else if (typeof this.v.prop13 !== "undefined" && typeof this.v.prop25 !== "undefined" && typeof this.v.pageName !== "undefined") {
						this.s_code.linkTrackVars = "pageName,prop25";
						sLinkName = this.v.prop13;

					} else if (typeof this.v.prop13 !== "undefined" && typeof this.v.products !== "undefined" && typeof this.v.events !== "undefined") {
						if (this.v.events.indexOf("event100") > -1 || this.v.events.indexOf("event99") > -1) {
							//TSA : 20120625 : commerce ICR Items - Add To Cart
							//TSA : 20120801 : updated to handle eVar17 and events 100/99 > ICR/MAP
							this.s_code.linkTrackVars = "link_name,events,products,eVar17";
							this.s_code.linkTrackEvents = this.v.events;
							sLinkName = this.v.prop13;
							//TSA : 20120917 : Persistent Cart
							this.s_code.linkTrackVars += ",eVar40";

						} else if (this.v.events.indexOf("event78") > -1 && typeof this.v.eVar70 !== "undefined") {
							//TSA : 20121205 : fix for BV ratings & review tab on pdp click tracking
							this.s_code.linkTrackVars = "prop13,eVar51,link_name,events,products,eVar70";
							this.s_code.linkTrackEvents = this.v.events;
							sLinkName = this.v.link_name;
						}

					} else if (typeof this.v.eVar4 !== "undefined") {
						this.s_code.linkTrackVars = "prop13,link_name,eVar4";
						sLinkName = this.v.link_name;

					} else if (typeof this.v.prop62 !== "undefined") {//launchedFrom
						this.s_code.linkTrackVars = "pageName,prop62";
						sLinkName = this.v.prop62;

					} else if (typeof this.v.prop39 !== "undefined") {//ixPathing - interaction pathing
						this.s_code.linkTrackVars = "prop39";
						sLinkName = this.v.prop13;

					} else if (typeof this.v.eVar21 !== "undefined" && typeof this.v.eVar22 !== "undefined") {//rzId and rzTier being passed
						this.s_code.linkTrackVars = "prop21,eVar21,eVar22";
						sLinkName = this.v.prop13;

					} else if (typeof this.v.prop25 !== "undefined" && typeof this.v.pageName !== "undefined") {
						this.s_code.linkTrackVars = "pageName,prop25";
						sLinkName = this.v.prop13;

					} else if (typeof this.v.prop13 !== "undefined" && typeof this.v.events !== 'undefined' && this.v.events.indexOf("event55") > -1) {
						this.s_code.linkTrackVars = "pageName,events";
						this.s_code.linkTrackEvents = this.v.events;
						sLinkName = this.v.prop13;

					} else if (typeof this.v.eVar25 !== "undefined" && typeof this.v.pageName !== "undefined") {
						sLinkName = this.v.link_name;
						this.s_code.linkTrackEvents = this.v.events;
						this.s_code.linkTrackVars = "eVar25,link_name,events,products";

					} else {
						//code for lid tracking
						//unneeded -- this.s_code.linkTrackVars = "link_name";
						//link name from lid
						sLinkName = this.v.link_name;
						//old call -- this.s_code.tl(this.v, 'o', this.v["link_name"], this.v);

						//console.debug("lid" );
					}
						
					//search relevancy
					if (typeof this.v.events !== 'undefined' &&
							(this.v.events.indexOf("scAdd") > -1 && typeof this.v["products"] !== "undefined") ) {
						
						//check for rank and relevancy
						if (typeof this.v.eVar39 !== 'undefined' && typeof this.b.searchRankSKU !== 'undefined') {

							if (this.v.products.indexOf(this.b.searchRankSKU) === -1) {
								//reset searchRank as new SKU being added broke the 'chain'
								this._SaveCookie('searchRank', 'Non-Search');
								this._SaveCookie('searchRankSKU', 'none');
								this.v.eVar39 = 'Non-Search';
								//reset search term relevancy
								this._SaveCookie('searchTermRelevancy', 'Non-Search');
								this.v.eVar38 = 'Non-Search';
							} else {
							//clear out searchRank cookie setting
								this._SaveCookie('searchRank', '');
								//clear out search term relevancy
								this._SaveCookie('searchTermRelevancy', '');
							}

							//add searchRank to the call
							this.s_code.linkTrackVars += ",eVar39,eVar38";
						}
					}

					this.s_code.tl(this.v, 'o', sLinkName, this.v);

					//notify completion
					if(typeof EventManager!=='undefined'){
						EventManager.trigger('dio.trackevent.link.complete');
					}else{
						jQuery(document).trigger('dio.trackevent.link.complete');
					}

					break;

				default:

					//search relevancy
					if (typeof this.v.events !== 'undefined' &&
							(this.v.events.indexOf("scAdd") > -1 && typeof this.v["products"] !== "undefined") ) {
						
						//check for rank and relevancy
						if (typeof this.v.eVar39 !== 'undefined' && typeof this.b.searchRankSKU !== 'undefined') {

							if (this.v.products.indexOf(this.b.searchRankSKU) === -1) {
								//reset searchRank as new SKU being added broke the 'chain'
								this._SaveCookie('searchRank', 'Non-Search');
								this._SaveCookie('searchRankSKU', 'none');
								this.v.eVar39 = 'Non-Search';
								//reset search term relevancy 
								this._SaveCookie('searchTermRelevancy', 'Non-Search');
								this.v.eVar38 = 'Non-Search';
							} else {
							//clear out searchRank cookie setting
							this._SaveCookie('searchRank', '');
								//clear out search term relevancy
								this._SaveCookie('searchTermRelevancy', 'Non-Search');
							}

						}
					}
					
					// recommendations (EP)
					if($(".carousel-wrapper #productList").length) {
						var EPstring = [];
						$(".carousel-wrapper #productList").each(function() {
								var EPdata = trackEvent.api.EPsplit($(this).find("li").eq(0).data("ep-value"));
								EPstring.push("rc-" + EPdata.rc + ",av-" + EPdata.av + ": " + track.page);
						});
						this.v.prop54 = EPstring.join(" | ");
					}
					
					// ICR/MAP pricing
					if(!this.pageLoadTracked && typeof track.catId !== "undefined" && track.catId === "pdp" && $("#price .priceblock").length > 0) {
						switch($("#price .priceblock").data("pricing-type")) {
							case "icr":
								if(typeof this.v.events !== "undefined" && this.v.events != "") { this.v.events += ","; }
								this.v.events += "event95";
								break;
							case "map":
								if(typeof this.v.events !== "undefined" && this.v.events != "") { this.v.events += ","; }
								this.v.events += "event94";
								break;
							default:
						}
					}

					// event.view
					this.s_code.t(this.v);

					//notify completion
					if(typeof EventManager!=='undefined'){
						EventManager.trigger('dio.trackevent.view.complete');
					}else{
						jQuery(document).trigger('dio.trackevent.view.complete');
					}
					
					if(!this.pageLoadTracked) {
						this.pageLoadTracked = true;
					}

				}
			} catch (ex) {
				//console.info(ex);
			}
		}
	},

	/**
	 * utility function that searches for skus on request (input) panel adds
	 * them to product string and returns the product string
	 */
	findSkus : function(holderId) {// returns string of skus
		'use strict';
		var products = [], // TODO: use new Products object?
			phoneDescription = ((document.getElementById(holderId)) ? document.getElementById(holderId).getElementsByTagName('p') : []),
			i;

		for (i = 0; i < phoneDescription.length; i += 1) {
			if (phoneDescription[i].innerHTML.toLowerCase().match(/sku:<\/strong>/)) {
				// @see trackEvent#pl[6] for product string pattern
				products.push(";" + unescape(phoneDescription[i].innerHTML.toLowerCase().split('sku:</strong>')[1].replace(/[\n\s]+/, "")) + ";;;;");
			}
		}
		return products;
	},
	// Common Utilities
	scrub : function(a) {
		'use strict';
		if (typeof a !== "undefined" && (typeof a.events === "undefined" || a.events.length === 0)) {
			if (typeof a.products !== "undefined") {
				a.products = undefined;
			}
		}
		return a;
	},

	// Diff
	Cart_Changes : function(arrCurrProducts, arrPrevProducts, arrD2CAvailabilities) {
		'use strict';
		var oProduct = {},
			arrOldProds = [],
			arrNewProds = [],
			arrTempHolder = [],
			arrD2CProds = [],
			idx,
			idxNew,
			idxOld,
			idxD2C,
			oChanges = {
				type : 'scView',
				arrProds : []
			};

		//Generate product arrays
		//build array of old/cookie products - this one is broken down into properties
		for (idx = 0; idx < arrPrevProducts.length; idx += 1) {
			arrTempHolder = arrPrevProducts[idx].split(';');
			oProduct = {
				sku : arrTempHolder[1],
				quantity : arrTempHolder[2],
				price : arrTempHolder[3],
				events : '',
				eVars : '',
				remove : false
				//events : arrProdTempHolder[3];
				//evars : arrProdTempHolder[4];
			};
			arrOldProds.push(oProduct);
		}
		//build array of new products
		for (idx = 0; idx < arrCurrProducts.length; idx += 1) {
			arrTempHolder = arrCurrProducts[idx].split(';');
			oProduct = {
				sku : arrTempHolder[1],
				quantity : arrTempHolder[2],
				price : arrTempHolder[3],
				events : '',
				eVars : '',
				remove : false
			};
			arrNewProds.push(oProduct);
		}
		//build array of d2cAvailability products - this one is broken down into properties
		for (idx = 0; idx < arrD2CAvailabilities.length; idx += 1) {
			arrTempHolder = arrD2CAvailabilities[idx];
			oProduct = {
				sku : arrTempHolder.sku,
				quantity : '',
				price : '',
				events : 'event59=1',
				eVars : 'evar31=' + arrTempHolder.avail.toLowerCase(),
				remove : false
			};
			arrD2CProds.push(oProduct);
		}

		if (arrD2CProds.length > 0) {
			//removed by d2c
			oChanges.type = 'event59';

		} else {

			if (arrNewProds.length === arrOldProds.length) {
				//the same
				oChanges.type = 'scView';

				//} else if (arrOldProds.length === 0 && arrNewProds.length > arrOldProds.length) {
			} else if (arrNewProds.length > arrOldProds.length) {
				//added
				//oChanges.type = 'scOpen,scAdd';
				oChanges.type = 'scAdd';

				//} else if (arrNewProds.length > arrOldProds.length) {
				//    //added
				//    oChanges.type = 'scAdd';

			} else if (arrNewProds.length < arrOldProds.length) {
				//removed by user
				oChanges.type = 'scRemove';
			}

		}
		switch (oChanges.type) {
		//case 'scOpen,scAdd':
		case 'scOpen':
			//check products in arrPrevProducts
			for (idxNew = 0; idxNew < arrNewProds.length; idxNew += 1) {
				oChanges.arrProds.push(arrNewProds[idxNew]);
			}// end for add to changes
			//new products get reported with scAdd event
			break;

		case 'scAdd':
			//check products in arrNewProds against arrOldProds
			for (idxNew = 0; idxNew < arrNewProds.length; idxNew += 1) {
				for (idxOld = 0; idxOld < arrOldProds.length; idxOld += 1) {
					//check for Old Sku in New Array
					if (arrNewProds[idxNew].sku === arrOldProds[idxOld].sku) {
						arrNewProds[idxNew].remove = true;
						//splice this product from oldprods array
						arrOldProds.splice(idxOld, 1);
						break;
					} // end skus match
				}// end for old prods
				//add to change if NOT marked remove === true
				if (!arrNewProds[idxNew].remove) {
					oChanges.arrProds.push(arrNewProds[idxNew]);
				} // end add to changes
			}// end for new prods
			break;

		case 'scRemove':
			//check arrCurrProducts against arrTempHolder
			for (idxOld = 0; idxOld < arrOldProds.length; idxOld += 1) {
				//loop through newprods array
				for (idxNew = 0; idxNew < arrNewProds.length; idxNew += 1) {
					//check for Old Sku in New Array
					if (arrOldProds[idxOld].sku === arrNewProds[idxNew].sku) {
						arrOldProds[idxOld].remove = true;
						//splice this product from oldprods array
						arrNewProds.splice(idxNew, 1);
						break;
					} // end if skus match
				}// end for new prods
				//this product was not in the other array
				if (!arrOldProds[idxOld].remove) {
					oChanges.arrProds.push(arrOldProds[idxOld]);
				} // end add to changes
			}// end for oldprods
			break;

		case "event59":
			//TSA : 201209241050 : check for availability to report on
			for (idxD2C = 0; idxD2C < arrD2CProds.length; idxD2C += 1) {
				//add product to changes
				oChanges.arrProds.push(arrD2CProds[idxD2C]);
			}// end for availabilities
			break;

		default:
			//case 'scView':
			//check products in arrPrevProducts
			for (idxNew = 0; idxNew < arrNewProds.length; idxNew += 1) {
				//add product to changes
				oChanges.arrProds.push(arrNewProds[idxNew]);
			}
			break;
		}
		return oChanges;
	},

	// Check for Undefined
	U_ud : function(oElem) {
		'use strict';
		return (typeof oElem === "undefined");
	},

	U_replace : function(a, b, c, d) {
		'use strict';
		// Replace 'a' with 'b' in 'c'

		if (!this.U_ud(d) && d.toLowerCase() === 'all') {
			// Replace all
			while (c.indexOf(a) > -1) {
				c = c.replace(a, b);
			}
		} else {
			// Replace once
			c = c.replace(a, b);
		}
		return c;
	},

	//TSA : 201211141030 : pulling valid d2cAvailability - Temporary Fix
	/*Start*/
	getD2CAvailabilityValue : function() {
		'use strict';
		var d2cPossible = jQuery('#notificationPanel').next('script').html(),
			d2cFound,
			d2cExtractedData;

		d2cPossible = jQuery('#notificationPanel').next('script').html();

		if (d2cPossible) {
			if (d2cPossible.search('track.d2cAvailability') > -1) {
				d2cFound = d2cPossible.split('track.d2cAvailability');
				d2cExtractedData = d2cFound[1].slice(d2cFound[1].indexOf("'") + 1, d2cFound[1].lastIndexOf("'"));
				return d2cExtractedData;
			}
		}
	},
	/*End*/

	ns : "track",
	tok : ": ",
	events : "event.view,event.link,event.cache",
	base : "page,section,catId,templateName",
	map : {
		conversion : "events",
		"catId.pdp" : "event3,prodView",
		"catId.pcat17002" : "scCheckout",
		"catId.pcat17009" : "event18",
		"catId.pcat17010" : "event19",
		"catId.pcat17011" : "event17",
		"catId.pcat17013" : "event20",
		"catId.pcat17022" : "scCheckout",
		"catId.pcat17100" : "",

		errorEvent : "",
		page : "pageName",
		section : "hier1",
		uberCatId : "d_pageIds$0",
		uberCatName : "",
		parentCatId : "d_pageIds$1",
		parentCatName : "",
		catId : "d_pageIds$2",
		catName : "",
		templateName : "prop3",
		facetName : "",
		facetValue : "prop5,eVar5",
		hourOfDay : "prop6",
		inno : "eVar6",
		dayOfWeek : "prop7",
		recognized : "eVar8,prop8",
		flashVersion : "prop9",
		language : "prop10",
		lastPage : "",
		lastLink : "prop13",
		productTab : "prop14,eVar14",
		searchKey : "prop15,eVar15",
		searchTerm : "prop16,eVar16",
		searchTermSOLR : "prop60,eVar60", //TSA: 201301101330: added for SOLR search
		searchTermPromo : "eVar62", //TSA: 201305301230: searchSynonym for SOLR
		searchResultsNum : "prop17",
		searchLastPage : "prop2",
		storeId : "",
		searchTermRelevancy : "eVar38", //TSA: 201304152130: search relevancy
		searchRank : "eVar39", //TSA: 201304152130: search relevancy
		searchRankSKU : "", //TSA : 20130722 : search relevancy
		searchFacet : "", //placeholder for SOLR Relevancy facet
		searchSort : "", //placeholder for SOLR Relevancy sort
		searchView : "", //placeholder for SOLR Relevancy view
		abTest66 : "eVar66", //TSA: 20120106: renamed
		abTest67 : "eVar67", //TSA: 20120106: renamed
		abTest68 : "eVar68", //TSA: 20120106: new
		abTest69 : "eVar69", //TSA: 20120106: new
		rzId : "prop21,eVar21",
		rzTier : "eVar22", //prop22, TSA : Removed per Chris/Biz/Eden : helps correct for commerce widget
		errorCodeList : "prop25",
		failedSearchTerm : "prop26,eVar26",
		failedSearchTermSOLR : "prop61,eVar61", //TSA: 201301101330 : added for SOLR search
		payTypeList : "eVar33",
		rating : "prop35,eVar35", //added prop35 to mapping
		skuId : "prop36",
		reviewsNum : "prop37,eVar23", //new reviewsNum mapping
		errorURL : "eVar37", // no longer used for reviewsNum
		lid : "link_name",
		lpos : "",
		jserror : "prop47",
		sid : "prop48", //tltsid : "prop48", // TSA : 20130723 : now SID
		profileId : "prop49,eVar49",
		error : "",
		imperror : "prop50",
		video : "eVar34",
		outOfStock : "prop46",
		headerFooter : "prop29,eVar29",
		ssSlideShowTitle : "prop59",
		clickAction : "prop38",
		prevPage : "eVar12",
		pageCampaign : "eVar4",
		vgSearchTerm : "prop63,eVar63",
		vgLink : "prop64,eVar64",
		sciVisit : "eVar70",
		sciCounter : "event78",
		atgID : "eVar50",
		ixPathing : "prop39", // TSA: 20120106: commerce
		isCloud : "eVar56", //TSA: 20120430: cloud
		seePriceIn : "eVar17", //TSA: 2012071100
		ccApplication : "eVar54", // TSA: 20120822: per Biz
		persistCartItem : "eVar40", // TSA: 20120917: per Biz/Web Analytics Demystified
		persistedCartItemCount : "eVar55", // TSA: 20120917: per Biz/Web Analytics Demystified
		impressionSKUs : "prop66", //TSA: 20121030: added to deals.bestbuy.com - match it here
		experiencePlatform : "prop54,eVar25", //TSA: 20120302: added per Biz
		isPLCart : "eVar58", //TSA: 20130521: added for tracking new vs. old cart
		EPclick : "eVar25",

		"qp.cmp" : "campaign",
		"qp.dcmp" : "campaign",
		"qp.ref" : "ref",
		"qp.loc" : "loc",
		"qp.usc" : "",
		"qp.icmp" : "eVar47",
		"qp.adgroupid" : "adgroupid",
		"qp.query" : "query",
		"qp.st" : "",
		"qp.searchterm" : "",
		"qp.searchresults" : "",
		//"qp.searchtermsolr" : "", //TSA: 201302211245: added for SOLR search
		//"qp.searchresultssolr" : "", //TSA: 201302211245: added for SOLR search
		"qp.list" : "",
		"qp._dynsessconf" : "",
		"qp.recon" : "prop53",
		"qp.issolr" : "", //TSA: 201302211245: added for SOLR search

		//TSA : 201207261815 : Commented out - This will be done in s_code
		//"qp.CampaignID" : "eVar52", //TSA: 20120725: per Biz
		//"qp.SubscriberID" : "eVar53", //TSA: 20120725: per Biz

		// cookie example set via trackEvent.event("event.cache",{lid:"lid
		// value"});
		"cp.inno" : "",
		"cp.lid" : "",
		"cp.lastPage" : "",
		"cp.searchLastPage" : "",
		"cp.finder" : "eVar45",
		"cp.stnum" : "",
		"cp.kmach" : "",
		"cp.testBucket" : "eVar20", //TSA: 20130507: abTest
		//"cp.SID" : "prop48", //TSA: 20130521: future? tealeaf session id from cookie
		"cp.searchTermRelevancy" : "", //TSA : 20130722 : search relevancy
		"cp.searchRank" : "", //TSA : 20130515: search relevancy
		"cp.searchRankSKU" : "", //TSA : 20130722 : search relevancy

		d_pageIds : "prop1", // moved eVar1 for merchCategory
		// functionality...
		d_campaignPath : "prop23",
		d_campaignLatency : "prop24,eVar24",
		d_failedSearch : "event2",
		d_searchSynonym : "prop43,eVar43",
		//d_searchSynonymSOLR : "prop62,eVar62", //TSA: 20130516: Turned off search_synonym off for SOLR < FAST only  //TSA: 201301101330 : added for SOLR search
		d_product : "products",
		d_purchaseId : "purchaseID",
		d_uberCat : "channel",
		d_searchScope : "eVar46",
		d_category : "prop28",
		d_merchCategory : "eVar1",
		d_kioskId : "eVar18,prop18",

		priceList : "",
		qtyList : "",
		skuList : "",
		orderDiscAmt : "",
		orderShipAmt : "event4", // TODO ???: Is this the right place for this?
		orderId : "prop33",
		orderState : "state",
		orderZip : "zip",
		activity : "",
		sysDate : ""
	},
	myQueryString : function() {
		'use strict';
		return self.location.search.toLowerCase();
	},

	/**
	 * @namespace contains methods for making tracking calls
	 * @description to have standard methods for making most of the tracking calls on dotCom
	 */
	api : {
		/**
		 *
		 * Internal method to report exceptions
		 * @param {string} sException The exception message.
		 * @param {string} sExtra Any extra detail pertaining to the exception.
		 * @return Void
		 */
		_Notify : function(sException, sExtra) {
			'use strict';
			//updated to use EM instead of console
			EventManager.info(sException + '\n-------------------------\n' + sExtra);
		},

		//
		/**
		 * Internal method to create the page name for new windows
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return {string} The page name constructed with the Initiative suffixed.
		 */
		_CreatePageName : function(sInitiative) {
			'use strict';
			var _pageName;
			if (typeof track.page !== 'undefined' && track.page.length > 0) {
				_pageName = track.page;
			} else {
				_pageName = ((typeof track.uberCatName !== 'undefined') ? track.uberCatName + ': ' : '') +
							((typeof track.parentCatName !== 'undefined') ? track.parentCatName + ': ' : '') +
							((typeof track.catId !== 'undefined' && track.catId === 'pdp') ? track.catId : 
								((typeof track.catName !== 'undefined') ? track.catName : ''));
			}
			//append initiative
			_pageName += ((typeof sInitiative === 'string' && sInitiative.length > 0) ? ': ' + sInitiative : '');

			return _pageName;
		},

		/**
		 * Internal method to create a previous page name
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return {string} A previous page name constructed with the Initiative suffixed.
		 */
		_CreatePrevPageName : function(sInitiative) {
			'use strict';
			return track.page + ((typeof sInitiative === 'string' && sInitiative.length > 0) ? ': ' + sInitiative : '');
		},

		/**
		 * Internal method for creating the clickAction value
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} sActionName The action taking place.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @returns {string} The clickAction value constructed from the link, action, and initiative.
		 */
		_CreateClickAction : function(sLinkName, sActionName, sInitiative) {
			'use strict';

			switch (sActionName) {
			case 'lbox':
			//lightbox
			//                //haacs
			//                var ca1 = sInitiative + ': ' + 'availabilit(y || ies)' + ': ' + sActionName;
			//                //no haacs
			//                var ca2 =  sInitiative + ': ' + 'noaccessories' + ': ' + sActionName;
			//                //map
			//                var ca3 = sInitiative + ': ' + 'MAP' + ':' + sActionName;
			//                //map - keep in cart
			//                var ca4 = sInitiative + ': ' + 'MAP' + ': ' + sActionName;
			//                    break;

			case 'mobilepkg':
			//window
			//               //mobilepkg - showOtherPartyModal
			//                var ca5 = sInitiative + ': ' + sActionName + ': ' + sLinkName;
			//                //mobilepkg - showModalWithPlanSelection
			//                var ca6 = sInitiative + ': ' + 'launch with plan selected: plan selection';
			//                //mobilepkg - add to package
			//                var ca7 = sInitiative + ': ' + 'launch from <templateName> + <sFirstLaunch> + <planSKUText>';
			//                //mobilepkg = show accessories modal
			//                var ca8 = sInitiative + ': ' + 'launch';
			//                    break;

			default:
			//window/unknown

			}
			return ((typeof sInitiative === 'string' && sInitiative.length > 0) ? sInitiative + ': ' : '') +
				sLinkName +
				((typeof sActionName === 'string' && sActionName.length > 0 ) ? ': ' + sActionName : '');
		},

		/**
		 * Internal method for creating a productTab value
		 * @param {string} sTabName The name of the tab being clicked
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return {string} The productTab value constructed from the tab name and initiative.
		 */
		_CreateProductTab : function(sTabName, sInitiative) {
			'use strict';
			return sTabName + ((typeof sInitiative === 'string' && sInitiative.length > 0) ? ': ' + sInitiative : '');
		},

		/**
		 * Internal method for creating the lastLink value
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} sActionName The action taking place.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return {string} The lastLink value constructed from the link, action, and initiative.
		 */
		_CreateLastLink : function(sLinkName, sActionName, sInitiative) {
			'use strict';
			return sLinkName + ((typeof sInitiative === 'string' && sInitiative.length > 0 ) ? ': ' + sInitiative : '') +
				((typeof sActionName === 'string' && sActionName.length > 0 ) ? ': ' + sActionName : '');
		},

		/**
		 * Internal method for creating the lid value
		 * @param {string} sLinkId The name/description of the link/button being clicked.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return {string} The lid value constructed from the link id and initiative.
		 */
		_CreateLid : function(sLinkId, sInitiative) {
			'use strict';
			return ((typeof sInitiative === 'string' && sInitiative.length > 0) ? sInitiative + ': ' : '') + sLinkId;
		},

		/**
		 * Internal method for creating the page name value for a light box
		 * @param {string} sLightboxName The name of the light box being opened/viewed.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return {string} The Light Box Name value constructed from the light box name and initiative.
		 */
		_CreateLightboxPageName : function(sLightboxName, sInitiative) {
			'use strict';
			var _pageName;
			if (typeof sLightboxName === 'string' && sLightboxName.length > 0) {
				_pageName = sLightboxName;
			} else if (typeof track.page !== 'undefined' && track.page.length > 0) {
				_pageName = track.page;
			} else {
				_pageName = ((typeof track.uberCatName !== 'undefined') ? track.uberCatName + ': ' : '') +
					((typeof track.parentCatName !== 'undefined') ? track.parentCatName + ': ' : '') +
					((typeof track.catId !== 'undefined' && track.catId === 'pdp') ? track.catId : ((typeof track.catName !== 'undefined') ? track.catName : ''));
			}
			//append initiative
			_pageName += ((typeof sInitiative === 'string' && sInitiative.length > 0) ? ': ' + sInitiative : '');

			return _pageName;
		},

		/**
		 * Method for tracking a lid value (sends to pev2)
		 * @param {string} sLinkId The name of the link/button being clicked.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return Void
		 */
		trackClick : function(sLinkId, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkId === 'undefined') {
					throw ('SLIreq');
				}
				if (typeof sLinkId === 'string' && sLinkId.trim().length === 0) {
					throw ('SLIempty');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}
				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.link', {
					lid : this._CreateLid(sLinkId, sInitiative)
				});
			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackClick has the following parameter:\n' +
					'sLinkId (string)  - Required - (aka lid) value you want tracked.\n' +
					'sInitiative (string) - Optional - Identifies your project/group';

				switch (ex) {
				//handle the issues
				case 'SLIreq':
					this._Notify('sLinkId is required!', sInstructions);
					break;
				case 'SLIempty':
					this._Notify('sLinkId cannot be empty!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method for tracking custom links - (sends pev2, c13, and v51)
		 * @param {string} sLinkId The name/description of the link/button being clicked.
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} [sActionName] The action taking place.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return Void
		 */
		trackCustomLink : function(sLinkId, sLinkName, sActionName, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkId === 'undefined') {
					throw ('SLIreq');
				}
				if (typeof sLinkId === 'string' && sLinkId.trim().length === 0) {
					throw ('SLIempty');
				}
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}
				//if (typeof sActionName === 'undefined') { throw ('SANreq'); }
				if (typeof sActionName === 'string' && sActionName.trim().length === 0) {
					throw ('SANempty');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}
				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.link', {
					lid : this._CreateLid(sLinkId, sInitiative),
					lastLink : this._CreateLastLink(sLinkName, sActionName, sInitiative)
				});
			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackCustomLink has the following parameters:\n' +
					'sLinkId (string) - Required, \n' +
					'sLinkName (string) - Required, \n' +
					'sActionName (string) - Optional - ("click", "launch", "close", "open", etc),\n' +
					'sInitiative (string) - Optional - Identifies your project/group';

				switch (ex) {
				//handle the issues
				case 'SLIreq':
					this._Notify('sLinkId is required!', sInstructions);
					break;
				case 'SLIempty':
					this._Notify('sLinkId cannot be empty!', sInstructions);
					break;
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				case 'SANempty':
					this._Notify('sActionName, if passed, cannot be empty!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, if passed, cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method for tracking a tabClick in a page
		 * @param {string} sTabName The name of the tab being clicked.
		 * @param {string} [sActionName] The action taking place.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return Void
		 */
		trackTabClick : function(sTabName, sActionName, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sTabName === 'undefined') {
					throw ('STNreq');
				}
				if (typeof sTabName === 'string' && sTabName.trim().length === 0) {
					throw ('STNempty');
				}
				//if (typeof sActionName === 'undefined') { throw ('SANreq'); }
				if (typeof sActionName === 'string' && sActionName.trim().length === 0) {
					throw ('SANempty');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}
				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.view', {
					//lid: _CreateLid(sTabName, sInitiative),
					lastLink : this._CreateLastLink(sTabName, sActionName, sInitiative),
					productTab : this._CreateProductTab(sTabName, sInitiative)
				});
			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackTabClick has the following parameters:\n' +
					'sTabName (string) - Required, \n' +
					'sActionName (string) - Optional - ("click", "launch", "close", "open", etc),\n' +
					'sInitiative (string) - Optional - Identifies your project/group';

				switch (ex) {
				//handle the issues
				case 'STNreq':
					this._Notify('sTabName is required!', sInstructions);
					break;
				case 'STNempty':
					this._Notify('sTabName cannot be empty!', sInstructions);
					break;
				case 'SANempty':
					this._Notify('sActionName, if passed, cannot be empty!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, if passed, cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method for tracking error codes - (sends c25)
		 * @param {string} sLinkId The name/description of the link/button being clicked.
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} [sActionName] The action taking place.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return Void
		 */
		trackErrorCodes : function(sErrorCodes, sLinkName, sActionName, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sErrorCodes === 'undefined') {
					throw ('SECreq');
				}
				if (typeof sErrorCodes === 'string' && sErrorCodes.trim().length === 0) {
					throw ('SECempty');
				}
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}
				//if (typeof sActionName === 'undefined') { throw ('SANreq'); }
				if (typeof sActionName === 'string' && sActionName.trim().length === 0) {
					throw ('SANempty');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}
				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.link', {
					page : this._CreatePageName(sInitiative),
					lastLink : this._CreateLastLink(sLinkName, sActionName, ''),
					errorCodeList : sErrorCodes
				});

			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackErrorCodes has the following parameters:\n' +
					'sErrorCodes (string) - Required - comma-delimited string of error code(s), \n' +
					'sLinkName (string) - Required, \n' +
					'sActionName (string) - Optional - ("click", "launch", "close", "open", etc),\n' +
					'sInitiative (string) - Optional - Identifies your project/group';
				//handle the issues
				switch (ex) {
				case 'SECreq':
					this._Notify('sErrorCodes is required!', sInstructions);
					break;
				case 'SECempty':
					this._Notify('sErrorCodes cannot be empty!', sInstructions);
					break;
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				//                      case 'SANreq':
				//                      this._Notify('sActionName is required!', sInstructions);
				//                      break;
				case 'SANempty':
					this._Notify('sActionName, if passed, cannot be empty!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, if passed, cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method for tracking a new window - usually new browser windows that go to other parties or
		 *      do not themselves have analytics code for tracking
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} sActionName The action taking place - "launch" or "open".
		 * @param {string} sWindowName The name of the window being opened.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return Void
		 */
		trackNewWindow : function(sLinkName, sActionName, sWindowName, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}
				if (typeof sWindowName === 'undefined') {
					throw ('SWNreq');
				}
				if (typeof sWindowName === 'string' && sWindowName.trim().length === 0) {
					throw ('SWNempty');
				}
				if (typeof sActionName === 'undefined') {
					throw ('SANreq');
				}
				if (typeof sActionName === 'string' && sActionName.trim().length === 0) {
					throw ('SANempty');
				}
				if (typeof sInitiative === 'undefined') {
					throw ('SIreq');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}

				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event("event.link", {
					prevPage : this._CreatePrevPageName(sInitiative),
					page : sWindowName,
					//lastLink: this._CreateLastLink(sLinkName, sActionName, sInitiative),
					clickAction : this._CreateClickAction(sLinkName, sActionName, sInitiative)
				});
			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackNewWindow has the following parameters:\n' +
					'sLinkName (string) - Required,\n' +
					'sActionName (string) - Required - ("launch", for lightbox. "open", for window.)),\n' +
					'sWindowName (string) - Required,\n' +
					'sInitiative (string) - Optional - Identifies your project/group';

				//handle the issues
				switch (ex) {
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				case 'SWNreq':
					this._Notify('sWindowName is required!', sInstructions);
					break;
				case 'SWNempty':
					this._Notify('sWindowName cannot be empty!', sInstructions);
					break;
				case 'SANreq':
					this._Notify('sActionName is required!', sInstructions);
					break;
				case 'SANempty':
					this._Notify('sActionName, cannot be empty!', sInstructions);
					break;
				case 'SIreq':
					this._Notify('sInitiative is required!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Incomplete! - Method for tracking light box launches/views - INCOMPLETE!
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} sLightboxName The name of the light box being launched/viewed
		 * @param {string} sInitiative Value identifying the project/group.
		 * @param {string} sType Type of light box - "commerce", "phonepkg", "standard"
		 * @param {object} oDetails Properties pertaining to the commerce lightb box - not yet functional
		 * @return Void
		 */
		trackLightboxLaunch : function(sLinkName, sLightboxName, sInitiative, sType, oDetails) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}
				if (typeof sLightboxName === 'undefined') {
					throw ('SLBNreq');
				}
				if (typeof sLightboxName === 'string' && sLightboxName.trim().length === 0) {
					throw ('SLBNempty');
				}
				if (typeof sInitiative === 'undefined') {
					throw ('SIreq');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}
				//if (typeof sType === 'undefined') { throw ('STreq'); }
				if (typeof sType !== 'undefined' && typeof sType === 'string' && sType.trim().length === 0) {
					throw ('STempty');
				}
				if ((typeof sType !== 'undefined' && sType !== 'standard') && typeof oDetails !== 'object') {
					throw ('ODempty');
				}

				var sActionName, sProcessValue;

				var oTrack = {
					page : this._CreateLightboxPageName(sLightboxName, sInitiative),
					d_uberCat : track.uberCatName || track.parentCatName || track.catName,
					d_category : track.d_category,
					prevPage : this._CreatePrevPageName(sInitiative)
				};

				switch (sType) {
				case 'commerce':
					/*                        var gto = this.$trackObjects.gto(),
					 lto = this.$trackObjects.lto(),
					 category = lto.activeCategory || {name: "", count: ""},
					 pg = this._createPage(),
					 pdctTab = this._createProductTab(category),
					 temp = gto.templateName,
					 product = response.product(),
					 isCartPage = this._isCartPage.isSatisfiedBy(temp),
					 isMapSku = this._isMapSku.isSatisfiedBy(product),
					 isIcrSku = this._isIcrSku.isSatisfiedBy(product),
					 conversion = (isCartPage) ? 'event21'
					 : (isIcrSku) ? 'scAdd,scOpen,event21,event100'
					 : (isMapSku) ? 'scAdd,scOpen,event21,event99'
					 : 'scAdd,scOpen,event21',
					 seePriceIn = (isIcrSku) ? {seePriceIn: "See Price in Checkout"}
					 : (isMapSku) ? {seePriceIn: "See Price in Cart"} : {},
					 d_product = $.str.build(';', lto.driverProduct.skuId,
					 ';;;;evar7=lbox:',
					 gto.templateName),
					 templateName : 'cart || pre-cart Light Box',*/

					break;

				case 'phonepkg':
					//templateName : 'cart || pre-cart Light Box',
					break;

				/*case 'fsdi':
				 var u = track.uberCatName !== null ? track.uberCatName + ": " : '',
				 p = track.parentCatName !== null ? track.parentCatName + ": " : '',
				 c = track.catName !== null ? track.catName + ": " : '',
				 page = u + p + c,
				 a = $(this),
				 tab = a.data('active'),
				 linkText = $.trim(a.text()).replace(/[;:,!\|\(\)]/g, "-"),
				 listItemIndex = a.parents('li').index() + 1; // 1-based
				 trackEvent.event("event.view", {
				 page: page + "fsdi: ",
				 productTab: (page + "fsdi: accessories: " + tab + ": " + listItemIndex),
				 d_uberCat: track.uberCatName,
				 d_category: track.d_category,
				 templateName: lightBoxTitle,
				 clickAction: track.d_category + ": fsdi: launch: " + linkText,
				 prevPage: track.page
				 });
				 break;*/

				case 'standard':
				//fall through - standard = default
				default:
					//oTrack.templateName = track.templateName + ':' + ;
					sActionName = 'launch';
					sProcessValue = '';
					oTrack.clickAction = this._CreateClickAction(sProcessValue, sActionName, sInitiative);
					oTrack.templateName = sInitiative + ': ' + sLightboxName;
				}

				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.view', oTrack);

			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackLightboxLaunch has the following parameters:\n' +
					'sLinkName (string) - Required,\n' +
					'sLightboxName (string) - Required,\n' +
					'sInitiative (string) Required - Identifies your project/group\n' +
					'sType (string) - Optional ("standard" (default if not set) or "commerce" or "phonepkg")\n' +
					'oDetails (object) - Optional (Required, however, if sType is not empty and not set to "standard".  Minimal value is {} )';

				//handle the issues
				switch (ex) {
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				case 'SLBNreq':
					this._Notify('sLightboxName is required!', sInstructions);
					break;
				case 'SLBNempty':
					this._Notify('sLightboxName cannot be empty!', sInstructions);
					break;
				case 'SIreq':
					this._Notify('sInitiative is required!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, cannot be empty!', sInstructions);
					break;
				case 'STempty':
					this._Notify('sType cannot be empty if passed!', sInstructions);
					break;
				case 'ODempty':
					this._Notify('oDetails must be an object if sType is passed as a value other than "standard"!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/*            trackLightbox_Commerce : function (sDriverProductSkuId, sProductTab, sAvailability) {
		var sSeePriceIn = ((isIcrSku) ? "See Price in Checkout" : ((isMapSku) ? "See Price in Cart" : undefined)),
		sClickAction = 'lbox: ' + sAvailability + ': launch',
		sProductString = ';'+ sDriverProductSkuId + ';;;;evar7=lbox:' + track.templateName;

		trackEvent.event('event.view', {
		page: pg,
		d_uberCat: track.uberCatName,
		d_category: track.d_category,
		templateName: 'Pre-Cart Light Box',
		productTab: sProductTab,
		clickAction: sClickAction,
		conversion: conversion,
		d_product: sProductString,
		prevPage: track.page,
		seePriceIn : sSeePriceIn
		});

		//MAP
		var gto = this.$trackObjects.gto(),
		lto = this.$trackObjects.lto();
		return this.$trackEvent().event('event.view',
		{
		page: gto.templateName + ":MAP:lbox",
		seePriceIn : "See Price in Cart",
		d_product: $.str.format(";{0};;;", product.skuId),
		conversion: "scAdd,scOpen,event21,event99",
		clickAction: "lbox:MAP:launch"
		});
		},
		trackLightboxTabView : function () {this._Notify('Future Use', 'Coming soon!')},
		trackLightboxClose : function () {this._Notify('Future Use', 'Coming soon!')},
		trackLightboxHaccsAdd : function () {this._Notify('Future Use', 'Coming soon!')},
		trackLightboxGoToCart : function () {this.this._Notify('Future Use', 'Coming soon!')},
		trackCartCheckoutClick : function () {_Notify('Future Use', 'Coming soon!')},
		*/

		/**
		 * Method for tracking link/button clicks within a light box
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} sLightboxName The name of the light box currently being clicked in
		 * @param {string} [sActionName] The action taking place.
		 * @param {string} [sInitiative] Value identifying the project/group.
		 * @return Void
		 */
		trackLightboxClick : function(sLinkName, sLightboxName, sActionName, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}
				if (typeof sLightboxName === 'undefined') {
					throw ('SLBreq');
				}
				if (typeof sLightboxName === 'string' && sLightboxName.trim().length === 0) {
					throw ('SLBempty');
				}
				if (typeof sActionName === 'string' && sActionName.trim().length === 0) {
					throw ('SANempty');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}

				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.link', {
					page : this._CreateLightboxPageName(sLightboxName, sInitiative),
					lastLink : this._CreateLastLink(sLightboxName + ': ' + sLinkName, sActionName, sInitiative),
					clickAction : this._CreateClickAction(sLightboxName + ': ' + sLinkName, sActionName, sInitiative)
				});
			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackLightboxClick has the following parameters:\n' +
					'sLinkName (string) - Required, \n' +
					'sLightboxName (string) - Required, \n' +
					'sActionName (string) - Optional - ("click", "launch", "close", "open", etc),\n' +
					'sInitiative (string) - Optional - Identifies your project/group';
				//handle the issues
				switch (ex) {
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				case 'SLBreq':
					this._Notify('sLightboxName is required!', sInstructions);
					break;
				case 'SLBempty':
					this._Notify('sLightboxName cannot be empty!', sInstructions);
					break;
				case 'SANempty':
					this._Notify('sActionName, if passed, cannot be empty!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, if passed, cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method to track an "add to cart" button/link click
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} [sInitiative] Value identifying the project/group.
		 * @return Void
		 */
		trackAddToCartClick : function(sLinkName, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}
				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.link', {
					lid : this._CreateLid(sLinkName, sInitiative),
					lastLink : this._CreateLastLink(sLinkName, 'click', sInitiative)
				});
			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackAddToCartClick has the following parameters:\n' +
					'sLinkName (string) - Required, \n' +
					'sInitiative (string) - Optional - Identifies your project/group';
				//handle the issues
				switch (ex) {
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, if passed, cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method used used by ABTest Team to track a view event
		 * @param {object} objABTest AB Test object - contains the various properties it needs to track
		 * @param {string} sLinkId The name/description of the link/button being clicked.
		 * @return Void
		 */
		trackABTestView : function(objABTest, sLinkId) {
			'use strict';
			try {
				var nIdx,
					nCount = 0;
				//Validation of input
				if (typeof objABTest === 'undefined') {
					throw ('OABTreq');
				}
				if (typeof objABTest !== 'object') {
					throw ('OABTwrong');
				}
				for (nIdx in objABTest) {
					if (objABTest.hasOwnProperty(nIdx)) {
						nCount += 1;
					}
				}
				if (nCount === 0) {
					throw ('OABTnoprop');
				}
				objABTest.page = '';
				//init property
				/*TSA : 20130507 : Not used in this manner - per Biz
				 if (typeof objABTest.abTest !== 'undefined') {
				 if (objABTest.abTest.length > 0) {
				 //"eVar20"
				 track.abTest = objABTest.abTest;
				 } else {
				 throw ('OABTempty');
				 }
				 }
				 */
				/* TSA : 20130419 : Not used anymore - per Biz
				 * if (typeof objABTest.abTestCheckout !== 'undefined') {
				 if (objABTest.abTestCheckout.length > 0) {
				 //"eVar38"
				 track.abTestCheckout = objABTest.abTestCheckout;
				 } else {
				 throw ('OABTempty');
				 }
				 }*/
				/* TSA : 20130419 : Not used anymore - per Biz
				 * if (typeof objABTest.abTest39 !== 'undefined') {
				 if (objABTest.abTest39.length > 0) {
				 //"eVar39"
				 track.abTest39 = objABTest.abTest39;
				 } else {
				 throw ('OABTempty');
				 }
				 }*/
				if (typeof objABTest.abTest66 !== 'undefined') {
					if (objABTest.abTest66.length > 0) {
						//"eVar66"
						track.abTest66 = objABTest.abTest66;
					} else {
						throw ('OABTempty');
					}
				}
				if (typeof objABTest.abTest67 !== 'undefined') {
					if (objABTest.abTest67.length > 0) {
						//"eVar67"
						track.abTest67 = objABTest.abTest67;
					} else {
						throw ('OABTempty');
					}
				}
				if (typeof objABTest.abTest68 !== 'undefined') {
					if (objABTest.abTest68.length > 0) {
						//"eVar68"
						track.abTest68 = objABTest.abTest68;
					} else {
						throw ('OABTempty');
					}
				}
				if (typeof objABTest.abTest69 !== 'undefined') {
					if (objABTest.abTest69.length > 0) {
						//"eVar69"
						track.abTest69 = objABTest.abTest69;
					} else {
						throw ('OABTempty');
					}
				}
				if (typeof sLinkId !== 'undefined') {
					if (typeof sLinkId !== 'string') {
						throw ('SLIwrong');
					}
					if (sLinkId.length === 0) {
						throw ('SLIempty');
					}
					objABTest.lastLink = sLinkId;
					objABTest.page = 'launch: ';
				}
				objABTest.page += track.page + ': abTest';
				trackEvent.event('event.view', objABTest);

			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackABTestView has the following parameters:\n' +
					'objABTest (object - Required), sLinkId (string - Optional)\n' +
					'objABTest {} syntax:\n' +
				//' - {abTest:"abTest_Value"} or\n' + /*TSA : 20130507 : Not used in this manner - per Biz
					' - {abTest66:"abTest66_Value"} or\n' +
					' - {abTest68:"abTest68_Value",abTest69:"abTest69_Value"}\n' +
					' - sLinkId should be used to pass the link identifier for tracking a new window or lightbox launch.';
				switch (ex) {
				//handle the issues
				case 'OABTreq':
					this._Notify('objABTest is required!', sInstructions);
					break;
				case 'OABTwrong':
					this._Notify('objABTest should be an object!', sInstructions);
					break;
				case 'OABTnoprop':
					this._Notify('objABTest needs at least one property passed in!', sInstructions);
					break;
				case 'OABTempty':
					this._Notify('At least on property value passed in on objABTest was empty!', sInstructions);
					break;
				case 'SLIwrong':
					this._Notify('sLinkId should be an string!', sInstructions);
					break;
				case 'SLIempty':
					this._Notify('sLinkId was empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		//TSA: 201210091115:
		/**
		 * Method used by ABTest Team to track a click
		 * @param {string} sLinkId The name/description of the link/button being clicked.
		 * @return Void
		 */
		trackABTestClick : function(sLinkId) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkId === 'undefined') {
					throw ('SLIreq');
				}
				if (typeof sLinkId !== 'string') {
					throw ('SLIwrong');
				}
				if (sLinkId.length === 0) {
					throw ('SLIempty');
				}

				trackEvent.event("event.link", {
					lid : sLinkId
				});

			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackABTestClick has the following parameter:\n' +
					'sLinkId (string)  - Required\n' +
					'sLinkId should be the linkId (previously lid) value you want tracked.';
				switch (ex) {
				//handle the issues
				case 'SLIreq':
					this._Notify('sLinkId is required!', sInstructions);
					break;
				case 'SLIwrong':
					this._Notify('sLinkId should be an string!', sInstructions);
					break;
				case 'SLIempty':
					this._Notify('sLinkId was empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		EPsplit : function(EPstring) {
			var EPdata = {};
			var EParray = EPstring.split(",");
			for (x in EParray) {
				var EPatt = EParray[x].split("-");
				EPdata[(EPatt[0])] = EPatt[1];
			}
			return EPdata;
		},
		

		
		
		/**
		 * Method used to track the "view" of Experience Platform widget content.
		 * @param {string} sEPTitle Title of the Experience Content container/widget
		 * @return Void
		 */
		trackEPView : function(sEPTitle) {
			'use strict';
			try {
				if (typeof sEPTitle === 'undefined') {
					throw ('EPTitlereq');
				}
				if (typeof sEPTitle !== 'string') {
					throw ('EPTitlewrong');
				}

				//set vars
				var sInitiative = 'EP',
					sPageName = track.page + ': ' + sEPTitle + ': ' + sInitiative;

				//execute tracking call
				trackEvent.event('event.view', {
					page : sPageName,
					experiencePlatform : sPageName
				});

			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackEPView has the following parameter:\n' +
					'sEPTitle (string)  - Required - EP Title (i.e., "Customers Also Purchased")';

				switch (ex) {
				//handle the issues
				case 'EPTitlereq':
					this._Notify('sEPTitle is required!', sInstructions);
					break;
				case 'EPTitlewrong':
					this._Notify('sEPTitle should be an string!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method used to track a link/image click within Experience Platform widget content.
		 * @param {string} sEPTitle Title of the Experience Content container/widget
		 * @param {string} sLinkName The name of the link/image being clicked.
		 * @return Void
		 */
		trackEPClick : function(sEPTitle, sLinkName) {
			'use strict';
			try {
				//Validation of input
				if (typeof sEPTitle === 'undefined') {
					throw ('EPTitlereq');
				}
				if (typeof sEPTitle !== 'string') {
					throw ('EPTitlewrong');
				}
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}

				//set vars
				var sInitiative = 'EP',
				//sActionName = 'click'
				sPageName = track.page + ': ' + sEPTitle + ': ' + sInitiative;

				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.link', {
					page : sPageName,
					//lid: this._CreateLid(sLinkName, sInitiative),
					lastLink : this._CreateLastLink(sLinkName, '', ''),
					conversion : 'event55'
				});

			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackEPClick has the following parameter:\n' +
					'sEPTitle (string)  - Required - EP Title (i.e., "Customers Also Purchased")\n' +
					'sLinkName (string) - Required';

				switch (ex) {
				//handle the issues
				case 'EPTitlereq':
					this._Notify('sEPTitle is required!', sInstructions);
					break;
				case 'EPTitlewrong':
					this._Notify('sEPTitle should be an string!', sInstructions);
					break;
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		},

		/**
		 * Method for tracking previous page campaigns and the corresponding link
		 * @param {string} sLinkName The name of the link/button being clicked.
		 * @param {string} sCampaign The name/id of the campaign being tracked.
		 * @param {string} [sActionName] The action taking place.
		 * @param {string} [sInitiative] value identifying the project/group.
		 * @return Void
		 */
		trackPageCampaign : function(sLinkName, sCampaign, sActionName, sInitiative) {
			'use strict';
			try {
				//Validation of input
				if (typeof sLinkName === 'undefined') {
					throw ('SLNreq');
				}
				if (typeof sLinkName === 'string' && sLinkName.trim().length === 0) {
					throw ('SLNempty');
				}
				if (typeof sCampaign === 'undefined') {
					throw ('SCreq');
				}
				if (typeof sCampaign === 'string' && sCampaign.trim().length === 0) {
					throw ('SCempty');
				}
				//if (typeof sActionName === 'undefined') { throw ('SANreq'); }
				if (typeof sActionName === 'string' && sActionName.trim().length === 0) {
					throw ('SANempty');
				}
				if (typeof sInitiative === 'string' && sInitiative.trim().length === 0) {
					throw ('SIempty');
				}
				//tracking call
				//TODO: Make this a direct call to s_code...no need to execute through trackEvent
				trackEvent.event('event.view', {
					lastLink : this._CreateLastLink(sLinkName, sActionName, sInitiative),
					pageCampaign : sCampaign
				});
			} catch (ex) {
				//instructions for the method
				var sInstructions = 'trackEvent.api.trackPageCampaign has the following parameters:\n' +
					'sLinkName (string) - Required, \n' +
					'sCampaign (string) - Required, \n' +
					'sActionName (string) - Optional - ("click", "launch", "close", "open", etc),\n' +
					'sInitiative (string) - Optional - Identifies your project/group';

				switch (ex) {
				//handle the issues
				case 'SLNreq':
					this._Notify('sLinkName is required!', sInstructions);
					break;
				case 'SLNempty':
					this._Notify('sLinkName cannot be empty!', sInstructions);
					break;
				case 'SCreq':
					this._Notify('sCampaign is required!', sInstructions);
					break;
				case 'SCempty':
					this._Notify('sCampaign cannot be empty!', sInstructions);
					break;
				case 'SANempty':
					this._Notify('sActionName, if passed, cannot be empty!', sInstructions);
					break;
				case 'SIempty':
					this._Notify('sInitiative, if passed, cannot be empty!', sInstructions);
					break;
				default:
					this._Notify('unknown error', sInstructions);
				}
			}
		}
	}
};

//Cache Plugin
trackEvent.pl[0] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		// nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			oItem;

		if (sEvt === "event.cache") {
			for (oItem in oTrack) {
				if (typeof oTrack[oItem] !== "function") {
					oTE._SaveCookie(oItem, oTrack[oItem]);
				}
			}
			return false;
		}
		return true;
	}
};

/**
 * Base Defaults Maps the values for the base properties in 'l' also contained
 * in trackEvent.base
 *
 */
trackEvent.pl[1] = {
	//oTrackEvent : trackEvent,
	l : trackEvent.base.split(","),
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			idx;

		if (oTE.df === 0) {
			oTE.df = {};
			for (idx = 0; idx < this.l.length; idx += 1) {
				if (typeof oTrack[this.l[idx]] !== "undefined") {
					oTE.df[this.l[idx]] = oTrack[this.l[idx]];
				}
			}
		} else {
			for (idx = 0; idx < this.l.length; idx += 1) {
				if (typeof oTrack[this.l[idx]] === "undefined") {
					oTrack[this.l[idx]] = oTE.df[this.l[idx]];
				}
			}
		}
		return true;
	}
};

/**
 * QParam, CParam and Slot map the values for the query parameters, cookie
 * parameters and
 */
trackEvent.pl[2] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack, c, d, e, f, g, h, i) {
		'use strict';
		var oTE = trackEvent,
			sMyQueryString;
		if (oTE.q === 0) {
			sMyQueryString = oTE.myQueryString();
			e = sMyQueryString.substring(1, sMyQueryString.length).split('&');
			f = {};

			for (d in e) {
				if (typeof e[d] === "string") {
					g = e[d].split("=");
					f[g[0]] = unescape(g[1]);
				}
			}
			oTE.q = f;
		} else {
			f = oTE.q;
		}
		g = oTE._RC();
		h = {};
		i = {};
		for (d in oTE.map) {
			if (typeof oTE.map[d] !== "function") {
				if (d.indexOf(".") > -1) {
					e = d.split(".");
					e[2] = false;
					if (e[0] === "qp") {
						e[0] = d;
						e[3] = f[e[1]];
					} else if (e[0] === "cp") {
						e[0] = d;
						e[3] = unescape(g[e[1]]);
						e[3] = (typeof e[3] === "undefined" || e[3] === "undefined") ? "" : e[3];
					} else if (oTE.map[e[0] + "." + oTrack[e[0]]] != null && (typeof i[e[0]] === 'undefined' || i[e[0]] === null)) {
						i[e[0]] = 1;
						e[3] = oTE.map[e[0] + "." + oTrack[e[0]]];
						e[2] = true;
						e[0] = "conversion";
					}
					if (typeof e[3] !== "undefined") {
						oTE._S(e[0], e[3], e[2]);
					}
				}
				if (typeof oTrack[d] !== "undefined") {
					e = oTE.map[d].split(",");
					for (var y = 0; y < e.length; y += 1) {
						if (e[y].indexOf("$") > 0) {
							var z = e[y].split("$");
							if (typeof h[z[0]] === "undefined") {
								h[z[0]] = new Array(8);
							}
							h[z[0]][z[1]] = oTrack[d];
						}
					}
				}
			}
		}
		for (d in h) {
			e = [];
			for (f = 0; f < h[d].length; f += 1) {
				if (typeof h[d][f] !== "undefined" && h[d][f].length > 0) {
					e.push(h[d][f]);
				}
			}
			oTE._S(d, e.join(oTE.tok));
		}

		// remove the finder from the cookie
		oTE._SaveCookie("finder", "", "d");

		return true;
	}
};

/**
 * SiteCatalyst Account determines which siteCatalyst account to use: kiosk or
 * default
 */
trackEvent.pl[3] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			oConfig = Lm.config,
			sProdAcct = oConfig.sc_acct,
			sDevAcct = oConfig.sc_acctdev,
			sReportSuite;
		if (typeof oTrack.storeId !== "undefined") {
			sProdAcct = oConfig.sc_kiosk;
			sDevAcct = oConfig.sc_kioskdev;
		}
		if (location.hostname.toLowerCase().indexOf('kiosk') > -1) {
			// setup StoreID and kmach to prop18
			if (typeof stnum !== "undefined" && stnum !== "") {
				var kioskId = stnum;

				if (typeof oTrack.kmach !== "undefined" && oTrack.kmach !== "") {
					kioskId += ":" + oTrack.kmach;
				} else {
					kioskId += ":Unknown";
				}
				oTE._S("d_kioskId", kioskId);
			}
		}

		if (typeof location !== "undefined" && typeof location.hostname !== "undefined" && location.hostname.indexOf("espanol") > -1) {
			sProdAcct = sProdAcct + "," + oConfig.sc_esp;
			sDevAcct = sDevAcct + "," + oConfig.sc_espdev;
		}
		sReportSuite = ((oConfig.dev === 1) ? sDevAcct : sProdAcct);
		oTE.s_code.sa(sReportSuite);
		return true;
	}
};

//SiteCatalyst Link Tracking
trackEvent.pl[4] = {
	//oTrackEvent : trackEvent,
	linktrack : "lastLink,video,conversion",
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			arrLinkTracks,
			arrLinkTrackEvars = [],
			oItem;

		if (sEvt === "event.link") {
			// build the last link string from the page and last link value
			if (typeof oTrack.lastLink !== "undefined" && typeof oTrack.page !== "undefined") {
				oTrack.lastLink = unescape(oTrack.page) + ": " + ((oTrack.lastLink.length === 0) ? "no lid" : unescape(oTrack.lastLink));
				// oTrack.lastLink = unescape(oTrack.page) + ": " + unescape(oTrack.lid);
			}

			// should we iterate over the incoming object b and add
			// those names to the s.linkTrackEvents?

			/* Track links to mp3s */
			if (oTrack.music === 'launched') {
				oTE._S("conversion", "event11");
			}

			arrLinkTracks = this.linktrack.split(",");

			for (oItem in arrLinkTracks) {
				if (typeof arrLinkTracks[oItem] !== "function") {
					s[oTE.map[arrLinkTracks[oItem]]] = oTrack[arrLinkTracks[oItem]];
					arrLinkTrackEvars.push(oTE.map[arrLinkTracks[oItem]]);
				}
			}
			s.linkTrackVars = arrLinkTrackEvars.join(",");
			if (typeof oTE.b.conversion !== "undefined") {
				s.linkTrackEvents = oTE.b.conversion;
			}
		}
		return true;
	}
};

/**
 * various functions that massage incoming data values
 */
trackEvent.pl[5] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack, c) {
		'use strict';
		var oTE = trackEvent, // trackEvent Object
			oCookie,
			nResultsNum,
			sQPSearchTerm,
			isDifferentSearch = false;

		// toString and default values
		oTrack.language = (document.getElementsByTagName("html")[0].lang === "es") ? "es" : "en";

		// remove unwanted USC character in actor, artist, title, etc
		if (typeof oTE.b["qp.usc"] !== "undefined") {
			c = escape(oTE.b["qp.usc"]);
			oTE.b["qp.usc"] = oTE.v[oTE.map["qp.usc"]] = unescape(c.replace("%A0-", ""));

			// derive searchScope
			oTrack.d_searchScope = ((typeof oTE.b["qp._dynsessconf"] !== "undefined") ? "global:" : "category:") + oTE.b["qp.usc"];
		}

		// Internal Campaign Event
		if (typeof oTE.b["qp.icmp"] !== "undefined") {
			oTE._S("conversion", "event16", true);
		}

		// TODO: incorporate the setting of the searchterm that is being done in
		// plugin 9 into this code
		// if the search term is the same as the cached searchterm then this is
		// not the original search and should not be counted as a search successful
		// or otherwise.
		oCookie = oTE._RC();

		if (typeof oTrack.catId !== "undefined" && oTrack.catId === 'pcat17071') {
			//get the results count
			nResultsNum = ((typeof oTrack.searchResultsNum !== 'undefined') ? parseInt(oTrack.searchResultsNum, 10) : 0);
			// if the searchterm is the same as the previous search then the search
			// should not be
			// identified as successful or unsuccessful
			if (typeof oTrack.searchTerm !== 'undefined') {

				if ((typeof oCookie.lastSearchTerm === 'undefined') || (unescape(oCookie.lastSearchTerm.toLowerCase()) !== oTrack.searchTerm.toLowerCase())) {
					isDifferentSearch = true;
				}
				if (nResultsNum > 0) {
					// if this is synonym search then it is not considered a
					// successful or unsuccessful search
					sQPSearchTerm = (typeof oTE.b["qp.st"] !== 'undefined') ? oTE.b["qp.st"] : '';
					if (sQPSearchTerm.length > 0 && sQPSearchTerm.indexOf('_') < 0) {
						// successful search
						oTE._SaveCookie("lastSearchTerm", oTrack.searchTerm.toLowerCase());
						if (isDifferentSearch) {
							oTE._S("conversion", "event1", true);
						}
					}
				} else {
					// unsuccessful search
					oTE._SaveCookie("lastSearchTerm", oTrack.searchTerm.toLowerCase());
					if (isDifferentSearch) {
						oTE._S("conversion", "event2", true);
					}
				}
			}

			//TSA : 201301101000 : added conditions for SOLR searches //typeof oCookie.searchTermSOLR !== "undefined" &&
			if (typeof oTrack.searchTermSOLR !== 'undefined') {
				if ((typeof oCookie.lastSearchTermSOLR === 'undefined') ||
					(unescape(oCookie.lastSearchTermSOLR.toLowerCase()) !== oTrack.searchTermSOLR.toLowerCase())) {
					isDifferentSearch = true;
				}
				if (nResultsNum > 0) {
					// if this is synonym search then it is not considered a
					// successful or unsuccessful search
					sQPSearchTerm = (typeof oTE.b["qp.st"] !== 'undefined') ? oTE.b["qp.st"] : '';
					if (sQPSearchTerm.length > 0 && sQPSearchTerm.indexOf('_') < 0) {
						// successful search
						oTE._SaveCookie("lastSearchTermSOLR", oTrack.searchTermSOLR.toLowerCase());
						if (isDifferentSearch) {
							oTE._S("conversion", "event1", true);
							var sSearchTermRelevancy = oTrack.searchTermSOLR.toLowerCase();
							oTE._SaveCookie('searchTermRelevancy', sSearchTermRelevancy);
						}
					}
				} else {
					// unsuccessful search
					oTE._SaveCookie("lastSearchTermSOLR", oTrack.searchTermSOLR.toLowerCase());
					if (isDifferentSearch) {
						oTE._S("conversion", "event2", true);
					}
				}
			}
			// Record last page when on search results page (SDR item)
			oTE._S("searchLastPage", oTE.b["cp.searchLastPage"]);

		} else if (typeof oTE.b["qp.searchresults"] !== 'undefined' && typeof oTE.b["qp.searchterm"] !== 'undefined') {
			// if the the resulting page is not pcat17071 and there is a searchterm and
			// searchresultsNum on the page
			// then it is a redirect and is still considered a successful search
			var bIsRedirect = false;
			//check for SOLR
			if (typeof oTE.b["qp.issolr"] !== 'undefined' && oTE.b["qp.issolr"] === '1') {

				//TSA : 201301221337 : issolr is true ...does this stay?
				// if the the resulting page is not pcat17071 and there is a searchterm and
				// searchresultsNum on the page
				// then it is a redirect and is still considered a successful search
				if (oTE.b["qp.searchterm"] !== unescape(oCookie.lastSearchTermSOLR)) {
					oTE._SaveCookie("lastSearchTermSOLR", oTE.b["qp.searchterm"]);
					bIsRedirect = true;
				}

			} else {

				if ((typeof oCookie.lastSearchTerm === 'undefined') || oTE.b["qp.searchterm"] !== unescape(oCookie.lastSearchTerm)) {
					oTE._SaveCookie("lastSearchTerm", oTE.b["qp.searchterm"]);
					bIsRedirect = true;
				}

			}

			if (bIsRedirect) {
				oTE._S("conversion", "event1", true);
				oTE._S("searchLastPage", oTE.b["cp.searchLastPage"]);
				oTrack.d_searchScope = "redirect";
			}
		}

		// purchase id truncation to handle 20 chars or less - removing BBY01-
		if (typeof oTrack.orderId !== "undefined" && oTrack.orderId.length > 6) {
			oTrack.d_purchaseId = oTrack.orderId.substring(6);
		}
		// replace storedValueCard with GC
		if (typeof oTrack.payTypeList !== "undefined" && oTrack.payTypeList !== "") {
			oTrack.payTypeList = oTrack.payTypeList.replace(/storedValueCard/g, "GC");
		}
		// tealeaf integration
		var f = oTE._GetCookieValue('SID'); //'TLTSID'
		oTrack.sid = (f !== "") ? f : "no_id"; //tltsid

		//TSA : 201110182300 : Add ATG ID to eVar50 when user is Recognized/Authenticated
		if (typeof oTrack.recognized !== "undefined" &&
				(oTrack.recognized === "Authenticated" || oTrack.recognized === "Recognized")) {
			if (typeof oTrack.profileId !== "undefined" && oTrack.profileId.length > 0) {
				oTrack.atgID = oTrack.profileId;
			}
		}

		return true;
	}
};

/**
 * BestBuy Custom Products plugin - syntax-
 * ;id;qty;price;event1|event2;evar1=1|evar2=2(,;id2;qty;price)
 *
 * correlates the product id, quantity, and price captures event12 captures
 * ratings for eVar35 adds the newly created string to the cookie for checkout
 * pages
 */
trackEvent.pl[6] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			arrSku = [],
			arrQty = [],
			arrPrice = [],
			idx,
			sRating = "",
			nSkuCount = 0,
			oProduct = {},
			arrProducts = [],
			sProducts = "";
			
		if (typeof oTrack.catId !== "undefined" && typeof oTrack.templateName !== "undefined" &&
				oTrack.templateName.indexOf("AB") === -1 && oTrack.templateName.indexOf("SRC") === -1 &&
				(typeof oTrack.skuList !== "undefined" || typeof oTrack.skuId !== "undefined" || oTrack.catId === "pcat17005")) {
	
			//reset product list before writing new
			oTE.products.list = [];

			arrSku = (typeof oTrack.skuList !== "undefined") ? oTrack.skuList.split(",") : ((typeof oTrack.skuId !== "undefined") ? oTrack.skuId.split(",") : []);
			arrQty = (typeof oTrack.qtyList !== "undefined") ? oTrack.qtyList.split(",") : [];
			arrPrice = (typeof oTrack.priceList !== "undefined") ? oTrack.priceList.split(",") : [];

			//if on cart, check main track object for cart items if none passed to call
			if(oTrack.catId === "pcat17005" && arrSku.length === 0) {
				arrSku = (typeof track.skuList !== "undefined") ? track.skuList.split(",") : ((typeof track.skuId !== "undefined") ? track.skuId.split(",") : []);
				arrQty = (typeof track.qtyList !== "undefined") ? track.qtyList.split(",") : [];
				arrPrice = (typeof track.priceList !== "undefined") ? track.priceList.split(",") : [];
			}
			
			// add order discount list
			if ((arrQty.length < arrSku.length) || (arrPrice.length < arrSku.length)) {
				for (idx = 0; idx < arrSku.length; idx += 1) {
					arrQty.push("");
					arrPrice.push("");
				}
			}

			//Product Detail Compare Page
			if (oTrack.catId === "cat13504") {
				oTE._S("conversion", "event12", true);
			}
			//track Rating
			if (typeof oTrack.rating !== "undefined" && oTrack.rating.length > 0) {
				sRating = "eVar35=" + oTrack.rating;
			}

			nSkuCount = (arrSku.length > 25) ? 25 : arrSku.length;

			for (idx = 0; idx < nSkuCount; idx += 1) {
				arrProducts.push(";" + arrSku[idx] + ";" + arrQty[idx] + ";" + arrPrice[idx] + ";;" + sRating);

				oProduct = new oTE.cProduct();
				oProduct.sku = arrSku[idx];
				oProduct.quantity = arrQty[idx];
				oProduct.price = arrPrice[idx];

				oTE.products.add(oProduct);
			}

			sProducts = arrProducts.join(",");
			if (sProducts !== "") {
				oTE._S("d_product", sProducts);
				if (oTrack.catId === "pcat17005") {
					oTE.products.saveTrackProductsCookie(sProducts);
				}
			}
		} else if(nSkuCount < 1) {
			//if cart empty, reset list
			oTE.products.list = [];
		}
		
		
		return true;
	}
};
/*
 * BestBuy Custom Pages Plugin Set hour of the day within the half hour Set day
 * of week Get the facet name and value through DOM inspection Create page name
 * hierarchy Create previous page link Set the product tab value by massaging
 * the 'tab' value from the cookie Set specific values if the download cookie is
 * set Reset values in the cookie generate HREF OIDs
 */
trackEvent.pl[7] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		'use strict';
		// add event to window where any mouse down will set the lid on the
		// cookie

		//var dtStart = new Date();
		/*
		$('body').delegate("a[data-lid]","mousedown",function(){
		console.info( 'delegate data-lid:' + $(this).attr("data-lid") );
		});
		*/
		//initialize the mousedown event on the body tag
		Lm.EV(document.getElementsByTagName("body")[0], "mousedown", trackEvent.LC);

		//var dtEnd = new Date();
		//console.log((dtEnd - dtStart) + "ms");
	},
	_E : function(sEvt, oTrack, c, d, e, f, g, h, q, r, s) {
		'use strict';
		var oTE = trackEvent, // trackEvent Object
			sFacetSelector,
			sFacetInfo,
			arrFacetInfo,
			nIdx;
		h = oTE._RC();
		h = (typeof h === "undefined") ? {} : h;

		// Time of Day/Week
		c = new Date();
		d = c.getMinutes();
		e = c.getHours();
		f = "AM";
		g = {
			0 : "Sunday",
			1 : "Monday",
			2 : "Tuesday",
			3 : "Wednesday",
			4 : "Thursday",
			5 : "Friday",
			6 : "Saturday"
		};
		d = (d > 30) ? 30 : "00";
		if (e === 0) {
			e = 12;
		} else if (e === 12) {
			f = "PM";
		} else if (e > 12) {
			e -= 12;
			f = "PM";
		}
		oTE._S("hourOfDay", e + ":" + d + " " + f);
		oTE._S("dayOfWeek", g[c.getDay()]);

		// Facet - object error, exception negative value, firstChild null, no
		// property of firstChild, G undefined,
		try {
			//jquery selector for facet
			sFacetSelector = '#facetselected:visible>ul:last>li:last:first-child';
			//get the facet
			sFacetInfo = jQuery(sFacetSelector).contents(':first').text();
			//was facet found?
			if (sFacetInfo.length > 0) {
				//clean-up facet
				sFacetInfo = unescape(escape(sFacetInfo).replace(/%0A/, '').replace(/%0A/, ' ').replace(/%AE/g, '').replace(/%u2122/g, '').replace(/\s+/, ""));
				//put the facet string into an array
				arrFacetInfo = sFacetInfo.split(":");
				//loop through facet array
				for (nIdx in arrFacetInfo) {
					//clean-up the facet string 
					arrFacetInfo[nIdx] = jQuery.trim(arrFacetInfo[nIdx]);
				}
				//set facetName
				oTrack.facetName = arrFacetInfo[0];
				//is this a solr result?
				if (typeof oTrack.searchTermSOLR !== "undefined" && oTrack.searchTermSOLR.length > 0) {
					//add 'SOLR' to array for prefix
					arrFacetInfo.unshift('SOLR')
				}
				//set facet name
				oTrack.facetValue = arrFacetInfo.join(": ");
			}
			/* TSA : 20130419 : refactored, above
			c = (document.getElementById("facetselected") != null) ? document.getElementById("facetselected") : "";
			if (c != "" && c.style.display != 'none') {
				d = (c.getElementsByTagName("ul") != null) ? c.getElementsByTagName("ul") : "";
				if (d != "") {
					c = (d[0].style.display == 'none' && d.length > 1 && typeof d[1] !== "undefined") ? d[1].getElementsByTagName("li") : d[0].getElementsByTagName("li");
					c = c[c.length - 1];
					d = (c.firstChild != null && c.firstChild.nodeValue != null) ? c.firstChild.nodeValue : "";
					if (d != "") {
						e = d.indexOf(":");
						f = d.indexOf("null");
						if (e > 0 && f < 0) {
							e = escape(d).replace(/%0A/, '').replace(/%0A/, ' ').replace(/%AE/g, '').replace(/%u2122/g, '');
							d = unescape(e);
							f = d.indexOf(":");
							oTrack.facetName = d.substring(0, f);
							oTrack.facetValue = oTrack.facetName + ": " + d.substring(f + 1);
						}
					}
				}
			}
			*/
		} catch (ex) {
			oTrack.error = "pl[7]: " + ex;
		}

		// Construct pageName and hierarchy
		oTE.plc++;
		c = ["uberCatName",
			"parentCatName",
			(typeof oTrack.catId !== "undefined" && oTrack.catId === "pdp") ? "catId" : "catName"];
		d = 2;
		e = [];
		f = [];
		// TODO consider refactoring: Clumsy assignment.
		// Re-using 'e' and 'f'
		for (g = 0; g < c.length; g++) {
			if (typeof oTrack[c[g]] !== "undefined" && oTrack[c[g]].length > 0) {
				e.push(oTrack[c[g]]);
				// additional logic to set the correct ubercat
				q = "d_uberCat";
				if (typeof oTE.b[q] === "undefined") {
					r = (c[g] === "catId") ? "catName" : c[g];
					if (typeof oTrack[r] !== "undefined" && oTrack[r].length > 0) {
						// if this is the thank you page then add the
						// change the ubercat to uniquely identify the checkout
						// page
						if (oTrack[r] === "Checkout" && oTrack.catId === "pcat17014") {
							s = "Checkout.ThankYou";
						} else {
							s = oTrack[r];
						}
						oTE._S(q, s);
					}
				}
				if (g <= d) {
					f.push(oTrack[c[g]]);
				}
			}
		}
		if (e.length === 0) {
			//code for pdp commerce lbox - protect page value
			//code for chat online - protect page vaue
			if (typeof oTrack.clickAction === "undefined" && typeof oTrack.launchedFrom === "undefined") {
				if (typeof oTE.df.page !== "undefined") {
					//TSA: 20111222: if page was passed in use it for tracking instead of default
					oTE.s_code.pageName = (typeof oTrack.page !== "undefined") ? oTrack.page : oTE.df.page;
					//TSA: 20111222: if page was passed in use it for tracking instead of default
					if (typeof oTrack.page === "undefined") {
						oTrack.page = oTE.df.page;
					}
					oTrack.section = oTE.df.section;
				} else {
					oTrack.page = "error: " + document.title;
				}
			}
		} else {
			if (typeof oTrack.facetName !== "undefined") {
				e.push("Faceted");
			}
			if (typeof oTrack.language !== "undefined" && oTrack.language === "es") {
				e.push("Spanish");
			}
			//code for pdp commerce lbox - protect page value
			//code for chat online - protect page vaue
			if (typeof oTrack.clickAction === "undefined" && typeof oTrack.launchedFrom === "undefined") {
				oTE.df.page = oTrack.page = oTE.s_code.pageName = e.join(": ");
			}
			oTE.df.section = oTrack.section = f.join(",");
		}

		// derive category
		if (typeof f[0] !== "undefined" && f[0] === "Checkout") {
			oTrack.d_category = oTrack.page;
		} else if (f.length >= 1) {
			if (typeof f[2] !== "undefined") {
				if (f[2] === "pdp") {
					if (typeof f[1] !== "undefined") {
						f[1] = f[1].split(':')[0];
					}
				} //else if (f[2].indexOf("customerreviews") > -1) { // not used
				//                      f[0]="pdp";
				//                      f[1]=undefined;
				//}
			}
			//code for pdp commerce lbox - protect d_category value
			if (typeof oTrack.clickAction === "undefined") {
				oTrack.d_category = (typeof f[1] !== "undefined") ? f[0] + ": " + f[1] : f[0];
			}
		}

		// Merchandising Category Analysis
		if (typeof oTrack.catId !== "undefined") {
			// *** On all "category browse" pages set eVar1 to pageName
			if (oTrack.catId.toLowerCase().indexOf("abcat") !== -1 || oTrack.catId.toLowerCase().indexOf("pcmcat") !== -1) {
				oTE._S("d_merchCategory", oTrack.page);

				// Refinements SVE fix
				// If facet id is set, remove it here.
				if (typeof oTrack.facetValue !== "undefined") {
					if (oTrack.facetValue !== "") {
						oTE._S("facetValue", "");
					}
				}
			}

			// *** Product Page should NOT set a value for eVar1 unless...
			else if (oTrack.catId === "pdp") {
				// is Direct
				if (document.referrer.length === 0) {
					oTE._S("d_merchCategory", "Direct");
				}
				// is External campaign
				else if (document.referrer.toLowerCase().indexOf('bestbuy.com') > -1) {
					if (typeof oTE.b["qp.ref"] !== 'undefined' && typeof oTE.b["qp.loc"] !== 'undefined') {
						// if there is a ref and loc?
						if (oTE.b["qp.ref"].length > 0 && oTE.b["qp.loc"].length > 0) {
							oTE._S("d_merchCategory", "External Campaign");
						}
						// Referrer (something other than bestbuy)
						else {
							oTE._S("d_merchCategory", "Referrer");
						}
					}
				} else {
					oTE._S("d_merchCategory", "");
				}
			}
			// *** On search results set eVar1 to "Search Results"
			else if (oTrack.catId === "pcat17071") {
				oTE._S("d_merchCategory", "Search Results");
			}
			// Homepage
			else if (oTrack.catId === "cat00000") {
				oTE._S("d_merchCategory", "Homepage");
			}
			// In Cart / Checkout
			else if (oTrack.uberCatName === "Checkout") {
				oTE._S("d_merchCategory", "");
			}
			// *** On pages EXCEPT "category browse" pages and "product" pages set
			// eVar1 to "Non-Browse"
			else {
				oTE._S("d_merchCategory", "Non-Browse");
			}

		} else {
			oTE._S("d_merchCategory", "Non-Browse");
		}

		// Previous Page: Link - no lid doesn't set
		oTE.plc++;
		if (typeof h.lid !== "undefined") {
			if (typeof h.page !== "undefined" && !(oTrack.lastLink)) {
				h.lid = (h.lid.length === 0) ? "no lid" : h.lid;
				oTrack.lastLink = unescape(h.page) + ": " + unescape(h.lid);
				oTE._SaveCookie("lid", "", "d");
			}
			if (h.lid.indexOf('hdr') === 0 || h.lid.indexOf('ft') === 0 || h.lid.indexOf('ubr') === 0) {
				oTrack.headerFooter = h.lid;
			}
		}

		//don't populate productTab if clickAction used
		if (typeof oTrack.clickAction === "undefined") {
			// Tabs
			oTE.plc++;
			if (typeof h.tab !== "undefined" && typeof h.page !== "undefined" && typeof h.lastPage !== "undefined") {
				f = unescape(h.tab);
				f = oTE.rep(f, '[', '');
				f = oTE.rep(f, ']', '');
				f = oTE.rep(f, '"', '');
				oTrack.productTab = unescape(oTE.rep(h.page, "pdp", h.lastPage) + ": " + f);
			}
		}

		// bazaar
		oTE.plc++;
		if (typeof h.download !== "undefined") {
			// oTE._S("conversion", "event33", true);
			oTE._SaveCookie("download", "", "d");
		}

		// soldOut, in store only, and coming soon
		c = false;
		if (oTrack.isCloud) {
			//TSA : 201302080140 : Added to properly track unavailable SKUs on cloud PDP
			var sSel = 'span.disabled-large-button';
			var sCrtBtnTxt = jQuery(sSel + ':contains("In Store Only"),' +
				sSel + ':contains("Coming Soon"),' +
				sSel + ':contains("Sold Out Online")').text();

			switch (sCrtBtnTxt) {
			case 'Sold Out Online':
				c = true;
				d = "soldOutOnline";
				break;

			case 'In Store Only':
				c = true;
				d = "inStoreOnly";
				break;

			case 'Coming Soon':
				c = true;
				d = "comingSoon";
				break;

			default:
			//nothing here
			}
		} else {
			if (jQuery("#soldout").length > 0) {
				c = true;
				d = "soldOutOnline";
			} else if (jQuery("#instoreonly").length > 0) {
				c = true;
				d = "inStoreOnly";
			} else if (jQuery("#comingsoon").length > 0) {
				c = true;
				d = "comingSoon";
			}
		}

		if (c) {
			oTE._S("outOfStock", d);
			oTE._S("conversion", "event13", true);
		}

		oTE.plc++;

		// If lastCatId="17000" and track.recognized="authenticated" then send
		// event9
		if (typeof h.lastCatId !== "undefined" && (h.lastCatId === "pcat17000" || h.lastCatId === "pcat17022") &&
				oTrack.recognized === "Authenticated") {
			// logged in
			oTE._S("conversion", "event9", true);
		}

		oTE.plc++;

		/*
		 * Completed building mobile package (check it started... persist? leave to
		 * infer based on context)
		 */
		if (oTrack.catId === 'pcat17407' && oTrack.catName === 'Package Detail') {
			// add product sku to s.products
			var products = []; // TODO: use new Products object?
			jQuery('#centerwell div.phonedesc p').each(function() {
				products.push(';' + jQuery(this).html().split(/<\/strong>\n/)[1]);
			});
			/* TSA : 20130419 : refactored, above
			 * var phoneDescription = (document.getElementById('centerwell')) ? document.getElementById('centerwell').getElementsByTagName('p') : [];
			 for (var i = 0; i < phoneDescription.length; i += 1) {
			 if (phoneDescription[i].innerHTML.toLowerCase().match(/sku:<\/strong>/)) {
			 // @see trackEvent#pl[6] for product string pattern
			 products.push(";" + unescape(phoneDescription[i].innerHTML.toLowerCase().split('sku:</strong>')[1].replace(/[\n\s]+/, "")) + ";;;;");
			 }
			 }*/
			oTE._S("conversion", "event15", true);
			oTE._S("d_product", products.join(','));
		}

		// re-set values
		oTE.plc++;
		oTE._SaveCookie("tab", "", "d");
		if (typeof oTrack.templateName !== "undefined") {
			oTE._SaveCookie("lastPage", oTrack.templateName);
		}
		if (typeof oTrack.page !== "undefined") {
			oTE._SaveCookie("page", oTrack.page);
		}
		if (typeof oTrack.page !== "undefined") {
			oTE._SaveCookie("searchLastPage", oTrack.page);
		}
		return true;
	}
};

//BestBuy Custom Commerce Plugin
trackEvent.pl[8] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			sInCartCookie = '',
			sTrackProductsCookie = '',
			sCatId = oTrack.catId,
			arrCurrentCart = [],
			arrPreviousCart = [],
			arrD2CAvailability = [],
			//arrTrackProduct = [],
			//arrUpdatedCart = [],
			bCartItemAdded = false,
			nCartItemCount = 0,
			dtNow = null,
			sProductAddedDate = '',
			sPersistItem = '',
			idx = 0;

		if (typeof sCatId !== "undefined") {//&& sEvt === 'event.view'
			sInCartCookie = oTE.products.getInCartCookie();
			sTrackProductsCookie = oTE.products.getTrackProductsCookie();

			//TSA: 20120918 : checking for scAdd in the trackEvent.event call
			//Check for scAdd and product string being passed in
			//This handles in-Page add-to-cart events from the lightbox
			if (typeof oTrack.conversion !== 'undefined' && oTrack.conversion.indexOf('scAdd') > -1 &&
					typeof oTrack.d_product !== 'undefined' && oTrack.d_product.length > 0) {

				bCartItemAdded = true;

				//TSA : 20120917 : Persistent Cart - eVar40
				dtNow = new Date();
				sProductAddedDate = (dtNow.getMonth() + 1) + "-" + dtNow.getDate() + "-" + dtNow.getFullYear();
				sPersistItem = oTE.products.extractProductObj(oTrack.d_product).sku + '|' + sProductAddedDate;

				oTE._S("persistCartItem", sPersistItem);

				if (sInCartCookie.length > 0 && oTrack.conversion.indexOf('scOpen') > -1) {
					oTrack.conversion = oTrack.conversion.replace(',scOpen', '').replace('scOpen,', '');
				}

				sInCartCookie += ((sInCartCookie.length > 0) ? ',' : '') + oTE.products.baseProductString(oTrack.d_product);
				oTE.products.saveInCartCookie(sInCartCookie);
			}

			oTE.plc++;

			//TSA: 201211061205: remove d2cAvailability if populated by buggy JSP code
			if (typeof oTrack.d2cAvailability !== 'undefined' && oTrack.d2cAvailability === 'backordered:12345') {
				try {
					delete oTrack.d2cAvailability;
				} catch (ex) {
					oTrack.d2cAvailability = undefined;
				}
			}

			//TSA : 201211141030 : pulling valid d2cAvailability - Temporary Fix
			//only get availability if in the cart > purchase process
			if (typeof oTrack.d2cAvailability === 'undefined' && sCatId.indexOf('pcat17') === 0) {
				oTrack.d2cAvailability = trackEvent.getD2CAvailabilityValue();
			}

			//TSA : 2012110315?? : check for track.d2cAvailability
			if (typeof oTrack.d2cAvailability !== 'undefined' && oTrack.d2cAvailability !== null) {
				var tmpArr = oTrack.d2cAvailability.split(',');
				//build array of d2c availabilities
				for (idx = 0; idx < tmpArr.length; idx += 1) {
					var oD2CProd = {};
					oD2CProd.sku = tmpArr[idx].split(':')[0];
					oD2CProd.avail = tmpArr[idx].split(':')[1].toLowerCase();
					arrD2CAvailability.push(oD2CProd);
				}
			}

			switch (sCatId) {
			//thank you page
			case 'pcat17014' :
				if (typeof oTrack.orderId !== 'undefined' && oTrack.orderId !== '') {
					// On Thank you page with a completed order.
					if (oTE.products !== 'undefined' && oTrack.ffTypeList !== 'undefined') {
						var prds = oTE.products;
						var pList = prds.getProducts();
						var prd = {},
							ffType = oTrack.ffTypeList.split(',');

						for (idx = 0; idx < pList.length; idx += 1) {
							prd = pList[idx];
							prd.ffType = ffType[idx];

							// Ship - TSA 201110052230 : Added ship_standard, ship_express, ship_expedite
							if (prd.ffType.toLowerCase() === 'ship' ||
									prd.ffType.toLowerCase() === 'delivery' ||
									prd.ffType.toLowerCase() === 'ship_standard' ||
									prd.ffType.toLowerCase() === 'ship_express' ||
									prd.ffType.toLowerCase() === 'ship_expedite') {

								// Ship
								prd.addEVar('eVar44=' + prd.ffType);
								if (prds.render(true).indexOf('event4=') === -1) {//doesn't exist in the product string
									// If orderShipAmt has not been added..
									prd.addEvt('event4=' + oTrack.orderShipAmt);
									oTE._S('conversion', 'event4', true);
								}

							} else if (prd.ffType.toLowerCase() === 'pickup') {
								// Pickup
								prd.addEVar('eVar44=pickup');
							}
							//TSA : 201209121445 : check for availability to report on
							if (arrD2CAvailability.length > 0) {
								for (idx = 0; idx < arrD2CAvailability.length; idx += 1) {
									if (arrD2CAvailability[idx].sku === prd.sku) {
										//add availability eVar to product
										prd.addEVar('eVar31=' + arrD2CAvailability[idx].avail.toLowerCase());
										prd.addEvt('event59=1');
										break;
									}
								}// end for D2C Availability
								oTE._S('conversion', 'event59', true);
							} // end if D2C Availability
						}//end for pList
						oTE._S('d_product', prds.render(true)); // replace product string
					}//end oTE.products && oTrack.ffTypeList

					oTE._S('conversion', 'purchase', true);
					// clear the inCart cookie
					//oTE._SaveCookie("inCart", "", "d");
					oTE.products.saveInCartCookie('', 'd');
					////clear track_Product cookie
					//oTE.products.saveTrackProductsCookie('');
				}//end oTrack.orderId
				break;

			case 'pcat17005':
				// Cart Events and Add to Cart report
				// purposely does not track addition or subtraction of quantity of
				// existing skus.
				// only tracks addition or subtraction of sku itself
				//Cart page

				// pull the skulist from the current cart and
				// the skulist from the items that were in the cart before this
				// add or remove occurred

				//resolve timing issue with updating b object
				if("undefined" != typeof oTrack["cp.lastPage"]) { oTE._S("cp.lastPage",oTrack["cp.lastPage"]); }

				
				//internal track object
				arrCurrentCart = (typeof oTE.b.d_product !== 'undefined' && oTE.b.d_product.length > 0) ? oTE.b.d_product.split(',') :
					((typeof oTE.products.render() !== 'undefined' && oTE.products.render().length > 0) ? oTE.products.render().split(',') : []);
					
				//cookie
				arrPreviousCart = (sInCartCookie.length > 0 && sInCartCookie.split(',')[0].length > 0) ? sInCartCookie.split(',') : [];

				if (arrPreviousCart === []) {
					oTE.products.saveInCartCookie('', 'd');
				}

				//check for changes
				var oChanges = oTE.Cart_Changes(arrCurrentCart, arrPreviousCart, arrD2CAvailability),
					sProducts = '',
					sEvar = '';

				//if (oChanges.type === 'scOpen,scAdd' || oChanges.type === 'scAdd') {
				if (oChanges.type === 'scOpen' || oChanges.type === 'scAdd') {
					//                      capture eVar7 (last page) when product is added
					sEvar = 'eVar7=' + oTE.b['cp.lastPage'];
				}
				
				//build product string
				for (idx = 0; idx < oChanges.arrProds.length; idx += 1) {
					sProducts += ';' + oChanges.arrProds[idx].sku + ';' +
						oChanges.arrProds[idx].quantity + ';' +
						oChanges.arrProds[idx].price + ';' +
						oChanges.arrProds[idx].events + ';' +
						oChanges.arrProds[idx].eVars +
						((oChanges.arrProds[idx].eVars.length > 0 && sEvar.length > 0) ? '|' : '') +
						sEvar;

					if ((idx + 1) < oChanges.arrProds.length) {
						sProducts += ',';
					}
				}
				//var bAdd = false,
				//bOpen = false;
				
				switch (oChanges.type) {
				//case 'scOpen,scAdd' :
				case 'scOpen' :
					//set scOpen event
					oTE._S('conversion', 'scOpen', true);
				// no break;, fall through

				case 'scAdd' :
					//TSA : 20120917 : persistent Cart
					if (!bCartItemAdded) {
						//not previously set
						dtNow = new Date();
						sProductAddedDate = (dtNow.getMonth() + 1) + '-' + dtNow.getDate() + '-' + dtNow.getFullYear();
						sPersistItem = oTE.products.extractProductObj(sProducts).sku + '|' + sProductAddedDate;
						oTE._S('persistCartItem', sPersistItem);
					}

					//save current cart to inCart cookie
					oTE.products.saveInCartCookie(arrCurrentCart.join(','));
					//set product string
					oTE._S('d_product', sProducts);
					//set event
					oTE._S('conversion', 'scAdd', true);
					break;

				case 'scRemove' :
					//set event
					oTE._S('conversion', 'scRemove', true);
					//set product string
					oTE._S('d_product', sProducts);
					//is cart empty?
					if (arrCurrentCart.length > 0) {
						//save current cart to inCart cookie
						oTE.products.saveInCartCookie(arrCurrentCart.join(','));
					} else {
						//clear out the inCart cookie
						oTE.products.saveInCartCookie('');
					}
					break;

				case 'event59' :
					//TSA: 201210031645: new event for all d2c availabilities
					//set event
					oTE._S('conversion', 'event59', true);
					//set product string
					oTE._S('d_product', sProducts);
					//is cart empty?
					if (arrCurrentCart.length > 0) {
						//save current cart to inCart cookie
						oTE.products.saveInCartCookie(arrCurrentCart.join(','));
					} else {
						//clear out the inCart cookie
						oTE.products.saveInCartCookie('');
					}
					break;

				default:
					//scView
					// Nothing changed
					//TSA: 201111151545: Save track version of product string to cookie
					//                      it is the latest cart from page
					//set event
					oTE._S('conversion', 'scView', true);
					//set product string
					oTE._S('d_product', sProducts);
					//is cart empty?
					if (arrCurrentCart.length > 0) {
						//save current cart to inCart cookie
						oTE.products.saveInCartCookie(arrCurrentCart.join(','));
					}
					break;
				}// end switch oChanges.type

				// capture event22 on fulfillment change
				if(oTrack.fulfillmentChange) {
					oTE._S('d_product', ";"+oTrack.product.sku+";"+oTrack.product.qty+";"+oTrack.product.price+";event22=1;;");
				}

				break;

			case 'pcat17009':
			//delivery page
			//no break;, fall through to next case

			case 'pcat17013':
				//submission/payment page
				arrPreviousCart = (typeof sInCartCookie.length > 0 && oInCartCookie.split(',')[0].length > 0) ? sInCartCookie.split(',') : [];
				//TSA : 201209121445 : check for availability to report on
				if (arrD2CAvailability.length > 0) {
					sProducts = '';

					for (idx = 0; idx < arrD2CAvailability.length; idx += 1) {
						sProducts += ';' + arrD2CAvailability[idx].sku + ';;;' +
							'event59=1;' +
							'eVar31=' + arrD2CAvailability[idx].avail.toLowerCase();
						if (sProducts.length > 0 && (idx + 1) < arrD2CAvailability.length) {
							sProducts += ',';
						}
					}
					//TODO: Update track_product cookie when remove occurs?
					//set event
					oTE._S('conversion', 'event59', true);
					//set product string
					oTE._S('d_product', sProducts);
				}
				break;

			case 'pcat17022':
			//checkout - login
			//no break;, fall through

			case 'pcat17002':
				//checkout - login
				//read track_product cookie for checkout
				//f = oTE._GetCookieValue(oTE.ns + "_product");
				if (sTrackProductsCookie.length > 0 && sTrackProductsCookie.split(',')[0].length > 0) {
					oTE._S('d_product', sTrackProductsCookie);
				}
				//document.cookie = oTE.ns + "_product=" + escape(f) + ";;path=/;domain=" + Lm.config.domain + ";";
				break;

			default:

			}// end switch

			//persisted cart items count - eVar 55
			nCartItemCount = oTE.products.getCartItemCount();

			if (nCartItemCount > 0) {
				oTE._S('persistedCartItemCount', nCartItemCount + ' item' + ((nCartItemCount > 1) ? 's' : '') + ' in cart');
			}
		}// end if catId
		return true;
	} //end _E
};

//BestBuy Custom Search/Campaign Plugin
trackEvent.pl[9] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		// nothing initialized
	},
	_E : function(sEvt, oTrack, c, d, e, f, h) {
		'use strict';
		var oTE = trackEvent, // trackEvent Object
			oCookie = oTE._RC() || {};

		// Set searchTerms to lowercase to prevent multiple case-driven
		// duplicates
		if (typeof oTE.q.searchterm !== "undefined") {
			oTE.q.searchterm = oTE.q.searchterm.toLowerCase();
		}
		//TSA : 201305131105 : added
		if (typeof oTE.q.st !== "undefined") {
			oTE.q.st = oTE.q.st.toLowerCase();
		}
		if (typeof oTrack.searchTerm !== "undefined") {
			oTrack.searchTerm = oTrack.searchTerm.toLowerCase();
		}
		if (typeof oCookie.lastSearchTerm !== "undefined") {
			oCookie.lastSearchTerm = oCookie.lastSearchTerm.toLowerCase();
		}
		//TSA : 201301111125 : conditions for SOLR searches
		if (typeof oTrack.searchTermSOLR !== "undefined") {
			oTrack.searchTermSOLR = oTrack.searchTermSOLR.toLowerCase();
		}
		if (typeof oCookie.lastSearchTermSOLR !== "undefined") {
			oCookie.lastSearchTermSOLR = oCookie.lastSearchTermSOLR.toLowerCase();
		}

		// Search Synonym
		f = (typeof oTE.q.st !== "undefined" && oTE.q.st.indexOf("_") > -1) ? 1 : 0;
		if (typeof oTrack.catId !== "undefined" && oTrack.catId === "pcat17071" && f > 0) {
			//TSA: 20130516: Turned off search_synonym off for SOLR < FAST only
			//if (typeof oTE.q.issolr !== "undefined" && oTE.q.issolr === "1") {
			//    oTrack.d_searchSynonymSOLR = oTE.q.st;
			//} else {
			oTrack.d_searchSynonym = oTE.q.st;
			//}
		}

		//TSA: 20130516: Turned off search_synonym off for SOLR < FAST only
		// workaround as SOLR is setting searchTermSOLR on search_synonym pages when it shouldn't
		if (typeof oTrack.d_searchSynonym !== 'undefined' && oTrack.d_searchSynonym.length > 0 && typeof oTrack.searchTermSOLR !== 'undefined' && oTrack.searchTermSOLR.length > 0) {
			oTrack.searchTerm = oTrack.searchTermSOLR;
			oTrack.searchTermSOLR = '';
		}

		oTE.plc++;

		// Search Synonyms and Redirects
		if (oTE.q !== 0) {
			if (typeof oTE.q.searchterm !== "undefined") {
				//redirect
				if (typeof oTE.q.issolr !== "undefined" && oTE.q.issolr === "1") {
					oTrack.searchTermSOLR = "redirect: " + oTE.q.searchterm;
					//prefix searchResultsNum with 'SOLR: '
					oTrack.searchResultsNum = "SOLR: redirect";
				} else {
					oTrack.searchTerm = "redirect: " + oTE.q.searchterm;
					oTrack.searchResultsNum = "redirect";
				}
			} else if (f > 0) {
				//synonym
				if (typeof oTE.q.issolr !== "undefined" && oTE.q.issolr === "1") {
					oTrack.searchTermSOLR = "NA";
				} else {
					oTrack.searchTerm = "NA";
				}
				oTrack.searchResultsNum = "";
			}
		}

		oTE.plc++;

		// modified keyword
		if (typeof oTrack.searchTermSOLR !== 'undefined' && oTrack.searchTermSOLR.length > 0) {
			if (typeof oTrack.searchKey !== "undefined" && oTrack.searchKey.length > 0) {
				//prefix searchKey with 'SOLR: '...if it's not there already
				oTrack.searchKey = ((oTrack.searchTermSOLR.indexOf('SOLR: ') > -1) ? '' : 'SOLR: ') + oTrack.searchTermSOLR + ": " + oTrack.searchKey;
				oTrack.searchTermSOLR = "NA";
			} else {
				oTrack.searchKey = "SOLR: NA";
			}
		} else if (typeof oTrack.searchTerm !== "undefined") {
			if (typeof oTrack.searchKey !== "undefined" && oTrack.searchKey.length > 0) {
				oTrack.searchKey = oTrack.searchTerm + ": " + oTrack.searchKey;
				oTrack.searchTerm = "NA";
			} else {
				oTrack.searchKey = "NA";
			}
		}

		oTE.plc++;

		// Failed Search Term
		if (typeof oTrack.searchTermSOLR !== 'undefined' && oTrack.searchTermSOLR.length > 0) {
			oTrack.searchTermSOLR = oTrack.searchTermSOLR.toLowerCase(); //needed?  this is done above
			if (oTrack.searchResultsNum === "0") {
				oTrack.failedSearchTermSOLR = oTrack.searchTermSOLR;
				oTrack.searchTermSOLR = "NA";
			} else {
				oTrack.failedSearchTermSOLR = "NA";
			}
			//prefix 'SOLR: ' to searchResultsNum
			oTrack.searchResultsNum = ((oTrack.searchResultsNum.indexOf('SOLR: ') > -1) ? '' : 'SOLR: ') + oTrack.searchResultsNum;
		} else if (typeof oTrack.searchTerm !== "undefined") {
			oTrack.searchTerm = oTrack.searchTerm.toLowerCase(); //needed?  this is done above
			if (oTrack.searchResultsNum === "0") {
				oTrack.failedSearchTerm = oTrack.searchTerm;
				oTrack.searchTerm = "NA";
			} else {
				oTrack.failedSearchTerm = "NA";
			}
		}

		oTE.plc++;

		// ref-loc
		if (typeof oTE.b["qp.ref"] !== "undefined" && typeof oTE.b["qp.loc"] !== "undefined") {
			// always write ref and loc to their own cookie
			oTE._SaveCookie("refloc", oTE.b["qp.ref"] + "," + oTE.b["qp.loc"]);
			if (typeof oTE.v.campaign === "undefined") {
				oTE.v.campaign = oTE.b["qp.ref"] + "," + oTE.b["qp.loc"];
			}
		}

		oTE.plc++;

		// google keywords beta
		if (typeof oTE.v.campaign === "undefined" && typeof oTE.b["qp.adgroupid"] !== "undefined" &&
				typeof oTE.b["qp.query"] !== "undefined") {
			oTE.v.campaign = "GKWB_" + oTE.b["qp.adgroupid"] + "," + oTE.b["qp.query"];
		}

		oTE.plc++;

		// Campaign Pathing & Latency
		c = new Date();
		d = c.getTime();

		// note: This code is in place to collect and report on specific REMIX api
		// developer keys in use
		if (typeof oTE.v.campaign !== "undefined" && oTE.v.campaign !== "") {
			if (oTE.v.campaign.indexOf("rmx") > -1) {
				oTE.v.campaign += (oTE.v.campaign.indexOf("-") > -1) ? "," +
					oTE._QP("ky") : "-" + h.lastCatId + "," + oTE._QP("ky");
			}
			oTE._SaveCookie("campaign", oTE.v.campaign);
			oTE._SaveCookie("campaign_date", d);
		}

		// Campaign latency & attribution
		if (typeof oTrack.catId !== "undefined" && oTrack.catId === "pcat17014") {
			if (typeof h.campaign !== "undefined" && h.campaign !== "") {
				f = oTrack.d_campaignPath = unescape(h.campaign);
				if (f.indexOf("[") > -1) {
					f = eval(f); // TODO security: Validate before eval'ing
					if (typeof f === "object" && f.length > 0) {
						oTrack.d_campaignPath = f.pop();
					}
				}
				f = h.campaign_date;
				if (f > 0) {
					oTrack.d_campaignLatency = Math.ceil((d - f) / 86400000);
				}
				oTE._SaveCookie("campaign", "", "d");
				oTE._SaveCookie("campaign_date", "", "d");
			}
		}
		// end REMIX code

		if (typeof oTE.v.campaign !== "undefined" && oTE.v.campaign !== "") {
			oTE._SaveCookie("campaign_date", d);
		}

		// handling sysid param dumped into dcmp on geek squad pages
		if (typeof oTrack.templateName !== "undefined") {
			if (oTrack.templateName == "GSCC") {
				if (typeof oTrack.dcmp !== "undefined") {
					oTE.v.campaign = oTrack.dcmp;
				}
			}
		}

		if (typeof oTrack.catId !== "undefined" && oTrack.catId === "pcat17014") {
			if (typeof h.campaign_date !== "undefined" && h.campaign_date !== "") {
				f = h.campaign_date;
				if (f > 0) {
					oTrack.d_campaignLatency = Math.ceil((d - f) / 86400000);
				}
				oTE._SaveCookie("campaign_date", "", "d");
			}
		}

		return true;
	}
};

/*
 * BestBuy Custom Error Detection Plugin 101: no catID 102: no template name
 * 103: no campaign 104: no roderID and no payaTypeList 301: named error jserror =
 * lmError
 */
trackEvent.pl[10] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			arrErrorIds = [],
			arrErrors = [],
			oCookie = oTE._RC(),
			sCatId;

		if (oTE.ple.length > 0) {
			arrErrors.push(oTE.ple);
		}

		if (typeof oTrack.catId === "undefined" || oTrack.catId === "") {
			arrErrorIds.push(101);
		}
		if (typeof oTrack.templateName === "undefined" || oTrack.templateName === "") {
			arrErrorIds.push(102);
		}
		if (typeof oTrack.campaign !== "undefined" && oTrack.campaign === "++") {
			arrErrorIds.push(103);
		}
		if (typeof oTrack.orderId !== "undefined" && oTrack.orderId !== "" &&
				(typeof oTrack.payTypeList === "undefined" || oTrack.payTypeList === "")) {
			arrErrorIds.push("104:" + ((typeof oTrack.sid !== "undefined") ? oTrack.sid : "")); // oTrack.tltsid
		}
		if (arrErrorIds.length > 0) {
			arrErrors.push(arrErrorIds.join(":") + ":" + oTrack.page.replace(",", " "));
		}
		if (typeof oTrack.error !== "undefined" && oTrack.error.length > 0) {
			arrErrors.push("301:" + oTrack.error);
		}
		if (typeof oCookie.error !== "undefined" && oCookie.error.length > 0) {
			arrErrors.push("302:" + oCookie.lastCatId + ":" + oCookie.error);
			oTE._SaveCookie("error", "", "d");
		}

		oTrack.imperror = arrErrors.join(",");

		// Error: 430-S If on Review and Submit
		// Billing and delivery addresses don't match

		// Error: 0440-S - My Account
		// Cancel selected items

		// Error: 0116-S - Shipping and Pickup
		// PSPTermsConditionsStateMismatch

		// JS Error tracking
		if (typeof Lm.error !== "undefined") {
			oTE._S("jserror", Lm.error);
		}

		sCatId = oTrack.catId;
		if (typeof sCatId !== "undefined" &&
				sCatId !== "pcmcat152200050034" &&
				sCatId !== "pcmcat152200050035" &&
				sCatId !== "pcmcat124600050000" &&
				sCatId !== "pcmcat107400050024") {
			oTE._SaveCookie("lastCatId", sCatId);
		}
		return true;
	}
};

/*
 * ABTest testBucket cookie tracking copies/clears testBucket cookie in trackObject for use in page view
 */
trackEvent.pl[11] = {
	//oTrackEvent : trackEvent,
	_I : function() {
		//nothing initialized
	},
	_E : function(sEvt, oTrack) {
		'use strict';
		var oTE = trackEvent,
			sTestBucketCookieName = 'testBucket',
			sTestBucketCookieValue = oTE._GetCookieValue(sTestBucketCookieName);

		if (sTestBucketCookieValue !== null) {
			//set to the mapped property - eVar20
			oTE._S("cp.testBucket", sTestBucketCookieValue);
			//save to the track cookie
			oTE._SaveCookie(sTestBucketCookieName, sTestBucketCookieValue);
		} else {
			oTE._SaveCookie(sTestBucketCookieName, '', 'd');
		}

		return true;
	}
};

/*
 * searchTerm Relevancy - set default, 'Non-Search' data required for relevancy tracking in SOLR search relevancy
 */
trackEvent.pl[12] = {

	_I : function() {
		//nothing here
	},
	_E : function(sEvt, oTrack) {
		'use strict'
		//TSA: 20130715 : search relevancy
			var oTE = trackEvent,
				oCookie = oTE._RC(),
			sSearchTermRelevancy = unescape(oCookie.searchTermRelevancy),
			sSearchRank = unescape(oCookie.searchRank),
			sSearchRankSKU = oCookie.searchRankSKU;

		if ( (typeof sSearchRank === 'undefined') ||
				(typeof sSearchTermRelevancy !== 'undefined' && sSearchTermRelevancy.length > 0) ||
				(typeof sSearchRank !== 'undefined' && sSearchRank === '') ) {

			//there was no searchRank cookie value - default or new user scenario
			//or searchTermRelevancy was populated - default scenario
			//or searchRank was empty (mid-process) - reset to
			//save the default searchRank cookie setting
			sSearchRank = 'Non-Search';
			sSearchRankSKU = 'none';
			oTE._SaveCookie('searchRank', sSearchRank);
			oTE._SaveCookie('searchRankSKU', sSearchRankSKU, 'd');
			}

		if (typeof sSearchTermRelevancy === 'undefined' || sSearchTermRelevancy === 'undefined') {
			sSearchTermRelevancy = 'Non-Search';
			oTE._SaveCookie('searchTermRelevancy', sSearchTermRelevancy);
		}

		oTrack.searchRank = sSearchRank;
		oTrack.searchRankSKU = sSearchRankSKU;
		oTrack.searchTermRelevancy = sSearchTermRelevancy;
		oTE._S("searchRank", sSearchRank);
		oTE._S("searchTermRelevancy", sSearchTermRelevancy);

		return true;
	}
};

/*
 * track links pass specific events
 */
trackEvent.linkHelper = function(linkTarget) {
	'use strict';
	/* Track mp3 links */
	if (linkTarget.href.match(/muzetunes.com\/playback.mp3/)) {
		trackEvent.event('event.link', {
			'music' : 'launched'
		});
	}
};


//this function saves the lid value on mouse down, performs EP tracking, stores SOLR relevancy rank
//TSA : 20120720 : refactored method for my own sanity's sake
trackEvent.LC = function(oEvt) {
	'use strict';
	var oElem = null,
		sTagName = null,
		sHref = null,
		sOnClick = null,
		sId = null,
		sDataLid = null,
		//sTrackAction = null,
		sName = null,
		sClassName = null,
		sMouseDown = null,
		sActionLabel = null,
		nIdx = 0,
		sSKUs = '';

	if (!oEvt) {
		oEvt = window.event;
	}
	if (oEvt.target) {
		oElem = oEvt.target;
	} else if (oEvt.srcElement) {
		oElem = oEvt.srcElement;
	}
	if (oElem.nodeType === 3) {
		oElem = oElem.parentNode;
	}
	if (typeof oElem === "undefined" || typeof oElem.tagName === "undefined" ||
			oElem.tagName.toLowerCase() === "html" || oElem.tagName.toLowerCase() === "body") {
		return;
	}
	sTagName = oElem.tagName.toLowerCase();
	/*
	//TSA : 20111012 : added this to the condition above
	if (sTagName == "body") {
	return;
	}
	*/
	//TSA : 201206112030 : clickStream tracking added
	var bCS_CartAdd = false;
	if (typeof Lm.clickStream !== 'undefined' && Lm.clickStream !== null) {
		sOnClick = oElem.getAttribute('onclick');
		sName = oElem.getAttribute('name');
		sId = oElem.getAttribute('id');
		sClassName = oElem.getAttribute('class');
		sHref = oElem.getAttribute('href');
		sMouseDown = oElem.getAttribute('onmousedown');
		sActionLabel = jQuery(oElem).attr('src') || jQuery(oElem).text() || null;

		//check for addtocart
		if (((typeof sOnClick !== 'undefined' && sOnClick !== null && sOnClick.indexOf('addToCart') > -1) ||
				(typeof sName !== 'undefined' && sName !== null && sName.indexOf('addToCart') > -1) ||
				(typeof sId !== 'undefined' && sId !== null && sId.indexOf('addToCart') > -1) ||
				(typeof sClassName !== 'undefined' && sClassName !== null && sClassName.indexOf('addToCart') > -1)) &&
				(typeof jQuery(oElem).parents('form#frmHaccsLightBox')[0] === 'undefined')) {
			//get the SKU from the parent Div
			var sSKU = jQuery(oElem).parentsUntil('div.hproduct').parent().attr('id') || null;
			//clickStream cart Add clicks - not from lightbox
			Lm.clickStream.cartAdd(null, sActionLabel, sSKU);
			bCS_CartAdd = true;

		} else if ((typeof sClassName !== 'undefined' && sClassName !== null && sClassName.indexOf('buttons-yellow') > -1) &&
				(typeof sHref !== 'undefined' && sHref !== null && sHref.indexOf('cartAdd') > -1)) {
			//clickStream accessory cart Add clicks
			sSKUs = trackEvent.findPDPAccessoryTabSKUs(true);
			//if accessories are not checked, don't track
			if (sSKUs.replace(',', '').length > 0) {
				Lm.clickStream.cartAddSuggestedAccessory('pdpTabSuggestedAccessory', sActionLabel, sSKUs);
				bCS_CartAdd = true;
			}
		}
	}

	//tracking search relevancy
	if (track.catId === 'pcat17071' && track.catName === 'Search Results' &&
			typeof track.searchTermSOLR !== 'undefined' && track.searchTermSOLR.length > 0) {

		var resultRow = jQuery(oElem).parentsUntil('div#listView div.hproduct').parent(),
			nSearchResultIndex,
			sSkuId,
			searchRank,
			searchRankSKU;

		if (resultRow.length > 0) {
		//get the 1-based index of the result list item clicked on
			nSearchResultIndex = (resultRow.index('div#listView div.hproduct') + 1);

		if (nSearchResultIndex > 0) {
			//set the rank - [page #]:[rank within page]:[Facet T/False]:[Sort]:[View]
			searchRank = track.searchPageNum + ': ' + nSearchResultIndex + ': ' + track.searchFacet + ': ' +
				(track.searchSort || jQuery('div.sorting:first select option:selected').text() || 'Best Match') + ': ' + track.searchView;

				//set the skuId
				searchRankSKU = resultRow.attr('id');

			//save the searchRank to cookie
			trackEvent._SaveCookie('searchRank', searchRank);
				//save the sku associated with this rank
				trackEvent._SaveCookie('searchRankSKU', searchRankSKU);
				trackEvent._SaveCookie('searchTermRelevancy', '');
			}
		}
	}

	//find the anchor tag if this isn't it...
	if (sTagName !== "a") {
		for (nIdx = 0; nIdx < 4; nIdx += 1) {
			oElem = oElem.parentNode;
			sTagName = oElem.tagName.toLowerCase();
			if (sTagName === "a") {
				break;
			} else if (sTagName === "body") {
				return;
			}
		}
	}
	if (typeof Lm.clickStream !== 'undefined' && Lm.clickStream !== null) {
		if (sTagName === "a" && bCS_CartAdd === false) {
			sOnClick = oElem.getAttribute('onclick');
			sName = oElem.getAttribute('name');
			sId = oElem.getAttribute('id');
			sClassName = oElem.getAttribute('class');
			sHref = oElem.getAttribute('href');
			sMouseDown = oElem.getAttribute('onmousedown');
			sActionLabel = jQuery(oElem).text().replace(/\n/g, '') || null;

			if ((typeof sId !== 'undefined' && sId !== null && sId.indexOf('tab-accessories') > -1) ||
					(typeof sHref !== 'undefined' && sHref !== null && sHref.indexOf('tabbed-accessories') > -1)) {
				//clickStream anchor clicks - specific to accessories tab view on PDP
				//TSA : 20120716 : added SKU(s) pass-in
				Lm.clickStream.viewSuggestedAccessory('pdpTabSuggestedAccessory', trackEvent.findPDPAccessoryTabSKUs(false));

			} else if ((typeof sHref !== 'undefined' && sHref !== null && sHref.indexOf('fnOpenAccessoryPopup') > -1) ||
					(typeof sMouseDown !== 'undefined' && sMouseDown !== null && sMouseDown.indexOf('trackLink') > -1 && sMouseDown.indexOf(track.skuId) > -1)) {
				//clickStream anchor clicks - specific to popup of accessory from accessories tab view on PDP
				//TSA : 20120716 : added SKU pass-in
				//TSA : 20130314 : updated this as unavailable accessories don't have a SKU in the price block
				jQuery(oElem).parentsUntil('div.suggestedproduct').parent().find('div.prodlink').contents().each(function() {
					if (this.nodeType === 3 && jQuery(this).text().trim().length > 0 && parseInt(jQuery(this).text(), 10)) {
						sSKUs = jQuery(this).text();
					}
				});
				//jQuery(oElem).parentsUntil('div.suggestedproduct').parent().find('div.prodpricing>div.addtocart>input:checkbox').attr('value').split(',')[1];
				Lm.clickStream.viewSuggestedAccessory('pdpTabSuggestedAccessory', sSKUs);

			} else {
				//clickStream anchor clicks - basic
				Lm.clickStream.uiClick(sActionLabel);
			}
		}
	}
	bCS_CartAdd = false;

	//regular tracking
	if (sTagName === "a") {
		var nLidStart = -1,
			sLidValue = "",
			bLidFound = false;
		sDataLid = oElem.getAttribute('data-lid');
		//sTrackAction = oElem.getAttribute('track-action');
		sName = oElem.getAttribute('name');
		sHref = oElem.getAttribute('href');

		//TODO: develop custom attribute-handling for trackAction
		// JSON example: View tracking: '{"type":"view","page":"My_Page_Name","linkName":"My_Link_Name"}'
		// JSON example: Link tracking: '{"type":"link","linkName":"My_Link_Name"}'
		//check the data-lid
		if (typeof sDataLid !== 'undefined' && sDataLid !== null && sDataLid.length > 0) {
			trackEvent._SaveCookie('lid', sDataLid);
			bLidFound = true;
		}

		//check the name
		if (!bLidFound && (typeof sHref !== 'undefined' && sHref !== null) && (typeof sName !== 'undefined' && sName !== null && sName.indexOf('lid') > -1)) {
			nLidStart = sName.indexOf('lid='); //sName.indexOf(arrAmpersandLidDef[nIdx]);
			if (nLidStart > -1) {
				sLidValue = sName.substring(nLidStart + 1 + 3); //arrAmpersandLidDef[nIdx].length, nLidLength);
				trackEvent._SaveCookie('lid', sLidValue);
				bLidFound = true;
			}
		}
		trackEvent.linkHelper(oElem);
	}
};

/*
 * trackEvent init function - iterates through the plugins and calls the _I init
 * function on each -
 */

trackEvent.INIT = function(a, b) {
	'use strict';
	try {
		for ( var i in trackEvent.pl) {
			if (typeof trackEvent.pl[i] !== "function") {
				//try {
					//initialize plugins.
					trackEvent.pl[i]._I();
				//} catch (ex) {
					//console.info(ex);
				//}
			}
		}
		// iterate through the l array on Lm and for each
		// set the name of the lm plugin onto b
		// if the load bit is set on lm config for the given plugin
		// then set the plugin script object onto the trackEvent object
		// will only get plugins that have already been loaded through liveManager
		for (a = 0; a < Lm.l.length; a += 1) {
			b = Lm.l[a].a;
			if (Lm.config.load[b]){
				this[b] = Lm[b];
			}
		}
		// execute any queued events that took place while the TrackEvent
		// code was being loaded
		if (Lm.q && Lm.q.trackEvent) {
			a = Lm.q.trackEvent;
			trackEvent.event(a.a, a.b);
		}
		if (!this.isInit) {
			this.isInit = true;
			if (typeof EventManager !== 'undefined') {
				EventManager.trigger('dio.trackEvent.ready');
			} else {
				jQuery(document).trigger('dio.trackEvent.ready');
			}
		}
	} catch (ex) {
		//console.info('trackEvent.INIT failed: ' + ex);
	}
};

function BVAnalytics(BVjson) {
	'use strict';
	if (typeof BVjson !== 'undefined') {
		var reviewSubmitted = false;
		if (BVjson.eType === "Write" && BVjson.pageType === "Confirm") {
			reviewSubmitted = true;
		}
		if (reviewSubmitted) {
			trackEvent._S("conversion", "event6");
			trackEvent.event("event.view", trackEvent.b);
		}
	}
}

EventManager.on("experiencePlatform:productClick",function(data){
		EPdata = trackEvent.api.EPsplit(data.epId);
		EPstring = "rc-" + EPdata.rc + ",av-" + EPdata.av + ",rk-" + EPdata.rk;
		trackEvent.event("event.link", {
				lid: EPstring + ": " + track.page,
				conversion: "event55",
				EPclick: EPstring + ": " + track.page,
				d_product: ";" + data.skuId + ";;;;"
		});
});

/* END OF LINE: 17 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */

/**
 * @description Combined files of: ace.js, atlas.js, ci.js, cnet.js files
 */

/**
 * This method is responsible for importing the contents of the tracking file, ace.js.
 * @method
 * @ignore
 */
function includeAce()	{
	/* START OF LINE: 31 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* Src File:"_analytics/javascript/trackingFiles/ace.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

//ACE Tag 20120928.1145
//TSA : 201207201350 : removed check for skulist and cookie iCart value
//TSA : 201207231415 : deployed to production
//TSA : 201209281145 : revamped code, added prices and quantities to sl param
try {
	Lm.ace = {
		version : '201209281145',
		iSrc : "//pages.emailinfo2.bestbuy.com/page.aspx?QS=1550dccf35ce5f744f6b5b7e27472e8b33db5c80fc66e268&ea=<EMAILADDRESS><SKULIST><CID>&s=<S>",
		rts : 0,
		INIT : function (oTrack) {
			//abandon cart
			if (typeof oTrack.catId !== "undefined") {
				if (oTrack.catId === "pcat17005") {
					//var oCookie = this._RC(),
					//	sCart = (typeof oCookie.inCart != "undefined") ? oCookie.inCart : '';
					//if there is an email address and either 
					//there is a skulist that has more or less items than the value of iCart
					//or there is no skulist and icart is not 0.
					//TSA : 20120719 : reporting when cart is empty
					//					: add'l note: old iCart value in cookie has not existed recently...not sure if this worked
					//if (((typeof oTrack.skuList != "undefined" && c != oTrack.skuList.split(',').length) || 
					//		(typeof oTrack.skuList == "undefined" && sCart.length > 0))) {
					this.iSrc = this.iSrc.replace("<EMAILADDRESS>", oTrack.ea);
					var sSkuList = "";
					if (typeof oTrack.skuList !== "undefined" && oTrack.skuList.replace(",","").length > 0) {
						var arrSKU = oTrack.skuList.split(","),
							arrPrice = oTrack.priceList.split(","),
							arrQuantity = oTrack.qtyList.split(","),
							nIdx;
						for (nIdx = 0; nIdx < arrSKU.length; nIdx += 1) {
							sSkuList += arrSKU[nIdx] + "|" + arrPrice[nIdx] + "|" + arrQuantity[nIdx];
							if ((nIdx + 1) < arrSKU.length) {
								sSkuList += ",";
							}
						}
					}
					this.iSrc = this.iSrc.replace("<SKULIST>", "&sl=" + sSkuList);
					this.iSrc = this.iSrc.replace("<S>","ace");
					this.rts = 1;
					//}
				//abandon browser
				} else if (typeof oTrack.templateName !== "undefined" && (oTrack.templateName === "ABLH" || oTrack.templateName === "ABCH")) {
					// ABN Listing (with taxonomy) || ABN Department/Category (with taxonomy)
					this.iSrc = this.iSrc.replace("<EMAILADDRESS>", oTrack.ea);
					this.iSrc = this.iSrc.replace("<CID>", "&cid=" + oTrack.catId);
					this.iSrc = this.iSrc.replace("<S>", "abe");
					this.rts = 1;
				}
				this.iSrc = this.iSrc.replace("<CID>", "");
				this.iSrc = this.iSrc.replace("<SKULIST>", "");
			}
		},
		SEND : function () {
			if (this.rts === 1) {
				var oImg = new Image();
				oImg.src = this.iSrc;
			}
		}
	};
	//EAM: commented out because it would cause ace to load prematurely
	//Lm.LOAD("ace");
} catch (e) {
	//EAM: wrote this function so that I didn't have to comment out all the console.log calls
	analyticsError(e);
};
/* END OF LINE: 31 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
}

//TSA : 201310042225 : cj (commission junction) tag removed - no longer needed

/**
 * This method is responsible for importing the contents of the tracking file, clickStream.js.
 * @method
 * @ignore
 */
function includeClickStream()	{
	/* START OF LINE: 44 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* Src File:"_analytics/javascript/trackingFiles/clickStream.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

try {
    Lm.clickStream = {
        version : '201304111550',
        sImageURL : '//<DEV>context.bestbuy.com/_.gif?src=<SRC>&path=<URL>&pageTitle=<PAGETITLE>&action=<EVENT><ITEMTYPE><ACTIONLABEL>&pageName=<PAGENAME>&clientTime=<CLIENTTIME><CAT>&<RAND><ITEMID><ORDERID>',
        // TSA : 20120809 : no longer needed : <ATGID>
        // TSA : 20120809 : changed : eventAction
        // TSA : 20120810 : new itemType
        // TSA : 20120814 : no longer needed : &cookies=<COOKIES>
        // TSA : 20120820 : renamed title to pageTitle
        // TSA : 201209111145 : changed dev. prefix for pixel to test.
        // TSA : 20130404 : added orderid
        page_url : '',
        page_title : '',
        page_name : '',
        page_skus : '',
        page_catinfo : null,
        page_templatename : null,
        page_atgid : null,
        page_orderid : null,
        dev : '',
        site_src : 'Dotcom',
        _RAND : function () {
            'use strict';
            return Math.floor(Math.random() * 100000000);
        },
        _RCV : function (sName) {
            'use strict';
            var oCookie = document.cookie,
                nStart = oCookie.indexOf(sName + '='),
                nLength = 0,
                sValue = null;

            if (nStart > -1) {
                nLength = oCookie.indexOf(';', nStart + 1);
                nLength = (nLength > 0) ? nLength : oCookie.length;
                sValue = (nLength > nStart + 1) ? oCookie.substring(nStart + 1 + sName.length, nLength) : '';
            }
            return sValue;
        },
        _SC : function (sName, sValue) {
            'use strict';
            document.cookie = sName + '=' + window.escape(sValue) + ';path=/;domain=.' + document.domain;
            return;
        },
        //TSA : 20120808 : renamed from pageLoad
        pageView : function (sItemType, sSKUs) {
            'use strict';
            //console.info('Lm.clickStream.pageLoad');
            this.SEND('pageView', sItemType, null, sSKUs);
        },
        /*
        //TSA : 20120808 : removed - no longer needed
        itemView : function (sSKU) {
            //console.info('Lm.clickStream.pageLoad');
            //TSA : 20120808 : renamed pageLoad to pageView
            this.SEND('pageView,itemView', null, null, sSKU);
        },
        pageLeave : function () {
            //console.info('Lm.clickStream.pageLeave');
            Lm.clickStream.SEND('pageLeave');
        },

        searchSubmit : function () {
            //console.info('Lm.clickStream.searchSubmit');
            if (this.getElementsByTagName('input')['st'].value !== '') {
                Lm.clickStream.SEND('searchSubmit', null, null, null);
            }
        },
        */
        uiClick : function (sActionLabel) {
            'use strict';
            //console.info('Lm.clickStream.uiClick');
            this.SEND('uiClick', null, sActionLabel);
        },
        cartAdd : function (sItemType, sActionLabel, sSkus) {
            'use strict';
            //console.info('Lm.clickStream.cartAdd');
            this.SEND('uiClick,cartAdd', sItemType, sActionLabel, sSkus);
        },
        cartAddSuggestedAccessory : function (sItemType, sActionLabel, sSKUs) {
            'use strict';
            //console.info('Lm.clickStream.cartAddSuggestedAccessory');
            this.SEND('uiClick,cartAdd', sItemType, sActionLabel, sSKUs);
        },
        viewSuggestedAccessory : function (sItemType, sSKUs) {
            'use strict';
            //console.info('Lm.clickStream.viewSuggestedAccessory');
            this.SEND('pageView', sItemType, null, sSKUs);
        },
        INIT : function (oTrack) {
            'use strict';
            //console.info('Lm.clickStream.INIT');
            //basics
            this.page_url = encodeURIComponent(document.location);
            this.page_title = escape(document.title);
            var sPageName = '';
            sPageName += ((typeof track.uberCatName !== 'undefined') ? track.uberCatName + ': ' : '');
            sPageName += ((typeof track.parentCatName !== 'undefined') ? track.parentCatName + ': ' : '');
            sPageName += ((typeof track.catName !== 'undefined') ? track.catName : '');
            sPageName += ((typeof track.catId !== 'undefined' && track.catId === 'pdp') ?  ': pdp' : '');
            this.page_name = escape(sPageName);
            //TSA : 201211182010 : added m and m-ssl for mDot pages scraping dotCom for content
            this.dev = ((Lm.h.indexOf("www.best") === 0
                    || Lm.h.indexOf("www-ssl.best") === 0
                    || Lm.h.indexOf("kiosk.") === 0
                    || Lm.h.indexOf("kiosk-ssl.") === 0
                    || Lm.h.indexOf("espanol.") === 0
                    || Lm.h.indexOf("espanol-ssl.") === 0
                    || Lm.h.indexOf("stores.") === 0
                    || Lm.h.indexOf("m.best") === 0
                    || Lm.h.indexOf("m-ssl.best") === 0) ? '' : 'pl.'); //TSA 20130226 - changed from 'test.' per EP request

            //set SKUs if available
            this.page_skus = oTrack.skuList || oTrack.skuId || window.skuId || '';
            //set ATG Id, if available
            this.atgid = oTrack.atgID || oTrack.profileId || null;

                /*
            //TSA : 20120808 : removed - changed this implementation
            if (oTrack.catId === 'pdp') {
                //fire pdp view pixel
                this.pageView();

            } else {
                 */

            //fire load pixel
            //set cat info when not cart, checkout, shipping, account, 
            //    create account, login, etc.
            if (oTrack.catId.indexOf('pcat17') === -1) {
                this.page_catinfo = oTrack.catId + '[' + oTrack.catName + ']';
            }

            //TSA : 20130404 : added purchase order id
            if (oTrack.catId === 'pcat17014') {
                var arrOrderID = [];
                jQuery('div.seller-container span.order-id a').each(function () {
                    arrOrderID.push(jQuery(this).text());
                });
                this.page_orderid = ((arrOrderID.length > 0) ? arrOrderID.join(',') : oTrack.orderId);
            }

            this.page_templatename = oTrack.templateName || null;

            //TSA : 20120808 : renamed from pageLoad
            this.pageView(undefined, this.page_skus);
                /*}*/

                //set up onsubmit event for search
                //Lm.EV(document.forms['frmSearch'], "submit", Lm.clickStream.searchSubmit, null);

                //set up beforeunload event
                //TSA : 20120808 : no longer needed
                //Lm.EV(window, 'beforeunload', Lm.clickStream.pageLeave, null);
        },
        // TSA : 20120810 : new sItemType param
        // TSA : 20120810 : new sActionLabel param
        SEND : function (sEvent, sItemType, sActionLabel, sSKUs) {
            'use strict';
            //console.info('Lm.clickStream.SEND');
            var sHref,
                oImg = new Image();

            //create the request
            sHref = Lm.clickStream.sImageURL.replace('<DEV>', Lm.clickStream.dev);
            sHref = sHref.replace('<SRC>', Lm.clickStream.site_src);
            sHref = sHref.replace('<URL>', Lm.clickStream.page_url);
            sHref = sHref.replace('<PAGETITLE>', Lm.clickStream.page_title);
            sHref = sHref.replace('<PAGENAME>', Lm.clickStream.page_name);
            sHref = sHref.replace('<EVENT>', sEvent);

            // TSA : 20120810 : new actionLabel
            if (typeof sActionLabel !== 'undefined' && sActionLabel !== null) {
                sHref = sHref.replace('<ACTIONLABEL>', '&actionLabel=' + escape(sActionLabel));
            } else {
                sHref = sHref.replace('<ACTIONLABEL>', '');
            }
            sHref = sHref.replace('<CLIENTTIME>', escape(new Date().toString()));
            if (typeof Lm.clickStream.page_catinfo !== 'undefined' && Lm.clickStream.page_catinfo !== null) {
                sHref = sHref.replace('<CAT>', '&category=' + escape(Lm.clickStream.page_catinfo));
            } else {
                sHref = sHref.replace('<CAT>', '');
            }
            if ((typeof sSKUs !== 'undefined' && sSKUs !== null && sSKUs.length > 0)
                    || (Lm.clickStream.page_skus.length > 0)) {

                //Skus on page or passed in
                if (typeof sSKUs !== 'undefined' && sSKUs !== null && sSKUs.length > 0) {
                    sHref = sHref.replace('<ITEMID>', '&itemId=' + escape(sSKUs));
                } else {
                    sHref = sHref.replace('<ITEMID>', '&itemId=' + escape(Lm.clickStream.page_skus));
                }
                // TSA : 20120814 : since there is itemId(s), add the itemType, if available
                // TSA : 20120810 : new itemType
                if (typeof sItemType !== 'undefined' && sItemType !== null && sItemType.length > 0) {
                    sHref = sHref.replace('<ITEMTYPE>', '&itemType=' + sItemType);
                } else if (track.catId.indexOf('pdp') > -1) {
                    sHref = sHref.replace('<ITEMTYPE>', '&itemType=' + 'product');
                } else {
                    sHref = sHref.replace('<ITEMTYPE>', '&itemType=' + Lm.clickStream.page_templatename);
                }
            } else {
                //no Skus
                sHref = sHref.replace('<ITEMID>', '');
                sHref = sHref.replace('<ITEMTYPE>', '');
            }

            //TSA : 20130404 : added purchase order id
            sHref = sHref.replace('<ORDERID>', ((Lm.clickStream.page_orderid !== null) ? '&orderid=' + Lm.clickStream.page_orderid : ''));

            sHref = sHref.replace('<RAND>', Lm.clickStream._RAND()); //force new pixel

            // TSA : 20120814 : no longer needed
            //sHref = sHref.replace('<COOKIES>', escape(document.cookie));

            oImg.src = ((document.location.protocol === 'https:') ? 'https:' : 'http:') + sHref;
        }
    };
    //EAM: commented to prevent clickStream from loading prematurely
    //Lm.LOAD('clickStream');
} catch (ex) {
    //TODO: remove before production
//  if (typeof console !== 'undefined') {
//  console.info('Lm.clickStream:catch:' + ex);
//  }
}
/* END OF LINE: 44 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
}

/**
 * This method is responsible for importing the contents of the tracking file, cnet.js.
 * @method
 * @ignore
 */
function includeCnet()	{
	/* START OF LINE: 55 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
/* Src File:"_analytics/javascript/trackingFiles/cnet.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

//TSA - 201108112015 - updated pixel url prefixes from 'xs.' to 't.'
try {
 Lm.cnet = {
	accessoriesIcsCsids : null,
	accessoriesClicked : false,

	cookieDomain:".bestbuy.com",
	
	getLoc : function(){
		return window.document.location;
	},
	
	pl: function (val, ch, num) {
		var re = new RegExp(".{" + num + "}$");
		var pad = "";
		if (!ch) ch = " ";
		if(val.toString().length < num) {        
			do  {
				pad += ch;
			}while(pad.length+val.toString().length < num);    
		}
		return re.exec(pad + val);
	},
	
	RCV : function(a, b, c, d) {
		b = document.cookie;
		c = b.indexOf(a + "=");
		d = "";
		if (c > -1) {
			d = b.indexOf(";", c + 1);
			d = (d > 0) ? d : b.length;
			d = (d > c) ? b.substring(c + a.length + 1, d) : "";
		}
		return d;
	},

	CC : function CC(a, b, c, d) {
		if (c) {
			d = new Date();
			d.setTime(d.getTime() + (c * 24 * 60 * 60 * 1000));
			document.cookie = a + '=' + b + '; expires=' + d.toGMTString()
					+ '; domain=' + this.cookieDomain + '; path=/';
		} else {
			document.cookie = a + '=' + b + '; domain=' + this.cookieDomain
					+ '; path=/';
		}
	},
	
	RQV : function(a,b,c) {
		var c = new RegExp('[\\?&]' + a + '=?([^&#]*)', 'i')
				.exec(this.getLoc());
		if (c === null) {
			return (typeof b == 'undefined') ? null : b;
		} else if (c.length < 2) {
			return '';
		} else {
			return c[1];
		}
	},
	
	GD : function(a){
		a = new Date();
		a = this.pl(a.getFullYear(), '0', 4) + this.pl(a.getMonth()+1, '0', 2) +  this.pl(a.getDate(), '0', 2) + this.pl(a.getHours(), '0', 2) + this.pl(a.getMinutes(), '0', 2) + this.pl(a.getSeconds(), '0', 2) + this.pl(a.getMilliseconds(), '0', 3);	
		return a;
	},
	
	GS : function(){
		return this.RCV('TLTSID');
	},
	
	popRelIcsCsids: function (a,b){
		try{
			if (a){
				b = '';
				for (var i=0; i<a.length; i++){
					if (i >0) b = b + ',';
					b = b + a[i]; 
				}
				Lm.cnet.SEND('t.ics0.com/ics/2/view.gif?sellerId=39&ts='+Lm.cnet.GD()+'&csid='+b+'&sid='+Lm.cnet.GS());
			}
		}catch(err){}
	},
		
	accessIcsCsidsAddToCart: function (a,b){
		if (a){
			b = '';
			for (var i=0; i<a.length; i++){
				if (i >0) b = b + ',';
				b = b + a[i]; 
			}
			Lm.cnet.CC('ci_IcsCsid', b);
		}
	},
		
	popAccessorIcsCsids: function (a,b,c){
		try{
			Lm.cnet.accessoriesIcsCsids = a;
			if (a && Lm.cnet.accessoriesClicked === true){
				b = '';
				for (c=0; c<a.length; c++){
					if (c>0) b = b + ',';
					b = b + a[c];
				}
				Lm.cnet.SEND('t.ics0.com/ics/2/view.gif?sellerId=39&ts='+Lm.cnet.GD()+'&csid='+b+'&sid='+Lm.cnet.GS());
			}
		}catch(err){}
	},
	
	//newSetTabParameter
	nstp: function (a){
		//CNET Cross Sell View Accessories Tab
		if (a === "3"){
			try{
				Lm.cnet.accessoriesClicked = true;
				Lm.cnet.popAccessorIcsCsids(Lm.cnet.accessoriesIcsCsids);
			}catch(err){}
		}
		window.ostp.apply(this, arguments);
	},
		
	//new fnAddItemToCartWithIcsAccessories
	nfia: function (){
		try{
			Lm.cnet.CC('ci_IcsCsid', document.frmCart.icsIds.value);	
		}catch(err){}
		window.ofia.apply(this, arguments);
	},
		
	INIT: function(a,b,c,d,e,f,s){
		if (typeof a!= 'undefined')
		{
			s = this.GS();			
    		f = this.GD();	

			//confirmation
			if(typeof a.catId != 'undefined' && a.catId == "pcat17014")
			{
				b = (typeof a.skuList != 'undefined') ? a.skuList.split(",")
						: (typeof a.skuId != 'undefined'?a.skuId.split(","):"");
				c = (typeof a.priceList != 'undefined') ? a.priceList.split(",")
						: [ "" ];
				d = (typeof a.qtyList != 'undefined') ? a.qtyList.split(",")
						: [ "" ];
				
				if ((c.length < b.length)||(d.length < b.length)) {
					for (i = 0; i < b.length; i++) {
						c.push("");
						d.push("");
					}
				}
				for (a=0;a<b.length;a++) {
					
					//CNET Order Tracking
					this.SEND("t.ics0.com/ics/2/line_item.gif?sellerId=39&ts="+f+"&productId="+b[a]+"&sid="+s+"&price="+c[a]+"&quantity="+d[a], 'https://');
				}
			}
			//cart
			else if(typeof a.catId != 'undefined' && a.catId =="pcat17005")
			{
				b=this.RCV('ci_IcsCsid');

				//CNET 
				if(b){
					this.SEND('t.ics0.com/ics/2/cart.gif?sellerId=39&ts='+f+'&csid='+b+'&sid='+s);
				}
			}
			//landing
			else
			{	
				b=this.RQV('IcsCsid','');
				c=this.RQV('skuId',null);
				(c==null&&typeof a.skuId!='undefined'&&a.skuId!='')?c=a.skuId:'';
				
				this.CC('ci_IcsCsid', b);
				
				//CNET Cross Sell Click
				if(b){
					this.SEND('t.ics0.com/ics/2/click.gif?sellerId=39&ts='+f+'&csid='+b+'&sid='+s);
				}	
				//CNET Page View
				if(typeof a.catId != 'undefined' && a.catId =='pdp'){
					b = window.parentCat;
					b = (typeof b!= 'undefined')?b:'pdp';
					this.SEND('t.ics0.com/ics/2/pview.gif?&sellerId=39&ts='+f+'&categoryId='+b+'&productId='+c+'&sid='+s);
				}
				//CNET Cross Sell View Accessories Tab
				if (typeof window.setTabParameter != 'undefined'){
					ostp = setTabParameter;
					setTabParameter = Lm.cnet.nstp;
				}
				//CNET Accessory CSIDs Added to Cart
				if (typeof window.fnAddItemToCartWithIcsAccessories != 'undefined'){
					ofia = fnAddItemToCartWithIcsAccessories;
					fnAddItemToCartWithIcsAccessories = Lm.cnet.nfia;
				}
			}
			
		}
	},
	
	SEND : function(a, b, c) {
		c = new Image();
		c.src = (typeof b=='undefined'?(this.getLoc().protocol.toLowerCase() == 'http:' ? 'http://': 'https://'):b)+ a;
	}
};
//EAM: commented out to prevent cnet from loading prematurely
//Lm.LOAD("cnet");
}catch(e){};
//EAM: removed global functions because the cloud doesn't need to support them
/* END OF LINE: 55 - INCLUDED FROM: "/Users/a6000428/pl-profileLifeEvents/src/_analytics/javascript/analytics.js" */
}

//support legacy calls from busOpsLow
function ci_cnet_populateRelatedIcsCsids(a){
	try{
		Lm.cnet.popRelIcsCsids(a);
	}catch(err){}
}
function ci_cnet_populateAccessoriesIcsCsids(a){
	try{
		Lm.cnet.popAccessorIcsCsids(a);
	}catch(err){}
}
function ci_cnet_accessoriesIcsCsidsAddToCart(a){
	try{
		Lm.cnet.accessIcsCsidsAddToCart(a);
	}catch(err){}
}

//TSA : 201310042245 : bluekai tag and code removed - implemented via BrightTag TMS
