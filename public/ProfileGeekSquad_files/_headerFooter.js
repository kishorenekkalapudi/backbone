/* Src File:"_headerFooter/javascript/_headerFooter.js" @ Tue Jul 01 2014 14:18:36 GMT-0500 (CDT) */

/**
 * Navigation JavaScript for BestBuy.com.
 * @class
 */
var globalNavigation = {
	/**
	 * deleteCookie
	 */
	deleteCookie: function(name)	{
		document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	},

	/**
	* Reserved for future logout functionality required.
	*/
	logout: function()	{
		var sessionId = $.bbycookie('DYN_USER_ID');
		$('#logout-form-session-id').attr('value', sessionId);
	},

	/* The main navigation - Products, Services, Shops & Deals, Gifts. */
	confignavitems: {
		sensitivity: 7,
		interval: 50,
		over: function () {
			$(this).addClass("sfhover");
			$(this).addClass("nav-hover");
		},
		timeout: 120,
		out: function () {
			$(this).removeClass("sfhover");
			$(this).removeClass("nav-hover");
		}
	},
	confignav: { /* All of the navigation as a whole. */
		sensitivity: 7,
		interval: 100,
		over: function () {},
		timeout: 200,
		out: function () {}
	},
	configsubnavitems: { /* The navigation under Products. */
		sensitivity: 10,
		interval: 0,
		over: function () {
			$(this).parent().parent().find("li").removeClass("sfhover");
			$(this).parent("li").addClass("sfhover");
			$(this).parent().parent().find("li").removeClass("nav-hover");
			$(this).parent("li").addClass("nav-hover");
		},
		timeout: 150,
		out: function () {
		}
	},
	configpronav: { /* The navigation under Products. */
		sensitivity: 10,
		interval: 90,
		over: function () {
		},
		timeout: 250,
		out: function () {
			$(this).children("li").removeClass("sfhover");
			$(this).children("li").removeClass("nav-hover");
		}
	},

	/* For Devices with Touch */
	configParentTouch: function() {
		var that = this;

		globalNavigation.showParentMenu.apply(this, arguments);

		$('body').one('click', function () {
			globalNavigation.closeParentMenu.call(that);
		});

		return false; // Stop propagation, Prevent Default
	},

	closeParentMenu: function () {
		$(this).parents('header').find('nav > ul > li').removeClass("sfhover nav-hover");
	},

	showParentMenu: function () {
		globalNavigation.closeParentMenu.call(this);
		globalNavigation.closeChildMenu.call(this);
		$(this).closest('li').addClass("sfhover nav-hover");
	},

	configChildTouch: function (e) {
		var $container = $(this).closest('li');
		if ($container.find('ul').length && !$container.hasClass('sfhover')) {
			globalNavigation.showChildMenu.apply(this, arguments);

			return false; // Stop propagation, Prevent Default
		}
		// Let the click continue, will navigate
	},

	closeChildMenu: function () {
		$(this).closest('ul').find('li').removeClass("sfhover nav-hover");
	},

	showChildMenu: function () {
		globalNavigation.closeChildMenu.call(this);
		$(this).closest('li').addClass("sfhover nav-hover");
	},

	/**
	 * Initializes form validation for search form.
	 */
	searchFormValidation: function()	{
		var sessionId = $.bbycookie('DYN_USER_ID');
		$('#search-session-id').attr('value', sessionId);
		var $searchForm = $('#sitesearch form');
		$searchForm.submit(function(event)	{
			var $searchField = $('input#search-field');
			var searchEntry = $.trim($searchField.attr('value'));
			if(searchEntry == 'Search by Keyword, SKU # or Item #' || searchEntry == '' || searchEntry == '%')	{
				event.preventDefault();
			}
		});
	},

	updateCartCount: function(response) {
		$('.cart-items').html(response.quantity);
	},

	/**
	* Initializes the globalNavigation object.
	*/
	init: function () {
		EventManager.on('bby-cart:add-to-cart-success', globalNavigation.updateCartCount);

		var touchEvent = window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart';
		var $nav = $("#nav-touch");
		var $profileNav = $("#profile-nav");

		if ($nav.length > 0) {
			// Feature detect touch
			if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
				$nav.find("> li > a").on('click', globalNavigation.configParentTouch);
				$nav.find("ul > li h4").on('click', globalNavigation.configChildTouch);
			}
			else {
				$nav.find("> li").hoverIntent(globalNavigation.confignavitems); /* The main navigation - Products, Services, Shops & Deals, Gifts. */
				$nav.hoverIntent(globalNavigation.confignav); /* All of the navigation as a whole. */
				$nav.find("ul > li h4").hoverIntent(globalNavigation.configsubnavitems); /* The navigation under Products. i.e. TV & Video, Audio, Car & GPS. */
				$nav.find(".nav-pro > ul").hoverIntent(globalNavigation.configpronav); /* Only the Product Nav */
				$nav.find("a.nav-pro, a.nav-svc, a.nav-sho, a.nav-gif").click(function() {return false;});
			}
			$nav.removeClass('nav-njs');
		}

		if ($profileNav.length > 0) {
			if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
				$profileNav.find("ul > li > a").eq(0).on('click', globalNavigation.configParentTouch);
			}
			else {
				$profileNav.find("ul >li").eq(0).hoverIntent(globalNavigation.confignavitems);  /* My Best Buy Nav */
				$profileNav.find("a.nav-my").click(function() {return false;});
			}
			$profileNav.removeClass('nav-njs');
		}
		globalNavigation.searchFormValidation();

		//binding logout function to logout button
		$('button#logout-button').click(function()	{
			globalNavigation.logout();
		});
	}
};


