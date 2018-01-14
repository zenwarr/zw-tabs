import {expect} from 'chai';
import {DefaultOptions, Tabs, TabsChangeStateEvent, TabsFactory} from "./index";

describe("Tabs", function () {
  function init(html: string): void {
    document.body.innerHTML = html;
  }

  function elem(id: string): Element {
    return document.getElementById(id) as Element;
  }

  function sendEvent(id: string, eventType: string): void {
    elem(id).dispatchEvent(new Event(eventType, { bubbles: true }));
  }

  function hasClass(id: string, className: string): boolean {
    return elem(id).classList.contains(className);
  }

  function setLocalStorageMock() {
    (global as any).localStorage = {
      getItem(name: string): void {
        return localStorage[name];
      },

      setItem(name: string, value: any): void {
        localStorage[name] = value;
      }
    };
  }

  it('should create tabs', function () {
    init(`<div class="js-tabs" id="tabs"></div>`);

    let tabs = TabsFactory.createComp(Tabs, elem('tabs'));
    expect(tabs).to.not.be.null;
    expect(tabs.root).to.be.equal(elem('tabs'));
    expect(TabsFactory.fromRoot(elem('tabs'))).to.be.equal(tabs);
    expect(tabs.tabCount).to.be.equal(0);
    expect(tabs.autoSaveState).to.be.false;
  });

  describe("group1", function () {
    let tabs: Tabs;

    beforeEach(function() {
      setLocalStorageMock();

      init(`<div class="js-tabs" id="tabs">
        <div class="js-tabs__label" id="label1"></div>
        <div class="js-tabs__label" id="label2"></div>
        <div class="js-tabs__label" id="label3"></div>
        
        <div class="js-tabs__tab" id="tab1"></div>
        <div class="js-tabs__tab" id="tab2"></div>
        <div class="js-tabs__tab" id="tab3"></div>
      </div>`);

      tabs = TabsFactory.createComp(Tabs, elem('tabs'));
    });

    it('should collect tabs', function () {
      expect(tabs.tabCount).to.be.equal(3);
      expect(tabs.activeIndex).to.be.equal(0);
    });

    it('should set default classes', function () {
      expect(hasClass('label1', 'js-tabs__label--active')).to.be.true;
      expect(hasClass('label2', 'js-tabs__label--active')).to.be.false;
      expect(hasClass('tab1', 'js-tabs__tab--active')).to.be.true;
      expect(hasClass('tab2', 'js-tabs__tab--active')).to.be.false;
    });

    it('should react on label click', function () {
      sendEvent('label2', 'click');
      expect(hasClass('label1', 'js-tabs__label--active')).to.be.false;
      expect(hasClass('label2', 'js-tabs__label--active')).to.be.true;
      expect(hasClass('tab1', 'js-tabs__tab--active')).to.be.false;
      expect(hasClass('tab2', 'js-tabs__tab--active')).to.be.true;
    });

    it('activateTab', function () {
      expect(tabs.activateTab(1)).to.be.true;
      expect(tabs.activeIndex).to.be.equal(1);
      expect(tabs.activateTab(3)).to.be.false;
      expect(tabs.activeIndex).to.be.equal(1);
      expect(tabs.activateTab(-1)).to.be.true;
      expect(tabs.activeIndex).to.be.equal(-1);
      expect(tabs.activateTab(10)).to.be.false;
      expect(tabs.activeIndex).to.be.equal(-1);
    });

    it('should fire events', function () {
      let fired1 = false, fired2 = false;
      elem('tabs').addEventListener('before-tabs-change-state', (e: TabsChangeStateEvent) => {
        expect(e.detail.oldActiveIndex).to.be.equal(0);
        expect(e.detail.newActiveIndex).to.be.equal(1);
        fired1 = true;
      });
      elem('tabs').addEventListener('after-tabs-change-state', (e: TabsChangeStateEvent) => {
        expect(e.detail.oldActiveIndex).to.be.equal(0);
        expect(e.detail.newActiveIndex).to.be.equal(1);
        fired2 = true;
      });
      tabs.activateTab(1);
      expect(fired1).to.be.true;
      expect(fired2).to.be.true;
    });

    it('should cancel tab switching', function () {
      elem('tabs').addEventListener('before-tabs-change-state', (e: Event) => {
        e.preventDefault();
      });
      expect(tabs.activeIndex).to.be.equal(0);
      expect(tabs.activateTab(2)).to.be.false;
      expect(tabs.activeIndex).to.be.equal(0);
    });

    it('should get indexes', function () {
      expect(tabs.getTabIndex(elem('tab2'))).to.be.equal(1);
      expect(tabs.getLabelIndex(elem('label3'))).to.be.equal(2);
      expect(tabs.getTabIndex(elem('label2'))).to.be.equal(-1);
      expect(tabs.getLabelIndex(elem('tab2'))).to.be.equal(-1);
    });

    it('should calculate next tab index', function () {
      let data: [boolean, number, number|null][] = [
          [ false, -1, 0 ],
          [ false, -10, 0 ],
          [ false, 0, 1 ],
          [ false, 1, 2 ],
          [ false, 2, null ],
          [ false, 10, null ],
          [ true, -1, 0 ],
          [ true, 0, 1 ],
          [ true, 2, 0 ],
          [ true, 10, 0 ]
      ];

      for (let q = 0; q < data.length; ++q) {
        expect(tabs.getNextTabIndex(data[q][0], data[q][1])).to.be.equal(data[q][2]);
      }
    });

    it('should calculate prev tab index', function () {
      let data: [boolean, number, number|null][] = [
          [ false, -1, null ],
          [ false, -10, null ],
          [ false, 0, null ],
          [ false, 1, 0 ],
          [ false, 2, 1 ],
          [ false, 3, 2 ],
          [ false, 4, 2 ],
          [ false, 10, 2 ],
          [ true, -1, 2 ],
          [ true, -10, 2 ],
          [ true, 0, 2 ],
          [ true, 1, 0 ],
          [ true, 10, 2 ],
          [ true, 2, 1 ],
          [ true, 3, 2 ]
      ];

      for (let q = 0; q < data.length; ++q) {
        expect(tabs.getPrevTabIndex(data[q][0], data[q][1])).to.be.equal(data[q][2]);
      }
    });

    it('should save state', function () {
      expect(tabs.exportState()).to.be.deep.equal({
        activeIndex: 0
      });

      tabs.saveState();
      expect(JSON.parse(localStorage.getItem('' + DefaultOptions.stateStorageKey) || '')).to.be.deep.equal({
        tabs: {
          activeIndex: 0
        }
      });

      tabs.activateTab(1);
      expect(tabs.activeIndex).to.be.equal(1);

      tabs.restoreState();
      expect(tabs.activeIndex).to.be.equal(0);
    });
  });

  it('should set default tab by attribute', function () {
    init(`<div class="js-tabs" id="tabs" data-tabs-active-index="1">
      <div class="js-tabs__label" id="label1"></div>
      <div class="js-tabs__label" id="label2"></div>
      <div class="js-tabs__label" id="label3"></div>
      
      <div class="js-tabs__tab" id="tab1"></div>
      <div class="js-tabs__tab" id="tab2"></div>
      <div class="js-tabs__tab" id="tab3"></div>
    </div>`);

    let tabs = TabsFactory.createComp(Tabs, elem('tabs'));

    expect(tabs.activeIndex).to.be.equal(1);
  });

  it('should set default tab from label class', function () {
    init(`<div class="js-tabs" id="tabs">
      <div class="js-tabs__label" id="label1"></div>
      <div class="js-tabs__label js-tabs__label--active" id="label2"></div>
      <div class="js-tabs__label" id="label3"></div>
      
      <div class="js-tabs__tab" id="tab1"></div>
      <div class="js-tabs__tab" id="tab2"></div>
      <div class="js-tabs__tab" id="tab3"></div>
    </div>`);

    let tabs = TabsFactory.createComp(Tabs, elem('tabs'));

    expect(tabs.activeIndex).to.be.equal(1);
  });

  it('should set default tab from tab class', function () {
    init(`<div class="js-tabs" id="tabs">
      <div class="js-tabs__label" id="label1"></div>
      <div class="js-tabs__label" id="label2"></div>
      <div class="js-tabs__label" id="label3"></div>
      
      <div class="js-tabs__tab" id="tab1"></div>
      <div class="js-tabs__tab js-tabs__tab--active" id="tab2"></div>
      <div class="js-tabs__tab" id="tab3"></div>
    </div>`);

    let tabs = TabsFactory.createComp(Tabs, elem('tabs'));

    expect(tabs.activeIndex).to.be.equal(1);
  });

  it('should not react on click on disabled elements', function () {
    init(`<div class="js-tabs" id="tabs">
      <button class="js-tabs__label" id="label1"></button>
      <button class="js-tabs__label" id="label2" disabled></button>
      <button class="js-tabs__label" id="label3"></button>
      
      <div class="js-tabs__tab" id="tab1"></div>
      <div class="js-tabs__tab" id="tab2"></div>
      <div class="js-tabs__tab" id="tab3"></div>
    </div>`);

    let tabs = TabsFactory.createComp(Tabs, elem('tabs'));

    sendEvent('label2', 'click');
    expect(tabs.activeIndex).to.be.equal(0);

    tabs.activateTab(1);
    expect(tabs.activeIndex).to.be.equal(1);
  });

  it('should auto save state', function () {
    setLocalStorageMock();

    init(`<div class="js-tabs" id="tabs" data-tabs-auto-save-state>
        <div class="js-tabs__label" id="label1"></div>
        <div class="js-tabs__label" id="label2"></div>
        <div class="js-tabs__label" id="label3"></div>
        
        <div class="js-tabs__tab" id="tab1"></div>
        <div class="js-tabs__tab" id="tab2"></div>
        <div class="js-tabs__tab" id="tab3"></div>
      </div>`);

    let tabs = TabsFactory.createComp(Tabs, elem('tabs'));
    expect(tabs.autoSaveState).to.be.true;

    tabs.activateTab(2);
    expect(JSON.parse(localStorage.getItem(DefaultOptions.stateStorageKey + '') || '{ }')).to.be.deep.equal({
      tabs: {
        activeIndex: 2
      }
    });
  });

  it('should navigate by hash', function (done) {
    init(`<div class="js-tabs" id="tabs">
      <div class="js-tabs__label" id="label1"></div>
      <div class="js-tabs__label" id="label2"></div>
      <div class="js-tabs__label" id="label3"></div>
      
      <div class="js-tabs__tab" id="tab1"></div>
      <div class="js-tabs__tab" id="tab2"></div>
      <div class="js-tabs__tab" id="tab3"></div>
    </div>`);

    let tabs = TabsFactory.createComp(Tabs, elem('tabs'), {
      defaultHashNavigate: true
    });
    expect(tabs.hashNavigate).to.be.true;

    location.hash = '#tab2';
    setTimeout(() => {
      expect(tabs.activeIndex).to.be.equal(1);

      tabs.activateTab(2);
      expect(location.hash).to.be.equal('#tab3');

      expect(tabs.activateTab(-1)).to.be.true;
      expect(tabs.activeIndex).to.be.equal(-1);
      expect(location.hash).to.be.equal('');

      done();
    }, 0);
  });

  it('should handle nested tabs', function () {
    init(`<div class="js-tabs" id="tabs">
      <button class="js-tabs__label"></button>
      <button class="js-tabs__label"></button>
      <button class="js-tabs__label"></button>
      
      <div class="js-tabs__tab"></div>
      <div class="js-tabs__tab"></div>
      <div class="js-tabs__tab">
        <div class="js-tabs" id="tabs-nested">
          <button class="js-tabs__label"></button>
          <button class="js-tabs__label"></button>
          
          <div class="js-tabs__tab"></div>
          <div class="js-tabs__tab"></div>
        </div>      
      </div>
    </div>`);

    TabsFactory.init();
    let tabs = TabsFactory.fromRoot(elem('tabs')) as Tabs;
    let tabsNested = TabsFactory.fromRoot(elem('tabs-nested')) as Tabs;

    expect(tabs.tabCount).to.be.equal(3);
    expect(tabsNested.tabCount).to.be.equal(2);
  });
});
