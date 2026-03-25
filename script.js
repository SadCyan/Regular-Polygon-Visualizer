let arr = [];
//set up sliders
var radiusLen = document.getElementById("radiusLen"),
    radiusDisplay = document.getElementById("radiusDisplay");

var vertexCount = document.getElementById("vertexCount"),
    vertexDisplay = document.getElementById("vertexDisplay");
//set up canvas layers
const canvasContainer = document.getElementById("mainDiv"),
    canvasLeft = canvasContainer.offsetLeft + canvasContainer.clientLeft,
    canvasTop = canvasContainer.offsetTop + canvasContainer.clientTop;

const canvasPoly = document.getElementById("polygonCanvas"),
    canvasCenterX = (canvasPoly.scrollWidth / 2),
    canvasCenterY = (canvasPoly.scrollHeight / 2),
    ctx = canvasPoly.getContext("2d");

const canvasBg = document.getElementById("backgroundCanvas"),
    ctxBg = canvasBg.getContext("2d");

const canvasPointer = document.getElementById("pointerCanvas"),
    ctxPointer = canvasPointer.getContext("2d");

function initialize() {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvasPoly.clientWidth;
    const displayHeight = canvasPoly.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvasPoly.width  !== displayWidth ||
                        canvasPoly.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvasPoly.width  = displayWidth;
        canvasPoly.height = displayHeight;
        canvasBg.width  = displayWidth;
        canvasBg.height = displayHeight;
        canvasPointer.width  = displayWidth;
        canvasPointer.height = displayHeight;
    }
    //draw initial guide circle
    drawBgCircle();

    radiusDisplay.innerHTML = (radiusLen.value/100).toFixed(2); // Display the default slider value
    vertexDisplay.innerHTML = vertexCount.value; // Display the default slider value
    //draw initial polygon
    createPolygon(vertexCount.value);
    drawPolygon(arr);
    listVertices();
}

// Update the 'vertices' slider value, completely changing the polygon shape
vertexCount.oninput = function() {
    vertexDisplay.innerHTML = this.value;
    createPolygon(this.value);
    drawPolygon(arr);
    listVertices();
} 

// Update the 'scale' slider value, redraws the guide circle and polygon to fit the new scale
radiusLen.oninput = function() {
    radiusDisplay.innerHTML = (this.value/100).toFixed(2);
    cleanCanvas(ctxBg);
    drawBgCircle();
    cleanCanvas(ctx);
    createPolygon(vertexCount.value);
    drawPolygon(arr);
    listVertices();
} 

//cleans the canvas context that is passed into this function
function cleanCanvas(canv) {
    canv.clearRect(0,0,canvasPoly.scrollWidth,canvasPoly.scrollHeight);
}

//draws the guide circle, redraw on scaling changes
function drawBgCircle() {
    ctxBg.fillStyle = "#2f2f2d";
    ctxBg.fillRect(0,0,canvasBg.scrollWidth,canvasBg.scrollHeight);

    ctxBg.beginPath();
    ctxBg.arc(canvasCenterX, canvasCenterY, radiusLen.value*3, 0, 2*Math.PI);
    ctxBg.stroke();
}

//function unfinished at the moment, will allow for user defined vertices to be added
canvasPoly.addEventListener("click", function (event) {
    if (vertexCount.value == vertexCount.max) {
        alert("Vertex Maximum Reached.");
    } else {
        var mouseX = event.pageX - canvasLeft;
            mouseY = event.pageY - canvasTop;

        var [x, y] = findClosestCirclePoint(mouseX, mouseY);



    }
});

//creates a mouse tracking point that is contained to the guide circle
canvasPointer.addEventListener("mousemove", function (event) {
    var mouseX = event.pageX - canvasLeft;
        mouseY = event.pageY - canvasTop;

    const [rayX, rayY] = findClosestCirclePoint(mouseX, mouseY);

    cleanCanvas(ctxPointer);
    ctxPointer.beginPath();
    ctxPointer.arc(rayX, rayY, 3, 0, Math.PI*2);

    ctxPointer.lineWidth = 0;
    ctxPointer.fillStyle = "#C9C9C9";
    ctxPointer.fill();
});

//takes a coordinate position in, and outputs the point on the guide circle which is along the same ray from the circle center
function findClosestCirclePoint(canvasX, canvasY) {
    //use canvas center as 0,0
    adjustedX = canvasX - canvasCenterX;
    adjustedY = canvasY - canvasCenterY;


    //find ray from center to mouse position using angle in radians
    let angle = Math.atan(Math.abs(adjustedY)/Math.abs(adjustedX)),
        rayX = Math.cos(angle) * radiusLen.value*3,
        rayY = Math.sin(angle) * radiusLen.value*3;

    if (adjustedX <= 0) {
        //both left quadrants use a negative X
        rayX = -(rayX);

        if (adjustedY < 0) {
            //bottom left quadrant
            rayY = -(rayY);
        } 
    } else {
        if (adjustedY < 0) {
            //bottom right quadrant
            rayY = -(rayY);
        }
    }

    //draw placeholder vertex along bg circle and ray intersection
    rayX += canvasCenterX;
    rayY += canvasCenterY;

    return [rayX, rayY];
}

//using an angle input, outputs a point on the guide circle
function calculatePoint(angle) {
    let angleRad = angle * Math.PI / 180
    var pointX = Math.sin(angleRad) * radiusLen.value*3,
        pointY = Math.cos(angleRad) * radiusLen.value*3;

    return [canvasCenterX+pointX, canvasCenterY+pointY];
}

//takes number of vertices as input and creates an array of coordinates for polygon vertices in order, clockwise
function createPolygon(vertices = 3) {
    cleanCanvas(ctx);
    arr = []
    
    let angle = 360 / vertices;
    point = calculatePoint(0);
    arr.push(point);
    for (let i = 1; i < vertices; i++) {
        newPoint = calculatePoint((i*angle));
        arr.push(newPoint)
    }
}

//takes vertices array and draws the polygon to the polygon canvas
function drawPolygon(pointList) {
    cleanCanvas(ctx);
    ctx.strokeStyle = "#BABABA";

    let endpoint;
    pointList.forEach(point => {
        if (!endpoint) {
            endpoint = point;
            ctx.beginPath();
            ctx.moveTo(point[0], point[1]);
        } else {
            ctx.lineTo(point[0], point[1]);
        }
    });

    ctx.lineTo(endpoint[0], endpoint[1]);
    ctx.stroke();
}

//used for debugging
function listVertices() {
    /*arr.forEach(vertex => {
        console.log(vertex);
    });*/
}

//potential future use for saving user defined vertices
function storeInLocalStorage() {
    localStorage.setItem("items", JSON.stringify(arr));
}

function getLocalStorage() {
    if (localStorage.getItem("items")) {
        arr = JSON.parse(localStorage.getItem("items"));
    }

    arr.forEach((element) => {

    });
}

getLocalStorage();
initialize();