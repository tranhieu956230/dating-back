const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const PORT = config.get("PORT");
const app = express();
const userRoutes = require("./routes/routes");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { removeElement } = require("./utils/utils");

let dbInfo = config.get("DB_INFO");

let db_connection = `mongodb://${dbInfo.user}:${dbInfo.pwd}@${dbInfo.host}:${
    dbInfo.port
}/${dbInfo.db}?authSource=${dbInfo.authSource}`;

mongoose.connect(db_connection, {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);

let users = 0;
io.on("connection", socket => {
    users++;
    io.sockets.emit("user-online", users);

    socket.on("disconnect", function() {
        users--;
        io.sockets.emit("user-online", users);
    });
    socket.on("send-msg", data => {
        io.sockets.emit("receive-msg", {
            msg: data.msg,
            name: data.name,
            _id: data._id,
            profile_picture: data.profile_picture,
            timestamp: Date.now()
        });
    });
});

server.listen(PORT, () => {
    console.log("Server is listening on port", PORT);
});
