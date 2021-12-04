
document.querySelector(".totem").onclick = () => {
    const player = document.getElementById('player');

    const handleSuccess = function(stream) {
        if (window.URL) {
            player.srcObject = stream;
        } else {
            player.src = stream;
        }
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        mediaRecorder.ondataavailable = data => {
            chunks.push(data.data);
        }
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            const reader = new window.FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const audio = document.createElement('audio');
                audio.src = reader.result;
                console.log(reader.result);
                audio.controls = true;
                document.querySelector('body').appendChild(audio);
                axios.post('http://localhost:3001/api/postAudio', {
                    data: reader.result
                  })
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        }
        mediaRecorder.start()
        setTimeout(() => {
            mediaRecorder.stop();
        }, 3000)
        handleSuccess(stream);
    });
}

