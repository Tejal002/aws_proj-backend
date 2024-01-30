const express=require('express');
const cors=require("cors");
const app= express();
const port=5003;
const mongoose=require('mongoose');
require('dotenv').config();
const User=require('./model/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport=require('passport');
const authRoutes=require('./routes/Auth');
const path = require("path");

app.use(cors());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json());

//connect with mongoose atlas to node js
mongoose.connect("mongodb+srv://user2:atlas12@cluster0.kdavtc4.mongodb.net/?retryWrites=true&w=majority",
{

}).then((x)=>
    {  
        console.log("connected");
    }
).catch((err)=>{
    console.log(err);
});


//authentication using passport-jwt

passport.use(
    new JwtStrategy (
        {
            secretOrKey: "secret",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },

        async function(jwt_payload, done) {
            try {
                const user = await User.findOne({ id: jwt_payload.sub });

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            } catch (error) {
                return done(error, false);
            }
        }
    )
);


app.get("/",(req,resp)=>{
    resp.send("hello world");
});

app.use("/auth", authRoutes);

app.listen(port,()=>{
    console.log('app is running on port'+port);
    console.log(process.env.password);
  
});

