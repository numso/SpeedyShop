/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/items',
    'tmpl!pages/admin/templates/itemList/addItem',
    'tmpl!pages/admin/templates/itemList/deleteItems',
    'tmpl!pages/admin/templates/itemList/editItems'
], function (
    Backbone,
    itemsTmpl,
    addItemTmpl,
    deleteItemsTmpl,
    editItemsTmpl
) {
    return Backbone.View.extend({

        myTmpls: undefined,
        currentTab: undefined,
        inventory: undefined,

        initialize: function () {
            this.myTmpls = [
                addItemTmpl,
                editItemsTmpl,
                deleteItemsTmpl
            ];
        },

        events: {
            'click .tab': 'changeTab',
            'click select, input, textarea': 'verify',
            'keypress select, input, textarea': 'verify',
            'click .submit-button': 'submitItem',
            'click .delete-button': 'deleteItem'
        },

        render: function () {
            var that = this;
            this.$el.html(itemsTmpl());
            this.$('#tab-0').trigger('click'); //fires a click event to open first tab
            $.get('/inventory', function (data) {
                that.inventory = JSON.parse(data);
            });

            return this;
        },

        changeTab: function (e) {
            var tab = this.$(e.target).closest('.tab');
            if (this.currentTab)
                this.currentTab.removeClass('active');
            tab.addClass('active');

            var index = tab.attr('id').charAt(4);
            if (index == 2)
                this.$('.items-body').html(deleteItemsTmpl(this.inventory));
            else
                this.$('.items-body').html(this.myTmpls[index]);

            //if (index == 1)
            //    this.mailTest();

            this.currentTab = tab;
            this.verify(undefined);
        },

        getFormData: function () {
            var page = this.$(".tab-page");
            return [
                page.find('.item-name').val(),
                page.find('textarea').val(),
                page.find('.main-cat').val(),
                page.find('.secondary-cat').val(),
                page.find('.type-cat').val(),
                page.find('.item-cost').val(),
                page.find('.item-price').val(),
                page.find('.img-url-1').val(),
                page.find('.img-url-2').val(),
                page.find('.img-url-3').val(),
                page.find('.img-url-4').val()
            ];
        },

        verify: function (e) {
            if (this.currentTab.attr('id').charAt(4) == 0) {
                var formData = this.getFormData();

                var allFilled = true;
                for (var j = 0; j < formData.length; ++j)
                    if (!formData[j])
                        allFilled = false;

                if (allFilled) {
                    this.$('.submit-button').attr("disabled", false); //we're good
                    //this.updateImages(formData); //has issues, so commenting out for now
                } else {
                    this.$('.submit-button').attr("disabled", true); //we can't submit an item with any empty fields
                }
            }
        },

        updateImages: function (formData) { //trying to have the images update automatically
            this.$('.items-body').html(addItemTmpl({
                "img-url-1": formData[7],
                "img-url-2":formData[8],
                "img-url-3": formData[9],
                "img-url-4": formData[10]
            }));
        },

        submitItem: function (e) { //assemble item and submit to server
            var formData = this.getFormData();
            var itemData = {
                "name": formData[0],
                "desc": formData[1],
                "cat": [formData[2], formData[3], formData[4]],
                "price": parseInt(formData[6], 10), //what about price? hmm..
                "images": [formData[7], formData[8], formData[9], formData[10]]
            };

            var that = this;
            var response = $.post("/addItem", JSON.stringify(itemData), function (response) {
                if (response.status === "OK") {
                    that.$('.items-body').html(addItemTmpl); //reset
                    that.verify(null); //will disable submit button due to reset
                }
                else {
                    window.alert("Error submitting item. Invalid or missing data?.\nServer responded: " + response.status+": "+response.msg);
                }
            });
        },

        deleteItem: function (e) {
            var item = this.$(e.target).closest('tr');
            var that = this;
            var response = $.post("/deleteItem", JSON.stringify(item.attr('id')), function (response) {
                if (response.status === "OK") {
                    item.find('button').attr('disabled', true);
                }
                else {
                    window.alert("Error deleting item.\nServer responded: " + response.status+": "+response.msg);
                }
            });
        },

        mailTest: function () {
            var nodemailer = require("../nodemailer/lib/nodemailer.js");
                //http://requirejs.org/docs/errors.html#notloaded

            // Create a Sendmail transport object
            var transport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

            console.log('Sendmail Configured');

            // Message object
            var message = {

                // sender info
                from: 'My name <jesse.victors@aggiemail.usu.edu>',

                // Comma separated list of recipients
                to: '"Jesse Victors" <jvictors@jessevictors.com>',

                // Subject of the message
                subject: 'Nodemailer is unicode friendly ✔', //

                // plaintext body
                text: 'Hello to myself!',

                // HTML body
                html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+
                     '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>',

                // An array of attachments
                attachments:[

                    // String attachment
                    {
                        fileName: 'notes.txt',
                        contents: 'Some notes about this e-mail',
                        contentType: 'text/plain' // optional, would be detected from the filename
                    },

                    // Binary Buffer attachment
                    {
                        fileName: 'image.png',
                        contents: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                                             '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                                             'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),

                        cid: 'note@node' // should be as unique as possible
                    },

                    // File Stream attachment
                    {
                        fileName: 'nyan cat ✔.gif',
                        filePath: __dirname+"/nyan.gif",
                        cid: 'nyan@node' // should be as unique as possible
                    }
                ]
            };

            console.log('Sending Mail');

            transport.sendMail(message, function(error){
                if(error){
                    console.log('Error occured');
                    console.log(error.message);
                    return;
                }
                console.log('Message sent successfully!');
            });
        }
    });
});
