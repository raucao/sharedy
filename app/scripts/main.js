$(function() {

  jQuery.event.props.push('dataTransfer');

  var maxFiles = 5;
  var errMessage = 0;
  var dataArray = [];

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

      var fileReader = new FileReader();

      fileReader.onload = (function(file) {

        return function(e) {
          dataArray.push({name: file.name, value: this.result});

          var image = this.result;

          $('#dropped-files').append('<img src='+image+'>');
        };

      })(files[index]);

      fileReader.readAsDataURL(file);
    });
  });


  function validateFileType(fileType) {
    if (!fileType.match('image.*')) {
      if (errMessage == 0) {
        alert('Hey! Images only');
        ++errMessage
      }
      else if (errMessage == 1) {
        alert('Stop it! Images only!');
        ++errMessage
      }
      else if (errMessage == 2) {
        alert("Fine! Keep dropping non-images.");
        errMessage = 0;
      }
      $("p.placeholder").show();
      return false;
    }
    else {
      return true;
    }
  }

  function cancelSharing() {
    // $('#loading-bar .loading-color').css({'width' : '0%'});
    // $('#loading').css({'display' : 'none'});
    // $('#loading-content').html(' ');

    $('#upload').hide();
    $('#dropzone').show();
    $("p.placeholder").show();
    $('#dropped-files > img').remove();

    dataArray.length = 0;

    return false;
  }


  $("#upload button.cancel").on("click", cancelSharing);

});
