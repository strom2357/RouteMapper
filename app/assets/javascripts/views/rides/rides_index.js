RouteMapper.Views.RidesIndex = Backbone.View.extend({
  
  template: JST['rides/index'],

  initialize: function() {
  	this.listenTo(this.collection, "sync", this.render)
  },

  render: function() {
    
  	var renderedContent = this.template({
  		rides: this.collection
  	});

  	this.$el.html(renderedContent);
  	return this;	
  }

});
