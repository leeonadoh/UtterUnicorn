var eatz =  eatz || {};

// note View-name (EditView) matches name of template EditView.html
eatz.MapView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());  // create DOM content for EditView
        // Create the Google map object, passing in the DOM element to load it into, and the model properties.
    	this.map = new google.maps.Map(this.$("#mapContent")[0], this.model.toJSON());
    	// Set a marker on the map using the lon and lat values in model.
    	this.marker = new google.maps.Marker({position:this.model.get("center"), map: this.map});
        return this; // support chaining
    },
    
    setCenter: function(lat, lon){
    	// Reset center and update marker.
    	if (lat && lon)
    		this.model.set({center: new google.maps.LatLng(lat, lon)});
    	else 
    		this.model.set({center: this.model.defaults.center});
    	this.map.setCenter(this.model.get("center"));
    	this.marker.setPosition(this.model.get("center"));
    },

    resize: function(){
    	// Trigger map resize. 
    	google.maps.event.trigger(this.map, 'resize');
    }

});	