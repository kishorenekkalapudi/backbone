/* Src File:"_tooltips/dust/tooltip.js.dust" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

(function(){dust.register("_tooltips/dust/tooltip",body_0);function body_0(chk,ctx){return chk.write("<div id=\"").reference(ctx._get(false, ["id"]),ctx,"h").write("\" class=\"base-tooltip\"><div class=\"tooltip-style\"><a href=\"#\" class=\"close-button\"><span class=\"text\">close</span><span class=\"button\"></span></a><div class=\"content-wrap\"></div><div id=\"arrow-wrap\"><div class=\"tt-mask-arrow\"></div><div class=\"tt-shadow-arrow\"></div></div></div></div>");}return body_0;})();
;define("_tooltips/dust/tooltip",["bluebird"],function (Promise) {
	return {
		render: function(ctx, fn) {
			ctx = ctx||{};
			var dustjs=dust,render = dustjs.render, name = "_tooltips/dust/tooltip";
			if (typeof ctx === "function") {
				fn=ctx;
			}
			return fn ? render.call(dustjs, name, ctx, fn) : Promise.promisify(render,dustjs)(name, ctx);
		}
	};
});
