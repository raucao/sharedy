$(function() {

  remoteStorage.claimAccess({sharedy: 'rw'});
  remoteStorage.displayWidget('remotestorage-connect');
  // remoteStorage.onWidget('state', function(state) {})

  jQuery.event.props.push('dataTransfer');

  var imageFiles = [];

  $('#dropzone').bind('dragenter', function() {
    $("p.placeholder").hide();
    $(this).addClass('active');
    return false;
  });

  $('#dropzone').bind('dragover', function (e) {
    e.preventDefault();
    return false;
  });

  $('#dropzone').bind('dragleave', function() {
    $("p.placeholder").show();
    $(this).removeClass('active');
    return false;
  });

  $('#dropzone').bind('drop', function(e) {
    $(this).removeClass('active');
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
          var html = '<div class="image" data-filename='+window.btoa(file.name)+'>';
              html += '<img src='+this.result+'></div>';
          $('#dropped-files').append(html);
        };
      })(files[index]);

      fileReaderBinary.onload = (function(file) {
        return function(e) {
          imageFiles.push({name: file.name, type: file.type, data: this.result});
        };
      })(files[index]);

      fileReaderBase64.readAsDataURL(file);
      fileReaderBinary.readAsArrayBuffer(file);
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
    $('#dropped-files > div.image').remove();
    $("#upload button.upload").removeAttr('disabled').show();
    $("#upload button.cancel").html('cancel');

    imageFiles = [];

    return false;
  }

  $("#upload button.cancel").on("click", cancelSharing);
  $("#upload button.upload").on("click", uploadImages);

  function uploadImages() {
    $.each(imageFiles, function(index, file){
      var imgEl = imageElement(file.name)
      var timestamp = moment().format("YYMMDD-HHmmss-");
      var filename  = timestamp + file.name;

      remoteStorage.sharedy.storeImage(
        file.type,
        filename,
        file.data,
        function(){
          // success
          removeUploadIndicator(imgEl);
          showImageUrl(imgEl, remoteStorage.sharedy.getImageUrl(filename));
          $("#upload button.upload").hide();
          // failure
          // $("#upload button.upload").removeAttr('disabled');
        }
      );

      showUploadIndicator(imgEl);
      $("#upload button.upload").attr('disabled', 'disabled');
      $("#upload button.cancel").html('Back');
    });
  }

  function showUploadIndicator(element) {
    var html = '<div class="overlay loading"></div>';
    $(element).append($(html));
    $(element).find('.overlay.loading').spin('large', 'white');
  }

  function removeUploadIndicator(element) {
    $(element).find('.overlay.loading').remove();
  }

  function showImageUrl(element, url) {
    var html = '\
      <div class="overlay result">\
        <label for="direct-url">Image URL:</label>\
        <input type="text" name="direct-url" value="'+url+'" onclick="this.select()">\
      </div>';

    $(element).append($(html));
  }

  function imageElement(filename) {
    return $(".image[data-filename='"+window.btoa(filename)+"']");
  }

  // $("input[name='direct-url']").on("click", function(){
  //   $(this).select();
  // });

});
