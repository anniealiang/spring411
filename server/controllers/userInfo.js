const userRouter = require('express').Router();
const User = require('../models/userStruct')

userRouter.post('/', (req, res) => {
    //console.log(req.body);
    const user = new User(req.body);
    const savedUser = user.save();
    return res.status(201).json(savedUser);
    //return res.send('Hi, from within the stats router POST')
});

module.exports = userRouter;