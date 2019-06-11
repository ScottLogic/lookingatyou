/////////////////////////////////////////////
// webcam capture and sending to the server 
///////////////////////////////////////////// 
var canvases;
var videos;
var webcamCount;
window.onload = function () {

    makeEyes();
    // access webcam
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
            canvases = [document.getElementById('frame-canvas0'), document.getElementById('frame-canvas1')]
            getVideos(webcamIds);

        });
}

function processFrame() {
    for (i = 0; i < webcamCount && i < 2; i++) {
        frame = getFrame(i);
        //TO-DO: process bounding box from frame
        var boundingBox = [0, 0, 0, 0];
        var coords = calculateEyePos(boundingBox, i);
        if (i == 0 || webcamCount == 1)
            setEyesPosition(coords, eyes.LEFT);
        if (i == 1 || webcamCount == 1)
            setEyesPosition(coords, eyes.RIGHT);
    }
}

function getVideos(webcamIds) {
    videos = [];
    for (i = 0; i < 2 && i < webcamCount; i++) {
        const video = document.createElement('video');
        video.autoplay = true;
        navigator.mediaDevices.getUserMedia({ video: { deviceId: webcamIds[i] } }).then((stream) => {
            video.srcObject = stream;
            videos.push(video);
            setInterval(processFrame, 1000 / FPS);
        });
    }
}

function getFrame(i) {
    const canvas = canvases[i];
    canvas.width = videos[i].videoWidth;
    canvas.height = videos[i].videoHeight;
    canvas.getContext('2d').drawImage(videos[i], 0, 0);
    canvas.getContext('2d').rect(20, 20, 150, 100);
    const data = canvas.toDataURL("image/png")
    return data;
}

function calculateEyePos(boundingBox, i) {
    var ctx = canvases[i].getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = "10";
    ctx.strokeStyle = "red";
    ctx.rect(boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]);
    ctx.stroke();

    var x = boundingBox[0] + boundingBox[2] / 2; // Coordinates for centre of bounding box
    x = x - videos[i].videoWidth / 2; // Converts to coordinates centred around 0,0
    x = x / (videos[i].videoWidth / 2); // Converts coordinate to a coefficient between -1 and 1

    var y = boundingBox[1] + boundingBox[3] / 2;
    y = y - videos[i].videoHeight / 2;
    y = y / (videos[i].videoHeight / 2);

    return [x, y];
}