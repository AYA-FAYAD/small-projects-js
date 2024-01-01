const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename')
        }
        
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
        
    }

    async create(attrs) {
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records);

        return attrs;

        
    }

    async getAll() {
        // Open the file called this.filename
        return JSON.parse(await fs.promises.readFile(this.filename,
            {
                encoding: 'utf-8'
            }));
        // Read its contents
        // console.log(contents);

        // pares the contents
        // const data = JSON.parse(contents)

        // Return the parsed data
        // return data;
    }

    
    

    async writeAll(records) {
        // write the updated 'records' array back this filname
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null , 2));
    }

    randomId() {
        // return Math.random() * 99999999;
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(records => records.id == id)
    }


    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }
        // record === {email:'tast@test.com'};
        // attrs ==={password:'mypassword};
        // assign take attrs and copy it in record 
        Object.assign(record, attrs);
        // record === {email:'tast@test.com', {password:'mypassword} }
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {

            let found = true;
            // for im loop for obj
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            if (found) {
                 return record;
             }
        }
    }

}