var pool = require('../db_connect');

module.exports = function () {
    return {
        select: function(callback){
            pool.getConnection(function(err, con){
                var sql =
                    select
                        form_name, fragnance, flavor, afterTaste, acidity, body, uniformity, balance, cleanCup, sweetness
                    from
                        evaluation_db
                    where
                        user_num = req.body.user_num;

                con.query(sql, function (err, result, fields) {
                    con.release();
                    if (err) return callback(err);
                    callback(null, result);
                });
            });
        },
        pool: pool
    }

};