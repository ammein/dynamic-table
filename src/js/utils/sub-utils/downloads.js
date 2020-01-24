module.exports = function(self, options) {
       self.downloadCSV = function() {
           self.tabulator.table.download('csv', self.$id.val() + '.csv');
       }

       self.downloadJSON = function() {
           self.tabulator.table.download('json', self.$id.val() + '.json');
       }

       self.downloadXlsx = function() {
           self.tabulator.table.download('xlsx', self.$id.val() + '.xlsx', {
               sheetName: self.$title.val().length > 0 ? 'Tabulator' : self.$title.val()
           });
       }

       self.downloadPDFPotrait = function() {
           self.tabulator.table.download('pdf', self.$id.val() + ' (Potrait).pdf', {
               orientation: 'portrait',
               title: self.$title.val().length > 0 ? 'Tabulator' : self.$title.val()
           });
       }

       self.downloadPDFLandscape = function() {
           self.tabulator.table.download('pdf', self.$id.val() + ' (Landscape).pdf', {
               orientation: 'landscape',
               title: self.$title.val().length > 0 ? 'Tabulator' : self.$title.val()
           });
       }
}