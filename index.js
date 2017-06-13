import express from 'express';
import bodyParser from 'body-parser';
import alexaVerifier from 'alexa-verifier';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/test', (req, res) => {
  console.log('test route');
  res.json('this works');
});

app.post('/thisdayinhistory', requestVerifier, (req, res) => {
  console.log('request made it to post route');
  console.log(req.body.request);
  if (req.body.request.type === 'LaunchRequest') {
    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> I'm digging into my historical data banks </speak>"
        }
      }
    });
  } else if (req.body.request.type === 'SessionEndedRequest') {
    // no response sent for this request.type
    console.log('Alexa session ended', req.body.request.reason);
  } else if (req.body.request.type === 'IntentRequest' && req.body.request.intent.name === 'ThisDayInHistory') {
    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> Looks like a great day! </speak>"
        }
      }
    });
  } else {
    console.log('what\'s going on');
    res.json({
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak> I am not sure what is going on. </speak>"
        }
      }
    });
  }
});

function requestVerifier(req, res, next) {
  console.log(req.headers);
  console.log(req.rawBody);
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      console.log('request made it to middleware');

          next();
      
    }
  );
}

setInterval(() => {
  http.get('http://alexathisdayinhistory.herokuapp.com');
}, 400000); // every 4 minutes

app.listen(PORT, () => {
  console.log(`listening on... ${PORT}`);
});