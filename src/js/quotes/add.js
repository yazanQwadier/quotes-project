module.exports = (db, book_name, quote_text) => {
    let new_quote = {
        book_name:book_name,
        quote:quote_text,
    };

    let transaction = db.transaction('quotes', 'readwrite');
    transaction.objectStore('quotes').add(new_quote);
    return new_quote;
}