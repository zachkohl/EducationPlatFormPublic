
function modelForExport(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    queryP = config.queryP;
    pool = config.pool;
    sgMail = config.sgMail;
    requireBasicPlus = config.requireBasicPlus;
    requireMiddlePlus = config.requireMiddlePlus;
    requireAdminPlus = config.requireAdminPlus;
    checkSessionNolayoutChange = config.checkSessionNolayoutChange;



    function flag(string) {
        console.log("flag: " + string)
    }


    app.get('/quiz', checkSession, (req, res) => {
        //Setup the actual quiz page, remember most of the content comes via AJAX later

        username = req.session.user;
        let text = "SELECT users_catagory from users WHERE users_username=$1"
        let values = [username];
        query(text, values, callback);
        function callback(data) {
            catagory = data.rows[0].users_catagory;
            let text = "SELECT * from catagories WHERE catagories_name=$1"
            let values = [catagory];
            query(text, values, callback2);
            function callback2(data2) {
                //console.log(data2.rows)
                color = data2.rows[0].catagories_color;
                res.render('quiz', { bgcolor: color })
            }//endcallback2
        }//end callback1


    });//end app.get quiz:id


    app.get('/quiz/api/getQustion', checkSession, async (req, res) => {
        let username = req.session.user;
        let requestedQid = req.query.questionId;

        //get the user's info
        userData = await getUserData(username);
        catagory = userData.catagory;
        highestLevel = userData.highestLevel;

        //3 possibilities, we grab the requested question (if requested), we grab the question equal to the user's rank, or we set the users rank equal to the lowest question
        let package = {};
        if (requestedQid != "noId") {
            question = await getQuestionById(requestedQid, highestLevel, catagory);
            package = await processQuestion(question, catagory);
        }

        else {
            question = await getQuestionByLevel(catagory, highestLevel)
            if (question == 'noQuestionofThatLevel') {
                newLevel = await setUserToLowestLevel(username, catagory);
                newQuestion = await getQuestionByLevel(catagory, newLevel);
                package = await processQuestion(newQuestion, catagory)
            } else {
                package = await processQuestion(question, catagory);
            }
        }//end else !=noId

        res.send(package)
    })//end get /quiz/api/getQustion

    async function processQuestion(question, catagory) {
        //1: add message describing if back and/or forward button should be built
        //2: get id's for backward and forward button
        //3: strip correct answer info and send the package
        if (question == 'invalid address') {
            return 'invalid address';
        }

        qustionId = question.rows[0].questions_id;
        JSONblob = question.rows[0].questions_info;


        questionLevel = JSONblob.questionOrder;



        let lowerQuestion = getLowerQuestion(catagory, questionLevel);
        let higherQuestion = getHigherQuestion(catagory, questionLevel);
        [lowerQuestion, higherQuestion] = [await lowerQuestion, await higherQuestion];



        //build proper return object


        if (lowerQuestion.rowCount == 0) {
            JSONblob.isLowerQuestion = false;
        } else {
            JSONblob.isLowerQuestion = true;
            JSONblob.lowerQuestionId = lowerQuestion.rows[0].questions_id;
        }

        if ((higherQuestion.rowCount == 0)) {
            JSONblob.isHigherQuestion = false;
        } else if (higherQuestion.rows[0].questions_info.questionOrder > highestLevel) {
            console.log('higherQuestion.rows[0].questions_info.questionOrder > highestLevel')
            JSONblob.isHigherQuestion = false;
        }
        else {
            JSONblob.isHigherQuestion = true;
            JSONblob.higherQuestionId = higherQuestion.rows[0].questions_id;
        }


        answersArray = JSON.parse(JSONblob.answersArray)
        newAnwersArray = [];
        for (i = 0; i < answersArray.length; i++) {
            let newAnswer = [answersArray[i][0], answersArray[i][1]];
            newAnwersArray.push(newAnswer);
        }
        JSONblob.answersArray = newAnwersArray
        JSONblob.questionId = qustionId;
        JSONblob.color = question.rows[0].questions_color;



        return JSONblob;

    }//end process question




    async function setUserToLowestLevel(username, catagory) {
        text = "SELECT * from questions WHERE $1 =  ANY (questions_catagories) ORDER BY (questions.questions_info ->>'questionOrder')::numeric ASC LIMIT 1";
        values = [catagory];
        x = await queryP(text, values);

        let lowestLevel = x.rows[0].questions_info.questionOrder;
        updatedLevel = await updateLevel(username, lowestLevel)

        return updatedLevel;
    }




    async function updateLevel(username, lowestLevel) {
        let text = "UPDATE users SET users_highestLevel= $1 WHERE users_username=$2 RETURNING *"
        let values = [lowestLevel, username];
        x = await queryP(text, values);
        let NewlowestLevel = x.rows[0].users_highestlevel;
        return NewlowestLevel;

    }//end updateLevel


    async function getQuestionByLevel(catagory, highestLevel) {
        let text = "SELECT * from questions WHERE $1 =  ANY (questions_catagories) AND (questions.questions_info ->>'questionOrder')::numeric =$2 ORDER BY (questions.questions_info ->>'questionOrder')::numeric ASC LIMIT 1"
        let values = [catagory, highestLevel];
        x = await queryP(text, values);
        if (x.rowCount == 0) {
            console.log('no question of that level and catatagory')
            return 'noQuestionofThatLevel'
        } else {

            return x;
        }

    }//end getQuestionById


    async function getQuestionById(requestedQid, highestLevel, catagory) {

        let text = "SELECT * from questions where questions_id = $1 AND $2 =ANY(questions_catagories)"
        let values = [requestedQid, catagory];
        x = await queryP(text, values);
        if (x.rowCount == 0) {
            console.log('no row matches that question Id')
            return 'invalid address'; //the id pointed to something they are not authorized to see

        } else if (x.rows[0].questions_info.questionOrder > highestLevel) {
            return 'invalid address';
        }
        else {
            // console.log(x.rows[0].questions_info.questionOrder);
            // console.log(highestLevel)
            return x;
        }

    }//end getQuestionById







    app.post('/quiz/api/submitAnswer', checkSession, async (req, res) => {
        console.log('submitAnswer triggered')
        username = req.session.user;
        questionId = req.body.questionId
       
        answer = req.body.answer;

        //get user info and get question info
        let userData = await getUserData(username);

        //check to make sure user is authorized to see question
        catagory = userData.catagory;
        users_id = userData.users_id;
        highestlevel = userData.highestLevel;
        console.log(highestlevel)
        let question = await getQuestionById(questionId, highestlevel, catagory);
        if (userData.highestLevel < question.rows[0].questions_info.questionOrder) {
            console.log('user level is less than requested question')
            res.send('unauthorized to view this question')
            return
        }
        for (let i = 0; i < question.rows[0].questions_catagories.length; i++) {
            if (question.rows[0].questions_catagories[i].match(userData.catagory)) {
                break
            }//end if
            if (i == question.rows[0].questions_catagories.length) {
                res.send('unauthorized to view this question')
                return
            }
        }//end for loop
        //finished checking that question is authorized


        //log answer
        //3 ways this works, depends on question type
        logAnswer(afterLogAnswer);
    
        async function logAnswer(afterLogAnswer){
            console.log('logAnswer triggered')
        switch (question.rows[0].questions_info.questionType) {
            case 'mchoice':
                let text1 = "INSERT INTO answers (answers_catagory,answers_questions_id,answers_answer,answers_users_id) VALUES ($1,$2,$3,$4)"
                let values1 = [catagory, questionId, answer, users_id];
                const client = await pool.connect()
                try {
                    response = await client.query(text1, values1)
                    
                }
                catch (e) {
                    if (e.code == '23505') {
                        console.log('answer already logged for this question/user/catagory')
                    }
                    else {
                        console.log(e.stack)
                    }
                }
                finally {
                    client.release();
                    afterLogAnswer();
                }

                break;
            case 'multipleAnswer':
                answerPrepped = answer;
                answerPrepped = `"""` + answerPrepped + `"""`;
                let text2 = "INSERT INTO answers (answers_catagory,answers_questions_id,answers_answer,answers_users_id) VALUES ($1,$2,$3,$4)"
                let values2 = [catagory, questionId, answerPrepped, users_id];
                const client2 = await pool.connect()
                try {
                    response = await client2.query(text2, values2)
                   
                }
                catch (e) {
                    if (e.code == '23505') {
                        console.log('answer already logged for this question/user/catagory')
                    }
                    else {
                        console.log(e.stack)
                    }
                }
                finally {
                    client2.release();
                    afterLogAnswer();
                }

                break;
            case 'essay':
                answerPreppedForEssay = answer;
                answerPreppedForEssay = answerPreppedForEssay.replace('"', `'`)
                answerPreppedForEssay = `"""` + answerPreppedForEssay + `"""`;
                let notGradded = "not yet graded"
                let text3 = "INSERT INTO answers (answers_catagory,answers_questions_id,answers_answer,answers_users_id,answers_submittedEssay,answers_needsgrading) VALUES ($1,$2,$3,$4,$5,$6)"
                let values3 = [catagory, questionId, answerPreppedForEssay, users_id, answer, true];
                const client3 = await pool.connect()
                try {
                    response = await client3.query(text3, values3)
                  
                }
                catch (e) {
                    if (e.code == '23505') {
                        console.log('answer already logged for this question/user/catagory')
                    }
                    else {
                        console.log(e.stack)
                    }
                }
                finally {
                    client3.release();
                    afterLogAnswer();
                }
                break;
            case 'announcement':
                afterLogAnswer()
                break;
            default:
                console.log('no recognized question type')
                afterLogAnswer();
        }//end switch based on type
    }//end function logAnswer
async function afterLogAnswer(){

console.log('AfterLogAnswer triggered')

        //Check answer
        questionJSON = question.rows[0].questions_info;
        answersArray = JSON.parse(questionJSON.answersArray);
        if (question.rows[0].questions_info.questionType === 'mchoice') {
            for (i = 0; i < answersArray.length; i++) {
                if (answer === answersArray[i][0]) {
                    if (answersArray[i][2]) {
                        //correctAnswer(userData.catagory,questionJSON,questionId)
                        break
                    }//end if
                    else {
                        res.send('wrong answer')
                        return
                    }//end else

                }//end if comparing answer to possible answers inside array

            }//end forloop
        } //end check if mchoice






        //check if old question
        if (highestlevel > questionJSON.questionOrder) {
            let text2 = "SELECT * from questions WHERE $1 =  ANY (questions_catagories) AND (questions.questions_info ->>'questionOrder')::numeric =$2 ORDER BY (questions.questions_info ->>'questionOrder')::numeric ASC LIMIT 1"
            let values2 = [catagory, highestlevel];

            let frontierQuestion = await queryP(text2, values2)
            // if(frontierQuestion.rowCount == 0){
            //     res.send('survey complete')
            //     return
            // }
            msg = {};
            msg.message = "passed this question"
            msg.correctLocationId = frontierQuestion.rows[0].questions_id
            //msg.nextQuestion = await processQuestion(frontierQuestion,catagory)
            res.send(msg);

            return
        }


        //find next question

        let text3 = "SELECT * from questions WHERE $1 =  ANY (questions_catagories) AND (questions.questions_info ->>'questionOrder')::numeric >$2 ORDER BY (questions.questions_info ->>'questionOrder')::numeric ASC LIMIT 1"
        let values3 = [catagory, highestlevel];

        let nextQuestion = await queryP(text3, values3)

        if (nextQuestion.rowCount == 0) {

            console.log('no more questions in path')
            res.send('no more questions in path')
            return
        };
        NewlowestLevel =  await updateLevel(username, nextQuestion.rows[0].questions_info.questionOrder);
        msg = {};
//build pass option

        msg.answerCorrect = true;
        msg.newQuestionId = nextQuestion.rows[0].questions_id;
        msg.successAlert = questionJSON.successAlert;
        console.log(questionJSON)
        msg.nextQuestion = await processQuestion(nextQuestion, catagory)
        res.send(msg);



}// end function afterLoggAnswer
    });//end submitAnswer

    function prepQuestion(question) {
        newQuestionJSON = question.rows[0].questions_info;
        answersArray = JSON.parse(newQuestionJSON.answersArray)
        newAnwersArray = [];
        for (i = 0; i < answersArray.length; i++) {
            let newAnswer = [answersArray[i][0], answersArray[i][1]];
            newAnwersArray.push(newAnswer);
        }
        newQuestionJSON.answersArray = newAnwersArray
        newQuestionJSON.questionId = question.rows[0].questions_id;
        return newQuestionJSON;
    }//end prep question

    async function getUserData(username) {

        let text = "SELECT users_catagory,users_highestlevel,users_id from users WHERE users_username=$1"
        let values = [username];
        x = await queryP(text, values);
        let userData = {};
        userData.catagory = x.rows[0].users_catagory;
        userData.highestLevel = x.rows[0].users_highestlevel;
        userData.users_id = x.rows[0].users_id;
        //console.log(x)
        return userData;
    }//end getUserData

    async function getLowerQuestion(catagory, questionOrder) {

        let text = "SELECT * from questions WHERE $1 =  ANY (questions_catagories) AND (questions.questions_info ->>'questionOrder')::numeric <$2 ORDER BY (questions.questions_info ->>'questionOrder')::numeric DESC LIMIT 1"
        let values = [catagory, questionOrder];
        x = await queryP(text, values);
        return x;
    }//end getLowerQuestion
    // questionId = await getLowerQuestion(catagory,highestLevel)


    async function getHigherQuestion(catagory, questionOrder) {

        let text = "SELECT * from questions WHERE $1 =  ANY (questions_catagories) AND (questions.questions_info ->>'questionOrder')::numeric >$2 ORDER BY (questions.questions_info ->>'questionOrder')::numeric ASC LIMIT 1"
        let values = [catagory, questionOrder];
        x = await queryP(text, values);
        return x
    }//end getLowerQuestion
    // questionId = await getLowerQuestion(catagory,highestLevel)







}//end ModelForExport



module.exports = modelForExport;