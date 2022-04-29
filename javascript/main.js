var filter = "none";
var loginStatus = false;
var currentUserID = -1;
var currentUserName = "";

window.onload = function() {
    getLoginInfo();
    showAllQuestions();
}

document.getElementById("login").addEventListener("click", goLogin);
function goLogin() {
    location.href = "../login_page.html";
}

document.getElementById("register").addEventListener("click", goRegister);
function goRegister() {
    location.href = "../register_page.html";
}

document.getElementById("logout").addEventListener("click", goLogout);
function goLogout() {
    loginStatus = false;
    currentUserID = -1;
    currentUserName = "";

    let loginInfo = [false];
    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
                

    // hide
    document.getElementById("question_box").style.display = "none";
    document.getElementById("logout").style.display = "none";
    document.getElementById("add_question_btn").style.display = "none";
    document.getElementById("userName").innerHTML = "";
                        
    // display 
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "block";
}


document.getElementById("add_question_btn").addEventListener("click", goNewQuestion);
document.getElementById("postQues").addEventListener("click", goNewQuestion);
function goNewQuestion() {
    location.href = "../new_question.html";
}

function getLoginInfo() {
    let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    if (loginInfo != null) {
         if (loginInfo[0] == true) {
            loginStatus = true;
            currentUserID = loginInfo[1];
            currentUserName = loginInfo[2];

            // display
            document.getElementById("question_box").style.display = "block";
            document.getElementById("logout").style.display = "block";
            document.getElementById("add_question_btn").style.display = "block";
            document.getElementById("userName").innerHTML = currentUserName;
                        
            // hide 
            document.getElementById("login").style.display = "none";
            document.getElementById("register").style.display = "none";
        }
    }
}

document.getElementById("searchIcon").addEventListener("click", showSearchResult);
document.addEventListener("keyup", searchTitle);

function searchTitle(event) {
    if (event.code == "Enter" && searchKey != "") {
        showSearchResult();
    }
}
function showSearchResult() {
    let searchKey = document.getElementById("title_word_filter").value;
    if (searchKey != "") {
        let init = {
            method: "POST",
            body: "action=search" + "&searchKey=" + searchKey,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }
        fetch('../php/queryQuestions.php', init)
        .then(response => {
            if (response.status == 200) {
                response.text().then(msg => {
                    var questions = document.getElementById("questions");
                    questions.innerHTML = msg;  
                    document.getElementById("title_word_filter").value = "";    
                });
            } else {
                    console.log("HTTP return status: "+ response.status);
            }
            }).catch (err => {
                console.log("Fetch error");
        });
    }
}


            
            

document.getElementById("alFilter").addEventListener("click", showAllQuestions);
document.getElementById("mlFilter").addEventListener("click", showAllQuestions);
document.getElementById("syFilter").addEventListener("click", showAllQuestions);
document.getElementById("jsFilter").addEventListener("click", showAllQuestions);
document.getElementById("home").addEventListener("click", showAllQuestions);
document.getElementById("ques").addEventListener("click", showAllQuestions);
function showAllQuestions() {
    if (this.id != undefined) {
        filter = this.id;
    } else {
        filter = "none";
    }

    let init = {
        method: "POST",
        body: "action=showAll" + "&filter=" + filter + "&uid=" + currentUserID,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/queryQuestions.php', init)
    .then(response => {
        if (response.status == 200) {
            response.text().then(msg => {
                var questions = document.getElementById("questions");
                questions.innerHTML = msg;  
                //filter = "none";    
            });
        } else {
            console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log("Fetch error");
    });
}

            
document.getElementById("hot").addEventListener("click", showHotQuestions);
function showHotQuestions() {
    let init = {
        method: "POST",
        body: "action=showHot" + "&filter=" + filter + "&uid=" + currentUserID,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/queryQuestions.php', init)
    .then(response => {
        if (response.status == 200) {
            response.text().then(msg => {
                var questions = document.getElementById("questions");
                questions.innerHTML = msg;  
                filter = "none";    
            });
        } else {
            console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log("Fetch error");
    });
}

function upvoteQuestion(event) {
    if (loginStatus == true) {
        let questionNo = event.target.parentNode.id;
        let qid = questionNo.charAt(questionNo.length-1);
        let upvoteNum = -1;
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

function goQuestion(event) {
    let qid = event.target.parentNode.parentNode.id.slice(3);
    sessionStorage.setItem("qid", qid);
    location.href = "../question_detail.html";
}

function countAnswer() {
    let init = {
        method: "POST",
        body: "action=count" + "&qid=" + qid,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/queryAnswers.php', init)
    .then(response => {
    if (response.status == 200) {
            response.text().then(msg => {
                            
        });
    } else {
            console.log("HTTP return status: "+ response.status);
    }
    }).catch (err => {
        console.log("Fetch error");
    });
}

var qid = -1;
function showAnswersBelow(event) {
    qid = event.target.parentNode.id.slice(3);
    let parentNodeID = event.target.parentNode.id;


    let abma = document.querySelector("#"+parentNodeID+" div:nth-of-type(2)")
    console.log(abma);
    let answersBelow = abma.childNodes[0];
    let ma = abma.childNodes[1];
    let uname = ma.childNodes[0];

    //let uname = document.querySelector("#"+parentNodeID+" div:nth-of-type(2) div:last-of-type p:first-of-type");
    //let ma = document.querySelector("#"+parentNodeID+" div:nth-of-type(3)");

    if (abma.style.display == "none") {
        abma.style.display = "block";
        let init = {
            method: "POST",
            body: "action=showAll" + "&qid=" + qid + "&uid=" + currentUserID,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }
        fetch('../php/queryAnswers.php', init)
        .then(response => {
            if (response.status == 200) {
                response.text().then(msg => {
                answersBelow.innerHTML = msg;   
                
                if (loginStatus == true) {
                    uname.innerHTML = currentUserName;
                    ma.style.display = "block";
                } else {
                    ma.style.display = "none";
                }       
                answersBelow.style.display = "block";       
            });
        } else {
                console.log("HTTP return status: "+ response.status);
        }
        }).catch (err => {
            console.log("Fetch error");
        });

    } else {
        abma.style.display = "none";  
        answersBelow.style.display = "none"; 
        ma.style.display = "none";
    }

    
}

function deleteAnswer(event) {
    
}

function goNewAnsBox(event) {
    let qid = event.target.parentNode.parentNode.parentNode.id.slice(3);
    sessionStorage.setItem("qid", qid);
    location.href ="../question_detail.html"
}
