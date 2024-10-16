    // Access the video element and canvas
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const captureButton = document.getElementById('capture-btn');

    // Start the camera feed
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.error("Error accessing the camera: " + err);
    });

    // Capture the image from the video feed when the button is clicked
    captureButton.addEventListener('click', () => {
    // Set canvas dimensions to the video feed dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data URL
    const imageDataUrl = canvas.toDataURL('image/png');

    // Perform OCR using Tesseract.js
    recognizeArabicNumber(imageDataUrl);
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
        const number = arabicNumbers[0];
        return numberMap[number];
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
