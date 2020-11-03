var express = require('express');
var router = express.Router();
var sql = require('./board_db')();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));

/* GET users listing. */
router.get('/', function(req, res, next) {

//post 요청을 받았을 경우 board 쿼리 파트
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
//board 쿼리 끝

    console.log("gg");
    //console.log(req.body);
    res.send('respond with a resource');
});

// 글쓰기 로직 처리 POST


router.post('/board/write', function(req,res,next){

    var user_num = req.body.user_num;
    var board_id = req.board_id;
    var board_title = req.board_title;
    var board_content = req.body.board_content;
    var board_date = req.body.board_date;
    var hit = req.body.hit;
    var datas = [user_num,board_id,board_title,board_content,board_date,hit];

    pool.getConnection(function (err, connection)
    {
        // Use the connection
        var sqlForInsertBoard = "insert into board_db(user_num, board_id, board_title, board_content, board_date, hit ) values(?,?,?,?)";
        connection.query(sqlForInsertBoard,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/board');
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });

});



module.exports = router;
