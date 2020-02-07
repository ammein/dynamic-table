let load = function (self, options) {
    self.loadJSON = function() {
        self.tabulator.table.setDataFromLocalFile();
    }

    self.loadTxt = function() {
        self.tabulator.table.setDataFromLocalFile('.txt');
    }
}

export default load;