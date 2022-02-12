module.exports = async (db) => {
    let result = await new Promise((resolve, reject) => {
        let transaction = db.transaction('quotes', 'readwrite');
        let store = transaction.objectStore('quotes');
        let result = store.getAll();

        result.onsuccess = () => resolve(result.result);
        result.onerror = () => reject('error');
    });

    return result;
}