remoteStorage.defineModule("sharedy", function(privateClient, publicClient) {
  return {
    name: "sharedy",

    dataHints: {
      "module" : "Quickly share screenshots, photos, etc. with the world"
    },

    exports: {
      init: function() {
        publicClient.release('');
      },

      storeImage: function(mimeType, fileName, data, callback) {
        return publicClient.storeFile(
          mimeType,
          "images/" + encodeURIComponent(fileName),
          data,
          false
        ).then(function(){
          callback();
        });
      },

      getImageUrl: function(fileName) {
        return publicClient.getItemURL(
          "images/" + encodeURIComponent(fileName)
        );
      },

      getListing: publicClient.getListing
    }
  };
});
