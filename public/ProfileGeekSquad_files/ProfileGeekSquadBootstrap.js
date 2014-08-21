/* Src File:"ProfileGeekSquad/javascript/ProfileGeekSquadBootstrap.js" @ Tue Jul 01 2014 14:18:40 GMT-0500 (CDT) */

//+ optimize
$(function() {
    require(['ProfileGeekSquad/javascript/views/ProfileGeekSquadView', 'ProfileGeekSquad/javascript/models/skuModel'], function(ProfileGeekSquadView, skuModel) {

        //var baseUrl="/api/1.0/product/summaries?skus=";
        if (window.location.hostname === "localhost") {
            baseUrl = "/product?";
        } else {
            baseUrl = "/api/1.0/product/summaries?skus=";
        }

        var pageView = new ProfileGeekSquadView({
            el: '#ProfileGeekSquad-content'
        }).renderLoading();


        if (window.model.detail === null) {
            var plans = null;


        } else {

            var plans = {
                data: window.model.detail.plans,
                sku: [],
                gspPlans: [],
                skus: [],
                plansku: [],
                defalteImageUrl: window.imageBaseUrl + "ProfileGeekSquad/images/unavailable_95.jpg"

            };

        }


        if (typeof window.model.errorCode != 'undefined' && window.model.errorCode == 'cdsdown') {
            var pageView = new ProfileGeekSquadView({
                el: '#ProfileGeekSquad-content'
            }).renderError();


        } else {

            if (plans && window.model.detail.errorCode != "cdsdown") {

                _.each(plans.data, function(plan) {
                    if (plan.renewalType) {
                        plan.renewalType = $.trim(plan.renewalType)
                    }
                    if (plan.productSkuId) {
                        plans.sku.push(plan.productSkuId);
                    }


                    if (plan.productImageUrl) {} else {
                        plan.productImageUrl = window.imageBaseUrl + "ProfileGeekSquad/images/unavailable_95.jpg"
                    }

                    if (plan.planType === "gsp") {
                        if (plan.planName) {

                        } else {
                            plan.planName = "Geek Squad Protection Plan";
                        }
                        plan.productImageUrl = window.imageBaseUrl + "ProfileGeekSquad/images/unavailable_95.jpg"


                    } else {

                        if (plan.planType === "techSupport") {
                            if (plan.planName) {} else {
                                plan.planName = "Geek Squad Tech Support";
                            }
                            plan.productDescription = "Covers up to 3 devices, PC Macs or Tablets, with unlimited Tune-Ups, Virus Removals, or Troubleshooting. Also includes access to Online Training Videos and special offers for In-Home Services.";
                            //plan.planName="Geek Squad<sup>®</sup> Tech Support";

                        } else {
                            if (plan.planName) {

                                if (plan.planName.search(/Kaspersky/i) > -1) {
                                    plan.productDescription = "Virus, Spyware and Malware protection, for up to 3 PCs or Macs, simultaneously.";

                                } else if (plan.planName.search(/Trend Micro/i) > -1) {


                                    plan.productDescription = "Virus, Spyware and Malware protection, for up to 3 PCs or Macs, simultaneously.";


                                } else if (plan.planName.search(/Webroot/i) > -1) {


                                    plan.productDescription = "Virus, Spyware and Malware protection, for up to 3 PCs or Macs, simultaneously.";


                                } else if (plan.planName.search(/Microsoft/i) > -1) {
                                    plan.microsoft = 'microsoft';

                                    plan.planSkuId = "1050005160";
                                    plan._tab = "";
                                    plan.productDescription = "Microsoft Office for PC, Mac and Tablets.";


                                }

                            } else {
                                plan.planName = "Software Subscription Plan";

                            }

                        }

                    }

                });




                plans.skus = plans.sku.slice(0, 25);
                model.detail.sku = plans.sku.slice(25);
                plans.skus = plans.skus.join(",");

                gspcollection = new Backbone.Collection;

                var skumodel = new skuModel({});
                skumodel.url = baseUrl + plans.skus;
                skumodel.fetch();

                skumodel.on('moreSkus', function {
                    plans.skus = model.detail.sku.slice(0, 25);
                    model.detail.sku = model.detail.sku.slice(25);
                    plans.skus = plans.skus.join(",");
                    skumodel.url = baseUrl + plans.skus;
                    skumodel.fetch();

                });

                skumodel.on('myEvent', function() {
                    gspcollection.add(model.detail.plans);

                    var pageView = new ProfileGeekSquadView({
                        collection: gspcollection,
                        el: '#ProfileGeekSquad-content'
                    }).render();
                });



            } else {
                var pageView = new ProfileGeekSquadView({
                    el: '#ProfileGeekSquad-content'
                }).renderError();

            }

        }


    });
});