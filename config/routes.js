const axios = require('axios');
const bcrypt = require('bcryptjs');

const db = require('../database/dbConfig');
const { authenticate, generateToken } = require('../auth/authenticate');

module.exports = server => {
	server.post('/api/register', register);
	server.post('/api/login', login);
	server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
	const user = req.body;
	user.password = bcrypt.hashSync(user.password, 14);

	db('users')
		.insert(user)
		.then(ids => {
			const [id] = ids;
			db('users')
				.where({ id })
				.first()
				.then(user => {
					const token = generateToken(user);
						res.status(201).json({ id: user.id, token });
				})
				.catch(error => {
						res.status(500).json(error);
				});
		});
}

function login(req, res) {
	let { username, password } = req.body;

	db('users')
		.where('username', username)
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
					const token = generateToken(user);
					res.status(200).json({
							message: `Welcome ${user.username}!`,
							token
					});
			} else {
					res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch(error => {
				res.status(500).json(error);
		});
}

function getJokes(req, res) {
	const requestOptions = {
		headers: { accept: 'application/json' },
	};

	axios
		.get('https://icanhazdadjoke.com/search', requestOptions)
		.then(response => {
			res.status(200).json(response.data.results);
		})
		.catch(err => {
			res.status(500).json({ message: 'Error Fetching Jokes', error: err });
		});
}
