import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ResourceService} from '../resource.service';
import {Resource} from '../../model/resource';
import {config} from '../../editorial-selection.config';

export interface SessionValidation extends Resource {
    respStatus?: number;
    userId?: string;
    employeeId?: string;
    uid?: string;
    token?: string;
}

export interface SessionValidationError {
    message: string;
    name: string;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
}

@Injectable()
export class TokenValidationService extends ResourceService<SessionValidation> {
    constructor(httpClient: HttpClient) {
        super(httpClient, config.azure.baseUrl, config.azure.validate.endpoint);
    }
}
