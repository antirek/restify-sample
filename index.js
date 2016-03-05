var restify = require('restify');
var restifyMongoose = require('restify-mongoose');
var mongoose = require('mongoose');

var server = restify.createServer({
    name: 'restify.mongoose.examples.notes',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Create a simple mongoose model 'Note'
var NoteSchema = new mongoose.Schema({
    title : { type : String, required : true },
    content: { type : String, required : true }
});

var Note = mongoose.model('notes', NoteSchema);

// Now create a restify-mongoose resource from 'Note' mongoose model
var notes = restifyMongoose(Note);

mongoose.connect('mongodb://localhost/myapp');

// Serve resource notes with fine grained mapping control
server.get('/notes', notes.query());
server.get('/notes/:id', notes.detail());
server.post('/notes', notes.insert());
server.patch('/notes/:id', notes.update());
server.del('/notes/:id', notes.remove());

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});