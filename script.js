let arr = [];

var radiusLen = document.getElementById("radiusLen"),
    radiusDisplay = document.getElementById("radiusDisplay");

var vertexCount = document.getElementById("vertexCount"),
    vertexDisplay = document.getElementById("vertexDisplay");

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

    drawBgCircle();

    radiusDisplay.innerHTML = (radiusLen.value/100).toFixed(2); // Display the default slider value
    vertexDisplay.innerHTML = vertexCount.value; // Display the default slider value
    
    createPolygon(vertexCount.value);
    drawPolygon(arr);
    listVertices();
}

// Update the current slider value (each time you drag the slider handle)
vertexCount.oninput = function() {
    vertexDisplay.innerHTML = this.value;
    createPolygon(this.value);
    drawPolygon(arr);
    listVertices();
} 

// Update the current slider value (each time you drag the slider handle)
radiusLen.oninput = function() {
    radiusDisplay.innerHTML = (this.value/100).toFixed(2);
    cleanCanvas(ctxBg);
    drawBgCircle();
    cleanCanvas(ctx);
    createPolygon(vertexCount.value);
    drawPolygon(arr);
    listVertices();
} 

function cleanCanvas(canv) {
    canv.clearRect(0,0,canvasPoly.scrollWidth,canvasPoly.scrollHeight);
}

function drawBgCircle() {
    ctxBg.fillStyle = "#2f2f2d";
    ctxBg.fillRect(0,0,canvasBg.scrollWidth,canvasBg.scrollHeight);

    ctxBg.beginPath();
    ctxBg.arc(canvasCenterX, canvasCenterY, radiusLen.value*3, 0, 2*Math.PI);
    ctxBg.stroke();
}

canvasPoly.addEventListener("click", function (event) {
    if (vertexCount.value == vertexCount.max) {
        alert("Vertex Maximum Reached.");
    } else {
        var mouseX = event.pageX - canvasLeft;
            mouseY = event.pageY - canvasTop;

        var [x, y] = findClosestCirclePoint(mouseX, mouseY);

        

    }
});

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

function calculatePoint(angle) {
    let angleRad = angle * Math.PI / 180
    var pointX = Math.sin(angleRad) * radiusLen.value*3,
        pointY = Math.cos(angleRad) * radiusLen.value*3;

    return [canvasCenterX+pointX, canvasCenterY+pointY];
}

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

function listVertices() {
    /*arr.forEach(vertex => {
        console.log(vertex);
    });*/
}


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