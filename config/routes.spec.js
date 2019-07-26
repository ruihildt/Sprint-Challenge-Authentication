const request = require("supertest");
const server = require('../api/server');
const db = require('../database/dbConfig');

beforeEach(async () => {
	await db('users').truncate();
});

describe('[POST] /api/register endpoint', () => {
	it('adds a new user to the database', () => {
		return request(server)
		.post('/api/register')
		.send({ 
			username: 'One True Gabe', 
			password: '123456'})
		.expect(201)
		.then(res => {
			expect(res.body.id).toBe(1);
		})

	});
});

describe('[POST] /api/login endpoint', () => {

	beforeEach( () => {
		return request(server)
		.post('/api/register')
		.send({
			username: 'DangerMan',
			password: '123456',
		})
		.expect(201);
	});

	it('is able to login with user ', () => {
		return request(server)
			.post('/api/login')
			.send({
				username: 'DangerMan',
				password: '123456',
			})
			.expect(200)
			.then(res => {
				expect(res.body.message).toEqual('Welcome DangerMan!');
			});
	});
});