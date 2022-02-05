const fs = require("fs");
const path = require("path");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const tar = require("tar");
const argv = yargs(hideBin(process.argv)).argv;
const BACKUP = JSON.parse(argv.backup);

const contractManagerPath = path.resolve(BACKUP.metadata, 'host', 'contractmanager');

let backupContractData = path.resolve(BACKUP.path, 'Contracts');

const currentDate = new Date();

let data = fs.readdirSync(backupContractData);
for (let file of data) {
    let fileData = fs.statSync(path.resolve(backupContractData, file));
    let fileCreated = new Date(fileData.ctime);
    fileCreated.setDate(fileCreated.getDate() + BACKUP.retention);
    if (fileCreated < currentDate) {
        fs.rmSync(path.resolve(backupContractData, file));
    }
}

console.log(`[${this.constructor.name}]`, "Backing Up...");
console.log(`[${this.constructor.name}]`, `Creating new tarball: ${BACKUP.path}/contract.tgz...`);
tar.create({ gzip: true, sync: true, file: `${BACKUP.path}/contract.tgz` }, [contractManagerPath]);
console.log(`[${this.constructor.name}]`, `Tarball created.`);
let date = new Date();
let backupTarget = path.resolve(backupContractData, `${date.getTime()}.tgz`);
fs.renameSync(`${BACKUP.path}/contract.tgz`, backupTarget);
console.log(`[${this.constructor.name}]`, `Backup saved as ${backupTarget}`);
