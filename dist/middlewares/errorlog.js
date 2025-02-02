import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const errorLogger = (err, req, res, next) => {
    try {
        if (!err) {
            return next();
        }
        // if status is okay then it's a server problem unless return real status code.
        const status = res.statusCode > 199 && res.statusCode < 300 ? 500 : res.statusCode;
        const origin = req.headers.origin || "No origin";
        const error = (err === null || err === void 0 ? void 0 : err.message) || "Error Undefined";
        const endpoint = req.url;
        // formatted error log
        const log = `${new Date().toLocaleString()}\tstatus:${status}\tend-point:${endpoint}\torigin:${origin}\terror:${error}\n`;
        const logDirPath = path.join(__dirname, "..", "logs");
        const errorLogPath = path.join(__dirname, "..", "logs", "error_logs.txt");
        try {
            if (!fs.existsSync(logDirPath)) {
                fs.mkdirSync(logDirPath);
            }
            if (!fs.existsSync(errorLogPath)) {
                fs.writeFileSync(errorLogPath, log);
            }
            else {
                fs.appendFileSync(errorLogPath, log);
            }
        }
        catch (fileError) {
            if (fileError instanceof Error) {
                return res.status(500).json({ message: fileError.message });
            }
            else {
                return res.status(500).json({ message: "An unknown error occurred" });
            }
        }
        return res.status(status).json({
            message: "Something went wrong",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        else {
            return res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
