class LightManager {
  constructor(client) {
    this.client = client;
  }

  async toggleRoomLights() {
    this.bulb1 = await this.client.getDevice({
      host: "192.168.50.34",
      port: "9999",
    });

    await this.bulb1.setPowerState(!(await this.bulb1.getPowerState()));
  }
}

module.exports = LightManager;
