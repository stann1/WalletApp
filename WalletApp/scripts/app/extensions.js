var cordovaExt = (function() {
    
    var imgFile;
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 
    
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
    
    function getContact(filter){
        // specify contact search criteria
        var options = new ContactFindOptions();
        options.filter = filter;      // empty search string returns all contacts
        options.multiple = false;  // return single result
        filter = ["displayName", "emails", "phoneNumbers"]; // return contact email addresses

        // find contacts
        navigator.contacts.find(filter, onContactSuccess, onContactError, options);
    }
    
    function onContactSuccess(contacts) {
        if(contacts.length == 0) { $('#success-error').text("The search found no contacts with this name"); return;  }
        else if(contacts.length > 1) { $('#success-error').text("The search found too many contacts with this name"); return; }
        
        var contact = contacts[0];
        if(contact.emails.length == 0 && contact.phoneNumbers.length == 0){
            $('#success-error').text("The contact has no emails or phones"); 
            return;
        }
        
        $('#input-mail').val(contact.emails[0]);
        $('#input-phone').val(contact.phoneNumbers[0]);
        $('#success-error').text("Successfully imported contact data.");
    }

    // onError: Failed to get the contacts

    function onContactError(contactError) {
        $('#success-error').text("Error when importing contact data!");
    }
    
    function capturePhotoWithFile() {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    }
    
    function saveFileToSD(fileName){
         
         window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        
        function gotFS(fileSystem) {
            fileSystem.root.getFile(fileName, {create: true, exclusive: false}, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
        }

        function gotFileWriter(writer) {
            var photo = document.getElementById(fileName);
            writer.write(photo.value);
        }

        function fail(error) {
            console.log("Error when saving file to SD: " + error.code);
        }
    }
    
    function getPhotoFromLibrary() {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.PHOTOLIBRARY });
    }
    
    function onPhotoFileSuccess(imageData) {
      // Get image handle
      console.log(JSON.stringify(imageData));
      
   	  // Get image handle
      //
      var smallImage = document.getElementById('smallImage');
 
      // Unhide image elements
      //
      smallImage.style.display = 'block';
 
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = imageData;
    }
    
    function onPhotoURISuccess(imageURI) {
      
      // console.log(imageURI);
 
      var largeImage = document.getElementById('smallImage');
 
      largeImage.style.display = 'block';
 
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }
    
     function onFail(message) {
      alert('Image operation failed because: ' + message);
    }
    
    function init(){
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }
    
    return {
        init: init,
        getLocation: getLocation,
        capturePhoto: capturePhotoWithFile,
        saveFileToSD: saveFileToSD,
        uploadFromLibrary: getPhotoFromLibrary,
        getContact: getContact
    }
}());