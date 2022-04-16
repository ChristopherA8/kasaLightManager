class LightManager {
  constructor(client) {
    this.client = client;
  }

  async toggleRoomLights() {
    this.bulb1 = await this.client.getDevice({
      host: "192.168.50.34",
      port: "9999",
    });
    this.bulb2 = await this.client.getDevice({
      host: "192.168.50.167",
      port: "9999",
    });
    this.bulb3 = await this.client.getDevice({
      host: "192.168.50.237",
      port: "9999",
    });

    await this.bulb1.setPowerState(!(await this.bulb1.getPowerState()));
    await this.bulb2.setPowerState(!(await this.bulb2.getPowerState()));
    await this.bulb3.setPowerState(!(await this.bulb3.getPowerState()));
  }
}

module.exports = LightManager;
