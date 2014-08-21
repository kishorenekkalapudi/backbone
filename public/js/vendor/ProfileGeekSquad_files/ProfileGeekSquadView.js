/* Src File:"ProfileGeekSquad/javascript/views/ProfileGeekSquadView.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

/* global define, Backbone */
define(['breadcrumb', 'retina-helper', 'FrameBusterHelper', '_headerFooter/javascript/_headerFooter'], function (BreadcrumbView, RetinaHelper, FrameBusterHelper, globalNavigation) {
    var ProfileGeekSquadView = Backbone.View.extend({

        whitelist: [],

        initialize: function (options) {

            if (options && options.whitelist) {
                this.whitelist = options.whitelist;
            }

            this.frameBusterHelper = new FrameBusterHelper({
                whitelist: this.whitelist,
                redirect: true
            });

            this.retinaHelper = new RetinaHelper({
                $scope: this.$el,
                redrawOnWindowChange: true
            });

        },
        checkPlanAvailability: function (data) {
            data.techSupportAvail = 0;
            var gspAPlans = 0,
                gspEPlans = 0,
                sAPlans = 0,
                sEPlans = 0,
                gspAPlansT = 0,
                gspEPlansT = 0,
                sAPlansT = 0,
                sEPlansT = 0;

            $.each(data.plans, function (key, val) {
                if (key === 0) {

                }
                data.plans.length

                if (val.planType === "gsp" && (val.planStatus === "A" || val.planStatus === "H" || val.planStatus === "P")) {
                    data.techSupportAvail = 1;
                    gspAPlans = gspAPlans + 1;
                    val.gspAPlans = gspAPlans;


                }
                if (val.planType === "gsp" && (val.planStatus === "C" || val.planStatus === "E"))

                {
                    gspEPlans = gspEPlans + 1;
                    val.gspEPlans = gspEPlans;
                }
                if ((val.planType === "techSupport" || val.planType === "subscription") && (val.planStatus === "A" || val.planStatus === "H" || val.planStatus === "P")) {
                    data.gspAvail = 1;
                    sAPlans = sAPlans + 1;
                    val.sAPlans = sAPlans;
                }
                if ((val.planType === "techSupport" || val.planType === "subscription") && (val.planStatus === "C" || val.planStatus === "E")) {
                    sEPlans = sEPlans + 1;
                    val.sEPlans = sEPlans;
                }

                if ((key + 1) === data.plans.length) {

                    data.gspAPlansT = gspAPlans;
                    data.gspEPlansT = gspEPlans;
                    data.sAPlansT = sAPlans;
                    data.sEPlansT = sEPlans;
                    data.gspT=gspAPlans+gspEPlans;
                     data.sT=sAPlans+sEPlans;
                }

            });

        },
        renderLoading: function () {

            dust.render("ProfileGeekSquad/dust/GSP-loadingPage", window.model, _.bind(function (err, html) {
                this.$el.html(html);

            }, this));

        },
        renderError: function () {
            dust.render("ProfileGeekSquad/dust/GSP-ErrorPage", window.model, _.bind(function (err, html) {
                this.$el.html(html);

            }, this));
        },

        render: function (data) {




            var data = {
                "plans": this.collection.toJSON()
            }
            if(data.plans.length===0){
                data.gspT=0;
                data.sT=0;
            }
            this.checkPlanAvailability(data);
            data.customer = window.model.customer;
            data.commonLinks = window.model.commonLinks;
            dust.render("ProfileGeekSquad/dust/GSp", data, _.bind(function (err, html) {
                this.$el.html(html);

            }, this));

        }
    });

    return ProfileGeekSquadView;
});