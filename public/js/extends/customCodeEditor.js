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

            self.tabulator = {};

            self.tabulator.events = function(editorType) {
                self[editorType].editor.session.on('change', debounce(function(delta) {
                    // delta.start, delta.end, delta.lines, delta.action
                    let value = self[editorType].editor.session.getValue();
                    // eslint-disable-next-line no-eval
                    let callbacks = eval(value)
                    // Later we are going to use JSONfn for execute function inside object
                }, 2000))
            }

            // Thanks to the article https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
            const debounce = (func, delay) => {
                let inDebounce
                return function () {
                    const context = this
                    const args = arguments
                    clearTimeout(inDebounce)
                    inDebounce = setTimeout(() => func.apply(context, args), delay)
                }
            }

            self.tabulator.setValue = function($form, type) {
                // eslint-disable-next-line no-undef
                let beautify = ace.require('ace/ext/beautify');
                type.forEach(function(val, i, arr) {
                    switch (val) {
                        case 'tableCallback':
                            // Set Worker to be false to disable error highlighting
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(`{
                                "tableBuilding": function () {},
                                "tableBuilt": function () {}
                            }`);
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val)
                            break;

                        case 'columnCallback':
                            // Set Worker to be false to disable error highlighting
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(`{
                                "columnMoved": function (column, columns) {
                                    //column - column component of the moved column
                                    //columns- array of columns in new order
                                }, 
                                "columnResized": function (column) {
                                    //column - column component of the resized column
                                },
                                "columnVisibilityChanged": function (column, visible) {
                                    //column - column component
                                    //visible - is column visible (true = visible, false = hidden)
                                },
                                "columnTitleChanged": function (column) {
                                    //column - column component
                                }
                            }`);
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val, [])
                            break;
                    }
                })
            }
        }
    }
})