const fs = require("fs");
const path = require("path");
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const proxy = require("express-http-proxy");

const app = express();
const http = require('http').createServer(app);

app.use(express.json());
app.use(express.urlencoded());

app.use(cors({
    origin: "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

const BasePath = () => {
    return path.resolve(__dirname, '..');
};

const BACKUP = {
    disabled: true,
    occurrence: "0,6,12,18",
    retention: 7,
    path: '',
    metadata: '',
    tar: true,
}

class Agent {
    _apiHost = "";
    _agentPort = 0;
    _apiPort = 0;
    _targetURL = "";

    constructor(args) {
        this._agentPort = args.agentPort || 1932;
        this._apiHost = args.api || 'localhost';
        this._apiPort = args.port || 4280;
        this._targetURL = `http://${this._apiHost}:${this._apiPort}/`;

        if (args.backup) {
            BACKUP.disabled = false;
            BACKUP.occurrence = (args.backup === true ? BACKUP.occurrence : args.backup);
            BACKUP.retention = args.backupRetention || BACKUP.retention;
            BACKUP.path = args.backupPath;
            BACKUP.metadata = args.backupMetadata;
            BACKUP.tar = args.backupTar || true;

            let backupMetaData = path.resolve(BACKUP.path, 'MetaData');
            if (!fs.existsSync(backupMetaData)) {
                fs.mkdirSync(backupMetaData, { recursive: true, mode: '0755' });
                console.log(`[${this.constructor.name}]`, "Created metadata directory in backup folder...");
            }

            let backupContractsData = path.resolve(BACKUP.path, 'Contracts');
            if (!fs.existsSync(backupContractsData)) {
                fs.mkdirSync(backupContractsData, { recursive: true, mode: '0755' });
                console.log(`[${this.constructor.name}]`, "Created contract history directory in backup folder...");
            }
        }

        app.get('/agent/version', (req, res) => {
            let packageFile = require('../package.json');
            res.json({
                success: true,
                version: packageFile.version
            })
        });

        app.use('/', proxy(this._targetURL, {
            userResDecorator: (proxyRes, proxyResData) => {
                return proxyResData.toString();
            }
        }));

        http.listen(this._agentPort, '0.0.0.0', async () => {
            console.log(`[${this.constructor.name}]`, `Socket established on port: ${this._agentPort}`);
        });

        this.init();
    }

    async init() {
        if (BACKUP.disabled === false) {
            let backupPath = path.resolve(BasePath(), 'backup');
            const ls = spawn(`node`, [`${backupPath}/backup.js`, '--backup', JSON.stringify(BACKUP)]);
            ls.stdout.on('data', (data) => {
                process.stdout.write(`${data}`);
            });

            ls.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        }
    }

    get BasePath() {
        return BasePath();
    }

}

module.exports = Agent;