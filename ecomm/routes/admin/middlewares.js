const { validationResult } = require('express-validator');


module.exports = {
    handleErrors (templateFunc, dataCb) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
            //    to make data use out of if 
                let data = {};
                if (dataCb) {
                   data= await dataCb(req);
                }
                return res.send(templateFunc({ errors, ...data }));
            }

            next();
        };
        
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        }
        //  next is sign middleware is ok move on 
        next();
    }


}