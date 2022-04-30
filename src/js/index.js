import '../sass/index.sass';
import db from './db/connectDB';
import addQuote from './quotes/add';
import editQuote from './quotes/edit';
import deleteQuote from './quotes/delete';
import getQuotes from './quotes/get';
import "./general/master";
import "./general/audio";
import '/node_modules/@fortawesome/fontawesome-free/js/all.min.js';

db.onsuccess = async function() {
    // Show All Quotes
    let quotes = await getQuotes.getAll(db.result);
    previewQuotes(quotes);


    // Add New Quote
    let addQuoteBtn = document.querySelector('.add-quote-btn');
    if(addQuoteBtn) {
        addQuoteBtn.addEventListener('click', async function(e){
            const book_name = document.getElementById('book_name').value;
            const quote_type = document.querySelector('[name="quote_type"]:checked').value;
            const quote_text = document.getElementById('quote_text').value;
            const base64_audio = sessionStorage.getItem('temp_audio_as_base64');

            if( validateAddQuoteForm() ) {
                addQuote(db.result, book_name, quote_type, quote_text, base64_audio);
                let quotes = await getQuotes.getAll(db.result);
                previewQuotes(quotes);
                clearAddQuoteForm();
            }
        });
    }
}


function validateAddQuoteForm() {
    const book_name = document.getElementById('book_name').value;
    const quote_type = document.querySelector('[name="quote_type"]:checked').value;
    const quote_text = document.getElementById('quote_text').value;
    const base64_audio = sessionStorage.getItem('temp_audio_as_base64');
    document.querySelectorAll('.invalid-field').forEach((invalidField) => invalidField.classList.remove('invalid-field'));

    let errorMsgs = "";
    if(!book_name) {
        document.getElementById('book_name').classList.add('invalid-field');
        errorMsgs+= "يجب إدخال إسم الكتاب ! <br>";
    }
    if(quote_type == "text") {
        if(!quote_text) {
            document.getElementById('quote_text').classList.add('invalid-field');
            errorMsgs+= "يجب إدخال نص الاقتباس ! <br>";
        }
    }
    else if(quote_type == "audio") {
        if(!base64_audio) {
            errorMsgs+= "يجب تسجيل الاقتباس صوتياً ! <br>";
        }
    }

    document.querySelector('.error-messages').innerHTML = errorMsgs;
    return (errorMsgs == "");
}


function clearAddQuoteForm() {
    document.querySelector('.add-quote-layout').style.display = "none";
    document.getElementById('book_name').value = null;
    document.getElementById('quote_text').value = null;
    document.getElementById('text_quote_type').checked = true;
    document.getElementById('audio_quote_type').checked = false;
    document.querySelector('.text_quote_item').classList.add('active_quote_type_item');
    document.querySelector('.audio_quote_item').classList.remove('active_quote_type_item');
    document.getElementById('quote_text_layout').style.display = "block";
    document.getElementById('quote_audio_layout').style.display = "none";
    sessionStorage.removeItem('temp_audio_as_base64');
    document.getElementById('preview_audio_layout').innerHTML = "";
    document.getElementById('delete-audio-btn').style.display = "none";
    document.getElementById('record-audio-btn').style.display = "block";
    document.getElementById('seconds_timer').innerText = "0.0";
}

function previewQuotes(quotes){
    let list = "";
    if( quotes.length > 0 ){
        quotes.map((quote) => {
            const created_at = new Date(quote.created_at).toLocaleDateString('ar');
            
            list+= `
                <div class="${(quotes.length > 1)? 'quote-with-line' : ''}">
                    <div class="quote-item">
                        <div class="quote-item-content">
                            <div style="width: 85%;">
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
                            </div>

                            <div class="quote-date">
                                ${created_at} 
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                        </div>

                        <div class="editable-quote-item">
                            <input type="text" placeholder="إسم الكتاب" class="edit-book-name" value="${quote.book_name}" required>
                            ${
                                (quote.quote_type == "text")?
                                    `<textarea placeholder="نص الاقتباس" rows="1" class="edit-quote-text" required>${quote.quote_text}</textarea>`
                                    : ''
                            }

                            <button class="edit-btn" title="تعديل" data-quoteId="${quote.id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" title="حذف" data-quoteId="${quote.id}"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    else {
        list = `<div class="no-quotes-yet">
                    <img src="/assets/books.png" />
                    <p>لا يوجد اقتباسات بعد ... </p>
                </div>`;
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
    // Show Edit Form
    quoteItem.addEventListener('dblclick', function(e) {
        quoteItem.querySelector('.editable-quote-item').style.display = "flex";
    });


    // Edit Quote Item
    let editQuoteBtn = quoteItem.querySelector('.edit-btn');
    if(editQuoteBtn) {
        editQuoteBtn.addEventListener('click', async function(e){
            let form = editQuoteBtn.parentElement;
            let id = parseInt(editQuoteBtn.getAttribute('data-quoteId'));
            let quote_type = (form.querySelector('.edit-quote-text'))? 'text' : 'audio';
            let book_name = form.querySelector('.edit-book-name').value;
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

    // Delete Quote Item
    let deleteQuoteBtn = quoteItem.getElementsByClassName('delete-btn')[0];
    if(deleteQuoteBtn) {
        deleteQuoteBtn.addEventListener('click', async function(e){
            let id = parseInt(deleteQuoteBtn.getAttribute('data-quoteId'));
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
        navigator.serviceWorker.register('/sw_cached_pages.js')
            .then(res => {
                // console.info('service worker: Registered');
            })
            .catch(err => {
                console.log(err);
            });
    });
}