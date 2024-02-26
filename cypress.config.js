const { defineConfig } = require('cypress');
const fs = require('fs');
const { join } = require('path');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task',{

        deleteOrderFile:function(){
          fs.writeFileSync(join(process.cwd(), 'data', 'json-data', 'orders.json'),'')
          return true
        }

      })
    },
  },
});
