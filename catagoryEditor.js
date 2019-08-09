
function modelForExport(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    pool = config.pool;
    sgMail = config.sgMail;
    requireBasicPlus =  config.requireBasicPlus;
    requireMiddlePlus = config.requireMiddlePlus;
    requireAdminPlus = config.requireAdminPlus;
    checkSessionNolayoutChange = config.checkSessionNolayoutChange;

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/catagoryEditor',requireAdminPlus,(req,res)=>{
    let text = "SELECT catagories_id,catagories_name,catagories_color FROM catagories"
    let values = [];
    query(text, values, callback);
    function callback(data) {
//console.log(data.rows)
    res.render('catagoryEditor',{rows:data.rows})
            }//end callback definition
    
    
   
  
})//end get    

app.get('/catagoryEditor/api',requireAdminPlus,(req,res)=>{
   catagoryId = req.query.catagoryId;


   let text = "SELECT * from catagories WHERE catagories_id= $1"
   let values = [catagoryId];
   query(text, values, callback);
   function callback(data) {
   res.send(data.rows)
           }//end callback definition

   
    
   
  
})//end get   

app.post('/catagoryEditor',requireAdminPlus,(req,res)=>{
    catagoryName = req.body.name;
    defaultStatus = req.body.radio;
    color = req.body.color;



    let text = 'INSERT INTO catagories (catagories_name,catagories_color,catagories_default) VALUES ($1,$2,$3) RETURNING *'
let values = [catagoryName,color,defaultStatus];
let response = res; //create a globalish variable. 
let request = req;
        pool.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack.split('\n',1)[0])
            response.send(err.stack.split('\n',1)[0])
          } else {
            response.send('insert successful')
          }
        })//end query


}) //end POST editor

app.post('/catagoryEditor/update',requireAdminPlus,(req,res)=>{
    catagoryId = req.body.catagories_id
    defaultStatus = req.body.radio;
    color = req.body.color;

console.log(color);
console.log(defaultStatus);
console.log(catagoryId)

    let text = 'update catagories SET catagories_color =$1,catagories_default=$2 WHERE catagories_id=$3'
let values = [color,defaultStatus,catagoryId];
let response = res; //create a globalish variable. 
let request = req;
        pool.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack.split('\n',1)[0])
            response.send(err.stack.split('\n',1)[0])
          } else {
              console.log('update successful')
            response.send('update successful')
          }
        })//end query



}) //end POST editor/update


// app.post('/catagoryEditor/delete',(req,res)=>{
//     catagoryId = req.body.catagoryId
//     let text = 'DELETE FROM catagories WHERE catagories_id = $1'
// let values = [catagoryId];
// query(text, values, callback);
// function callback(data) {
// console.log(data.rows)
// console.log('DELETE SUCCESSFUL')
// res.send('delete successful')
//         }//end callback definition


// }) //end POST editor/delete

app.post('/catagoryEditor/delete',requireAdminPlus, async (req, res) => {
    //check all no users are using this catagory
    catagoryId = req.body.catagoryId
    catagoryName = req.body.catagoryName
    // console.log(catagoryId)
    // let text = 'SELECT * FROM users where users_catagory=$1'
    // let values = [catagoryId];
    // catagories = await queryP(text, values);

    //get catagory name

// text = 'SELECT * FROM catagories WHERE catagories_id= $1'
// values = [catagoryId];
// thisCatagory = await queryP(text, values);
// console.log(catagoryName)
// catagoryName = thisCatagory.rows[0].catagory_name
console.log(catagoryName)



    catagoryId = req.body.catagoryId
     text = 'SELECT * from users INNER JOIN catagories ON catagories.catagories_name = users.users_catagory WHERE catagories_id= $1'
     values = [catagoryId];
    catagories = await queryP(text, values);
    console.log(catagories)
    if(catagories.rowCount !=0){
        console.log('cannot delete student type with users still having it as their student type')
        res.send('cannot delete student type with users still having it as their student type')
        return
    }
    text = 'DELETE FROM catagories WHERE catagories_id= $1'
    values = [catagoryId];
   catagories = await queryP(text, values);

//delete all answers;


text = 'DELETE FROM answers WHERE answers_catagory=$1'
values = [catagoryName];
thisCatagory = await queryP(text, values);

//Delete from all questions
text = 'UPDATE questions set questions_catagories = array_remove(questions_catagories,$1)'
values = [catagoryName];
thisCatagory = await queryP(text, values);






    
    res.send('user deleted')
    })//end delete
    



}//end ModelForExport
  
  
  
  module.exports = modelForExport;