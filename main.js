const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser')
const port = 5000;
const cohere = require('cohere-ai');
cohere.init(process.env.API_KEY);
var path = require('path');
var myText;

app.get('/', function(req, res){
    res.render('form');
 });

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', function(req, res) {
      myText = req.body.mytext;
      console.log(myText);
      create();
    });

function create() {
    (async () => {
        const response = await cohere.generate({
            model: '6d88b2b0-5e24-491a-97cd-b7c8ae5604c2-ft',
            prompt: 'Respond to the prompt and help the student.\n--\nPrompt: ' + myText + '\"\nResponse:"',
            max_tokens: 100,
            temperature: 0.9,
            k: 0,
            p: 1,
            frequency_penalty: 0.5;
            presence_penalty: 1,
            stop_sequences: ['"'],
            return_likelihoods: 'NONE'
        });
        final = response.body.generations[0].text;
        console.log(final);
        app.get('/result', function(req, res){
            res.render("result.ejs", {final:final});
        });
    })();
}




app.listen(5000, () => {
    console.log('Server is up and running on 5000 ...');
});
