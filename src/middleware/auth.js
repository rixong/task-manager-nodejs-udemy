const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace('Bearer ', ''); //extract token from header
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET) //decode token to extract user._id
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) // find user by id AND token

    if (!user){
      throw new Error() ;
    }
    req.token = token; // assign the request objects so they can be used by route logic)
    req.user = user;
    next()

  } catch (e){
    res.status(401).send({error: "Please login."}, )
  }
}

module.exports = auth;