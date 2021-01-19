const Users = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');
const { CLIENT_URL } = process.env;

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password)
                return res.status(400).json({ msg: "Please fill all the fields" })

            if (validateEmail(email) === false) {
                return res.status(400).json({ msg: "Invalid email" })
            }

            const user = await Users.findOne({ email });
            if (user)
                return res.status(400).json({ msg: "This email already exist" })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must last at 6 characters" })

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = {
                name, email, password: passwordHash
            }
            console.log(newUser);

            const activation_token = createActivationToken(newUser);
            console.log({ activation_token })

            const url = `${CLIENT_URL}/user/activate/${activation_token}`;
            sendMail(email, url);

            res.json({ msg: "Register successfully! Please activate your account to start." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    activationEmail: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const user = jwt.verify(activation_token, process.env.CREATE_ACTIVATION_TOKEN);
            console.log(user);

            const { name, email, password } = user;

            const check = await Users.findOne({ email: user.email });
            if (check) {
                return res.status(400).json({ msg: "This email already exist." });
            }

            const newUser = new Users({
                name, email, password
            })

            await newUser.save();
            return res.json({ msg: "Activated email" });

        } catch (err) {
            return res.status(400).json({ msg: err.message })
        }
    }
}

function validateEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

function createActivationToken(payload) {
    return jwt.sign(payload, process.env.CREATE_ACTIVATION_TOKEN, { expiresIn: "5m" })
}

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.CREATE_ACCESS_TOKEN, { expiresIn: "10m" })
}

function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.CREATE_REFRESH_TOKEN, { expiresIn: "15m" })
}
module.exports = userController;