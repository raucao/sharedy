var App = function () {
  this.views = {};
  this.helpers = {};
};

(function(jQuery) {
  jQuery.eventEmitter = {
    _JQInit: function() {
      this._JQ = jQuery(this);
    },
    emit: function(evt, data) {
      !this._JQ && this._JQInit();
      this._JQ.trigger(evt, data);
    },
    once: function(evt, handler) {
      !this._JQ && this._JQInit();
      this._JQ.one(evt, handler);
    },
    on: function(evt, handler) {
      !this._JQ && this._JQInit();
      this._JQ.bind(evt, handler);
    },
    off: function(evt, handler) {
      !this._JQ && this._JQInit();
      this._JQ.unbind(evt, handler);
    }
  };
}(jQuery));
jQuery.extend(App.prototype, jQuery.eventEmitter);

var app = new App();

app.views.show = function(viewName) {
  var templateEl = $('#template-' + viewName);
  $('#container').html(templateEl.html());
  $('nav ul li').removeClass('active');
  $('nav ul li[data-nav-item='+viewName+']').addClass('active');
  app.emit('show-'+viewName);
};

app.on('show-history', function () {
  app.loadHistory();
});

app.on('show-share', function() {
  app.imageFiles = [];
  $("#upload button.cancel").click(app.helpers.cancelSharing);
  $("#upload button.upload").click(app.helpers.uploadImages);
  app.helpers.initializeDragndrop();
});

app.loadHistory = function () {
  remoteStorage.sharedy.getListing('images/').then(function(listing) {
    var items = listing.sort();
    app.history = app.helpers.itemsByDay(items);
    var days = Object.keys(app.history).sort().reverse();
    days.forEach(function(day) {
      app.helpers.renderHistoryDay(day);
    });

    $("ul.images li a.delete").click(function(){
      var listEl = $(this).parents('li');
      var item = listEl.attr('data-item');
      remoteStorage.sharedy.remove('images/'+item).then(function(){
        listEl.remove();
      });
    });
  });
};

app.helpers.itemsByDay = function (items) {
  var days = {};
  items.forEach(function(item){
    var day = item.substr(0,6);
    if (typeof(days[day]) === 'undefined') {
      days[day] = [];
    }
    days[day].push(item);
  });
  return days;
};

app.helpers.renderHistoryDay = function (dayStr) {
  var day = moment(dayStr, 'YYMMDD');
  var date;
  if (dayStr == moment().format('YYMMDD')) {
    date = "Today";
  } else if (dayStr == moment().subtract(1, 'days').format('YYMMDD')) {
    date = "Yesterday";
  } else {
    date = day.format('MMM D, YYYY');
  }
  var template = $('<h2>'+date+'</h2><ul class="images day-'+dayStr+'"></ul>')
  $('#container .history').append(template);
  app.history[dayStr].forEach(function(item){
    app.helpers.renderHistoryItem($('ul.day-'+dayStr), item);
  });
};

app.helpers.renderHistoryItem = function (list, item) {
  var imageUrl = remoteStorage.sharedy.getImageUrl(item);
  var template = $('<li data-item="'+item+'"></li>');
  template.append('<a class="img" href="#" style="background-image: url('+imageUrl+');"></a>');
  template.append('<a href="#" class="delete">delete</a>')
  list.append(template);
};

app.helpers.initializeDragndrop = function () {
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

    var files = e.dataTransfer.files;

    loadFiles(files);
  });

  $('input#file-picker').bind('change', function(e) {
    if (e.target.files.length == 0) {
      return false
    }

    $("#dropzone").hide();
    $("#upload").show();

    files = e.target.files;

    app.helpers.loadFiles(files);
  });
};

app.helpers.cancelSharing = function () {
  $('#upload').hide();
  $('#dropzone').show();
  $("p.placeholder").show();
  $('#dropped-files > div.image').remove();
  $("#upload button.upload").removeAttr('disabled').show();
  $("#upload button.cancel").html('cancel');

  app.imageFiles = [];

  return false;
}

app.helpers.uploadImages = function () {
  $.each(app.imageFiles, function(index, file){
    var imgEl = $(".image[data-filename='"+window.btoa(file.name)+"']");
    var timestamp = moment().format("YYMMDD-HHmmss-");
    var filename  = timestamp + file.name;

    remoteStorage.sharedy.storeImage(
      file.type,
      filename,
      file.data,
      function(){
        // success
        app.helpers.removeUploadIndicator(imgEl);
        app.helpers.showImageUrl(imgEl, remoteStorage.sharedy.getImageUrl(filename));
        $("#upload button.upload").hide();
        // failure
        // $("#upload button.upload").removeAttr('disabled');
      }
    );

    app.helpers.showUploadIndicator(imgEl);
    $("#upload button.upload").attr('disabled', 'disabled');
    $("#upload button.cancel").html('Back');
  });
}

app.helpers.showUploadIndicator = function (element) {
  var html = '<div class="overlay loading"></div>';
  $(element).append($(html));
  $(element).find('.overlay.loading').spin('large', 'white');
}

app.helpers.removeUploadIndicator = function (element) {
  $(element).find('.overlay.loading').remove();
}

app.helpers.showImageUrl = function (element, url) {
  var html = '\
    <div class="overlay result">\
      <label for="direct-url">Image URL:</label>\
      <input type="text" name="direct-url" value="'+url+'" onclick="this.select()">\
    </div>';

  $(element).append($(html));
}

app.helpers.validateFileType = function (fileType) {
  if (!fileType.match('image.*')) {
    alert('Hey! Images only');
    $("p.placeholder").show();
    return false;
  }
  else {
    return true;
  }
}

app.helpers.loadFiles = function (files) {
  $.each(files, function(index, file) {
    if (!app.helpers.validateFileType(files[index].type)) {
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
        app.imageFiles.push({name: file.name, type: file.type, data: this.result});
      };
    })(files[index]);

    fileReaderBase64.readAsDataURL(file);
    fileReaderBinary.readAsArrayBuffer(file);
  });
}

$(function() {
  app.views.show('share');
  $("#app-overlay").show();

  remoteStorage.claimAccess({sharedy: 'rw'}).then(function() {
    remoteStorage.sharedy.init();
    remoteStorage.displayWidget('remotestorage-connect');

    remoteStorage.onWidget("state", function(state){
      switch (state) {
        case "anonymous":
          $("#app-overlay").show();
          break;
        case "typing":
          $("#app-overlay .hint").hide();
          break;
        case "connected":
          $("#app-overlay").hide();
          break;
      }
    });

    jQuery.event.props.push('dataTransfer');

    $("[data-nav-item='history'] a").tooltip();

    $('nav ul li a').on('click', function(){
      listEl = $(this).parents('li');
      viewName = listEl.data('nav-item');
      app.views.show(viewName);
      return false;
    })
  });
});
