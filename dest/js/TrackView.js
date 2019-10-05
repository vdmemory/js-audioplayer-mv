import {
    CLASS_TRACK_ACTIVE,
    CLASS_TRACK_PLAYING
} from './constants.js';

export default class TrackView {
    static template = document.querySelector('#tplTrack').content;
    static formatTime(milisecs) {
        return new Date(+milisecs).toISOString().substr(14, 5);
    }
    #root = null;
    #data = null;
    #state = null;
    constructor(props) {
        this.#root = TrackView.template.cloneNode(true).$('._track');
        this.#data = props.data;
        this.#state = props.state;
        this.#root.on('click', () => {
            this.#state.playTrack(this.#data.id);
        })
        this.#state.on('change:isPlaying', () => {
            this.#root.classList.toggle(CLASS_TRACK_PLAYING, this.#state.state.isPlaying);
        })
        this.#state.on('change:currentTrack', () => {
            this.#root.classList.toggle(CLASS_TRACK_ACTIVE, this.#state.state.currentTrack == this.#data.id);
        })
    }
    render() {
        this.#root.$('._name').innerText = this.fullName;
        this.#root.$('._duration').innerText = TrackView.formatTime(this.#data.duration);
        return this.#root;
    }
    get fullName() {
        return `${this.#data.track} - ${this.#data.author}`;
    }
}