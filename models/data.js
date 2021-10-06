const mongoose=require('mongoose');
const dataschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        default:"lol"
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    phone:{
        type:String,
        trim:true,
    },
    dt1:{
        type:String,
        min:0,
        max:23,
    },
    tm1:{
        type:String,
        min:0,
        max:59,
    },
    dt2:{
        type:String,
        min:0,
        max:23,
    },
    tm2:{
        type:String,
        min:0,
        max:59,
    },
    status:{
        type:String,
        default:"Present"
    }
    
});
const Data=mongoose.model('Data',dataschema);
module.exports=Data;