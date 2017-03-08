import fetch from 'node-fetch';
import { Response } from 'node-fetch';

export class BaseElastic {
    private baseUrl = 'http://localhost:9200';

    private indexUrl = `${this.baseUrl}/test`;

    protected typeUrl = `${this.indexUrl}/widget`

    protected recreateIndex(mapping: any) {
        return this.deleteIndex()
            .then(() => this.createIndex(mapping));
    }

    protected indexDocuments(documents: any[]) {
        return Promise.all(documents.map(doc => this.indexDocument(doc)))
            .then(() => this.refreshIndex());
    }

    protected search(query: any) {
        return this.execute('search', this.http('POST', `${this.typeUrl}/_search`, query));
    }

    protected printResults(response: any) {
        this.print('hits', this.getHits(response));
        this.print('aggs', this.getAggs(response));
    }

    protected execute(message: string, request: Promise<any>) {
        return request
            .then(result => {
                console.log(`${message}: success`);
                return result;
            })
            .catch(result => {
                console.log(`${message}: failure`);
                return Promise.resolve(undefined);
            });
    }

    private deleteIndex() {
        return this.execute('delete index', this.http('DELETE', this.indexUrl));
    }

    private createIndex(mapping: any) {
        return this.execute('create index', this.http('PUT', this.indexUrl, this.getIndexSettings(mapping)));
    }

    private indexDocument(document) {
        return this.execute('insert doc', this.http('POST', this.typeUrl, document));
    }

    private refreshIndex() {
        return this.execute('refresh', this.http('POST', `${this.indexUrl}/_refresh`));
    }

    private getIndexSettings(mapping: any) {
        return {
            settings: {
                number_of_shards: 1,
                number_of_replicas: 0
            },
            mappings: {
                widget: mapping
            }
        };
    }

    private getHits(response) {
        return (<any[]>response.hits.hits)
            .map(i => i._source)
            .map(i => i.description);
    }

    private getAggs(response) {
        return response.aggs;
    }

    private http(method: string, url: string, body?: any): Promise<any> {
        return fetch(url, {
            method: method,
            body: JSON.stringify(body)
        }).then(response => response && response.json());
    }

    private print(message: string, value: any) {
        if (value) {
            console.log(`${message}:`, value);
        }
    }
}