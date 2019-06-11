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

    var webcamsProcessed = 0;
    webcamIds.forEach((webcam, i, a) => {
        const video = document.createElement('video');
        video.autoplay = true;
        navigator.mediaDevices.getUserMedia({ video: { deviceId: webcam } }).then((stream) => {
            video.height = videoHeight;
            video.width = videoWidth;
            // video.hidden = true;
            video.srcObject = stream;
            videos.push(video);
            webcamsProcessed++;
            if (webcamsProcessed == a.length)
                setInterval(processFrame, 1000 / FPS);
        });
    })
}

// Takes frame from webcam, receives bounding box, determines corresponding eye position, sets eye position
function processFrame() {
    videos.forEach((video, i, a) => {
        model.detect(video).then(predictions => {
            return predictions[0].bbox;
        }).then((boundingBox) => {
            var coords = calculateEyePos(boundingBox, i);
            if (i === 0 || webcamCount == 1)
                setEyesPosition(coords, eyes.LEFT);
            if (i === 1 || webcamCount == 1)
                setEyesPosition(coords, eyes.RIGHT);
            var ctx = canvases[i].getContext('2d');
            ctx.drawImage(video, 0, 0, canvases[i].width, canvases[i].height);
            var ratio = { width: canvases[i].width / videoWidth, height: canvases[i].height / videoHeight };
            drawBoundingBox(ctx, boundingBox, ratio);
        });
    })
}

function drawBoundingBox(ctx, boundingBox, ratio) {
    ctx.beginPath();
    ctx.lineWidth = "10";
    ctx.strokeStyle = "red";
    console.log(boundingBox)
    ctx.rect(boundingBox[0] * ratio.width, boundingBox[1] * ratio.height, boundingBox[2] * ratio.width, boundingBox[3] * ratio.height);
    ctx.stroke();
}

// Calculates the corresponding eye position for boundingBox from webcam i
function calculateEyePos(boundingBox, i) {

    var x = boundingBox[0] + boundingBox[2] / 2; // Coordinates for centre of bounding box
    x = x - videoWidth / 2; // Converts to coordinates centred around 0,0
    x = x / (videoWidth / 2); // Converts coordinate to a coefficient between -1 and 1

    var y = boundingBox[1] + boundingBox[3] / 2;
    y = y - videoHeight / 2;
    y = y / videoHeight / 2;

    return [x, y];
}