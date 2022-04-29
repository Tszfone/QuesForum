var register_btn = document.getElementById("register_btn");
            
register_btn.addEventListener("click", registerRequest);
function registerRequest() {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirm_password = document.getElementById("confirm_password");
    let message = document.getElementsByClassName("message")[0];

    if (name.validity.valueMissing) {
        alert("Missing name");
		name.focus();
		return;
    }
    if (email.validity.valueMissing) {
        alert("Missing email");
		email.focus();
		return;
    }
    if (password.validity.valueMissing) {
        alert("Missing password");
		password.focus();
		return;
    }
    if (confirm_password.validity.valueMissing) {
        alert("Missing confirmation");
		confirm_password.focus();
		return;
    }

    if (email.validity.patternMismatch) {
        alert("Invalid email");
		email.focus();
		return;
    }

    if (password.value != confirm_password.value) {
        alert("Passwords are not the same");
		return;
    }

    let init = {
        method: "POST",
        body: "action=register" + "&name=" + name.value + "&email=" + email.value + "&password=" + password.value,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }
    fetch("../php/account.php", init)
    .then(response => {
        if (response.status == 200) {
            response.json().then(msg => {
                message.innerHTML = msg[0]; 
            });
            name.value = "";
            email.value = "";
            password.value = "";
            confirm_password.value = "";
            location.href = "../login_page.html";
        } else {
            console.log("HTTP return status: "+ response.status);
        }
    }).catch (err => {
        console.log(err);
    });
}