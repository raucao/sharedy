$(function() {

  jQuery.event.props.push('dataTransfer');

  var maxFiles = 5;
  var errMessage = 0;
  var dataArray = [];
  var z = -40

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

    e.preventDefault();
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    // e.dataTransfer.dropEffect = 'copy';

    var files = e.dataTransfer.files;

    // Show the upload holder
    // $('#uploaded-holder').show();

    $.each(files, function(index, file) {

      validateFileType(files[index].type);

      var fileReader = new FileReader();

      fileReader.onload = (function(file) {

        return function(e) {
          dataArray.push({name: file.name, value: this.result});

          z = z+40;

          var image = this.result;

          $('#dropped-files').append('<div class="image" style="left: '+z+'px; background: url('+image+'); background-size: cover;"> </div>');
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
      return false;
    }
  }

  function cancelSharing() {
    // $('#loading-bar .loading-color').css({'width' : '0%'});
    // $('#loading').css({'display' : 'none'});
    // $('#loading-content').html(' ');

    $('#upload-button').hide();
    $('#dropped-files > .image').remove();
    // $('#uploaded-holder').hide();

    dataArray.length = 0;
    z = -40;

    return false;
  }

});
