let checkUsername = '';
let currentUsername = '';
let currentName = '';
let login_status = '';
let panoramaArray = [];
let infoArray = [];
let currentRound = 1;
let myMap;
let truePoint;
let guessPoint;
let guessPointArray = [];
let gameScore = [];
let handler;
let handlerPlacemark;
let distance;
let guessPlacemark;
let truePlacemark;
let distanceArray = [];
let stage = 0;
let deleteCount = 0;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

    // Используем параметры на странице

function showPage(pageName) {
    var i, content;
    content = document.getElementsByClassName("content");
    for (i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }
    document.getElementById(pageName).style.display = "block";
}

function hideGame(){
	document.getElementById("map").style.display = "none";
	document.getElementById("player1").style.display = "none";
	document.getElementById("currentRoundText").style.display = "none";
	document.getElementById("gameAccountWarning").style.display = "none";
	document.getElementById("endGameText").style.display = "none";
	document.getElementById("continueButton").style.display = "none";
	document.getElementById("resultText").style.display = "none";
	document.getElementById("nextRoundButton").style.display = "none";
	document.getElementById("confirmGuessButton").style.display = "none";
	document.getElementById("returnButton").style.display = "none";
}

function showPanoramaMapAgain(){
	document.getElementById("map").style.display = "block";
	document.getElementById("player1").style.display = "block";
	document.getElementById("currentRoundText").style.display = "block";
}

function checkGame(){
	if (stage == 0){
		if (currentUsername == ''){
			document.getElementById('accountWarning').style.display = "inline";
		}
		showPage("game");
	} else if (stage == 1){
		hideGame();
		document.getElementById("map").style.display = "block";
		document.getElementById("player1").style.display = "block";
		document.getElementById("currentRoundText").style.display = "block";
		document.getElementById("returnButton").style.display = "inline";
		var content = document.getElementsByClassName("content");
		for (i = 0; i < content.length; i++) {
			content[i].style.display = "none";
		}
	} else if (stage == 2){
		hideGame();
		document.getElementById("map").style.display = "block";
		document.getElementById("resultText").style.display = "block";
		document.getElementById("nextRoundButton").style.display = "inline";
		var content = document.getElementsByClassName("content");
		for (i = 0; i < content.length; i++) {
			content[i].style.display = "none";
		}
	} else if (stage == 3){
		hideGame();
		document.getElementById("map").style.display = "block";
		if (currentUsername == ''){
			document.getElementById("gameAccountWarning").style.display = "block";
		}
		document.getElementById("endGameText").style.display = "block";
		document.getElementById("continueButton").style.display = "inline";
		var content = document.getElementsByClassName("content");
		for (i = 0; i < content.length; i++) {
			content[i].style.display = "none";
		}
	}
}

function sendPostRequest(request_url, Username, Password) {
	  return fetch(`https://se.kobets.info/${request_url}?username=${Username}&password=${Password}`, {
        method: 'POST'
      })
      .then(response => response.text())
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function updateLeaderboard(){
	return fetch(`https://se.kobets.info/leaderboard?${currentUsername}`, {
        method: 'POST'
    })
	.then(response => response.text())
	.then(data => {
		// console.log(data)
		currentName = data.split('&currentName=')[1];
		data = JSON.parse(data.split('&currentName=')[0]).map(obj => {
			const name = obj.name.split('=')[1];
			const points = obj.points;
			return { [name]: points };
		});;
		
		const leaderboard = document.getElementById('leaderboardText');
		data.forEach((item, index) => {
			const name = Object.keys(item)[0];
			const points = item[name];
			if (name == currentName){
				document.getElementById("accountPoints").innerHTML = `Общий счёт: <b>${points}</b>`
			}
			const listItem = document.createElement('div');
            listItem.textContent = `${index + 1}. ${name} | счёт: ${points}`;
            listItem.style.textAlign = "center";
			
			if (index+1==1){
				listItem.style.color = "gold";
				listItem.style.textShadow =  "black 0 0 2px, black 0 0 2px, black 0 0 2px, black 0 0 2px";
			}
			if (index+1==2){
				listItem.style.color = "silver";
				listItem.style.textShadow =  "black 0 0 2px, black 0 0 2px, black 0 0 2px, black 0 0 2px";
			}
			if (index+1==3){
				listItem.style.color = "#CD7F32";
				listItem.style.textShadow =  "black 0 0 2px, black 0 0 2px, black 0 0 2px, black 0 0 2px";
			}
			leaderboard.appendChild(listItem);
			
		});
		if (currentUsername != '') {
			document.getElementById('guestAccount_button').style.display = "none";
			document.getElementById('loggedAccount_button').style.display = "initial";
			document.getElementById('loggedAccount_button').innerText = currentName;
			document.getElementById('greetingsText').innerText = "Здравствуйте, " + currentName + "!";
			document.getElementById('accountWarning').style.display = "none";
		};
	});
}

// function getName(){
	// return fetch(`http://se.kobets.info/get_name?${currentUsername}`, {
        // method: 'POST'
    // }).then(response => response.text())
	// .then(data => {
		// currentName = data;
		// document.getElementById('guestAccount_button').style.display = "none";
		// document.getElementById('loggedAccount_button').style.display = "initial";
		// document.getElementById('loggedAccount_button').innerText = currentName;
		// document.getElementById('greetingsText').innerText = "Здравствуйте, " + currentName + "!";
	// });
// }

window.onload = function() {
	currentUsername = getCookie("currentUsername");
	updateLeaderboard();
	var prevChgInputStatus = getCookie("prevChgInputStatus");
	var prevLoginStatus = getCookie("prevLoginStatus");
	var prevRegInputStatus = getCookie("prevRegInputStatus");
	var prevRegStatus = getCookie("prevRegStatus");
	
	var gameStatus = getCookie("gameStatus");
	
	// console.log(currentUsername);
	
	if (prevRegStatus == 'accepted'){
		showPage('login');
		document.getElementById('login_message').style.display = "block";
		document.cookie = "prevRegStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}
	
	if(prevRegStatus == 'rejected'){
		showPage('registration');
		document.getElementById('reg_message').style.display = "block";
		document.cookie = "prevRegStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}
	
	if (params.change_name_status == 'accepted'){
		location.href = 'https://se.kobets.info';
	}
	
	if (params.change_name_status == 'rejected'){
		showPage('changeName');
		document.getElementById('chg_message').style.display = "block";
	}
	// console.log(prevChgInputStatus);
	if (prevChgInputStatus == "rejected"){
		showPage('changeName')
		document.getElementById('chg_message').innerText = "Пожалуйста, используйте только латинские буквы и цифры";
		document.getElementById('chg_message').style.display = "block";
		document.cookie = "prevChgInputStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}
	
	if (prevLoginStatus == "rejected"){
		showPage("login");
		document.getElementById('login_message').innerText = "Пожалуйста, проверьте правильность написания логина и пароля";
		document.getElementById('login_message').style.display = "block";
		document.cookie = "prevLoginStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}
	
	if (prevRegInputStatus == "rejected"){
		showPage("registration");
		document.getElementById('reg_message').innerText = "Пожалуйста, используйте только латинские буквы и цифры";
		document.getElementById('reg_message').style.display = "block";
		document.cookie = "prevRegInputStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}
	
	if (gameStatus == "ended"){
		showPage("leaderboard");
		document.cookie = "gameStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}

}
function chgInputCheck(event){
	var chg_username = document.getElementById("chg_username").value;
    var chg_password = document.getElementById("chg_password").value;
    var chg_name = document.getElementById("chg_name").value;
	var forbiddenChars = [' ', ',', '=', '"', '\'', '$', '&', '+']; // Список запрещенных символов
	var forbiddenCharsName = [',', '=', '"', '\'', '$', '&', '+']; // Список запрещенных символов 
    for (var i = 0; i < forbiddenChars.length; i++) {
        // console.log('for');
		if ((chg_username.includes(forbiddenChars[i])) || (chg_password.includes(forbiddenChars[i])) || (chg_name.includes(forbiddenCharsName[i]))) {
            // console.log('if');
            event.preventDefault();
			setCookie("prevChgInputStatus", "rejected", 7); // Сохранение в куки
			location.href = 'https://se.kobets.info'; // Прерываем выполнение функции, если найден запрещенный символ
			return;
		}
	}
}

function regInputCheck(event){
	var reg_username = document.getElementById("reg_username").value;
    var reg_password = document.getElementById("reg_password").value;
    var reg_name = document.getElementById("reg_name").value;
	var forbiddenChars = [' ', ',', '=', '"', '\'', '$', '&', '+']; // Список запрещенных символов
	var forbiddenCharsName = [',', '=', '"', '\'', '$', '&', '+']; // Список запрещенных символов 
    for (var i = 0; i < forbiddenChars.length; i++) {
        // console.log('for');
		if ((reg_username.includes(forbiddenChars[i])) || (reg_password.includes(forbiddenChars[i])) || (reg_name.includes(forbiddenCharsName[i]))) {
            // console.log('if');
            event.preventDefault();
			setCookie("prevRegInputStatus", "rejected", 7); // Сохранение в куки
			location.href = 'https://se.kobets.info'; // Прерываем выполнение функции, если найден запрещенный символ
			return;
		}
	}
	event.preventDefault();
	return fetch(`https://se.kobets.info/registration?username=${reg_username}&password=${reg_password}&name=${reg_name}`, {
        method: 'POST'
    }).then(response => response.text()).then(data => {
		if (data.split('=')[1] == 'rejected') {
			setCookie("prevRegStatus", data.split('=')[1], 7);
			location.href = 'https://se.kobets.info';
			return;
		}
		if (data.split('=')[1] == 'accepted') {
			setCookie("prevRegStatus", data.split('=')[1], 7);
			location.href = 'https://se.kobets.info';
			return;
		}
	});
}

function loginCheck(event) {
    event.preventDefault();
	var login_username = document.getElementById("login_username").value;
    var login_password = document.getElementById("login_password").value;
	var forbiddenChars = [' ', ',', '=', '"', '\'', '$', '&', '+']; // Список запрещенных символов

    for (var i = 0; i < forbiddenChars.length; i++) {
        // console.log('for');
		if ((login_username.includes(forbiddenChars[i])) || (login_password.includes(forbiddenChars[i]))) {
            // console.log('if');
            setCookie("prevLoginStatus", "rejected", 7); // Сохранение в куки
			location.href = 'https://se.kobets.info'; // Прерываем выполнение функции, если найден запрещенный символ
			return;
		}
	}
	if (login_username.trim() === "" || login_password.trim() === "") {
        return;
    } else {
    sendPostRequest('login', login_username, login_password)
    .then(data => {
        var checkUsername = data.split(', ')[0]; // Сохранение ответа от сервера в переменной username
        var login_status = data.split(', ')[1].split('=')[1];
        // console.log(checkUsername);
        // console.log(login_status);
        if (checkUsername != '' && checkUsername != null && login_status=="ok") {
            // console.log(checkUsername);
            setCookie("currentUsername", checkUsername, 7); // Сохранение в куки
            // setCookie("currentUsername", checkUsername, 7); // Сохранение в куки
			location.href = 'https://se.kobets.info';
			return;
		} else if (login_status=="rejected") {
			setCookie("prevLoginStatus", login_status, 7); // Сохранение в куки
			location.href = 'https://se.kobets.info';
			return;
		}
		
		
    })
    .catch(error => console.error('Error:', error));  
	
	}
}

function logOut() {
    // Очистить куки с помощью установки срока действия в прошлое время
    document.cookie = "currentUsername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Перезагрузить страницу
    window.location.reload();
}

function createPanoramaPlayer() {
	ymaps.ready(function () {
		// Для начала проверим, поддерживает ли плеер браузер пользователя.
		if (!ymaps.panorama.isSupported()) {
			// Если нет, то просто ничего не будем делать.
			return;
		}
		
		// Ищем панораму в переданной точке.
		 // truePoint.coordinates
		truePoint = panoramaArray[currentRound-1].split(", ");
		// console.log(truePoint);
		ymaps.panorama.locate(truePoint).done(
			function (panoramas) {
				// Убеждаемся, что найдена хотя бы одна панорама.
				if (panoramas.length > 0) {
					// Создаем плеер с одной из полученных панорам.
					panoramas[0]._markers=[];
					const player = new ymaps.panorama.Player(
						'player1',
						// Панорамы в ответе отсортированы по расстоянию
						// от переданной в panorama.locate точки. Выбираем первую,
						// она будет ближайшей.
						panoramas[0],
						// Зададим направление взгляда, отличное от значения
						// по умолчанию.
						{ controls: [], suppressMapOpenBlock: true }
					);
					player.events.add('panoramachange', function () {
						player._engine._panorama._markers.forEach((element) => element.properties._data.name="");
					});
				}	else {
					console.log("Панорама не найдена");
					
				}
			
			},
			function (error) {
				// Если что-то пошло не так, сообщим об этом пользователю.
				alert(error.message);
			}
		);
	})
}

function createMap(){
	return new Promise((resolve, reject) => {	
		ymaps.ready(function () {
			myMap = new ymaps.Map('map', {
				center: [55.751574, 37.573856],
				zoom: 4,
				controls: [],
			}, {
				suppressMapOpenBlock: true,
				yandexMapDisablePoiInteractivity: true
			});
			// guessPlacemark = new ymaps.Placemark(guessPoint, {}, {
				// preset: 'islands#circleIcon',
				// iconColor: '#5353ec'
			// });
			// console.log("map created");
			handler = myMap.events.group()
				.add('click', function(e){
					if (myMap.getZoom() < "12") {
						myMap.setCenter(e.get('coords'));
						myMap.setZoom(12);
					}
					else {
						document.getElementById("confirmGuessButton").style.display = "inline";
						document.getElementById("confirmGuessButton").style.top = ((window.innerHeight-211.22)/100*86) + "px";
						document.getElementById("confirmGuessButton").style.left = ((window.innerWidth-229.812)) + "px";
						// document.getElementById("confirmGuessButton").style.left = "1795px";
						myMap.geoObjects.removeAll();
						guessPoint = e.get('coords');
						// console.log(guessPoint);
						myMap.geoObjects.add(guessPlacemark = new ymaps.Placemark(guessPoint, {}, {
							preset: 'islands#circleIcon',
							iconColor: '#5353ec'
						}));
						handlerPlacemark = guessPlacemark.events.group().add('mouseenter', function(){
							document.getElementById("map").style.clip = "rect(0px, 500px, 475px, 0px)";
						}).add('mouseleave', function(){
						document.getElementById("map").style.clip = "rect(350px, 500px, 475px, 275px)";
						});
					}
				})
				.add('mouseenter', function(){
					document.getElementById("map").style.clip = "rect(0px, 500px, 475px, 0px)";
				})
				.add('mouseleave', function(){
					document.getElementById("map").style.clip = "rect(350px, 500px, 475px, 275px)";
				})
				
				resolve();			
			},
			function (error) {
				// Если что-то пошло не так, сообщим об этом пользователю.
				reject(error);
			}
		);
	});
}

function showPanoramaMap(){
	showPage("player1");
	document.getElementById("player1").style.width = "100%";
	document.getElementById("player1").style.height = ((window.innerHeight-211.22)/100*86) + "px";
	
	showPage("map");
	document.getElementById("returnButton").style.display = "inline";
	document.getElementById("returnButton").style.top = ((window.innerHeight-211.22)/100*86) + "px";
	document.getElementById("returnButton").style.left = ((window.innerWidth-107.812)) + "px";
	document.getElementById("currentRoundText").style.display = "block";
	document.getElementById("currentRoundText").innerText = `Раунд ${currentRound}`;
	document.getElementById("currentRoundText").style.top = ((window.innerHeight-211.22)/100*86+10) + "px";
	document.getElementById("confirmGuessButton").addEventListener("mouseover", function() {
		document.getElementById("map").style.clip = "rect(0px, 500px, 475px, 0px)";
	});
	// document.getElementById("confirmGuessButton").addEventListener("mouseleave", function() {
		// document.getElementById("map").style.clip = "rect(350px, 500px, 475px, 275px)";
	// });
	// document.getElementById("map").addEventListener("mouseout", function() {
    // this.style.transform = "scale(1) translate(0, 0)";
	// });

}

function sendPanoramaRequest() {
		// document.getElementById("gameButton").style.display = "none";
		// document.getElementById("rulesButton").style.display = "none";
		// document.getElementById("guestAccount_button").style.display = "none";
		// document.getElementById("loggedAccount_button").style.display = "none";
		// document.getElementById("leaderboardButton").style.display = "none";
		// document.getElementById("map").style.top = ((window.innerHeight-211.22)/100*86-500+209) + "px";
		document.getElementById('accountWarning').style.display = "none";
		document.getElementById("map").style.top = ((window.innerHeight-211.22)/100*86-500+209+27) + "px";
		document.getElementById("map").style.left = (window.innerWidth-500) + "px";
		stage = 1;
		return fetch(`https://se.kobets.info/get_panorama`, {
			method: 'POST'
		})
		.then(response => response.text())
		.then(data => {
			for (i=0; i < data.split("; ").length; i++) {
				if (!isNaN(data.split("; ")[i].split(",")[0])) {
					panoramaArray.push(data.replaceAll(",",", ").split("; ")[i]);
				} else {
					infoArray.push(data.split("; ")[i]);
				}
				
			}
			// console.log(`Round: ${currentRound}`);
			// console.log(panoramaArray);
			createPanoramaPlayer();
			showPanoramaMap();
			// eventClickOnMap();
			
		})
    .catch(error => console.error('Error:', error));  
	
}

function distanceInMeters(coord1, coord2) {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    const R = 6371; // Радиус Земли в километрах
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    distance = (R * c).toFixed(3);
    distanceArray[currentRound-1] = distance;
	// console.log(distance);
    return distance;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Функция для вычисления очков за расстояние
function getScore(coord1, coord2) {
    distanceInMeters(coord1, coord2);	
    let x0, y0, x1, y1; 
	if (distance<=50){
		x0 = 0.1;
		y0 = 5000;
		x1 = 20;
		y1 = 1000;
	} else if (distance>50){
		x0 = 50;
		y0 = 1000;
		x1 = 200;
		y1 = 0;
	};
	const k = (y0 - y1) / (x0 - x1);
	const b = y0 - k * x0;

	var points = Math.round(k * distance + b);
	if (points>5000) {
		points = 5000;
	}
	if (points<0) {
		points = 0;
	}
	return points;
	
}

function returnToStart(){
	document.getElementById("player1").getElementsByClassName("ymaps-2-1-79-panorama-screen")[deleteCount].style.display = "none";
	deleteCount += 1;
	createPanoramaPlayer();
	showPanoramaMap();
}


function roundResult() {
	// console.log(guessPoint);
	stage = 2;
	guessPointArray[currentRound-1] = guessPoint;
	// centerPoint [0] = (guessPoint[0]+truePoint[0])/2;
	// centerPoint [1] = (guessPoint[1]+truePoint[1])/2;
	// console.log(guessPoint + " " + truePoint);
	gameScore[currentRound-1] = getScore(guessPoint, truePoint);
	// document.getElementById("confirmGuessButton").removeEventListener("mouseleave", function() {
		// document.getElementById("map").style.clip = "rect(350px, 500px, 475px, 275px)";
	// });
	document.getElementById("currentRoundText").style.display = "none";
	document.getElementById("player1").getElementsByClassName("ymaps-2-1-79-panorama-screen")[deleteCount].style.display = "none";
	deleteCount += 1;
	// document.getElementById("map").getElementsByClassName("ymaps-2-1-79-map")[currentRound-1].style.top = "50%".;
	// document.getElementById("map").style.marginTop = "7.55%";
	document.getElementById("map").style.left = ((window.innerWidth-500)/2) + "px";
	document.getElementById("map").style.top = "300px";
	document.getElementById("map").style.clip = "rect(0px, 500px, 475px, 0px)";
	// document.getElementById("nextRoundButton").style.display = "inline";
	document.getElementById("nextRoundButton").style.top = "535px";
	// document.getElementById("nextRoundButton").hover.style.transform = "scale (1.1)";
	if (currentRound == 5){
		document.getElementById("nextRoundButton").innerText = "Закончить игру";
	}
	document.getElementById("confirmGuessButton").style.display = "none";
	document.getElementById("returnButton").style.display = "none";
	document.getElementById("resultText").innerHTML = `Раунд ${currentRound}</br> Расстояние: ${Math.round(distance)}км Счёт: <b>${gameScore[currentRound-1]}</b>`;
	if (distance<1){
		document.getElementById("resultText").innerHTML = `Раунд ${currentRound}</br> Расстояние: ${Math.round(distance*1000)}м Счёт: <b>${gameScore[currentRound-1]}</b>`;
	}
	handler.removeAll();
	handlerPlacemark.removeAll();
	// myMap.behaviors.disable(['drag', 'rightMouseButtonMagnifier'])
	myMap.geoObjects.add(truePlacemark = new ymaps.Placemark(truePoint, {}, {
		preset: 'islands#circleIcon',
		iconColor: '#3caa3c'
	}));
	// myMap.geoObjects.add(new ymaps.Placemark(guessPoint, {}, {
		// preset: 'islands#circleIcon',
		// iconColor: '#5353ec'
	// }));
	// showPage("round_result");
	document.getElementById("resultText").style.display = "block";
	document.getElementById("nextRoundButton").style.display = "inline";
	myMap.geoObjects.add(new ymaps.GeoObject({
		// Описываем геометрию геообъекта.
		geometry: {
			// Тип геометрии - "Ломаная линия".
			type: "LineString",
			// Указываем координаты вершин ломаной.
			coordinates: [
				truePoint,
				guessPoint
			]
		},
		// Описываем свойства геообъекта.
		properties:{
			// Содержимое хинта.
			hintContent: `${distance} км`,
		}
	}, {
		// Задаем опции геообъекта.
		// Включаем возможность перетаскивания ломаной
		// Цвет линии.
		strokeColor: "#ff0000",
		// Ширина линии.
		strokeWidth: 5
	}));
	myCollection = new ymaps.GeoObjectCollection();
	myCollection.add(guessPlacemark);    
	myCollection.add(truePlacemark);    
    myMap.geoObjects.add(myCollection);
    myMap.setBounds(myCollection.getBounds(), {checkZoomRange:true, zoomMargin:2});
	
}

async function endGame(){
	const getAverage = (numbers) => {
			const sum = numbers.reduce((acc, number) => acc + number, 0);
			const length = numbers.length;
			return sum / length;
		};
	userPoints = Math.round(getAverage(gameScore));
	// console.log("userPoints = ", userPoints)
	stage = 3;
	document.getElementById("resultText").style.display = "none";
	document.getElementById("nextRoundButton").style.display = "none";
	document.getElementById("gameAccountWarning").style.display = "block";
	document.getElementById("endGameText").style.display = "block";
	// document.getElementById("endGameText").style.top = "280px";
	document.getElementById("endGameText").style.left = ((window.innerWidth-500)/2+600) + "px";
	document.getElementById("endGameText").innerHTML = `Счёт 1-го раунда: <b>${gameScore[0]}</b></br>Счёт 2-го раунда: <b>${gameScore[1]}</b></br>Счёт 3-го раунда: <b>${gameScore[2]}</b></br>Счёт 4-го раунда: <b>${gameScore[3]}</b></br>Счёт 5-го раунда: <b>${gameScore[4]}</b></br>Итоговый счёт: ${userPoints}`;
	document.getElementById("continueButton").style.display = "inline";
	document.getElementById("continueButton").style.left = ((window.innerWidth-500)/2+600) + "px";;
	if (currentUsername != ''){
		document.getElementById("gameAccountWarning").style.display = "none";
		fetch(`https://se.kobets.info/points?username=${currentUsername}&points=${userPoints}`, {
        method: 'POST'
      })
	}
	myMap.destroy();
	await createMap();
	showPage("map");
	// document.getElementById("map").style.top = "100px";
	document.getElementById("map").style.left = ((window.innerWidth-500)/2-50) + "px";
	document.getElementById("map").style.clip = "rect(0px, 500px, 475px, 0px)";
	console.log("check");
	handler.removeAll();
	handlerPlacemark.removeAll();
	myCollection = new ymaps.GeoObjectCollection();
	for (i = 0; i < currentRound; i++){
		myMap.geoObjects.add(truePlacemark = new ymaps.Placemark(panoramaArray[i].split(", "), {}, {
			preset: 'islands#circleIcon',
			iconColor: '#3caa3c'
		}));
		myMap.geoObjects.add(guessPlacemark = new ymaps.Placemark(guessPointArray[i], {}, {
			preset: 'islands#circleIcon',
			iconColor: '#5353ec'
		}));
		myMap.geoObjects.add(new ymaps.GeoObject({
		// Описываем геометрию геообъекта.
		geometry: {
			// Тип геометрии - "Ломаная линия".
			type: "LineString",
			// Указываем координаты вершин ломаной.
			coordinates: [
				panoramaArray[i].split(", "),
				guessPointArray[i]
			]
		},
		// Описываем свойства геообъекта.
		properties:{
			// Содержимое хинта.
			hintContent: `${distanceArray[i]} км`,
		}
		}, {
			// Задаем опции геообъекта.
			// Включаем возможность перетаскивания ломаной
			// Цвет линии.
			strokeColor: "#ff0000",
			// Ширина линии.
			strokeWidth: 5
		}));
		
		myCollection.add(guessPlacemark);    
		myCollection.add(truePlacemark);    
	};
	myMap.geoObjects.add(myCollection);
    myMap.setBounds(myCollection.getBounds(), {checkZoomRange:true, zoomMargin:2});
	
	
}

function nextRound(){
	if (currentRound == 5) {
		endGame();
		return;
	}
	currentRound += 1;
	stage = 1;
	// console.log(`Round: ${currentRound}`);
	// document.getElementById("player1").getElementsByClassName("ymaps-2-1-79-panorama-screen")[currentRound-2].style.display = "none";
	// document.getElementById("player1").getElementsByClassName("ymaps-2-1-79-panorama-screen")[currentRound-2].style.width = "0px";
	// document.getElementById("player1").getElementsByClassName("ymaps-2-1-79-map")[currentRound-1].style.height = "0px";
	createPanoramaPlayer();
	myMap.destroy();
	createMap();
	showPanoramaMap(); 
	document.getElementById("resultText").style.display = "none";
	document.getElementById("nextRoundButton").style.display = "none";
	document.getElementById("map").style.top = ((window.innerHeight-211.22)/100*86-500+209+27) + "px";
	document.getElementById("map").style.left = (window.innerWidth-500) + "px";
	document.getElementById("map").style.clip = "rect(350px, 500px, 475px, 275px)";
	// document.getElementById("map").getElementsByClassName("ymaps-2-1-79-map")[currentRound].style.display = "none";
	
}

function restartAfterGame() {
	setCookie("gameStatus", "ended", 7);
	window.location.reload();
}