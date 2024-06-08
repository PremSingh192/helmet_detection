// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/aMUNROmRD/";

let model, webcam, labelContainer, maxPredictions;
let refrenceId;



let stop_button = document.getElementById("stop_button");
let start_button = document.getElementById("start_button");

// Load the image model and setup the webcam
async function init() {
   

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();

    refrenceId = setInterval(async () => {
        await loop()
    }, 1000)

    stop_button.style.display = "flex";
    start_button.style.display = "none";
    // append elements to the DOM
   
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

}

function stop_model() {
    console.log("interval stopped ", refrenceId);
    clearInterval(refrenceId)
    stop_button.style.display = "none";
    start_button.style.display = "flex";
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    // window.requestAnimationFrame(loop);
}


// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);


    for (let i = 0; i < maxPredictions; i++) {
        pred_class = prediction[i].className
        pred_score = prediction[i].probability.toFixed(2)

        action(pred_class, pred_score)

        const classPrediction = pred_class + ": " + pred_score;
        console.log(classPrediction)

        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}


var audio = new Audio('alert_voice.wav');
var first_time = true;

function play() {
    console.log(audio.ended);

    if (first_time) {
        audio.play();
        first_time = false;
    }
    if (audio.ended) {
        // console.log('New Started');
        audio.play();
    }
    else {
        // console.log('Old Audio is Playing');
    }

}

function action(pred_class, pred_score) {
    if (pred_class == 'no_helmet' && pred_score > 0.5) {
        play();
    }

}
