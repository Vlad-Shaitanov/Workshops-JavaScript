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
	cardsMenu = document.querySelector(".cards-menu"),
	restaurantTitle = document.querySelector(".restaurant-title"),
	restaurantRating = document.querySelector(".rating"),
	restaurantPrice = document.querySelector(".price"),
	restaurantCategory = document.querySelector(".category"),
	inputSearch = document.querySelector(".input-search"),
	modalBody = document.querySelector(".modal-body"),
	modalPrice = document.querySelector(".modal-pricetag"),
	buttonClearCart = document.querySelector(".clear-cart");


let login = localStorage.getItem("delivery");

const cart = [];//Корзина

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
		buttonOut.style.display = "";//Кнопка выхода из учетки
		buttonOut.removeEventListener("click", logOut);

		checkAuth();
	}

	userName.textContent = login;//Вывод имени пользователя

	//Убираем кнопку авторизации, если посетитель уже авторизован
	buttonAuth.style.display = "none";

	userName.style.display = "inline";
	buttonOut.style.display = "flex";//Кнопка выхода из учетки
	cartButton.style.display = "flex";

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

function createCardRestaurant({
	image, kitchen, name, price, products, stars,
	time_of_delivery: timeOfDelivery
}) {//Создание карточки ресторана

	const cardRestaurant = document.createElement("a");
	cardRestaurant.className = "card card-restaurant";
	cardRestaurant.products = products;
	cardRestaurant.info = { kitchen, name, price, stars };

	const card = `
		<img src="${image}" alt="${name}" class="card-image" />
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
	`;
	cardRestaurant.insertAdjacentHTML("beforeend", card);
	//Создание новой карточки ресторана
	cardsRestaurants.insertAdjacentElement("beforeend", cardRestaurant);
}

function createCardGood(goods) {//Создание карточки продукта
	//console.log(goods);

	const { //Деструктуризация объекта
		description,
		image,
		name,
		price,
		id,
	} = goods;

	const card = document.createElement('div');
	card.classList.add("card");
	// card.id = id;
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
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
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

			const { name, kitchen, price, stars } = restaurant.info;

			restaurantTitle.textContent = name;
			restaurantRating.textContent = stars;
			restaurantPrice.textContent = `От ${price} ₽`;
			restaurantCategory.textContent = kitchen;

			getData(`./db/${restaurant.products}`).then(function (data) {
				data.forEach(createCardGood);
			});
		}
	} else {
		toggleModalAuth();
	}
}

function addToCart(event) {
	const target = event.target;
	const buttonAddToCart = target.closest(".button-add-cart");
	if (buttonAddToCart) {
		const card = target.closest(".card");
		const title = card.querySelector(".card-title-reg").textContent;
		const cost = card.querySelector(".card-price").textContent;
		const id = buttonAddToCart.id;

		const food = cart.find(function (item) {
			return item.id === id;
		});
		if (food) {
			food.count += 1;
		} else {
			cart.push({
				id,
				title,
				cost,
				count: 1,
			});
		}
	}
}

function renderCart() {
	modalBody.textContent = "";//Очистка корзины
	cart.forEach(function ({ id, title, cost, count }) {
		const itemCart = `
		<div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
				</div>
		`;
		modalBody.insertAdjacentHTML("afterbegin", itemCart);
	});
	const totalPrice = cart.reduce(function (result, item) {
		return result + (parseFloat(item.cost) * item.count);
	}, 0);

	modalPrice.textContent = totalPrice + " ₽";
}

function changeCount(event) {
	const target = event.target;

	if (target.classList.contains("counter-button")) {
		const food = cart.find(function (item) {
			return item.id === target.dataset.id;
		});

		if (target.classList.contains("counter-minus")) {
			food.count--;
			if (food.count === 0) {
				cart.splice(cart.indexOf(food), 1);
			}
		}

		if (target.classList.contains("counter-plus")) {
			food.count++;
		}
		renderCart();
	}

}

function init() {
	getData("./db/partners.json").then(function (data) {
		data.forEach(createCardRestaurant);
	});

	cartButton.addEventListener("click", function () {
		renderCart();
		toggleModal();
	});

	buttonClearCart.addEventListener("click", function () {
		cart.length = 0;
		renderCart();
	});

	modalBody.addEventListener("click", changeCount);

	cardsMenu.addEventListener("click", addToCart);

	close.addEventListener("click", toggleModal);

	cardsRestaurants.addEventListener("click", openGoods);

	logo.addEventListener("click", () => {
		containerPromo.classList.remove("hide");
		restaurants.classList.remove("hide");
		menu.classList.add("hide");
	});

	checkAuth();
	//Поисковая строка
	inputSearch.addEventListener("keypress", function (event) {
		if (event.charCode === 13) {
			const value = event.target.value.trim();

			if (!value) {
				event.target.style.backgroundColor = "#ff0000";
				event.target.value = "";
				setTimeout(function () {
					event.target.style.backgroundColor = "";
				}, 1500);
				return;
			}
			getData("./db/partners.json")
				.then(function (data) {
					return data.map(function (partner) {
						return partner.products;
					});
				})
				.then(function (linksProducts) {
					cardsMenu.textContent = "";//Очистка меню перед новой отрисовкой
					linksProducts.forEach(function (link) {
						getData(`./db/${link}`)
							.then(function (data) {
								const resultSearch = data.filter(function (item) {
									const name = item.name.toLowerCase();
									return name.includes(value.toLowerCase());
								});

								containerPromo.classList.add("hide");
								restaurants.classList.add("hide");
								menu.classList.remove("hide");

								restaurantTitle.textContent = "Результат поиска";
								restaurantRating.textContent = "";
								restaurantPrice.textContent = "";
								restaurantCategory.textContent = "разная кухня";

								resultSearch.forEach(createCardGood);
							});
					});
				});
		}
	});

}
init();


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