# node-workerize


### Install

```shell
npm install node-workerize
```

### Usage

```js
const workerize = require('node-workerize')(__filename)

function sum(a, b) {
    return a + b
}

const workerizeSum = workerize(sum)

workerizeAdd(11, 22).then(result => {
    // result === 33
})
```