const fs = require("fs");
const path = require("path");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const tar = require("tar");
const argv = yargs(hideBin(process.argv)).argv;
const BACKUP = JSON.parse(argv.backup);

let backupMetaData = path.resolve(BACKUP.path, 'MetaData');

const currentDate = new Date();

let data = fs.readdirSync(backupMetaData);
for (let file of data) {
    let fileData = fs.statSync(path.resolve(backupMetaData, file));
    let fileCreated = new Date(fileData.ctime);
    fileCreated.setDate(fileCreated.getDate() + BACKUP.retention);
    if (fileCreated < currentDate) {
        fs.rmSync(path.resolve(backupMetaData, file));
    }
}

console.log(`[${this.constructor.name}]`, "Backing Up...");
console.log(`[${this.constructor.name}]`, `Creating new tarball: ${BACKUP.path}/metdata.tgz...`);
tar.create({ gzip: true, sync: true, file: `${BACKUP.path}/metdata.tgz` }, [BACKUP.metadata]);
console.log(`[${this.constructor.name}]`, `Tarball created.`);
let date = new Date();
let backupTarget = path.resolve(backupMetaData, `${date.getTime()}.tgz`);
fs.renameSync(`${BACKUP.path}/metdata.tgz`, backupTarget);
console.log(`[${this.constructor.name}]`, `Backup saved as ${backupTarget}`);
