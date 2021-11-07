const express=require('express')
const ejsMate=require('ejs-mate')
const app=express()
app.engine('ejs',ejsMate)
const path=require('path')
const methodOverride=require('method-override')
app.use(express.urlencoded({ extended: true }));
const mongoose=require('mongoose')
const Campground=require('./models/campground.js')
app.set('views',path.join(__dirname,'views'))
/*app.set('views','./campgrounds/index')*/
app.set('viewengine','ejs')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
});
app.use(methodOverride('_method'))
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected");
})

app.get('/',(req,res)=>{
    res.render('home.ejs');
})
app.get('/campgrounds',async(req,res)=>{
    const camp=await Campground.find({});
    res.render('campgrounds/index.ejs',{camp});
} )
app.get('/campgrounds/new',async(req,res)=>{
    res.render('campgrounds/form.ejs');
} )
app.post('/campgrounds',async(req,res)=>{
    const camp=new Campground(req.body.campground)
    await camp.save();
    res.redirect(`campgrounds/${camp._id}`)
} )
app.get('/campgrounds/:id',async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    res.render('campgrounds/show.ejs',{camp});
} )
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs',{camp});
} )
app.put('/campgrounds/:id',async(req,res)=>{
   const {id}=req.params
   const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground})
   res.redirect(`/campgrounds/${id}`)
} )
app.delete('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params
   await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
 } )
app.listen(4444,()=>{
    console.log('LIstening on port number on 4444')
})