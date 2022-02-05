const path = require("path");
const { spawn } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const {default: checkDiskSpace} = require("check-disk-space");
const fastFolderSize = require('fast-folder-size');
const Schedule = require("./Schedule");

const argv = yargs(hideBin(process.argv)).argv;

const BACKUP = JSON.parse(argv.backup);

const BasePath = () => {
    return path.resolve(__dirname);
};

class Backup {
    _schedule = new Schedule();

    constructor() {
        this.init();
    }

    async init() {
        let backupDiskSpace = await checkDiskSpace(BACKUP.path);
        let metadataDiskSpace = await this.getFolderSize(BACKUP.metadata);

        console.log(`[${this.constructor.name}]`, `Backups are Enabled`);
        console.log(`[${this.constructor.name}]`, `Occurrence: ${BACKUP.occurrence.split(",").join(', ')} Hours`);
        console.log(`[${this.constructor.name}]`, `MetaData Folder: ${BACKUP.metadata} (Current Size: ${this.formatBytes(metadataDiskSpace)})`);
        console.log(`[${this.constructor.name}]`, `Backup Location: ${BACKUP.path}} (Free Disk Space: ${this.formatBytes(backupDiskSpace.free)})`);
        console.log(`[${this.constructor.name}]`, `Backups will be keep history for ${BACKUP.retention} Days`);
        console.log(`[${this.constructor.name}]`, `Backup TARing: ${BACKUP.tar ? `Enabled` : `Disabled`}`);

        console.log(`[${this.constructor.name}]`, `Generating schedule for backups...`);
        this.Schedule.addJob(`BackupContracts`, `*/10 * * * *`, () => { this.backupContractData() }, false);
        BACKUP.occurrence.split(',').forEach((item) => {
            this.Schedule.addJob(`BackupMetaData:${item}`, `0 0 ${item} * * *`, () => { this.backupData() }, false);
        });
        console.log(`[${this.constructor.name}]`, `Backup schedule created successfully...`);
    }

    async backupContractData() {
        const ls = spawn('node', [`${BasePath()}/backupContract.js`, '--backup', JSON.stringify(BACKUP)]);
        ls.stdout.on('data', (data) => {
            process.stdout.write(`${data}`);
        });
        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    }

    async backupData() {
        const ls = spawn('node', [`${BasePath()}/backupMetaData.js`, '--backup', JSON.stringify(BACKUP)]);
        ls.stdout.on('data', (data) => {
            process.stdout.write(`${data}`);
        });
        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    }

    get Schedule() {
        return this._schedule;
    }

    getFolderSize(folder) {
        return new Promise((resolve, reject) => {
            fastFolderSize(folder, (err, size) => {
                if (err) reject(err);
                resolve(size);
            });
        });
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


}

new Backup(argv);