const FPS = 30; // ToDo: Add FPS to config menu

var mouseIsOnOptionsMenu;
var maxPupilDisplacement;
var debugEnabled = false;

// For selecting which eye to move
const eyes = {
    LEFT: true,
    RIGHT: false
}

function makeEyes() {
    const minDimension = Math.min(screen.width, screen.height);
    // console.log("screen.width : " + screen.width + ", screen.height: " + screen.height);
    
    const sizes = {
        "sclera": minDimension / 4,
        "iris": minDimension / 8,
        "pupil": minDimension / 16,
        "distanceFromCentre": screen.width / 4
    };
    maxPupilDisplacement = (sizes.sclera - sizes.iris);
    const colors = {
        "sclera": "white",
        "iris": "red",
        "pupil": "black"
    }
    
    var svg = d3.select("body").append("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("transform", "translate(" + (screen.width / 2) + "," + (screen.height / 2) + ")")


    // ToDo: Make eye class
    // Make left eye
    svg.append("circle")
        .attr("class", "leftOuter")
        .attr("r", sizes.sclera)
        .style("fill", colors.sclera)
        .attr("transform", "translate(" + -sizes.distanceFromCentre + ",0)");
    var leftInner = svg.append("g").attr("class", "leftInner");
    leftInner.append("circle")
        .attr("r", sizes.iris)
        .style("fill", colors.iris)
        .attr("transform", "translate(" + -sizes.distanceFromCentre + ",0)")
    leftInner.append("circle")
        .attr("r", sizes.pupil)
        .style("fill", colors.pupil)
        .attr("transform", "translate(" + -sizes.distanceFromCentre + ",0)")

    // Make right eye
    svg.append("circle")
        .attr("class", "rightOuter")
        .attr("r", sizes.sclera)
        .style("fill", colors.sclera)
        .attr("transform", "translate(" + sizes.distanceFromCentre + ",0)");
    var rightInner = svg.append("g").attr("class", "rightInner")
    rightInner.append("circle")
        .attr("r", sizes.iris)
        .style("fill", colors.iris)
        .attr("transform", "translate(" + sizes.distanceFromCentre + ",0)")
    rightInner.append("circle")
        .attr("r", sizes.pupil)
        .style("fill", colors.pupil)
        .attr("transform", "translate(" + sizes.distanceFromCentre + ",0)")
}

function setEyesPosition(coords, eye) {
    x = coords[0];
    y = coords[1];
    // console.log("setEyesPosition(" + x + ", " + y + ", " + (eye ? "LEFT" : "RIGHT") + ")");

    // Scale eye movement by sensitivity
    var xSensitivity = parseFloat(document.getElementById("optionsMenu_xSensitivity").value) || 1; // defaults to 1 if NaN
    var ySensitivity = parseFloat(document.getElementById("optionsMenu_ySensitivity").value) || 1;

    var coords = getPupilDisplacement(coords, maxPupilDisplacement, xSensitivity, ySensitivity);
    var transformString = "translate(" + coords[0] + "," + coords[1] + ")";

    // Allows user swap camera inputs (left/right)
    var doSwapEyes = document.getElementById('optionsMenu_doSwapEyes').checked;
    if (xor(doSwapEyes, eye) === eyes.LEFT)
        d3.select(".leftInner").transition().duration(1000 / FPS).attr("transform", transformString);
    else if (xor(doSwapEyes, eye) === eyes.RIGHT)
        d3.select(".rightInner").transition().duration(1000 / FPS).attr("transform", transformString);
}

function getPupilDisplacement(coords, maxDisplacement, xSensitivity, ySensitivity) {
    var x = coords[0] * xSensitivity;
    var y = coords[1] * ySensitivity;
    var polarDistance = Math.hypot(x, y); // Polar coordinate distance
    var theta = Math.atan2(y, x); // Polar coordinate angle
    var pupilDisplacementDistance = maxDisplacement * Math.min(1, polarDistance)
    var pupilXDisplacement = -pupilDisplacementDistance * Math.cos(theta);
    var pupilYDisplacement = pupilDisplacementDistance * Math.sin(theta);
    return [pupilXDisplacement, pupilYDisplacement];
}

function setMouseIsInOptionsMenu(value) {
    mouseIsOnOptionsMenu = value;
}

var hideOptionsMenuTimer;
function showOptionsMenu() {
    document.getElementById("optionsMenu").style.width = "17em";
    clearInterval(hideOptionsMenuTimer);
    if (!mouseIsOnOptionsMenu && !debugEnabled)
        hideOptionsMenuTimer = setTimeout(function () { document.getElementById("optionsMenu").style.width = "0px"; }, 1250)
}

function toggleDebug(value) {
    debugEnabled = value;
    var display = debugEnabled ? "inline-block" : "none";
    document.getElementById("optionsMenu_debug").style.display = display;
}

function swapEyeDebugLabels() {
    var topLabel = document.getElementById("optionsMenu_topLabel");
    var bottomLabel = document.getElementById("optionsMenu_bottomLabel");
    var temp = topLabel.innerHTML;
    topLabel.innerHTML = bottomLabel.innerHTML;
    bottomLabel.innerHTML = temp;
}

function xor(a, b) {
    return (a && !b) || (!a && b)
}

module.exports = {getPupilDisplacement};