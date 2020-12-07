URL = window.URL || window.webkitURL;

const recordButton = document.getElementById("record");
const pauseButton = document.getElementById("pause");
const stopButton = document.getElementById("stop");

recordButton.addEventListener("click", start);

const audioChunks = [];
const audio = document.getElementById("audio");

// Starting...
function start(e){
  e.preventDefault();
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      console.log(mediaRecorder.state)

      // pause & resume
      pauseButton.onclick = function(e){
        e.preventDefault();
        if (mediaRecorder.state === "recording"){
          mediaRecorder.pause();
          pauseButton.innerHTML="Resume";
          console.log(mediaRecorder.state)
        } else if (mediaRecorder.state === "paused"){
          mediaRecorder.resume()
          pauseButton.innerHTML="Pause";
          console.log(mediaRecorder.state)
        }
      }

      // stop button
      stopButton.onclick = function(e){
        e.preventDefault();
        mediaRecorder.stop()
        console.log(mediaRecorder.state)

        // upload button
        let uploadButton = document.createElement("BUTTON");
        uploadButton.innerHTML = "UPLOAD";
        document.body.appendChild(uploadButton);

        mediaRecorder.ondataavailable = function(e){
          audioChunks.push(e.data);
          if (mediaRecorder.state == "inactive"){
            let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
            audio.src = URL.createObjectURL(blob);
            audio.controls=true;
            audio.autoplay=true;
            sendData(blob);
          }
        }
        function sendData(data) {}
      }


    }).catch(err => console.log('Something\'s wrong, I can feel it'))
}
