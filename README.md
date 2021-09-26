<h1 align="center">Welcome to cron-expression-parser 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D12.0.0-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Cron expression parser

## Prerequisites

- node >=12.0.0

## Install

```sh
npm install
```


## Introduction

It follows standard cron expression syntax
```text
# +------------ Minute (0 - 59)
# | +---------- Hour (0 - 23)
# | | +-------- Day of the Month (1 - 31)
# | | | +------ Month (1 - 12)
# | | | | +---- Day of the Week (0 - 7) (Sunday is 0 or 7)
# | | | | |
# * * * * * command
```
More information available in [wikipedia page](https://en.wikipedia.org/wiki/Cron#CRON_expression)

Output
```sh
npm run cli "*/15 0 1,15 * 1-5 /usr/bin/find";
```

```shell
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
```


## Usage

```sh
cron-expression-parser "*/5 * * * * echo Hello";
```

## Run tests

```sh
npm test
```

## Author

👤 **kYem**


## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
