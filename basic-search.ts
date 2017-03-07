import * as request from 'request-promise';
import { BaseElastic } from './base-elastic';

export class BasicSearch extends BaseElastic {
    run() {
        this.deleteIndex();
        this.createIndex();
    }

    private deleteIndex() {
        this.execute('delete index', request.delete(this.indexUrl));
    }

    private createIndex() {
        this.execute('create index', request.put(this.indexUrl, {
            json: {
                settings: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                mappings: {
                    event: {
                        properties: {
                            description: { type: "text" }
                        }
                    }
                }
            }
        }));
    }
}