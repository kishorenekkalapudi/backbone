
//Load Web App JavaScript Dependencies/Plugins
define(
 function(require)
{
    var $=require('jquery');
    var _=require('underscore');
    var Backbone=require('backbone');
    var modernizr=require('modernizr');
    var bootstrap=require('bootstrap');
    var test=require('js/app/test.js');
    var appView=require('js/app/views/appView.js');
    $(function()
    {
        new appView({
            el:'#header'
        }).render();
        //do stuff
        console.log('required plugins loaded...');

    });
});