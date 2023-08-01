const { exec } = require('child_process');

const compileJavaCode = (javaCode) => {
  return new Promise((resolve, reject) => {
    const process = exec('javac -Xlint:none -', (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });

    process.stdin.write(javaCode);
    process.stdin.end();
  });
};

module.exports = { compileJavaCode };
