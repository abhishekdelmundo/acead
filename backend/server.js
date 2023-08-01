const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const { exec } = require('child_process');

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

app.post('/jsexecute', (req, res) => {
  const code = req.body.code;

  exec(`node -e "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing code:', error);
      res.status(500).send('Error executing code.');
    } else {
      res.send(stdout);
    }
  });
});


///cpp1
app.post('/cppcompile', (req, res) => {
  const code = req.body.code;
  const input = req.body.input;

  // Write code and input to temporary files
  const codeFileName = 'code.cpp';
  const inputFileName = 'input.txt';
  const outputFileName = 'output.txt';

  const fs = require('fs');
  fs.writeFileSync(codeFileName, code);
  fs.writeFileSync(inputFileName, input || '');

  // Compile and run the C++ code
  exec(
    `g++ ${codeFileName} -o ${outputFileName} && ./${outputFileName} < ${inputFileName}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing code:', error);
        res.status(500).send('Error executing code.');
      } else {
        res.send(stdout);
      }

      // Clean up the temporary files
      fs.unlinkSync(codeFileName);
      fs.unlinkSync(inputFileName);
      fs.unlinkSync(outputFileName);
    }
  );
});

//cpp2
app.post('/cpp2execute', (req, res) => {
  const code = req.body.code;
  const fileName = 'program.cpp';

  // Write the C++ code to a file
  const fs = require('fs');
  fs.writeFileSync(fileName, code);

  // Compile and run the C++ code
  exec(`g++ ${fileName} -o ${fileName.replace('.cpp', '')}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ output: stderr });
    } else {
      exec(`./${fileName.replace('.cpp', '')}`, (error, stdout, stderr) => {
        if (error) {
          res.status(500).json({ output: stderr });
        } else {
          res.json({ output: stdout });
        }
      });
    }
  });
});


//R 

app.post('/rexecute', (req, res) => {
  const code = req.body.code;
  const fileName = 'script.R';

  // Write the R code to a file
  const fs = require('fs');
  fs.writeFileSync(fileName, code);

  // Run the R code
  exec(`Rscript ${fileName}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ output: stderr });
    } else {
      res.json({ output: stdout });
    }
  });
});


//Java


app.post('/javacompile', (req, res) => {
  const code = req.body.code;
  const input = req.body.input;

  // Write code to a temporary file named 'Main.java'
  const fileName = 'Main.java';
  const fullCode = `${code}\npublic class Main {\n  public static void main(String[] args) {\n    ${input}\n  }\n}`;

  require('fs').writeFileSync(fileName, fullCode);

  exec(`javac ${fileName} && java Main`, (error, stdout, stderr) => {
    // Remove the temporary file
    require('fs').unlink(fileName, (err) => {
      if (err) {
        console.error('Error deleting temporary file:', err);
      }
    });

    if (error) {
      console.error('Error executing code:', error);
      res.status(500).send('Error executing code.');
    } else {
      res.send(stdout);
    }
  });
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
