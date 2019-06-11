/////////////////////////////////////////////
// webcam capture and sending to the server 
///////////////////////////////////////////// 
var canvases;
var videos;
var webcamCount;
var model;
const videoWidth = 640;
const videoHeight = 480;

window.onload = function () {

    makeEyes();
    // Access webcams then set them up
    navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            return devices
                .filter((device) => { return device.kind === 'videoinput'; })
                .map((device) => { return device.deviceId; });
        })
        .then((webcamIds) => {

            webcamCount = webcamIds.length;

            if (webcamCount < 2) {
                document.getElementById("debug-bottom").style.display = "none";
                document.getElementById("toplabel").innerHTML = "Camera";
            }

            if (webcamCount == 0) {
                window.alert("No webcams detected. Please connect a webcam and refresh.");
                return;
            }

            cocoSsd.load().then(loadModel => { model = loadModel; })

            canvases = [document.getElementById('frame-canvas0'), document.getElementById('frame-canvas1')]
            setupWebcams(webcamIds);
        });
}

// Sets interval function for each webcam, based on FPS
function setupWebcams(webcamIds) {
    videos = [];
    for (i = 0; i < 2 && i < webcamCount; i++) {
        let video = document.createElement('video');
        video.autoplay = true;
        navigator.mediaDevices.getUserMedia({ video: { deviceId: webcamIds[i] } }).then((stream) => {
            video.height = videoHeight;
            video.width = videoWidth;
            video.srcObject = stream;
            videos.push(video);
            setInterval(processFrame, 1000 / FPS);
        });
    }
}

// Takes frame from webcam, receives bounding box, determines corresponding eye position, sets eye position
function processFrame() {
    for (i = 0; i < webcamCount && i < 2; i++) {
        // Detecting objects
        var boundingBox = [0, 0, 0, 0];
        model.detect(videos[i]).then(predictions => {
            return predictions[0].bbox;
        }).then((boundingBox) => {
            var coords = calculateEyePos(boundingBox, i);
            if (i == 0 || webcamCount == 1)
                setEyesPosition(coords, eyes.LEFT);
            if (i == 1 || webcamCount == 1)
                setEyesPosition(coords, eyes.RIGHT);
        });

    }
}

// Returns single frame from the ith webcam
function getFrame(i) {
    const canvas = canvases[i];
    canvas.width = videos[i].videoWidth;
    canvas.height = videos[i].videoHeight;
    canvas.getContext('2d').drawImage(videos[i], 0, 0);
    canvas.getContext('2d').rect(20, 20, 150, 100);
    const data = canvas.toDataURL("image/png")
    return data;
}

// Calculates the corresponding eye position for boundingBox from webcam i
function calculateEyePos(boundingBox, i) {

    // Draws bounding box on corresponding canvas
    var ctx = canvases[i].getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = "10";
    ctx.strokeStyle = "red";
    console.log(boundingBox)
    ctx.rect(boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]);
    ctx.stroke();

    var x = boundingBox[0] + boundingBox[2] / 2; // Coordinates for centre of bounding box
    x = x - videoWidth / 2; // Converts to coordinates centred around 0,0
    x = x / (videoWidth / 2); // Converts coordinate to a coefficient between -1 and 1

    var y = boundingBox[1] + boundingBox[3] / 2;
    y = y - videoHeight / 2;
    y = y / videoHeight / 2;

    return [x, y];
}