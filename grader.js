
function modelForExport(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    queryP = config.queryP;
    pool = config.pool;
    sgMail = config.sgMail;
    requireBasicPlus =  config.requireBasicPlus;
    requireMiddlePlus = config.requireMiddlePlus;
    requireAdminPlus = config.requireAdminPlus;
    checkSessionNolayoutChange = config.checkSessionNolayoutChange;

    app.get('/grader', checkSession, async (req, res) => {

        let text = "SELECT * from answers INNER JOIN users ON  answers.answers_users_id = users.users_id INNER JOIN catagories ON users_catagory = catagories_name  WHERE answers_answer ='not yet graded'";
        let values = [];
        data = await queryP(text, values); 
console.log(data)

        if (data.rowCount == 0) {
            res.send('Error: no catagories in database')
            return
        }

        package = JSON.stringify(data.rows)
        res.render('readAnswers', { rows: data.rows, package: package })


    })//end get 


    async function get() {

        let text = "SELECT * from catagories"
        let values = [];
        x = await queryP(text, values);
        return x;
    }//end getLowerQuestion
}//end ModelForExport



module.exports = modelForExport;