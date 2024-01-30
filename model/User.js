//Todays work
//Step1:we have to import mongoose
const mongoose=require('mongoose');
//Step 2: create user Schema
const userSchema= new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:false,

        },
        userName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            private:true,
        },
        email:{
            type:String,
            required:true,
        },
        likedSongs:{
            type:String,
            default:"",
        },
        likedPlaylist:{
            type:String,
            default:"",
        },
        subscribedArtist:{
            type:String,
            default:"",
        },
        
      
    }
);
//step 3: convert the schema into model
const userModel= mongoose.model("User",userSchema);

//step 4: export the model
module.exports= userModel;