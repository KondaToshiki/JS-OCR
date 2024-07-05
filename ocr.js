
const canvas = document.querySelector('#canvas');
const video = document.createElement('video');
const buf = document.createElement("canvas")
document.body.append(buf)

navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment'
    },
    audio: false
})
.then(function(stream){
    video.srcObject = stream;
    video.play();
    let isRecognizing = false

    setInterval(function(){
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
        
        let box = {
            x: 50,
            h: 100
        };
        box.y = (canvas.height - box.h) / 2;
        box.w = (canvas.width - box.x * 2);

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.rect(
            box.x, box.y, box.w, box.h
        );
        ctx.stroke();

        buf.width = box.w
        buf.height = box.h
        buf.getContext("2d").drawImage(canvas, box.x,  box.y, box.w, box.h, 0, 0, box.w, box.h);


        if(isRecognizing) return;
        isRecognizing  = true
        Tesseract.recognize(
            buf,
            "eng",
            {
                logger:function(e) {
                    document.querySelector("#progress").textContent = e.status
                }
            }
        )
        .then(function(result){
            document.querySelector("#result").textContent = result.data.text;
            // writeText(result.data.text + "\n")
            isRecognizing = false
        })

    }, 500);
})
.catch(function(e){
    document.querySelector('#result').textContent = JSON.stringify(e);
});

async function connect() {
     
        try { 
            port = await navigator.serial.requestPort()
            await port.open({baudRate: 115200})
            console.log("connect")
        } catch(e) {
            console.log(e)
        }
    
    
}


function videoController(recievedValue) {
    if(recievedValue === "start") {
        video.play()
        console.log("play")
    } else if(recievedValue === "stop") {
        video.pause()
        console.log("pause")
    }
}

// async function writeText(text) {
//     const encoder = new TextEncoder()
//     const writer = port.writable.getWriter()
//     await writer.write(encoder.encode(text))
//     writer.releaseLock()
// }



// document.addEventListener("DOMContentLoaded", function() {
//     const button = document.getElementById("toggleButton")

//     let state = true;

    
//         if(value === "start") {
//             button.innerText = "pause"
//             button.onclick = function() {
//                 video.play()
//             }

//         } else if (value === "stop") {
//             button.innerText = "play"
//             button.onclick = function() {
//                 video.pause()
//             }
//         }
//         state = !state

// })
