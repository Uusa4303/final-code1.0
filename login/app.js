const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 30001;

app.use(express.static('public')); // Serve static files from the 'public' folder

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Specify the folder where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`; // Generate a unique filename
    cb(null, fileName);
  },
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the HTML file with the upload form
});

app.post('/run-script', upload.single('image'), (req, res) => {
  // Path to the Python script
  const pythonScriptPath = path.join(__dirname, 'code_1.py');

  // Get the path of the uploaded image
  const imagePath = req.file.path;

  // Spawn a new Python process and pass the image path as a command-line argument
  const pythonProcess = spawn('python', [pythonScriptPath, imagePath]);

  // Handle output from the Python script
  pythonProcess.stdout.on('data', (data) => {
    // Send the output to the client
    res.send(data.toString());
  });

  // Handle errors that occur during execution of the Python script
  pythonProcess.stderr.on('data', (data) => {
    // Send the error message to the client
    res.status(500).send(data.toString());
  });

  // Handle when the Python script exits
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });
});

app.listen(port, '127.0.0.1', () => {
  console.log('Server is running on http://127.0.0.1:' + port);

});
