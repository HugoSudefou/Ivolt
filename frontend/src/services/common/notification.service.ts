import { Notify } from 'quasar';
import {NotificationStatusEnum} from "src/common/enums";

export function displayNotification (status: NotificationStatusEnum, message: string) {
  Notify.create({
    type: status,
    color: status,
    message: message,
    position: 'bottom-right',
    progress: false,
    timeout: status === NotificationStatusEnum.SUCCESS ? 5000 : 10000,
    actions: status !== NotificationStatusEnum.SUCCESS ? [{ icon: 'close', color: 'white' }] : undefined
  });
}
