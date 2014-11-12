var eatz =  eatz || {};

eatz.UserModel = Backbone.Model.extend({

    idAttribute: "_id",

    defaults: {
        username: "",
        password: "",
        email: ""
    }

});