class LightManager {
  constructor(client) {
    this.client = client;
    this.bulbs = [];
  }

  clearBulbs() {
    this.bulbs = [];
  }

  async startSearchingAndAddBulbs() {
    this.clearBulbs();
    this.client.startDiscovery().on("bulb-new", async (bulb) => {
      this.bulbs.push(
        await this.client.getDevice({ host: bulb.host, port: bulb.port })
      );
    });
  }

  stopSearching() {
    this.client.stopDiscovery();
  }

  async turnOffRoomLights() {
    for (let i = 0; i < this.bulbs.length; i++) {
      await this.bulbs[i].setPowerState(false);
    }
  }

  async turnOnRoomLights() {
    for (let i = 0; i < this.bulbs.length; i++) {
      await this.bulbs[i].setPowerState(true);
    }
  }

  async toggleRoomLights() {
    for (let i = 0; i < this.bulbs.length; i++) {
      let bulb = this.bulbs[i];
      await bulb.setPowerState(!(await bulb.getPowerState()));
    }
  }
}

module.exports = LightManager;
