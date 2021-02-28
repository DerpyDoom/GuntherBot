module.exports = {
  Clear: function () {
    lcd.clearSync();
  },
  SetText: function(line, message) {
    switch(line)
    {
     case 1:
     {
       lcd.printLineSync(0, message);
     }
     return;
     case 2:
     {
       lcd.printLineSync(1, message);
     }
     return;
    }
  }
};

// Import the module
const LCD = require('raspberrypi-liquid-crystal');
// Instantiate the LCD object on bus 1 address 3f with 16 chars width and 2 lines
const lcd = new LCD(1, 0x27, 16, 2);
// Init the lcd (must be done before calling any other methods)
lcd.beginSync();
// Clear any previously displayed content
lcd.clearSync();
