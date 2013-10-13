var app = app || {};

(function() {
    
    document.addEventListener("deviceready", function() {
        
        sqlite.init();
        cordovaExt.init();
        
        var kendoApp = new kendo.mobile.Application(document.body);
    }, false);
    
    document.addEventListener("batterylow", function(info) {
        alert("Battery Level Low " + info.level + "%, save all information to avoid any losses");
    }, false);
}());