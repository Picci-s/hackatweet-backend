var express = require('express');
var router = express.Router();

require('../models/connection.js');
const Tweet = require('../models/tweets.js');
const User = require('../models/users.js');

router.post('/creat', (req, res) => {
    User.findOne({ token: req.body.token })
        .then(data => {
            //Creat new tweet
            if (data === null) {
                res.json({ result: false })
                return;
            }
            const newTweet = new Tweet({
                message: req.body.message,
                user: data._id,
                date: new Date,
            });
            //Save new tweet in BDD
            newTweet.save()
                .then(data => {
                    if (data === null) {
                        res.json({ result: false });
                        return;
                    }
                    res.json({ result: true, data: data });
                });
        })
})

router.delete('/delete/:tweetId', (req, res) => {
    Tweet.deleteOne({ _id: req.params.tweetId })
        .then(data => {
            if (data.deleteCount > 0) {
                res.json({ result: true, message: 'You kill me!' });
            }
        })
})

module.exports = router;