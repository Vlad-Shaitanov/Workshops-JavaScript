"use strict";

export const musicPlayerInit = () => {
	const audio = document.querySelector(".audio");
	const audioImg = document.querySelector(".audio-img");
	const audioHeader = document.querySelector(".audio-header");
	const audioPlayer = document.querySelector(".audio-player");
	const audioNavigation = document.querySelector(".audio-navigation");
	const audioButtonPlay = document.querySelector(".audio-button__play");
	const audioTimePassed = document.querySelector(".audio-time__passed");
	const audioProgress = document.querySelector(".audio-progress");
	const audioProgressTiming = document.querySelector(".audio-progress__timing");
	const audioTimeTotal = document.querySelector(".audio-time__total");
	const audioVolume = document.querySelector(".audio-volume");
	const audioMute = document.querySelector(".audio-mute");

	const playlist = ["hello", "flow", "speed"];
	/*Массив с плейлистом создан вручную, т.к. нет бэкенда, который
	мог бы обработать папку с файлами*/

	let trackIndex = 0;//Индекс трека, который играет в данный момент

	const loadTrack = () => {
		const isPlayed = audioPlayer.paused;
		const track = playlist[trackIndex];

		audioHeader.textContent = track.toUpperCase();
		audioImg.src = `./audio/${track}.jpg`;
		audioPlayer.src = `./audio/${track}.mp3`;

		if (isPlayed) {
			audioPlayer.pause();
		} else {
			audioPlayer.play();
		}
	};

	const nextTrack = () => {
		if (trackIndex === playlist.length - 1) {
			trackIndex = 0;
		} else {
			trackIndex++;
		}
		loadTrack();
	};

	const prevTrack = () => {
		if (trackIndex !== 0) {
			trackIndex--;
		} else {
			trackIndex = playlist.length - 1;
		}
		loadTrack();
	};

	const addZero = n => n < 10 ? "0" + n : n;

	audioNavigation.addEventListener("click", event => {
		const target = event.target;

		if (target.classList.contains("audio-button__play")) {
			audio.classList.toggle("play");
			audioButtonPlay.classList.toggle("fa-play");
			audioButtonPlay.classList.toggle("fa-pause");

			if (audioPlayer.paused) {
				audioPlayer.play();
			} else {
				audioPlayer.pause();
			}

			const track = playlist[trackIndex];
			audioHeader.textContent = track.toUpperCase();
		}

		if (target.classList.contains("audio-button__prev")) {
			prevTrack();
		}

		if (target.classList.contains("audio-button__next")) {
			nextTrack();
		}
	});

	audioPlayer.addEventListener("ended", () => {
		//Автозапуск след. трека по окончании песни
		nextTrack();
		audioPlayer.play();
	});

	audioPlayer.addEventListener("timeupdate", () => {
		const currentTime = audioPlayer.currentTime;//Текущее время
		const duration = audioPlayer.duration;//Длительность
		const progress = (currentTime / duration) * 100;

		audioProgressTiming.style.width = progress + "%";

		const minutePassed = Math.floor(currentTime / 60) || "0";//Прошло минут
		const secondsPassed = Math.floor(currentTime % 60) || "0";

		const minuteTotal = Math.floor(duration / 60) || "0";//Всего минут
		const secondsTotal = Math.floor(duration % 60) || "0";

		audioTimePassed.textContent = `${addZero(minutePassed)}:${addZero(secondsPassed)}`;
		audioTimeTotal.textContent = `${addZero(minuteTotal)}:${addZero(secondsTotal)}`;
	});

	audioProgress.addEventListener("click", event => {
		const x = event.offsetX;//Координата на прогрессбаре
		const allWidth = audioProgress.clientWidth;//полная ширина прогрессбара
		const progress = (x / allWidth) * audioPlayer.duration;

		audioPlayer.currentTime = progress;
	});


	audioVolume.addEventListener("input", () => {

		const valueVolume = audioVolume.value;
		audioPlayer.volume = valueVolume / 100;
	});

	audioVolume.value = audio.volume * 100;

	musicPlayerInit.stop = () => {
		audioPlayer.pause();
	};
};