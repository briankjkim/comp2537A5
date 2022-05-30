const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());



// open the port for nodemon and heroku
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('./public'));