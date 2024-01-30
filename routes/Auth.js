const express = require('express');
const router= express.Router();
const User = require('../model/User')
const { getToken } = require('../utils/helper');
const bcrypt = require('bcrypt');


//post router will help to register a user
router.post("/register", async (req, resp) => {
  //this method will be called after register api will be called

  // store the req body data into variable

  const { firstName, lastName, userName, email, password } = req.body;
  
  //check if user is already existed or not
  const user = await User.findOne({ email: email }).exec();

  if (user) {
    resp.status(403).json({ error: "user is already existed" });

  }
 
  //this is valid user
  // so we are going to store the data into database

  // here first we convert the password into hash and then store it
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = { firstName, lastName, userName, email, password: hashedPassword };
  const newUser = await User.create(userData);

  //step 4: we want to create the token to return to the user
  const token = await getToken(email, newUser);

  //step5: return  token to user
  const userToreturn = { ...newUser.toJSON(), token };
  delete userToreturn.password;
  return resp.status(200).json(userToreturn);
  
});



  //login
  //step 1:create post async function
  router.post("/login", async (req, resp) => {

    //step 2] collect the email and password from req body
    const { email, password } = req.body;

    //step 3]check user is alredy exist or not 
    const user = await User.findOne({ email: email });

    //3.1]if user isnot there deny the credentials  
    if (!user) {
      return resp.status(403).json({ err: "invalid credentials" });
    }

    //step4: if user is valid then check the password is corr or not
    // to check password:: we alredy convert the password into hash but to convert hast into prev plain text is diff
    // we use the bcrypt.compare() method to compare the password

    const isPasswordValid = await bcrypt.compare(password, user.password);

    //step 5] if password isn't match then remove credentials

    if (!isPasswordValid) {
      return resp.status(403).json({ err: "invalid credentials" });
    }

    //step 6] otherwise return token to user
    //we want to create the token to return to the user
    const token = await getToken(user.email, user);

    const userToreturn = { ...user.toJSON(), token };
    delete userToreturn.password;
    return resp.status(200).json(userToreturn);

  });



module.exports = router;

