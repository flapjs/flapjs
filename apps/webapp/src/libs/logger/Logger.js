/* eslint-disable no-console */
/* global __NODE_ENV__ */

/**
 * @typedef {5} TRACE
 * @typedef {4} DEBUG
 * @typedef {3} INFO
 * @typedef {2} WARN
 * @typedef {1} ERROR
 * @typedef {0} OFF
 */

// Log levels
const TRACE = 5;
const DEBUG = 4;
const INFO = 3;
const WARN = 2;
const ERROR = 1;
const OFF = 0;

// Current log configs
let DEFAULT_LEVEL = TRACE;
let DEFAULT_DOMAIN = 'app';

const LOG_LEVEL_STYLES = {
    [TRACE]: styledLogLevel('#7F8C8D'), // Gray
    [DEBUG]: styledLogLevel('#2ECC71'), // Green
    [INFO]: styledLogLevel('#4794C8'), // Blue
    [WARN]: styledLogLevel('#F39C12'), // Yellow
    [ERROR]: styledLogLevel('#C0392B'), // Red
    [OFF]: [''],
};

function compareLogLevel(a, b) {
    return a - b;
}

function styledLogLevel(color) {
    return [
        `background: ${color}`,
        'border-radius: 0.5em',
        'color: white',
        'font-weight: bold',
        'padding: 2px 0.5em',
    ];
}

// Useful functions
function noop() { /** Do nothing. */ }

function getStyledMessage(message, styles) {
    return [
        `%c${message}`,
        styles.join(';'),
    ];
}

function getConsoleFunction(level) {
    switch (level) {
        case TRACE:
            return console.trace;
        case DEBUG:
            return console.log;
        case INFO:
            return console.log;
        case WARN:
            return console.warn;
        case ERROR:
            return console.error;
        case OFF:
            return noop;
        default:
            return console.log;
    }
}

function prependMessageTags(out, name, domain, level) {
    if (name) {
        out.unshift(`[${name}]`);
    }

    if (domain) {
        let tag = getStyledMessage(domain, LOG_LEVEL_STYLES[level]);
        out.unshift(tag[0], tag[1]);
    }

    return out;
}

const LEVEL = Symbol('level');
const DOMAIN = Symbol('domain');
const LOGGERS = { /** To be populated by logger instances. */ };

export class Logger {
    /** @returns {TRACE} */
    static get TRACE() { return TRACE; }
    /** @returns {DEBUG} */
    static get DEBUG() { return DEBUG; }
    /** @returns {INFO} */
    static get INFO() { return INFO; }
    /** @returns {WARN} */
    static get WARN() { return WARN; }
    /** @returns {ERROR} */
    static get ERROR() { return ERROR; }
    /** @returns {OFF} */
    static get OFF() { return OFF; }

    /**
     * Create or get the logger for the given unique name.
     * 
     * @param {string} name 
     * @returns {Logger} The logger with the given name.
     */
    static getLogger(name) {
        if (name in LOGGERS) {
            return LOGGERS[name];
        }
        else {
            return LOGGERS[name] = new Logger(name);
        }
    }

    /**
     * @param {string} domain 
     * @returns {typeof Logger}
     */
    static setDomain(domain) {
        this[DOMAIN] = domain;
        return this;
    }

    /**
     * @returns {string}
     */
    static getDomain() {
        if (DOMAIN in this) {
            return this[DOMAIN];
        } else {
            return DEFAULT_DOMAIN;
        }
    }

    /**
     * @param {TRACE|DEBUG|INFO|WARN|ERROR|OFF} level 
     * @returns {typeof Logger}
     */
    static setLevel(level) {
        this[LEVEL] = level;
        return this;
    }

    /**
     * @param {TRACE|DEBUG|INFO|WARN|ERROR|OFF} level 
     * @returns {boolean}
     */
    static isAllowedLevel(level) {
        let target;
        if (LEVEL in this) {
            target = this[LEVEL];
        } else {
            target = DEFAULT_LEVEL;
        }
        return compareLogLevel(target, level) >= 0;
    }

    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @param {TRACE|DEBUG|INFO|WARN|ERROR|OFF} level 
     * @param  {...any} messages 
     * @returns {Logger}
     */
    log(level, ...messages) {
        if (!Logger.isAllowedLevel(level)) return this;
        prependMessageTags(messages, this.name, Logger.getDomain(), level);
        getConsoleFunction(level)(...messages);
        return this;
    }

    /**
     * @param  {...any} messages 
     * @returns {Logger}
     */
    trace(...messages) {
        if (!Logger.isAllowedLevel(TRACE)) return this;
        prependMessageTags(messages, this.name, Logger.getDomain(), TRACE);
        getConsoleFunction(TRACE)(...messages);
        return this;
    }

    /**
     * @param  {...any} messages 
     * @returns {Logger}
     */
    debug(...messages) {
        if (!Logger.isAllowedLevel(DEBUG)) return this;
        prependMessageTags(messages, this.name, Logger.getDomain(), DEBUG);
        getConsoleFunction(DEBUG)(...messages);
        return this;
    }

    /**
     * @param  {...any} messages 
     * @returns {Logger}
     */
    info(...messages) {
        if (!Logger.isAllowedLevel(INFO)) return this;
        prependMessageTags(messages, this.name, Logger.getDomain(), INFO);
        getConsoleFunction(INFO)(...messages);
        return this;
    }

    /**
     * @param  {...any} messages 
     * @returns {Logger}
     */
    warn(...messages) {
        if (!Logger.isAllowedLevel(WARN)) return this;
        prependMessageTags(messages, this.name, Logger.getDomain(), WARN);
        getConsoleFunction(WARN)(...messages);
        return this;
    }

    /**
     * @param  {...any} messages 
     * @returns {Logger}
     */
    error(...messages) {
        if (!Logger.isAllowedLevel(ERROR)) return this;
        prependMessageTags(messages, this.name, Logger.getDomain(), ERROR);
        getConsoleFunction(ERROR)(...messages);
        return this;
    }
}
