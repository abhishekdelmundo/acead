// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post('/api/execute-python', (req, res) => {
  const { code } = req.body;

  // Save the Python code to a temporary file
  const fileName = 'temp.py';
  require('fs').writeFileSync(fileName, code);

  // Execute the Python code using child_process.exec
  exec(`python ${fileName}`, (error, stdout, stderr) => {
    // Remove the temporary file
    require('fs').unlinkSync(fileName);

    if (error) {
      console.error('Error executing Python code:', error);
      res.status(500).json({ error: 'An error occurred while executing the Python code.' });
    } else {
      console.log('Python code executed successfully');
      res.json({ output: stdout || stderr });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
