$(function() {

  remoteStorage.claimAccess({sharedy: 'rw'});
  remoteStorage.displayWidget('remotestorage-connect');
  // remoteStorage.onWidget('state', function(state) {})

  jQuery.event.props.push('dataTransfer');

  var imageFiles = [];

  $('#dropzone').bind('dragenter', function() {
    $("p.placeholder").hide();
    $(this).css({'border': '3px dashed red'});
    return false;
  });

  $('#dropzone').bind('dragover', function (e) {
    e.preventDefault();
    return false;
  });

  $('#dropzone').bind('dragleave', function() {
    $("p.placeholder").show();
    $(this).css({'border': 'none'});
    return false;
  });

  $('#dropzone').bind('drop', function(e) {
    $(this).css({'border': 'none'});
    $("#dropzone").hide();
    $("#upload").show();

    e.preventDefault();
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    // e.dataTransfer.dropEffect = 'copy';

    var files = e.dataTransfer.files;

    // Show the upload holder
    // $('#uploaded-holder').show();

    $.each(files, function(index, file) {

      if (!validateFileType(files[index].type)) {
        return;
      }

      var fileReaderBase64 = new FileReader();
      var fileReaderBinary = new FileReader();

      fileReaderBase64.onload = (function(file) {
        return function(e) {
          imageFiles.push({name: file.name, type: file.type, data: this.result});
          $('#dropped-files').append('<img src='+this.result+'>');
        };
      })(files[index]);

      fileReaderBase64.readAsDataURL(file);
    });
  });


  function validateFileType(fileType) {
    if (!fileType.match('image.*')) {
      alert('Hey! Images only');
      $("p.placeholder").show();
      return false;
    }
    else {
      return true;
    }
  }

  function cancelSharing() {
    $('#upload').hide();
    $('#dropzone').show();
    $("p.placeholder").show();
    $('#dropped-files > img').remove();

    imageFiles = [];

    return false;
  }

  $("#upload button.cancel").on("click", cancelSharing);
  $("#upload button.upload").on("click", uploadImages);

  function uploadImages() {
    $.each(imageFiles, function(index, file){
      blob = dataURItoBlob(file.data, file.type);

      remoteStorage.sharedy.storeImage(
        file.type,
        file.name,
        blob,
        function(){
          console.log(remoteStorage.sharedy.getImageUrl(file.name));
      });
    });
  }

  function dataURItoBlob(dataURI, mimeType) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: mimeType});
  }

});
