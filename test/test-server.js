global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({ name: 'Broad beans' }, { name: 'Tomatoes' }, { name: 'Peppers' }, function() {
                done();
            });
        });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                //res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                //res.body[3].name.should.equal('Zucchini');
                done();
            });
    });
    it('should add an item on post', function(done) {
        chai.request(app)
            .post('/items')
            .send({ 'name': 'Kale' })
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                //res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .get('/items/')
            .end(function(err, res) {
                var tomato = res.body[2];
                chai.request(app)
                    .put('/items/' + tomato._id)
                    .send({ 'name': 'coffee' })
                    .end(function(err, res) {
                        should.equal(err, null);
                        res.should.have.status(200);
                        res.should.be.json;
                        console.log(res.body, 'spsps');
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.name.should.be.a('string');
                        //res.body.id.should.be.a('number');
                        res.body.name.should.equal('coffee');
                        done();
                    });
            })
    });
    it('should delete and item on delete', function(done) {
        chai.request(app)
            .get('/items/')
            .end(function(err, res) {
                var tomato = res.body[2];
                chai.request(app)
                    .delete('/items/' + tomato._id)
                    .end(function(err, res) {
                        should.equal(err, null);
                        res.should.have.status(204);
                        console.log(res.body);
                        //res.should.be.json;
                        //res.body.should.be.a('array');
                        //res.body.should.have.length(3);
                        done();
                    });
            });
    });
    //
});
