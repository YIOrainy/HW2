// Access the file input and submit button
const fileInput = document.getElementById('capture-btn');
const submitButton = document.getElementById('submit-btn');
const canvas = document.createElement('canvas'); // Create an off-screen canvas
const context = canvas.getContext('2d');

// Enable submit button when an image is selected
fileInput.addEventListener('change', (event) => {
const file = event.target.files[0];
if (file) {
    submitButton.disabled = false; // Enable the submit button
}
});

// Event listener for submit button click
submitButton.addEventListener('click', (event) => {
const file = fileInput.files[0];
if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function() {
        // Draw the uploaded image on the canvas
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // Perform OCR on the uploaded image
        recognizeArabicNumber(canvas.toDataURL());
    };
    };
    reader.readAsDataURL(file);
}
});

// Function to recognize Arabic numbers using Tesseract.js
function recognizeArabicNumber(imageDataUrl) {
Tesseract.recognize(
    imageDataUrl,
    'ara',  // Arabic language support
    {
    logger: m => console.log(m),  // Optional: log progress in the console
    }
).then(({ data: { text } }) => {
    console.log('OCR Result:', text);
    
    // Extract the number from the recognized text
    const detectedNumber = extractArabicNumber(text);
    document.getElementById('detected-number').textContent = detectedNumber;

    // Enable the Play Audio button
    document.getElementById('play-audio').disabled = false;

    // Set up the audio playback
    setUpAudioPlayback(detectedNumber);
}).catch(err => {
    console.error('OCR Error:', err);
    document.getElementById('detected-number').textContent = 'Error recognizing number';
});
}

// Function to extract the detected Arabic number from the recognized text
function extractArabicNumber(text) {
const arabicNumbers = text.match(/[٠١٢٣٤٥٦٧٨٩]/g);  // Match Arabic numbers (0-9)

if (arabicNumbers) {
    // Convert Arabic numeral to its equivalent number
    const numberMap = {
    '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4,
    '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9
    };
    const number = arabicNumbers[0]; // Get the first matched number
    return numberMap[number]; // Return the Arabic number as a digit
}
return 'No number found';
}

// Function to set up audio playback for the detected number
function setUpAudioPlayback(number) {
const audio = new Audio(`audio/${number}.mp3`);
document.getElementById('play-audio').addEventListener('click', () => {
    audio.play();
});
}
