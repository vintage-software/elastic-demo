import * as request from 'request-promise';
import { RequestPromise } from 'request-promise';

export class BaseElastic {
    protected baseUrl = 'http://localhost:9200/';

    protected indexUrl = `${this.baseUrl}test`;

    protected execute(message: string, request: RequestPromise) {
        request
            .then(() => console.log(`${message}: success`))
            .catch(() => console.log(`${message}: failed`));
    }
}