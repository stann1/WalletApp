var app = app || {};

(function(a) {
    
    var queryData = [];
    var detailData = [];
    var detailId = 0;
    
    function getAlphabetically() { 
        sqlite.getData("Credentials", successCallback);        
        queryData = [];
    }
    
    function compareByAddress(a,b) {
      if (a.address < b.address)
         return -1;
      if (a.address > b.address)
        return 1;
      return 0;
    }
    
    function successCallback(tx, results){
        for (var i = 0; i < results.rows.length; i++) {
                queryData.push(results.rows.item(i));
            }        
         
        queryData.sort(compareByAddress);
        viewModel.set("credentials", queryData); 
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
        sqlite.getSingle(entryId, "Credentials", detailCallback);
       
        kendo.bind(e.view.element, detailViewModel);
    }
    
    function saveEntry(e){
        var entry = detailViewModel.get("detailModel");
        //console.log(entry);
        sqlite.updateFullRecord(entry.id, [entry.provider, entry.address, entry.password], "Credentials");
        kendo.mobile.application.navigate("#:back");
    }
    
    function createShow(e){
        kendo.bind(e.view.element, createViewModel);
    }
        
    function createEntry(){
        var entry = createViewModel.get("createModel");
        entry.active = true;
        //console.log(entry);
        sqlite.addCredential(entry);
        kendo.mobile.application.navigate("#:back");
    }
        
    var viewModel = kendo.observable({
        credentials:[],
        getAlphabetically: getAlphabetically
    });
    
    var detailViewModel = kendo.observable({
        detailModel:{},
        saveEntry: saveEntry
    });
    
    var createViewModel = kendo.observable({
        createModel:{},
        createEntry: createEntry
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        getAlphabetically();
    }   
    
    a.creds = {
        init:init,
        detailShow: detailShow,
        createShow: createShow
    };
}(app));