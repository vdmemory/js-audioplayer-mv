export default class EventsBase {
    #listeners = {};
    on(event, fn){
        if (!this.#listeners[event]) {
            this.#listeners[event] = [];
        }
        this.#listeners[event].push(fn);
    }
    trigger(event){
        this.#listeners[event].forEach(fn => fn());
        return this;
    }
}