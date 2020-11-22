var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var async = require('async');

conn = require('./db_connect');

router.use(bodyParser.urlencoded({extended:true}));
// parse application/x-www-form-urlencoded
router.use(bodyParser.json());
// parse application/json

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Coffee_db' });
    console.log("hi");
});

router.post('/getForm', function(req,res,next){

    //클라이언트가 body에 보낸 user_num

    var get_user_num = req.body.user_num;
    var sql = 'select * from evaluation_db where user_num = ?';
    var sql_result = [];
    async.parallel([
        function(callback) {
            conn.query(sql, get_user_num, function (err, result, fields) {
                callback(err, result)
            });
            console.log("ok");
        },
        ],function(err, result) {
            if (err) {
                res.json({"status": "failed", "message": error.message})
            } else {
                res.send(JSON.stringify(result[0])); //both result1 and result2 will be in results
                console.log(JSON.stringify(result[0]));
            }
        })
    conn.end;


});

router.post('/getFormVal', function(req,res,next){

    var id = req.body.id;
    var sql = 'select * from evaluation_db where evaluation_index = ?';
    var sql_result = [];
    async.parallel([
        function(callback) {
            conn.query(sql, id, function (err, result, fields) {
                callback(err, result)
            });
            console.log("ok");
        },
    ],function(err, result) {
        if (err) {
            res.json({"status": "failed", "message": error.message})
        } else {
            res.send(JSON.stringify(result[0])); //both result1 and result2 will be in results
            console.log(JSON.stringify(result[0]));
        }
    })
    conn.end;


});


router.post('/getFormVal', function(req,res,next){

    var id = req.body.id;
    var sql = 'select * from evaluation_db where evaluation_index = ?';
    var sql_result = [];
    async.parallel([
        function(callback) {
            conn.query(sql, id, function (err, result, fields) {
                callback(err, result)

            });
            console.log("ok");
        },
    ],function(err, result) {
        if (err) {
            res.json({"status": "failed", "message": error.message})
        } else {
            res.send(JSON.stringify(result[0])); //both result1 and result2 will be in results
            console.log(JSON.stringify(result[0]));
        }
    })
    conn.end;


});


router.post('/add', function(req,res,next){

    var new_index;
    var vals;
    conn.query('select evaluation_index from evaluation_db ORDER BY evaluation_index desc' , function (err, result, fields) {
        if (err) throw err
        new_index = result[0].evaluation_index+1;
        console.log(new_index);
        conn.end;
        var ins_user_num = (req.body.user_num == '' )? 0 : req.body.user_num;
        var ins_form_name = (req.body.form_name == '')? 'default_name' : req.body.form_name;
        var ins_fragrance = (req.body.fragrance == '')? 0: req.body.fragrance;
        var ins_flavor = (req.body.flavor == '')? 0: req.body.flavor;
        var ins_afterTaste = (req.body.afterTaste == '')? 0: req.body.afterTaste;
        var ins_acidity = (req.body.acidity == '')? 0: req.body.acidity;
        var ins_bodiness = (req.body.bodiness == '')? 0: req.body.bodiness;
        var ins_uniformity = (req.body.uniformity == '')? 0: req.body.uniformity;
        var ins_balance = (req.body.balance == '')? 0: req.body.balance;
        var ins_cleanCup = (req.body.cleanCup == '')? 0: req.body.cleanCup;
        var ins_sweetness = (req.body.sweetness == '')? 0: req.body.sweetness;
        var ins_overall = (req.body.overall == '')? 0: req.body.overall;
        var ins_values =  [new_index, ins_user_num, ins_form_name, ins_fragrance, ins_flavor,
            ins_afterTaste, ins_acidity, ins_bodiness, ins_uniformity, ins_balance, ins_cleanCup,
            ins_sweetness, ins_overall]

        var sql = 'insert into evaluation_db (evaluation_index, user_num, form_name, fragrance, flavor,' +
            'afterTaste, acidity, bodiness, uniformity, balance, cleanCup, sweetness, overall)' +
            ' values (?,?,?,?,?,?,?,?,?,?,?,?,?)';

        conn.query(sql, ins_values, function (err, result, fields) {
            if (err) throw err;
            conn.end;
            res.send("ok");
        })
    });
});



module.exports = router;

/*form_name, fragnance, flavor, afterTaste, acidity, bodiness, uniformity, balance, cleanCup, sweetness, user_num
              */

