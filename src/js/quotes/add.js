module.exports = (db, book_name, quote_type, quote_text, base64_audio) => {
    let new_quote = {
        book_name: book_name,
        quote_type: quote_type,
        quote_text: quote_text,
        base64_audio: base64_audio,
        created_at: Date.now()
    };

    let transaction = db.transaction('quotes', 'readwrite');
    transaction.objectStore('quotes').add(new_quote);
    return new_quote;
}