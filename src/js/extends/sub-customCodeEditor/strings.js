/* global JSONfn */
let strings = function (self, options) {

    // Using JSONfn (https://github.com/vkiryukhin/jsonfn) to make function enable on JSON Object
    /**
     * To convert string inputs to JSONFn format so that able to use JSONfn.parse(value) later
     */
    self.tabulator.convertJSONFunction = function (value) {
        value = self.tabulator.JSONFunctionStringify(value);
        value = self.tabulator.addNewLineInFunction(value);
        value = self.tabulator.removeBreakLines(value);

        return value;
    }

    /**
     * To convert object to string for for friendly inputs adjustment on custom-code-editor
     */
    self.tabulator.convertToString = function (value) {
        value = JSONfn.stringify(value);
        value = self.tabulator.JSONFunctionParse(value);
        value = self.tabulator.JSONFuncToNormalString(value);
        return value;
    }

    // Remove break lines and replace with '\n' string for JSONfn.parse() to use
    self.tabulator.removeBreakLines = function (text) {
        try {
            text = text.replace(/\s+(?!\S)/g, '');
        } catch (e) {
            apos.utils.warn('Unable to remove break line for: \n', text)
        }
        return text;
    }

    // Restructurize string into friendly & familiar string. Good case for Objects Javascript for Custom-Code-Editor display
    self.tabulator.JSONFuncToNormalString = function (text) {
        try {
            text = text.replace(/(\\n|\\r)+/g, '\n');
            text = text.replace(/\\"/g, '"');
            text = text.replace(/"(\{(.|[\r\n])+\})"/g, '$1');
        } catch (e) {
            apos.utils.warn('Unable to convert to string for: \n', text)
        }

        return text
    }

    // Remove all string quotes from function and keys to make it normal string object display on custom-code-editor
    self.tabulator.JSONFunctionParse = function (text) {
        try {
            text = text.replace(/(?:"(function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})")|"(\w+?)"(?=(\s*?):\s*(?!function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}))/g, '$1$3');
        } catch (e) {
            apos.utils.warn('Unable to JSONfn parse format for: \n', text)
        }
        return text;
    }

    // Anything that has break lines replace it with '\n'. Also make the strings of all of them in single line of string. Easy for JSONfn.parse()
    self.tabulator.addNewLineInFunction = function (text) {
        let textArr = null;

        try {
            // Store Match String
            textArr = text.match(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g);

            // Replace with empty string
            text = text.replace(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g, '');

            textArr = textArr.map(function (val, i, arr) {
                val = val.replace(/"/g, '\\"')
                return val.replace(/(\r\n|\n|\r)/g, '\\n');
            });
            let i = -1;
            text = text.replace(/""/g, function (val) {
                i++;
                return '"' + textArr[i] + '"';
            });
        } catch (e) {
            if (textArr) {
                apos.utils.warn('Unable to add new line in function for: \n', text)
            }
        }

        return text;
    }

    // Convert everything from string that has Object Javascript format with double quotes string. Later to be use on JSON.parse()
    self.tabulator.JSONFunctionStringify = function (text) {
        return text.replace(/(\w+?)(?=(\s*?:\s*?([""]|['']|[\w]))|(\s*?:\s*?([[\]]|[{}]|[\w\s\d]+?,)))|(function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})|(\w+?)(?=(\s*?):\s*function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})/g, '"$&"');
    }
}

export default strings;