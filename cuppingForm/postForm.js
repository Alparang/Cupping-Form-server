var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')



// DATABASE SETTING

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "p090604p9",
    database: "cupping_form"
});
connection.connect();



router.get('/', function(req,res){
    res.sendFile(path.join(__dirname, '../../public/join.html'))
})

router.post('/', function(req,res){
    var body = req.body;
    var evaluation_index = body.evaluation_index;
    var sample = body.sample;
    var roastingLevel = body.roastingLevel;
    var fragAroma = body.fragAroma;
    var flavor = body.flavor;
    var afterTaste = body.afterTaste;
    var acidity = body.acidity;
    var sweetness = body.sweetness;
    var bodiness = body.bodiness;
    var balance = body.balance;
    var cleanCup = body.cleanCup;
    var uniformity = body.uniformity;
    var overall = body.overall;
    var defects = body.defects;
    var total = body.total;
    var user_num = body.user_num;

    var query = connection.query('insert into evaluation_db (evaluation_index, sample, roastingLevel, fragAroma, flavor,' +
        ' afterTaste, acidity, sweetness, bodiness, balance, cleanCup, uniformity, overall, defects, total, user_num) ' +
        'values ("' + evaluation_index + '","' + sample + '","' + roastingLevel + '","' + fragAroma + '","' + flavor + '","' + afterTaste + '"' +
        ',"' + acidity + '","' + sweetness + '","' + bodiness + '","' + balance + '","' + cleanCup + '","' + uniformity + '"' +
        ',"' + overall + '","' + defects + '","' + total + '","' + user_num + '")', function(err, rows) {

        if(err) { throw err;}
        console.log("Data inserted!");
    })
})

module.exports = router;