const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log(token)
        if (!token) return res.status(400).json({ msg: "Invalid Authentication" });

        jwt.verify(token, process.env.CREATE_ACCESS_TOKEN, (err, user) => {
            if (err) return res.status(400).json({ msg: "Invalid Authentication" });

            req.user = user;
            next();
        })

    } catch (err) {
        return res.status(500).json({ msg: err.msg });
    }
}

module.exports = auth;