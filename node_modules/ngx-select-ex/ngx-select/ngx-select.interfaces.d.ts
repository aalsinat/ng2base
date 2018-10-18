import { NgxSelectOption, TSelectOption } from './ngx-select.classes';
export declare type TNgxSelectOptionType = 'option' | 'optgroup';
export interface INgxSelectOptionBase {
    type: TNgxSelectOptionType;
}
export interface INgxSelectOption {
    value: number | string;
    text: string;
    disabled: boolean;
    data: any;
}
export interface INgxSelectOptGroup {
    label: string;
    options: INgxSelectOption[];
}
export interface INgxOptionNavigated {
    index: number;
    activeOption: NgxSelectOption;
    filteredOptionList: TSelectOption[];
}
export interface INgxSelectOptions {
    optionValueField?: string;
    optionTextField?: string;
    optGroupLabelField?: string;
    optGroupOptionsField?: string;
    multiple?: boolean;
    allowClear?: boolean;
    placeholder?: string;
    noAutoComplete?: boolean;
    disabled?: boolean;
    autoSelectSingleOption?: boolean;
    autoClearSearch?: boolean;
    noResultsFound?: string;
    size?: 'small' | 'default' | 'large';
    keyCodeToRemoveSelected?: string;
    keyCodeToOptionsOpen?: string;
    keyCodeToOptionsClose?: string;
    keyCodeToOptionsSelect?: string;
    keyCodeToNavigateFirst?: string;
    keyCodeToNavigatePrevious?: string;
    keyCodeToNavigateNext?: string;
    keyCodeToNavigateLast?: string;
}
