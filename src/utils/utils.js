const jwt = require("jsonwebtoken");
const config = require("config");
const SECRET_KEY = config.get("SECRET_KEY");

function validateToken(req, res, next) {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const options = {
                expiresIn: "1d"
            };

            try {
                result = jwt.verify(token, SECRET_KEY, options);
                req.decoded = result;
                next();
            } catch (err) {
                return res.send(parseFail("Verification failed", 401));
            }
        } else {
            return res.send(parseFail("Authentication required", 401));
        }
    } catch (err) {
        return res.send(parseFail(err.message, 401));
    }
}

function parseFail(msg, code) {
    return {
        code,
        msg,
        success: false
    };
}

function parseSuccess(data) {
    return {
        code: 200,
        payload: data,
        success: true
    };
}

function removeElement(arr, element) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == element) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

module.exports = {
    parseFail,
    parseSuccess,
    validateToken,
    removeElement
};
