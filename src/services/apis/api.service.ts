import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { displayNotification } from '../common/notification.service';
import { merge as _merge } from 'lodash';
import { WorkDone, WorkDoneError } from 'src/common/utils';
import { NotificationStatusEnum } from 'src/common/enums';

export class ApiService {
  private readonly _axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this._axiosInstance = axiosInstance;
  }

  private _checkReturn<R>(
    returnApi: AxiosResponse<R> | AxiosError<R>,
    message?: { successMessage: string | null; warningMessage: string | null },
  ): WorkDone<R> {
    const mapBadReturn: Map<number, string> = new Map([
      [400, 'Bad Request'],
      [401, 'Unauthorized'],
      [403, 'Forbidden'],
      [404, 'Not Found'],
      [500, 'Internal Server Error'],
      [502, 'Bad Gateway ou Proxy Error'],
      [503, 'Service Unavailable'],
      [504, 'Gateway Time-out'],
    ]);

    // Check if the response OK
    if (returnApi && returnApi.status === 200) {
      const response = returnApi as AxiosResponse;
      return WorkDone.buildOk(
        response.data,
        message?.successMessage ?? '',
        message?.warningMessage ?? '',
      );
    }
    const error = returnApi as AxiosError;
    if (error && error.response && mapBadReturn.get(error.response.status)) {
      // In case of functional error, display an error message
      let message: string = error.message || 'Unknown Error';
      const code = error.code;
      if (code) {
        message = message.concat(` - code: ${code}`);
      }
      const name = error.name;
      if (name) {
        message = message.concat(` - name: ${name}`);
      }

      displayNotification(NotificationStatusEnum.FAILURE, message);
      return WorkDone.buildError<R>(message);
    }

    return WorkDone.buildError<R>('Unknown Error (1)');
  }

  private static _catchHandler<R>(
    wd: WorkDone<R>,
  ): WorkDone<R> | Promise<WorkDone<R>> {
    let message = wd.error?.message ?? 'Unknown Error (2)';
    if (wd.error) {
      message = wd.error.message as string;
    }
    displayNotification(NotificationStatusEnum.FAILURE, message);
    return WorkDone.buildError<R>(message);
  }

  private static _thenHandler<R>(
    wd: WorkDone<R>,
  ): WorkDone<R> | Promise<WorkDone<R>> {
    // Check if the response isOK
    if (wd.isOk && wd.data) {
      if (wd.successMessage) {
        displayNotification(NotificationStatusEnum.SUCCESS, wd.successMessage);
      }
      if (wd.warningMessage) {
        displayNotification(NotificationStatusEnum.WARNING, wd.warningMessage);
      }
      return wd;
    } else if (wd.data && wd.error) {
      // In case of functional error, display an error message
      let message: string = wd.error.message || 'Unknown Error';
      const logRef = wd.error.logRef;
      if (logRef) {
        message = message.concat(` - logRef: ${logRef}`);
      }

      displayNotification(NotificationStatusEnum.FAILURE, message);
      return WorkDone.buildError<R>(message);
    } else {
      return WorkDone.buildError<R>('Unknown Error (1)');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async doGet<R>(
    serviceUri: string,
    params?: any,
    config?: AxiosRequestConfig,
    message?: { successMessage: string | null; warningMessage: string | null },
  ): Promise<WorkDone<R>> {
    const runConfig = _merge({}, config, { params });
    try {
      const resp = await this._axiosInstance.get<R>(serviceUri, runConfig);
      return ApiService._thenHandler(this._checkReturn(resp, message));
    } catch (err) {
      return ApiService._catchHandler(this._checkReturn(err as AxiosError<R>));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async doPost<R>(
    serviceUri: string,
    data?: any,
    config?: AxiosRequestConfig,
    message?: { successMessage: string | null; warningMessage: string | null },
  ): Promise<WorkDone<R>> {
    const runConfig = _merge({}, config);
    try {
      const resp = await this._axiosInstance.post<R>(
        serviceUri,
        data,
        runConfig,
      );
      return ApiService._thenHandler(this._checkReturn(resp, message));
    } catch (err) {
      return ApiService._catchHandler(this._checkReturn(err as AxiosError<R>));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async doDelete<R>(
    serviceUri: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<WorkDone<R>> {
    const runConfig = _merge({}, config);
    try {
      const resp = await this._axiosInstance.delete<R>(serviceUri, runConfig);
      return ApiService._thenHandler(this._checkReturn(resp));
    } catch (err) {
      return ApiService._catchHandler(this._checkReturn(err as AxiosError<R>));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async doPut<R>(
    serviceUri: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<WorkDone<R>> {
    const runConfig = _merge({}, config);
    try {
      const resp = await this._axiosInstance.put<R>(
        serviceUri,
        data,
        runConfig,
      );
      return ApiService._thenHandler(this._checkReturn(resp));
    } catch (err) {
      return ApiService._catchHandler(this._checkReturn(err as AxiosError<R>));
    }
  }
}
