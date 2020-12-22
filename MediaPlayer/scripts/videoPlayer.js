"use strict";

export const videoPlayerInit = () => {
	const videoPlayer = document.querySelector(".video-player");
	const videoButtonPlay = document.querySelector(".video-button__play");
	const videoButtonStop = document.querySelector(".video-button__stop");
	const videoTimePassed = document.querySelector(".video-time__passed");
	const videoProgress = document.querySelector(".video-progress");
	const videoTimeTotal = document.querySelector(".video-time__total");


	const toggleIcon = () => {//Переключение favicon на кнопке play
		if (videoPlayer.paused) {
			videoButtonPlay.classList.remove("fa-pause");
			videoButtonPlay.classList.add("fa-play");
		} else {
			videoButtonPlay.classList.add("fa-pause");
			videoButtonPlay.classList.remove("fa-play");
		}
	};

	const togglePlay = () => {//Переключение плеера плей/пауза
		if (videoPlayer.paused) {
			videoPlayer.play();
		} else {
			videoPlayer.pause();
		}
	};

	const stopPlay = () => {
		videoPlayer.pause();
		videoPlayer.currentTime = 0;
	};

	const addZero = n => n < 10 ? "0" + n : n;

	videoPlayer.addEventListener("click", togglePlay);
	videoPlayer.addEventListener("play", toggleIcon);
	videoPlayer.addEventListener("stop", toggleIcon);
	videoPlayer.addEventListener("timeupdate", () => {
		const currentTime = videoPlayer.currentTime;
		const duration = videoPlayer.duration;

		const minutePassed = Math.floor(currentTime / 60);//Прошло минут
		const secondsPassed = Math.floor(currentTime % 60);

		const minuteTotal = Math.floor(duration / 60);//Всего минут
		const secondsTotal = Math.floor(duration % 60);

		videoProgress.value = (currentTime / duration) * 100;
		videoTimePassed.textContent = `${addZero(minutePassed)}:${addZero(secondsPassed)}`;
		videoTimeTotal.textContent = `${addZero(minuteTotal)}:${addZero(secondsTotal)}`;

	});

	videoProgress.addEventListener("change", () => {
		const duration = videoPlayer.duration;
		const value = videoProgress.value;

		videoPlayer.currentTime = (value * duration) / 100;
	});

	videoButtonPlay.addEventListener("click", togglePlay);

	videoButtonStop.addEventListener("click", stopPlay);

};