define(function () {

  function InvokeServiceUtils() {} 

  /**
	* @api : makeAServiceCall
	* make the curd opertions based on the type parameter
	* @return : promise for the result of the service call.
	*/
  InvokeServiceUtils.prototype.makeAServiceCall = function (type,object,criteria,verb) {
    return new Promise ((resolve, reject) => {
      var objectRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository(object);
      if(type === "customVerb") {
        objectRepo.customVerb(verb, criteria, getAllCompletionCallback);
      }
      else if(type === "getByCriteria") {
        objectRepo.getByCriteria(criteria, getAllCompletionCallback);
      }
      else {
        this.setError("not supported type","makeAServiceCall");
      }
      function getAllCompletionCallback(status, data, error) {
        if (status === kony.mvc.constants.STATUS_FAILURE) {
          reject(error);
        }
        else {
		  var srh = applicationManager.getServiceResponseHandler();
          var obj = srh.manageResponse(status, data, error);
          if (obj["status"] === true) {
            resolve(obj["data"]);
          }
          else {
            reject(obj["errmsg"]);
          }
        }
      }
    });
  };

 
  return InvokeServiceUtils;
});