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

      storeImage: function(mimeType, filename, data, callback) {
        return publicClient.storeFile(
          mimeType,
          "images/" + encodeURIComponent(filename),
          data,
          false
        ).then(function(){
          callback();
        });
      },

      getImageUrl: function(filename) {
        return publicClient.getItemURL(
          "images/" + encodeURIComponent(filename)
        );
      },

      getListing: publicClient.getListing,
      remove: publicClient.remove
    }
  };
});
