var restify = require('restify');
var restifyMongoose = require('restify-mongoose');
var mongoose = require('mongoose');
var jsonform = require('mongoose-jsonform');

var server = restify.createServer({
    name: 'restify.mongoose.examples.notes',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

// Create a simple mongoose model 'Note'
var NoteSchema = new mongoose.Schema({
    title : { type : String, required : true },
    content: { type : String, required : true },
    meta: {
        votes: String,
        favs: String
    }
});

NoteSchema.plugin(jsonform, {
  excludedPaths: ['_id', '__v'] //these paths are generally exceluded
});

var Note = mongoose.model('notes', NoteSchema);

// Now create a restify-mongoose resource from 'Note' mongoose model
var notes = restifyMongoose(Note);

mongoose.connect('mongodb://localhost/myapp');

// Serve resource notes with fine grained mapping control
server.get('/notes', notes.query());

server.get('/notes/schema', function(req, res) {
    var out = (new Note()).jsonform();
    res.end(JSON.stringify(out));
});

server.get('/notes/:id', notes.detail());
server.post('/notes', notes.insert());
server.put('/notes/:id', notes.update());
server.del('/notes/:id', notes.remove());


server.post('/upload', function (req, res) {

    console.log('files:', req.files);
    console.log('sound path:', req.files.sound.path);    
    res.send('ok');
});

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});