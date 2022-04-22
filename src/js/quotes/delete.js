module.exports = (db, quote_id) => {
    let transaction = db.transaction('quotes', 'readwrite');
    transaction.objectStore('quotes').delete(quote_id);
    return true;
}