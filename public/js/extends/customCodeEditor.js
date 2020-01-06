apos.define('custom-code-editor', {
    construct: function(self, options) {
        // create superPopulate to extend method
        let superPopulate = self.populate;

        // Get extension self object
        let _this = self;

        self.populate = function (object, name, $field, $el, field, callback) {
            superPopulate(object, name, $field, $el, field, callback);

            // Locate the element on specific schema
            let $fieldSet = apos.schemas.findFieldset($el, name);

            // Get Editor
            let $fieldInput = $fieldSet.find('[data-editor]').get(0);

            // Init Editor
            // eslint-disable-next-line no-undef
            let editor = ace.edit($fieldInput);

            self.tabulator = function($form, type) {
                // eslint-disable-next-line no-undef
                let beautify = ace.require('ace/ext/beautify');
                type.forEach(function(val, i, arr) {
                    switch (val) {
                        case 'tableCallback':
                            self[val].editor.session.setValue(`var callbacks = {
                                tableBuilding: function () {},
                                tableBuilt: function () {}
                            }`);
                            beautify.beautify(self[val].editor.session);
                            break;

                        case 'columnCallback':
                            self[val].editor.session.setValue(`var callbacks = {
                                columnMoved: function (column, columns) {
                                    //column - column component of the moved column
                                    //columns- array of columns in new order
                                }, 
                                columnResized: function (column) {
                                    //column - column component of the resized column
                                },
                                columnVisibilityChanged: function (column, visible) {
                                    //column - column component
                                    //visible - is column visible (true = visible, false = hidden)
                                },
                                columnTitleChanged: function (column) {
                                    //column - column component
                                }
                            }`);
                            beautify.beautify(self[val].editor.session);
                            break;
                    }
                })
            }
        }
    }
})