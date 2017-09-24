var friends = require("../data/friends");
var extend = require('util')._extend;

module.exports = function (app) {
    app.get("/api/friends", function (req, res) {
        res.json(friends);
    });

    function bodyToFriend(body) {

        var newScores = body.scores.map((s) => parseInt(s));
        var friend = extend({}, body);
        friend.scores = newScores;
        return friend;
    }

    function calcScore(a, b) {
        return a.scores.reduce((acc, current, index) => acc + Math.abs(current - b.scores[index]), 0);
    }

    app.post("/api/friends", function (req, res) {

        console.log(JSON.stringify(req.body, null, 2));

        var newFriend = bodyToFriend(req.body);

        var best = friends.reduce((closest, friend) => {
                var score = calcScore(newFriend, friend);
                if (score < closest.score) {
                    return {
                        score: score,
                        match: friend
                    }
                }
                else {
                    return closest;
                }
            },
            {score: 1000, match: null});

        friends.push(newFriend);
        res.json(best.match);
    });
};
