"use strict";
//First day

const cartButton = document.querySelector("#cart-button"),
	modal = document.querySelector(".modal"),
	close = document.querySelector(".close"),
	buttonAuth = document.querySelector(".button-auth"),
	modalAuth = document.querySelector(".modal-auth"),
	closeAuth = document.querySelector(".close-auth"),
	logInForm = document.querySelector("#logInForm"),
	loginInput = document.querySelector("#login"),
	userName = document.querySelector(".user-name"),
	buttonOut = document.querySelector(".button-out"),
	cardsRestaurants = document.querySelector(".cards-restaurants"),
	containerPromo = document.querySelector(".container-promo"),
	restaurants = document.querySelector(".restaurants"),
	menu = document.querySelector(".menu"),
	logo = document.querySelector(".logo"),
	cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("delivery");

function toggleModal() {//Переключение модального окна
	modal.classList.toggle("is-open");
}

function toggleModalAuth() {//Включение модального окна аутентификации
	modalAuth.classList.toggle("is-open");
	if (modalAuth.classList.contains("is-open")) {
		disableScroll();
	} else {
		enableScroll();
	}
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

	function logIn(event) {
		event.preventDefault();

		if (loginInput.value.trim()) {
			login = loginInput.value;
			localStorage.setItem("delivery", login);

			toggleModalAuth();
			buttonAuth.removeEventListener("click", toggleModalAuth);
			closeAuth.removeEventListener("click", toggleModalAuth);
			logInForm.removeEventListener("submit", logIn);
			logInForm.reset();
			checkAuth();
		} else {
			loginInput.style.borderColor = "#ff0000";
			loginInput.value = "";
		}
	}

	buttonAuth.addEventListener("click", toggleModalAuth);
	closeAuth.addEventListener("click", toggleModalAuth);
	logInForm.addEventListener("submit", logIn);
	modalAuth.addEventListener("click", function (event) {
		if (event.target.classList.contains("is-open")) {
			toggleModalAuth();
		}
	});
}

function checkAuth() {//Проверка авторизации
	if (login) {
		authorized();
	} else {
		notAuthorized();
	}
}

function createCardRestaurant() {//Создание карточки ресторана
	const card = `
	<a class="card card-restaurant">
						<img src="img/tanuki/preview.jpg" alt="image" class="card-image" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">Тануки</h3>
								<span class="card-tag tag">60 мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									4.5
								</div>
								<div class="price">От 1 200 ₽</div>
								<div class="category">Суши, роллы</div>
							</div>
						</div>
					</a>
	`;
	//Создание новой карточки ресторана
	cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood() {//Создание карточки продукта
	const card = document.createElement('div');
	card.classList.add("card");
	card.insertAdjacentHTML("beforeend", `
	<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Классика</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина,
									салями,
									грибы.
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">510 ₽</strong>
							</div>
						</div>
	`);

	cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
	const target = event.target;
	const restaurant = target.closest(".card-restaurant");

	if (restaurant) {
		containerPromo.classList.add("hide");
		restaurants.classList.add("hide");
		menu.classList.remove("hide");

		cardsMenu.textContent = "";//Очистка меню перед новой отрисовкой

		createCardGood();
		createCardGood();
		createCardGood();
	}
}

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener("click", openGoods);

logo.addEventListener("click", () => {
	containerPromo.classList.remove("hide");
	restaurants.classList.remove("hide");
	menu.classList.add("hide");
});

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();