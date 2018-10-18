import {Injectable} from '@angular/core';
import {environment} from '@env/environment';

import {config} from '../../editorial-selection.config';

const READ_ONLY = 'ReadOnly';

const PROD_HYPHEN_COUNT = 1;
const PROD_GROUP_INDEX = 1;
const NONPROD_HYPHEN_COUNT = 2;
const NONPROD_GROUP_INDEX = 2;

@Injectable()
export class RoleManagementService {

    constructor() {
    }

    /**
     * Given a list of Azure groups, returns the list of related roles, based on mapping defined on configuration file
     *
     * @param groups list of Azure groups
     */
    getRoles(groups: string[]): string[] {
        let roles: string[] = [];

        groups.forEach((group: string) => {
            if (this.isValidGroup(group)) {
                const groupName = this.getRoleFromGroup(group, this.isLowerEnvironment());
                let groupRoles = config.roleMapping[groupName];
                if (!group.toLowerCase().includes('selection') && groupName.toLowerCase().includes('developer')) {
                    groupRoles = [];
                }
                if (!group.toLowerCase().includes('selection') && groupName.toLowerCase().includes('publicationprocessing')) {
                    groupRoles = [];
                }
                roles = groupRoles ? roles.concat(groupRoles) : roles;
            }
        });
        if (roles.length === 0) {
            roles.push(READ_ONLY);
        }
        return roles;
    }

    /* Support functions */
    getRoleFromGroup(group: string, isLowerEnv: boolean) {
        return isLowerEnv ? group.split('-')[NONPROD_GROUP_INDEX] : group.split('-')[PROD_GROUP_INDEX];
    }

    protected isProductionGroup(group: string): boolean {
        const hyphens = group.split('-').length - 1;
        return hyphens === PROD_HYPHEN_COUNT && this.isProductionEnvironment();
    }

    protected isNonProductionGroup(group: string): boolean {
        const hyphens = group.split('-').length - 1;
        return hyphens === NONPROD_HYPHEN_COUNT && this.isLowerEnvironment();
    }

    protected isProductionEnvironment(): boolean {
        return environment.production;
    }

    protected isLowerEnvironment(): boolean {
        return !environment.production;
    }

    protected isValidGroup(group: string): boolean {
        return this.isProductionGroup(group) || this.isNonProductionGroup(group);
    }
}
