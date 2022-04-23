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


    let recordAudioBtn = document.getElementById('record-audio-btn');
    recordAudioBtn.addEventListener('click', function(e) {
        e.preventDefault();

        navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
            let mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            const TIMER_MAX = 60;
       
            let chunks = [];
            mediaRecorder.ondataavailable = function(e){
                chunks.push(e.data);
            }

            let timer = 0;
            let audioRecordingInterval = setInterval(() => {
                timer+= 0.1;
                if(timer >= TIMER_MAX) {
                    mediaRecorder.stop();
                    return;
                }

                let audioRecordingTimer = document.getElementById('seconds_timer');
                audioRecordingTimer.innerText = parseFloat(timer).toFixed(2);
            }, 100);


            let stopAudioBtn = document.getElementById('stop-audio-btn');
            stopAudioBtn.addEventListener('click', function(e) {
                mediaRecorder.stop();
            });

            
            let pauseAudioBtn = document.getElementById('pause-audio-btn');
            pauseAudioBtn.addEventListener('click', function(e) {
                mediaRecorder.pause();
            });

            
            let resumeAudioBtn = document.getElementById('resume-audio-btn');
            resumeAudioBtn.addEventListener('click', function(e) {
                mediaRecorder.resume();
                audioRecordingInterval = setInterval(() => {
                    timer+= 0.1;
                    if(timer >= TIMER_MAX) {
                        mediaRecorder.stop();
                        return;
                    }

                    let audioRecordingTimer = document.getElementById('seconds_timer');
                    audioRecordingTimer.innerText = parseFloat(timer).toFixed(2);
                }, 100);
            });

            
            mediaRecorder.onstart = function(e) {         
                recordAudioBtn.style.display = "none";
                document.getElementById('pause-audio-btn').style.display = "block";
                document.getElementById('stop-audio-btn').style.display = "block";
                document.getElementById('delete-audio-btn').style.display = "none";
                document.querySelector('.sound_waves').style.display = "block";
            }

            mediaRecorder.onstop = function(e) {
                clearInterval(audioRecordingInterval);
                const audioBlobFile = new Blob(chunks, {type: 'audio/webm'});
                const reader = new FileReader();

                reader.addEventListener('loadend', (e) => {
                    const base64 = e.target.result;
                    sessionStorage.setItem('temp_audio_as_base64', base64)
                });

                reader.readAsDataURL(audioBlobFile);

                // create preview of audio
                const url = URL.createObjectURL(audioBlobFile);
                let preview_audio = 
                        `<audio controls>
                            <source src="${url}">
                            Your browser does not support the audio tag.
                        </audio>`;
                
                document.getElementById('preview_audio_layout').innerHTML = preview_audio;
                document.getElementById('delete-audio-btn').style.display = "block";
                
                document.getElementById('record-audio-btn').style.display = "none";
                document.getElementById('pause-audio-btn').style.display = "none";
                document.getElementById('stop-audio-btn').style.display = "none";
                document.getElementById('resume-audio-btn').style.display = "none";
                document.querySelector('.sound_waves').style.display = "none";
            }

            mediaRecorder.onpause = function(e) {
                clearInterval(audioRecordingInterval);
                document.getElementById('record-audio-btn').style.display = "none";
                document.getElementById('pause-audio-btn').style.display = "none";
                document.getElementById('stop-audio-btn').style.display = "block";
                document.getElementById('resume-audio-btn').style.display = "block";
                document.querySelector('.sound_waves').style.display = "none";
            }

            mediaRecorder.onresume = function(e) {         
                document.getElementById('record-audio-btn').style.display = "none";
                document.getElementById('pause-audio-btn').style.display = "block";
                document.getElementById('stop-audio-btn').style.display = "block";
                document.getElementById('resume-audio-btn').style.display = "none";
                document.querySelector('.sound_waves').style.display = "block";
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
