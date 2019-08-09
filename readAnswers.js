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
    const fs = require('fs'); //because we want to write static files. 
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    app.get('/answers', requireMiddlePlus, async (req, res) => {
        role = req.session.role;
        catagories = await getCatagories();
        if (catagories.rowCount == 0) {
            res.send('Error: no catagories in database')
            return
        }

        package = JSON.stringify(catagories.rows)

        res.render('readAnswers', { rows: catagories.rows, package: package, role: role })




    })//end get   




    app.get('/answers/api/getAnswers', requireMiddlePlus, async (req, res) => {
        let username = req.session.user;
        let role = req.session.role
        console.log(username + 'is downloading CSV file, role type: '+role)
        let catagoryName = req.query.catagoryName;


        //get question list
        let text = "SELECT  questions_info->'questionTitle' AS questions_Title,questions_id,questions_info->'answersArray' AS answersArray,questions_info->'questionType' AS questionType FROM questions INNER JOIN answers ON  answers.answers_questions_id = questions.questions_id WHERE answers_catagory=$1 AND $2 = ANY(questions_roles) ORDER BY CAST((questions.questions_info ->>'questionOrder')::numeric as NUMERIC) ASC"
        let values = [catagoryName, role];
        if (role === 'admin') {
            //onsole.log('role = "admin"')
            text = "SELECT  questions_info->'questionTitle' AS questions_Title,questions_id,questions_info->'answersArray' AS answersArray,questions_info->'questionType' AS questionType FROM questions INNER JOIN answers ON  answers.answers_questions_id = questions.questions_id WHERE answers_catagory=$1 ORDER BY CAST((questions.questions_info ->>'questionOrder')::numeric as NUMERIC) ASC"
            values = [catagoryName];
        }
        questionsListDB = queryP(text, values);

  



      
        //get user list
        text = "SELECT DISTINCT answers_users_id FROM answers WHERE answers_catagory=$1 ORDER BY answers_users_id DESC"
        values = [catagoryName];
        studentsListDB = await queryP(text, values);


        //get all the answers
        text = "SELECT * FROM answers WHERE answers_catagory=$1"
        values = [catagoryName];
        answersListDB = queryP(text, values);

        //wait for all the database queries to come back
        [questionsListDB, studentsListDB, answersListDB] = [await questionsListDB, await studentsListDB, await answersListDB]


        //Begin code to remove dublicate questions  
let questionsListDBtoMap = questionsListDB.rows;
let uniqueKeys = [...(new Set(questionsListDBtoMap.map(({questions_id})=>questions_id)))]; 

var uniqueQuestions = [];
for (let i = 0; i <questionsListDB.rows.length; i++){
    for (let j = 0; j<uniqueKeys.length; j++){
        if(questionsListDB.rows[i].questions_id === uniqueKeys[j]){
            uniqueQuestions.push(questionsListDB.rows[i]);         
            uniqueKeys[j] = -1;
        }
    }
}
questionsListDB.rows = uniqueQuestions;

//end code to remove duplicates

        if (questionsListDB.rowCount == 0 || studentsListDB.rowCount == 0) {
            res.send('no rows');
            return;
        }
        //get build csv
        //build header
        let string = ''

        let questionList = [];
        string = string + 'user ID,'
        for (i = 0; i < questionsListDB.rows.length; i++) {
        //convert ansersarray into proper json
        questionsListDB.rows[i].answersarray = JSON.parse(questionsListDB.rows[i].answersarray)
            if(role==='Raja'){
               
                string = expandQuestions(questionsListDB.rows[i],string)
              //  string = string + questionsListDB.rows[i].questions_title.toUpperCase() + ','
            }else{
               string = expandQuestions(questionsListDB.rows[i],string) + questionsListDB.rows[i].questions_title.toUpperCase() + ': Time Enterered,'
            }
        }
        string = string + '\r\n'


       function expandQuestions (row,string){
           //this function expacts all the multiple answer questions out so each answer has its own column, needed for integration into mathmatica. 
if(row.questiontype == 'multipleAnswer'){
    for(let i = 0;i < row.answersarray.length; i++){
        let number = i +1;
        string = string + row.questions_title.toUpperCase() +'_'+ number +',';
    }
}else{
    string = string + row.questions_title.toUpperCase() +',';
}

        return string; 
       }

        //add users as rows
        for (i = 0; i < studentsListDB.rows.length; i++) {
            string = string + studentsListDB.rows[i].answers_users_id + ','
            //go through each question  
            for (j = 0; j < questionsListDB.rows.length; j++) {

                //check if that user and that question have an answer in answers
                foundTheAnswer = false;
                for (k = 0; k < answersListDB.rows.length; k++) {//iterate over all answers


                    //check each answer to see if it applies to this context
                    if (studentsListDB.rows[i].answers_users_id == answersListDB.rows[k].answers_users_id && questionsListDB.rows[j].questions_id == answersListDB.rows[k].answers_questions_id) {
                        //write the answer
                        if(role==='Raja'){
                            //We have a match, and the user is Raja
                           if (questionsListDB.rows[j].questiontype == 'multipleAnswer') {
                                //prep the answer
                                if(answersListDB.rows[k].answers_answer[0]=='"'){
                                    console.log('was a sting')
                                    slicedAnswer = answersListDB.rows[k].answers_answer.slice(3,-3)
                                    splitUpAnswer = slicedAnswer.split(',')
                                }else{
                                    console.log('was not a string')
                                    splitUpAnswer = [answersListDB.rows[k].answers_answer];

                                }

                   

                            //prep cells with the answer
                            let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('0');
                            //start putting answers in
                            for(let counterY = 0; counterY< splitUpAnswer.length; counterY++){
                                posistion = splitUpAnswer[counterY]-1;
                                cells[posistion] = 1;
                            }
                   
                            //add the cells to the CSV string
                            for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                                string = string + cells[counterZ] + ','
                                
                            }

                        } else {
                            //The answer is not multipleAnswer Type
                            string = string + answersListDB.rows[k].answers_answer + ','

                        }

                    } else {
                        //we have a match, (an answer has been logged), the user is not Raja
                        if (questionsListDB.rows[j].questiontype == 'multipleAnswer') {
                            //prep the answer
                            if(answersListDB.rows[k].answers_answer[0]=='"'){
                                console.log('was a sting')
                                slicedAnswer = answersListDB.rows[k].answers_answer.slice(3,-3)
                                splitUpAnswer = slicedAnswer.split(',')
                            }else{
                                console.log('was not a string')
                                splitUpAnswer = [answersListDB.rows[k].answers_answer];

                            }
               

                        //prep cells with the answer
                        let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('0');
                        //start putting answers in
                        for(let counterY = 0; counterY< splitUpAnswer.length; counterY++){
                            posistion = splitUpAnswer[counterY]-1;
                            cells[posistion] = 1;
                        }
               
                        //add the cells to the CSV string
                        for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                            string = string + cells[counterZ] + ','
                            
                        }
                        //added because this is for Debbie
                        string = string + answersListDB.rows[k].answers_timestamp + ',';
                    } else {
                        //The answer is not multipleAnswer Type
                        string = string + answersListDB.rows[k].answers_answer + ',' + answersListDB.rows[k].answers_timestamp + ',';

                    }
                        

                    }//end else the user is not Raja
                

                       
                      

                   
                        foundTheAnswer = true;
                        break; //
                    }//end if

                }//end for answerDB
                if (foundTheAnswer == false) {
                    if(role==='Raja'){
                
                        if (questionsListDB.rows[j].questiontype === 'multipleAnswer') {
          
                          let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('not yet answered');
        
                 
                          //add the cells to the CSV string
                          for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                              string = string + cells[counterZ] + ','
                              
                          }

                     } else {
                         string = string + 'not yet answered' + ','

                     }

                 }
                 else {
                    //the user is not Raja and the answer is not found
                    if (questionsListDB.rows[j].questiontype === 'multipleAnswer') {
                    let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('not yet answered');
                    //space out the cells
                    
                    //add the cells to the CSV string
                    for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                        string = string + cells[counterZ] + ','
                        
                    }
                    string = string + 'not yet answered' + ',';
                }
                else{
                    //the question is not multiple choice
                    string = string + 'not yet answered' + ','+'not yet answered' + ',';
                }
                }//end else the user is not Raja and the answer is not found
                }//end for loop for questions 
            }//end for questions
            string = string + '\r\n'
        }//end for loop for students

        res.setHeader('Content-disposition', 'attachment; filename=answers.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(string);







    })//end get /quiz/api/getAnswers

    app.get('/answers/api/getAllAnswers', requireMiddlePlus, async (req, res) => {
        //+++++++++++++++++++++++++
        //++++++++++++++++++++++++
        //++++++++++++++++++++++++
//THIS CODE IS CONFUSING BECAUSE IT IS A CUT AND PASTE (MOSTLY) FROM THE getAnswers function above. The there are minor changes, the bigest of which is in the SQL statements



        let username = req.session.user;
        let role = req.session.role
       console.log(username + 'is downloading CSV file, role type: '+role)


      //get question list
       
  
      let text = "SELECT  questions_info->'questionTitle' AS questions_Title,questions_id,questions_info->'answersArray' AS answersArray,questions_info->'questionType' AS questionType FROM questions INNER JOIN answers ON  answers.answers_questions_id = questions.questions_id WHERE $1 = ANY(questions_roles) ORDER BY CAST((questions.questions_info ->>'questionOrder')::numeric as NUMERIC) ASC"
      let values = [role];
      if (role === 'admin') {
          text = "SELECT  questions_info->'questionTitle' AS questions_Title,questions_id,questions_info->'answersArray' AS answersArray,questions_info->'questionType' AS questionType FROM questions INNER JOIN answers ON  answers.answers_questions_id = questions.questions_id  ORDER BY CAST((questions.questions_info ->>'questionOrder')::numeric as NUMERIC) ASC"
          values = [];
      }

      questionsListDB = queryP(text, values);
  //get user list
  text = "SELECT DISTINCT answers.answers_users_id, users.users_catagory FROM answers INNER JOIN users ON  answers.answers_users_id = users.users_id ORDER BY answers_users_id DESC;"
  values = [];
  studentsListDB = queryP(text, values);


  //get all the answers
  text = "SELECT * FROM answers"
  values = [];
  answersListDB = queryP(text, values);



        //wait for all the database queries to come back
        [questionsListDB, studentsListDB, answersListDB] = [await questionsListDB, await studentsListDB, await answersListDB]
console.log(studentsListDB)

        //Begin code to remove dublicate questions  
let questionsListDBtoMap = questionsListDB.rows;
let uniqueKeys = [...(new Set(questionsListDBtoMap.map(({questions_id})=>questions_id)))]; 

var uniqueQuestions = [];
for (let i = 0; i <questionsListDB.rows.length; i++){
    for (let j = 0; j<uniqueKeys.length; j++){
        if(questionsListDB.rows[i].questions_id === uniqueKeys[j]){
            uniqueQuestions.push(questionsListDB.rows[i]);         
            uniqueKeys[j] = -1;
        }
    }
}
questionsListDB.rows = uniqueQuestions;

//end code to remove duplicates

        if (questionsListDB.rowCount == 0 || studentsListDB.rowCount == 0) {
            res.send('no rows');
            return;
        }
        //get build csv
        //build header
        let string = ''

        let questionList = [];
        string = string + 'user ID,catagory,'
        for (i = 0; i < questionsListDB.rows.length; i++) {
        //convert ansersarray into proper json
        questionsListDB.rows[i].answersarray = JSON.parse(questionsListDB.rows[i].answersarray)
            if(role==='Raja'){
               
                string = expandQuestions(questionsListDB.rows[i],string)
              //  string = string + questionsListDB.rows[i].questions_title.toUpperCase() + ','
            }else{
               string = expandQuestions(questionsListDB.rows[i],string) + questionsListDB.rows[i].questions_title.toUpperCase() + ': Time Enterered,'
            }
        }
        string = string + '\r\n'


       function expandQuestions (row,string){
           //this function expacts all the multiple answer questions out so each answer has its own column, needed for integration into mathmatica. 
if(row.questiontype == 'multipleAnswer'){
    for(let i = 0;i < row.answersarray.length; i++){
        let number = i +1;
        string = string + row.questions_title.toUpperCase() +'_'+ number +',';
    }
}else{
    string = string + row.questions_title.toUpperCase() +',';
}

        return string; 
       }
    
   //add users as rows
   for (i = 0; i < studentsListDB.rows.length; i++) {
    string = string + studentsListDB.rows[i].answers_users_id + ',' + studentsListDB.rows[i].users_catagory + ','
    //go through each question  
    for (j = 0; j < questionsListDB.rows.length; j++) {

        //check if that user and that question have an answer in answers
        foundTheAnswer = false;
        for (k = 0; k < answersListDB.rows.length; k++) {//iterate over all answers


            //check each answer to see if it applies to this context
            if (studentsListDB.rows[i].answers_users_id == answersListDB.rows[k].answers_users_id && questionsListDB.rows[j].questions_id == answersListDB.rows[k].answers_questions_id) {
                //write the answer
                if(role==='Raja'){
                    //We have a match, and the user is Raja
                   if (questionsListDB.rows[j].questiontype == 'multipleAnswer') {
                        //prep the answer
                        if(answersListDB.rows[k].answers_answer[0]=='"'){
                            console.log('was a sting')
                            slicedAnswer = answersListDB.rows[k].answers_answer.slice(3,-3)
                            splitUpAnswer = slicedAnswer.split(',')
                        }else{
                            console.log('was not a string')
                            splitUpAnswer = [answersListDB.rows[k].answers_answer];

                        }

                    //prep cells with the answer
                    let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('0');
                    //start putting answers in
                    for(let counterY = 0; counterY< splitUpAnswer.length; counterY++){
                        posistion = splitUpAnswer[counterY]-1;
                        cells[posistion] = 1;
                    }
           
                    //add the cells to the CSV string
                    for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                        string = string + cells[counterZ] + ','
                        
                    }

                } else {
                    //The answer is not multipleAnswer Type
                    string = string + answersListDB.rows[k].answers_answer + ','

                }

            } else {
                //we have a match, (an answer has been logged), the user is not Raja
                if (questionsListDB.rows[j].questiontype == 'multipleAnswer') {
                    //prep the answer
                    if(answersListDB.rows[k].answers_answer[0]=='"'){
                        console.log('was a sting')
                        slicedAnswer = answersListDB.rows[k].answers_answer.slice(3,-3)
                        splitUpAnswer = slicedAnswer.split(',')
                    }else{
                        console.log('was not a string')
                        splitUpAnswer = [answersListDB.rows[k].answers_answer];

                    }

                //prep cells with the answer
                let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('0');
                //start putting answers in
                for(let counterY = 0; counterY< splitUpAnswer.length; counterY++){
                    posistion = splitUpAnswer[counterY]-1;
                    cells[posistion] = 1;
                }
       
                //add the cells to the CSV string
                for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                    string = string + cells[counterZ] + ','
                    
                }
                //added because this is for Debbie
                string = string + answersListDB.rows[k].answers_timestamp + ',';
            } else {
                //The answer is not multipleAnswer Type
                string = string + answersListDB.rows[k].answers_answer + ',' + answersListDB.rows[k].answers_timestamp + ',';

            }
                

            }//end else the user is not Raja
        

               
              

           
                foundTheAnswer = true;
                break; //
            }//end if

        }//end for answerDB
        if (foundTheAnswer == false) {
            if(role==='Raja'){
        
                if (questionsListDB.rows[j].questiontype === 'multipleAnswer') {
                    
                  //prep cells with the answer
                  let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('not yet answered');
                  //start putting answers in
             
         
                  //add the cells to the CSV string
                  for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                      string = string + cells[counterZ] + ','
                      
                  }

             } else {
                 string = string + 'not yet answered' + ','

             }

         }
         else {
            //the user is not Raja and the answer is not found
            if (questionsListDB.rows[j].questiontype === 'multipleAnswer') {
            let cells = new Array(questionsListDB.rows[j].answersarray.length).fill('not yet answered');
            //space out the cells
            
            //add the cells to the CSV string
            for (let counterZ = 0; counterZ < cells.length; counterZ++) {
                string = string + cells[counterZ] + ','
                
            }
            string = string + 'not yet answered' + ',';
        }
        else{
            //the question is not multiple choice
            string = string + 'not yet answered' + ','+'not yet answered' + ',';
        }
        }//end else the user is not Raja and the answer is not found
        }//end for loop for questions 
    }//end for questions
    string = string + '\r\n'
}//end for loop for students

        res.setHeader('Content-disposition', 'attachment; filename=answers.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(string);

    })//end get /quiz/api/getAllAnswers





    app.get('/answers/api/delete', requireAdminPlus, async (req, res) => {
        let username = req.session.user;
        let catagoryName = req.query.catagoryName;
        let text = 'DELETE FROM answers WHERE answers_catagory=$1'
        let values = [catagoryName];
        data = await queryP(text, values);

        res.send('all answers associated with  catagory "' + catagoryName + '" have been deleted')





    })//end get /quiz/api/delete




    async function getCatagories() {

        let text = "SELECT * from catagories"
        let values = [];
        x = await queryP(text, values);
        return x;
    }//end getLowerQuestion


}//end ModelForExport



module.exports = modelForExport;