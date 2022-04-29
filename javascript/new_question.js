document.getElementById("submit_btn").addEventListener("click", addQuestion);
function addQuestion() {
    let space = "";
    let title = document.getElementById("title");
    let al = document.getElementById("algorithm");
    let ml = document.getElementById("machine_learning");
    let sy = document.getElementById("system");
    let js = document.getElementById("javascript");
    let content = document.getElementById("content");
                
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
                

        let uid = JSON.parse(sessionStorage.getItem("loginInfo"))[1];
        let userName = JSON.parse(sessionStorage.getItem("loginInfo"))[2];
        let d = new Date();
        let time = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
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
            body: "action=add" + "&space=" + space + "&title=" + title.value + "&content=" + content.value + "&time=" + time + "&creatorid=" + uid + "&creatorName=" + userName,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }
        fetch("../php/queryQuestions.php", init)
        .then(response => {
            if (response.status == 200) {
                response.text().then(msg => {
                    console.log(msg);
                })
                title.value = "";
                al.checked = false;
                ml.checked = false;
                sy.checked = false;
                js.checked = false;
                content.value = "";
                location.href = "../main.html";
            } else {
                console.log("HTTP return status: "+ response.status);
            }
        }).catch (err => {
            console.log(err);
        });      
}