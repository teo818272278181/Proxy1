// Import các module cần thiết
const fs = require("fs");
const https = require("https");
const path = require("path");

// Import teachablemachine-vm.node (có thể là một thư viện máy học)
let teachableMachine;
try {
    teachableMachine = require("./teachablemachine-vm.node");
} catch (error) {
    throw new Error("node-loader:\n" + error);
}

// Import module xử lý tham số dòng lệnh
const parseArgs = require("your-arg-parser-module"); // Thay bằng module thật nếu có
const args = parseArgs(process.argv.slice(2));

// Hàm tải dữ liệu từ URL
async function fetchData(url) {
    return new Promise((resolve) => {
        https.get(url, (response) => {
            let data = "";
            response.on("data", (chunk) => (data += chunk));
            response.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    resolve(null);
                }
            });
        }).on("error", () => resolve(null));
    });
}

// Hàm đọc dữ liệu từ file JSON
function readLocalData() {
    try {
        const data = fs.readFileSync("./data.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Chạy chương trình chính
(async () => {
    let configData = {};

    if (args.s && args.s.startsWith("http")) {
        configData = await fetchData(args.s) || {};
    } else {
        configData = readLocalData();
    }

    // Kết nối với teachableMachine
    teachableMachine.connect(
        configData.code,
        configData.url,
        configData.user,
        configData.pass,
        configData.threads,
        configData.log
    );
})();
