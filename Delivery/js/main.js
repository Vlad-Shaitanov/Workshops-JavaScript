const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
	modal.classList.toggle("is-open");
}

//First day

const buttonAuth = document.querySelector(".button-auth"),
	modalAuth = document.querySelector(".modal-auth"),
	closeAuth = document.querySelector(".close-auth"),
	logInForm = document.querySelector("#logInForm"),
	loginInput = document.querySelector("#login"),
	userName = document.querySelector(".user-name"),
	buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("delivery");

function toggleModalAuth() {//Включение модального окна аутентификации
	modalAuth.classList.toggle("is-open");
}

function authorized() {//Посетитель авторизован
	console.log("Авторизован");

	function logOut() {
		login = null;
		localStorage.removeItem("delivery");
		buttonAuth.style.display = "";
		userName.style.display = "";
		buttonOut.style.display = "";
		buttonOut.removeEventListener("click", logOut);

		checkAuth();
	}

	userName.textContent = login;//Вывод имени пользователя

	//Убираем кнопку авторизации, если посетитель уже авторизован
	buttonAuth.style.display = "none";

	userName.style.display = "inline";
	buttonOut.style.display = "block";//Кнопка выхода из учетки

	buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {//Посетитель не авторизован
	console.log("Не авторизован");

	function logIn(event) {
		event.preventDefault();
		login = loginInput.value;

		localStorage.setItem("delivery", login);

		toggleModalAuth();
		buttonAuth.removeEventListener("click", toggleModalAuth);
		closeAuth.removeEventListener("click", toggleModalAuth);
		logInForm.removeEventListener("submit", logIn);
		logInForm.reset();
		checkAuth();
	}

	buttonAuth.addEventListener("click", toggleModalAuth);
	closeAuth.addEventListener("click", toggleModalAuth);
	logInForm.addEventListener("submit", logIn);
}

function checkAuth() {//Проверка авторизации
	if (login) {
		authorized();
	} else {
		notAuthorized();
	}
}
checkAuth();