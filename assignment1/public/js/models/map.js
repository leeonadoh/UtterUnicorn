var eatz =  eatz || {};

eatz.MapModel = Backbone.Model.extend({

    defaults: {
        zoom: 16,
        type: google.maps.MapTypeId.ROADMAP,
        // Default center at UTSC. (lat, lon);
        center: new google.maps.LatLng(43.784925, -79.185323)
    }, 

	initialize: function(opt){
		if (opt.lat && opt.lon){
			this.set({center: new google.maps.LatLng(opt.lat, opt.lon)});
		}
	},
});