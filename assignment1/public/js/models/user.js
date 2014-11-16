var eatz =  eatz || {};

eatz.UserModel = Backbone.Model.extend({

    idAttribute: "_id",
    url:'/auth',

    defaults: {
        username: "",
        password: "",
        email: ""
    }

});