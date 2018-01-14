# What is it?

A small library that implements lightweight tabs with vanilla JS.
It can be configured with data attributes on DOM elements.
You can have multiple tab groups on the same page.
Tabs can save its state and restore it back (even automatically).
Tabs can be navigated by hash part of the page location.
Tab component can be used as a "wizard": it provides convenient function for activating prev/next tab.

# Installation

```
npm i --save @zcomp/tabs
```

# Usage

```javascript
const tabs = require('@zcomp/tabs');
tabs.TabFactory.init();
```

First argument to `init` method is options object.

A very simple tabs markup:

```html
<div class="js-tabs">
  <div class="js-tabs__labels">
    <button class="js-tabs__label">First tab</button>
    <button class="js-tabs__label">Second tab</button>
    <button class="js-tabs__label">Third tab</button>
  </div>

  <div class="js-tabs__tab">
    First tab content
  </div>
  <div class="js-tabs__tab">
    Second tab content
  </div>
  <div class="js-tabs__tab">
    Third tab content
  </div>
</div>
```

Here each `.js-tabs__label` button activates corresponding `.js-tabs__tab` element.
First label activates the first tab, the second label activates the second tab, and so on in order or appearance in DOM.
Activation means that a `js-tabs__tab--active` class is added to activated tab (and `js-tabs__label--active` to corresponding label).
`.js-tabs__labels` element is optional, but it is convenient to have it in many cases.

Even `.js-tabs__labels` elements are optional, you should manually activate tabs with `activateTab` method in this case.

The library does not actually hides elements, it only adds classes.
You should manually set styles for active and inactive tabs to hide it.
For example:

```css
.js-tabs__tab--inactive {
  display: none;
}
```

After a tabs component has been initialized, `js-tabs--inited` class is added to the root element of a component.
You can use it to show all tabs until JS is loaded and executed (or hide all tabs).

## Default active tab

When tabs component is initialized, some tab can be activated by default.
In most cases, it is the first tab.
But you can manually set the index for default active tab by adding `data-tabs-active-index` to the root element:

```html
<div class="js-tabs" data-tabs-active-index="1">
  <div class="js-tabs__tab">
    This tab will be hidden initially
  </div>
  <div class="js-tabs__tab">
    This tab will be activated by default!
  </div>
</div>
```

Or you can manually add `--active` classes to the tab (or the corresponding label) you want to activate.
For example:

```html
<div class="js-tabs">
  <div class="js-tabs__tab">
    This tab will be hidden initially
  </div>
  <div class="js-tabs__tab js-tabs__tab--active">
    This tab will be activated by default!
  </div>
</div>
```

Only one tab (or one label) should have `--active` class.
`data-tabs-active-index` has priority over `--active` classes.

## Saving state

You can save state of a tabs component to local storage.
It will only work if root element has `id` attribute.
In this case a component is identified by the value of this attribute.
Call `saveState` method to save state:

```html
<div class="js-tabs" id="cool_tabs">
  <div class="js-tabs__tab"></div>
  <div class="js-tabs__tab"></div>
  <div class="js-tabs__tab"></div>
</div>
```

```js
let tabs_comp = TabsFactory.fromRoot(document.getElementById('cool_tabs'));
tabs_comp.saveState();
```

Call `restoreState` to restore state back:

```js
tabs_comp.restoreState();
```

If there are no record about a component with same `id` in local storage, current tabs state will remain untouched.
If root element has `data-tabs-auto-save-state` attribute, state of the component will be automatically restored when creating the component, and saved whenever active tab changes.
You can set `defaultAutoSaveState` option to `true` if you want all tabs by default have this behaviour.

## Navigating by hash

To navigate to a tab by its hash, the tab should have `id` attribute.
Root element of a component should have `data-tabs-hash-navigate` for it to work.
For example:

```html
<div class="js-tabs" data-tabs-hash-navigate>
  <div class="js-tabs__tab" id="first_tab"></div>
  <div class="js-tabs__tab" id="second_tab"></div>
</div>

<div class="js-tabs" data-tabs-hash-navigate>
  <div class="js-tabs__tab" id="third_tab"></div>
</div>

<div class="js-tabs">
  <div class="js-tabs__tab" id="fourth_tab"></div>
</div>
```

If `location.hash` is equal to `#second_tab`, the second tab in the first component will be activated.
Same is true if `location.hash` is equal to `#third_tab`.
But if `location.hash` is equal to `#fourth_tab`, no tab will be activated, because its root element has no `data-tabs-hash-navigate` attribute.
Additionally, a hash-navigatable component will automatically change `location.hash` when some of its tabs are activated.

It can be confusing for a user to have two or more hash-navigatable tabs components on a same page (although this library allows it).
But if you want all tabs to be hash-navigatable by default, set `defaultHashNavigate` option to `true`.

## Events

Each tabs component fires custom events when its state changes.
All these events bubble.
`before-tabs-change-state` is fired on root element of the component.
It can be cancelled (by calling `preventDefault`) by a handler.
In this case, tab will not be switched.
`after-tabs-change-state` is fired on root element *after* state has been changed.

One `tab-change-state` is fired on tab element, and another event with same name is fired on corresponding label element *after* a tab has been activated or deactivated.

## Options

This library is highly configurable, and you can change almost everything.
Options are given as argument to `TabsFactory.init` method (or any `@zcomp/base` methods that create components, refer to `@zcomp/base` docs).
Option list below:

| Option name                   | Meaning                                                | Default value                |
|-------------------------------|--------------------------------------------------------|------------------------------|
| rootSelector                  | Selector for root element of a component               | '.js-tabs'                   |
| tabsInitedClass               | Class to add to root element of initialized component  | 'js-tabs--inited'            |
| tabSelector                   | Selector for tab elements                              | '.js-tabs__tab'              |
| labelSelector                 | Selector for label elements                            | '.js-tabs__label'            |
| tabActiveClass                | Class to add to active tabs                            | 'js-tabs__tab--active'       |
| labelActiveClass              | Class to add to active labels                          | 'js-tabs__label--active'     |
| tabInactiveClass              | Class to add to inactive tabs                          | 'js-tabs__tab--inactive'     |
| labelInactiveClass            | Class to add to inactive labels                        | 'js-tabs__label--inactive'   |
| beforeTabsChangeStateEvent    | Name of event fired before tabs change state           | 'before-tabs-change-state'   |
| afterTabsChangeStateEvent     | Name of event fired after tabs change state            | 'after-tabs-change-state'    |
| tabChangeStateEvent           | Name of event fired after tab of label change state    | 'tab-change-state'           |
| defaultActiveIndexAttr        | Attribute for default index                            | 'data-tabs-active-index'     |
| stateStorageKey               | Name of localStorage key used for storing state        | 'zcomp_tabs_state'           |
| autoSaveStateAttr             | Attribute for marking autosaving state components      | 'data-tabs-auto-save-state'  |
| defaultAutoSaveState          | Should components autosave state by default            | false                        |
| hashNavigateAttr              | Attribute for marking hash-navigatable components      | 'data-tabs-hash-navigate'    |
| defaultHashNavigate           | Should components be hash-navigatable by default       | false                        |

## Methods and properties

Refer to generated documentation on information about methods and properties of `Tabs` objects.

# Building documentation

Install typedoc:

```
npm i -g typedoc
typedoc index.ts --out ./docs
```

Now open `docs/index.html` file.
