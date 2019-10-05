import EventsBase from './EventsBase.js';
import {
    EVENT_FETCH,
    EVENT_CHANGE_IS_PLAYING,
    EVENT_CHANGE_CURRENT_TRACK,
    EVENT_CHANGE_IS_MUTED,
    EVENT_CHANGE_IS_REPEAT
 } from './constants.js';

export default class PlayerModel extends EventsBase {
    #playlist = null;
    state = {
        isPlaying: false,
        isMuted: false,
        isRepeat: false,
        isRandom: false,
        currentTrack: null,
        trackCount: null,
    };
    constructor(props) {
        super();
        this.#playlist = props.playlist;
        this.#playlist.on(EVENT_FETCH, this.onPlaylistFetch.bind(this));
    }
    onPlaylistFetch() {
        this.state.trackCount = this.#playlist.data.length;
    }
    play() {
        if (this.state.currentTrack == null) {
            this.state.currentTrack = 0;
            this.state.isPlaying = true;
            this.trigger(EVENT_CHANGE_IS_PLAYING)
                .trigger(EVENT_CHANGE_CURRENT_TRACK);
            return;
        }
        if (this.state.isPlaying) {
            this.state.isPlaying = false;
            this.trigger(EVENT_CHANGE_IS_PLAYING);
            return;
        }
        this.state.isPlaying = true;
        this.trigger(EVENT_CHANGE_IS_PLAYING);
    }
    playTrack(id) {
        this.state.currentTrack = id;
        this.state.isPlaying = true;
        this.trigger(EVENT_CHANGE_IS_PLAYING)
            .trigger(EVENT_CHANGE_CURRENT_TRACK);
    }
    next() {
        this.state.currentTrack =
            (this.state.trackCount - 1 == this.state.currentTrack)
                ? 0
                : this.state.currentTrack + 1;
        this.state.isPlaying = true;
        this.trigger(EVENT_CHANGE_IS_PLAYING)
            .trigger(EVENT_CHANGE_CURRENT_TRACK);
    }
    prev() {
        this.state.currentTrack =
            (this.state.currentTrack == 0)
                ? this.state.trackCount - 1
                : this.state.currentTrack - 1;
        this.state.isPlaying = true;
        this.trigger(EVENT_CHANGE_IS_PLAYING)
            .trigger(EVENT_CHANGE_CURRENT_TRACK);
    }
    mute() {
        this.state.isMuted = !this.state.isMuted;
        this.trigger(EVENT_CHANGE_IS_MUTED);
    }
    random() {
        
    }
    repeat() {
        this.state.isRepeat = !this.state.isRepeat;
        this.trigger(EVENT_CHANGE_IS_REPEAT);
    }
}