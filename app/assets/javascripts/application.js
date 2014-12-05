// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.serializeJSON
//= require jquery_ujs
//= require turbolinks
//= require underscore
//= require backbone
//= require route_mapper
//= require_tree ../templates
//= require_tree ./models
//= require_tree ./collections
//= require_tree ./views
//= require_tree ./routers
//= require_tree .

$.UsersSearch = function (el) {
	this.$el = $(el);
	this.$input = this.$el.find("input[name=username]");
	this.$ul = this.$el.find(".users");

	this.$input.on("input", this.handleInput.bind(this));
};

$.UsersSearch.prototype.handleInput = function (event) {
	if (this.$input.val() == "") {
		this.renderResults([]);
		return;
	}

	$.ajax({
		url: "/users",
		dataType: "json",
		method: "GET",
		data: {  },
		success: this.setCurrentUser.bind(this)
	});

	$.ajax({
		url: "/users/search",
		dataType: "json",
		method: "GET",
		data: { query: this.$input.val() },
		success: this.renderResults.bind(this)
	});
};
$.UsersSearch.prototype.setCurrentUser = function (result) { current_user = result }
$.UsersSearch.prototype.renderResults = function (users) {
	this.$ul.empty();
	for (var i = 0; i < users.length; i++) {
		var user = users[i];


		follow = function() {
			$.ajax({
				 beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
				url: "/users/" + this.id + "/followings",
				dataType: "json",
				method: "POST",
				data: this
			})
		};
		var $a = $("<div></div>");
		$a.text(user.username);
		// $a.attr("href", "/users/" + user.id + "/followings");
		$a.on("click", follow.bind(user));
		// button to follow
		var $li = $("<li></li>");
		$li.append($a);

		this.$ul.append($li);
	}
}

$.fn.usersSearch = function () {
	return this.each(function () {
		new $.UsersSearch(this);
	});
};

$(function () {
	$("div.users-search").usersSearch();
})