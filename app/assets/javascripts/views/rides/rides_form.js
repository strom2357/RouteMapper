RouteMapper.Views.RidesForm = Backbone.View.extend({
  tagName: 'form',  
  template: JST['rides/form'],
  

  events: {
    "click button": "submit"
  },
  // initialize: function() {
  // 	this.listenTo(this.collection, "sync", this.render)
  // },

  render: function() {
  
  	var renderedContent = this.template({
  		//will need for edit
      ride: this.model
  	});

  	this.$el.html(renderedContent);
  	return this;	
  },

  submit: function(event) {
    event.preventDefault(); // do we need this line
    var attrs = this.$el.serializeJSON();

    function success() {
      Backbone.history.navigate("", { trigger: true } )
    }

    this.model.set(attrs);
    debugger
    if (this.model.isNew()) {
      this.collection.create(attrs, {
        success: success
      })
    } else {
      this.model.save(attrs, {
        success: success
      })
    }
  }

});
