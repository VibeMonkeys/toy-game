const LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const LEVEL_NAMES = Object.keys(LEVELS);

export class Logger {
    static level = LEVELS.info;

    static setLevel(newLevel) {
        if (typeof newLevel === 'string') {
            const key = newLevel.toLowerCase();
            if (LEVELS.hasOwnProperty(key)) {
                this.level = LEVELS[key];
            }
            return;
        }

        if (typeof newLevel === 'number') {
            const clamped = Math.max(LEVELS.error, Math.min(LEVELS.debug, newLevel));
            this.level = clamped;
        }
    }

    static enableDebug(enabled) {
        this.setLevel(enabled ? LEVELS.debug : LEVELS.info);
    }

    static error(...args) {
        this.#log(LEVELS.error, console.error, args);
    }

    static warn(...args) {
        this.#log(LEVELS.warn, console.warn, args);
    }

    static info(...args) {
        this.#log(LEVELS.info, console.info ? console.info : console.log, args);
    }

    static debug(...args) {
        this.#log(LEVELS.debug, console.debug ? console.debug : console.log, args);
    }

    static getLevelName() {
        return LEVEL_NAMES.find(name => LEVELS[name] === this.level) || 'info';
    }

    static #log(level, method, args) {
        if (level > this.level) return;
        method.call(console, ...args);
    }
}

Logger.LEVELS = LEVELS;
