var eatz = eatz || {};

eatz.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (eatz[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    eatz[view].prototype.template = _.template(data);
                }));
            } else {
                console.log(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    uploadFile: function (file, callback) {
        console.log("saving file");
        console.log(file);
        var data = new FormData();
        data.append('file', file);
        console.log(data);  // file is the user-selected file object
        var xhr = $.ajax({
            type: "POST",  
            url: "dishes/image",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function (res) {
                callback(res);
            }
        });
        console.log("saved file");
    },

    isValidEmail: function(email) {
        // Retrieved from http://badsyntax.co/post/javascript-email-validation-rfc822
        return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
    },

    isWord: function(word) {
        // lower and capital letters, numbers, and underscore. 
        return /\w/.test(word);
    },

    isValidURL: function(url) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url) || !(url.trim());
    },

    deactivateHeaderItems: function(){
        app.headerView.$(".navItem").each(function(index) {
            $(this).removeClass("active");
        });
    }
};
