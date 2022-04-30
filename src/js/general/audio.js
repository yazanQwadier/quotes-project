module.exports = (() => {
    const TIMER_MAX = 60;   // seconds
    const TIMER_STEP = 100; // milliseconds
    let state = {
        timer: 0,
        mediaRecorder: null,
        audioRecordingInterval: null,
    };

    // When Click On Record Button, Open Audio Session
    const recordAudioBtn = document.getElementById('record-audio-btn');
    recordAudioBtn.addEventListener('click', function(e) {
        e.preventDefault();

        navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream) => {
                state.mediaRecorder = new MediaRecorder(stream);
                state.mediaRecorder.start();
        
                let chunks = [];
                state.mediaRecorder.ondataavailable = function(e){
                    chunks.push(e.data);
                }
                
                state.mediaRecorder.onstart = function(e) {     
                    state.audioRecordingInterval = setInterval(timerStep, TIMER_STEP);    
                    document.querySelector('.sound_waves').style.display = "block";
                    hideAudioBtns(['record', 'delete']);
                    showAudioBtns(['pause', 'stop']);
                }

                state.mediaRecorder.onstop = function(e) {
                    clearInterval(state.audioRecordingInterval);
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
                                Your browser does not support the audio tag !
                            </audio>`;
                    
                    document.getElementById('preview_audio_layout').innerHTML = preview_audio;                    
                    hideAudioBtns(['record', 'pause', 'stop', 'resume']);
                    showAudioBtns(['delete']);
                    document.querySelector('.sound_waves').style.display = "none";
                }

                state.mediaRecorder.onpause = function(e) {
                    clearInterval(state.audioRecordingInterval);
                    hideAudioBtns(['record', 'pause']);
                    showAudioBtns(['stop', 'resume']);
                    document.querySelector('.sound_waves').style.display = "none";
                }

                state.mediaRecorder.onresume = function(e) {
                    hideAudioBtns(['record', 'resume']);
                    showAudioBtns(['pause', 'stop']);
                    document.querySelector('.sound_waves').style.display = "block";
                }
            });
    });

    const stopAudioBtn = document.getElementById('stop-audio-btn');
    stopAudioBtn.addEventListener('click', function(e) {
        state.mediaRecorder.stop();
    });
    
    const pauseAudioBtn = document.getElementById('pause-audio-btn');
    pauseAudioBtn.addEventListener('click', function(e) {
        state.mediaRecorder.pause();
    });

    const resumeAudioBtn = document.getElementById('resume-audio-btn');
    resumeAudioBtn.addEventListener('click', function(e) {
        state.mediaRecorder.resume();
        state.audioRecordingInterval = setInterval(timerStep, TIMER_STEP);
    });


    function timerStep() {
        state.timer+= TIMER_STEP / 1000;
        if(state.timer >= TIMER_MAX) {
            state.mediaRecorder.stop();
            return;
        }

        let audioRecordingTimer = document.getElementById('seconds_timer');
        audioRecordingTimer.innerText = parseFloat(state.timer).toFixed(2);
    }

    function hideAudioBtns(keys) {
        keys.map((key) => document.getElementById(`${key}-audio-btn`).style.display = "none");
    } 

    function showAudioBtns(keys) {
        keys.map((key) => document.getElementById(`${key}-audio-btn`).style.display = "block");
    } 
})()