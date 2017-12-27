import * as base from '@zcomp/base';
export interface TabsOptions extends base.ComponentOptions {
    /**
     * Class to add to root element of initialized component
     */
    tabsInitedClass?: string;
    /**
     * Selector for tab elements
     */
    tabSelector?: string;
    /**
     * Selector for label elements
     */
    labelSelector?: string;
    /**
     * Class to add to active tabs
     */
    activeTabClass?: string;
    /**
     * Class to add to active labels
     */
    activeLabelClass?: string;
    /**
     * Name of event fired before tabs change state.
     * This event is cancellable -- if you cancel it, tab will not be switched.
     */
    beforeTabsChangeStateEvent?: string;
    /**
     * Name of event fired after tabs change state
     */
    afterTabsChangeStateEvent?: string;
    /**
     * Name of event fired on tab and label after a tab is activated or deactivated.
     */
    tabChangeStateEvent?: string;
    /**
     * Attribute on root element that determines index of tab to be activated by default
     */
    defaultActiveIndexAttr?: string;
    /**
     * Name of the key in local storage to be used for storing state.
     */
    stateStorageKey?: string;
    /**
     * Attribute on root element that determines whether component should automatically save and restore its state.
     * Note that root element of component should have `id` attribute for it to work.
     */
    autoSaveStateAttr?: string;
    /**
     * Whether component should automatically save and restore state.
     * Attributes have priority over the value of this option.
     */
    defaultAutoSaveState?: boolean;
    /**
     * Attribute on root element that determines whether component should be hash-navigatable.
     */
    hashNavigateAttr?: string;
    /**
     * Whether component should be hash-navigatable.
     * Attributes have priority over the value of this option.
     */
    defaultHashNavigate?: boolean;
}
export declare const DefaultOptions: TabsOptions;
export interface TabData {
    label: Element;
    tab: Element;
    hash: string;
}
export interface TabsChangeStateEvent extends CustomEvent {
    detail: {
        oldActiveIndex: number;
        newActiveIndex: number;
    };
}
export interface TabChangeStateEvent extends CustomEvent {
    detail: {
        oldActiveIndex: number;
        newActiveIndex: number;
        newStateIsActive: boolean;
        currentIndex: number;
    };
}
export interface StoredState {
    activeIndex: number;
}
export interface StoredStateMap {
    [index: string]: StoredState;
}
export declare class Tabs extends base.Component<TabsOptions> {
    constructor(root: Element, options: TabsOptions);
    /**
     * Index of a currently active tab.
     * If result is negative, it means there are no active tabs.
     * @returns {number}
     */
    readonly activeIndex: number;
    /**
     * Number of tab in this component
     * @returns {number}
     */
    readonly tabCount: number;
    /**
     * Id of component.
     * It is equal to the value of `id` attribute of root element of the component.
     * @returns {string | null}
     */
    readonly id: string | null;
    /**
     * Whether component should automatically save and restore state.
     * @returns {boolean}
     */
    autoSaveState: boolean;
    /**
     * Whether the component is hash-navigatable
     * @returns {boolean}
     */
    readonly hashNavigate: boolean;
    /**
     * Get tab data by its index.
     * @param {number} index
     * @returns {TabData | null}
     */
    getTabData(index: number): TabData | null;
    /**
     * Activates a tab with given index.
     * It is normal for a component to be in a state where no tabs are active.
     * @param {number} index Tab index.
     * If you give a negative index, all tabs will be deactivated.
     * @returns {boolean} Whether tab with given index has been activated.
     */
    activateTab(index: number): boolean;
    /**
     * Get index of tab this label belongs to
     * @param {Element} label Label element
     * @returns {number} Index of tab or -1
     */
    getLabelIndex(label: Element): number;
    /**
     * Get index of tab this tab element belongs to
     * @param {Element} tab Tab element
     * @returns {number} Index of tab or -1
     */
    getTabIndex(tab: Element): number;
    /**
     * Get index of tab that matches this location.hash
     * @param {string} hash location.hash without leading '#' char
     * @returns {number} Index of tab or -1
     */
    getHashIndex(hash: string): number;
    /**
     * Activates the tab after the current one
     * @param {boolean} cycle If this value is true, activates first tab after the last one
     * @returns {boolean} Whether next tab has been activated
     */
    activateNextTab(cycle?: boolean): boolean;
    /**
     * Activates the tab before the current one
     * @param {boolean} cycle If this value is true, activates the last tab after the first one
     * @returns {boolean} Whether prev tab has been activated
     */
    activatePrevTab(cycle?: boolean): boolean;
    /**
     * Get index of the next tab.
     * @param {boolean} cycle
     * @param {number | null} fromIndex Start from given index.
     * If null, activeIndex of the component is used.
     * @returns {number | null}
     */
    getNextTabIndex(cycle?: boolean, fromIndex?: number | null): number | null;
    /**
     * Get index of the previous tab.
     * @param {boolean} cycle
     * @param {number | null} fromIndex Start from given index.
     * If null, activeIndex of the component is used.
     * @returns {number | null}
     */
    getPrevTabIndex(cycle?: boolean, fromIndex?: number | null): number | null;
    /**
     * Whether the tab with given index is enabled.
     * Tab is considered enabled only if its label element is enabled.
     * @param {number} index
     * @returns {boolean} true if tab is enabled.
     * If no tab with given index exists, false is returned and no error is thrown.
     */
    isTabEnabled(index: number): boolean;
    /**
     * Get component state as a plain object.
     * @returns {StoredState}
     */
    exportState(): StoredState;
    /**
     * Stores component state into local storage.
     * Component should have valid id for it to work.
     */
    saveState(): void;
    /**
     * Restores component state from local storage.
     * Component should have valid id for it to work.
     */
    restoreState(): void;
    /**
     * Activates a tab that matches a given hash.
     * @param {string} hash location.hash value
     * @returns {boolean} True if a tab has been activated, false otherwise
     */
    activateByHash(hash: string): boolean;
    /** Protected area **/
    protected _data: TabData[];
    protected _activeIndex: number;
    protected _id: string | null;
    protected _autoSaveState: boolean;
    protected _hashNavigate: boolean;
    protected _sendEvent(index: number, oldIndex: number, eName: string): void;
    protected _collectTabs(): void;
    protected _onClick(e: Event): void;
    protected _onHashChange(e: Event): void;
}
export declare const TabsFactory: base.ComponentFactory<Tabs, TabsOptions>;
