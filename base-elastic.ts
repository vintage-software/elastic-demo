import * as request from 'request-promise';
import { RequestPromise } from 'request-promise';
import { Thenable, join } from 'bluebird';

export class BaseElastic {
    protected baseUrl = 'http://localhost:9200';

    protected indexUrl = `${this.baseUrl}/test`;

    protected typeUrl = `${this.indexUrl}/widget`

    protected recreateIndex(mapping: any): Thenable<void> {
        return this.deleteIndex()
            .then(() => this.createIndex(mapping));
    }

    protected execute(message: string, request: RequestPromise): Thenable<void> {
        return request
            .then(() => console.log(`${message}: success`))
            .catch(() => console.log(`${message}: failed`));
    }

    private deleteIndex() {
        return this.execute('delete index', request.delete(this.indexUrl));
    }

    private createIndex(mapping: any) {
        return this.execute('create index', request.put(this.indexUrl, {
            json: {
                settings: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                mappings: {
                    widget: mapping
                }
            }
        }));
    }

    indexDocuments(documents: any[]) {
        return join(documents.map(doc => this.indexDocument(doc)));
    }

    private indexDocument(document) {
        return this.execute('insert doc', request.post(this.typeUrl, {
            json: document
        }))
    }
}