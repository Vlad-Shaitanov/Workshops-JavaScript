"use strict";

export const radioPlayerInit = () => {
	const radio = document.querySelector(".radio");
	const radioCoverImg = document.querySelector(".radio-cover__img");
	const radioNavigation = document.querySelector(".radio-navigation");
	const radioHeaderBig = document.querySelector(".radio-header__big");
	const radioItem = document.querySelectorAll(".radio-item");
	const radioStop = document.querySelector(".radio-stop");

	const audio = new Audio();//Экземпляр объекта Audio
	audio.type = "audio/aac";//Принимаемый формат(тип радио)

	radioStop.disabled = true;//По дефолту кнопка СТОП у радио неактивна

	const changeIconPlay = () => {
		if (audio.paused) {
			radio.classList.remove("play");
			radioStop.classList.add("fa-play");
			radioStop.classList.remove("fa-stop");
		} else {
			radio.classList.add("play");
			radioStop.classList.add("fa-stop");
			radioStop.classList.remove("fa-play");
		}
	};

	const selectItem = elem => {
		radioItem.forEach(item => item.classList.remove("select"));
		elem.classList.add("select");
	};

	radioNavigation.addEventListener("change", event => {
		const target = event.target;
		const parent = target.closest(".radio-item");
		const title = parent.querySelector(".radio-name").textContent;//Заголовок блока
		const urlImg = parent.querySelector(".radio-img").src;//Обложка с именем станции

		radioCoverImg.src = urlImg;
		radioHeaderBig.textContent = title;
		selectItem(parent);
		radioStop.disabled = false;
		//Путь к аудиопотоку выдернем из data-атрибута элемента
		audio.src = target.dataset.radioStantion;
		audio.play();
		changeIconPlay();
	});

	radioStop.addEventListener("click", () => {
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
		changeIconPlay();
	});
};