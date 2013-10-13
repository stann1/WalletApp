var cordovaExt = (function() {
    function getLocation() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    resolve(position);
                }, function(err) {
                    reject(err);
                });
        });
        return promise;
    }
    
    return {
        getLocation: getLocation
    }
}());