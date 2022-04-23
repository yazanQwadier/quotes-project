module.exports = {
    getAll: async function(db) {
        let result = await new Promise((resolve, reject) => {
            let transaction = db.transaction('quotes', 'readwrite');
            let store = transaction.objectStore('quotes');
            let result = store.getAll();
    
            result.onsuccess = () => resolve(result.result);
            result.onerror = () => reject('error');
        });
    
        return result;
    },
    get: async function(db, id) {
        let result = await new Promise((resolve, reject) => {
            let transaction = db.transaction('quotes', 'readwrite');
            let store = transaction.objectStore('quotes');
            let result = store.get(id);
    
            result.onsuccess = () => resolve(result.result);
            result.onerror = () => reject('error');
        });
    
        return result;
    }
}