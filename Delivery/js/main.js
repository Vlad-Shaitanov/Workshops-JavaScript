"use strict";
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';
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

const getData = async function (url) {//Работа с базой данных
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Ошибка по адресу ${url},
		статус ошибки ${response.status}!`);
	}
	return await response.json();
};

console.log(getData("./db/partners.json"));

function validName(string) {//Валидация логина
	const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
	return regName.test(string);//Проверка соответствия строки регулярке
}

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

		if (validName(loginInput.value)) {
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

function createCardRestaurant(restaurant) {//Создание карточки ресторана
	const {//Деструктуризация объекта
		image,
		kitchen,
		name,
		price,
		products,
		stars,
		time_of_delivery: timeOfDelivery,
	} = restaurant;

	const card = `
	<a class="card card-restaurant" data-products="${products}">
						<img src="${image}" alt="image" class="card-image" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery}</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>
	`;
	//Создание новой карточки ресторана
	cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood(goods) {//Создание карточки продукта
	console.log(goods);

	const { //Деструктуризация объекта
		description,
		image,
		name,
		price,
	} = goods;

	const card = document.createElement('div');
	card.classList.add("card");
	card.insertAdjacentHTML("beforeend", `
	<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
						</div>
	`);

	cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
	const target = event.target;
	if (login) {
		const restaurant = target.closest(".card-restaurant");
		if (restaurant) {

			cardsMenu.textContent = "";//Очистка меню перед новой отрисовкой
			containerPromo.classList.add("hide");
			restaurants.classList.add("hide");
			menu.classList.remove("hide");

			getData(`./db/${restaurant.dataset.products}`).then(function (data) {
				data.forEach(createCardGood);
			});
		}
	} else {
		toggleModalAuth();
	}
}

function init() {
	getData("./db/partners.json").then(function (data) {
		data.forEach(createCardRestaurant);
	});

	cartButton.addEventListener("click", toggleModal);

	close.addEventListener("click", toggleModal);

	cardsRestaurants.addEventListener("click", openGoods);

	logo.addEventListener("click", () => {
		containerPromo.classList.remove("hide");
		restaurants.classList.remove("hide");
		menu.classList.add("hide");
	});

	checkAuth();

	// === Slider ===

	new Swiper(".swiper-container", {
		slidesPerView: 1,
		loop: true,
		autoplay: true,
		effect: "cube",
		grabCursor: true,
		cubeEffect: {
			shadow: false,
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});
}
init();