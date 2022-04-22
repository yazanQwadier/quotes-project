import '../sass/index.sass';
import db from './db/connectDB';
import addQuote from './quotes/add';
import editQuote from './quotes/edit';
import deleteQuote from './quotes/delete';
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

                    <div class="editable-quote-item">
                        <input type="text" placeholder="إسم الكتاب" class="quote-book-name" value="${quote.book_name}" required>
                        <textarea placeholder="نص الاقتباس" rows="1" class="quote-content" required>${quote.quote}</textarea>

                        <button class="edit-btn" title="تعديل" data-quoteId="${quote.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" title="حذف" data-quoteId="${quote.id}"><i class="fas fa-eraser"></i></button>
                    </div>
                </div>
            `;
        });
    }
    else {
        list = `<p>لا يوجد اقتباسات بعد ... </p>`;
    }

    document.querySelector('.quotes-list').innerHTML = list;

    let quoteItems = document.getElementsByClassName('quote-item');
    if(quoteItems.length > 0) {
        for(let quoteItem of quoteItems) {
            registerEventHandlerForQuote(quoteItem);
        }
    }
}

function registerEventHandlerForQuote(quoteItem) {
    quoteItem.addEventListener('dblclick', function(e) {
        quoteItem.getElementsByClassName('editable-quote-item')[0].style.display = "flex";
    });


    // edit quote content
    let editBtn = quoteItem.getElementsByClassName('edit-btn')[0];
    if(editBtn != undefined) {
        editBtn.addEventListener('click', async function(e){
            let form = editBtn.parentElement;
            let id = parseInt(editBtn.getAttribute('data-quoteId'));
            let book_name = form.getElementsByClassName('quote-book-name')[0].value;
            let quote_text = form.getElementsByClassName('quote-content')[0].value;
            if(book_name && quote_text) {
                editQuote(db.result, id, book_name, quote_text);
                let quotes = await getQuotes(db.result);
                previewQuotes(quotes);
                form.style.display = "none";
            }
            else {
                alert('يجب إدخال بيانات الاقتباس !');
            }
        });
    }

    // delete quote content
    let deleteBtn = quoteItem.getElementsByClassName('delete-btn')[0];
    if(deleteBtn != undefined) {
        deleteBtn.addEventListener('click', async function(e){
            let id = parseInt(deleteBtn.getAttribute('data-quoteId'));
            let is_confirmed = confirm('هل انت متأكد من حذف الاقتباس ؟');
            if( is_confirmed ) {
                deleteQuote(db.result, id);
                let quotes = await getQuotes(db.result);
                previewQuotes(quotes);
            }
        });
    }
}