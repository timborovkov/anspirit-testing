
(function(){

  /*
  *     prepare
  */
  var qapi = require('../api/qapi.js');
  global.qapi = qapi;
  var international = require('../api/international.js'),
  a = 1,
  wakeUpListener = new webkitSpeechRecognition(),
  mainListener = new webkitSpeechRecognition(),
  speakerMessage = new SpeechSynthesisUtterance(),
  voices = null,
  speechDiv = null,
  lastActionHappened = 0;

  /*
  *
  *     Loop functions
  *
  */
  function restartMainVoiceLoop(){
    wakeUpListener = new webkitSpeechRecognition();
    mainListener = new webkitSpeechRecognition();
    startMainVoiceLoop();
  }
  function startMainVoiceLoop(){
    waitForWakeup(international.getGUIText('hello'), function(){
        up();
    });
  }
  function up(){
    speechToText(function(notFinalSpeech){
      //Not final speech
      },function(speech){
        afterGetSpeech(speech);
      });
  }
  function afterGetSpeech(speech){
    lastActionNow();
    doSpeechProcessing(speech, function(){
      eval("up()");
    });
  }

  function afterFirstExtensionsAreDone(extensions, callBack, speechRuleFound, speech){
      if(!speechRuleFound){
          //Get action, speech response and options from Api.ai
          qapi.apiAi(speech, function(response){
            lastActionNow();
            if(response.status.code != "200"){
              qSay(international.getGUIText("Sorry I didn't get that"), function(){
                callBack();
              });
            }else{
              var speechResponse = response.result.fulfillment.speech;
              var htmlResponse = response.result.metadata.html;
              //Search extension to process action and return
              var doneActionProcessFromSpeechExtensionsCount = 0;
              if (extensions.length > 0) {
                for(var i = 0; i < extensions.length; i++){
                      var ruleData = extensions[i];
                      var link = "../rules/" + ruleData["name"] + "/hub.js";
                      var Rule = require(link);
                      Rule.processActionFromSpeech(response.result.action, response.result.parameters, response.result.metadata.emotion,speech, function(ruleRes){
                        doneActionProcessFromSpeechExtensionsCount = doneActionProcessFromSpeechExtensionsCount + 1;

                        //DEBUG
                        console.log("Extensions count 2 = " + extensions.length);
                        console.log("Completed count 2  = " + doneActionProcessFromSpeechExtensionsCount);

                        if(ruleRes.done === true){
                          //Done, extension used
                          afterSecondExtensionsAreDone(true);
                        }else{
                          if(doneActionProcessFromSpeechExtensionsCount == extensions.length){
                            //Done, no extension found
                            afterSecondExtensionsAreDone(false);
                          }
                        }
                      });
                  }
                }else{
                  afterSecondExtensionsAreDone(false);
                }
            }
            function afterSecondExtensionsAreDone(actionRuleFound){
                if(!actionRuleFound){
                  if(speechResponse != null || speechResponse != ""){
                    qSay(speechResponse, function(){
                      callBack();
                    });
                  }else if(htmlResponse != null || htmlResponse != ""){
                    qSay(htmlResponse, function(){
                      callBack();
                    });
                  }else{
                    qSay('OK', function(){
                      callBack();
                    });
                  }
                }else{
                  console.log("Action done");
                  callBack();
                }
            }
          });
      }else{
        //Speech already processed
        console.log('speech already processed');
        callBack();
      }
  }
  function doSpeechProcessing(speech, callBack){
      // Go through extensions to get action for speech request
      $.getJSON("../rules.json", function(extensions) {
          if(extensions.length === 0){
            //No extensions found
            //Get action, speech response and options from Api.ai
            qapi.apiAi(speech, function(response){
              if(response.status.code != "200"){
                qSay(international.getGUIText("Sorry I didn't get that"), function(){
                  callBack();
                });
              }else{
                var speechResponse = response.result.fulfillment.speech;
                var htmlResponse = response.result.metadata.html;
                lastActionNow();
                if(speechResponse != null || speechResponse != ""){
                  qSay(speechResponse, function(){
                    callBack();
                  });
                }else if(htmlResponse != null || htmlResponse != ""){
                  qSay(htmlResponse, function(){
                    callBack();
                  });
                }else{
                  qSay('OK', function(){
                    callBack();
                  });
                }
              }
            });
          }else{

            /*
            *
            */
            var firstExtensionsCompletedCount = 0;
            for(var i = 0; i < extensions.length; i++){
                var ruleData = extensions[i],
                link = "../rules/" + ruleData["name"] + "/hub.js",
                Rule = require(link);
                Rule.processSpeech(speech, function(ruleRes){
                  if(ruleRes.done === true){
                    afterFirstExtensionsAreDone(extensions, callBack, true, speech);
                  }
                  firstExtensionsCompletedCount++;

                  if(firstExtensionsCompletedCount == extensions.length){
                    afterFirstExtensionsAreDone(extensions, callBack, false, speech);
                  }
                });
            }

            /*
            *
            */
          }

  		});
  }

  /*
  *
  *     Loop
  *
  */
  $(document).ready(function(){
    //Prepare speaker
    var voices = window.speechSynthesis.getVoices();
    speakerMessage.voice = voices[2];

    //Prepare listeners
    mainListener.isListening = false;
    wakeUpListener.isListening = false;

    //prepare speech div
    speechDiv = document.getElementById('speech');

    qSay(international.getGUIText('How can I help you'), function(){
      //Loop start
      startMainVoiceLoop();
    });


    //UI processing
    $(".speechBtn").click(function(){
			if(wakeUpListener.isListening){
				//wakeup
        wakeUpListener = new webkitSpeechRecognition();
        up();
			}else{
        //stop
        mainListener = new webkitSpeechRecognition();
        wakeUpListener = new webkitSpeechRecognition();
        mainListener.isListening = false;
        wakeUpListener.isListening = false;
        startMainVoiceLoop();
			}
		});
  });


  /*
  *
  *     function definition
  *
  */

  //wait for wake up command
  function waitForWakeup(wakeupCommand, callback) {
    if(wakeUpListener.isListening){
      wakeUpListener = new webkitSpeechRecognition();
    }
		wakeUpListener.isListening = false;
		wakeUpListener.lang = qapi.getUserLang();
		wakeUpListener.continuous = true;
		wakeUpListener.interimResults = true;
		wakeUpListener.onresult = function(event){
			if (event.results.length > 0) {
					  var result = event.results[event.results.length-1][0].transcript;
						if(result.contains(wakeupCommand)){
							wakeUpListener.abort();
							wakeUpListener.isListening = false;
              callback();
						}
			}
		}
    wakeUpListener.onend = function(event){
      // Wakeup listener has been stoped
    }
		wakeUpListener.start();
      // Wakeup listener has been started
		wakeUpListener.isListening = true;
  }
  function speechToText(notFinal, callback){
    if(mainListener.isListening){
      mainListener = new webkitSpeechRecognition();
    }
    mainListener.interimResults = true;
    mainListener.isListening = false;
    mainListener.lang = qapi.getUserLang();
    mainListener.onresult = function(event){
      lastActionNow();
      if (event.results.length > 0) {
					var result = event.results[event.results.length-1][0].transcript;
          if (event.results.length > 0) {
              var result = event.results[event.results.length-1];
              if(result.isFinal) {
                mainListener = new webkitSpeechRecognition();
                mainListener.isListening = false;
                callback(result[0].transcript);
              }else{
                notFinal(result[0].transcript + "...");
              }
          }
			}
    }
    mainListener.start();
		mainListener.isListening = true;
  }
  var qSay = function(phrase, callback){
    speakerMessage.text = phrase;
    if(qapi.getUserLang() == "en"){
      speakerMessage.lang = "en-UK";
    }else{
      speakerMessage.lang = qapi.getUserLang();
    }
    speakerMessage.onend = function(event){
      lastActionNow();
      callback();
    };
    speakerMessage.onerror = function(er){
      console.error(er);
      callback();
    }
    speechSynthesis.speak(speakerMessage);
  }
  global.qSay = qSay;

  function lastActionNow(){
    var d = new Date();
    var n = d.getTime();
    lastActionHappened = n;
  }

  //Time executions
  window.setInterval(function(){
    var d = new Date();
    var n = d.getTime();
    if(mainListener.isListening){
      if(lastActionHappened < (n - 8000)){
        //end listening if listening
        mainListener = new webkitSpeechRecognition();
        wakeUpListener = new webkitSpeechRecognition();
        qSay(international.getGUIText('wake me up if you need me'), function(){
          startMainVoiceLoop();
        });
      }
    }
  }, 100);
})();
