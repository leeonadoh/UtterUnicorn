var eatz =  eatz || {};

eatz.NewAccView = Backbone.View.extend({

    events: {
        "click #signUpConfirm": "saveUser",
        "change #userName": "validateUsername",
        "change #email": "validateEmail",
        "change #password": "validatePassword",
        "change #confPassword": "validatePassword",
    },

    initialize: function () {
        this.render();
        //naming doms
        this.$userName = this.$("#userName");
        this.$email = this.$("#email");
        this.$confPassword = this.$("#confPassword");
        this.$password = this.$("#password");
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    clearEntries: function(){
        this.$userName.val("");
        this.$email.val("");
        this.$confPassword.val("");
        this.$password.val("");
    },

    clearErrors: function(){
        this.$(".control-group").removeClass("error");
        this.$(".help-inline").hide();
    },

    validateAll: function() {
        var valid = true;
        valid = this.validateUsername() && valid; 
        valid = this.validateEmail() && valid;
        valid = this.validatePassword() && valid;
        return valid;
    },

    validateUsername: function(){
        if (!eatz.utils.isWord(this.$userName.val())){
            this.$userName.parent().addClass("error");
            this.$userName.siblings("span").show();
            return false;
        }
        this.$userName.parent().removeClass("error");
        this.$userName.siblings("span").hide();
        return true;
    },

    validateEmail: function(){
        if (!eatz.utils.isValidEmail(this.$email.val())){
            this.$email.parent().addClass("error");
            this.$email.siblings("span").show();
            return false;
        }
        this.$email.parent().removeClass("error");
        this.$email.siblings("span").hide();
        return true;
    },

    // Ensures the password and confirm password fields match.
    validatePassword: function(){
        var valid = true;
        if(!eatz.utils.isWord(this.$password.val()) || this.$password.val().length < 8){
            this.$password.parent().addClass("error");
            this.$password.siblings("span").show();
            valid = false;
        } else {
            this.$password.parent().removeClass("error");
            this.$password.siblings("span").hide();
        }
        if (!(this.$password.val() === this.$confPassword.val())){
            this.$confPassword.parent().addClass("error");
            this.$confPassword.siblings("span").show();
            valid = false;
        } else {
            this.$confPassword.parent().removeClass("error");
            this.$confPassword.siblings("span").hide();
        }
        return valid;
    },

    fetchAttr: function(){
        return {
            username: this.$userName.val().trim(),
            email: this.$email.val().trim(),
            password: this.$password.val(), // Allow whitespace?
        };
    },

    saveUser: function(){
        // Check for valid username/email on server here.
        if (this.validateAll()){
            var user = new eatz.UserModel();
            user.set(this.fetchAttr());
            eatz.Users.add(user);
            user.save();
            eatz.Users.trigger("add:newUser");
            console.log(user);
            eatz.utils.deactivateHeaderItems();
            app.headerView.$("#browse").parent().addClass("active");
            document.location.href = "#dishes"; //Redirect page to the DishesView
        }
    }
});