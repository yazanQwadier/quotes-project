module.exports = (() => {
    const toggleAddQuoteFormBtn = document.querySelector('.toggle-addNewQuote-btn');
    toggleAddQuoteFormBtn.addEventListener('click', function(){
        document.querySelector('.add-quote-layout').style.display = "block";
    });

    const closeAddQuoteFormBtn = document.querySelector('.close-addQuoteLayout-btn');
    closeAddQuoteFormBtn.addEventListener('click', function(){
        document.querySelector('.add-quote-layout').style.display = "none";
    });

    // Get Suggested Book Names From Api
    const bookNameElm = document.getElementById('book_name');
    bookNameElm.addEventListener('input', function(e){
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${e.target.value}`)
            .then((res) => res.json())
            .then((res) => {
                let suggestedBooksNamesElm = document.getElementById('suggested-books-names');

                if(res.items) {
                    let items = '';
                    items+= `<button id="close-suggested-btn">إغلاق</button>`;

                    res.items.forEach((item) => {
                        let title = item.volumeInfo.title.slice(0, 60);
                        title+= (item.volumeInfo.title.length > 60)? ' ...' : '';
                        const author = (item.volumeInfo.authors?.length > 0)? ' - ' + item.volumeInfo.authors[0] : null;

                        items+= `<div class='suggested-book-item'>                        
                                    <span class="suggested-title">${title}</span>
                                    ${ (author)? `<small>${author}</small>` : '' }
                                </div>`;
                    });

                    suggestedBooksNamesElm.style.display = 'block';
                    suggestedBooksNamesElm.innerHTML = items;

                    const bookNameItemElm = document.querySelectorAll('.suggested-book-item');
                    bookNameItemElm.forEach((bookNameItem) => {
                        bookNameItem.addEventListener('click', function() {
                            bookNameElm.value = this.querySelector('.suggested-title').innerText;
                            suggestedBooksNamesElm.style.display = "none";
                        });
                    });

                    document.getElementById('close-suggested-btn').addEventListener('click', function(){
                        document.getElementById('suggested-books-names').style.display = "none";
                    });
                }
                else {
                    suggestedBooksNamesElm.style.display = 'none';
                }
            });
    });


    let quoteTypeItemElms = document.querySelectorAll('.quote_type_item');
    quoteTypeItemElms.forEach((item) => {
        item.addEventListener('click', function(e) {
            document.querySelector('.active_quote_type_item').classList.remove('active_quote_type_item');
            item.classList.add('active_quote_type_item');
        });
    });


    let quoteTypeInputslms = document.querySelectorAll('[name="quote_type"]');
    quoteTypeInputslms.forEach((inputItem) => {
        inputItem.addEventListener('change', function(e) {
            if(e.target.value == "text") {
                document.getElementById('quote_text_layout').style.display = "block";
                document.getElementById('quote_audio_layout').style.display = "none";
            }
            else {
                document.getElementById('quote_text_layout').style.display = "none";
                document.getElementById('quote_audio_layout').style.display = "block";
            }
        });
    });
    

    let deleteAudioBtn = document.getElementById('delete-audio-btn');
    deleteAudioBtn.addEventListener('click', function(e) {
        sessionStorage.removeItem('temp_audio_as_base64');
        document.getElementById('seconds_timer').innerText = "0.00";
        document.getElementById('preview_audio_layout').innerHTML = "";
        deleteAudioBtn.style.display = "none";
        document.getElementById('record-audio-btn').style.display = "block";
    });
    
})()
// 203