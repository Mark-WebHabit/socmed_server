import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDirPath = path.join(__dirname, "..", "logs");

export const writeServerError = async (error: any) => {
  // formatted error log
  const log = `${new Date().toLocaleString()}\terror:${error}\n`;
  const errorLogPath = path.join(
    __dirname,
    "..",
    "logs",
    "server_error_logs.txt"
  );

  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath);
  }

  if (!fs.existsSync(errorLogPath)) {
    fs.writeFileSync(errorLogPath, log);
  } else {
    fs.appendFileSync(errorLogPath, log);
  }
};
