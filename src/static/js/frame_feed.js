///////////////////////////////////////////////
// Webcam capture and coordinate translations 
///////////////////////////////////////////////
var canvases;
var webcamCount;
var model;

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

            if (webcamCount == 0) {
                window.alert("No webcams detected. Please connect a webcam and refresh.");
                return;
            }

            if (webcamCount < 2) {
                document.getElementById("optionsMenu_debugBottom").style.display = "none";
                document.getElementById("optionsMenu_topLabel").innerHTML = "Camera";
                document.getElementById("options_menu_swapEyesDiv").style.display = "none";
            }

            // ToDo: Extract into detection class
            // Load Model for object detection
            cocoSsd.load().then(loadModel => { model = loadModel; })

            canvases = [document.getElementById('optionsMenu_frameCanvas0'), document.getElementById('optionsMenu_frameCanvas1')]
            setupWebcams(webcamIds);
        });
}



// Sets interval function for each webcam, based on FPS
function setupWebcams(webcamIds) {
    webcamIds.forEach((webcam, webcamIndex, a) => {
        navigator.mediaDevices.getUserMedia({ video: { deviceId: webcam } }).then((stream) => {
            let video = document.createElement('video');
            video.autoplay = true;
            video.srcObject = stream;
            var streamSettings = stream.getVideoTracks()[0].getSettings();
            video.height = streamSettings.height;
            video.width = streamSettings.width;
            var eye = (webcamIndex == 0 || webcamCount == 1) ? eyes.LEFT : eyes.RIGHT;
            setInterval(function () { processFrame(video, canvases[webcamIndex], eye) }, 1000 / FPS);
        });
    })
}

// Takes frame from webcam, receives bounding box, determines corresponding eye position, sets eye position
function processFrame(video, canvas, eye) {
    // ToDo: Extract into detection class
    model.detect(video).then(detections => {
        var boundingBox = getTrackingTarget(detections);
        if (boundingBox !== null) {
            setEyesPosition(getNormalisedCentrePointOf(boundingBox, video), eye);
            if (webcamCount == 1)
                setEyesPosition(getNormalisedCentrePointOf(boundingBox, video), !eye);
        }
        if (debugEnabled)
            updateCanvas(video, canvas, boundingBox);
    })
}

// ToDo: Extract into detection class
function getTrackingTarget(detections) {
    detection =  detections.find(detection => {
            return detection.class === "person";
        });
    return detection !== undefined ? detection.bbox : null;
}

function updateCanvas(video, canvas, boundingBox) {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (boundingBox !== null)
    {
        var ratio = { width: canvas.width / video.width, height: canvas.height / video.height };
        drawBoundingBox(ctx, boundingBox, ratio);
    }
        
}

function drawBoundingBox(ctx, boundingBox, ratio) {
    ctx.beginPath();
    ctx.lineWidth = "10";
    ctx.strokeStyle = "red";
    ctx.rect(boundingBox[0] * ratio.width, boundingBox[1] * ratio.height, boundingBox[2] * ratio.width, boundingBox[3] * ratio.height);
    ctx.stroke();
}

// Calculates the corresponding eye position for boundingBox from webcam index
function getNormalisedCentrePointOf(boundingBox, video) {
    var x = boundingBox[0] + boundingBox[2] / 2; // Coordinates for centre of bounding box
    x = x - (video.width / 2); // Converts to coordinates centred around 0,0
    x = x / (video.width / 2); // Converts coordinate to a coefficient between -1 and 1

    var y = boundingBox[1] + boundingBox[3] / 2;
    y = y - (video.height / 2);
    y = y / (video.height / 2);

    return [x, y];
}

module.exports =  {getNormalisedCentrePointOf, getTrackingTarget};
