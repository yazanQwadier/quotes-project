var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
let db;
if(indexedDB != undefined) {
    let DBRequest = indexedDB.open('quotesDB', 1);
    DBRequest.onupgradeneeded = function() {
        let result = DBRequest.result;
        if( !result.objectStoreNames.contains('quotes') ) {
            result.createObjectStore('quotes', {keyPath: 'id', autoIncrement: true});
        }
    }

    DBRequest.onerror = function(e) {
        console.log('Error DB');
    }

    db = DBRequest;
}

module.exports = db;
