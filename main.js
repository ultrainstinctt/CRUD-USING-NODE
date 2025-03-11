require('dotenv').config();
const express =require('express');
const mongoose  =require('mongoose');
const session =require('express-session');



const app = express();
const PORT= process.env.PORT || 4000;

//db
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true ,useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => {console.error(error)})
db.once('open', () => {console.log("Connected to Mongoose")})




//middle
app.use(express.urlencoded({extended :false}));
app.use(express.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});
app.use(express.static("uploads"));



//set template
app.set('view engine',"ejs");




// app.get("/",(req,res)=>{
//     res.send("hello");
// });

//route prefix
app.use("",require('./routes/route'))

app.listen(PORT,()=>{
    console.log(`server http://localhost:${PORT}`);
});



// database connection
