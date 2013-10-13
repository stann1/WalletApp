var app = app || {};

(function(a) {
    
    var queryData = [];
    var detailData = [];
    var detailId = 0;
    
    function getAlphabetically() { 
        sqlite.getData("Contacts", successCallback);        
        queryData = [];
    }
    
    function compareByName(a,b) {
      if (a.name < b.name)
         return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }
    
    function successCallback(tx, results){
        for (var i = 0; i < results.rows.length; i++) {
                queryData.push(results.rows.item(i));
            }        
         
        queryData.sort(compareByName);
        viewModel.set("contacts", queryData); 
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
        sqlite.getSingle(entryId, "Contacts", detailCallback);
       
        kendo.bind(e.view.element, detailViewModel);
    }
    
    function saveEntry(e){
        var entry = detailViewModel.get("detailModel");
        //console.log(entry);
        sqlite.updateFullRecord(entry.id, [entry.name, entry.imageUrl, entry.email, entry.phone, entry.notes], "Contacts");
        kendo.mobile.application.navigate("#:back");
    }
    
    function createShow(e){
        kendo.bind(e.view.element, createViewModel);
    }
        
    function createEntry(){
        var entry = createViewModel.get("createModel");
        if(entry.imageUrl == null || entry.imageUrl == ""){
            entry.imageUrl = "styles/images/scrat-m.jpg"
        }
        //console.log(entry);
        sqlite.addContact(entry);
        kendo.mobile.application.navigate("#:back");
    }
        
    var viewModel = kendo.observable({
        contacts:[],
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
    
    a.contacts = {
        init:init,
        detailShow: detailShow,
        createShow: createShow
    };
}(app));