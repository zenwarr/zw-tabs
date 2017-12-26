import * as base from '@zcomp/base';
export interface TabsOptions extends base.ComponentOptions {
    tabsInitedClass?: string;
    tabSelector?: string;
    labelSelector?: string;
    activeTabClass?: string;
    activeLabelClass?: string;
    beforeTabsChangeStateEvent?: string;
    afterTabsChangeStateEvent?: string;
    tabChangeStateEvent?: string;
    defaultActiveIndexAttr?: string;
    stateStorageKey?: string;
    autoSaveStateAttr?: string;
    defaultAutoSaveState?: boolean;
    hashNavigateAttr?: string;
    defaultHashNavigate?: boolean;
}
export declare const DefaultOptions: TabsOptions;
export interface TabData {
    label: Element;
    tab: Element;
    hash: string;
}
export interface TabsChangeStateEvent extends CustomEvent {
    oldActiveIndex: number;
    newActiveIndex: number;
}
export interface TabChangeStateEvent extends TabsChangeStateEvent {
    newStateIsActive: boolean;
    currentIndex: number;
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
    readonly id: string | null;
    autoSaveState: boolean;
    readonly hashNavigate: boolean;
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
    getNextTabIndex(cycle?: boolean, fromIndex?: number | null): number | null;
    getPrevTabIndex(cycle?: boolean, fromIndex?: number | null): number | null;
    isTabEnabled(index: number): boolean;
    exportState(): StoredState;
    saveState(): void;
    restoreState(): void;
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
