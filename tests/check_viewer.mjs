import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const elements = [];
class Element {
  children = [];
  listeners = {};
  constructor(tag) {
    this.tag = tag;
    elements.push(this);
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  append(...children) {
    this.children.push(...children);
  }
  before(button) {
    this.trigger = button;
  }
  addEventListener(event, callback) {
    this.listeners[event] = callback;
  }
  showModal() {
    this.open = true;
  }
  close() {
    this.open = false;
  }
}
const screen = new Element("img");
screen.alt = "Мобильный экран";
screen.src = "https://example.test/assets/mobile.png";
const document = {
  createElement: (tag) => new Element(tag),
  body: new Element("body"),
  querySelectorAll: (selector) => (selector === "main img" ? [screen] : []),
};
runInNewContext(
  readFileSync(new URL("../viewer.js", import.meta.url), "utf8"),
  { document },
);
assert.equal(screen.trigger["aria-label"], "Открыть экран: " + screen.alt);
screen.trigger.onclick();
const dialog = elements.find((e) => e.tag === "dialog");
assert.equal(dialog.open, true);
assert.equal(dialog.children.at(-1).src, screen.src);
assert.equal(dialog.children[2].href, screen.src);
dialog.listeners.click({ target: dialog });
assert.equal(dialog.open, false);
screen.trigger.onclick();
dialog.children[0].onclick();
assert.equal(dialog.open, false);
console.log(
  "Full-size viewer: image, title, original link and close controls passed.",
);
