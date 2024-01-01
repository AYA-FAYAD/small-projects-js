const counterObject = require('./myscript.js');

console.log(counterObject.getCounter());    
counterObject.incrementCounter();
console.log(counterObject.getCounter());
const NewcounterObject = require('./myscript.js');
console.log(NewcounterObject.getCounter());


