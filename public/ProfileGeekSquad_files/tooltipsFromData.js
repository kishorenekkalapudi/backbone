/* Src File:"_tooltips/dust/tooltipsFromData.js.dust" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

(function(){dust.register("_tooltips/dust/tooltipsFromData",body_0);function body_0(chk,ctx){return chk.write("<div class=\"tooltip-wrapper\">").exists(ctx._get(false, ["header"]),ctx,{"block":body_1},null).write("<div class=\"content\"></div>").exists(ctx._get(false, ["footer"]),ctx,{"block":body_2},null).write("</div>");}function body_1(chk,ctx){return chk.write("<div class=\"header\">").reference(ctx._get(false, ["header"]),ctx,"h").write("</div>");}function body_2(chk,ctx){return chk.write("<div class=\"footer\">").reference(ctx._get(false, ["footer"]),ctx,"h").write("</div>");}return body_0;})();
;define("_tooltips/dust/tooltipsFromData",["bluebird"],function (Promise) {
	return {
		render: function(ctx, fn) {
			ctx = ctx||{};
			var dustjs=dust,render = dustjs.render, name = "_tooltips/dust/tooltipsFromData";
			if (typeof ctx === "function") {
				fn=ctx;
			}
			return fn ? render.call(dustjs, name, ctx, fn) : Promise.promisify(render,dustjs)(name, ctx);
		}
	};
});
