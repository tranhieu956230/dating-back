const rp = require("request-promise");

exports.exchangeCode = code => {
    return rp({
        uri: `https://graph.facebook.com/v3.3/oauth/access_token?`,
        qs: {
            client_id: "538073136708397",
            redirect_uri: "http://localhost:3001/user/callback",
            client_secret: "ef3a3d6a2ad436d87493156c7115933e",
            code
        },
        json: true
    }).catch(err => {
        console.log(err.message);
    });
};

exports.getUserInfo = access_token => {
    return rp({
        uri: `https://graph.facebook.com/v3.3/me`,
        qs: {
            fields: "id,name,email,picture",
            access_token
        },
        json: true
    }).catch(err => {
        console.log(err.message);
    });
};
