var sqlite = (function() {
    
     var db = null;
     var _accountFields = ["provider", "number", "cardType", "screenshotUrl", "active"];
     var _credentialFields = ["provider", "address", "password"];
     var _contactFields = ["name", "imageUrl", "email", "phone", "notes"];

     function openDb() {
        if (window.sqlitePlugin !== undefined) {
            db = window.sqlitePlugin.openDatabase("WalletDb");
        }
        else {
            // For debugging in simulator fallback to native SQL Lite
            db = window.openDatabase("WalletDb", "1.0", "WalletApp", 200000);
        }
    }
    
     function createTables(){
        db.transaction(populateTables, onError, onSuccess);
    }

     function insertAccRecord(account) {
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO Accounts(provider, number, cardType, screenshotUrl, active) VALUES (?,?,?,?,?);",
                          [account.provider, account.number, account.cardType, account.screenshotUrl, account.active],
                          querySuccess,
                          onError);
        });
    }
    
    function insertCredRecord(credential){
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO Credentials(provider, address, password) VALUES (?,?,?);",
                          [credential.provider, credential.address, credential.password],
                          querySuccess,
                          onError);
        });
    }
    
    function insertContactRecord(contact){
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO Contacts(name, imageUrl, email, phone, notes) VALUES (?,?,?,?,?);",
                          [contact.name, contact.imageUrl, contact.email, contact.phone, contact.notes],
                          querySuccess,
                          onError);
        });
    }
    
     function deleteRecord(id, table) {
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM " + table + " WHERE id = ?;",
                          [id],
                          querySuccess,
                          onError);
        });
    }

    function updateRecord(id, fieldName, fieldValue, table) {
        db.transaction(function(tx) {
            tx.executeSql("UPDATE " + table + " SET " + fieldName + " = ? WHERE id = ?;",
                          [fieldValue, id],
                          querySuccess,
                          onError);
        });
    }
    
    function updateFullRecord(id, fieldValues, table) {
        var fields = [];
        switch(table){
            case "Accounts": fields = _accountFields; break;
            case "Credentials": fields = _credentialFields; break;
            case "Contacts": fields = _contactFields; break;
            default: "Error"; break;
        }
        
        var sqlString = "UPDATE " + table + " SET ";
        for(var i = 0; i < fields.length; i++){
            if(i == fields.length - 1) {sqlString += fields[i] + " = ? "}
            else{ sqlString += fields[i] + " = ?, " }            
        }
        
        sqlString += "WHERE id = ?;";
        fieldValues.push(id);
        
        db.transaction(function(tx) {
            tx.executeSql(sqlString,
                          fieldValues,
                          querySuccess,
                          onError);
        });        
    }

    function selectAllRecords(table, fn) {
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM " + table +";", [],
                          fn,
                          onError);
        });
    }
    
    function selectRecord(id, table, fn) {
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM " + table +" WHERE id = ?;", [id],
                          fn,
                          onError);
        });
    }

    function onSuccess() {
        console.log("Your SQLite query was successful!");
    }
    
    function querySuccess(tx, results){
         console.log("Returned rows = " + results.rows.length);
        // this will be true since it was a select statement and so rowsAffected was 0
        if (!results.rowsAffected) {
            console.log('No rows affected!');
            return false;
        }
        // for an insert statement, this property will return the ID of the last inserted row
       //console.log("Last inserted row ID = " + results.insertId);
    }

    function onError(e) {
        console.log("SQLite Error: " + e);
    }
    
    function fillSampleData(){
        var account1 = {
            provider: "UBB",
            number: "11FUB812731HRV2",
            cardType: "Mastercard",
            active: true
        }
        var account2 = {
            provider: "FIB",
            number: "44FIB811111HRV2",
            cardType: "Visa",
            active: true
        }
        insertAccRecord(account1);
        insertAccRecord(account2);
        
        var cred1 = {
            provider: "Telerik",
            address: "www.telerikacademy.com",
            password: "123456"
        }
        insertCredRecord(cred1);
        
        var contact1 = {
            name: "Goshoe Goshev",
            imageUrl: "styles/images/scrat-m.jpg",
            email: "gosho@abv.bg",
            notes: "Gosho e mnoo pe4en tip"
        }
        insertContactRecord(contact1);
    }

    function init() {
        openDb();
        createTables();
        fillSampleData();
    }
    
    function populateTables(tx){
            tx.executeSql("CREATE TABLE IF NOT EXISTS Accounts" +
                          "(id INTEGER PRIMARY KEY ASC, " +
                          "provider TEXT, " +
                          "number TEXT, " +
                          "cardType TEXT, " +
                          "screenshotUrl TEXT, " +
                          "active BIT);", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS Credentials" +
                          "(id INTEGER PRIMARY KEY ASC, " +
                          "provider TEXT, " +
                          "address TEXT, " +
                          "password TEXT);", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS Contacts" +
                          "(id INTEGER PRIMARY KEY ASC, " +
                          "name TEXT, " +
                          "imageUrl TEXT, " +
                          "email TEXT, " +
                          "phone INTEGER, " +
                          "notes TEXT);", []);
    }
    
    return {
        init: init,
        getData: selectAllRecords,
        getSingle: selectRecord,
        addAccount: insertAccRecord,
        addCredential: insertCredRecord,
        addContact: insertContactRecord,
        deleteRecord: deleteRecord,
        updateRecord: updateRecord,
        updateFullRecord: updateFullRecord
    }
}());
/*
Available cars for rent
Car details and rent option
Rented cars with return date
Home/About/Contacts view
*/
