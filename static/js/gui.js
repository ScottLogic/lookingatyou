
const FPS = 30;
var max_pupil_displacement;

function makeEyes() {
    const screenwidth = screen.width, screenheight = screen.height;
    const min_dimension = Math.min(screenwidth, screenheight);
    console.log("screenwidth : " + screenwidth + ", screenheight: " + screenheight);
    
    const sizes = {
        "sclera": min_dimension / 4,
        "iris": min_dimension / 8,
        "pupil": min_dimension / 16,
        "distance_from_centre": screenwidth / 4
    };
    max_pupil_displacement = (sizes.sclera - sizes.iris);

    const colors = {
        "sclera": "white",
        "iris": "red",
        "pupil": "black"
    }
    
    var svg = d3.select("body").append("svg")
        .attr("width", screenwidth)
        .attr("height", screenheight)
        .append("g")
        .attr("transform", "translate(" + (screenwidth / 2) + "," + (screenheight / 2) + ")")

    // Make left eye
    svg.append("circle")
        .attr("class", "left_outer")
        .attr("r", sizes.sclera)
        .style("fill", colors.sclera)
        .attr("transform", "translate(" + -sizes.distance_from_centre + ",0)");
    var left_inner = svg.append("g").attr("class", "left_inner");
    left_inner.append("circle")
        .attr("r", sizes.iris)
        .style("fill", colors.iris)
        .attr("transform", "translate(" + -sizes.distance_from_centre + ",0)")
    left_inner.append("circle")
        .attr("r", sizes.pupil)
        .style("fill", colors.pupil)
        .attr("transform", "translate(" + -sizes.distance_from_centre + ",0)")

    // Make right eye
    svg.append("circle")
        .attr("class", "right_outer")
        .attr("r", sizes.sclera)
        .style("fill", colors.sclera)
        .attr("transform", "translate(" + sizes.distance_from_centre + ",0)");
    var right_inner = svg.append("g").attr("class", "right_inner")
    right_inner.append("circle")
        .attr("r", sizes.iris)
        .style("fill", colors.iris)
        .attr("transform", "translate(" + sizes.distance_from_centre + ",0)")
    right_inner.append("circle")
        .attr("r", sizes.pupil)
        .style("fill", colors.pupil)
        .attr("transform", "translate(" + sizes.distance_from_centre + ",0)")
}

// For selecting which eye to move
const eyes = {
    LEFT: true,
    RIGHT: false
}

function setEyesPosition(coords, eye) {
    x = coords[0];
    y = coords[1];
    // console.log("setEyesPosition(" + x + ", " + y + ", " + (eye ? "LEFT" : "RIGHT") + ")");
    var x_fov_bound = parseFloat(document.getElementById("x_fov_bound").value) || 1; // defaults to 1 if NaN
    var y_fov_bound = parseFloat(document.getElementById("y_fov_bound").value) || 1;
    x = x / x_fov_bound; // scales coordinate by sensitivity
    y = y / y_fov_bound;
    var d_ = Math.hypot(x, y); // Polar coordinate distance
    var theta = Math.atan2(y, x); // Polar coordinate angle
    var pupil_displacement_distance = max_pupil_displacement * Math.min(1, d_)
    var pupil_x_displacement = -pupil_displacement_distance * Math.cos(theta);
    var pupil_y_displacement = pupil_displacement_distance * Math.sin(theta);
    var doSwapEyes = document.getElementById('doSwapEyes').checked;
    if (xor(doSwapEyes, eye) === eyes.LEFT)
        d3.select(".left_inner").transition().duration(1000 / FPS).attr("transform", "translate(" + pupil_x_displacement + "," + pupil_y_displacement + ")");
    else if (xor(doSwapEyes, eye) === eyes.RIGHT)
        d3.select(".right_inner").transition().duration(1000 / FPS).attr("transform", "translate(" + pupil_x_displacement + "," + pupil_y_displacement + ")");
}

var mouseIsOnOptionsMenu;
function setMouseIsInOptionsMenu(val) {
    mouseIsOnOptionsMenu = val;
}

var hideOptionsMenuTimer;
function showOptionsMenu() {
    document.getElementById("optionsmenu").style.width = "350px";
    clearInterval(hideOptionsMenuTimer);
    if (!mouseIsOnOptionsMenu)
        hideOptionsMenuTimer = setTimeout(function () { document.getElementById("optionsmenu").style.width = "0px"; }, 1250)
}

var debugModeOn = false;
function toggleDebug(val) {
    debugModeOn = val;
    var display = debugModeOn ? "inline-block" : "none";
    document.getElementById("debug").style.display = display;
}

function swapEyeDebugLabels() {
    var topLabel = document.getElementById("toplabel");
    var bottomLabel = document.getElementById("bottomlabel");
    var temp = topLabel.innerHTML;
    topLabel.innerHTML = bottomLabel.innerHTML;
    bottomLabel.innerHTML = temp;
}

function xor(a, b) {
    return (a && !b) || (!a && b)
}