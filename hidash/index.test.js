const assert = require('assert');
const { forEach, map } = require('./index');
const { it } = require('node:test');

// const test = (desc, fn) => {
//     console.log('-----', desc);
//     try {
//         fn(); 
//     } catch (err) {
//         console.log(err.message);
//     }

// };

// console.log('Test for Each');

it('The forEach function', () => {
  let sum = 0; 
  forEach([1, 2, 3], value => {
    sum += value;
});
    assert.strictEqual(sum, 6, 'expected summing array to aqual 6');

// if (sum !== 6) {
//     throw new Error('expected summing array to aqual 6');
// }
})

// console.log('Test for Map');
// it is mocha lib
it('The map function', () => {
    const result =map([1, 2, 3], value => {
        return value * 2
    });

    assert.deepStrictEqual(result, [2, 4, 6])

    // assert.strictEqual(result[0], 2);
    // assert.strictEqual(result[1], 4);
    // assert.strictEqual(result[2], 6);

    
    
    // if (result[0] !== 2) {
    //     throw new Error(`Expected to find 2 but found ${result[0]}`);
    // }
    
    // if (result[1] !== 4) {
    //     throw new Error(`Expected to find 4 but found ${result[1]}`);
    // }
    
    // if (result[2] !== 6) {
    //     throw new Error(`Expected to find 6 but found ${result[2]}`);
    // }    
});
