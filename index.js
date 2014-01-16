/**
 * Module dependencies.
 */

var _ = require('lodash')
	, util = require('util')
	, rc = require('rc')
	, wrap = require('./lib/wrap')
	, configure = require('./lib/configure')
	, captains = require('./lib/captains');



/**
 * Captains Log 
 *
 * @param {Object} overrides
 *           , {Object}  custom       : a custom logger to use, i.e. Winston
 *           , {Object}  logLevels    : optional - named log levels, defaults to npm conventions
 *           , {String}  level        : the current log level- e.g. silly, verbose, info, debug, warn, error, or silent
 *           , {Boolean} inspect      : defaults to true-- whether to make the log output more readable (combines all args into one string)
 */

module.exports = function CaptainsLog ( overrides ) {

	// Apply overrides to the default configuration
	var options = configure(overrides);

	// If no override was specified, we'll instantiate
	// our default logger, `captains`.
	logger = captains();

	// If a custom logger override was specified,
	// lets try to use it.
	if ( options.custom ) {
		logger = options.custom;
		
		// Make sure enough log methods exist to meet our requirements.
		//
		// We assume that at least something called
		// `logger.log` or `logger.debug` exists.
		if (!logger.log) {
			throw new Error(
				'Unsupported logger override!\n' +
				'(has no `.log()` or `.debug()` method.)'
			);
		}

		// Fill in the gaps for the required log methods with
		// reasonable guesses if the custom logger is missing any
		// (only required method is `logger.log` or `logger.debug`)
		logger.debug = logger.debug || logger.log;
		logger.info = logger.info || logger.log;
		logger.warn = logger.warn || logger.error || logger.log;
		logger.error = logger.error || logger.log;
		logger.crit = logger.crit || logger.error;
		logger.verbose = logger.verbose || logger.log;
		logger.silly = logger.silly || logger.log;
	}

	// Return enhanced (callable) version of logger
	return wrap(logger, options);

};
