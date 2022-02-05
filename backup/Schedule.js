const chalk = require("chalk");

class Schedule {
    _schedule = require('node-schedule');
    _tasks = {};

    constructor() {

    }

    editJob(name, when, action) {
        this.addJob(name, when, action);
    }

    addJob(name, when, action, initialRun) {
        let isNewJob = false;
        if (this._tasks[name]) {
            this.deleteJob(name);
        } else {
            isNewJob = true;
        }
        this._tasks[name] = this._schedule.scheduleJob(when, () => {
            // console.log(chalk`Scheduled job running: {blackBright ${name}}`);
            action();
        });
        if (isNewJob) {
            console.log(`[${this.constructor.name}]`, chalk`New job scheduled: {blackBright ${name}} (When: {blackBright ${when}}) (Next: {blackBright ${this.nextInvocation(name).toLocaleString()}})`);
        }
        // this._tasks[name].job = name;
        if (initialRun === true) action();
    }

    deleteJob(name) {
        if (!this._tasks[name]) return false;
        this._tasks[name].cancel();
        delete this._tasks[name];
        return true;
    }

    nextInvocation(name) {
        if (!this._tasks[name]) return false;
        return this._tasks[name].nextInvocation();
    }

    get Tasks() {
        return this._tasks;
    }

    get schedule() {
        return this._schedule;
    }

}

module.exports = Schedule;