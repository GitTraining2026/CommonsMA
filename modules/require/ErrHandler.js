define(function(){
    var callOnError = function(error){
        kony.print(error);//TODO replace with navigation to error screen/form
    };
    return {
        onError : callOnError,
    };
});