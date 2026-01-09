//#ifdef android
//#define micsettings_android
//#endif

//#ifdef tabrcandroid
//#define micsettings_android
//#endif

//#ifdef iphone
//#define micsettings_ios
//#endif

//#ifdef ipad
//#define micsettings_ios
//#endif

function setupMic(startCallbacks)
{
  //#ifdef micsettings_android
  setupMicAndroid(startCallbacks);        
  //#endif
  //#ifdef micsettings_ios
  setupMicIOS(startCallbacks);                
  //#endif 
}
//#ifdef micsettings_android
function setupMicAndroid(startCallbacks)
{
  var micPermission = kony.application.checkPermission(kony.os.RESOURCE_RECORD_AUDIO);
  if(micPermission.status == kony.application.PERMISSION_DENIED){
    kony.application.requestPermission(kony.os.RESOURCE_RECORD_AUDIO, permissionCallback);
  } else {
    promptSpeechInput(startCallbacks);
  }
}
function promptSpeechInput(startCallbacks) {
  var ActivityResultListener = java.newClass("ActivityResultListener","java.lang.Object",["com.konylabs.ffi.ActivityResultListener"],                                             {
    onActivityResult:function(requestCode,resultCode,data){this.onActivityResultCallback(requestCode,resultCode,data);},
    onActivityResultCallback:null
  });
  var activityResultListener = new ActivityResultListener();
  activityResultListener.onActivityResultCallback = onActivityResult;    
  var RecognizerIntent = java.import("android.speech.RecognizerIntent");		
  var Intent = java.import("android.content.Intent");
  var intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
  intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE,"en");
  intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
  intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);		
  try {
    var KonyMain = java.import("com.konylabs.android.KonyMain");
    var contextObject = KonyMain.getActContext();        
    contextObject.registerActivityResultListener(100,activityResultListener);	
    contextObject.startActivityForResult(intent, 100);        
  } catch (e){
    kony.print("error " +JSON.stringify(e));
    startCallbacks.onError(e.message);
  }
  function onActivityResult(requestCode,resultCode,data){
    if(requestCode == 100){
      if(resultCode == KonyMain.RESULT_OK){
        var ArrayList = java.import('java.util.ArrayList');
        var list = new ArrayList();
        list = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        var result = list.get(0).toString();
        startCallbacks.onSuccess(result);
      } else if(resultCode == KonyMain.RESULT_CANCELED){					
        var compiledError = "Error Code";
        startCallbacks.onError(compiledError);
      }
    }						
  }	
}
//#endif
//#ifdef micsettings_ios
function setupMicIOS(startCallbacks)
{
  var SFSpeechRecognizer = objc.import("SFSpeechRecognizer");
  SFSpeechRecognizer.requestAuthorization(requestAuthResult);
  function requestAuthResult(status)
  {
    var NSError = objc.import("NSError");
    var NSLocale = objc.import("NSLocale");
    var NSString = objc.import("NSString");
    var AVAudioEngine = objc.import("AVAudioEngine");
    var AVAudioSession = objc.import("AVAudioSession");
    var AVAudioSessionCategory = objc.import("AVAudioSessionCategory");
    var SFSpeechAudioBufferRecognitionRequest = objc.import("SFSpeechAudioBufferRecognitionRequest");
    var audioEngine;
    var recognitionRequest;
    var inputNode;
    var recognitionTask = null;
    switch(status)
    {
      case 3:
        {
          var err = null;
          var nslocale = NSLocale.alloc().initWithLocaleIdentifier("en_US");
          var speechRecognizer =SFSpeechRecognizer.alloc().initWithLocale(nslocale);
          audioEngine = AVAudioEngine.alloc().jsinit();
          recognitionRequest = SFSpeechAudioBufferRecognitionRequest.alloc().jsinit();
          recognitionRequest.shouldReportPartialResults = false;          
          recognitionRequest.detectMultipleUtterances = false;
          var audioSession = AVAudioSession.sharedInstance();
          try{
            audioSession.setCategoryModeOptionsError("AVAudioSessionCategoryRecord", "AVAudioSessionModeMeasurement",0x8/*AVAudioSessioCategoryOptionsDefaultToSpeaker*/,null);
            audioSession.setActiveWithOptionsError(true,1,null);
          }catch(e){
            kony.print("Error getting audioSession3" + e);
          }                      
          if(recognitionTask)
          {
            recognitionTask.cancel();
            recognitionTask = null;            
          }
          recognitionTask = speechRecognizer.recognitionTaskWithRequestResultHandler(recognitionRequest, recognitionResultHandler);
          inputNode = audioEngine.inputNode;
          var recordingFormat = inputNode.outputFormatForBus(0);
          inputNode.installTapOnBusBufferSizeFormatBlock(0, 1024, recordingFormat, blockDetails);
          audioEngine.prepare();
          try{
            audioEngine.startAndReturnError(err);
          }catch(e){
            kony.print("failed to start audioEngine" + e);          
          }   
        }
        break;
      default: break;
    }
    function recognitionResultHandler(result,error){
      if(result) 
      { 
        var bestRsp = result.bestTranscription.formattedString.toString();
        startCallbacks.onSuccess(bestRsp);
        audioEngine.stop();
        inputNode.removeTapOnBus(0);
        recognitionTask = null;
        recognitionRequest = null;
      }
      if(error)
      {
        audioEngine.stop();
        inputNode.removeTapOnBus(0);
        recognitionTask = null;
        recognitionRequest = null;          
      }
    }
    function blockDetails(buffer,when){
      if(buffer !== null && when !== null)
      {
        recognitionRequest.appendAudioPCMBuffer(buffer);              
      }
    }

    function permissionCallback(permissionStatus){
      if(permissionStatus.status == kony.application.PERMISSION_GRANTED){
        this.promptSpeechInput(startCallbacks);
      }else{
        kony.ui.Alert("calling permission not granted");
      }
    }
  }
}
//#endif