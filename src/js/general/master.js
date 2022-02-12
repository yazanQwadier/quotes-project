module.exports = (() => {
    let btn = document.getElementsByClassName('toggle-addNewQuote-btn')[0];
    btn.addEventListener('click', function(){
        document.getElementsByClassName('add-quote-layout')[0].style.display = "block";
    });

    let closeBtn = document.getElementsByClassName('close-addQuoteLayout-btn')[0];
    closeBtn.addEventListener('click', function(){
        document.getElementsByClassName('add-quote-layout')[0].style.display = "none";
    });

})()
