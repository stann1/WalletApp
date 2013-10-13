var app = app || {};

(function(a) {
    
    var queryData = [];
    var detailData = [];
    var detailId = 0;
    
    function getAlphabetically() { 
        sqlite.getData("Accounts", successCallback);        
        queryData = [];
    }
    
    function compareByProvider(a,b) {
      if (a.provider < b.provider)
         return -1;
      if (a.provider > b.provider)
        return 1;
      return 0;
    }
    
    function successCallback(tx, results){
        for (var i = 0; i < results.rows.length; i++) {
                queryData.push(results.rows.item(i));
            }        
         
        queryData.sort(compareByProvider);
        viewModel.set("accounts", queryData); 
        //console.log(queryData);        
    }
    
    function detailCallback(tx, results){
        for (var i = 0; i < results.rows.length; i++) {
                detailData.push(results.rows.item(i));
            }
                
        detailViewModel.set("detailModel", detailData[0]);
        console.log(detailData[0]);
        detailId = detailData[0].id;
        detailData = [];
    }
    
    function detailShow(e) {
        var entryId = e.view.params.uid;        
        sqlite.getSingle(entryId, "Accounts", detailCallback);
       
        kendo.bind(e.view.element, detailViewModel);
    }
    
    function saveEntry(e){
        var entry = detailViewModel.get("detailModel");
        //console.log(entry);
        sqlite.updateFullRecord(entry.id, [entry.provider, entry.number, entry.cardType, entry.screenshotUrl, entry.active], "Accounts");
        kendo.mobile.application.navigate("#:back");
    }
    
    function createShow(e){
        kendo.bind(e.view.element, createViewModel);
    }
    
    function createEntry(){
        var entry = createViewModel.get("createModel");
        entry.active = true;
        var imgPath = $('#smallImage').attr('src');
        entry.screenshotUrl = imgPath;
        //console.log(entry);
        sqlite.addAccount(entry);
        kendo.mobile.application.navigate("#:back");
    }
    
    //function getByLocation() {
    //    cordovaExt.getLocation().
    //    then(function(location) {
    //        var locationString = location.coords.latitude + "," + location.coords.longitude;            
    //        return httpRequest.getJSON(app.servicesBaseUrl  + "places?location=" + locationString);     
    //    })
    //    .then(function(places) {
    //        viewModel.set("places", places); 
    //        console.log(places);
    //    });
    //}
    
    var detailViewModel = kendo.observable({
        detailModel:{},
        saveEntry: saveEntry
    });
    
    var createViewModel = kendo.observable({
        createModel:{},
        createEntry: createEntry
    });
       
    var viewModel = kendo.observable({
        accounts:[],
        getAlphabetically: getAlphabetically
        //getByLocation: getByLocation
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        getAlphabetically();
    }   
    
    a.accounts = {
        init:init,
        detailShow: detailShow,
        createShow: createShow
    };
}(app));