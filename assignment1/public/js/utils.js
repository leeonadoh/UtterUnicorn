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
    }
};
