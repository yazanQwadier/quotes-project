module.exports = (() => {
    let btn = document.getElementsByClassName('toggle-addNewQuote-btn')[0];
    btn.addEventListener('click', function(){
        document.getElementsByClassName('add-quote-layout')[0].style.display = "block";
    });

    let closeBtn = document.getElementsByClassName('close-addQuoteLayout-btn')[0];
    closeBtn.addEventListener('click', function(){
        document.getElementsByClassName('add-quote-layout')[0].style.display = "none";
    });

    const bookNameElm = document.getElementById('book_name');
    bookNameElm.addEventListener('input', function(e){
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${e.target.value}`)
            .then((res) => res.json())
            .then((res) => {
                let suggestedBooksNamesElm = document.getElementById('suggested-books-names');

                if(res.items) {
                    let items = '';
                    res.items.forEach((item) => {
                        let title = item.volumeInfo.title.slice(0, 60);
                        title+= (item.volumeInfo.title.length > 60)? ' ...' : '';

                        let author = (item.volumeInfo.authors?.length > 0)? ' - ' + item.volumeInfo.authors[0] : null;
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
                 
                }
                else {
                    suggestedBooksNamesElm.style.display = 'none';
                }
            });
    });

})()
