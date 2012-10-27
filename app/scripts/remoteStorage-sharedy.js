remoteStorage.defineModule("sharedy", function(privateClient, publicClient) {

  // publicClient.sync('');

  return {
    name: "sharedy",

    dataHints: {
      "module" : "Quickly share screenshots, photos, etc. with the world"
    },

    exports: {

      // remoteStorage.bookmarks.on('change', function(changeEvent) {
      //   if(changeEvent.newValue && changeEvent.oldValue) {
      //    changeEvent.origin:
      //      * window - event come from current window
      //            -> ignore it
      //      * device - same device, other tab (/window/...)
      //      * remote - not related to this app's instance, some other app updated something on remoteStorage
      //   }
      // });
      on: publicClient.on,

      // listUrls: function() {
      //   var keys = privateClient.getListing('');
      //   var urls = [];
      //   keys.forEach(function(key) {
      //     urls.push(privateClient.getObject(key).url);
      //   });
      //   return urls;
      // },


      // listBookmarks: function() {
      //   var keys = privateClient.getListing('');
      //   var bms = [];
      //   keys.forEach(function(key) {
      //     bms.push(privateClient.getObject(key));
      //   });
      //   privateClient.use('');
      //   return bms;
      // },

      storeImage: function(mimeType, fileName, data, callback) {
        return publicClient.storeDocument(
          mimeType,
          "images/" + encodeURIComponent(fileName),
          data,
          callback
        )

        //TODO Update private share history
        // return privateClient.storeObject(
        //   // /bookmarks/http%3A%2F%2Funhosted.org%2F
        //   'bookmark', encodeURIComponent(url), {
        //     url: url,
        //     createdAt: new Date()
        //   },
        //   callbackFunction;
        // );
      },

      getImageUrl: function(fileName) {
        return publicClient.getItemURL(
          "images/" + encodeURIComponent(fileName)
        );
      }

      // publish: function(url) {
      //   var key = encodeURIComponent(url);
      //   var bookmark = privateClient.getObject(key);

      //   publicClient.storeObject('bookmark', key, bookmark);

      //   var listing = publicClient.getListing('');
      //   delete listing['published'];
      //   publicClient.storeObject('bookmark-list', 'published', listing);
      // }

    }
  };
});
