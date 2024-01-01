const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);


class UserRepository extends Repository {
    async create(attrs) {
        // {email:'ayaemad@gaksdj.com', password:'dsddsd'}

        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = records.push({
            ...attrs,
            password:`${buf.toString('hex')}.${salt}`
        });

        // write all data to json file
        await this.writeAll(records);

        return record;
        
        
    }


    async comparePasswords(saved, supplied) {
        // Saved -> password saved in our database. 'hashed.salt'
        // Supplied -> password given to us by user trying sign in

        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];

        const [hashed, salt] = saved.split('.');
        const hashedSuppliedbuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedbuf.toString('hex');

    }

}
module.exports = new UserRepository('users.json')


// ===============\\\\=============///=========
//   bad way to exports your code
// module.exports = UserRepository;

// // another file
// const UserRepository = require('./users');
// const repo = new UserRepository('users.json');

// // yet another file
// const UserRepository = require('./users');
// const repo = new UserRepository('user.json');
// ---------------------------------------------
//  test code 

// const test = async () => {
//     const repo = new UserRepository('users.json');
//     // await repo.create({ email: 'test@test.com'});

//     // const users = await repo.getAll();

//     // const user = await repo.getOne('00071a01');

//     // await repo.delete('00071a01')
//     // await repo.update('f5075874',{password:'mypassword'});
//     const user= await repo.getOneBy({ "email": "test@test.com" });
//     console.log(user);
// };


// test(); 
