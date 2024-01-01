#!/usr/bin/env node

// to use require in esn
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import chalk from 'chalk';
const fs = require('fs');
const util = require('util');





// method #2 option2
// const lstat = util.promisify(fs.lstat);
// open current dir


// method 3 slow 
const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();
fs.readdir(targetDir, async (err, filenames) => {
 // callback first arg is err and 2 arg is data i want
// EIther err == an error obj, which mean somthing wrong OR  err === null, which mean everything is Ok happy hapyy
    
    if (err) {
        // error handling code here
        // throw new Error(err);
        console.log(err);
    }

    // solution 3 the best one is promis all

    const stetPromises = filenames.map(filename => {
        return lstat(filename)
    });
    const allStats = await Promise.all(stetPromises);
    
    for (let stats of allStats) {
        const index = allStats.indexOf(stats);

        if (stats.isFile()) {
            console.log(filenames[index]);
        } else {
            console.log(chalk.magenta(filenames[index]))
        }

        // console.log(filenames[index], stats.isFile());
    }

    // for (let filename of filenames) {
    //     try {
    //         const stats = await lstat(filename);
    //         console.log(filename, stats.isFile());
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // BAD CODE HERE!!!!!!!!1

    // for (let filename of filenames) {
    //     fs.lstat(filename, (err, stats) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log(filename, stats.isFile());
    //     })
    // }
    // BAAAAD


    // option1 is not the best solution 
    // const allStats = Array(filenames.length).fill(null);
    
    // for (let filename of filenames) {
    //     const index = filenames.indexOf(filename);
    //     fs.lstat(filename, (err, stats) => {
    //         if (err) {
    //             console.log(err);
    //         }

    //         allStats[index] = stats;

    //         const ready = allStats.every((stats) => {
    //             return stats;
    //         });
            
    //         if (ready) {
    //             allStats.forEach((stats, index) => {
    //               console.log(filenames[index], stats.isFile());   
    //             });
    //         }
    //     });
    // }
    
    
   
    
});
 // option 2 method #1 is not the best 
// const lstat = (filename) => {
//     return new Promise((resolve, rejects) => {
//         fs.lstat(filename, (err, stats) => {
//             if (err) {
//                 rejects(err);
//             }
            
//             resolve(stats);
//         })
      
//     });  
// };