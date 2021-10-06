const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const Data=require('./models/data');
const methodOverride=require('method-override');
const sgMail=require('@sendgrid/mail')



mongoose.connect('mongodb://localhost:27017/reception-db')
.then(()=>{
    console.log("DB CONNECTED")
})
.catch((er)=>{
    console.log(err)
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

class EDate extends Date{
    get month(){
        return this.getMonth()+1;
    }
    get day()
    {
        return this.getDate();
    }
    get year()
    {
        return this.getFullYear();
    }
}
const getFormattedDate=({
    month,day,year
})=>`${month}/${day}/${year}`
const date=new Date();
//console.log(getFormattedDate(new EDate(date)));
class Tm extends Date{
    get hour(){
    return this.getHours();
    }
    get min(){
        return this.getMinutes();
        }

// current seconds
get sec(){
    return this.getSeconds();
    }
}
const getFormattedTime=({
    hour,min,sec
})=>`${hour}-${min}-${sec}`
const time=new Date();
//console.log(getFormattedTime(new Tm(time)));
app.get('/home',async (req,res)=>{
    
    const data=await Data.find({});
    res.render('home',{data});
})
app.get('/home/enter',(req,res)=>{
    res.render('enter');
})
app.post('/home',async(req,res)=>{
    let dt1=getFormattedDate(new EDate(date));
    let tm1= getFormattedTime(new Tm(time));
    const {name,email,phone}=req.body;
    sendemail(email,dt1,tm1);
    await Data.create({name,email,phone,dt1,tm1});
    res.redirect('/home');
})
app.get('/home/:id',async(req,res)=>{
    const {id}=req.params;
    const d=await Data.findById(id);
    res.render('exit',{d});
})
app.put('/home/:id',async(req,res)=>{
    let dt2=getFormattedDate(new EDate(date));
    let tm2= getFormattedTime(new Tm(time));
    const {id}=req.params;
   // const {dt2,tm2}=req.body;
    const oh=dt2;
    const om=tm2;
    const d=await Data.findById(id)
    sendexmail(d.email,oh,om)
    await Data.findByIdAndUpdate(id,{$set:{status:"Checked Out",dt2:oh,tm2:om}});
    res.redirect('/home');
})
app.delete('/home/:id',async (req,res)=>{
    const {id}=req.params;
    await Data.findByIdAndDelete(id);
    res.redirect('/home');
})
function sendemail(email,dt1,tm1){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid='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';
  sgMail.setApiKey(sendgrid);
  let m=dt1
  let h=tm1
  
  const message={
    to:email,
    from:'rahul.adhikari2018@gmail.com',
    subject:"hello from sendgrid",
    text:'hello from sendgrid',
    html:'<h1>Hello from  sendgrid</h1>',

}
sgMail.send(message)
.then(Response=> console.log('Email send'))
.catch(error=> console.log(error.message));
}


function sendexmail(email,dt2,tm2){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid='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';
  sgMail.setApiKey(sendgrid);
  let m=dt2;
  let h=tm2;
  
  const message={
    to:email,
    from:'rahul.adhikari2018@gmail.com',
    subject:"hello from sendgrid",
    text:'hello from sendgrid',
    html:'<h1>Hello from  sendgrid</h1>',

}
sgMail.send(message)
.then(Response=> console.log('Email send'))
.catch(error=> console.log(error.message));
}






app.listen(3220,(req,res)=>{
    console.log("UP AT 3220");
})