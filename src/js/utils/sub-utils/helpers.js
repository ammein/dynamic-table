let helpers = function(self, options) {
    // Thanks to Stephen Wagner (https://stephanwagner.me/auto-resizing-textarea-with-vanilla-javascript)
    self.textareaAutoResize = function (element) {
        element.style.boxSizing = 'border-box';
        let offset = element.offsetHeight - element.clientHeight;
        element.addEventListener('input', function (event) {
            event.target.style.height = 'auto';
            event.target.style.height = event.target.scrollHeight + offset + 'px';
        });
    }

    self.executeAutoResize = function (element) {
        let offset = element.offsetHeight - element.clientHeight;
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + offset + 'px';
    }

    // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
    self.findNested = function (path, data) {
        if (Array.isArray(path)) {
            path = path.join('.');
        }
        return path.split('.').reduce(function (xs, x) {
            return (xs && xs[x]) ? xs[x] : null
        }, data);
    }
}

export default helpers;