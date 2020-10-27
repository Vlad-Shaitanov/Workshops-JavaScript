"use strict";
//Можно исползовать как конастанты в основном файле
window.disableScroll = function () {
	//Получение горизонтального скролла при открытии модального окна
	const widthScroll = window.innerWidth - document.body.offsetWidth;

	document.body.dataset.scrollY = window.scrollY;

	document.body.style.cssText = `
	position: fixed;
	top: ${-window.scrollY}px;
	left:0;
	width: 100%;
	overflow: hidden;
	height: 100vh;
	padding-right: ${widthScroll}px;
	`;
};

window.enableScroll = function () {
	document.body.style.cssText = "position:relative";
	window.scroll({ top: document.body.dbscrollY });
};

