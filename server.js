const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());


const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extends: true})); 


// const mongoose = require('mongoose')  // mongoDB 
// mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(() => console.log('MongoDB Connected...'))
// .catch(err => console.log(err))



// open the port for nodemon and heroku
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
});


app.post('/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.use(express.static('./public'));