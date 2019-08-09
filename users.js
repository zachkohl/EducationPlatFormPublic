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
    var bcrypt = require('bcrypt');

    app.get('/whoami', checkSession, async (req, res) => {
        res.render('./test/test', { message: req.session.user })
    })//end get 
    app.get('/usernameis', checkSession, async (req, res) => {
        res.render('./test/test', { message: req.session.user })
    })//end get 

    app.get('/users', requireAdminPlus, async (req, res) => {

        let text = "SELECT * FROM users"
        let values = [];
        users = queryP(text, values);
        text = "SELECT * FROM catagories"
        values = [];
        catagories = queryP(text, values);
        [users, catagories] = [await users, await catagories];

        if (users.rowCount == 0) {
            res.send('Error: no rows in users')
            return
        }


        if (catagories.rowCount == 0) {
            res.send('Error: no rows in catagories')
            return
        }

        package = JSON.stringify(users.rows)
        packageCatagories = JSON.stringify(catagories.rows)
        res.render('users', { rows: users.rows, package: package, packageCatagories: packageCatagories })


    })//end get 




    app.post('/users/api/newUser',requireAdminPlus, (req, res) => {
        target_username = req.body.username;
        target_email = req.body.email;
        target_level = req.body.level;
        target_studentType = req.body.studentType;
        target_roleType = req.body.roleType;
        target_newPassword = req.body.newPassword;

        if (target_newPassword == "") {
            target_newPassword = 'password';
        }

        bcrypt.hash(target_newPassword, 10, function (err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
            if (err) {
                console.log(err)
                process.stdout.write('error hashing password')
            } else {

                //Query

                let text = 'INSERT INTO users(users_username, users_email,users_storedHash,users_role,users_highestLevel,users_catagory) VALUES($1, $2, $3,$4,$5,$6) RETURNING *' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
                let values = [target_username, target_email, hash, target_roleType, target_level, target_studentType]

                let response = res; //create a globalish variable. 
                let request = req;
                pool.query(text, values, (err, res) => {
                    if (err) {
                        response.send(err.stack.split('\n', 1)[0])
                        console.log(err.stack)


                    } else {
                        console.log(res.rows[0])
                        response.send('registration of new user complete')
                    }
                })//end query
            }//end else
        }); //end hashing function
    })//end new user



app.get('/users/api/delete',requireAdminPlus, async (req, res) => {
targetId = req.query.deleteTargetId;
if(targetId == req.session.userId){
    res.send('cannot delete yourself')
    return
}


let text = "delete FROM answers WHERE answers_users_id = $1"
let values = [targetId];
answers = await queryP(text, values);

text = "DELETE FROM users WHERE users_id = $1"
values = [targetId];
users = await queryP(text, values);


text = "DELETE FROM session WHERE CAST(sess ->> 'userId' AS INTEGER) =$1"
values = [targetId];
session = await queryP(text, values);



res.send('user deleted')
})//end delete

app.post('/users/api/updateUser',requireAdminPlus,(req, res) => {
    target_username = req.body.username;
    target_email = req.body.email;
    target_level = req.body.level;
    target_studentType = req.body.studentType;
    target_roleType = req.body.roleType;
    target_newPassword = req.body.newPassword;
   
    if (target_newPassword != "") {
      
        bcrypt.hash(target_newPassword, 10, function (err, hash) { //This code won't fire till the hash variable is ready, this is called a "callback." Now we will only store things in the database once everything is read to go. 
        if (err) {
            console.log(err)
            process.stdout.write('error hashing password')
        } else {
            
            //Query

            let text = 'UPDATE users SET users_email =$1,users_role=$2,users_catagory=$3,users_highestLevel=$4,users_storedhash=$5 WHERE users_id = $6 ' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
            let values = [target_email, target_roleType, target_studentType, target_level,hash,target_username]
            console.log(values)
            let response = res; //create a globalish variable. 
            let request = req;
            pool.query(text, values, (err, res) => {
                if (err) {
                    response.send(err.stack.split('\n', 1)[0])
                    console.log(err.stack)


                } else {
                 
                    response.send('update of user complete')
                }
            })//end query
        }//end else
    }); //end hashing function
    }//end if new Password
    else{
        let text = 'UPDATE users SET users_email =$1,users_role=$2,users_catagory=$3,users_highestLevel=$4 WHERE users_id = $5' // everything after RETURNING are the columns that you want in what gets returned, use a * for everything. 
            let values = [target_email, target_roleType, target_studentType, target_level,target_username]

            let response = res; //create a globalish variable. 
            let request = req;
            pool.query(text, values, (err, res) => {
                if (err) {
                    response.send(err.stack.split('\n', 1)[0])
                    console.log(err.stack)


                } else {
        
                    response.send('update of user complete')
                }
            })//end query
    }

   
})//end new user








}//end ModelForExport



module.exports = modelForExport;