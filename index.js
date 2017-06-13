import express from 'express';
import bodyParser from 'body-parser';
import alexaVerifier from 'alexa-verifier';
import http from 'http';
import request from 'request';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/test', (req, res) => {
  console.log('test route');
  res.json('this works');
});

app.post('/thisdayinhistory', requestVerifier, (req, res) => {
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
    console.log(`Alexa session ended ${req.body.request.reason}`);
  } else if (req.body.request.type === 'IntentRequest' && req.body.request.intent.name === 'ThisDayInHistory') {

    if(res.statusCode === 200 ) {
      let alexaSpeachResponse = "<speak> oh my god! </speak>"

      request('http://history.muffinlabs.com/date', (error, response, body) => {
        console.log(body);
        let eventsArray = body.data.Events;
        let randomEvent = Math.floor(Math.random() * (eventsArray.length-1));
        alexaSpeachResponse = eventsArray[randomEvent];
        res.json({
          "version": "1.0",
          "response": {
            "shouldEndSession": true,
            "outputSpeech": {
              "type": "SSML",
              "ssml": alexaSpeachResponse
            }
          }
        });
        if (error) {
          res.send(error)
        }

      });
      
    }

  } else {

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
  console.log(req.body);
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.body,
    function verificationCallback(err) {
      console.log(err);
      next();
    }
  );
}

setInterval(() => {
  console.log(`KEEPING HEROKU AWAKE`);
  http.get('http://alexathisdayinhistory.herokuapp.com');
}, 400000); // every 4 minutes

app.listen(PORT, () => {
  console.log(`listening on... ${PORT}`);
});