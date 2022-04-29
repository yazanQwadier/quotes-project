import '../sass/index.sass';
import db from './db/connectDB';
import addQuote from './quotes/add';
import editQuote from './quotes/edit';
import deleteQuote from './quotes/delete';
import getQuotes from './quotes/get';
import "./general/master";
import '/node_modules/@fortawesome/fontawesome-free/js/all.min.js';

db.onsuccess = async function() {
    let quotes = await getQuotes.getAll(db.result);
    previewQuotes(quotes);

    // add new quote
    let addBtn = document.getElementsByClassName('add-quote-btn')[0];
    if(addBtn != undefined) {
        addBtn.addEventListener('click', async function(e){
            let book_name = document.getElementById('book_name').value;
            let quote_type = document.querySelector('[name="quote_type"]:checked').value;
            let quote_text = document.getElementById('quote_text').value;
            let base64_audio = sessionStorage.getItem('temp_audio_as_base64');

            if(book_name && quote_type && (quote_text || base64_audio)) {
                let added = addQuote(db.result, book_name, quote_type, quote_text, base64_audio);
                let quotes = await getQuotes.getAll(db.result);
                previewQuotes(quotes);
                document.getElementsByClassName('add-quote-layout')[0].style.display = "none";
                document.getElementById('book_name').value = null;
                document.getElementById('quote_text').value = null;
                document.getElementById('text_quote_type').setAttribute('checked', 'checked');
                sessionStorage.removeItem('temp_audio_as_base64');
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
                    ${
                        (quote.quote_type == 'text')?
                        `<p>
                            <i class="fa-solid fa-quote-right" style="color: #8b8b8b"></i>
                            ${quote.quote_text} 
                            <i class="fa-solid fa-quote-left"  style="color: #8b8b8b"></i>
                        </p>` :
                        `<audio class="audio_quote" controls>
                                <source src="${quote.base64_audio}" >
                                Your browser does not support the audio tag.
                        </audio>`
                    }
               
                    <p class="book_name">${quote.book_name}</p>

                    <div class="editable-quote-item">
                        <input type="text" placeholder="إسم الكتاب" class="edit-book-name" value="${quote.book_name}" required>
                        ${
                            (quote.quote_type == "text")?
                                `<textarea placeholder="نص الاقتباس" rows="1" class="edit-quote-text" required>${quote.quote_text}</textarea>`
                                : ''
                        }

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


    // edit quote item
    let editBtn = quoteItem.getElementsByClassName('edit-btn')[0];
    if(editBtn != undefined) {
        editBtn.addEventListener('click', async function(e){
            let form = editBtn.parentElement;
            let quote_type = (form.querySelector('.edit-quote-text'))? 'text' : 'audio';
            let id = parseInt(editBtn.getAttribute('data-quoteId'));
            let book_name = form.getElementsByClassName('edit-book-name')[0].value;
            let quote_text = ( quote_type == 'text' )? form.querySelector('.edit-quote-text').value : null;

            if(book_name || (book_name && (quote_type == 'text' && quote_text)) ) {
               await editQuote(db.result, id, book_name, quote_text);
                let quotes = await getQuotes.getAll(db.result);
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
                let quotes = await getQuotes.getAll(db.result);
                previewQuotes(quotes);
            }
        });
    }
}


// register service worker
if( "serviceWorker" in navigator ) {
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('../../src/js/general/sw_cached_pages.js')
            .then(res => {
                console.info('service worker: Registered');
            })
            .catch(err => {
                console.log(err);
            });
    });
}