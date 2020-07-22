let links = function (self, options) {
    this.link('apos', 'downloadcsv', check.bind(this, self.downloadCSV, 'download'));
    this.link('apos', 'downloadjson', check.bind(this, self.downloadJSON, 'download'));
    this.link('apos', 'downloadxlsx', check.bind(this, self.downloadXlsx, 'download'));
    this.link('apos', 'downloadpdfpotrait', check.bind(this, self.downloadPDFPotrait, 'download'));
    this.link('apos', 'downloadpdflandscape', check.bind(this, self.downloadPDFLandscape, 'download'));
    this.link('apos', 'resetcallbacks', self.resetCallbacks);
    this.link('apos', 'resetoptions', self.resetOptions);
    this.link('apos', 'reloadTable', self.hardReloadTable);
    this.link('apos', 'loadjson', check.bind(this, self.loadJSON, 'upload'));
    this.link('apos', 'loadtxt', check.bind(this, self.loadTxt, 'upload'));
    this.link('apos', 'loadcsv', check.bind(this, self.loadCSV, 'upload'));

    function check(executeFunc, permission) {
        apos.ui.globalBusy(true);
        return self.checkPermissions({
            user: {
                name: apos.user.title
            },
            table: {
                title: self.$title.find('input').val(),
                id: self.$id.find('input').val()
            },
            permission: permission
        }, function(data) {
            apos.ui.globalBusy(false);
            if (data.status === 'success') {
                apos.utils.log(data.message);
                return executeFunc();
            } else {
                apos.utils.warn(data.message);
                return apos.notify(data.message, { type: 'error' });
            }
        })
    }
}

export default links;