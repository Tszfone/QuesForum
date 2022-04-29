var login_btn = document.getElementById("login_btn");
            
login_btn.addEventListener("click", loginRequest);
function loginRequest() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let message = document.getElementsByClassName("message")[0];
                
    let init = {
        method: "POST",
        body: "action=login" + "&email=" + email + "&password=" + password,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch('../php/account.php', init)
    .then(response => {
        if (response.status == 200) {
            response.json().then(msg => {
                if (msg.length > 1) {
                    message.innerHTML = "Successful login";
                    let loginInfo = [msg[0], msg[1], msg[2]];
                    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
                    location.href = "../main.html";
                } else {
                    message.innerHTML = msg[0];
                    let loginInfo = [false];
                    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
                }  
                email = "";
                password = "";
            });            
        } else {
            console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log("Fetch error");
    });
                
}