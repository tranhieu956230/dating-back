const User = require("../models/user.model");
const fbAPI = require("../services/fb");
const jwt = require("jsonwebtoken");
const config = require("config");

const { parseFail, parseSuccess } = require("../utils/utils");
const SECRET_KEY = config.get("SECRET_KEY");

exports.checkSession = async (req, res) => {
    try {
        let ac = await fbAPI.exchangeCode(req.query.code);
        let userInfo = await fbAPI.getUserInfo(ac.access_token);
        console.log(userInfo);
        let user = await User.findOne({ email: userInfo.email });
        if (!user) {
            user = await User.create({
                fb_id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                profile_picture: userInfo.picture.data.url
            });
        }

        const payload = { userId: user.id };
        const options = {
            expiresIn: "1d"
        };

        const token = jwt.sign(payload, SECRET_KEY, options);

        return res.redirect(`http://localhost:3000/login?token=${token}`);
    } catch (err) {
        console.log(err.message);
        return res.redirect("http://localhost:3000/login");
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        let { userId } = req.decoded;
        let user = await User.findOne({ _id: userId });
        return res.send(parseSuccess(user));
    } catch (err) {
        return res.send(parseFail(err.message, 500));
    }
};

exports.test = (req, res) => {
    console.log(req.decoded);
    return res.send("ok");
};
