let links = function (self, options) {
    this.link('apos', 'downloadcsv', self.downloadCSV);
    this.link('apos', 'downloadjson', self.downloadJSON);
    this.link('apos', 'downloadxlsx', self.downloadXlsx);
    this.link('apos', 'downloadpdfpotrait', self.downloadPDFPotrait);
    this.link('apos', 'downloadpdflandscape', self.downloadPDFLandscape);
    this.link('apos', 'resetcallbacks', self.resetCallbacks);
    this.link('apos', 'resetoptions', self.resetOptions);
    this.link('apos', 'reloadTable', self.reloadTable);
    this.link('apos', 'loadjson', self.loadJSON);
    this.link('apos', 'loadtxt', self.loadTxt);
}

export default links;