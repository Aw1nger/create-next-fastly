const requiredEnvVars = ["NODE_ENV", "API_URL"];

console.log("\x1b[34m%s\x1b[0m", "===============================");
console.log("\x1b[32m%s\x1b[0m", "🌟 Environment Variables 🌟");
console.log("\x1b[34m%s\x1b[0m", "===============================");

const envVars = {};
requiredEnvVars.forEach((key) => {
  const value = process.env[key];

  if (!value) {
    console.log(`\x1b[31m[ERROR] ${key} is REQUIRED but not defined!\x1b[0m`);
    envVars[key] = "undefined";
  } else {
    console.log(`\x1b[36m${key}\x1b[0m: \x1b[33m${value}\x1b[0m`);
    envVars[key] = value;
  }
});

console.log("\x1b[34m%s\x1b[0m", "===============================");

require("./server.js");
