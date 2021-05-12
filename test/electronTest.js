const Application = require('spectron').Application;
const assert = require('assert');
const path = require('path');
const electronPath = require('electron');

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '..')]
})

describe('Electron app tests', function() {

    //Start the electron app before each test
    beforeEach(() => {
        return app.start();
    });

    //Stop the electron app after completion of each test
    afterEach(() => {
        if(app && app.isRunning()){
            return app.stop();
        }
    });

    it('display the electron app window', async () => {
        
        const count = await app.client.getWindowCount();
        return assert.strictEqual(count, 1)
    });

    it('has the correct title', async () => {
        const title = await app.client.getTitle();
        return assert.strictEqual(title, 'Axon');
      });
})