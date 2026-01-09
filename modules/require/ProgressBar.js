define(function () {
    var loadingTags = [];
    var timeout = 60;   //default, in seconds
    var showProgressBar = function () {
        if (loadingTags.length > 0 ) {
            kony.olb.utils.showProgressBar();
        }
    };
    var hideProgressBar = function () {
        if (loadingTags.length === 0 ) {
            kony.olb.utils.hideProgressBar();
        }
    };
    var getCurrentForm = function () {
        return kony.application.getCurrentForm();
    };
    var max = function (a, b) {
        return a > b ? a : b;
    };
    var not = function (something) {
        return function (e) {
            return e !== something;
        };
    };
    var isValidTime = function(time){
        return typeof time === 'number' && !isNaN(time);
    };
    return {
        setTimeout : function(_timeout){
            if(isValidTime(_timeout)){
                timeout = _timeout;
            }
        },
        start: function (_timeout) {
            var tag = loadingTags.reduce(max, 0) + 1;
            var isFinished = false;
            var progressTimeout = timeout;
            if(isValidTime(_timeout)){
                progressTimeout = _timeout;
            }
            loadingTags.push(tag);
            showProgressBar();
            var finisher = function finish() {
                if(!isFinished){
                    loadingTags = loadingTags.filter(not(tag));
                    hideProgressBar();
                    isFinished = true;
                }
            };
            setTimeout(finisher,progressTimeout*1000);
            return finisher;
        }
    };
});