import getQuotes from './get';

export default async (db, id, book_name, quote_text) => {
    let quote_item = await getQuotes.get(db, id);
    console.log(quote_item);
    quote_item.book_name = book_name;
    if(quote_item.quote_type == 'text')
        quote_item.quote_text = quote_text;

    let transaction = db.transaction('quotes', 'readwrite');
    let store = transaction.objectStore('quotes');
    store.put(quote_item);
    return quote_item;
}