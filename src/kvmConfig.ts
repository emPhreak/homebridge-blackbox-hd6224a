import {AccessoryConfig, PlatformConfig} from 'homebridge';

export interface KvmConfig extends AccessoryConfig{
    name: string;
    path: string;
    baudRate: number;
    input1: string;
    input2: string;
    input3: string;
    input4: string;
}

export interface KvmPlatformConfig extends PlatformConfig
{
    devices: KvmConfig[];
}