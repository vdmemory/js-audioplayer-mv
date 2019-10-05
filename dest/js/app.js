import PlayerView from './PlayerView.js';

// alias for querySelector
Element.prototype.$ = Element.prototype.querySelector;
DocumentFragment.prototype.$ = DocumentFragment.prototype.querySelector;

// alias for addEventListener
Element.prototype.on = Element.prototype.addEventListener;
DocumentFragment.prototype.on = DocumentFragment.prototype.addEventListener;

document.body.appendChild(new PlayerView().render());