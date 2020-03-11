/* global JSONfn */
let events = function (self, options) {
    self.tabulator.events = function (editorType, cacheCheck = true) {

        let onChange = null;

        if (cacheCheck) {
            onChange = debounce(function (delta) {
                // delta.start, delta.end, delta.lines, delta.action
                let value = self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g) !== null ? self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g)[0] : '{}';

                try {
                    value = self.tabulator.convertJSONFunction(value);

                    // Check only that is change
                    value = self.tabulator.cacheCheck(editorType, JSONfn.parse(value));

                    // Restart Table
                    self.tabulator.restartTable(value, true);

                } catch (e) {
                    // Only allow if the format is wrong.
                    if (e.name === 'SyntaxError') {
                        apos.notify('' + editorType + ' : ' + e.message + '.', {
                            type: 'error',
                            dismiss: 3
                        });
                    }
                }
            }, 2000)
        } else {
            onChange = debounce(function (delta) {
                // delta.start, delta.end, delta.lines, delta.action
                let value = self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g) !== null ? self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g)[0] : '{}';

                try {
                    value = self.tabulator.convertJSONFunction(value);

                    // Restart Table
                    self.tabulator.restartTable(JSONfn.parse(value), true);

                } catch (e) {
                    // Only allow if the format is wrong.
                    if (e.name === 'SyntaxError') {
                        apos.notify('' + editorType + ' : ' + e.message + '.', {
                            type: 'error',
                            dismiss: 3
                        });
                    }
                }
            }, 2000)
        }

        // Will off the event listener for not triggering this type of events too many times when switching tabs (Bugs)
        self[editorType].editor.session.off('change', onChange);

        // Add new event listener on change
        self[editorType].editor.session.on('change', onChange);
    }
}

// Thanks to the article https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
export const debounce = (func, delay) => {
    let inDebounce
    return function () {
        const context = this
        const args = arguments
        clearTimeout(inDebounce)
        inDebounce = setTimeout(() => func.apply(context, args), delay)
    }
}

export default events;