var app = app || {};

(function() {
    
    document.addEventListener("deviceready", function() {
        
        sqlite.init();
        
        var kendoApp = new kendo.mobile.Application(document.body);
    }, false);    
}());