http.createServer(function(request, response) { 
	var request_url = url.parse(request.url).pathname; 
	request_url = request_url.replace('/', '');
	var query = decodeURIComponent(url.parse(request.url).query)	;
	var ip ='';
	var ip ='';
	function command(text) {
		if (request_url == text) {
			return true;
		}
		else { 
			return false;
		}
	}

	if (request_url ==""){ 
		response.writeHead(200); 
		response.write('root SE 3002 test'); 
		response.end(); 
		return
	};

	if (request_url =="registration"){ 
		let usernameExist = 0;
		query = query.replaceAll('reg_', '').replaceAll('&',', ');
		const readFilePromise = new Promise((resolve, reject) => {
			fs.readFile('users.txt', 'utf8', function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
		readFilePromise.then(data => {
			const lines = data.split('\n');
			for (let line of lines) {
				const parts = line.split(',');
				const username = parts[0].trim();
				if (query.split(',')[0] == username){
					usernameExist = 1;
				}
			}
			return;
		}).then(() => {
			if (!query.includes('username=') || !query.includes('password=') || !query.includes('name=')){
				response.writeHead(302, { 'Location': 'https://se.kobets.info/' });
					response.end();
					return;
			}
			if (usernameExist == 1){
				response.writeHead(200, {'Content-Type': 'text/plain'});
				response.end('reg_status=rejected');
				return;
			}
			else if (usernameExist == 0){
				fs.appendFile('users_points.txt', query.split(', ')[0] + ', ' + query.split(', ')[2] + ', points=-\n', (err) => {
					if (err) {
					  console.error('Ошибка записи в файл:', err);
					} else {
					  console.log('Пользователь успешно записан в файл users_points.txt.');
					}
				});
				response.writeHead(200, {'Content-Type': 'text/plain'});
				fs.appendFile('users.txt', query.split(', ')[0] + ', ' + query.split(', ')[1] + '\n', function (err) {
					if (err) throw err;
					console.log('Пользователь успешно записан в файл users.txt'); 
				});
				response.end('reg_status=accepted'); 
				return;
			}
		});
		return;
	}

	if (request_url =="login"){ 
		query = query.replaceAll('login_', '').replace('&',', ');
		let usernameCheck = 0;
		const readFilePromise = new Promise((resolve, reject) => {
			fs.readFile('users.txt', 'utf8', function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
		readFilePromise.then(data => {
			const lines = data.split('\n');
			for (let line of lines) {
				if (query == line){
					usernameCheck = 1;
					username = line.split(',')[0].split('=')[1];
				}
			}
			return;
		}).then(() => {
			if (usernameCheck == 0){
				response.writeHead(200, {'Content-Type': 'text/plain'});
				response.end(`, login_status=rejected`);
				return;
			}
			else if (usernameCheck == 1){
				response.writeHead(200, {'Content-Type': 'text/plain'});
				response.end(`${username}, login_status=ok`);
				return;
			}
		});
		return;
	}

	if (request_url =="get_panorama"){ 
		const readFilePromise = new Promise((resolve, reject) => {
			fs.readFile('se_panoramas.txt', 'utf8', function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
		let truePoint = [];
		let pointInfo = [];
		readFilePromise.then(data => {
			const lines = data.trim().split('\n');
			const arrays = lines.map(line => JSON.parse(line));
			while (truePoint.length < 5) {
				const randomIndex = Math.floor(Math.random() * arrays.length);
				const randomCoord = arrays[randomIndex].coordinates;
				if (!truePoint.includes(randomCoord)) {
					truePoint.push(randomCoord);
					pointInfo.push(arrays[randomIndex].info)
				}
			}
			console.log(`${truePoint[0]}; ${pointInfo[0]}; ${truePoint[1]}; ${pointInfo[1]}; ${truePoint[2]}; ${pointInfo[2]}; ${truePoint[3]}; ${pointInfo[3]}; ${truePoint[4]}; ${pointInfo[4]}`);
			return;
		}).then(() => {
			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.end(`${truePoint[0]}; ${pointInfo[0]}; ${truePoint[1]}; ${pointInfo[1]}; ${truePoint[2]}; ${pointInfo[2]}; ${truePoint[3]}; ${pointInfo[3]}; ${truePoint[4]}; ${pointInfo[4]}`);
			return;
		});
		return;
	}

	if (request_url =="points"){
		query = query.replace('&',', ');
		const username = query.split(', ')[0].split('=')[1];
		const points = query.split(', ')[1].split('=')[1];
		try {
			let num = parseInt(query.split(', ')[1].split('=')[1]); 
			} catch (error) {
				return;
		}
		let newPoints;
		fs.readFile('users_points.txt', 'utf8', function(err, data) {
			if (err) throw err;
			const lines = data.split('\n');
			for (let i = 0; i < lines.length; i++) {
				if (lines[i].startsWith('username=' + username)) {
					const name = (lines[i].split(', ')[1].split('=')[1]);
					if (lines[i].split(', ')[2].split('=')[1]=='-'){
						newPoints = points;
					}	else {
						newPoints = Math.round((parseInt(lines[i].split(', ')[2].split('=')[1], 10)+parseInt(points))/2);
					}
					if (newPoints > 5000){
						newPoints = 5000;
					}
					lines[i] = 'username=' + username + ', name=' + name + ', points=' + newPoints;
					break;
				}
			}
			const updatedData = lines.join('\n');
			fs.writeFile('users_points.txt', updatedData, (err) => {
				if (err) throw err;
				console.log('Points обновлены');
			});
		});
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end();
		return;
	}

	if (request_url =="leaderboard"){
		const data = fs.readFileSync('users_points.txt', 'utf8');
		const lines = data.split('\n');
		const currentUsername = query;
		let currentName;
		const filteredLines = lines.filter(line => line.trim() !== '' && !line.includes('points=-')).map(line => {
			const [username, name, pointsStr] = line.split(', ');
			if (pointsStr.split('=')[1] == '-'){
				const points = pointsStr.split('=')[1]
				return { name, points };
			}
			const points = parseInt(pointsStr.split('=')[1], 10);
			return { name, points };
		});
		for (line of lines){
			if (line.startsWith('username=' + currentUsername)) {
				currentName = (line.split(', ')[1].split('=')[1]);
				break;
			}
		}
		filteredLines.sort((a, b) => b.points - a.points);
		const topUsers = filteredLines.slice(0, 20);
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end(JSON.stringify(topUsers) + '&currentName=' + currentName);
		return;
	}

	if (request_url =="change_name"){
		let usernameCheck = 0;
		let currentName
		query = query.replaceAll('chg_', '').replaceAll('&',', ').replaceAll('+',' ');
		let usernamePassword = `${query.split(', ')[0]}, ${query.split(', ')[1]}`
		let newName = query.split(', ')[2].split('=')[1];
		let currentUsername = query.split(', ')[0].split('=')[1];
		const readFilePromise = new Promise((resolve, reject) => {
			fs.readFile('users.txt', 'utf8', function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
		readFilePromise.then(data => {
			const lines = data.split('\n');
			for (let line of lines) {
				if (line == usernamePassword){
					usernameCheck = 1;
				}
			}
			return;
		}).then(() => {
			console.log(usernameCheck);	
			if (usernameCheck == 0){
				response.writeHead(302, { 'Location': 'https://se.kobets.info/?change_name_status=rejected' });
				response.end();
				return;
			}
			else if (usernameCheck == 1){
				fs.readFile('users_points.txt', 'utf8', function(err, data) {
					if (err) throw err;
					const lines = data.split('\n');
					for (let i = 0; i < lines.length; i++) {
						if (lines[i].includes('name=' + currentUsername + ', ')) {
							const points = (lines[i].split(', ')[2].split('=')[1]);
							lines[i] = 'username=' + currentUsername + ', name=' + newName + ', points=' + points;
							console.log('lines', lines[i]);
							break;
						}
					}
					const updatedData = lines.join('\n');
					fs.writeFile('users_points.txt', updatedData, (err) => {
						if (err) throw err;
					});
				});
				response.writeHead(302, { 'Location': 'https://se.kobets.info/?change_name_status=accepted' });
				response.end(); 
				return;
			};
		});
		return;
	}
	
	if (!request_url =="/"){ 
		var filename = path.join(process.cwd(), name); 
		bot.sendMessage(105020314, "filename=" + filename) 
		fs.readFile(filename, "binary", function(err, file) { 
			if(err) { 
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				bot.sendMessage(105020314, "Server error "+name+" \n "+err)
				return;
			}
		})
		response.writeHead(200); 
		response.write(file); 
		response.end(); 
		return
	};
	response.writeHead(404); 
	response.write("URL not found " + request_url +" !\n "); 
	response.end(); 
}).listen(port); 