import EventsBase from './EventsBase.js';
import { EVENT_FETCH } from './constants.js';

export default class PlaylistModel extends EventsBase {
    #fetchUrl = '/data/playlist.json'
    #playlist = [];
    static instance = null;
    constructor() {
        super();
        if (this.constructor.instance) {
            return this.constructor.instance;
        }
        this.constructor.instance = this;
        this.fetch();
    }
    fetch() {
        fetch(this.#fetchUrl)
            .then(response => response.json())
            .then(response => {
                this.#playlist = response.playlist;
                this.trigger(EVENT_FETCH);
            });
    }
    get data() {
        return this.#playlist.slice();
    }
}