import { AxiosResponse } from 'axios';
import layout from './_store';

type LoaderCallback = () => any;

interface ILoaderAction {
  sendAsync(callback: LoaderCallback): Promise<AxiosResponse>;
}

class LoaderAction implements ILoaderAction {
  /**
   * exposes the loader during the time window of asynchronous call
   * @param callback
   */
  public async sendAsync(callback: LoaderCallback): Promise<AxiosResponse> {
    layout.toggleLoader(true);

    const response = await callback();

    layout.toggleLoader(false);

    return response;
  }
}

export default new LoaderAction();
