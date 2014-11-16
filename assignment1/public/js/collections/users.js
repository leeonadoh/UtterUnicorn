var eatz =  eatz || {};

eatz.UsersCollection = Backbone.Collection.extend({
    model: eatz.UserModel,

    url:'/auth',
});

eatz.Users = new eatz.UsersCollection();