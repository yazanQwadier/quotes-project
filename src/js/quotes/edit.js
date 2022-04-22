module.exports = (db, id, book_name, quote_text) => {
    let quote_data = {
        id: id,
        book_name:book_name,
        quote:quote_text,
    };

    let transaction = db.transaction('quotes', 'readwrite');
    transaction.objectStore('quotes').put(quote_data);
    return quote_data;
}