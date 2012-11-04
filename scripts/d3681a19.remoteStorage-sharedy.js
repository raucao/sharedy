remoteStorage.defineModule("sharedy", function(privateClient, publicClient) {

  // publicClient.sync('');

  return {
    name: "sharedy",

    dataHints: {
      "module" : "Quickly share screenshots, photos, etc. with the world"
    },

    exports: {

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
        return publicClient.storeFile(
          mimeType,
          "images/" + encodeURIComponent(fileName),
          data,
          callback
        )

      },

      getImageUrl: function(fileName) {
        return publicClient.getItemURL(
          "images/" + encodeURIComponent(fileName)
        );
      }

    }
  };
});
