var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var async = require('async');
var recommender = require('../recommender/recommender');

router.use(bodyParser.urlencoded({extended:true}));
// parse application/x-www-form-urlencoded
router.use(bodyParser.json());
// parse application/json

router.post('/', function(req,res,next){
    recommender.get().then(value => {
        res.json(value)
    }).catch(error => {
        console.log(error);
    });
});

router.post('/attr', function(req,res,next){
    recommender.getByAttribute(req.body.attributes).then(value => {
        res.json(value)
    }).catch(error => {
        console.log(error);
    });
});

router.post('/similar', function(req,res,next){
    recommender.getSimilar(req.body.form).then(value => {
        res.json(value)
    }).catch(error => {
        console.log(error);
    });
});

router.post('/similar/attr', function(req,res,next){
    recommender.getSimilarByAttribute(req.body.form, req.body.attributes).then(value => {
        res.json(value)
    }).catch(error => {
        console.log(error);
    });
});

module.exports = router;
