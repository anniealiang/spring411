const userRouter = require('express').Router();
const User = require('../models/userStruct')

userRouter.post('/', (req, res) => {
    //console.log(req.body);
    const user = new User(req.body);
    const savedUser = user.save();
    return res.status(201).json(savedUser);
    //return res.send('Hi, from within the stats router POST')
});

userRouter.get('/', async (req, res) => {
    //console.log(req.query.uid);
    const user = await User.find({uid : req.query.uid}); //getting all the entries
    return res.json(user);
    //return res.send('Hi, from within the stats router GET');
});

module.exports = userRouter;