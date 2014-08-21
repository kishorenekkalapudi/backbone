/* Src File:"ProfileGeekSquad/javascript/models/skuModel.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

define(function() {

    return Backbone.Model.extend({

        initialize: function() {
            _.bindAll(this);
        },

        fetch: function(options) {
            var self = this;
            var opts = {
                success: function(data) {
                    _.each(model.detail.plans, function(plan) {
                        if (plan.planType === "gsp") {
                            _.each(data.attributes, function(data) {
                                if (data.skuId === plan.productSkuId) {
                                    if (data.error) {} else {
                                        plan.productType = data.productType;
                                        if (data.names && data.names.short)
                                            plan.productDescription = data.names.short;
                                        if (data.manufacturerId)
                                            plan.productModelNumber = data.manufacturerId.modelNumber;
                                        if (data.media && data.media.primaryImage && data.media.primaryImage.path)
                                            plan.productImageUrl = 'https://images-ssl.bestbuy.com/' + data.media.primaryImage.path;
                                        plan.productType = data.productType;

                                    }

                                }


                            });


                        } else {

                        }

                    });



                    self.trigger('myEvent');


                },
                error: function() {


                }
            };

            // Combine options and custom handlers, apply to fetch prototype, call.
            (_.bind(Backbone.Model.prototype.fetch, this, _.extend({}, options, opts)))();
        },
        parse: function(response, options) {



            return response;



        }

    });

});