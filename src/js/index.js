import '../sass/index.sass';
import db from './db/connectDB';
import addQuote from './quotes/add';
import getQuotes from './quotes/get';
import "./general/master";
import '/node_modules/@fortawesome/fontawesome-free/js/all.min.js';

db.onsuccess = async function() {
    let quotes = await getQuotes(db.result);
    previewQuotes(quotes);


    // add new quote
    let addBtn = document.getElementsByClassName('add-quote-btn')[0];
    if(addBtn != undefined) {
        addBtn.addEventListener('click', async function(e){
            let book_name = document.getElementById('book_name').value;
            let quote_text = document.getElementById('quote').value;
            if(book_name && quote_text) {
                let added = addQuote(db.result, book_name, quote_text);

                let quotes = await getQuotes(db.result);
                previewQuotes(quotes);
                document.getElementsByClassName('add-quote-layout')[0].style.display = "none";
                document.getElementById('book_name').value = null;
                document.getElementById('quote').value = null;
            }
            else {
                alert('يجب إدخال بيانات الاقتباس !');
            }
        });
    }
}


function previewQuotes(quotes){
    let list = "";
    if( quotes.length > 0 ){
        quotes.map((quote) => {
            list+= `
                <div class="quote-item">
                    <p>
                        <i class="fa-solid fa-quote-right" style="color: #8b8b8b"></i>
                        ${quote.quote} 
                        <i class="fa-solid fa-quote-left"  style="color: #8b8b8b"></i>
                    </p>
                    <p class="book_name">${quote.book_name}</p>
                </div>
            `;
        });
    }
    else {
        list = `<p>لا يوجد اقتباسات بعد ... </p>`;
    }


    document.querySelector('.quotes-list').innerHTML = list;
}