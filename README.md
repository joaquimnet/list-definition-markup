# Welcome to list-definition-markup 👋

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: joaquimnet_](https://img.shields.io/twitter/follow/joaquimnet_.svg?style=social)](https://twitter.com/joaquimnet_)

> Simple list format parser and converter.

## Install

```sh
yarn install list-definition-markup
```

## Usage

```sh
ldm <path> [--output="file name or path"] [--verbose] [--dry]
```

or

```javascript
const parse = require('list-definition-markup');

// parse() returns the ldm content parsed as a javascript object
const parsedObject = parse(someLdmText);
```

## Example

```sh
ldm my-house.ldm
```

-> my-house.ldm

```ldm
house
  living room
  kitchen
  bathroom
  room
    tv
    bed
```

-> my-house.json

```json
{
  "house": {
    "living room": "living room",
    "kitchen": "kitchen",
    "bathroom": "bathroom",
    "room": {
      "tv": "tv",
      "bed": "bed"
    }
  }
}
```

## Run tests

```sh
yarn test
```

## Author

👤 **Joaquim Neto**

- Twitter: [@joaquimnet\_](https://twitter.com/joaquimnet_)
- Github: [@joaquimnet](https://github.com/joaquimnet)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
