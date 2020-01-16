module.exports = function(self, options) {
    // eslint-disable-next-line no-var
    var superPushAssets = self.pushAssets;

    self.pushAssets = function () {
        superPushAssets();

        self.pushAsset('script', 'myEditor', {
            when: 'user'
        })

        self.pushAsset('script', 'utils', {
            when: 'user'
        });

        self.pushAsset('stylesheet', 'modal', {
            when: 'user'
        });

        self.pushAsset('script', 'vendor/papaparse/papaparse.min', {
            when: 'user'
        })

        self.pushAsset('script', 'vendor/json/jsonfn.min', {
            when: 'always'
        })

        self.pushAsset('script', 'vendor/json/json5.min', {
            when: 'always'
        })

        self.pushAsset('script', 'vendor/tabulator/tabulator.min', {
            when: 'always'
        })

        if (options.apos.customCodeEditor) {
            self.pushAsset('script', 'extends/customCodeEditor', {
                when: 'user'
            })
        }
    }
}