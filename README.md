# SCPrime Monitor Agent v1.00
## Description Here...

![In Development](https://img.shields.io/badge/Development%20Stage-Early%20Access-yellow.svg?style=flat)
[![Build Status](https://travis-ci.org/Addramyr84/scprime-agent.svg?branch=main)](https://travis-ci.org/johncrisostomo/get-ssl-certificate)
[![Coverage Status](https://coveralls.io/repos/github/Addramyr84/scprime-agent/badge.svg?branch=main)](https://coveralls.io/github/Addramyr84/scprime-agent?branch=main)
![In Development](https://img.shields.io/badge/Requirements-NodeJS%2016.x,%20NPM%207.2x-green.svg?style=flat)
![Known Vulnerabilities](https://snyk.io/test/github/dwyl/hapi-auth-jwt2/badge.svg?targetFile=package.json)

The agent works as a relay between ScPrime (https://scpri.me) hosts and the ScPrime Monitor

### Agent Actions
The following actions are available from the command line to offer extra abilities. 

| Command                 | Information                                                              |
|-------------------------|--------------------------------------------------------------------------|
| `--agent-port (int)`    | Sets the port the agent will communicate on (Default: 1932)              |
| `--api (string)`        | The url of the host currently being handled (Default: localhost)         |
| `--port (int)`          | This is the port the API of SPD is running on (Default: 4280)            |

### Backup Controls
The backup system backs up the contents of the metadata folder.

Disabled by default to enable use the `--backup` action.

| Command                      | Information                                                             |
|------------------------------|-------------------------------------------------------------------------|
| `--backup`                   | Enable backups, these can be stored to a set directory.                 |
| `--occurrence (string)`      | How often the backups will be executed. (Default: 0,6,12,18)            |
| `--backup-retention (int)`   | How long in days to keep backups of the metadata for. (Default: 7)      |
| `--backup-path (string)`     | Directory where the backup files will be stored.                        |
| `--backup-metadata (string)` | Current location of metadata stored within SCP Daemon.                  |
| `--backup-tar (boolean)`     | Sets if the backup files will TAR gziped to save space. (Default: true) |

## Upcoming Features
* Create secure SSL tunnel between Agent & main software.