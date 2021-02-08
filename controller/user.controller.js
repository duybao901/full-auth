const Users = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');
const sendEmail = require('./sendMail');
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

            const activation_token = createActivationToken(newUser);

            const url = `${CLIENT_URL}/user/activate/${activation_token}`;
            sendMail(email, url, "Verify your email address");

            res.json({ msg: "Register successfully! Please go to email activate your account to start." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    activationEmail: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const user = jwt.verify(activation_token, process.env.CREATE_ACTIVATION_TOKEN);

            const { name, email, password } = user;

            const check = await Users.findOne({ email: user.email });
            if (check) {
                return res.status(400).json({ msg: "This email already exist." });
            }

            const newUser = new Users({
                name, email, password
            })

            await newUser.save();
            return res.json({ msg: "Acount has been Activated" });

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    login: async (req, res) => {
        try {

            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ msg: "Please fill all the fields" })
            const user = await Users.findOne({ email });

            if (!user) return res.status(400).json({ msg: "This email does not exist" });

            const isPassword = await bcrypt.compare(password, user.password);
            if (!isPassword) return res.status(400).json({ msg: "Password is incorrect" });

            const refresh_token = createRefreshToken({ id: user._id }, process.env.CREATE_REFRESH_TOKEN);

            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: 'user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            })

            return res.json({ msg: "Login successfully" })

        } catch (err) {
            return res.status(400).json({ msg: err.message })
        }
    },

    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

            jwt.verify(rf_token, process.env.CREATE_REFRESH_TOKEN, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login now !" });

                const accessToken = createAccessToken({ id: user.id });
                return res.json({ accessToken })
            })
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "Email not exist" });

            const access_token = createAccessToken({ id: user._id }, process.env.CREATE_ACCESS_TOKEN);
            const url = `${CLIENT_URL}/user/reset/${access_token}`;
            sendEmail(email, url, "Verify your email address");

            res.json({ msg: 'Re-send the password, please check your email' });

        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { password } = req.body;
            const passwordhHash = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate({ id: req.user._id }, {
                password: passwordhHash
            })

            return res.json({ msg: "Password successfully changed" })
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getUserInfor: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select("-password");
            if (!user) return res.status(400).json({ msg: "User not found" });
            return res.json(user);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getAllUserInfor: async (req, res) => {
        try {
            const users = await Users.find();
            return res.json(users);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    logout: (req, res) => {
        try {
            res.clearCookie("refreshtoken", { path: "user/refresh_token" });
            return res.json({ msg: "Logged out." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    updateUserInfor: async (req, res) => {
        try {
            const { name, avatar } = req.body;
            await Users.findByIdAndUpdate({ _id: req.user.id }, {
                name, avatar
            })

            return res.json({ msg: "Update success!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { role } = req.body;
            await Users.findByIdAndUpdate({ _id: req.params.id }, {
                role
            });
            return res.json({ msg: "Update success!" });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


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