var qid = -1;
var loginStatus = false;
var currentUserID = -1;
var currentUserName = "";

window.onload = function() {
    getQuestionInfo();
    showQuestion();
    showAnswer();
}

function getQuestionInfo() {
    let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    qid = sessionStorage.getItem("qid");
        
    if (loginInfo != null) {
        if (loginInfo[0] == true) {
            loginStatus = true;
            currentUserID = loginInfo[1];
            currentUserName = loginInfo[2];
        } else {
            loginStatus = false;
            currentUserID = -1;
            currentUserName = "";
        }
    }
}

function showQuestion() {
    let init = {
        method: "POST",
        body: "action=showOne" + "&qid=" + qid + "&uid=" + currentUserID,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/queryQuestions.php', init)
    .then(response => {
        if (response.status == 200) {
            response.text().then(msg => {
                let questionBox = document.getElementById("question_detail_box");
                questionBox.innerHTML = msg; 
                let creatorID = document.querySelector(".createInfo p").id;
                if (loginStatus == true && creatorID == currentUserID) {
                    document.getElementById("delete_btn").style.display = "inline";
                    document.getElementById("edit_btn").style.display = "inline";
                } else {
                    document.getElementById("delete_btn").style.display = "none";
                    document.getElementById("edit_btn").style.display = "none";
                }
            });
        } else {
            console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log("Fetch error");
    });
}

function showAnswer() {
    let init = {
        method: "POST",
        body: "action=showAll" + "&qid=" + qid + "&uid=" + currentUserID,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/queryAnswers.php', init)
    .then(response => {
        if (response.status == 200) {
            response.text().then(msg => {
            var answers = document.getElementById("answer_boxes");
            answers.innerHTML = msg;   
                            
            if (loginStatus == true) {
                document.getElementById("uname").innerHTML = currentUserName;
                document.getElementById("my_answer_box").style.display = "block";
            } else {
                    document.getElementById("my_answer_box").style.display = "none";
            }              
        });
    } else {
            console.log("HTTP return status: "+ response.status);
    }
    }).catch (err => {
        console.log("Fetch error");
    });
}

function deleteAnswer(event) {
    let aid = event.target.parentNode.id.slice(3);
    let init = {
        method: "POST",
        body: "action=delete" + "&aid=" + aid + "&qid=" + qid,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/queryAnswers.php', init)
    .then(response => {
        if (response.status == 200) {
            showAnswer();
        } else {
                console.log("HTTP return status: "+ response.status);
        }
        }).catch (err => {
            console.log("Fetch error");
    });
}

             
function showEditor() {
    let qtitle = document.querySelector(".content h3").innerHTML;
    let qcontent = document.querySelector(".content p").innerHTML;
    document.getElementById("title").value = qtitle;
    document.getElementById("questionContent").value = qcontent;
    document.getElementById("questionEditor").style.display = "block";
    document.getElementById("question_detail_box").style.display = "none";
}

document.getElementById("question_submit_btn").addEventListener("click", editQuestion)
function editQuestion() {
    let space = "";
    let title = document.getElementById("title");
    let al = document.getElementById("algorithm");
    let ml = document.getElementById("machine_learning");
    let sy = document.getElementById("system");
    let js = document.getElementById("javascript");
    let content = document.getElementById("questionContent");
                
    if (title.validity.valueMissing) {
        alert("Missing title");
		title.focus();
		return;
    }

    let selected = false;
    if (al.checked) {
        selected = true;
    } else if (ml.checked) {
        selected = true;
    } else if (sy.checked) {
        selected = true;
    } else if (js.checked) {
        selected = true;
    }
    if (selected == false) {
        alert("Missing space");
        return;
    }

    if (content.value == "") {
        alert("Missing content");
		content.focus();
		return;
    }
                
    if (al.checked) {
        space = al.value;
    } else if (ml.checked) {
        space = ml.value;
    } else if (sy.checked) {
        space = sy.value;
    } else if (js.checked) {
        space = js.value;
    }
                
                
    let init = {
        method: "POST",
        body: "action=edit" + "&space=" + space + "&title=" + title.value + "&content=" + content.value + "&qid=" + qid,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch("../php/queryQuestions.php", init)
    .then(response => {
        if (response.status == 200) {
            title.value = "";
            al.checked = false;
            ml.checked = false;
            sy.checked = false;
            js.checked = false;
            content.value = "";
            document.getElementById("questionEditor").style.display = "none";
            document.getElementById("question_detail_box").style.display = "block";
            showQuestion();
        } else {
            console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log(err);
    });      
}
            

function deleteQuestion() {
    let init = {
        method: "POST",
        body: "action=delete" + "&qid=" + qid,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/queryQuestions.php', init)
    .then(response => {
        if (response.status == 200) {
            location.href = "../main.html";
        } else {
            console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log("Fetch error");
    });
}

function upvoteQuestion(event) {
    if (loginStatus == true) {
        let init = {
            method: "POST",
            body: "action=upvote" + "&qid=" + qid + "&uid=" + currentUserID,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }
        fetch('../php/updateQuestion.php', init)
        .then(response => {
            if (response.status == 200) {
                response.json().then(msg => {
                event.target.innerHTML = msg[0];   
            });
            } else {
                console.log("HTTP return status: "+ response.status);
            }
        }).catch (err => {
            console.log("Fetch error");
        });
    }
}

function showNewAnsBox() {
    if (document.getElementById("new_answer_box").style.display == "none") {
        document.getElementById("new_answer_box").style.display = "block";
        document.getElementById("postAns").style.display = "none";
    } else {
        document.getElementById("new_answer_box").style.display = "none";
        document.getElementById("myAnswer").value = "";
        document.getElementById("postAns").style.display = "block";
    }
}

document.getElementById("submit_ans_btn").addEventListener("click", postAnswer);
function postAnswer() {
    let myAns = document.getElementById("myAnswer");
    if (myAns.validity.valueMissing) {
        alert("Missing answer");
		confirm_password.focus();
		return;
    }
                
    let d = new Date();
    let time = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
                
    let init = {
        method: "POST",
        body: "action=postAns" + "&qid=" + qid + "&answer=" + myAns.value + "&uid=" + currentUserID + "&uname=" + currentUserName + "&time=" + time,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }

    fetch('../php/queryAnswers.php', init)
    .then(response => {
        if (response.status == 200) {
            myAns.value = "";
            document.getElementById("new_answer_box").style.display = "none";
            document.getElementById("postAns").style.display = "block";
            showAnswer();  
        } else {
                console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log(err);
    });       
}