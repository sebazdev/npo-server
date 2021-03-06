const db = require('../models/index');
const { Organization, Socialmediacontact, User } = require('../models/index');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const api = supertest(app);

const initial = [

    {
        name: "Zonas grises",
        image: "image.jpg",
        address: "cll 123",
        welcomeText: "info organization",
        socialmedia: {
            facebook: "https://www.facebook.com/",
            instagram: "https://www.instagram.com/",
            linkedin: "https://www.linkedin.com/" 
        }
    }
    
]

beforeAll(async () => {

    await Organization.destroy({where: {}})
    await Socialmediacontact.destroy({where: {}})
    
    const organizationCreated = await Organization.create({
        
        name: initial[0].name,
        image: initial[0].image,
        address: initial[0].address,
        welcomeText: initial[0].welcomeText
        
    });
    
    const socialmediaUpdate = await Socialmediacontact.create({

        facebook: initial[0].socialmedia.facebook,
        instagram: initial[0].socialmedia.instagram,
        linkedin: initial[0].socialmedia.linkedin,
        organizationId: organizationCreated.id

    });

})

describe('/organizations/public',() => {

    test('GET status 200 connection successful', async () => {

        await api
        .get('/organizations/public')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    })

    test('PUT authorized token and id exist', async () => {

        const { name, image, address, welcomeText } = initial[0];
        
        const user = await User.findOne({
            where: { email: 'jonathan@email.com' }
        });

        const token = jwt.sign({
            id: user.dataValues.id, roleId: user.dataValues.roleId
            }, process.env.SECRET
        );

        const organizationId = await Organization.findOne({attributes: ['id']})
    
        await api
        .put(`/organizations/${organizationId}`)
        .set('authorization', `Bearer ${token}`)
        .send({name: 'editado', image: 'editado.png', address:'editado 123', welcomeText: 'hola'})
        .expect(200)
        .expect('Content-Type', /application\/json/)

    })

})

afterAll(() => {
    
    db.sequelize.close();

})
