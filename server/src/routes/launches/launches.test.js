const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('Should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect(200)
            .expect('Content-Type', /json/);
        // expect(response.statusCode).toBe(200);
    });
});


describe('Test POST /launch', () => {
    const completeLaunchData = {
        mission: 'USS Enterprise',
        target: 'Kepler-186',
        rocket: 'NCC 1701-D',
        launchDate: 'November 3, 2029',
    };

    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        target: 'Kepler-186',
        rocket: 'NCC 1701-D',
    }

    const launchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        target: 'Kepler-186',
        rocket: 'NCC 1701-D',
        launchDate: 'Hello',
    };

    test('Should respond with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect(201)
            .expect('Content-Type', /json/);


        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(requestDate).toBe(responseDate);
        
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('Should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        });
    });

    test('Should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date',
        });
    });
    


});