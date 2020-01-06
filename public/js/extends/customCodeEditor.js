apos.define('custom-code-editor', {
    construct: function(self, options) {
        // create superPopulate to extend method
        let superPopulate = self.populate;

        // Get extension self object
        let _this = self;

        self.populate = function (object, name, $field, $el, field, callback) {
            // Locate the element on specific schema
            let $fieldSet = apos.schemas.findFieldset($el, name);

            // Get Editor
            let $fieldInput = $fieldSet.find('[data-editor]').get(0);

            // Init Editor
            // eslint-disable-next-line no-undef
            let editor = ace.edit($fieldInput);

            self.tabulator = function($form) {
                // eslint-disable-next-line no-undef
                let beautify = ace.require('ace/ext/beautify');
                if ($form.find('#dynamicTable').length > 0) {
                    // Add my own option for custom code editor when dynamic-table enable
                    editor.session.setValue(`var callbacks = {
                            tableBuilding: function () {},
                            tableBuilt: function () {},
                    }`);

                    beautify.beautify(editor.session);
                }
            }
            superPopulate(object, name, $field, $el, field, callback);
        }
    }
})