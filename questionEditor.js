
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

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// app.get('/editor',(req,res)=>{
//     let text = "SELECT questions_info -> 'questionTitle' AS questions_title, questions_id, questions_info ->'questionOrder' AS questionOrder from Questions ORDER BY CAST((questions.questions_info ->>'questionOrder')::numeric as NUMERIC) DESC"
//     let values = [];
//     query(text, values, callback);
//     function callback(data) {
//     res.render('questionEditor',{rows:data.rows})
//             }//end callback definition
    
    
   
  
// })//end get    

app.get('/editor', requireMiddlePlus, async (req, res) => {

    let text = "SELECT questions_info -> 'questionTitle' AS questions_title, questions_id, questions_info ->'questionOrder' AS questionOrder from Questions ORDER BY CAST((questions.questions_info ->>'questionOrder')::numeric as NUMERIC) DESC"
    let values = [];
    questions =  queryP(text, values);
    text = "SELECT * FROM catagories"
    values = [];
    catagories = queryP(text, values);
    [questions, catagories] = [await questions, await catagories];


    package = JSON.stringify(questions.rows)
    packageCatagories = JSON.stringify(catagories.rows)
    res.render('questionEditor',{rows:questions.rows,package:package, packageCatagories: packageCatagories})


})//end get 


app.get('/editor/api/getquestion', requireMiddlePlus, async (req, res) => {
targetId = req.query.targetId;
    let text = "SELECT * FROM questions WHERE questions_id=$1"
    let values = [targetId];
    target = await queryP(text, values);
    msg = target.rows[0]
    console.log(msg)
    res.send(msg)


})//end get 



app.get('/editor/api',(req,res)=>{
   questionId = req.query.questionId;

   let text = "SELECT questions_info,questions_catagories from Questions WHERE questions_id= $1"
   let values = [questionId];
   query(text, values, callback);
   function callback(data) {

    let text = "SELECT catagories_name, catagories_color,catagories_default from catagories"
    let values = [];
    query(text, values, callback2);
    function callback2(data2) {
        data.rows[0].questions_info.catagoryList = data2.rows;
        data.rows[0].questions_info.selectedCatagories = data.rows[0].questions_catagories;
        jsonblob = data.rows[0].questions_info;
           res.send(data.rows[0].questions_info)
    }//end callback2

           }//end callback definition

   
    
   
  
})//end get   

app.post('/editor',(req,res)=>{
    


    questionTitle = req.body.questionTitle
    questionBody = req.body.questionBody;
    questionType = req.body.type;
    answersArray = req.body.answersArray;
    successAlert = req.body.successAlert;

    //console.log(req.body)
    catagories = req.body.catagory;
    if(typeof catagories ==='string'){
        catagories = [catagories]
    }
    roles = req.body.role;
    if(typeof roles ==='string'){
        roles = [roles]
    }
    color = req.body.color;
  
    
    if(questionTitle ==''){
        questionTitle = "No title given";
    }


    jsonblob ={
        questionTitle:questionTitle,
        questionBody:questionBody,
        questionType:questionType,
        successAlert:successAlert,
        answersArray:answersArray
    }
console.log(jsonblob)
    if(req.body.questionOrder){
        jsonblob.questionOrder = Number(req.body.questionOrder);
    }


    let text = 'INSERT INTO questions (questions_info,questions_catagories,questions_roles,questions_color) VALUES ($1,$2,$3,$4) RETURNING *'
let values = [jsonblob,catagories,roles,color];
query(text, values, callback);
function callback(data) {

res.send('post successful')
        }//end callback definition


}) //end POST editor

app.post('/editor/update',(req,res)=>{
catagories = req.body.catagory;
console.log(req.body.catagory)

    if(typeof req.body.questionTitle =='undefined'){
        var questionTitle = "No title given";
        console.log('no question title')
     }else{
      var   questionTitle = req.body.questionTitle;
     }


    questions_id = req.body.questions_id

    
    questionBody = req.body.questionBody;
    questionType = req.body.type;
    answersArray = req.body.answersArray;
    successAlert = req.body.successAlert;
    
    catagories = req.body.catagory;
    if(typeof catagories ==='string'){
        catagories = [catagories]
    }
    roles = req.body.role;
    if(typeof roles ==='string'){
        roles = [roles]
    }
    color = req.body.color;
  
    
    if(questionTitle ==''){
        questionTitle = "No title given";
    }
  




    jsonblob ={
        questionTitle:questionTitle,
        questionBody:questionBody,
        questionType:questionType,
        successAlert:successAlert,
        answersArray:answersArray
    }
console.log(req.body.questionOrder)
    if(req.body.questionOrder){
        jsonblob.questionOrder = Number(req.body.questionOrder);
//console.log(jsonblob.questionOrder)
    }
if(typeof questions_id != ''){
    console.log(questions_id)
    let text = 'UPDATE questions SET questions_info = $1,questions_catagories =$2,questions_roles=$3,questions_color=$4 WHERE questions_id = $5'
let values = [jsonblob,catagories,roles,color,questions_id];
query(text, values, callback);
function callback(data) {
console.log(data.rows)
console.log('UPDATE SUCCESSFULL')
res.send('post successful')
        }//end callback definition

    }//end if question_id
    else{
        console.log('no question_id')
    }
}) //end POST editor/update


app.post('/editor/delete',requireMiddlePlus, async (req,res)=>{
   
   
    //Delete all answers related to the question
    questions_id = req.body.questions_id
    let text = 'DELETE FROM answers WHERE answers_questions_id = $1'
let values = [questions_id];
x = await queryP(text, values);

    

    


    //Delete question
text = 'DELETE FROM questions WHERE questions_id = $1'
values = [questions_id];
query(text, values, callback);
function callback(data) {
    if(data.rows == []){
        res.send('no error')
    }
console.log(data.rows)
console.log('DELETE SUCCESSFUL')
res.send('delete successful')
        }//end callback definition


}) //end POST editor/delete

app.get('/editor/highestQuestion',requireMiddlePlus,(req,res)=>{
    let text = "SELECT MAX( CAST((questions.questions_info ->>'questionOrder')::numeric as NUMERIC)) FROM questions"
    let values = [];
    query(text, values, callback);
    function callback(data) {
        let text = "SELECT catagories_name, catagories_color,catagories_default from catagories"
        let values = [];
        query(text, values, callback2);
        function callback2(data2) {
            msg = {};
            msg.max = data.rows[0].max;
            msg.catagoryList = data2.rows;
            console.log(msg)
            res.send(msg)
        }

            }//end callback definition
})



}//end ModelForExport
  
  
  
  module.exports = modelForExport;