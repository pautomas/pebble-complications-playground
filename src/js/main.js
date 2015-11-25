var Vm = require('vm.js');

Pebble.addEventListener("ready",
    function(e) {
      var vm = new Vm();

      // Set the global variables for the VM
      vm.realm.global = {
        undefined : undefined,
        console : console,
        message : function(message) {
          console.log("Sending message: ", JSON.stringify(message));
          Pebble.sendAppMessage(
            { '0' : message },
            function(e) {
              console.log('Successfully delivered message with transactionId=' +
               e.data.transactionId);
              },
              function(e) {
                console.log('Unable to deliver message with transactionId=' +
                 e.data.transactionId + ' Error is: ' + e.error.message);
                }
          );
        }
      };

      // Can send messages to the watch
      vm.eval('\
        console.log("Allows to send messages to the app");\
        message("Message from script");\
      ');

      // No access to Pebble or Window
      vm.eval('\
        console.log("No access to Pebble or Window");\
        if (typeof window === "undefined") {\
          console.log("NO WINDOW");\
        };\
        if (typeof Pebble === "undefined") {\
          console.log("NO PEBBLE");\
        };\
      ');

      // It doesn't protect against "DOS" attacks like this one
      // vm.eval('\
      //   while (1) { };\
      // ');

      // A good solution would be Web Workers, but they're not supported :(
      if (window.Worker) {
        console.log('WORKERS!');
      }
    }
);
