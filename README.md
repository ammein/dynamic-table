# Dynamic Table
A dynamic table for ApostropheCMS using [Tabulator](http://tabulator.info/) that can work across all sites!

## Install
From withing your apostrophe project:
```bash
npm install --save dynamic-table
```

Include it in app.js:
```js
modules : {
    "dynamic-table" : {},
    "dynamic-table-widgets": {},
}
```

## Dynamic-Table Options Available
```js
modules : {
    "dynamic-table" : {
        theme: "bootstrap4", // Themes reference: http://tabulator.info/docs/4.5/theme
        tabulatorOptions: {
            // All Tabulator options available at: http://tabulator.info/docs/4.5/options
            height:"300px"
        }
    },
    "dynamic-table-widgets": {},
}
```