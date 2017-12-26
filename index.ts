import * as base from '@zcomp/base';
import closest from "@zcomp/closest";

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

export const DefaultOptions: TabsOptions = {
  rootSelector: '.js-tabs',
  tabsInitedClass: 'js-tabs--inited',
  tabSelector: '.js-tabs__tab',
  labelSelector: '.js-tabs__label',
  activeTabClass: 'js-tabs__tab--active',
  activeLabelClass: 'js-tabs__label--active',
  beforeTabsChangeStateEvent: 'before-tabs-change-state',
  afterTabsChangeStateEvent: 'after-tabs-change-state',
  tabChangeStateEvent: 'tab-change-state',
  defaultActiveIndexAttr: 'data-tabs-active-index',
  stateStorageKey: 'zcomp_tabs_state',
  autoSaveStateAttr: 'data-tabs-auto-save-state',
  defaultAutoSaveState: false,
  hashNavigateAttr: 'data-tabs-hash-navigate',
  defaultHashNavigate: false
};

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

export class Tabs extends base.Component<TabsOptions> {
  constructor(root: Element, options: TabsOptions) {
    super(root, options);
    this._id = this.root.getAttribute('id') || null;
    this._collectTabs();
    this.root.addEventListener('click', this._onClick.bind(this));

    if ((this.options.autoSaveStateAttr && this.root.hasAttribute(this.options.autoSaveStateAttr)) || this.options.defaultAutoSaveState) {
      this._autoSaveState = true;
      this.restoreState();
    }

    if ((this.options.hashNavigateAttr && this.root.hasAttribute(this.options.hashNavigateAttr)) || this.options.defaultHashNavigate) {
      this._hashNavigate = true;
      window.addEventListener('hashchange', this._onHashChange.bind(this));
      if (location.hash) {
        this.activateByHash(location.hash);
      }
    }

    if (this.options.tabsInitedClass) {
      this.root.classList.add(this.options.tabsInitedClass);
    }
  }

  /**
   * Index of a currently active tab.
   * If result is negative, it means there are no active tabs.
   * @returns {number}
   */
  get activeIndex(): number { return this._activeIndex; }

  /**
   * Number of tab in this component
   * @returns {number}
   */
  get tabCount(): number { return this._data.length; }

  get id(): string|null { return this._id; }

  get autoSaveState(): boolean { return this._autoSaveState; }

  set autoSaveState(value: boolean) { this._autoSaveState = value; }

  get hashNavigate(): boolean { return this._hashNavigate; }

  getTabData(index: number): TabData|null {
    return index >= 0 && index < this._data.length ? this._data[index] : null;
  }

  /**
   * Activates a tab with given index.
   * It is normal for a component to be in a state where no tabs are active.
   * @param {number} index Tab index.
   * If you give a negative index, all tabs will be deactivated.
   * @returns {boolean} Whether tab with given index has been activated.
   */
  activateTab(index: number): boolean {
    if (index < 0) {
      index = -1;
    } else if (index >= this._data.length) {
      console.warn(`Tabs plugin: no tab with index ${index}`);
      return false;
    }

    if (this.options.beforeTabsChangeStateEvent) {
      let beforeTabChangeEvent = new CustomEvent(this.options.beforeTabsChangeStateEvent, {
        bubbles: true,
        cancelable: true,
        detail: {
          oldActiveIndex: this._activeIndex,
          newActiveIndex: index
        } as TabsChangeStateEvent
      });
      if (!this.root.dispatchEvent(beforeTabChangeEvent)) {
        // tab switching cancelled
        return false;
      }
    }

    let oldIndex = this._activeIndex;
    this._activeIndex = index;

    if (this._autoSaveState) {
      this.saveState();
    }

    if (oldIndex >= 0 && oldIndex < this._data.length) {
      let d = this._data[oldIndex];

      if (this.options.activeLabelClass) {
        d.label.classList.remove(this.options.activeLabelClass);
      }
      if (this.options.activeTabClass) {
        d.tab.classList.remove(this.options.activeTabClass);
      }

      if (this.options.tabChangeStateEvent) {
        this._sendEvent(oldIndex, oldIndex, this.options.tabChangeStateEvent);
      }
    }

    if (this._activeIndex >= 0) {
      let d = this._data[this._activeIndex];

      if (this.options.activeLabelClass) {
        d.label.classList.add(this.options.activeLabelClass);
      }
      if (this.options.activeTabClass) {
        d.tab.classList.add(this.options.activeTabClass);
      }

      if (this.options.tabChangeStateEvent) {
        this._sendEvent(this._activeIndex, oldIndex, this.options.tabChangeStateEvent);
      }
    }

    if (this.options.afterTabsChangeStateEvent) {
      let afterTabChangeEvent = new CustomEvent(this.options.afterTabsChangeStateEvent, {
        bubbles: true,
        cancelable: false,
        detail: {
          oldActiveIndex: oldIndex,
          newActiveIndex: this._activeIndex
        } as TabsChangeStateEvent
      });
      this.root.dispatchEvent(afterTabChangeEvent);
    }

    if (this.hashNavigate) {
      let d = this.activeIndex >= 0 ? this._data[this.activeIndex] : null;
      location.hash = d && d.hash ? '#' + d.hash : '';
    }

    return true;
  }

  /**
   * Get index of tab this label belongs to
   * @param {Element} label Label element
   * @returns {number} Index of tab or -1
   */
  getLabelIndex(label: Element): number {
    for (let q = 0; q < this._data.length; ++q) {
      if (this._data[q].label == label) {
        return q;
      }
    }
    return -1;
  }

  /**
   * Get index of tab this tab element belongs to
   * @param {Element} tab Tab element
   * @returns {number} Index of tab or -1
   */
  getTabIndex(tab: Element): number {
    for (let q = 0; q < this._data.length; ++q) {
      if (this._data[q].tab == tab) {
        return q;
      }
    }
    return -1;
  }

  /**
   * Get index of tab that matches this location.hash
   * @param {string} hash location.hash without leading '#' char
   * @returns {number} Index of tab or -1
   */
  getHashIndex(hash: string): number {
    for (let q = 0; q < this._data.length; ++q) {
      if (this._data[q].hash == hash) {
        return q;
      }
    }
    return -1;
  }

  /**
   * Activates the tab after the current one
   * @param {boolean} cycle If this value is true, activates first tab after the last one
   * @returns {boolean} Whether next tab has been activated
   */
  activateNextTab(cycle: boolean = false): boolean {
    let nextIndex = this.getNextTabIndex(cycle, this.activeIndex);
    if (nextIndex == null) {
      return false;
    } else {
      return this.activateTab(nextIndex);
    }
  }

  /**
   * Activates the tab before the current one
   * @param {boolean} cycle If this value is true, activates the last tab after the first one
   * @returns {boolean} Whether prev tab has been activated
   */
  activatePrevTab(cycle: boolean = false): boolean {
    let prevIndex = this.getPrevTabIndex(cycle, this.activeIndex);
    if (prevIndex == null) {
      return false;
    } else {
      return this.activateTab(prevIndex);
    }
  }

  getNextTabIndex(cycle: boolean = false, fromIndex: number|null = null): number|null {
    if (!this.tabCount) {
      return null;
    }

    if (fromIndex == null) {
      fromIndex = this.activeIndex;
    }

    if (fromIndex >= 0 && fromIndex + 1 < this.tabCount) {
      return fromIndex + 1;
    } else if (fromIndex < 0) {
      return 0;
    } else if (cycle) {
      return 0;
    } else {
      return null;
    }
  }

  getPrevTabIndex(cycle: boolean = false, fromIndex: number|null = null): number|null {
    if (!this.tabCount) {
      return null;
    }

    if (fromIndex == null) {
      fromIndex = this.activeIndex;
    }

    if (fromIndex > 0 && fromIndex - 1 < this.tabCount) {
      return fromIndex - 1;
    } else if (fromIndex >= this.tabCount) {
      return this.tabCount - 1;
    } else if (cycle) {
      return this.tabCount -1;
    } else {
      return null;
    }
  }

  isTabEnabled(index: number): boolean {
    let d = this.getTabData(index);
    if (!d) {
      return false;
    }
    return !d.label.matches(':disabled');
  }

  exportState(): StoredState {
    return {
      activeIndex: this.activeIndex
    };
  }

  saveState(): void {
    if (!this.id || !this.options.stateStorageKey) {
      return;
    }

    let storedState: StoredStateMap = { };
    try {
      storedState = JSON.parse(localStorage.getItem(this.options.stateStorageKey) || '{ }');
    } catch (err) { }

    storedState[this.id] = this.exportState();
    localStorage.setItem(this.options.stateStorageKey, JSON.stringify(storedState));
  }

  restoreState(): void {
    if (!this.id || !this.options.stateStorageKey) {
      return;
    }

    let storedState: StoredStateMap = { };
    try {
      storedState = JSON.parse(localStorage.getItem(this.options.stateStorageKey) || '{ }');
    } catch (err) { }

    if (storedState[this.id]) {
      let state = storedState[this.id];
      if (typeof state.activeIndex === 'number') {
        this.activateTab(state.activeIndex);
      }
    }
  }

  activateByHash(hash: string): boolean {
    let index = this.getHashIndex(hash);
    if (index !== this.activeIndex) {
      return index >= 0 ? this.activateTab(index) : false;
    } else {
      return true;
    }
  }

  /** Protected area **/

  protected _data: TabData[] = [];
  protected _activeIndex: number = -1;
  protected _id: string|null = null;
  protected _autoSaveState: boolean = false;
  protected _hashNavigate: boolean = false;

  protected _sendEvent(index: number, oldIndex: number, eName: string): void {
    let d = this.getTabData(index);
    if (d) {
      let e = new CustomEvent(eName, {
        bubbles: true,
        cancelable: false,
        detail: {
          oldActiveIndex: oldIndex,
          newActiveIndex: this._activeIndex,
          currentIndex: index,
          newStateIsActive: index === this._activeIndex
        }
      });

      d.label.dispatchEvent(e);
      d.tab.dispatchEvent(e);
    }
  }

  protected _collectTabs(): void {
    if (!this.options.labelSelector || !this.options.tabSelector) {
      console.error('Tabs plugin: no labelSelector or tabSelector specified in the options');
      return;
    }

    let labels = this.root.querySelectorAll(this.options.labelSelector);
    let tabs = this.root.querySelectorAll(this.options.tabSelector);
    if (labels.length !== tabs.length) {
      console.warn('Tabs plugin: label count does not match tab count');
    }

    let defActiveIndex = -1;
    for (let q = 0; q < Math.min(labels.length, tabs.length); ++q) {
      let label = labels[q] as Element,
          tab = tabs[q] as Element;

      if (this.options.activeLabelClass && label.classList.contains(this.options.activeLabelClass)) {
        defActiveIndex = q;
      } else if (this.options.activeTabClass && tab.classList.contains(this.options.activeTabClass)) {
        defActiveIndex = q;
      }

      let labelId = label.getAttribute('id'),
          tabId = tab.getAttribute('id');
      let hash = tabId || labelId || '';

      this._data.push({ label, tab, hash });
    }

    if (this.options.defaultActiveIndexAttr && this.root.hasAttribute(this.options.defaultActiveIndexAttr)) {
      let index = +(this.root.getAttribute(this.options.defaultActiveIndexAttr) + '');
      if (!isNaN(index)) {
        defActiveIndex = index;
      }
    }

    if (defActiveIndex < 0 && this._data.length > 0) {
      defActiveIndex = 0;
    }

    if (defActiveIndex >= 0) {
      this.activateTab(defActiveIndex);
    }
  }

  protected _onClick(e: Event): void {
    if (e.target && this.options.labelSelector) {
      let closestLabel = closest(e.target as Element, this.options.labelSelector);
      if (closestLabel) {
        let index = this.getLabelIndex(closestLabel);
        if (index >= 0 && this.isTabEnabled(index)) {
          this.activateTab(index);
          e.preventDefault();
        }
      }
    }
  }

  protected _onHashChange(e: Event): void {
    let hash = location.hash.slice(1);
    if (hash && this._hashNavigate) {
      this.activateByHash(hash);
    }
  }
}

export const TabsFactory = new base.ComponentFactory<Tabs, TabsOptions>('tabs', DefaultOptions, Tabs);