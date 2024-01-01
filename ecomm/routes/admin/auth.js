const express = require('express');
// {check} fun is function we need
// const { check, validationResult } = require('express-validator');
const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForuser
} = require('./validators');

const router = express.Router();

// root handler
router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
  });
  //  manule body parser
  // const bodyParser = (req, res, next) => {
  //     // Get email, password, passwordConfirmation
  //     if (req.method === 'POST') {
  //         // on method idenntical to add event listener so run func when event occur
  //         req.on('data', data => {
  //             // data come in buffer to make it understanding we use toString('utf8')
  //             const parsed = data.toString('utf8').split('&');
  //             const formData = {};
  //             for (let pair of parsed) {
  //                 const [key, value] = pair.split('=');
  //                 formData[key] = value;
  //             }
  //             req.body = formData;
  //             next();
  //         });
  //     } else {
  //         // next is callback given to us mean when we call it is our sign we done with our processing
  //         next();
  //     }
  // };
      
  
  
router.post('/signup',
  [
    requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.send(signupTemplate({ req, errors }));
    // }
    const { email, password } = req.body;
    // if (password !== passwordConfirmation) {
    //   return res.send('Passwords must match');
    // }
  
    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
    // Store the id of that user insid the users cookie
    req.session.userId = user.id;
    res.redirect('/admin/products')
  
  });
  
  router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/signin')
  });
  
  router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
  });
  
router.post('/signin',
  [requireEmailExists, requireValidPasswordForuser],
  handleErrors(signinTemplate),
  async (req, res) => {

  // const errors = validationResult(req); 

  // if (!errors.isEmpty()) {
  //   return res.send(signinTemplate({errors}));
  // }
 
  const { email } = req.body;
  
  const user = await usersRepo.getOneBy({ email });
  
  req.session.userId = user.id;
  
  res.redirect('/admin/products')
});

module.exports = router;
  
  
  
  