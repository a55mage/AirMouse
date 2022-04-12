const videoElement = document.getElementById('bg-video');
const canvasElement = document.getElementById('mouse-canvas');
const canvasCtx = canvasElement.getContext('2d');
let windowHeight = window.innerHeight
let windowWidth = window.innerWidth
let airCursor0 = {x: 0, y: 0};
let airCursor1 = {x: 0, y: 0};
canvasElement.width = windowWidth;
canvasElement.height = windowHeight;
let zMultiplier = 1
let clicking0 = false;
let clicking1 = false;
let scrolling0 = false;
let scrolling1 = false;
let distanceThresholdClick = 0.04
let distanceThresholdScroll = 0.04
let scrollAmount = 500;
let currentScrollY = 0;
let currentScrollX = 0;
let newScrollY = 0;
let newScrollX = 0;

screensaverTime = 100;
currentTimer = 0;

function handToScreenCoordinates(cursor, x, y) {
    cursor.x = x * windowWidth;
    cursor.y = y * windowHeight;
}

function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
        ctx.fillStyle = fill
        ctx.fill()
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth
        ctx.strokeStyle = stroke
        ctx.stroke()
    }
}

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    //managing input from the first (or only) hand
    if (results.multiHandLandmarks[0]) {
        //if the user is showing a hand, the screensaver timer must reset
        currentTimer = 0;
        handToScreenCoordinates(airCursor0, results.multiHandLandmarks[0][8].x, results.multiHandLandmarks[0][8].y)
        if (clicking0)
            drawCircle(canvasCtx, airCursor0.x, airCursor0.y, 20, 'yellow', 'red', 2)
        else
            drawCircle(canvasCtx, airCursor0.x, airCursor0.y, 10, 'red', 'red', 2)

        if (scrolling0)
            drawCircle(canvasCtx, airCursor0.x, airCursor0.y, 20, 'green', 'red', 2)

        //compute distance between index finger tip and thumb tip
        let distanceClick = Math.hypot(results.multiHandLandmarks[0][8].x - results.multiHandLandmarks[0][4].x,
            results.multiHandLandmarks[0][8].y - results.multiHandLandmarks[0][4].y) / zMultiplier;

        //compute distance between middle finger tip and thumb tip
        let distanceScroll = Math.hypot(results.multiHandLandmarks[0][12].x - results.multiHandLandmarks[0][4].x,
            results.multiHandLandmarks[0][12].y - results.multiHandLandmarks[0][4].y) / zMultiplier;

        //scroll logic
        if (distanceScroll < distanceThresholdScroll) {
            scrolling0 = true;
            canvasElement.style.visibility = 'hidden'
            let verticalMagnitude = (results.multiHandLandmarks[0][12].y - 0.5)
            let horizontalMagnitude = (results.multiHandLandmarks[0][12].x - 0.5)
            currentScrollY = document.documentElement.scrollTop
            currentScrollX = document.documentElement.scrollLeft

            //vertical scrolling
            if (verticalMagnitude > 0 && currentScrollY >= newScrollY) {
                newScrollY = Math.floor(currentScrollY + (scrollAmount * Math.abs(verticalMagnitude)))
                window.scrollTo(newScrollX, newScrollY);
            }
            if (verticalMagnitude < 0 && currentScrollY <= newScrollY) {
                newScrollY = Math.floor(currentScrollY - (scrollAmount * Math.abs(verticalMagnitude)));
                window.scrollTo(newScrollX, newScrollY);
            }

            //horizontal scrolling (logic is inverted for horizontal axys because the camera coordinates are flipped)
            if (horizontalMagnitude > 0 && currentScrollX <= newScrollX) {
                newScrollX = Math.floor(currentScrollX - (scrollAmount * Math.abs(horizontalMagnitude)))
                window.scrollTo(newScrollX, newScrollY);
            }
            if (horizontalMagnitude < 0 && currentScrollX >= newScrollX) {
                newScrollX = Math.floor(currentScrollX + (scrollAmount * Math.abs(horizontalMagnitude)));
                window.scrollTo(newScrollX, newScrollY);
            }
        }
        if (distanceScroll > distanceThresholdScroll) {
            scrolling0 = false;
        }
        canvasElement.style.visibility = 'visible'

        //click logic
        if (distanceClick < distanceThresholdClick && !clicking0) {
            clicking0 = true;
            canvasElement.style.visibility = 'hidden'
            //subtracting windowWidht for horizontal axys because the camera coordinates are flipped
            let elementToClick = document.elementFromPoint(windowWidth - airCursor0.x, airCursor0.y)
            //console.log(elementToClick)
            if (elementToClick) {
                elementToClick.click();
            }
        }
        if (distanceClick > distanceThresholdClick) {
            clicking0 = false;
        }
        canvasElement.style.visibility = 'visible'
    }

    //managing input from the second hand
    if (results.multiHandLandmarks[1]) {
        //if the user is showing a hand, the screensaver timer must reset
        currentTimer = 0;
        handToScreenCoordinates(airCursor1, results.multiHandLandmarks[1][8].x, results.multiHandLandmarks[1][8].y)
        if (clicking1)
            drawCircle(canvasCtx, airCursor1.x, airCursor1.y, 20, 'yellow', 'red', 2)
        else
            drawCircle(canvasCtx, airCursor1.x, airCursor1.y, 10, 'red', 'red', 2)

        if (scrolling1)
            drawCircle(canvasCtx, airCursor1.x, airCursor1.y, 20, 'green', 'red', 2)

        //compute distance between index finger tip and thumb tip
        let distanceClick = Math.hypot(results.multiHandLandmarks[1][8].x - results.multiHandLandmarks[1][4].x,
            results.multiHandLandmarks[1][8].y - results.multiHandLandmarks[1][4].y) / zMultiplier;

        //compute distance between middle finger tip and thumb tip
        let distanceScroll = Math.hypot(results.multiHandLandmarks[1][12].x - results.multiHandLandmarks[1][4].x,
            results.multiHandLandmarks[1][12].y - results.multiHandLandmarks[1][4].y) / zMultiplier;

        //scroll logic
        if (distanceScroll < distanceThresholdScroll) {
            scrolling1 = true;
            canvasElement.style.visibility = 'hidden'
            let verticalMagnitude = (results.multiHandLandmarks[1][12].y - 0.5)
            let horizontalMagnitude = (results.multiHandLandmarks[1][12].x - 0.5)
            currentScrollY = document.documentElement.scrollTop
            currentScrollX = document.documentElement.scrollLeft

            //vertical scrolling
            if (verticalMagnitude > 0 && currentScrollY >= newScrollY) {
                newScrollY = Math.floor(currentScrollY + (scrollAmount * Math.abs(verticalMagnitude)))
                window.scrollTo(newScrollX, newScrollY);
            }
            if (verticalMagnitude < 0 && currentScrollY <= newScrollY) {
                newScrollY = Math.floor(currentScrollY - (scrollAmount * Math.abs(verticalMagnitude)));
                window.scrollTo(newScrollX, newScrollY);
            }

            //horizontal scrolling (logic is inverted for horizontal axys because the camera coordinates are flipped)
            if (horizontalMagnitude > 0 && currentScrollX >= newScrollX) {
                newScrollX = Math.floor(currentScrollX + (scrollAmount * Math.abs(horizontalMagnitude)))
                window.scrollTo(newScrollX, newScrollY);
            }
            if (horizontalMagnitude < 0 && currentScrollX <= newScrollX) {
                newScrollX = Math.floor(currentScrollX - (scrollAmount * Math.abs(horizontalMagnitude)));
                window.scrollTo(newScrollX, newScrollY);
            }
        }
        if (distanceScroll > distanceThresholdScroll) {
            scrolling1 = false;
        }
        canvasElement.style.visibility = 'visible'

        //click logic
        if (distanceClick < distanceThresholdClick && !clicking1) {
            clicking1 = true;
            canvasElement.style.visibility = 'hidden'
            //subtracting windowWidht for horizontal axys because the camera coordinates are flipped
            let elementToClick = document.elementFromPoint(windowWidth - airCursor1.x, airCursor1.y)
            //console.log(elementToClick)
            if (elementToClick) {
                elementToClick.click();
            }
        }
        if (distanceClick > distanceThresholdClick) {
            clicking1 = false;
        }
        canvasElement.style.visibility = 'visible'
    }

    if (!results.multiHandLandmarks[0]) {
        canvasElement.style.visibility = 'hidden'
    }
    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();


