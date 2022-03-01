'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const { uuid } = require('uuidv4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.static(path.resolve(__dirname, 'images')));
app.use(body.json());
app.use(cookie());

const users = {
	'd.dorofeev@corp.mail.ru': {
		email: 'd.dorofeev@corp.mail.ru',
		password: 'password',
		age: 21,
	},
	's.volodin@corp.mail.ru': {
		email: 's.volodin@corp.mail.ru',
		password: 'password',
		age: 24,
		images: [
			'/273153700_118738253861831_5906416883131394354_n.jpeg',
            '/272708814_1158833634855293_1743973316352152210_n.webp.jpg',
            '/272464515_147005761018515_3100264353239753904_n.webp.jpg',
            '/259096143_252774593424446_3292295880799640700_n.jpeg'
		]
	},
	'aleksandr.tsvetkov@corp.mail.ru': {
		email: 'aleksandr.tsvetkov@corp.mail.ru',
		password: 'password',
		age: 27,
		images: [
            '/19984805_468099790230913_7469029070697660416_n.jpeg',
            '/16583858_168051673696142_846500378588479488_n.jpeg'
		],
	},
	'a.ostapenko@corp.mail.ru': {
		email: 'a.ostapenko@corp.mail.ru',
		password: 'password',
		age: 21,
	},
};
const ids = {};

app.post('/sign_up', function (req, res) { // registration
	const password = req.body.password;
	const email = req.body.email;
	const age = req.body.age;
	if (
		!password || !email || !age ||
		!(typeof age === 'number' && age > 10 && age < 100)
	) {
		return res.status(400).json({error: 'Не валидные данные пользователя'});
	}
	if (users[email]) {
		return res.status(400).json({error: 'Пользователь уже существует'});
	}

	const id = uuid();
	const user = {password, email, age, images: []};
	ids[id] = email;
	users[email] = user;

	res.cookie('coocka', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.post('/sign_in', function (req, res) { // login
	const password = req.body.password;
	const email = req.body.email;
	if (!password || !email) {
		return res.status(400).json({error: 'Не указан E-Mail или пароль'});
	}
	if (!users[email] || users[email].password !== password) {
		return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
	}

	const id = uuid();
	ids[id] = email;

	res.cookie('coocka', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(200).json({id});
});

app.get('/me', function (req, res) { // profile page
	const id = req.cookies['coocka'];
	const email = ids[id];
	if (!email || !users[email]) {
		return res.status(401).end();
	}
	res.json(users[email]);
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});