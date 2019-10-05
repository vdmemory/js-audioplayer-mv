import PlaylistModel from './PlaylistModel.js';
import TrackView from './TrackView.js';
import PlayerModel from './PlayerModel.js';
import {
    CLASS_CONTROL_ACTIVE,
    EVENT_FETCH,
    EVENT_CHANGE_IS_PLAYING,
    EVENT_CHANGE_CURRENT_TRACK,
    EVENT_CHANGE_IS_MUTED,
    EVENT_CHANGE_IS_REPEAT,
    PLACEHOLDER_IMAGE
 } from './constants.js';

export default class PlayerView {
    static template = document.querySelector('#tplPlayer').content;
    static formatFileUrl(fileName) {
        return `data/track/${fileName}`;
    }
    #model = null;
    #state = null;
    #root = null;
    #progressTimer = null;
    constructor() {
        this.#model = new PlaylistModel();
        this.#state = new PlayerModel({ playlist: this.#model });
        this.#model.on(EVENT_FETCH, this.renderList.bind(this));
        this.#root = PlayerView.template.cloneNode(true).$('._player');
        this.eventsAssign();
    }
    eventsAssign() {
        this.#root.$('._actionPlayPause').on('click', this.#state.play.bind(this.#state));
        this.#root.$('._actionPrev').on('click', this.#state.prev.bind(this.#state));
        this.#root.$('._actionNext').on('click', this.#state.next.bind(this.#state));
        this.#root.$('._actionMute').on('click', this.#state.mute.bind(this.#state));
        this.#root.$('._actionRandom').on('click', this.#state.random.bind(this.#state));
        this.#root.$('._actionRepeat').on('click', this.#state.repeat.bind(this.#state));

        this.#root.$('._audio').on('ended', this.#state.next.bind(this.#state));

        this.#state.on(EVENT_CHANGE_IS_PLAYING, this.onChangeIsPlaying.bind(this));
        this.#state.on(EVENT_CHANGE_CURRENT_TRACK, () => { this.onChangeCurrentTrack() });
        this.#state.on(EVENT_CHANGE_IS_MUTED, this.onChangeIsMuted.bind(this));
        this.#state.on(EVENT_CHANGE_IS_REPEAT, this.onChangeIsRepeat.bind(this));
    }
    render() {
        return this.#root;
    }
    renderList() {
        this.#model.data.forEach((item, i) => {
            const track = new TrackView({
                data: {id: i, ...item},
                state: this.#state
            });
            this.#root.$('._playlist').appendChild(track.render());
        });
    }
    renderInfo() {
        const currentTrack = this.#model.data[this.#state.state.currentTrack];
        const currentTrackImage = (currentTrack.image == null) ? PLACEHOLDER_IMAGE : currentTrack.image;

        this.#root.$('._trackImage').src = `data/img/${currentTrackImage}`;
        this.#root.$('._trackName').innerText = currentTrack.track;
        this.#root.$('._trackAuthor').innerText = currentTrack.author;
    }
    onChangeCurrentTrack() {
        this.#root.$('._audio').on('canplay', this.#root.$('._audio').play, false);
        this.#root.$('._audio').src = PlayerView.formatFileUrl(this.#model.data[this.#state.state.currentTrack].file);
        this.renderInfo();
    }
    onChangeIsPlaying() {
        this.#progressTimer = setInterval(() => {
            const w = Math.round(this.#root.$('._audio').currentTime / this.#root.$('._audio').duration * 10000) / 100;
            this.#root.$('._progress').style.width = `${w}%`;
        }, 10);
        this.#root.$('._actionPlayPause').classList.toggle(CLASS_CONTROL_ACTIVE, this.#state.state.isPlaying);
        if (this.#state.state.isPlaying && this.#root.$('._audio').readyState == 4) {
            this.#root.$('._audio').play();
            return;
        }
        this.#root.$('._audio').pause();
    }
    onChangeIsMuted() {
        this.#root.$('._audio').muted = this.#state.state.isMuted;
        this.#root.$('._actionMute').classList.toggle(CLASS_CONTROL_ACTIVE, this.#state.state.isMuted);
    }
    onChangeIsRepeat() {
        this.#root.$('._audio').loop = this.#state.state.isRepeat;
        this.#root.$('._actionRepeat').classList.toggle(CLASS_CONTROL_ACTIVE, this.#state.state.isRepeat);
    }
}