/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/items',
    'tmpl!pages/admin/templates/itemList/editableItem',
    'tmpl!pages/admin/templates/itemList/editDeleteItems'
], function (
    Backbone,
    itemsTmpl,
    editableItemTmpl,
    editDeleteItemsTmpl
) {
    return Backbone.View.extend({

        currentTab: undefined,
        inventory: undefined,

        initialize: function () {
        },

        events: {
            'click .tab': 'changeTab',
            'click select, input, textarea': 'verify',
            'keydown select, input, textarea': 'verify',
            'click .submit-add': 'submitItem',
            'click .submit-edit': 'submitEditedItem',
            'click .delete-button': 'deleteItem',
            'click .edit-button': 'editItem',
            'blur .images-URLs input': 'updateImage'
        },

        updateImage: function (e) {
            var el = $(e.target).closest('input');
            this.$("." + el.attr('id')).attr('src', el.val());
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
            this.currentTab = tab;

            var index = tab.attr('id').charAt(4);
            if (index == 0)
                this.showAddNewItemTemplate();
            else if (index == 1)
                this.$('.items-body').html(editDeleteItemsTmpl(this.inventory));

            //if (index == 1)
            //    this.mailTest();

            this.verify(undefined);
        },

        showAddNewItemTemplate: function () {
            this.$('.items-body').html(editableItemTmpl({
                type: "add",
                submitText: "Add New Item"
            }));
            this.verify(null); //will disable submit button due to reset
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
                page.find('#1-img-url').val(),
                page.find('#2-img-url').val(),
                page.find('#3-img-url').val(),
                page.find('#4-img-url').val()
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
                } else {
                    this.$('.submit-button').attr("disabled", true); //we can't submit an item with any empty fields
                }
            }
        },

        submitItem: function (e) { //assemble item and submit to server
            var formData = this.getFormData();
            var itemData = {
                "name": formData[0],
                "desc": formData[1],
                "cat": [formData[2], formData[3], formData[4]],
                "price": parseInt(formData[6], 10), //what about cost? hmm...
                "images": [formData[7], formData[8], formData[9], formData[10]]
            };

            var that = this;
            var response = $.post("/addItem", JSON.stringify(itemData), function (response) {
                if (response.status === "OK") {
                    that.showAddNewItemTemplate();
                }
                else {
                    window.alert("Error submitting item. Invalid or missing data?.\nServer responded: " + response.status+": "+response.msg);
                }
            });
        },

        deleteItem: function (e) {
            var item = this.$(e.target).closest('tr');
            var itemID = item.attr('id');
            var that = this;
            var response = $.post("/deleteItem/"+itemID, {}, function (response) {
                if (response.status === "OK") {
                    $.get('/inventory', function (data) {
                        that.inventory = JSON.parse(data); //refresh inventory
                        item.find('button').attr('disabled', true); //disable all controls: the item is gone
                    });
                }
                else {
                    window.alert("Error deleting item.\nServer responded: " + response.status);
                }
            });
        },

        editItem: function (e) {
            var that = this;
            var id = this.$(e.target).closest('tr').attr('id');
            $.get('/getItem/' + id, function (data) {
                if (data.status === "success") {
                    var obj = {
                        submitText: "Submit Changes",
                        type: "edit", //so event can be triggered from it
                        id: id,
                        name: data.item.name,
                        price: data.item.price,
                        desc: data.item.desc,
                        imgUrl1: data.item.images[0], //why is data.images undefined? Dallin!
                        imgUrl2: data.item.images[1],
                        imgUrl3: data.item.images[2],
                        imgUrl4: data.item.images[3]
                    }
                    that.$('.items-body').html(editableItemTmpl(obj)); //fill out fields
                    that.verify(null);
                }
            });
        },

        submitEditedItem: function (e) {
            var formData = this.getFormData();
            var itemData = {
                id: this.$('.item-name').attr('id'),
                name: formData[0],
                desc: formData[1],
                cat: [formData[2], formData[3], formData[4]],
                cost: parseInt(formData[5], 10),
                price: parseInt(formData[6], 10),
                images: [formData[7], formData[8], formData[9], formData[10]]
            };

            var that = this;
            var response = $.post("/changeItem", JSON.stringify(itemData), function (response) {
                if (response.status === "OK") {
                    $.get('/inventory', function (data) {
                        that.inventory = JSON.parse(data); //refresh inventory
                        that.$('.items-body').html(editDeleteItemsTmpl(that.inventory)); //reset
                        that.verify(null);
                    });
                }
                else {
                    window.alert("Error submitting edited item. Invalid or missing data?.\nServer responded: " + response.status+": "+response.msg);
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
