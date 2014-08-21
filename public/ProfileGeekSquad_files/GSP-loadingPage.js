/* Src File:"ProfileGeekSquad/dust/GSP-loadingPage.js.dust" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

(function(){dust.register("ProfileGeekSquad/dust/GSP-loadingPage",body_0);function body_0(chk,ctx){return chk.write("<div id=\"GeekSquad-content\">").partial("ProfileGeekSquad/dust/rewards-head-linked",ctx,null).partial("ProfileGeekSquad/dust/rewards-leftNav",ctx,null).write("<div id=\"GeekSquad-main-content\"><div class=\"waitContent\"><div></div><div>Loading...</div></div></div></div>");}return body_0;})();
;define("ProfileGeekSquad/dust/GSP-loadingPage",["bluebird","./rewards-head-linked","./rewards-leftNav"],function (Promise) {
	return {
		render: function(ctx, fn) {
			ctx = ctx||{};
			var dustjs=dust,render = dustjs.render, name = "ProfileGeekSquad/dust/GSP-loadingPage";
			if (typeof ctx === "function") {
				fn=ctx;
			}
			return fn ? render.call(dustjs, name, ctx, fn) : Promise.promisify(render,dustjs)(name, ctx);
		}
	};
});
