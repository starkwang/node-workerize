const { expect } = require('chai');
const workerize = require('../')(__filename);

const sum = workerize(function(a, b) {
  if (typeof a !== 'number') {
    throw 'a must be number';
  }
  return a + b;
});

expect(sum).to.be.a('function');

expect(sum(1, 2) instanceof Promise).to.be.true;

sum(111, 222).then(result => {
  expect(result).to.equal(333);
});

sum('111', '222').catch(err => {
  expect(err).to.equal('a must be number');
});
