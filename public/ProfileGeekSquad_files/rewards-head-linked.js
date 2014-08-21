/* Src File:"ProfileGeekSquad/dust/rewards-head-linked.js.dust" @ Tue Jul 01 2014 14:18:37 GMT-0500 (CDT) */

(function(){dust.register("ProfileGeekSquad/dust/rewards-head-linked",body_0);function body_0(chk,ctx){return chk.section(ctx._get(false, ["customer"]),ctx,{"block":body_1},null);}function body_1(chk,ctx){return chk.write("<div id=\"rewards-head\"><div id=\"rewards-head-top\"></div><div id=\"rewards-head-left\"><div id=\"rewards-head-left-header\">").helper("select",ctx,{"block":body_2},{"key":body_6}).write("</div><div id=\"rewards-head-left-user\"> <div id=\"rewards-head-left-userName\"><h3>Hi, <span id=\"user_name\" class=\"h3-bold\">").reference(ctx._get(false, ["firstName"]),ctx,"h").write("</span>\t</h3></div><div id=\"rewards-head-left-userId\"><h3>Member ID: <span id=\"member_id\">").reference(ctx._get(false, ["loyaltyMemberId"]),ctx,"h").write("</span></h3></div></div></div><div id=\"rewards-head-right-img\"></div><div id=\"rewards-head-bottom-image\">\t</div></div>");}function body_2(chk,ctx){return chk.helper("eq",ctx,{"block":body_3},{"value":"CORE TIER"}).helper("eq",ctx,{"block":body_4},{"value":"Elite"}).helper("eq",ctx,{"block":body_5},{"value":"ELITE PLUS"});}function body_3(chk,ctx){return chk.write("<div id=\"rewards-head-left-headerLogo-core\"> </div><div id=\"rewards-head-left-headerStatus-core\">\t</div>");}function body_4(chk,ctx){return chk.write("<div id=\"rewards-head-left-headerLogo-elite\"> </div><div id=\"rewards-head-left-headerStatus-elite\">\t</div>");}function body_5(chk,ctx){return chk.write("<div id=\"rewards-head-left-headerLogo-elitePlus\"> </div><div id=\"rewards-head-left-headerStatus-elitePlus\">\t</div>");}function body_6(chk,ctx){return chk.reference(ctx._get(false, ["loyaltyMemberType"]),ctx,"h");}return body_0;})();
;define("ProfileGeekSquad/dust/rewards-head-linked",["bluebird"],function (Promise) {
	return {
		render: function(ctx, fn) {
			ctx = ctx||{};
			var dustjs=dust,render = dustjs.render, name = "ProfileGeekSquad/dust/rewards-head-linked";
			if (typeof ctx === "function") {
				fn=ctx;
			}
			return fn ? render.call(dustjs, name, ctx, fn) : Promise.promisify(render,dustjs)(name, ctx);
		}
	};
});
