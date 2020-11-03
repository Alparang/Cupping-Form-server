var express = require('express');
var router = express.Router();
var sql = require('./coffee_db')();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Coffee_db' });
});

router.post('/getForm', function(req,res,next){
    sql.select(function (err, data) {
        if (err) console.log(err);
        else console.log(data);

        sql.pool.end(function (err) {
            if (err) console.log(err);
            else {
                console.log('Connection pool has closed');
            }
        });
    });
    res.send('respond with a resource');
});
module.exports = router;
