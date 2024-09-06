export interface IPayloadCreateSchedule {
  hour: string;
  minute: string;
}
export interface IPayloadUpdateSchedule extends IPayloadCreateSchedule {
  id: number;
}
