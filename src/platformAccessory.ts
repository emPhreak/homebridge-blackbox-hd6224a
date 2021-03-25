import { API, Service, PlatformAccessory, CharacteristicValue, Logger } from 'homebridge';

import { BlackBoxH6224HomebridgePlatform } from './platform';
import { KvmConfig } from './kvmConfig';
import SerialPort from 'serialport';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class HD6224Accessory {
  private service: Service;

  // store state of which input is active on the KVM
  private activeIdentifier = 1;

  private readonly port: SerialPort;
  private readonly parser: SerialPort.parsers.Readline;

  constructor(
    private readonly log: Logger,
    private readonly api: API,
    private readonly config: KvmConfig,
    private readonly platform: BlackBoxH6224HomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // handle config
    const c = config;
    this.log.info('Config: ', c);

    // setup the serial port connection to the KVM
    this.port = new SerialPort(c.path, {
      baudRate: c.baudRate,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      lock: true,
      autoOpen: true,
      xoff: false,
      xon: false,
    }, (error: Error | null | undefined) => {
      if (error) {
        this.log.error(error.message);
      }
    });

    // Use a `\r\n` as a line terminator
    this.parser = new SerialPort.parsers.Readline({
      delimiter: '\r',
      includeDelimiter: false,
    });

    this.port.pipe(this.parser);

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'BlackBox')
      .setCharacteristic(this.platform.Characteristic.Model, 'HD6224A')
      .setCharacteristic(this.platform.Characteristic.Name, c.name)
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, 'V2')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, c.path);

    this.accessory.category = this.api.hap.Categories.TV_SET_TOP_BOX;

    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.Television) ||
                    this.accessory.addService(this.platform.Service.Television);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.ConfiguredName, c.name);
    this.service.setCharacteristic(this.platform.Characteristic.SleepDiscoveryMode,
      this.platform.Characteristic.SleepDiscoveryMode.NOT_DISCOVERABLE);

    // each service must implement at-minimum the "required characteristics" for the given service type
    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(this.setActive.bind(this))
      .onGet(this.getActive.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.ActiveIdentifier)
      .onSet(this.setActiveIdentifier.bind(this))
      .onGet(this.getActiveIdentifier.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.Identify)
      .onSet((newValue) => {
        this.log.info('Identify -> ', newValue);
      });

    this.service.getCharacteristic(this.platform.Characteristic.RemoteKey)
      .onSet((newValue) => {
        this.log.info('RemoteKey -> ', newValue);
      });

    /**
     * Create TV Input Source Services
     * These are the inputs the user can select from.
     * When a user selected an input the corresponding Identifier Characteristic
     * is sent to the TV Service ActiveIdentifier Characteristic handler.
     */

    // HDMI 1 Input Source
    const hdmi1InputService = this.accessory.addService(this.platform.Service.InputSource, 'input1', c.input1);
    hdmi1InputService
      .setCharacteristic(this.platform.Characteristic.Identifier, 1)
      .setCharacteristic(this.platform.Characteristic.Name, 'input1')
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, c.input1)
      .setCharacteristic(this.platform.Characteristic.IsConfigured, this.platform.Characteristic.IsConfigured.CONFIGURED)
      .setCharacteristic(this.platform.Characteristic.CurrentVisibilityState, this.platform.Characteristic.CurrentVisibilityState.SHOWN)
      .setCharacteristic(this.platform.Characteristic.InputSourceType, this.platform.Characteristic.InputSourceType.HDMI);
    this.service.addLinkedService(hdmi1InputService); // link to tv service

    const hdmi2InputService = this.accessory.addService(this.platform.Service.InputSource, 'input2', c.input2);
    hdmi2InputService
      .setCharacteristic(this.platform.Characteristic.Identifier, 2)
      .setCharacteristic(this.platform.Characteristic.Name, 'input2')
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, c.input2)
      .setCharacteristic(this.platform.Characteristic.IsConfigured, this.platform.Characteristic.IsConfigured.CONFIGURED)
      .setCharacteristic(this.platform.Characteristic.CurrentVisibilityState, this.platform.Characteristic.CurrentVisibilityState.SHOWN)
      .setCharacteristic(this.platform.Characteristic.InputSourceType, this.platform.Characteristic.InputSourceType.HDMI);
    this.service.addLinkedService(hdmi2InputService); // link to tv service

    const hdmi3InputService = this.accessory.addService(this.platform.Service.InputSource, 'input3', c.input3);
    hdmi3InputService
      .setCharacteristic(this.platform.Characteristic.Identifier, 3)
      .setCharacteristic(this.platform.Characteristic.Name, 'input3')
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, c.input3)
      .setCharacteristic(this.platform.Characteristic.IsConfigured, this.platform.Characteristic.IsConfigured.CONFIGURED)
      .setCharacteristic(this.platform.Characteristic.CurrentVisibilityState, this.platform.Characteristic.CurrentVisibilityState.SHOWN)
      .setCharacteristic(this.platform.Characteristic.InputSourceType, this.platform.Characteristic.InputSourceType.HDMI);
    this.service.addLinkedService(hdmi3InputService); // link to tv service

    const hdmi4InputService = this.accessory.addService(this.platform.Service.InputSource, 'input4', c.input4);
    hdmi4InputService
      .setCharacteristic(this.platform.Characteristic.Identifier, 4)
      .setCharacteristic(this.platform.Characteristic.Name, 'input4')
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, c.input4)
      .setCharacteristic(this.platform.Characteristic.IsConfigured, this.platform.Characteristic.IsConfigured.CONFIGURED)
      .setCharacteristic(this.platform.Characteristic.CurrentVisibilityState, this.platform.Characteristic.CurrentVisibilityState.SHOWN)
      .setCharacteristic(this.platform.Characteristic.InputSourceType, this.platform.Characteristic.InputSourceType.HDMI);
    this.service.addLinkedService(hdmi4InputService); // link to tv service
  }

  async setActive(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    const isOn = value as boolean;

    if (isOn) {
      // open the serial port
      this.port.open();
    } else {
      // close the serial port
      this.port.close();
    }

    this.log.info('Set IsActive = ', isOn);
  }

  async getActive(): Promise<CharacteristicValue> {
    const isOn = this.port.isOpen;
    this.log.info('Get IsActive = ', isOn);
    return isOn;
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setActiveIdentifier(value: CharacteristicValue) {
    this.activeIdentifier = value as number;

    // send command (e.g. "//m[#]") to serial port
    const command = '//m' + this.activeIdentifier + '\r\n';
    this.port.write(command);
    this.log.info(command);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getActiveIdentifier(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    const id = this.activeIdentifier;

    // TODO: parse strings from command to KVM (e.g: "//?" -> "Current KM Control: 2")

    this.platform.log.info('Get Characteristic ActiveIdentifier ->', id);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return id;
  }

}
