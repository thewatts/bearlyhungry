/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-inlinesvg-svg-svgclippaths-touch-shiv-mq-cssclasses-teststyles-prefixes-ie8compat-load
 */

;window.Modernizr=function(a,b,c){function y(a){j.cssText=a}function z(a,b){return y(m.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n={svg:"http://www.w3.org/2000/svg"},o={},p={},q={},r=[],s=r.slice,t,u=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},v=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return u("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=s.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(s.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(s.call(arguments)))};return e}),o.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:u(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},o.svg=function(){return!!b.createElementNS&&!!b.createElementNS(n.svg,"svg").createSVGRect},o.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==n.svg},o.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(l.call(b.createElementNS(n.svg,"clipPath")))};for(var D in o)x(o,D)&&(t=D.toLowerCase(),e[t]=o[D](),r.push((e[t]?"":"no-")+t));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=m,e.mq=v,e.testStyles=u,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+r.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},Modernizr.addTest("ie8compat",function(){return!window.addEventListener&&document.documentMode&&document.documentMode===7});
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-inlinesvg-svg-svgclippaths-touch-shiv-mq-cssclasses-teststyles-prefixes-ie8compat-load
 */

window.Modernizr=function(e,t,n){function r(e){d.cssText=e}function i(e,t){return r(g.join(e+";")+(t||""))}function s(e,t){return typeof e===t}function o(e,t){return!!~(""+e).indexOf(t)}function u(e,t,r){for(var i in e){var o=t[e[i]];if(o!==n)return r===!1?e[i]:s(o,"function")?o.bind(r||t):o}return!1}var a="2.6.2",f={},l=!0,c=t.documentElement,h="modernizr",p=t.createElement(h),d=p.style,v,m={}.toString,g=" -webkit- -moz- -o- -ms- ".split(" "),y={svg:"http://www.w3.org/2000/svg"},b={},w={},E={},S=[],x=S.slice,T,N=function(e,n,r,i){var s,o,u,a,f=t.createElement("div"),l=t.body,p=l||t.createElement("body");if(parseInt(r,10))while(r--)u=t.createElement("div"),u.id=i?i[r]:h+(r+1),f.appendChild(u);return s=["&#173;",'<style id="s',h,'">',e,"</style>"].join(""),f.id=h,(l?f:p).innerHTML+=s,p.appendChild(f),l||(p.style.background="",p.style.overflow="hidden",a=c.style.overflow,c.style.overflow="hidden",c.appendChild(p)),o=n(f,e),l?f.parentNode.removeChild(f):(p.parentNode.removeChild(p),c.style.overflow=a),!!o},C=function(t){var n=e.matchMedia||e.msMatchMedia;if(n)return n(t).matches;var r;return N("@media "+t+" { #"+h+" { position: absolute; } }",function(t){r=(e.getComputedStyle?getComputedStyle(t,null):t.currentStyle)["position"]=="absolute"}),r},k={}.hasOwnProperty,L;!s(k,"undefined")&&!s(k.call,"undefined")?L=function(e,t){return k.call(e,t)}:L=function(e,t){return t in e&&s(e.constructor.prototype[t],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if(typeof t!="function")throw new TypeError;var n=x.call(arguments,1),r=function(){if(this instanceof r){var i=function(){};i.prototype=t.prototype;var s=new i,o=t.apply(s,n.concat(x.call(arguments)));return Object(o)===o?o:s}return t.apply(e,n.concat(x.call(arguments)))};return r}),b.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:N(["@media (",g.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=e.offsetTop===9}),n},b.svg=function(){return!!t.createElementNS&&!!t.createElementNS(y.svg,"svg").createSVGRect},b.inlinesvg=function(){var e=t.createElement("div");return e.innerHTML="<svg/>",(e.firstChild&&e.firstChild.namespaceURI)==y.svg},b.svgclippaths=function(){return!!t.createElementNS&&/SVGClipPath/.test(m.call(t.createElementNS(y.svg,"clipPath")))};for(var A in b)L(b,A)&&(T=A.toLowerCase(),f[T]=b[A](),S.push((f[T]?"":"no-")+T));return f.addTest=function(e,t){if(typeof e=="object")for(var r in e)L(e,r)&&f.addTest(r,e[r]);else{e=e.toLowerCase();if(f[e]!==n)return f;t=typeof t=="function"?t():t,typeof l!="undefined"&&l&&(c.className+=" "+(t?"":"no-")+e),f[e]=t}return f},r(""),p=v=null,function(e,t){function n(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function r(){var e=g.elements;return typeof e=="string"?e.split(" "):e}function i(e){var t=v[e[p]];return t||(t={},d++,e[p]=d,v[d]=t),t}function s(e,n,r){n||(n=t);if(m)return n.createElement(e);r||(r=i(n));var s;return r.cache[e]?s=r.cache[e].cloneNode():c.test(e)?s=(r.cache[e]=r.createElem(e)).cloneNode():s=r.createElem(e),s.canHaveChildren&&!l.test(e)?r.frag.appendChild(s):s}function o(e,n){e||(e=t);if(m)return e.createDocumentFragment();n=n||i(e);var s=n.frag.cloneNode(),o=0,u=r(),a=u.length;for(;o<a;o++)s.createElement(u[o]);return s}function u(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return g.shivMethods?s(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+r().join().replace(/\w+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(g,t.frag)}function a(e){e||(e=t);var r=i(e);return g.shivCSS&&!h&&!r.hasCSS&&(r.hasCSS=!!n(e,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),m||u(e,r),e}var f=e.html5||{},l=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,c=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,h,p="_html5shiv",d=0,v={},m;(function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",h="hidden"in e,m=e.childNodes.length==1||function(){t.createElement("a");var e=t.createDocumentFragment();return typeof e.cloneNode=="undefined"||typeof e.createDocumentFragment=="undefined"||typeof e.createElement=="undefined"}()}catch(n){h=!0,m=!0}})();var g={elements:f.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:f.shivCSS!==!1,supportsUnknownElements:m,shivMethods:f.shivMethods!==!1,type:"default",shivDocument:a,createElement:s,createDocumentFragment:o};e.html5=g,a(t)}(this,t),f._version=a,f._prefixes=g,f.mq=C,f.testStyles=N,c.className=c.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(l?" js "+S.join(" "):""),f}(this,this.document),function(e,t,n){function r(e){return"[object Function]"==d.call(e)}function i(e){return"string"==typeof e}function s(){}function o(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function u(){var e=v.shift();m=1,e?e.t?h(function(){("c"==e.t?k.injectCss:k.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),u()):m=0}function a(e,n,r,i,s,a,f){function l(t){if(!d&&o(c.readyState)&&(w.r=d=1,!m&&u(),c.onload=c.onreadystatechange=null,t)){"img"!=e&&h(function(){b.removeChild(c)},50);for(var r in T[n])T[n].hasOwnProperty(r)&&T[n][r].onload()}}var f=f||k.errorTimeout,c=t.createElement(e),d=0,g=0,w={t:r,s:n,e:s,a:a,x:f};1===T[n]&&(g=1,T[n]=[]),"object"==e?c.data=n:(c.src=n,c.type=e),c.width=c.height="0",c.onerror=c.onload=c.onreadystatechange=function(){l.call(this,g)},v.splice(i,0,w),"img"!=e&&(g||2===T[n]?(b.insertBefore(c,y?null:p),h(l,f)):T[n].push(c))}function f(e,t,n,r,s){return m=0,t=t||"j",i(e)?a("c"==t?E:w,e,t,this.i++,n,r,s):(v.splice(this.i++,0,e),1==v.length&&u()),this}function l(){var e=k;return e.loader={load:f,i:0},e}var c=t.documentElement,h=e.setTimeout,p=t.getElementsByTagName("script")[0],d={}.toString,v=[],m=0,g="MozAppearance"in c.style,y=g&&!!t.createRange().compareNode,b=y?c:p.parentNode,c=e.opera&&"[object Opera]"==d.call(e.opera),c=!!t.attachEvent&&!c,w=g?"object":c?"script":"img",E=c?"script":w,S=Array.isArray||function(e){return"[object Array]"==d.call(e)},x=[],T={},N={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}},C,k;k=function(e){function t(e){var e=e.split("!"),t=x.length,n=e.pop(),r=e.length,n={url:n,origUrl:n,prefixes:e},i,s,o;for(s=0;s<r;s++)o=e[s].split("="),(i=N[o.shift()])&&(n=i(n,o));for(s=0;s<t;s++)n=x[s](n);return n}function o(e,i,s,o,u){var a=t(e),f=a.autoCallback;a.url.split(".").pop().split("?").shift(),a.bypass||(i&&(i=r(i)?i:i[e]||i[o]||i[e.split("/").pop().split("?")[0]]),a.instead?a.instead(e,i,s,o,u):(T[a.url]?a.noexec=!0:T[a.url]=1,s.load(a.url,a.forceCSS||!a.forceJS&&"css"==a.url.split(".").pop().split("?").shift()?"c":n,a.noexec,a.attrs,a.timeout),(r(i)||r(f))&&s.load(function(){l(),i&&i(a.origUrl,u,o),f&&f(a.origUrl,u,o),T[a.url]=2})))}function u(e,t){function n(e,n){if(e){if(i(e))n||(f=function(){var e=[].slice.call(arguments);l.apply(this,e),c()}),o(e,f,t,0,u);else if(Object(e)===e)for(p in h=function(){var t=0,n;for(n in e)e.hasOwnProperty(n)&&t++;return t}(),e)e.hasOwnProperty(p)&&(!n&&!--h&&(r(f)?f=function(){var e=[].slice.call(arguments);l.apply(this,e),c()}:f[p]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),c()}}(l[p])),o(e[p],f,t,p,u))}else!n&&c()}var u=!!e.test,a=e.load||e.both,f=e.callback||s,l=f,c=e.complete||s,h,p;n(u?e.yep:e.nope,!!a),a&&n(a)}var a,f,c=this.yepnope.loader;if(i(e))o(e,0,c,0);else if(S(e))for(a=0;a<e.length;a++)f=e[a],i(f)?o(f,0,c,0):S(f)?k(f):Object(f)===f&&u(f,c);else Object(e)===e&&u(e,c)},k.addPrefix=function(e,t){N[e]=t},k.addFilter=function(e){x.push(e)},k.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",C=function(){t.removeEventListener("DOMContentLoaded",C,0),t.readyState="complete"},0)),e.yepnope=l(),e.yepnope.executeStack=u,e.yepnope.injectJs=function(e,n,r,i,a,f){var l=t.createElement("script"),c,d,i=i||k.errorTimeout;l.src=e;for(d in r)l.setAttribute(d,r[d]);n=f?u:n||s,l.onreadystatechange=l.onload=function(){!c&&o(l.readyState)&&(c=1,n(),l.onload=l.onreadystatechange=null)},h(function(){c||(c=1,n(1))},i),a?l.onload():p.parentNode.insertBefore(l,p)},e.yepnope.injectCss=function(e,n,r,i,o,a){var i=t.createElement("link"),f,n=a?u:n||s;i.href=e,i.rel="stylesheet",i.type="text/css";for(f in r)i.setAttribute(f,r[f]);o||(p.parentNode.insertBefore(i,p),h(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},Modernizr.addTest("ie8compat",function(){return!window.addEventListener&&document.documentMode&&document.documentMode===7});
/*
 * jQuery Custom Forms Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
(function(e){var t=function(){return{tmp:[],hidden:null,adjust:function(t){var n=this;n.hidden=t.parents().andSelf().filter(":hidden"),n.hidden.each(function(){var t=e(this);n.tmp.push(t.attr("style")),t.css({visibility:"hidden",display:"block"})})},reset:function(){var t=this;t.hidden.each(function(n){var r=e(this),i=t.tmp[n];i===undefined?r.removeAttr("style"):r.attr("style",i)}),t.tmp=[],t.hidden=null}}};jQuery.foundation=jQuery.foundation||{},jQuery.foundation.customForms=jQuery.foundation.customForms||{},e.foundation.customForms.appendCustomMarkup=function(n){function i(t,n){var r=e(n).hide(),i=r.attr("type"),s=r.next("span.custom."+i);s.length===0&&(s=e('<span class="custom '+i+'"></span>').insertAfter(r)),s.toggleClass("checked",r.is(":checked")),s.toggleClass("disabled",r.is(":disabled"))}function s(r,i){var s=t(),o=e(i),u=o.next("div.custom.dropdown"),a=u.find("ul"),f=u.find(".current"),l=u.find(".selector"),c=o.find("option"),h=c.filter(":selected"),p=0,d="",v,m=!1;if(o.hasClass(n.disable_class))return;if(u.length===0){var g=o.hasClass("small")?"small":o.hasClass("medium")?"medium":o.hasClass("large")?"large":o.hasClass("expand")?"expand":"";u=e('<div class="'+["custom","dropdown",g].join(" ")+'"><a href="#" class="selector"></a><ul /></div>'),l=u.find(".selector"),a=u.find("ul"),d=c.map(function(){return"<li>"+e(this).html()+"</li>"}).get().join(""),a.append(d),m=u.prepend('<a href="#" class="current">'+h.html()+"</a>").find(".current"),o.after(u).hide()}else d=c.map(function(){return"<li>"+e(this).html()+"</li>"}).get().join(""),a.html("").append(d);u.toggleClass("disabled",o.is(":disabled")),v=a.find("li"),c.each(function(t){this.selected&&(v.eq(t).addClass("selected"),m&&m.html(e(this).html()))}),a.css("width","auto"),u.css("width","auto"),u.is(".small, .medium, .large, .expand")||(u.addClass("open"),s.adjust(a),p=v.outerWidth()>p?v.outerWidth():p,s.reset(),u.removeClass("open"),u.width(p+18),a.width(p+16))}var r={disable_class:"no-custom"};n=e.extend(r,n),e("form.custom input:radio[data-customforms!=disabled]").each(i),e("form.custom input:checkbox[data-customforms!=disabled]").each(i),e("form.custom select[data-customforms!=disabled]").each(s)};var n=function(t){var n=0,r=t.next();$options=t.find("option"),r.find("ul").html(""),$options.each(function(){$li=e("<li>"+e(this).html()+"</li>"),r.find("ul").append($li)}),$options.each(function(t){this.selected&&(r.find("li").eq(t).addClass("selected"),r.find(".current").html(e(this).html()))}),r.removeAttr("style").find("ul").removeAttr("style"),r.find("li").each(function(){r.addClass("open"),e(this).outerWidth()>n&&(n=e(this).outerWidth()),r.removeClass("open")}),r.css("width",n+18+"px"),r.find("ul").css("width",n+16+"px")},r=function(e){var t=e.prev(),n=t[0];!1===t.is(":disabled")&&(n.checked=n.checked?!1:!0,e.toggleClass("checked"),t.trigger("change"))},i=function(e){var t=e.prev(),n=t.closest("form.custom"),r=t[0];!1===t.is(":disabled")&&(n.find('input:radio[name="'+t.attr("name")+'"]').next().not(e).removeClass("checked"),e.hasClass("checked")||e.toggleClass("checked"),r.checked=e.hasClass("checked"),t.trigger("change"))};e(document).on("click","form.custom span.custom.checkbox",function(t){t.preventDefault(),t.stopPropagation(),r(e(this))}),e(document).on("click","form.custom span.custom.radio",function(t){t.preventDefault(),t.stopPropagation(),i(e(this))}),e(document).on("change","form.custom select[data-customforms!=disabled]",function(t){n(e(this))}),e(document).on("click","form.custom label",function(t){var n=e("#"+e(this).attr("for")+"[data-customforms!=disabled]"),s,o;n.length!==0&&(n.attr("type")==="checkbox"?(t.preventDefault(),s=e(this).find("span.custom.checkbox"),s.length==0&&(s=e(this).next("span.custom.checkbox")),s.length==0&&(s=e(this).prev("span.custom.checkbox")),r(s)):n.attr("type")==="radio"&&(t.preventDefault(),o=e(this).find("span.custom.radio"),o.length==0&&(o=e(this).next("span.custom.radio")),o.length==0&&(o=e(this).prev("span.custom.radio")),i(o)))}),e(document).on("click","form.custom div.custom.dropdown a.current, form.custom div.custom.dropdown a.selector",function(t){var n=e(this),r=n.closest("div.custom.dropdown"),i=r.prev();t.preventDefault(),e("div.dropdown").removeClass("open");if(!1===i.is(":disabled"))return r.toggleClass("open"),r.hasClass("open")?e(document).bind("click.customdropdown",function(t){r.removeClass("open"),e(document).unbind(".customdropdown")}):e(document).unbind(".customdropdown"),!1}),e(document).on("click","form.custom div.custom.dropdown li",function(t){var n=e(this),r=n.closest("div.custom.dropdown"),i=r.prev(),s=0;t.preventDefault(),t.stopPropagation(),e("div.dropdown").removeClass("open"),n.closest("ul").find("li").removeClass("selected"),n.addClass("selected"),r.removeClass("open").find("a.current").html(n.html()),n.closest("ul").find("li").each(function(e){n[0]==this&&(s=e)}),i[0].selectedIndex=s,i.trigger("change")}),e.fn.foundationCustomForms=e.foundation.customForms.appendCustomMarkup})(jQuery);
// jquery.event.move
//
// 1.3.1
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:   Page coordinates of pointer.
// startX:
// startY:  Page coordinates of pointer at movestart.
// distX:
// distY:  Distance the pointer has moved since movestart.
// deltaX:
// deltaY:  Distance the finger has moved since last event.
// velocityX:
// velocityY:  Average velocity over last few events.
(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):e(jQuery)})(function(e,t){function l(e){function i(e){n?(t(),o(i),r=!0,n=!1):r=!1}var t=e,n=!1,r=!1;this.kick=function(e){n=!0,r||i()},this.end=function(e){var i=t;if(!e)return;r?(t=n?function(){i(),e()}:e,n=!0):e()}}function c(){return!0}function h(){return!1}function p(e){e.preventDefault()}function d(e){if(u[e.target.tagName.toLowerCase()])return;e.preventDefault()}function v(e){return e.which===1&&!e.ctrlKey&&!e.altKey}function m(e,t){var n,r;if(e.identifiedTouch)return e.identifiedTouch(t);n=-1,r=e.length;while(++n<r)if(e[n].identifier===t)return e[n]}function g(e,t){var n=m(e.changedTouches,t.identifier);if(!n)return;if(n.pageX===t.pageX&&n.pageY===t.pageY)return;return n}function y(e){var t;if(!v(e))return;t={target:e.target,startX:e.pageX,startY:e.pageY,timeStamp:e.timeStamp},r(document,a.move,b,t),r(document,a.cancel,w,t)}function b(e){var t=e.data;C(e,t,e,E)}function w(e){E()}function E(){i(document,a.move,b),i(document,a.cancel,E)}function S(e){var t,n;if(u[e.target.tagName.toLowerCase()])return;t=e.changedTouches[0],n={target:t.target,startX:t.pageX,startY:t.pageY,timeStamp:e.timeStamp,identifier:t.identifier},r(document,f.move+"."+t.identifier,x,n),r(document,f.cancel+"."+t.identifier,T,n)}function x(e){var t=e.data,n=g(e,t);if(!n)return;C(e,t,n,N)}function T(e){var t=e.data,n=m(e.changedTouches,t.identifier);if(!n)return;N(t.identifier)}function N(e){i(document,"."+e,x),i(document,"."+e,T)}function C(e,t,r,i){var s=r.pageX-t.startX,o=r.pageY-t.startY;if(s*s+o*o<n*n)return;A(e,t,r,s,o,i)}function k(){return this._handled=c,!1}function L(e){e._handled()}function A(e,t,n,r,i,o){var u=t.target,a,f;a=e.targetTouches,f=e.timeStamp-t.timeStamp,t.type="movestart",t.distX=r,t.distY=i,t.deltaX=r,t.deltaY=i,t.pageX=n.pageX,t.pageY=n.pageY,t.velocityX=r/f,t.velocityY=i/f,t.targetTouches=a,t.finger=a?a.length:1,t._handled=k,t._preventTouchmoveDefault=function(){e.preventDefault()},s(t.target,t),o(t.identifier)}function O(e){var t=e.data.event,n=e.data.timer;B(t,e,e.timeStamp,n)}function M(e){var t=e.data.event,n=e.data.timer;_(),j(t,n,function(){setTimeout(function(){i(t.target,"click",h)},0)})}function _(e){i(document,a.move,O),i(document,a.end,M)}function D(e){var t=e.data.event,n=e.data.timer,r=g(e,t);if(!r)return;e.preventDefault(),t.targetTouches=e.targetTouches,B(t,r,e.timeStamp,n)}function P(e){var t=e.data.event,n=e.data.timer,r=m(e.changedTouches,t.identifier);if(!r)return;H(t),j(t,n)}function H(e){i(document,"."+e.identifier,D),i(document,"."+e.identifier,P)}function B(e,t,n,r){var i=n-e.timeStamp;e.type="move",e.distX=t.pageX-e.startX,e.distY=t.pageY-e.startY,e.deltaX=t.pageX-e.pageX,e.deltaY=t.pageY-e.pageY,e.velocityX=.3*e.velocityX+.7*e.deltaX/i,e.velocityY=.3*e.velocityY+.7*e.deltaY/i,e.pageX=t.pageX,e.pageY=t.pageY,r.kick()}function j(e,t,n){t.end(function(){return e.type="moveend",s(e.target,e),n&&n()})}function F(e,t,n){return r(this,"movestart.move",L),!0}function I(e){return i(this,"dragstart drag",p),i(this,"mousedown touchstart",d),i(this,"movestart",L),!0}function q(e){if(e.namespace==="move"||e.namespace==="moveend")return;r(this,"dragstart."+e.guid+" drag."+e.guid,p,t,e.selector),r(this,"mousedown."+e.guid,d,t,e.selector)}function R(e){if(e.namespace==="move"||e.namespace==="moveend")return;i(this,"dragstart."+e.guid+" drag."+e.guid),i(this,"mousedown."+e.guid)}var n=6,r=e.event.add,i=e.event.remove,s=function(t,n,r){e.event.trigger(n,r,t)},o=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){return window.setTimeout(function(){e()},25)}}(),u={textarea:!0,input:!0,select:!0,button:!0},a={move:"mousemove",cancel:"mouseup dragstart",end:"mouseup"},f={move:"touchmove",cancel:"touchend",end:"touchend"};e.event.special.movestart={setup:F,teardown:I,add:q,remove:R,_default:function(e){var n,i;if(!e._handled())return;n={target:e.target,startX:e.startX,startY:e.startY,pageX:e.pageX,pageY:e.pageY,distX:e.distX,distY:e.distY,deltaX:e.deltaX,deltaY:e.deltaY,velocityX:e.velocityX,velocityY:e.velocityY,timeStamp:e.timeStamp,identifier:e.identifier,targetTouches:e.targetTouches,finger:e.finger},i={event:n,timer:new l(function(t){s(e.target,n)})},e.identifier===t?(r(e.target,"click",h),r(document,a.move,O,i),r(document,a.end,M,i)):(e._preventTouchmoveDefault(),r(document,f.move+"."+e.identifier,D,i),r(document,f.end+"."+e.identifier,P,i))}},e.event.special.move={setup:function(){r(this,"movestart.move",e.noop)},teardown:function(){i(this,"movestart.move",e.noop)}},e.event.special.moveend={setup:function(){r(this,"movestart.moveend",e.noop)},teardown:function(){i(this,"movestart.moveend",e.noop)}},r(document,"mousedown.move",y),r(document,"touchstart.move",S),typeof Array.prototype.indexOf=="function"&&function(e,t){var n=["changedTouches","targetTouches"],r=n.length;while(r--)e.event.props.indexOf(n[r])===-1&&e.event.props.push(n[r])}(e)});
// jQuery.event.swipe
// 0.5
// Stephen Band
// Dependencies
// jQuery.event.move 1.2
// One of swipeleft, swiperight, swipeup or swipedown is triggered on
// moveend, when the move has covered a threshold ratio of the dimension
// of the target node, or has gone really fast. Threshold and velocity
// sensitivity changed with:
//
// jQuery.event.special.swipe.settings.threshold
// jQuery.event.special.swipe.settings.sensitivity
(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):e(jQuery)})(function(e,t){function o(e){var t,n,r;t=e.target.offsetWidth,n=e.target.offsetHeight,r={distX:e.distX,distY:e.distY,velocityX:e.velocityX,velocityY:e.velocityY,finger:e.finger};if(e.distX>e.distY){if(e.distX>-e.distY){if(e.distX/t>s.threshold||e.velocityX*e.distX/t*s.sensitivity>1)r.type="swiperight",i(e.currentTarget,r)}else if(-e.distY/n>s.threshold||e.velocityY*e.distY/t*s.sensitivity>1)r.type="swipeup",i(e.currentTarget,r)}else if(e.distX>-e.distY){if(e.distY/n>s.threshold||e.velocityY*e.distY/t*s.sensitivity>1)r.type="swipedown",i(e.currentTarget,r)}else if(-e.distX/t>s.threshold||e.velocityX*e.distX/t*s.sensitivity>1)r.type="swipeleft",i(e.currentTarget,r)}function u(t){var n=e.data(t,"event_swipe");return n||(n={count:0},e.data(t,"event_swipe",n)),n}var n=e.event.add,r=e.event.remove,i=function(t,n,r){e.event.trigger(n,r,t)},s={threshold:.4,sensitivity:6};e.event.special.swipe=e.event.special.swipeleft=e.event.special.swiperight=e.event.special.swipeup=e.event.special.swipedown={setup:function(e,t,r){var e=u(this);if(e.count++>0)return;return n(this,"moveend",o),!0},teardown:function(){var e=u(this);if(--e.count>0)return;return r(this,"moveend",o),!0},settings:s}});
/*
 * jQuery Reveal Plugin 1.1
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
/*globals jQuery */
(function(e){"use strict";var t=!1;e(document).on("click","a[data-reveal-id]",function(t){t.preventDefault();var n=e(this).attr("data-reveal-id");e("#"+n).reveal(e(this).data())}),e.fn.reveal=function(n){var r=e(document),i={animation:"fadeAndPop",animationSpeed:300,closeOnBackgroundClick:!0,dismissModalClass:"close-reveal-modal",open:e.noop,opened:e.noop,close:e.noop,closed:e.noop};return n=e.extend({},i,n),this.not(".reveal-modal.open").each(function(){function c(){u=!1}function h(){u=!0}function p(){var n=e(".reveal-modal.open");n.length===1&&(t=!0,n.trigger("reveal:close"))}function d(){u||(h(),p(),i.addClass("open"),n.animation==="fadeAndPop"&&(f.open.top=r.scrollTop()-o,f.open.opacity=0,i.css(f.open),a.fadeIn(n.animationSpeed/2),i.delay(n.animationSpeed/2).animate({top:r.scrollTop()+s+"px",opacity:1},n.animationSpeed,function(){i.trigger("reveal:opened")})),n.animation==="fade"&&(f.open.top=r.scrollTop()+s,f.open.opacity=0,i.css(f.open),a.fadeIn(n.animationSpeed/2),i.delay(n.animationSpeed/2).animate({opacity:1},n.animationSpeed,function(){i.trigger("reveal:opened")})),n.animation==="none"&&(f.open.top=r.scrollTop()+s,f.open.opacity=1,i.css(f.open),a.css({display:"block"}),i.trigger("reveal:opened")))}function v(){var e=i.find(".flex-video"),t=e.find("iframe");t.length>0&&(t.attr("src",t.data("src")),e.fadeIn(100))}function m(){u||(h(),i.removeClass("open"),n.animation==="fadeAndPop"&&(i.animate({top:r.scrollTop()-o+"px",opacity:0},n.animationSpeed/2,function(){i.css(f.close)}),t?i.trigger("reveal:closed"):a.delay(n.animationSpeed).fadeOut(n.animationSpeed,function(){i.trigger("reveal:closed")})),n.animation==="fade"&&(i.animate({opacity:0},n.animationSpeed,function(){i.css(f.close)}),t?i.trigger("reveal:closed"):a.delay(n.animationSpeed).fadeOut(n.animationSpeed,function(){i.trigger("reveal:closed")})),n.animation==="none"&&(i.css(f.close),t||a.css({display:"none"}),i.trigger("reveal:closed")),t=!1)}function g(){i.unbind(".reveal"),a.unbind(".reveal"),l.unbind(".reveal"),e("body").unbind(".reveal")}function y(){var e=i.find(".flex-video"),t=e.find("iframe");t.length>0&&(t.data("src",t.attr("src")),t.attr("src",""),e.fadeOut(100))}var i=e(this),s=parseInt(i.css("top"),10),o=i.height()+s,u=!1,a=e(".reveal-modal-bg"),f={open:{top:0,opacity:0,visibility:"visible",display:"block"},close:{top:s,opacity:1,visibility:"hidden",display:"none"}},l;a.length===0&&(a=e("<div />",{"class":"reveal-modal-bg"}).insertAfter(i),a.fadeTo("fast",.8)),i.bind("reveal:open.reveal",d),i.bind("reveal:open.reveal",v),i.bind("reveal:close.reveal",m),i.bind("reveal:closed.reveal",y),i.bind("reveal:opened.reveal reveal:closed.reveal",c),i.bind("reveal:closed.reveal",g),i.bind("reveal:open.reveal",n.open),i.bind("reveal:opened.reveal",n.opened),i.bind("reveal:close.reveal",n.close),i.bind("reveal:closed.reveal",n.closed),i.trigger("reveal:open"),l=e("."+n.dismissModalClass).bind("click.reveal",function(){i.trigger("reveal:close")}),n.closeOnBackgroundClick&&(a.css({cursor:"pointer"}),a.bind("click.reveal",function(){i.trigger("reveal:close")})),e("body").bind("keyup.reveal",function(e){e.which===27&&i.trigger("reveal:close")})})}})(jQuery);
/*
 * jQuery Orbit Plugin 1.4.0
 * www.ZURB.com/playground
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
(function(e){"use strict";e.fn.findFirstImage=function(){return this.first().find("img").andSelf().filter("img").first()};var t={defaults:{animation:"horizontal-push",animationSpeed:600,timer:!0,advanceSpeed:4e3,pauseOnHover:!1,startClockOnMouseOut:!1,startClockOnMouseOutAfter:1e3,directionalNav:!0,directionalNavRightText:"Right",directionalNavLeftText:"Left",captions:!0,captionAnimation:"fade",captionAnimationSpeed:600,resetTimerOnClick:!1,bullets:!1,bulletThumbs:!1,bulletThumbLocation:"",bulletThumbsHideOnSmall:!0,afterSlideChange:e.noop,afterLoadComplete:e.noop,fluid:!0,centerBullets:!0,singleCycle:!1,slideNumber:!1,stackOnSmall:!1},activeSlide:0,numberSlides:0,orbitWidth:null,orbitHeight:null,locked:null,timerRunning:null,degrees:0,wrapperHTML:'<div class="orbit-wrapper" />',timerHTML:'<div class="timer"><span class="mask"><span class="rotator"></span></span><span class="pause"></span></div>',captionHTML:'<div class="orbit-caption"></div>',directionalNavHTML:'<div class="slider-nav hide-for-small"><span class="right"></span><span class="left"></span></div>',bulletHTML:'<ul class="orbit-bullets"></ul>',slideNumberHTML:'<span class="orbit-slide-counter"></span>',init:function(t,n){var r,i=0,s=this;this.clickTimer=e.proxy(this.clickTimer,this),this.addBullet=e.proxy(this.addBullet,this),this.resetAndUnlock=e.proxy(this.resetAndUnlock,this),this.stopClock=e.proxy(this.stopClock,this),this.startTimerAfterMouseLeave=e.proxy(this.startTimerAfterMouseLeave,this),this.clearClockMouseLeaveTimer=e.proxy(this.clearClockMouseLeaveTimer,this),this.rotateTimer=e.proxy(this.rotateTimer,this),this.options=e.extend({},this.defaults,n),this.options.timer==="false"&&(this.options.timer=!1),this.options.captions==="false"&&(this.options.captions=!1),this.options.directionalNav==="false"&&(this.options.directionalNav=!1),this.$element=e(t),this.$wrapper=this.$element.wrap(this.wrapperHTML).parent(),this.$slides=this.$element.children("img, a, div, figure, li"),this.$element.on("movestart",function(e){(e.distX>e.distY&&e.distX<-e.distY||e.distX<e.distY&&e.distX>-e.distY)&&e.preventDefault()}),this.$element.bind("orbit.next",function(){s.shift("next")}),this.$element.bind("orbit.prev",function(){s.shift("prev")}),this.$element.bind("swipeleft",function(){e(this).trigger("orbit.next")}),this.$element.bind("swiperight",function(){e(this).trigger("orbit.prev")}),this.$element.bind("orbit.goto",function(e,t){s.shift(t)}),this.$element.bind("orbit.start",function(e,t){s.startClock()}),this.$element.bind("orbit.stop",function(e,t){s.stopClock()}),r=this.$slides.filter("img"),r.length===0?this.loaded():r.bind("imageready",function(){i+=1,i===r.length&&s.loaded()})},loaded:function(){this.$element.addClass("orbit").css({width:"1px",height:"1px"}),this.options.stackOnSmall&&this.$element.addClass("orbit-stack-on-small"),this.$slides.addClass("orbit-slide").css({opacity:0}),this.setDimentionsFromLargestSlide(),this.updateOptionsIfOnlyOneSlide(),this.setupFirstSlide(),this.notifySlideChange(),this.options.timer&&(this.setupTimer(),this.startClock()),this.options.captions&&this.setupCaptions(),this.options.directionalNav&&this.setupDirectionalNav(),this.options.bullets&&(this.setupBulletNav(),this.setActiveBullet()),this.options.afterLoadComplete.call(this),Holder.run()},currentSlide:function(){return this.$slides.eq(this.activeSlide)},notifySlideChange:function(){if(this.options.slideNumber){var t=this.activeSlide+1+" of "+this.$slides.length;this.$element.trigger("orbit.change",{slideIndex:this.activeSlide,slideCount:this.$slides.length});if(this.$counter===undefined){var n=e(this.slideNumberHTML).html(t);this.$counter=n,this.$wrapper.append(this.$counter)}else this.$counter.html(t)}},setDimentionsFromLargestSlide:function(){var t=this,n;t.$element.add(t.$wrapper).width(this.$slides.first().outerWidth()),t.$element.add(t.$wrapper).height(this.$slides.first().height()),t.orbitWidth=this.$slides.first().outerWidth(),t.orbitHeight=this.$slides.first().height(),n=this.$slides.first().findFirstImage().clone(),this.$slides.each(function(){var r=e(this),i=r.outerWidth(),s=r.height();i>t.$element.outerWidth()&&(t.$element.add(t.$wrapper).width(i),t.orbitWidth=t.$element.outerWidth()),s>t.$element.height()&&(t.$element.add(t.$wrapper).height(s),t.orbitHeight=t.$element.height(),n=e(this).findFirstImage().clone()),t.numberSlides+=1}),this.options.fluid&&(typeof this.options.fluid=="string"&&(n=e("<img>").attr("data-src","holder.js/"+this.options.fluid)),t.$element.prepend(n),n.addClass("fluid-placeholder"),t.$element.add(t.$wrapper).css({width:"inherit"}),t.$element.add(t.$wrapper).css({height:"inherit"}),e(window).bind("resize",function(){t.orbitWidth=t.$element.outerWidth(),t.orbitHeight=t.$element.height()}))},lock:function(){this.locked=!0},unlock:function(){this.locked=!1},updateOptionsIfOnlyOneSlide:function(){this.$slides.length===1&&(this.options.directionalNav=!1,this.options.timer=!1,this.options.bullets=!1)},setupFirstSlide:function(){var e=this;this.$slides.first().css({"z-index":3,opacity:1}).fadeIn(function(){e.$slides.css({display:"block"})})},startClock:function(){var e=this;if(!this.options.timer)return!1;this.$timer.is(":hidden")?this.clock=setInterval(function(){e.$element.trigger("orbit.next")},this.options.advanceSpeed):(this.timerRunning=!0,this.$pause.removeClass("active"),this.clock=setInterval(this.rotateTimer,this.options.advanceSpeed/180,!1))},rotateTimer:function(e){var t="rotate("+this.degrees+"deg)";this.degrees+=2,this.$rotator.css({"-webkit-transform":t,"-moz-transform":t,"-o-transform":t,"-ms-transform":t}),e&&(this.degrees=0,this.$rotator.removeClass("move"),this.$mask.removeClass("move")),this.degrees>180&&(this.$rotator.addClass("move"),this.$mask.addClass("move")),this.degrees>360&&(this.$rotator.removeClass("move"),this.$mask.removeClass("move"),this.degrees=0,this.$element.trigger("orbit.next"))},stopClock:function(){if(!this.options.timer)return!1;this.timerRunning=!1,clearInterval(this.clock),this.$pause.addClass("active")},setupTimer:function(){this.$timer=e(this.timerHTML),this.$wrapper.append(this.$timer),this.$rotator=this.$timer.find(".rotator"),this.$mask=this.$timer.find(".mask"),this.$pause=this.$timer.find(".pause"),this.$timer.click(this.clickTimer),this.options.startClockOnMouseOut&&(this.$wrapper.mouseleave(this.startTimerAfterMouseLeave),this.$wrapper.mouseenter(this.clearClockMouseLeaveTimer)),this.options.pauseOnHover&&this.$wrapper.mouseenter(this.stopClock)},startTimerAfterMouseLeave:function(){var e=this;this.outTimer=setTimeout(function(){e.timerRunning||e.startClock()},this.options.startClockOnMouseOutAfter)},clearClockMouseLeaveTimer:function(){clearTimeout(this.outTimer)},clickTimer:function(){this.timerRunning?this.stopClock():this.startClock()},setupCaptions:function(){this.$caption=e(this.captionHTML),this.$wrapper.append(this.$caption),this.setCaption()},setCaption:function(){var t=this.currentSlide().attr("data-caption"),n;if(!this.options.captions)return!1;if(t){if(e.trim(e(t).text()).length<1)return!1;t.charAt(0)=="#"&&(t=t.substring(1,t.length)),n=e("#"+t).html(),this.$caption.attr("id",t).html(n);switch(this.options.captionAnimation){case"none":this.$caption.show();break;case"fade":this.$caption.fadeIn(this.options.captionAnimationSpeed);break;case"slideOpen":this.$caption.slideDown(this.options.captionAnimationSpeed)}}else switch(this.options.captionAnimation){case"none":this.$caption.hide();break;case"fade":this.$caption.fadeOut(this.options.captionAnimationSpeed);break;case"slideOpen":this.$caption.slideUp(this.options.captionAnimationSpeed)}},setupDirectionalNav:function(){var t=this,n=e(this.directionalNavHTML);n.find(".right").html(this.options.directionalNavRightText),n.find(".left").html(this.options.directionalNavLeftText),this.$wrapper.append(n),this.$wrapper.find(".left").click(function(){t.stopClock(),t.options.resetTimerOnClick&&(t.rotateTimer(!0),t.startClock()),t.$element.trigger("orbit.prev")}),this.$wrapper.find(".right").click(function(){t.stopClock(),t.options.resetTimerOnClick&&(t.rotateTimer(!0),t.startClock()),t.$element.trigger("orbit.next")})},setupBulletNav:function(){this.$bullets=e(this.bulletHTML),this.$wrapper.append(this.$bullets),this.$slides.each(this.addBullet),this.$element.addClass("with-bullets"),this.options.centerBullets&&this.$bullets.css("margin-left",-this.$bullets.outerWidth()/2),this.options.bulletThumbsHideOnSmall&&this.$bullets.addClass("hide-for-small")},addBullet:function(t,n){var r=t+1,i=e("<li>"+r+"</li>"),s,o=this;this.options.bulletThumbs&&(s=e(n).attr("data-thumb"),s&&i.addClass("has-thumb").css({background:"url("+this.options.bulletThumbLocation+s+") no-repeat"})),this.$bullets.append(i),i.data("index",t),i.click(function(){o.stopClock(),o.options.resetTimerOnClick&&(o.rotateTimer(!0),o.startClock()),o.$element.trigger("orbit.goto",[i.data("index")])})},setActiveBullet:function(){if(!this.options.bullets)return!1;this.$bullets.find("li").removeClass("active").eq(this.activeSlide).addClass("active")},resetAndUnlock:function(){this.$slides.eq(this.prevActiveSlide).css({"z-index":1}),this.unlock(),this.options.afterSlideChange.call(this,this.$slides.eq(this.prevActiveSlide),this.$slides.eq(this.activeSlide))},shift:function(t){var n=t;this.prevActiveSlide=this.activeSlide;if(this.prevActiveSlide==n)return!1;if(this.$slides.length=="1")return!1;this.locked||(this.lock(),t=="next"?(this.activeSlide++,this.activeSlide==this.numberSlides&&(this.activeSlide=0)):t=="prev"?(this.activeSlide--,this.activeSlide<0&&(this.activeSlide=this.numberSlides-1)):(this.activeSlide=t,this.prevActiveSlide<this.activeSlide?n="next":this.prevActiveSlide>this.activeSlide&&(n="prev")),this.setActiveBullet(),this.notifySlideChange(),this.$slides.eq(this.prevActiveSlide).css({"z-index":2}),this.options.animation=="fade"&&(this.$slides.eq(this.activeSlide).css({opacity:0,"z-index":3}).animate({opacity:1},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).animate({opacity:0},this.options.animationSpeed)),this.options.animation=="horizontal-slide"&&(n=="next"&&this.$slides.eq(this.activeSlide).css({left:this.orbitWidth,"z-index":3}).css("opacity",1).animate({left:0},this.options.animationSpeed,this.resetAndUnlock),n=="prev"&&this.$slides.eq(this.activeSlide).css({left:-this.orbitWidth,"z-index":3}).css("opacity",1).animate({left:0},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).css("opacity",0)),this.options.animation=="vertical-slide"&&(n=="prev"&&(this.$slides.eq(this.activeSlide).css({top:this.orbitHeight,"z-index":3}).css("opacity",1).animate({top:0},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).css("opacity",0)),n=="next"&&this.$slides.eq(this.activeSlide).css({top:-this.orbitHeight,"z-index":3}).css("opacity",1).animate({top:0},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).css("opacity",0)),this.options.animation=="horizontal-push"&&(n=="next"&&(this.$slides.eq(this.activeSlide).css({left:this.orbitWidth,"z-index":3}).animate({left:0,opacity:1},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).animate({left:-this.orbitWidth},this.options.animationSpeed,"",function(){e(this).css({opacity:0})})),n=="prev"&&(this.$slides.eq(this.activeSlide).css({left:-this.orbitWidth,"z-index":3}).animate({left:0,opacity:1},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).animate({left:this.orbitWidth},this.options.animationSpeed,"",function(){e(this).css({opacity:0})}))),this.options.animation=="vertical-push"&&(n=="next"&&(this.$slides.eq(this.activeSlide).css({top:-this.orbitHeight,"z-index":3}).css("opacity",1).animate({top:0,opacity:1},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).css("opacity",0).animate({top:this.orbitHeight},this.options.animationSpeed,"")),n=="prev"&&(this.$slides.eq(this.activeSlide).css({top:this.orbitHeight,"z-index":3}).css("opacity",1).animate({top:0},this.options.animationSpeed,this.resetAndUnlock),this.$slides.eq(this.prevActiveSlide).css("opacity",0).animate({top:-this.orbitHeight},this.options.animationSpeed))),this.setCaption()),this.activeSlide===this.$slides.length-1&&this.options.singleCycle&&this.stopClock()}};e.fn.orbit=function(n){return this.each(function(){var r=e.extend({},t);r.init(this,n)})}})(jQuery),function(e){function n(t,n){var r=e(t);r.bind("load.imageready",function(){n.apply(t,arguments),r.unbind("load.imageready")})}var t={};e.event.special.imageready={setup:function(e,n,r){t=e||t},add:function(r){var i=e(this),s;this.nodeType===1&&this.tagName.toLowerCase()==="img"&&this.src!==""&&(t.forceLoad?(s=i.attr("src"),i.attr("src",""),n(this,r.handler),i.attr("src",s)):this.complete||this.readyState===4?r.handler.apply(this,arguments):n(this,r.handler))},teardown:function(t){e(this).unbind(".imageready")}}}(jQuery);var Holder=Holder||{};(function(e,t){function s(e,t){var n="complete",r="readystatechange",i=!1,s=i,o=!0,u=e.document,a=u.documentElement,f=u.addEventListener?"addEventListener":"attachEvent",l=u.addEventListener?"removeEventListener":"detachEvent",c=u.addEventListener?"":"on",h=function(o){(o.type!=r||u.readyState==n)&&((o.type=="load"?e:u)[l](c+o.type,h,i),!s&&(s=!0)&&t.call(e,null))},p=function(){try{a.doScroll("left")}catch(e){setTimeout(p,50);return}h("poll")};if(u.readyState==n)t.call(e,"lazy");else{if(u.createEventObject&&a.doScroll){try{o=!e.frameElement}catch(d){}o&&p()}u[f](c+"DOMContentLoaded",h,i),u[f](c+r,h,i),e[f](c+"load",h,i)}}function o(e){e=e.match(/^(\W)?(.*)/);var t=document["getElement"+(e[1]?e[1]=="#"?"ById":"sByClassName":"sByTagName")](e[2]),n=[];return t!=null&&(t.length?n=t:t.length==0?n=t:n=[t]),n}function u(e,t){var n={};for(var r in e)n[r]=e[r];for(var i in t)n[i]=t[i];return n}function a(e,t,n){var r=[t.height,t.width].sort(),s=Math.round(r[1]/16),o=Math.round(r[0]/16),u=Math.max(n.size,s);i.width=t.width,i.height=t.height,e.textAlign="center",e.textBaseline="middle",e.fillStyle=n.background,e.fillRect(0,0,t.width,t.height),e.fillStyle=n.foreground,e.font="bold "+u+"px sans-serif";var a=n.text?n.text:t.width+"x"+t.height;return Math.round(e.measureText(a).width)/t.width>1&&(u=Math.max(o,n.size)),e.font="bold "+u+"px sans-serif",e.fillText(a,t.width/2,t.height/2,t.width),i.toDataURL("image/png")}var n=!1,r=!1,i=document.createElement("canvas");if(!i.getContext)r=!0;else if(i.toDataURL("image/png").indexOf("data:image/png")<0)r=!0;else var f=i.getContext("2d");var l={domain:"holder.js",images:"img",themes:{gray:{background:"#eee",foreground:"#aaa",size:12},social:{background:"#3a5a97",foreground:"#fff",size:12},industrial:{background:"#434A52",foreground:"#C2F200",size:12}}};e.flags={dimensions:{regex:/([0-9]+)x([0-9]+)/,output:function(e){var t=this.regex.exec(e);return{width:+t[1],height:+t[2]}}},colors:{regex:/#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,output:function(e){var t=this.regex.exec(e);return{size:l.themes.gray.size,foreground:"#"+t[2],background:"#"+t[1]}}},text:{regex:/text\:(.*)/,output:function(e){return this.regex.exec(e)[1]}}};for(var c in e.flags)e.flags[c].match=function(e){return e.match(this.regex)};e.add_theme=function(t,n){return t!=null&&n!=null&&(l.themes[t]=n),e},e.add_image=function(t,n){var r=o(n);if(r.length)for(var i=0,s=r.length;i<s;i++){var u=document.createElement("img");u.setAttribute("data-src",t),r[i].appendChild(u)}return e},e.run=function(t){var n=u(l,t),i=o(n.images),s=!0;for(var c=i.length,h=0;h<c;h++){var p=l.themes.gray,d=i[h].getAttribute("data-src")||i[h].getAttribute("src");if(d&&!!~d.indexOf(n.domain)){var v=!1,m=null,g=null,y=d.substr(d.indexOf(n.domain)+n.domain.length+1).split("/");for(sl=y.length,j=0;j<sl;j++)e.flags.dimensions.match(y[j])?(v=!0,m=e.flags.dimensions.output(y[j])):e.flags.colors.match(y[j])?p=e.flags.colors.output(y[j]):n.themes[y[j]]?p=n.themes[y[j]]:e.flags.text.match(y[j])&&(g=e.flags.text.output(y[j]));if(v){i[h].setAttribute("data-src",d);var b=m.width+"x"+m.height;i[h].setAttribute("alt",g?g:p.text?p.text+" ["+b+"]":b),i[h].style.backgroundColor=p.background;var p=g?u(p,{text:g}):p;r||i[h].setAttribute("src",a(f,m,p))}}}return e},s(t,function(){n||e.run()})})(Holder,window);
(function(e,t,n){"use strict";e.fn.foundationNavigation=function(t){var n=!1;Modernizr.touch||navigator.userAgent.match(/Windows Phone/i)?(e(document).on("click.fndtn touchstart.fndtn",".nav-bar a.flyout-toggle",function(t){t.preventDefault();var r=e(this).siblings(".flyout").first();n===!1&&(e(".nav-bar .flyout").not(r).slideUp(500),r.slideToggle(500,function(){n=!1})),n=!0}),e(".nav-bar>li.has-flyout",this).addClass("is-touch")):e(".nav-bar>li.has-flyout",this).on("mouseenter mouseleave",function(t){t.type=="mouseenter"&&(e(".nav-bar").find(".flyout").hide(),e(this).children(".flyout").show());if(t.type=="mouseleave"){var n=e(this).children(".flyout"),r=n.find("input"),i=function(t){var n;return t.length>0?(t.each(function(){e(this).is(":focus")&&(n=!0)}),n):!1};i(r)||e(this).children(".flyout").hide()}})}})(jQuery,this);
(function(e,t,n){"use strict";e.fn.foundationButtons=function(t){var r=e(document),i=e.extend({dropdownAsToggle:!1,activeClass:"active"},t),s=function(t){e(".button.dropdown").find("ul").not(t).removeClass("show-dropdown")},o=function(t){var n=e(".button.dropdown").not(t);n.add(e("> span."+i.activeClass,n)).removeClass(i.activeClass)};r.on("click.fndtn",".button.disabled",function(e){e.preventDefault()}),e(".button.dropdown > ul",this).addClass("no-hover"),r.on("click.fndtn",".button.dropdown:not(.split), .button.dropdown.split span",function(t){var n=e(this),r=n.closest(".button.dropdown"),u=e("> ul",r);e.inArray(t.target.nodeName,["A","BUTTON"])&&t.preventDefault(),setTimeout(function(){s(i.dropdownAsToggle?"":u),u.toggleClass("show-dropdown"),i.dropdownAsToggle&&(o(r),n.toggleClass(i.activeClass))},0)}),r.on("click.fndtn","body, html",function(t){if(n==t.originalEvent)return;e(t.originalEvent.target).is(".button.dropdown:not(.split), .button.dropdown.split span")||(s(),i.dropdownAsToggle&&o())});var u=e(".button.dropdown:not(.large):not(.small):not(.tiny):visible",this).outerHeight()-1,a=e(".button.large.dropdown:visible",this).outerHeight()-1,f=e(".button.small.dropdown:visible",this).outerHeight()-1,l=e(".button.tiny.dropdown:visible",this).outerHeight()-1;e(".button.dropdown:not(.large):not(.small):not(.tiny) > ul",this).css("top",u),e(".button.dropdown.large > ul",this).css("top",a),e(".button.dropdown.small > ul",this).css("top",f),e(".button.dropdown.tiny > ul",this).css("top",l),e(".button.dropdown.up:not(.large):not(.small):not(.tiny) > ul",this).css("top","auto").css("bottom",u-2),e(".button.dropdown.up.large > ul",this).css("top","auto").css("bottom",a-2),e(".button.dropdown.up.small > ul",this).css("top","auto").css("bottom",f-2),e(".button.dropdown.up.tiny > ul",this).css("top","auto").css("bottom",l-2)}})(jQuery,this);
(function(e,t,n,r){"use strict";var i={callback:e.noop,deep_linking:!0,init:!1},s={init:function(t){return i=e.extend({},i,t),this.each(function(){i.init||s.events(),i.deep_linking&&s.from_hash()})},events:function(){e(n).on("click.fndtn",".tabs a",function(t){s.set_tab(e(this).parent("dd, li"),t)}),i.init=!0},set_tab:function(t,n){var r=t.closest("dl, ul").find(".active"),s=t.children("a").attr("href"),o=/^#/.test(s),u=e(s+"Tab");o&&u.length>0&&(n&&!i.deep_linking&&n.preventDefault(),u.closest(".tabs-content").children("li").removeClass("active").hide(),u.css("display","block").addClass("active")),r.removeClass("active"),t.addClass("active"),i.callback()},from_hash:function(){var n=t.location.hash,r=e('a[href="'+n+'"]');r.trigger("click.fndtn")}};e.fn.foundationTabs=function(t){if(s[t])return s[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return s.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.foundationTabs")}})(jQuery,this,this.document);
/*
 * jQuery Foundation Tooltips 2.0.2
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
/*jslint unparam: true, browser: true, indent: 2 */
(function(e,t,n){"use strict";var r={bodyHeight:0,selector:".has-tip",additionalInheritableClasses:[],tooltipClass:".tooltip",tipTemplate:function(e,t){return'<span data-selector="'+e+'" class="'+r.tooltipClass.substring(1)+'">'+t+'<span class="nub"></span></span>'}},i={init:function(t){return r=e.extend(r,t),r.selector=r.targetClass?r.targetClass:r.selector,this.each(function(){var t=e("body");Modernizr.touch?(t.on("click.tooltip touchstart.tooltip touchend.tooltip",r.selector,function(t){t.preventDefault(),e(r.tooltipClass).hide(),i.showOrCreateTip(e(this))}),t.on("click.tooltip touchstart.tooltip touchend.tooltip",r.tooltipClass,function(t){t.preventDefault(),e(this).fadeOut(150)})):t.on("mouseenter.tooltip mouseleave.tooltip",r.selector,function(t){var n=e(this);t.type==="mouseenter"?i.showOrCreateTip(n):t.type==="mouseleave"&&i.hide(n)}),e(this).data("tooltips",!0)})},showOrCreateTip:function(e,t){var n=i.getTip(e);n&&n.length>0?i.show(e):i.create(e,t)},getTip:function(t){var n=i.selector(t),s=null;return n&&(s=e("span[data-selector="+n+"]"+r.tooltipClass)),s.length>0?s:!1},selector:function(e){var t=e.attr("id"),r=e.data("selector");return t===n&&r===n&&(r="tooltip"+Math.random().toString(36).substring(7),e.attr("data-selector",r)),t?t:r},create:function(t,n){var s=e(r.tipTemplate(i.selector(t),e("<div>").html(n?n:t.attr("title")).html())),o=i.inheritable_classes(t);s.addClass(o).appendTo("body"),Modernizr.touch&&s.append('<span class="tap-to-close">tap to close </span>'),t.removeAttr("title"),i.show(t)},reposition:function(n,r,i){var s,o,u,a,f,l;r.css("visibility","hidden").show(),s=n.data("width"),o=r.children(".nub"),u=o.outerHeight(),a=o.outerWidth(),l=function(e,t,n,r,i,s){return e.css({top:t,bottom:r,left:i,right:n,"max-width":s?s:"auto"}).end()},l(r,n.offset().top+n.outerHeight()+10,"auto","auto",n.offset().left,s),l(o,-u,"auto","auto",10);if(e(t).width()<767){if(n.data("mobile-width"))r.width(n.data("mobile-width")).css("left",15).addClass("tip-override");else{f=n.closest(".columns"),f.length<0&&(f=e("body"));if(f.outerWidth())r.width(f.outerWidth()-25).css("left",15).addClass("tip-override");else{var c=Math.ceil(e(t).width()*.9);r.width(c).css("left",15).addClass("tip-override")}}l(o,-u,"auto","auto",n.offset().left)}else i&&i.indexOf("tip-top")>-1?(l(r,n.offset().top-r.outerHeight()-u,"auto","auto",n.offset().left,s).removeClass("tip-override"),l(o,"auto","auto",-u,"auto")):i&&i.indexOf("tip-left")>-1?(l(r,n.offset().top+n.outerHeight()/2-u,"auto","auto",n.offset().left-r.outerWidth()-10,s).removeClass("tip-override"),l(o,r.outerHeight()/2-u/2,-u,"auto","auto")):i&&i.indexOf("tip-right")>-1?(l(r,n.offset().top+n.outerHeight()/2-u,"auto","auto",n.offset().left+n.outerWidth()+10,s).removeClass("tip-override"),l(o,r.outerHeight()/2-u/2,"auto","auto",-u)):i&&i.indexOf("tip-centered-top")>-1?(l(r,n.offset().top-r.outerHeight()-u,"auto","auto",n.offset().left+(n.outerWidth()-r.outerWidth())/2,s).removeClass("tip-override"),l(o,"auto",r.outerWidth()/2-u/2,-u,"auto")):i&&i.indexOf("tip-centered-bottom")>-1&&(l(r,n.offset().top+n.outerHeight()+10,"auto","auto",n.offset().left+(n.outerWidth()-r.outerWidth())/2,s).removeClass("tip-override"),l(o,-u,r.outerWidth()/2-u/2,"auto","auto"));r.css("visibility","visible").hide()},inheritable_classes:function(t){var n=["tip-top","tip-left","tip-bottom","tip-right","tip-centered-top","tip-centered-bottom","noradius"].concat(r.additionalInheritableClasses),i=t.attr("class"),s=i?e.map(i.split(" "),function(t,r){if(e.inArray(t,n)!==-1)return t}).join(" "):"";return e.trim(s)},show:function(e){var t=i.getTip(e);i.reposition(e,t,e.attr("class")),t.fadeIn(150)},hide:function(e){var t=i.getTip(e);t.fadeOut(150)},reload:function(){var t=e(this);return t.data("tooltips")?t.foundationTooltips("destroy").foundationTooltips("init"):t.foundationTooltips("init")},destroy:function(){return this.each(function(){e(t).off(".tooltip"),e(r.selector).off(".tooltip"),e(r.tooltipClass).each(function(t){e(e(r.selector).get(t)).attr("title",e(this).text())}).remove()})}};e.fn.foundationTooltips=function(t){if(i[t])return i[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return i.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.foundationTooltips")}})(jQuery,this);
(function(e,t,n){"use strict";e.fn.foundationAccordion=function(t){var n=function(e){return e.hasClass("hover")&&!Modernizr.touch};e(document).on("mouseenter",".accordion li",function(){var t=e(this).parent();if(n(t)){var r=e(this).children(".content").first();e(".content",t).not(r).hide().parent("li").removeClass("active"),r.show(0,function(){r.parent("li").addClass("active")})}}),e(document).on("click.fndtn",".accordion li .title",function(){var t=e(this).closest("li"),r=t.parent();if(!n(r)){var i=t.children(".content").first();t.hasClass("active")?r.find("li").removeClass("active").end().find(".content").hide():(e(".content",r).not(i).hide().parent("li").removeClass("active"),i.show(0,function(){i.parent("li").addClass("active")}))}})}})(jQuery,this);
/*! http://mths.be/placeholder v2.0.7 by @mathias */
(function(e,t,n){function f(e){var t={},r=/^jQuery\d+$/;return n.each(e.attributes,function(e,n){n.specified&&!r.test(n.name)&&(t[n.name]=n.value)}),t}function l(e,r){var i=this,s=n(i);if(i.value==s.attr("placeholder")&&s.hasClass("placeholder"))if(s.data("placeholder-password")){s=s.hide().next().show().attr("id",s.removeAttr("id").data("placeholder-id"));if(e===!0)return s[0].value=r;s.focus()}else i.value="",s.removeClass("placeholder"),i==t.activeElement&&i.select()}function c(){var e,t=this,r=n(t),i=r,s=this.id;if(t.value==""){if(t.type=="password"){if(!r.data("placeholder-textinput")){try{e=r.clone().attr({type:"text"})}catch(o){e=n("<input>").attr(n.extend(f(this),{type:"text"}))}e.removeAttr("name").data({"placeholder-password":!0,"placeholder-id":s}).bind("focus.placeholder",l),r.data({"placeholder-textinput":e,"placeholder-id":s}).before(e)}r=r.removeAttr("id").hide().prev().attr("id",s).show()}r.addClass("placeholder"),r[0].value=r.attr("placeholder")}else r.removeClass("placeholder")}var r="placeholder"in t.createElement("input"),i="placeholder"in t.createElement("textarea"),s=n.fn,o=n.valHooks,u,a;r&&i?(a=s.placeholder=function(){return this},a.input=a.textarea=!0):(a=s.placeholder=function(){var e=this;return e.filter((r?"textarea":":input")+"[placeholder]").not(".placeholder").bind({"focus.placeholder":l,"blur.placeholder":c}).data("placeholder-enabled",!0).trigger("blur.placeholder"),e},a.input=r,a.textarea=i,u={get:function(e){var t=n(e);return t.data("placeholder-enabled")&&t.hasClass("placeholder")?"":e.value},set:function(e,r){var i=n(e);return i.data("placeholder-enabled")?(r==""?(e.value=r,e!=t.activeElement&&c.call(e)):i.hasClass("placeholder")?l.call(e,!0,r)||(e.value=r):e.value=r,i):e.value=r}},r||(o.input=u),i||(o.textarea=u),n(function(){n(t).delegate("form","submit.placeholder",function(){var e=n(".placeholder",this).each(l);setTimeout(function(){e.each(c)},10)})}),n(e).bind("beforeunload.placeholder",function(){n(".placeholder").each(function(){this.value=""})}))})(this,document,jQuery);
(function(e,t,n){"use strict";e.fn.foundationAlerts=function(t){var n=e.extend({callback:e.noop},t);e(document).on("click",".alert-box a.close",function(t){t.preventDefault(),e(this).closest(".alert-box").fadeOut(function(){e(this).remove(),n.callback()})})}})(jQuery,this);
/*
 * jQuery Foundation Top Bar 2.0.4
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
/*jslint unparam: true, browser: true, indent: 2 */
(function(e,t,n){"use strict";var r={index:0,initialized:!1},i={init:function(n){return this.each(function(){r=e.extend(r,n),r.$w=e(t),r.$topbar=e("nav.top-bar"),r.$section=r.$topbar.find("section"),r.$titlebar=r.$topbar.children("ul:first");var s=e("<div class='top-bar-js-breakpoint'/>").appendTo("body");r.breakPoint=s.width(),s.remove(),r.initialized||(i.assemble(),r.initialized=!0),r.height||i.largestUL(),r.$topbar.parent().hasClass("fixed")&&e("body").css("padding-top",r.$topbar.outerHeight()),e(".top-bar .toggle-topbar").off("click.fndtn").on("click.fndtn",function(e){e.preventDefault(),i.breakpoint()&&(r.$topbar.toggleClass("expanded"),r.$topbar.css("min-height","")),r.$topbar.hasClass("expanded")||(r.$section.css({left:"0%"}),r.$section.find(">.name").css({left:"100%"}),r.$section.find("li.moved").removeClass("moved"),r.index=0)}),e(".top-bar .has-dropdown>a").off("click.fndtn").on("click.fndtn",function(t){(Modernizr.touch||i.breakpoint())&&t.preventDefault();if(i.breakpoint()){var n=e(this),s=n.closest("li");r.index+=1,s.addClass("moved"),r.$section.css({left:-(100*r.index)+"%"}),r.$section.find(">.name").css({left:100*r.index+"%"}),n.siblings("ul").height(r.height+r.$titlebar.outerHeight(!0)),r.$topbar.css("min-height",r.height+r.$titlebar.outerHeight(!0)*2)}}),e(t).on("resize.fndtn.topbar",function(){i.breakpoint()||r.$topbar.css("min-height","")}),e(".top-bar .has-dropdown .back").off("click.fndtn").on("click.fndtn",function(t){t.preventDefault();var n=e(this),i=n.closest("li.moved"),s=i.parent();r.index-=1,r.$section.css({left:-(100*r.index)+"%"}),r.$section.find(">.name").css({left:100*r.index+"%"}),r.index===0&&r.$topbar.css("min-height",0),setTimeout(function(){i.removeClass("moved")},300)})})},breakpoint:function(){return r.$w.width()<r.breakPoint},assemble:function(){r.$section.detach(),r.$section.find(".has-dropdown>a").each(function(){var t=e(this),n=t.siblings(".dropdown"),r=e('<li class="title back js-generated"><h5><a href="#"></a></h5></li>');r.find("h5>a").html(t.html()),n.prepend(r)}),r.$section.appendTo(r.$topbar)},largestUL:function(){var t=r.$topbar.find("section ul ul"),n=t.first(),i=0;t.each(function(){e(this).children("li").length>n.children("li").length&&(n=e(this))}),n.children("li").each(function(){i+=e(this).outerHeight(!0)}),r.height=i}};e.fn.foundationTopBar=function(t){if(i[t])return i[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return i.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.foundationTopBar")};if(e(".sticky").length>0){var s=e(".sticky").length?e(".sticky").offset().top:0,o=e(t);o.scroll(function(){o.scrollTop()>=s?e(".sticky").addClass("fixed"):o.scrollTop()<s&&e(".sticky").removeClass("fixed")})}})(jQuery,this);
/*
 * jQuery Foundation Joyride Plugin 2.0.3
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
/*jslint unparam: true, browser: true, indent: 2 */
(function(e,t,n){"use strict";var r={version:"2.0.3",tipLocation:"bottom",nubPosition:"auto",scrollSpeed:300,timer:0,startTimerOnClick:!0,startOffset:0,nextButton:!0,tipAnimation:"fade",pauseAfter:[],tipAnimationFadeSpeed:300,cookieMonster:!1,cookieName:"joyride",cookieDomain:!1,tipContainer:"body",postRideCallback:e.noop,postStepCallback:e.noop,template:{link:'<a href="#close" class="joyride-close-tip">X</a>',timer:'<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',tip:'<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',wrapper:'<div class="joyride-content-wrapper"></div>',button:'<a href="#" class="small button joyride-next-tip"></a>'}},i=i||!1,s={},o={init:function(n){return this.each(function(){if(e.isEmptyObject(s)){s=e.extend(!0,r,n),s.document=t.document,s.$document=e(s.document),s.$window=e(t),s.$content_el=e(this),s.body_offset=e(s.tipContainer).position(),s.$tip_content=e("> li",s.$content_el),s.paused=!1,s.attempts=0,s.tipLocationPatterns={top:["bottom"],bottom:[],left:["right","top","bottom"],right:["left","top","bottom"]},o.jquery_check(),e.isFunction(e.cookie)||(s.cookieMonster=!1);if(!s.cookieMonster||!e.cookie(s.cookieName))s.$tip_content.each(function(t){o.create({$li:e(this),index:t})}),!s.startTimerOnClick&&s.timer>0?(o.show("init"),o.startTimer()):o.show("init");s.$document.on("click.joyride",".joyride-next-tip, .joyride-modal-bg",function(e){e.preventDefault(),s.$li.next().length<1?o.end():s.timer>0?(clearTimeout(s.automate),o.hide(),o.show(),o.startTimer()):(o.hide(),o.show())}),s.$document.on("click.joyride",".joyride-close-tip",function(e){e.preventDefault(),o.end()}),s.$window.bind("resize.joyride",function(e){o.is_phone()?o.pos_phone():o.pos_default()})}else o.restart()})},resume:function(){o.set_li(),o.show()},tip_template:function(t){var n,r;return t.tip_class=t.tip_class||"",n=e(s.template.tip).addClass(t.tip_class),r=e.trim(e(t.li).html())+o.button_text(t.button_text)+s.template.link+o.timer_instance(t.index),n.append(e(s.template.wrapper)),n.first().attr("data-index",t.index),e(".joyride-content-wrapper",n).append(r),n[0]},timer_instance:function(t){var n;return t===0&&s.startTimerOnClick&&s.timer>0||s.timer===0?n="":n=o.outerHTML(e(s.template.timer)[0]),n},button_text:function(t){return s.nextButton?(t=e.trim(t)||"Next",t=o.outerHTML(e(s.template.button).append(t)[0])):t="",t},create:function(t){var n=t.$li.attr("data-button")||t.$li.attr("data-text"),r=t.$li.attr("class"),i=e(o.tip_template({tip_class:r,index:t.index,button_text:n,li:t.$li}));e(s.tipContainer).append(i)},show:function(t){var r={},i,u=[],a=0,f,l=null;if(s.$li===n||e.inArray(s.$li.index(),s.pauseAfter)===-1){s.paused?s.paused=!1:o.set_li(t),s.attempts=0;if(s.$li.length&&s.$target.length>0){u=(s.$li.data("options")||":").split(";"),a=u.length;for(i=a-1;i>=0;i--)f=u[i].split(":"),f.length===2&&(r[e.trim(f[0])]=e.trim(f[1]));s.tipSettings=e.extend({},s,r),s.tipSettings.tipLocationPattern=s.tipLocationPatterns[s.tipSettings.tipLocation],/body/i.test(s.$target.selector)||o.scroll_to(),o.is_phone()?o.pos_phone(!0):o.pos_default(!0),l=e(".joyride-timer-indicator",s.$next_tip),/pop/i.test(s.tipAnimation)?(l.outerWidth(0),s.timer>0?(s.$next_tip.show(),l.animate({width:e(".joyride-timer-indicator-wrap",s.$next_tip).outerWidth()},s.timer)):s.$next_tip.show()):/fade/i.test(s.tipAnimation)&&(l.outerWidth(0),s.timer>0?(s.$next_tip.fadeIn(s.tipAnimationFadeSpeed),s.$next_tip.show(),l.animate({width:e(".joyride-timer-indicator-wrap",s.$next_tip).outerWidth()},s.timer)):s.$next_tip.fadeIn(s.tipAnimationFadeSpeed)),s.$current_tip=s.$next_tip}else s.$li&&s.$target.length<1?o.show():o.end()}else s.paused=!0},is_phone:function(){return i?i.mq("only screen and (max-width: 767px)"):s.$window.width()<767?!0:!1},hide:function(){s.postStepCallback(s.$li.index(),s.$current_tip),e(".joyride-modal-bg").hide(),s.$current_tip.hide()},set_li:function(e){e?(s.$li=s.$tip_content.eq(s.startOffset),o.set_next_tip(),s.$current_tip=s.$next_tip):(s.$li=s.$li.next(),o.set_next_tip()),o.set_target()},set_next_tip:function(){s.$next_tip=e(".joyride-tip-guide[data-index="+s.$li.index()+"]")},set_target:function(){var t=s.$li.attr("data-class"),n=s.$li.attr("data-id"),r=function(){return n?e(s.document.getElementById(n)):t?e("."+t).first():e("body")};s.$target=r()},scroll_to:function(){var t,n;t=s.$window.height()/2,n=Math.ceil(s.$target.offset().top-t+s.$next_tip.outerHeight()),e("html, body").stop().animate({scrollTop:n},s.scrollSpeed)},paused:function(){return e.inArray(s.$li.index()+1,s.pauseAfter)===-1?!0:!1},destroy:function(){s.$document.off(".joyride"),e(t).off(".joyride"),e(".joyride-close-tip, .joyride-next-tip, .joyride-modal-bg").off(".joyride"),e(".joyride-tip-guide, .joyride-modal-bg").remove(),clearTimeout(s.automate),s={}},restart:function(){o.hide(),s.$li=n,o.show("init")},pos_default:function(t){var n=Math.ceil(s.$window.height()/2),r=s.$next_tip.offset(),i=e(".joyride-nub",s.$next_tip),u=Math.ceil(i.outerHeight()/2),a=t||!1;a&&(s.$next_tip.css("visibility","hidden"),s.$next_tip.show()),/body/i.test(s.$target.selector)?s.$li.length&&o.pos_modal(i):(o.bottom()?(s.$next_tip.css({top:s.$target.offset().top+u+s.$target.outerHeight(),left:s.$target.offset().left}),o.nub_position(i,s.tipSettings.nubPosition,"top")):o.top()?(s.$next_tip.css({top:s.$target.offset().top-s.$next_tip.outerHeight()-u,left:s.$target.offset().left}),o.nub_position(i,s.tipSettings.nubPosition,"bottom")):o.right()?(s.$next_tip.css({top:s.$target.offset().top,left:s.$target.outerWidth()+s.$target.offset().left}),o.nub_position(i,s.tipSettings.nubPosition,"left")):o.left()&&(s.$next_tip.css({top:s.$target.offset().top,left:s.$target.offset().left-s.$next_tip.outerWidth()-u}),o.nub_position(i,s.tipSettings.nubPosition,"right")),!o.visible(o.corners(s.$next_tip))&&s.attempts<s.tipSettings.tipLocationPattern.length&&(i.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left"),s.tipSettings.tipLocation=s.tipSettings.tipLocationPattern[s.attempts],s.attempts++,o.pos_default(!0))),a&&(s.$next_tip.hide(),s.$next_tip.css("visibility","visible"))},pos_phone:function(t){var n=s.$next_tip.outerHeight(),r=s.$next_tip.offset(),i=s.$target.outerHeight(),u=e(".joyride-nub",s.$next_tip),a=Math.ceil(u.outerHeight()/2),f=t||!1;u.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left"),f&&(s.$next_tip.css("visibility","hidden"),s.$next_tip.show()),/body/i.test(s.$target.selector)?s.$li.length&&o.pos_modal(u):o.top()?(s.$next_tip.offset({top:s.$target.offset().top-n-a}),u.addClass("bottom")):(s.$next_tip.offset({top:s.$target.offset().top+i+a}),u.addClass("top")),f&&(s.$next_tip.hide(),s.$next_tip.css("visibility","visible"))},pos_modal:function(t){o.center(),t.hide(),e(".joyride-modal-bg").length<1&&e("body").append('<div class="joyride-modal-bg">').show(),/pop/i.test(s.tipAnimation)?e(".joyride-modal-bg").show():e(".joyride-modal-bg").fadeIn(s.tipAnimationFadeSpeed)},center:function(){var e=s.$window;return s.$next_tip.css({top:(e.height()-s.$next_tip.outerHeight())/2+e.scrollTop(),left:(e.width()-s.$next_tip.outerWidth())/2+e.scrollLeft()}),!0},bottom:function(){return/bottom/i.test(s.tipSettings.tipLocation)},top:function(){return/top/i.test(s.tipSettings.tipLocation)},right:function(){return/right/i.test(s.tipSettings.tipLocation)},left:function(){return/left/i.test(s.tipSettings.tipLocation)},corners:function(e){var t=s.$window,n=t.width()+t.scrollLeft(),r=t.width()+t.scrollTop();return[e.offset().top<=t.scrollTop(),n<=e.offset().left+e.outerWidth(),r<=e.offset().top+e.outerHeight(),t.scrollLeft()>=e.offset().left]},visible:function(e){var t=e.length;while(t--)if(e[t])return!1;return!0},nub_position:function(e,t,n){t==="auto"?e.addClass(n):e.addClass(t)},startTimer:function(){s.$li.length?s.automate=setTimeout(function(){o.hide(),o.show(),o.startTimer()},s.timer):clearTimeout(s.automate)},end:function(){s.cookieMonster&&e.cookie(s.cookieName,"ridden",{expires:365,domain:s.cookieDomain}),s.timer>0&&clearTimeout(s.automate),e(".joyride-modal-bg").hide(),s.$current_tip.hide(),s.postStepCallback(s.$li.index(),s.$current_tip),s.postRideCallback(s.$li.index(),s.$current_tip)},jquery_check:function(){return e.isFunction(e.fn.on)?!0:(e.fn.on=function(e,t,n){return this.delegate(t,e,n)},e.fn.off=function(e,t,n){return this.undelegate(t,e,n)},!1)},outerHTML:function(e){return e.outerHTML||(new XMLSerializer).serializeToString(e)},version:function(){return s.version}};e.fn.joyride=function(t){if(o[t])return o[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return o.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.joyride")}})(jQuery,this);
/*
 * jQuery Foundation Clearing 1.2.1
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
/*jslint unparam: true, browser: true, indent: 2 */
(function(e,t,n,r){"use strict";var i={templates:{viewing:'<a href="#" class="clearing-close">&times;</a><div class="visible-img" style="display: none"><img src="#"><p class="clearing-caption"></p><a href="#" class="clearing-main-left"></a><a href="#" class="clearing-main-right"></a></div>'},close_selectors:"a.clearing-close",initialized:!1,locked:!1},s={init:function(t,r){return this.find("ul[data-clearing]").each(function(){var t=e(n),r=e(this),o=o||{},u=u||{},a=r.data("fndtn.clearing.settings");a||(o.$parent=r.parent(),r.data("fndtn.clearing.settings",e.extend({},i,o)),s.assemble(r.find("li")),i.initialized||(s.events(r),Modernizr.touch&&s.swipe_events()))})},events:function(r){var o=r.data("fndtn.clearing.settings");e(n).on("click.fndtn.clearing","ul[data-clearing] li",function(t,n,r){var n=n||e(this),r=r||n,i=n.parent().data("fndtn.clearing.settings");t.preventDefault(),i||n.parent().foundationClearing(),s.open(e(t.target),n,r),s.update_paddles(r)}).on("click.fndtn.clearing",".clearing-main-right",function(e){s.nav(e,"next")}).on("click.fndtn.clearing",".clearing-main-left",function(e){s.nav(e,"prev")}).on("click.fndtn.clearing",o.close_selectors,this.close).on("keydown.fndtn.clearing",this.keydown),e(t).on("resize.fndtn.clearing",this.resize),i.initialized=!0},swipe_events:function(){e(n).bind("swipeleft","ul[data-clearing]",function(e){s.nav(e,"next")}).bind("swiperight","ul[data-clearing]",function(e){s.nav(e,"prev")}).bind("movestart","ul[data-clearing]",function(e){(e.distX>e.distY&&e.distX<-e.distY||e.distX<e.distY&&e.distX>-e.distY)&&e.preventDefault()})},assemble:function(e){var t=e.parent(),n=t.data("fndtn.clearing.settings"),r=t.detach(),i={grid:'<div class="carousel">'+this.outerHTML(r[0])+"</div>",viewing:n.templates.viewing},s='<div class="clearing-assembled"><div>'+i.viewing+i.grid+"</div></div>";return n.$parent.append(s)},open:function(e,t,n){var r=n.closest(".clearing-assembled"),i=r.find("div:first"),o=i.find(".visible-img"),u=o.find("img").not(e);s.locked()||(u.attr("src",this.load(e)),u.loaded(function(){r.addClass("clearing-blackout"),i.addClass("clearing-container"),this.caption(o.find(".clearing-caption"),e),o.show(),this.fix_height(n),this.center(u),this.shift(t,n,function(){n.siblings().removeClass("visible"),n.addClass("visible")})}.bind(this)))},close:function(t){t.preventDefault();var n=function(e){return/blackout/.test(e.selector)?e:e.closest(".clearing-blackout")}(e(this)),r,s;return this===t.target&&n&&(r=n.find("div:first"),s=r.find(".visible-img"),i.prev_index=0,n.find("ul[data-clearing]").attr("style",""),n.removeClass("clearing-blackout"),r.removeClass("clearing-container"),s.hide()),!1},keydown:function(t){var n=e(".clearing-blackout").find("ul[data-clearing]");t.which===39&&s.go(n,"next"),t.which===37&&s.go(n,"prev"),t.which===27&&e("a.clearing-close").trigger("click")},nav:function(t,n){var r=e(".clearing-blackout").find("ul[data-clearing]");t.preventDefault(),this.go(r,n)},resize:function(){var t=e(".clearing-blackout .visible-img").find("img");t.length>0&&s.center(t)},fix_height:function(t){var n=t.siblings();n.each(function(){var t=e(this),n=t.find("img");t.height()>n.outerHeight()&&t.addClass("fix-height")}).closest("ul").width(n.length*100+"%")},update_paddles:function(e){var t=e.closest(".carousel").siblings(".visible-img");e.next().length>0?t.find(".clearing-main-right").removeClass("disabled"):t.find(".clearing-main-right").addClass("disabled"),e.prev().length>0?t.find(".clearing-main-left").removeClass("disabled"):t.find(".clearing-main-left").addClass("disabled")},load:function(e){var t=e.parent().attr("href");return this.preload(e),t?t:e.attr("src")},preload:function(e){this.img(e.closest("li").next()),this.img(e.closest("li").prev())},img:function(e){if(e.length>0){var t=new Image,n=e.find("a");n.length>0?t.src=n.attr("href"):t.src=e.find("img").attr("src")}},caption:function(e,t){var n=t.data("caption");n?e.text(n).show():e.text("").hide()},go:function(e,t){var n=e.find(".visible"),r=n[t]();r.length>0&&r.find("img").trigger("click",[n,r])},shift:function(e,t,n){var r=t.parent(),s=i.prev_index,o=this.direction(r,e,t),u=parseInt(r.css("left"),10),a=t.outerWidth(),f;t.index()!==s&&!/skip/.test(o)?/left/.test(o)?(this.lock(),r.animate({left:u+a},300,this.unlock)):/right/.test(o)&&(this.lock(),r.animate({left:u-a},300,this.unlock)):/skip/.test(o)&&(f=t.index()-i.up_count,this.lock(),f>0?r.animate({left:-(f*a)},300,this.unlock):r.animate({left:0},300,this.unlock)),n()},lock:function(){i.locked=!0},unlock:function(){i.locked=!1},locked:function(){return i.locked},direction:function(t,n,r){var s=t.find("li"),o=s.outerWidth()+s.outerWidth()/4,u=Math.floor(e(".clearing-container").outerWidth()/o)-1,a=s.index(r),f;return i.up_count=u,this.adjacent(i.prev_index,a)?a>u&&a>i.prev_index?f="right":a>u-1&&a<=i.prev_index?f="left":f=!1:f="skip",i.prev_index=a,f},adjacent:function(e,t){for(var n=t+1;n>=t-1;n--)if(n===e)return!0;return!1},center:function(e){e.css({marginLeft:-(e.outerWidth()/2),marginTop:-(e.outerHeight()/2)})},outerHTML:function(e){return e.outerHTML||(new XMLSerializer).serializeToString(e)}};e.fn.foundationClearing=function(t){if(s[t])return s[t].apply(this,Array.prototype.slice.call(arguments,1));if(typeof t=="object"||!t)return s.init.apply(this,arguments);e.error("Method "+t+" does not exist on jQuery.foundationClearing")},function(e){e.fn.loaded=function(t,n){function o(){s-=1,!s&&t()}function u(){this.one("load",o);if(e.browser.msie){var t=this.attr("src"),n=t.match(/\?/)?"&":"?";n+=r.cachePrefix+"="+(new Date).getTime(),this.attr("src",t+n)}}var r=e.extend({},e.fn.loaded.defaults,n),i=this.find("img").add(this.filter("img")),s=i.length;return i.each(function(){var t=e(this);if(!t.attr("src")){o();return}this.complete||this.readyState===4?o():u.call(t)})},e.fn.loaded.defaults={cachePrefix:"random"}}(jQuery)})(jQuery,this,this.document);
/*
 * jQuery Foundation Magellan 0.1.0
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
/*jslint unparam: true, browser: true, indent: 2 */
(function(e,t,n){"use strict";e.fn.foundationMagellan=function(n){var r=e(t),i=e(document),s=e("[data-magellan-expedition=fixed]"),o={threshold:s.length?s.outerHeight(!0):0,activeClass:"active"},n=e.extend({},o,n);i.on("magellan.arrival","[data-magellan-arrival]",function(t){var r=e(this),i=r.closest("[data-magellan-expedition]"),s=i.attr("data-magellan-active-class")||n.activeClass;r.closest("[data-magellan-expedition]").find("[data-magellan-arrival]").not(this).removeClass(s),r.addClass(s)});var u=e("[data-magellan-expedition]");u.find("[data-magellan-arrival]:first").addClass(u.attr("data-magellan-active-class")||n.activeClass),s.on("magellan.update-position",function(){var t=e(this);t.data("magellan-fixed-position",""),t.data("magellan-top-offset","")}).trigger("magellan.update-position"),r.on("resize.magellan",function(){s.trigger("magellan.update-position")}),r.on("scroll.magellan",function(){var t=r.scrollTop();s.each(function(){var r=e(this);r.data("magellan-top-offset")===""&&r.data("magellan-top-offset",r.offset().top);var i=t+n.threshold>r.data("magellan-top-offset");r.data("magellan-fixed-position")!=i&&(r.data("magellan-fixed-position",i),i?r.css({position:"fixed",top:0}):r.css({position:"",top:""}))})});var a=e("[data-magellan-destination]:last");a.length>0&&r.on("scroll.magellan",function(t){var s=r.scrollTop(),o=s+r.outerHeight(!0),u=Math.ceil(a.offset().top);e("[data-magellan-destination]").each(function(){var t=e(this),r=t.attr("data-magellan-destination"),a=t.offset().top-s;a<=n.threshold&&e("[data-magellan-arrival="+r+"]").trigger("magellan.arrival"),o>=i.outerHeight(!0)&&u>s&&u<o&&e("[data-magellan-arrival]:last").trigger("magellan.arrival")})})}})(jQuery,this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.core.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */

(function(f,e){function i(a,m){var l=a.nodeName.toLowerCase();if("area"===l){var k=a.parentNode,j=k.name,d;return !a.href||!j||k.nodeName.toLowerCase()!=="map"?!1:(d=f("img[usemap=#"+j+"]")[0],!!d&&h(d))}return(/input|select|textarea|button|object/.test(l)?!a.disabled:"a"==l?a.href||m:m)&&h(a)}function h(a){return !f(a).parents().andSelf().filter(function(){return f.curCSS(this,"visibility")==="hidden"||f.expr.filters.hidden(this)}).length}f.ui=f.ui||{};if(f.ui.version){return}f.extend(f.ui,{version:"1.8.23",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),f.fn.extend({propAttr:f.fn.prop||f.fn.attr,_focus:f.fn.focus,focus:function(a,d){return typeof a=="number"?this.each(function(){var b=this;setTimeout(function(){f(b).focus(),d&&d.call(b)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;return f.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?a=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(f.curCSS(this,"position",1))&&/(auto|scroll)/.test(f.curCSS(this,"overflow",1)+f.curCSS(this,"overflow-y",1)+f.curCSS(this,"overflow-x",1))}).eq(0):a=this.parents().filter(function(){return/(auto|scroll)/.test(f.curCSS(this,"overflow",1)+f.curCSS(this,"overflow-y",1)+f.curCSS(this,"overflow-x",1))}).eq(0),/fixed/.test(this.css("position"))||!a.length?f(document):a},zIndex:function(k){if(k!==e){return this.css("zIndex",k)}if(this.length){var j=f(this[0]),b,a;while(j.length&&j[0]!==document){b=j.css("position");if(b==="absolute"||b==="relative"||b==="fixed"){a=parseInt(j.css("zIndex"),10);if(!isNaN(a)&&a!==0){return a}}j=j.parent()}}return 0},disableSelection:function(){return this.bind((f.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(b){b.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),f("<a>").outerWidth(1).jquery||f.each(["Width","Height"],function(m,l){function a(n,q,p,o){return f.each(k,function(){q-=parseFloat(f.curCSS(n,"padding"+this,!0))||0,p&&(q-=parseFloat(f.curCSS(n,"border"+this+"Width",!0))||0),o&&(q-=parseFloat(f.curCSS(n,"margin"+this,!0))||0)}),q}var k=l==="Width"?["Left","Right"]:["Top","Bottom"],j=l.toLowerCase(),b={innerWidth:f.fn.innerWidth,innerHeight:f.fn.innerHeight,outerWidth:f.fn.outerWidth,outerHeight:f.fn.outerHeight};f.fn["inner"+l]=function(d){return d===e?b["inner"+l].call(this):this.each(function(){f(this).css(j,a(this,d)+"px")})},f.fn["outer"+l]=function(d,n){return typeof d!="number"?b["outer"+l].call(this,d):this.each(function(){f(this).css(j,a(this,d,!0,n)+"px")})}}),f.extend(f.expr[":"],{data:f.expr.createPseudo?f.expr.createPseudo(function(a){return function(b){return !!f.data(b,a)}}):function(a,k,j){return !!f.data(a,j[3])},focusable:function(a){return i(a,!isNaN(f.attr(a,"tabindex")))},tabbable:function(a){var j=f.attr(a,"tabindex"),c=isNaN(j);return(c||j>=0)&&i(a,!c)}}),f(function(){var a=document.body,d=a.appendChild(d=document.createElement("div"));d.offsetHeight,f.extend(d.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),f.support.minHeight=d.offsetHeight===100,f.support.selectstart="onselectstart" in d,a.removeChild(d).style.display="none"}),f.curCSS||(f.curCSS=f.css),f.extend(f.ui,{plugin:{add:function(a,m,l){var k=f.ui[a].prototype;for(var j in l){k.plugins[j]=k.plugins[j]||[],k.plugins[j].push([m,l[j]])}},call:function(k,j,n){var m=k.plugins[j];if(!m||!k.element[0].parentNode){return}for(var l=0;l<m.length;l++){k.options[m[l][0]]&&m[l][1].apply(k.element,n)}}},contains:function(d,c){return document.compareDocumentPosition?d.compareDocumentPosition(c)&16:d!==c&&d.contains(c)},hasScroll:function(a,l){if(f(a).css("overflow")==="hidden"){return !1}var k=l&&l==="left"?"scrollLeft":"scrollTop",j=!1;return a[k]>0?!0:(a[k]=1,j=a[k]>0,a[k]=0,j)},isOverAxis:function(j,d,k){return j>d&&j<d+k},isOver:function(a,n,m,l,k,j){return f.ui.isOverAxis(a,m,k)&&f.ui.isOverAxis(n,l,j)}})})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.widget.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(f,e){if(f.cleanData){var i=f.cleanData;f.cleanData=function(a){for(var k=0,j;(j=a[k])!=null;k++){try{f(j).triggerHandler("remove")}catch(c){}}i(a)}}else{var h=f.fn.remove;f.fn.remove=function(a,d){return this.each(function(){return d||(!a||f.filter(a,[this]).length)&&f("*",this).add([this]).each(function(){try{f(this).triggerHandler("remove")}catch(c){}}),h.call(f(this),a,d)})}}f.widget=function(a,n,m){var l=a.split(".")[0],k;a=a.split(".")[1],k=l+"-"+a,m||(m=n,n=f.Widget),f.expr[":"][k]=function(b){return !!f.data(b,a)},f[l]=f[l]||{},f[l][a]=function(d,c){arguments.length&&this._createWidget(d,c)};var j=new n;j.options=f.extend(!0,{},j.options),f[l][a].prototype=f.extend(!0,j,{namespace:l,widgetName:a,widgetEventPrefix:f[l][a].prototype.widgetEventPrefix||a,widgetBaseClass:k},m),f.widget.bridge(a,f[l][a])},f.widget.bridge=function(b,a){f.fn[b]=function(k){var j=typeof k=="string",d=Array.prototype.slice.call(arguments,1),c=this;return k=!j&&d.length?f.extend.apply(null,[!0,k].concat(d)):k,j&&k.charAt(0)==="_"?c:(j?this.each(function(){var m=f.data(this,b),l=m&&f.isFunction(m[k])?m[k].apply(m,d):m;if(l!==m&&l!==e){return c=l,!1}}):this.each(function(){var l=f.data(this,b);l?l.option(k||{})._init():f.data(this,b,new a(k,this))}),c)}},f.Widget=function(d,c){arguments.length&&this._createWidget(d,c)},f.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(a,k){f.data(k,this.widgetName,this),this.element=f(k),this.options=f.extend(!0,{},this.options,this._getCreateOptions(),a);var j=this;this.element.bind("remove."+this.widgetName,function(){j.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return f.metadata&&f.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(j,b){var a=j;if(arguments.length===0){return f.extend({},this.options)}if(typeof j=="string"){if(b===e){return this.options[j]}a={},a[j]=b}return this._setOptions(a),this},_setOptions:function(a){var d=this;return f.each(a,function(j,c){d._setOption(j,c)}),this},_setOption:function(d,c){return this.options[d]=c,d==="disabled"&&this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(a,n,m){var l,k,j=this.options[a];m=m||{},n=f.Event(n),n.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase(),n.target=this.element[0],k=n.originalEvent;if(k){for(l in k){l in n||(n[l]=k[l])}}return this.element.trigger(n,m),!(f.isFunction(j)&&j.call(this.element[0],n,m)===!1||n.isDefaultPrevented())}}})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.mouse.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(e,d){var f=!1;e(document).mouseup(function(b){f=!1}),e.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(b){return a._mouseDown(b)}).bind("click."+this.widgetName,function(b){if(!0===e.data(b.target,a.widgetName+".preventClickEvent")){return e.removeData(b.target,a.widgetName+".preventClickEvent"),b.stopImmediatePropagation(),!1}}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(a){if(f){return}this._mouseStarted&&this._mouseUp(a),this._mouseDownEvent=a;var i=this,h=a.which==1,c=typeof this.options.cancel=="string"&&a.target.nodeName?e(a.target).closest(this.options.cancel).length:!1;if(!h||c||!this._mouseCapture(a)){return !0}this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=this._mouseStart(a)!==!1;if(!this._mouseStarted){return a.preventDefault(),!0}}return !0===e.data(a.target,this.widgetName+".preventClickEvent")&&e.removeData(a.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(b){return i._mouseMove(b)},this._mouseUpDelegate=function(b){return i._mouseUp(b)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),a.preventDefault(),f=!0,!0},_mouseMove:function(a){return !e.browser.msie||document.documentMode>=9||!!a.button?this._mouseStarted?(this._mouseDrag(a),a.preventDefault()):(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==!1,this._mouseStarted?this._mouseDrag(a):this._mouseUp(a)),!this._mouseStarted):this._mouseUp(a)},_mouseUp:function(a){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,a.target==this._mouseDownEvent.target&&e.data(a.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(a)),!1},_mouseDistanceMet:function(b){return Math.max(Math.abs(this._mouseDownEvent.pageX-b.pageX),Math.abs(this._mouseDownEvent.pageY-b.pageY))>=this.options.distance},_mouseDelayMet:function(b){return this.mouseDelayMet},_mouseStart:function(b){},_mouseDrag:function(b){},_mouseStop:function(b){},_mouseCapture:function(b){return !0}})})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.position.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(j,i){j.ui=j.ui||{};var p=/left|center|right/,o=/top|center|bottom/,n="center",m={},l=j.fn.position,k=j.fn.offset;j.fn.position=function(c){if(!c||!c.of){return l.apply(this,arguments)}c=j.extend({},c);var r=j(c.of),q=r[0],f=(c.collision||"flip").split(" "),e=c.offset?c.offset.split(" "):[0,0],d,a,s;return q.nodeType===9?(d=r.width(),a=r.height(),s={top:0,left:0}):q.setTimeout?(d=r.width(),a=r.height(),s={top:r.scrollTop(),left:r.scrollLeft()}):q.preventDefault?(c.at="left top",d=a=0,s={top:c.of.pageY,left:c.of.pageX}):(d=r.outerWidth(),a=r.outerHeight(),s=r.offset()),j.each(["my","at"],function(){var b=(c[this]||"").split(" ");b.length===1&&(b=p.test(b[0])?b.concat([n]):o.test(b[0])?[n].concat(b):[n,n]),b[0]=p.test(b[0])?b[0]:n,b[1]=o.test(b[1])?b[1]:n,c[this]=b}),f.length===1&&(f[1]=f[0]),e[0]=parseInt(e[0],10)||0,e.length===1&&(e[1]=e[0]),e[1]=parseInt(e[1],10)||0,c.at[0]==="right"?s.left+=d:c.at[0]===n&&(s.left+=d/2),c.at[1]==="bottom"?s.top+=a:c.at[1]===n&&(s.top+=a/2),s.left+=e[0],s.top+=e[1],this.each(function(){var A=j(this),z=A.outerWidth(),y=A.outerHeight(),x=parseInt(j.curCSS(this,"marginLeft",!0))||0,w=parseInt(j.curCSS(this,"marginTop",!0))||0,v=z+x+(parseInt(j.curCSS(this,"marginRight",!0))||0),u=y+w+(parseInt(j.curCSS(this,"marginBottom",!0))||0),t=j.extend({},s),b;c.my[0]==="right"?t.left-=z:c.my[0]===n&&(t.left-=z/2),c.my[1]==="bottom"?t.top-=y:c.my[1]===n&&(t.top-=y/2),m.fractions||(t.left=Math.round(t.left),t.top=Math.round(t.top)),b={left:t.left-x,top:t.top-w},j.each(["left","top"],function(B,h){j.ui.position[f[B]]&&j.ui.position[f[B]][h](t,{targetWidth:d,targetHeight:a,elemWidth:z,elemHeight:y,collisionPosition:b,collisionWidth:v,collisionHeight:u,offset:e,my:c.my,at:c.at})}),j.fn.bgiframe&&A.bgiframe(),A.offset(j.extend(t,{using:c.using}))})},j.ui.position={fit:{left:function(a,q){var h=j(window),f=q.collisionPosition.left+q.collisionWidth-h.width()-h.scrollLeft();a.left=f>0?a.left-f:Math.max(a.left-q.collisionPosition.left,a.left)},top:function(a,q){var h=j(window),f=q.collisionPosition.top+q.collisionHeight-h.height()-h.scrollTop();a.top=f>0?a.top-f:Math.max(a.top-q.collisionPosition.top,a.top)}},flip:{left:function(a,u){if(u.at[0]===n){return}var t=j(window),s=u.collisionPosition.left+u.collisionWidth-t.width()-t.scrollLeft(),r=u.my[0]==="left"?-u.elemWidth:u.my[0]==="right"?u.elemWidth:0,q=u.at[0]==="left"?u.targetWidth:-u.targetWidth,e=-2*u.offset[0];a.left+=u.collisionPosition.left<0?r+q+e:s>0?r+q+e:0},top:function(a,u){if(u.at[1]===n){return}var t=j(window),s=u.collisionPosition.top+u.collisionHeight-t.height()-t.scrollTop(),r=u.my[1]==="top"?-u.elemHeight:u.my[1]==="bottom"?u.elemHeight:0,q=u.at[1]==="top"?u.targetHeight:-u.targetHeight,e=-2*u.offset[1];a.top+=u.collisionPosition.top<0?r+q+e:s>0?r+q+e:0}}},j.offset.setOffset||(j.offset.setOffset=function(a,v){/static/.test(j.curCSS(a,"position"))&&(a.style.position="relative");var u=j(a),t=u.offset(),s=parseInt(j.curCSS(a,"top",!0),10)||0,r=parseInt(j.curCSS(a,"left",!0),10)||0,q={top:v.top-t.top+s,left:v.left-t.left+r};"using" in v?v.using.call(a,q):u.css(q)},j.fn.offset=function(a){var d=this[0];return !d||!d.ownerDocument?null:a?j.isFunction(a)?this.each(function(b){j(this).offset(a.call(this,b,j(this).offset()))}):this.each(function(){j.offset.setOffset(this,a)}):k.call(this)}),j.curCSS||(j.curCSS=j.css),function(){var a=document.getElementsByTagName("body")[0],v=document.createElement("div"),u,t,s,r,q;u=document.createElement(a?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},a&&j.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(var f in s){u.style[f]=s[f]}u.appendChild(v),t=a||document.documentElement,t.insertBefore(u,t.firstChild),v.style.cssText="position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;",r=j(v).offset(function(d,c){return c}).offset(),u.innerHTML="",t.removeChild(u),q=r.top+r.left+(a?2000:0),m.fractions=q>21&&q<22}()})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.draggable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(d,c){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},destroy:function(){if(!this.element.data("draggable")){return}return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy(),this},_mouseCapture:function(a){var e=this.options;return this.helper||e.disabled||d(a.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(a),this.handle?(e.iframeFix&&d(e.iframeFix===!0?"iframe":e.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(d(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(a){var e=this.options;return this.helper=this._createHelper(a),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),d.ui.ddmanager&&(d.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(a),this.originalPageX=a.pageX,this.originalPageY=a.pageY,e.cursorAt&&this._adjustOffsetFromHelper(e.cursorAt),e.containment&&this._setContainment(),this._trigger("start",a)===!1?(this._clear(),!1):(this._cacheHelperProportions(),d.ui.ddmanager&&!e.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a),this._mouseDrag(a,!0),d.ui.ddmanager&&d.ui.ddmanager.dragStart(this,a),!0)},_mouseDrag:function(a,f){this.position=this._generatePosition(a),this.positionAbs=this._convertPositionTo("absolute");if(!f){var e=this._uiHash();if(this._trigger("drag",a,e)===!1){return this._mouseUp({}),!1}this.position=e.position}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}return d.ui.ddmanager&&d.ui.ddmanager.drag(this,a),!1},_mouseStop:function(a){var k=!1;d.ui.ddmanager&&!this.options.dropBehaviour&&(k=d.ui.ddmanager.drop(this,a)),this.dropped&&(k=this.dropped,this.dropped=!1);var j=this.element[0],i=!1;while(j&&(j=j.parentNode)){j==document&&(i=!0)}if(!i&&this.options.helper==="original"){return !1}if(this.options.revert=="invalid"&&!k||this.options.revert=="valid"&&k||this.options.revert===!0||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,k)){var h=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){h._trigger("stop",a)!==!1&&h._clear()})}else{this._trigger("stop",a)!==!1&&this._clear()}return !1},_mouseUp:function(a){return this.options.iframeFix===!0&&d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),d.ui.ddmanager&&d.ui.ddmanager.dragStop(this,a),d.ui.mouse.prototype._mouseUp.call(this,a)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(a){var e=!this.options.handle||!d(this.options.handle,this.element).length?!0:!1;return d(this.options.handle,this.element).find("*").andSelf().each(function(){this==a.target&&(e=!0)}),e},_createHelper:function(a){var f=this.options,e=d.isFunction(f.helper)?d(f.helper.apply(this.element[0],[a])):f.helper=="clone"?this.element.clone().removeAttr("id"):this.element;return e.parents("body").length||e.appendTo(f.appendTo=="parent"?this.element[0].parentNode:f.appendTo),e[0]!=this.element[0]&&!/(fixed|absolute)/.test(e.css("position"))&&e.css("position","absolute"),e},_adjustOffsetFromHelper:function(a){typeof a=="string"&&(a=a.split(" ")),d.isArray(a)&&(a={left:+a[0],top:+a[1]||0}),"left" in a&&(this.offset.click.left=a.left+this.margins.left),"right" in a&&(this.offset.click.left=this.helperProportions.width-a.right+this.margins.left),"top" in a&&(this.offset.click.top=a.top+this.margins.top),"bottom" in a&&(this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(a.left+=this.scrollParent.scrollLeft(),a.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie){a={top:0,left:0}}return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var b=this.element.position();return{top:b.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:b.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;a.containment=="parent"&&(a.containment=this.helper[0].parentNode);if(a.containment=="document"||a.containment=="window"){this.containment=[a.containment=="document"?0:d(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,a.containment=="document"?0:d(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(a.containment=="document"?0:d(window).scrollLeft())+d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){var k=d(a.containment),j=k[0];if(!j){return}var i=k.offset(),h=d(j).css("overflow")!="hidden";this.containment=[(parseInt(d(j).css("borderLeftWidth"),10)||0)+(parseInt(d(j).css("paddingLeft"),10)||0),(parseInt(d(j).css("borderTopWidth"),10)||0)+(parseInt(d(j).css("paddingTop"),10)||0),(h?Math.max(j.scrollWidth,j.offsetWidth):j.offsetWidth)-(parseInt(d(j).css("borderLeftWidth"),10)||0)-(parseInt(d(j).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(h?Math.max(j.scrollHeight,j.offsetHeight):j.offsetHeight)-(parseInt(d(j).css("borderTopWidth"),10)||0)-(parseInt(d(j).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=k}else{a.containment.constructor==Array&&(this.containment=a.containment)}},_convertPositionTo:function(a,l){l||(l=this.position);var k=a=="absolute"?1:-1,j=this.options,i=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,h=/(html|body)/i.test(i[0].tagName);return{top:l.top+this.offset.relative.top*k+this.offset.parent.top*k-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():h?0:i.scrollTop())*k),left:l.left+this.offset.relative.left*k+this.offset.parent.left*k-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():h?0:i.scrollLeft())*k)}},_generatePosition:function(t){var s=this.options,r=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,q=/(html|body)/i.test(r[0].tagName),p=t.pageX,o=t.pageY;if(this.originalPosition){var n;if(this.containment){if(this.relative_container){var m=this.relative_container.offset();n=[this.containment[0]+m.left,this.containment[1]+m.top,this.containment[2]+m.left,this.containment[3]+m.top]}else{n=this.containment}t.pageX-this.offset.click.left<n[0]&&(p=n[0]+this.offset.click.left),t.pageY-this.offset.click.top<n[1]&&(o=n[1]+this.offset.click.top),t.pageX-this.offset.click.left>n[2]&&(p=n[2]+this.offset.click.left),t.pageY-this.offset.click.top>n[3]&&(o=n[3]+this.offset.click.top)}if(s.grid){var l=s.grid[1]?this.originalPageY+Math.round((o-this.originalPageY)/s.grid[1])*s.grid[1]:this.originalPageY;o=n?l-this.offset.click.top<n[1]||l-this.offset.click.top>n[3]?l-this.offset.click.top<n[1]?l+s.grid[1]:l-s.grid[1]:l:l;var a=s.grid[0]?this.originalPageX+Math.round((p-this.originalPageX)/s.grid[0])*s.grid[0]:this.originalPageX;p=n?a-this.offset.click.left<n[0]||a-this.offset.click.left>n[2]?a-this.offset.click.left<n[0]?a+s.grid[0]:a-s.grid[0]:a:a}}return{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():q?0:r.scrollTop()),left:p-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():q?0:r.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(a,f,e){return e=e||this._uiHash(),d.ui.plugin.call(this,a,[f,e]),a=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),d.Widget.prototype._trigger.call(this,a,f,e)},plugins:{},_uiHash:function(b){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),d.extend(d.ui.draggable,{version:"1.8.23"}),d.ui.plugin.add("draggable","connectToSortable",{start:function(a,k){var j=d(this).data("draggable"),i=j.options,h=d.extend({},k,{item:j.element});j.sortables=[],d(i.connectToSortable).each(function(){var b=d.data(this,"sortable");b&&!b.options.disabled&&(j.sortables.push({instance:b,shouldRevert:b.options.revert}),b.refreshPositions(),b._trigger("activate",a,h))})},stop:function(a,i){var h=d(this).data("draggable"),f=d.extend({},i,{item:h.element});d.each(h.sortables,function(){this.instance.isOver?(this.instance.isOver=0,h.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(a),this.instance.options.helper=this.instance.options._helper,h.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",a,f))})},drag:function(a,k){var j=d(this).data("draggable"),i=this,h=function(t){var s=this.offset.click.top,r=this.offset.click.left,q=this.positionAbs.top,p=this.positionAbs.left,o=t.height,n=t.width,m=t.top,l=t.left;return d.ui.isOver(q+s,p+r,m,l,o,n)};d.each(j.sortables,function(b){this.instance.positionAbs=j.positionAbs,this.instance.helperProportions=j.helperProportions,this.instance.offset.click=j.offset.click,this.instance._intersectsWith(this.instance.containerCache)?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=d(i).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return k.helper[0]},a.target=this.instance.currentItem[0],this.instance._mouseCapture(a,!0),this.instance._mouseStart(a,!0,!0),this.instance.offset.click.top=j.offset.click.top,this.instance.offset.click.left=j.offset.click.left,this.instance.offset.parent.left-=j.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=j.offset.parent.top-this.instance.offset.parent.top,j._trigger("toSortable",a),j.dropped=this.instance.element,j.currentItem=j.element,this.instance.fromOutside=j),this.instance.currentItem&&this.instance._mouseDrag(a)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",a,this.instance._uiHash(this.instance)),this.instance._mouseStop(a,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),j._trigger("fromSortable",a),j.dropped=!1)})}}),d.ui.plugin.add("draggable","cursor",{start:function(a,i){var h=d("body"),f=d(this).data("draggable").options;h.css("cursor")&&(f._cursor=h.css("cursor")),h.css("cursor",f.cursor)},stop:function(a,f){var e=d(this).data("draggable").options;e._cursor&&d("body").css("cursor",e._cursor)}}),d.ui.plugin.add("draggable","opacity",{start:function(a,i){var h=d(i.helper),f=d(this).data("draggable").options;h.css("opacity")&&(f._opacity=h.css("opacity")),h.css("opacity",f.opacity)},stop:function(a,f){var e=d(this).data("draggable").options;e._opacity&&d(f.helper).css("opacity",e._opacity)}}),d.ui.plugin.add("draggable","scroll",{start:function(a,f){var e=d(this).data("draggable");e.scrollParent[0]!=document&&e.scrollParent[0].tagName!="HTML"&&(e.overflowOffset=e.scrollParent.offset())},drag:function(a,k){var j=d(this).data("draggable"),i=j.options,h=!1;if(j.scrollParent[0]!=document&&j.scrollParent[0].tagName!="HTML"){if(!i.axis||i.axis!="x"){j.overflowOffset.top+j.scrollParent[0].offsetHeight-a.pageY<i.scrollSensitivity?j.scrollParent[0].scrollTop=h=j.scrollParent[0].scrollTop+i.scrollSpeed:a.pageY-j.overflowOffset.top<i.scrollSensitivity&&(j.scrollParent[0].scrollTop=h=j.scrollParent[0].scrollTop-i.scrollSpeed)}if(!i.axis||i.axis!="y"){j.overflowOffset.left+j.scrollParent[0].offsetWidth-a.pageX<i.scrollSensitivity?j.scrollParent[0].scrollLeft=h=j.scrollParent[0].scrollLeft+i.scrollSpeed:a.pageX-j.overflowOffset.left<i.scrollSensitivity&&(j.scrollParent[0].scrollLeft=h=j.scrollParent[0].scrollLeft-i.scrollSpeed)}}else{if(!i.axis||i.axis!="x"){a.pageY-d(document).scrollTop()<i.scrollSensitivity?h=d(document).scrollTop(d(document).scrollTop()-i.scrollSpeed):d(window).height()-(a.pageY-d(document).scrollTop())<i.scrollSensitivity&&(h=d(document).scrollTop(d(document).scrollTop()+i.scrollSpeed))}if(!i.axis||i.axis!="y"){a.pageX-d(document).scrollLeft()<i.scrollSensitivity?h=d(document).scrollLeft(d(document).scrollLeft()-i.scrollSpeed):d(window).width()-(a.pageX-d(document).scrollLeft())<i.scrollSensitivity&&(h=d(document).scrollLeft(d(document).scrollLeft()+i.scrollSpeed))}}h!==!1&&d.ui.ddmanager&&!i.dropBehaviour&&d.ui.ddmanager.prepareOffsets(j,a)}}),d.ui.plugin.add("draggable","snap",{start:function(a,i){var h=d(this).data("draggable"),f=h.options;h.snapElements=[],d(f.snap.constructor!=String?f.snap.items||":data(draggable)":f.snap).each(function(){var e=d(this),j=e.offset();this!=h.element[0]&&h.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:j.top,left:j.left})})},drag:function(L,K){var J=d(this).data("draggable"),I=J.options,H=I.snapTolerance,G=K.offset.left,F=G+J.helperProportions.width,E=K.offset.top,D=E+J.helperProportions.height;for(var C=J.snapElements.length-1;C>=0;C--){var B=J.snapElements[C].left,A=B+J.snapElements[C].width,z=J.snapElements[C].top,y=z+J.snapElements[C].height;if(!(B-H<G&&G<A+H&&z-H<E&&E<y+H||B-H<G&&G<A+H&&z-H<D&&D<y+H||B-H<F&&F<A+H&&z-H<E&&E<y+H||B-H<F&&F<A+H&&z-H<D&&D<y+H)){J.snapElements[C].snapping&&J.options.snap.release&&J.options.snap.release.call(J.element,L,d.extend(J._uiHash(),{snapItem:J.snapElements[C].item})),J.snapElements[C].snapping=!1;continue}if(I.snapMode!="inner"){var x=Math.abs(z-D)<=H,w=Math.abs(y-E)<=H,v=Math.abs(B-F)<=H,u=Math.abs(A-G)<=H;x&&(K.position.top=J._convertPositionTo("relative",{top:z-J.helperProportions.height,left:0}).top-J.margins.top),w&&(K.position.top=J._convertPositionTo("relative",{top:y,left:0}).top-J.margins.top),v&&(K.position.left=J._convertPositionTo("relative",{top:0,left:B-J.helperProportions.width}).left-J.margins.left),u&&(K.position.left=J._convertPositionTo("relative",{top:0,left:A}).left-J.margins.left)}var a=x||w||v||u;if(I.snapMode!="outer"){var x=Math.abs(z-E)<=H,w=Math.abs(y-D)<=H,v=Math.abs(B-G)<=H,u=Math.abs(A-F)<=H;x&&(K.position.top=J._convertPositionTo("relative",{top:z,left:0}).top-J.margins.top),w&&(K.position.top=J._convertPositionTo("relative",{top:y-J.helperProportions.height,left:0}).top-J.margins.top),v&&(K.position.left=J._convertPositionTo("relative",{top:0,left:B}).left-J.margins.left),u&&(K.position.left=J._convertPositionTo("relative",{top:0,left:A-J.helperProportions.width}).left-J.margins.left)}!J.snapElements[C].snapping&&(x||w||v||u||a)&&J.options.snap.snap&&J.options.snap.snap.call(J.element,L,d.extend(J._uiHash(),{snapItem:J.snapElements[C].item})),J.snapElements[C].snapping=x||w||v||u||a}}}),d.ui.plugin.add("draggable","stack",{start:function(a,k){var j=d(this).data("draggable").options,i=d.makeArray(d(j.stack)).sort(function(e,f){return(parseInt(d(e).css("zIndex"),10)||0)-(parseInt(d(f).css("zIndex"),10)||0)});if(!i.length){return}var h=parseInt(i[0].style.zIndex)||0;d(i).each(function(b){this.style.zIndex=h+b}),this[0].style.zIndex=h+i.length}}),d.ui.plugin.add("draggable","zIndex",{start:function(a,i){var h=d(i.helper),f=d(this).data("draggable").options;h.css("zIndex")&&(f._zIndex=h.css("zIndex")),h.css("zIndex",f.zIndex)},stop:function(a,f){var e=d(this).data("draggable").options;e._zIndex&&d(f.helper).css("zIndex",e._zIndex)}})})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.droppable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(d,c){d.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect"},_create:function(){var a=this.options,e=a.accept;this.isover=0,this.isout=1,this.accept=d.isFunction(e)?e:function(b){return b.is(e)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},d.ui.ddmanager.droppables[a.scope]=d.ui.ddmanager.droppables[a.scope]||[],d.ui.ddmanager.droppables[a.scope].push(this),a.addClasses&&this.element.addClass("ui-droppable")},destroy:function(){var a=d.ui.ddmanager.droppables[this.options.scope];for(var e=0;e<a.length;e++){a[e]==this&&a.splice(e,1)}return this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"),this},_setOption:function(a,e){a=="accept"&&(this.accept=d.isFunction(e)?e:function(b){return b.is(e)}),d.Widget.prototype._setOption.apply(this,arguments)},_activate:function(a){var e=d.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),e&&this._trigger("activate",a,this.ui(e))},_deactivate:function(a){var e=d.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),e&&this._trigger("deactivate",a,this.ui(e))},_over:function(a){var e=d.ui.ddmanager.current;if(!e||(e.currentItem||e.element)[0]==this.element[0]){return}this.accept.call(this.element[0],e.currentItem||e.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",a,this.ui(e)))},_out:function(a){var e=d.ui.ddmanager.current;if(!e||(e.currentItem||e.element)[0]==this.element[0]){return}this.accept.call(this.element[0],e.currentItem||e.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",a,this.ui(e)))},_drop:function(a,i){var h=i||d.ui.ddmanager.current;if(!h||(h.currentItem||h.element)[0]==this.element[0]){return !1}var f=!1;return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var e=d.data(this,"droppable");if(e.options.greedy&&!e.options.disabled&&e.options.scope==h.options.scope&&e.accept.call(e.element[0],h.currentItem||h.element)&&d.ui.intersect(h,d.extend(e,{offset:e.element.offset()}),e.options.tolerance)){return f=!0,!1}}),f?!1:this.accept.call(this.element[0],h.currentItem||h.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",a,this.ui(h)),this.element):!1},ui:function(b){return{draggable:b.currentItem||b.element,helper:b.helper,position:b.position,offset:b.positionAbs}}}),d.extend(d.ui.droppable,{version:"1.8.23"}),d.ui.intersect=function(B,A,z){if(!A.offset){return !1}var y=(B.positionAbs||B.position.absolute).left,x=y+B.helperProportions.width,w=(B.positionAbs||B.position.absolute).top,v=w+B.helperProportions.height,u=A.offset.left,t=u+A.proportions.width,s=A.offset.top,r=s+A.proportions.height;switch(z){case"fit":return u<=y&&x<=t&&s<=w&&v<=r;case"intersect":return u<y+B.helperProportions.width/2&&x-B.helperProportions.width/2<t&&s<w+B.helperProportions.height/2&&v-B.helperProportions.height/2<r;case"pointer":var q=(B.positionAbs||B.position.absolute).left+(B.clickOffset||B.offset.click).left,p=(B.positionAbs||B.position.absolute).top+(B.clickOffset||B.offset.click).top,a=d.ui.isOver(p,q,s,u,A.proportions.height,A.proportions.width);return a;case"touch":return(w>=s&&w<=r||v>=s&&v<=r||w<s&&v>r)&&(y>=u&&y<=t||x>=u&&x<=t||y<u&&x>t);default:return !1}},d.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(a,o){var n=d.ui.ddmanager.droppables[a.options.scope]||[],m=o?o.type:null,l=(a.currentItem||a.element).find(":data(droppable)").andSelf();g:for(var k=0;k<n.length;k++){if(n[k].options.disabled||a&&!n[k].accept.call(n[k].element[0],a.currentItem||a.element)){continue}for(var j=0;j<l.length;j++){if(l[j]==n[k].element[0]){n[k].proportions.height=0;continue g}}n[k].visible=n[k].element.css("display")!="none";if(!n[k].visible){continue}m=="mousedown"&&n[k]._activate.call(n[k],o),n[k].offset=n[k].element.offset(),n[k].proportions={width:n[k].element[0].offsetWidth,height:n[k].element[0].offsetHeight}}},drop:function(a,f){var e=!1;return d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(!this.options){return}!this.options.disabled&&this.visible&&d.ui.intersect(a,this,this.options.tolerance)&&(e=this._drop.call(this,f)||e),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],a.currentItem||a.element)&&(this.isout=1,this.isover=0,this._deactivate.call(this,f))}),e},dragStart:function(a,e){a.element.parents(":not(body,html)").bind("scroll.droppable",function(){a.options.refreshPositions||d.ui.ddmanager.prepareOffsets(a,e)})},drag:function(a,e){a.options.refreshPositions&&d.ui.ddmanager.prepareOffsets(a,e),d.each(d.ui.ddmanager.droppables[a.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible){return}var j=d.ui.intersect(a,this,this.options.tolerance),i=!j&&this.isover==1?"isout":j&&this.isover==0?"isover":null;if(!i){return}var h;if(this.options.greedy){var b=this.element.parents(":data(droppable):eq(0)");b.length&&(h=d.data(b[0],"droppable"),h.greedyChild=i=="isover"?1:0)}h&&i=="isover"&&(h.isover=0,h.isout=1,h._out.call(h,e)),this[i]=1,this[i=="isout"?"isover":"isout"]=0,this[i=="isover"?"_over":"_out"].call(this,e),h&&i=="isout"&&(h.isout=0,h.isover=1,h._over.call(h,e))})},dragStop:function(a,e){a.element.parents(":not(body,html)").unbind("scroll.droppable"),a.options.refreshPositions||d.ui.ddmanager.prepareOffsets(a,e)}}})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.sortable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(d,c){d.widget("ui.sortable",d.ui.mouse,{widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1000},_create:function(){var b=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?b.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},destroy:function(){d.Widget.prototype.destroy.call(this),this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var a=this.items.length-1;a>=0;a--){this.items[a].item.removeData(this.widgetName+"-item")}return this},_setOption:function(a,e){a==="disabled"?(this.options[a]=e,this.widget()[e?"addClass":"removeClass"]("ui-sortable-disabled")):d.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(a,n){var m=this;if(this.reverting){return !1}if(this.options.disabled||this.options.type=="static"){return !1}this._refreshItems(a);var l=null,k=this,j=d(a.target).parents().each(function(){if(d.data(this,m.widgetName+"-item")==k){return l=d(this),!1}});d.data(a.target,m.widgetName+"-item")==k&&(l=d(a.target));if(!l){return !1}if(this.options.handle&&!n){var i=!1;d(this.options.handle,l).find("*").andSelf().each(function(){this==a.target&&(i=!0)});if(!i){return !1}}return this.currentItem=l,this._removeCurrentsFromItems(),!0},_mouseStart:function(a,l,k){var j=this.options,i=this;this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(a),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(a),this.originalPageX=a.pageX,this.originalPageY=a.pageY,j.cursorAt&&this._adjustOffsetFromHelper(j.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!=this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),j.containment&&this._setContainment(),j.cursor&&(d("body").css("cursor")&&(this._storedCursor=d("body").css("cursor")),d("body").css("cursor",j.cursor)),j.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",j.opacity)),j.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",j.zIndex)),this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",a,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions();if(!k){for(var h=this.containers.length-1;h>=0;h--){this.containers[h]._trigger("activate",a,i._uiHash(this))}}return d.ui.ddmanager&&(d.ui.ddmanager.current=this),d.ui.ddmanager&&!j.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(a),!0},_mouseDrag:function(a){this.position=this._generatePosition(a),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs);if(this.options.scroll){var n=this.options,m=!1;this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-a.pageY<n.scrollSensitivity?this.scrollParent[0].scrollTop=m=this.scrollParent[0].scrollTop+n.scrollSpeed:a.pageY-this.overflowOffset.top<n.scrollSensitivity&&(this.scrollParent[0].scrollTop=m=this.scrollParent[0].scrollTop-n.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-a.pageX<n.scrollSensitivity?this.scrollParent[0].scrollLeft=m=this.scrollParent[0].scrollLeft+n.scrollSpeed:a.pageX-this.overflowOffset.left<n.scrollSensitivity&&(this.scrollParent[0].scrollLeft=m=this.scrollParent[0].scrollLeft-n.scrollSpeed)):(a.pageY-d(document).scrollTop()<n.scrollSensitivity?m=d(document).scrollTop(d(document).scrollTop()-n.scrollSpeed):d(window).height()-(a.pageY-d(document).scrollTop())<n.scrollSensitivity&&(m=d(document).scrollTop(d(document).scrollTop()+n.scrollSpeed)),a.pageX-d(document).scrollLeft()<n.scrollSensitivity?m=d(document).scrollLeft(d(document).scrollLeft()-n.scrollSpeed):d(window).width()-(a.pageX-d(document).scrollLeft())<n.scrollSensitivity&&(m=d(document).scrollLeft(d(document).scrollLeft()+n.scrollSpeed))),m!==!1&&d.ui.ddmanager&&!n.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}for(var l=this.items.length-1;l>=0;l--){var k=this.items[l],j=k.item[0],i=this._intersectsWithPointer(k);if(!i){continue}if(j!=this.currentItem[0]&&this.placeholder[i==1?"next":"prev"]()[0]!=j&&!d.ui.contains(this.placeholder[0],j)&&(this.options.type=="semi-dynamic"?!d.ui.contains(this.element[0],j):!0)){this.direction=i==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(k)){this._rearrange(a,k)}else{break}this._trigger("change",a,this._uiHash());break}}return this._contactContainers(a),d.ui.ddmanager&&d.ui.ddmanager.drag(this,a),this._trigger("sort",a,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(a,i){if(!a){return}d.ui.ddmanager&&!this.options.dropBehaviour&&d.ui.ddmanager.drop(this,a);if(this.options.revert){var h=this,f=h.placeholder.offset();h.reverting=!0,d(this.helper).animate({left:f.left-this.offset.parent.left-h.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:f.top-this.offset.parent.top-h.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){h._clear(a)})}else{this._clear(a,i)}return !1},cancel:function(){var a=this;if(this.dragging){this._mouseUp({target:null}),this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--){this.containers[e]._trigger("deactivate",null,a._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,a._uiHash(this)),this.containers[e].containerCache.over=0)}}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),d.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?d(this.domPosition.prev).after(this.currentItem):d(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(a){var f=this._getItemsAsjQuery(a&&a.connected),e=[];return a=a||{},d(f).each(function(){var b=(d(a.item||this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);b&&e.push((a.key||b[1]+"[]")+"="+(a.key&&a.expression?b[1]:b[2]))}),!e.length&&a.key&&e.push(a.key+"="),e.join("&")},toArray:function(a){var f=this._getItemsAsjQuery(a&&a.connected),e=[];return a=a||{},f.each(function(){e.push(d(a.item||this).attr(a.attribute||"id")||"")}),e},_intersectsWith:function(x){var w=this.positionAbs.left,v=w+this.helperProportions.width,u=this.positionAbs.top,t=u+this.helperProportions.height,s=x.left,r=s+x.width,q=x.top,p=q+x.height,o=this.offset.click.top,n=this.offset.click.left,m=u+o>q&&u+o<p&&w+n>s&&w+n<r;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>x[this.floating?"width":"height"]?m:s<w+this.helperProportions.width/2&&v-this.helperProportions.width/2<r&&q<u+this.helperProportions.height/2&&t-this.helperProportions.height/2<p},_intersectsWithPointer:function(a){var l=this.options.axis==="x"||d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top,a.height),k=this.options.axis==="y"||d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left,a.width),j=l&&k,i=this._getDragVerticalDirection(),h=this._getDragHorizontalDirection();return j?this.floating?h&&h=="right"||i=="down"?2:1:i&&(i=="down"?2:1):!1},_intersectsWithSides:function(a){var k=d.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,a.top+a.height/2,a.height),j=d.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,a.left+a.width/2,a.width),i=this._getDragVerticalDirection(),h=this._getDragHorizontalDirection();return this.floating&&h?h=="right"&&j||h=="left"&&!j:i&&(i=="down"&&k||i=="up"&&!k)},_getDragVerticalDirection:function(){var b=this.positionAbs.top-this.lastPositionAbs.top;return b!=0&&(b>0?"down":"up")},_getDragHorizontalDirection:function(){var b=this.positionAbs.left-this.lastPositionAbs.left;return b!=0&&(b>0?"right":"left")},refresh:function(b){return this._refreshItems(b),this.refreshPositions(),this},_connectWith:function(){var b=this.options;return b.connectWith.constructor==String?[b.connectWith]:b.connectWith},_getItemsAsjQuery:function(r){var q=this,p=[],o=[],n=this._connectWith();if(n&&r){for(var m=n.length-1;m>=0;m--){var l=d(n[m]);for(var k=l.length-1;k>=0;k--){var a=d.data(l[k],this.widgetName);a&&a!=this&&!a.options.disabled&&o.push([d.isFunction(a.options.items)?a.options.items.call(a.element):d(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a])}}}o.push([d.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):d(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(var m=o.length-1;m>=0;m--){o[m][0].each(function(){p.push(this)})}return d(p)},_removeCurrentsFromItems:function(){var f=this.currentItem.find(":data("+this.widgetName+"-item)");for(var e=0;e<this.items.length;e++){for(var h=0;h<f.length;h++){f[h]==this.items[e].item[0]&&this.items.splice(e,1)}}},_refreshItems:function(z){this.items=[],this.containers=[this];var y=this.items,x=this,w=[[d.isFunction(this.options.items)?this.options.items.call(this.element[0],z,{item:this.currentItem}):d(this.options.items,this.element),this]],v=this._connectWith();if(v&&this.ready){for(var u=v.length-1;u>=0;u--){var t=d(v[u]);for(var s=t.length-1;s>=0;s--){var r=d.data(t[s],this.widgetName);r&&r!=this&&!r.options.disabled&&(w.push([d.isFunction(r.options.items)?r.options.items.call(r.element[0],z,{item:this.currentItem}):d(r.options.items,r.element),r]),this.containers.push(r))}}}for(var u=w.length-1;u>=0;u--){var q=w[u][1],p=w[u][0];for(var s=0,o=p.length;s<o;s++){var a=d(p[s]);a.data(this.widgetName+"-item",q),y.push({item:a,instance:q,width:0,height:0,left:0,top:0})}}},refreshPositions:function(a){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());for(var k=this.items.length-1;k>=0;k--){var j=this.items[k];if(j.instance!=this.currentContainer&&this.currentContainer&&j.item[0]!=this.currentItem[0]){continue}var i=this.options.toleranceElement?d(this.options.toleranceElement,j.item):j.item;a||(j.width=i.outerWidth(),j.height=i.outerHeight());var h=i.offset();j.left=h.left,j.top=h.top}if(this.options.custom&&this.options.custom.refreshContainers){this.options.custom.refreshContainers.call(this)}else{for(var k=this.containers.length-1;k>=0;k--){var h=this.containers[k].element.offset();this.containers[k].containerCache.left=h.left,this.containers[k].containerCache.top=h.top,this.containers[k].containerCache.width=this.containers[k].element.outerWidth(),this.containers[k].containerCache.height=this.containers[k].element.outerHeight()}}return this},_createPlaceholder:function(a){var i=a||this,h=i.options;if(!h.placeholder||h.placeholder.constructor==String){var f=h.placeholder;h.placeholder={element:function(){var e=d(document.createElement(i.currentItem[0].nodeName)).addClass(f||i.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];return f||(e.style.visibility="hidden"),e},update:function(j,e){if(f&&!h.forcePlaceholderSize){return}e.height()||e.height(i.currentItem.innerHeight()-parseInt(i.currentItem.css("paddingTop")||0,10)-parseInt(i.currentItem.css("paddingBottom")||0,10)),e.width()||e.width(i.currentItem.innerWidth()-parseInt(i.currentItem.css("paddingLeft")||0,10)-parseInt(i.currentItem.css("paddingRight")||0,10))}}}i.placeholder=d(h.placeholder.element.call(i.element,i.currentItem)),i.currentItem.after(i.placeholder),h.placeholder.update(i,i.placeholder)},_contactContainers:function(r){var q=null,p=null;for(var o=this.containers.length-1;o>=0;o--){if(d.ui.contains(this.currentItem[0],this.containers[o].element[0])){continue}if(this._intersectsWith(this.containers[o].containerCache)){if(q&&d.ui.contains(this.containers[o].element[0],q.element[0])){continue}q=this.containers[o],p=o}else{this.containers[o].containerCache.over&&(this.containers[o]._trigger("out",r,this._uiHash(this)),this.containers[o].containerCache.over=0)}}if(!q){return}if(this.containers.length===1){this.containers[p]._trigger("over",r,this._uiHash(this)),this.containers[p].containerCache.over=1}else{if(this.currentContainer!=this.containers[p]){var n=10000,m=null,l=this.positionAbs[this.containers[p].floating?"left":"top"];for(var k=this.items.length-1;k>=0;k--){if(!d.ui.contains(this.containers[p].element[0],this.items[k].item[0])){continue}var a=this.containers[p].floating?this.items[k].item.offset().left:this.items[k].item.offset().top;Math.abs(a-l)<n&&(n=Math.abs(a-l),m=this.items[k],this.direction=a-l>0?"down":"up")}if(!m&&!this.options.dropOnEmpty){return}this.currentContainer=this.containers[p],m?this._rearrange(r,m,null,!0):this._rearrange(r,null,this.containers[p].element,!0),this._trigger("change",r,this._uiHash()),this.containers[p]._trigger("change",r,this._uiHash(this)),this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",r,this._uiHash(this)),this.containers[p].containerCache.over=1}}},_createHelper:function(a){var f=this.options,e=d.isFunction(f.helper)?d(f.helper.apply(this.element[0],[a,this.currentItem])):f.helper=="clone"?this.currentItem.clone():this.currentItem;return e.parents("body").length||d(f.appendTo!="parent"?f.appendTo:this.currentItem[0].parentNode)[0].appendChild(e[0]),e[0]==this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(e[0].style.width==""||f.forceHelperSize)&&e.width(this.currentItem.width()),(e[0].style.height==""||f.forceHelperSize)&&e.height(this.currentItem.height()),e},_adjustOffsetFromHelper:function(a){typeof a=="string"&&(a=a.split(" ")),d.isArray(a)&&(a={left:+a[0],top:+a[1]||0}),"left" in a&&(this.offset.click.left=a.left+this.margins.left),"right" in a&&(this.offset.click.left=this.helperProportions.width-a.right+this.margins.left),"top" in a&&(this.offset.click.top=a.top+this.margins.top),"bottom" in a&&(this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(a.left+=this.scrollParent.scrollLeft(),a.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie){a={top:0,left:0}}return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var b=this.currentItem.position();return{top:b.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:b.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;a.containment=="parent"&&(a.containment=this.helper[0].parentNode);if(a.containment=="document"||a.containment=="window"){this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!/^(document|window|parent)$/.test(a.containment)){var i=d(a.containment)[0],h=d(a.containment).offset(),f=d(i).css("overflow")!="hidden";this.containment=[h.left+(parseInt(d(i).css("borderLeftWidth"),10)||0)+(parseInt(d(i).css("paddingLeft"),10)||0)-this.margins.left,h.top+(parseInt(d(i).css("borderTopWidth"),10)||0)+(parseInt(d(i).css("paddingTop"),10)||0)-this.margins.top,h.left+(f?Math.max(i.scrollWidth,i.offsetWidth):i.offsetWidth)-(parseInt(d(i).css("borderLeftWidth"),10)||0)-(parseInt(d(i).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,h.top+(f?Math.max(i.scrollHeight,i.offsetHeight):i.offsetHeight)-(parseInt(d(i).css("borderTopWidth"),10)||0)-(parseInt(d(i).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(a,l){l||(l=this.position);var k=a=="absolute"?1:-1,j=this.options,i=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,h=/(html|body)/i.test(i[0].tagName);return{top:l.top+this.offset.relative.top*k+this.offset.parent.top*k-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():h?0:i.scrollTop())*k),left:l.left+this.offset.relative.left*k+this.offset.parent.left*k-(d.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():h?0:i.scrollLeft())*k)}},_generatePosition:function(a){var p=this.options,o=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,n=/(html|body)/i.test(o[0].tagName);this.cssPosition=="relative"&&(this.scrollParent[0]==document||this.scrollParent[0]==this.offsetParent[0])&&(this.offset.relative=this._getRelativeOffset());var m=a.pageX,l=a.pageY;if(this.originalPosition){this.containment&&(a.pageX-this.offset.click.left<this.containment[0]&&(m=this.containment[0]+this.offset.click.left),a.pageY-this.offset.click.top<this.containment[1]&&(l=this.containment[1]+this.offset.click.top),a.pageX-this.offset.click.left>this.containment[2]&&(m=this.containment[2]+this.offset.click.left),a.pageY-this.offset.click.top>this.containment[3]&&(l=this.containment[3]+this.offset.click.top));if(p.grid){var k=this.originalPageY+Math.round((l-this.originalPageY)/p.grid[1])*p.grid[1];l=this.containment?k-this.offset.click.top<this.containment[1]||k-this.offset.click.top>this.containment[3]?k-this.offset.click.top<this.containment[1]?k+p.grid[1]:k-p.grid[1]:k:k;var j=this.originalPageX+Math.round((m-this.originalPageX)/p.grid[0])*p.grid[0];m=this.containment?j-this.offset.click.left<this.containment[0]||j-this.offset.click.left>this.containment[2]?j-this.offset.click.left<this.containment[0]?j+p.grid[0]:j-p.grid[0]:j:j}}return{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():n?0:o.scrollTop()),left:m-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():n?0:o.scrollLeft())}},_rearrange:function(i,h,m,l){m?m[0].appendChild(this.placeholder[0]):h.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?h.item[0]:h.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var k=this,j=this.counter;window.setTimeout(function(){j==k.counter&&k.refreshPositions(!l)},0)},_clear:function(a,k){this.reverting=!1;var j=[],i=this;!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var h in this._storedCSS){if(this._storedCSS[h]=="auto"||this._storedCSS[h]=="static"){this._storedCSS[h]=""}}this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else{this.currentItem.show()}this.fromOutside&&!k&&j.push(function(b){this._trigger("receive",b,this._uiHash(this.fromOutside))}),(this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!k&&j.push(function(b){this._trigger("update",b,this._uiHash())});if(!d.ui.contains(this.element[0],this.currentItem[0])){k||j.push(function(b){this._trigger("remove",b,this._uiHash())});for(var h=this.containers.length-1;h>=0;h--){d.ui.contains(this.containers[h].element[0],this.currentItem[0])&&!k&&(j.push(function(b){return function(e){b._trigger("receive",e,this._uiHash(this))}}.call(this,this.containers[h])),j.push(function(b){return function(e){b._trigger("update",e,this._uiHash(this))}}.call(this,this.containers[h])))}}for(var h=this.containers.length-1;h>=0;h--){k||j.push(function(b){return function(e){b._trigger("deactivate",e,this._uiHash(this))}}.call(this,this.containers[h])),this.containers[h].containerCache.over&&(j.push(function(b){return function(e){b._trigger("out",e,this._uiHash(this))}}.call(this,this.containers[h])),this.containers[h].containerCache.over=0)}this._storedCursor&&d("body").css("cursor",this._storedCursor),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex),this.dragging=!1;if(this.cancelHelperRemoval){if(!k){this._trigger("beforeStop",a,this._uiHash());for(var h=0;h<j.length;h++){j[h].call(this,a)}this._trigger("stop",a,this._uiHash())}return this.fromOutside=!1,!1}k||this._trigger("beforeStop",a,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!=this.currentItem[0]&&this.helper.remove(),this.helper=null;if(!k){for(var h=0;h<j.length;h++){j[h].call(this,a)}this._trigger("stop",a,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){d.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(a){var e=a||this;return{helper:e.helper,placeholder:e.placeholder||d([]),position:e.position,originalPosition:e.originalPosition,offset:e.positionAbs,item:e.currentItem,sender:a?a.element:null}}}),d.extend(d.ui.sortable,{version:"1.8.23"})})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.accordion.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(d,c){d.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:!0,clearStyle:!1,collapsible:!1,event:"click",fillSpace:!1,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:!1,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}},_create:function(){var a=this,i=a.options;a.running=0,a.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix"),a.headers=a.element.find(i.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){if(i.disabled){return}d(this).addClass("ui-state-hover")}).bind("mouseleave.accordion",function(){if(i.disabled){return}d(this).removeClass("ui-state-hover")}).bind("focus.accordion",function(){if(i.disabled){return}d(this).addClass("ui-state-focus")}).bind("blur.accordion",function(){if(i.disabled){return}d(this).removeClass("ui-state-focus")}),a.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");if(i.navigation){var h=a.element.find("a").filter(i.navigationFilter).eq(0);if(h.length){var f=h.closest(".ui-accordion-header");f.length?a.active=f:a.active=h.closest(".ui-accordion-content").prev()}}a.active=a._findActive(a.active||i.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top"),a.active.next().addClass("ui-accordion-content-active"),a._createIcons(),a.resize(),a.element.attr("role","tablist"),a.headers.attr("role","tab").bind("keydown.accordion",function(b){return a._keydown(b)}).next().attr("role","tabpanel"),a.headers.not(a.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide(),a.active.length?a.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}):a.headers.eq(0).attr("tabIndex",0),d.browser.safari||a.headers.find("a").attr("tabIndex",-1),i.event&&a.headers.bind(i.event.split(" ").join(".accordion ")+".accordion",function(b){a._clickHandler.call(a,b,this),b.preventDefault()})},_createIcons:function(){var a=this.options;a.icons&&(d("<span></span>").addClass("ui-icon "+a.icons.header).prependTo(this.headers),this.active.children(".ui-icon").toggleClass(a.icons.header).toggleClass(a.icons.headerSelected),this.element.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.children(".ui-icon").remove(),this.element.removeClass("ui-accordion-icons")},destroy:function(){var a=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex"),this.headers.find("a").removeAttr("tabIndex"),this._destroyIcons();var e=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");return(a.autoHeight||a.fillHeight)&&e.css("height",""),d.Widget.prototype.destroy.call(this)},_setOption:function(a,e){d.Widget.prototype._setOption.apply(this,arguments),a=="active"&&this.activate(e),a=="icons"&&(this._destroyIcons(),e&&this._createIcons()),a=="disabled"&&this.headers.add(this.headers.next())[e?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled")},_keydown:function(a){if(this.options.disabled||a.altKey||a.ctrlKey){return}var k=d.ui.keyCode,j=this.headers.length,i=this.headers.index(a.target),h=!1;switch(a.keyCode){case k.RIGHT:case k.DOWN:h=this.headers[(i+1)%j];break;case k.LEFT:case k.UP:h=this.headers[(i-1+j)%j];break;case k.SPACE:case k.ENTER:this._clickHandler({target:a.target},a.target),a.preventDefault()}return h?(d(a.target).attr("tabIndex",-1),d(h).attr("tabIndex",0),h.focus(),!1):!0},resize:function(){var a=this.options,f;if(a.fillSpace){if(d.browser.msie){var e=this.element.parent().css("overflow");this.element.parent().css("overflow","hidden")}f=this.element.parent().height(),d.browser.msie&&this.element.parent().css("overflow",e),this.headers.each(function(){f-=d(this).outerHeight(!0)}),this.headers.next().each(function(){d(this).height(Math.max(0,f-d(this).innerHeight()+d(this).height()))}).css("overflow","auto")}else{a.autoHeight&&(f=0,this.headers.next().each(function(){f=Math.max(f,d(this).height("").height())}).height(f))}return this},activate:function(f){this.options.active=f;var e=this._findActive(f)[0];return this._clickHandler({target:e},e),this},_findActive:function(a){return a?typeof a=="number"?this.headers.filter(":eq("+a+")"):this.headers.not(this.headers.not(a)):a===!1?d([]):this.headers.filter(":eq(0)")},_clickHandler:function(t,s){var r=this.options;if(r.disabled){return}if(!t.target){if(!r.collapsible){return}this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(r.icons.headerSelected).addClass(r.icons.header),this.active.next().addClass("ui-accordion-content-active");var q=this.active.next(),p={options:r,newHeader:d([]),oldHeader:r.active,newContent:d([]),oldContent:q},o=this.active=d([]);this._toggle(o,q,p);return}var n=d(t.currentTarget||s),m=n[0]===this.active[0];r.active=r.collapsible&&m?!1:this.headers.index(n);if(this.running||!r.collapsible&&m){return}var l=this.active,o=n.next(),q=this.active.next(),p={options:r,newHeader:m&&r.collapsible?d([]):n,oldHeader:this.active,newContent:m&&r.collapsible?d([]):o,oldContent:q},a=this.headers.index(this.active[0])>this.headers.index(n[0]);this.active=m?d([]):n,this._toggle(o,q,p,m,a),l.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(r.icons.headerSelected).addClass(r.icons.header),m||(n.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(r.icons.header).addClass(r.icons.headerSelected),n.next().addClass("ui-accordion-content-active"));return},_toggle:function(x,w,v,u,t){var s=this,r=s.options;s.toShow=x,s.toHide=w,s.data=v;var q=function(){if(!s){return}return s._completed.apply(s,arguments)};s._trigger("changestart",null,s.data),s.running=w.size()===0?x.size():w.size();if(r.animated){var p={};r.collapsible&&u?p={toShow:d([]),toHide:w,complete:q,down:t,autoHeight:r.autoHeight||r.fillSpace}:p={toShow:x,toHide:w,complete:q,down:t,autoHeight:r.autoHeight||r.fillSpace},r.proxied||(r.proxied=r.animated),r.proxiedDuration||(r.proxiedDuration=r.duration),r.animated=d.isFunction(r.proxied)?r.proxied(p):r.proxied,r.duration=d.isFunction(r.proxiedDuration)?r.proxiedDuration(p):r.proxiedDuration;var o=d.ui.accordion.animations,n=r.duration,a=r.animated;a&&!o[a]&&!d.easing[a]&&(a="slide"),o[a]||(o[a]=function(b){this.slide(b,{easing:a,duration:n||700})}),o[a](p)}else{r.collapsible&&u?x.toggle():(w.hide(),x.show()),q(!0)}w.prev().attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).blur(),x.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus()},_completed:function(b){this.running=b?0:--this.running;if(this.running){return}this.options.clearStyle&&this.toShow.add(this.toHide).css({height:"",overflow:""}),this.toHide.removeClass("ui-accordion-content-active"),this.toHide.length&&(this.toHide.parent()[0].className=this.toHide.parent()[0].className),this._trigger("change",null,this.data)}}),d.extend(d.ui.accordion,{version:"1.8.23",animations:{slide:function(r,q){r=d.extend({easing:"swing",duration:300},r,q);if(!r.toHide.size()){r.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},r);return}if(!r.toShow.size()){r.toHide.animate({height:"hide",paddingTop:"hide",paddingBottom:"hide"},r);return}var p=r.toShow.css("overflow"),o=0,n={},m={},l=["height","paddingTop","paddingBottom"],k,a=r.toShow;k=a[0].style.width,a.width(a.parent().width()-parseFloat(a.css("paddingLeft"))-parseFloat(a.css("paddingRight"))-(parseFloat(a.css("borderLeftWidth"))||0)-(parseFloat(a.css("borderRightWidth"))||0)),d.each(l,function(h,f){m[f]="hide";var b=(""+d.css(r.toShow[0],f)).match(/^([\d+-.]+)(.*)$/);n[f]={value:b[1],unit:b[2]||"px"}}),r.toShow.css({height:0,overflow:"hidden"}).show(),r.toHide.filter(":hidden").each(r.complete).end().filter(":visible").animate(m,{step:function(b,e){e.prop=="height"&&(o=e.end-e.start===0?0:(e.now-e.start)/(e.end-e.start)),r.toShow[0].style[e.prop]=o*n[e.prop].value+n[e.prop].unit},duration:r.duration,easing:r.easing,complete:function(){r.autoHeight||r.toShow.css("height",""),r.toShow.css({width:k,overflow:p}),r.complete()}})},bounceslide:function(b){this.slide(b,{easing:b.down?"easeOutBounce":"swing",duration:b.down?1000:200})}}})})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.slider.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(e,d){var f=5;e.widget("ui.slider",e.ui.mouse,{widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null},_create:function(){var a=this,n=this.options,m=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),l="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",k=n.values&&n.values.length||1,j=[];this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"+(n.disabled?" ui-slider-disabled ui-disabled":"")),this.range=e([]),n.range&&(n.range===!0&&(n.values||(n.values=[this._valueMin(),this._valueMin()]),n.values.length&&n.values.length!==2&&(n.values=[n.values[0],n.values[0]])),this.range=e("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(n.range==="min"||n.range==="max"?" ui-slider-range-"+n.range:"")));for(var c=m.length;c<k;c+=1){j.push(l)}this.handles=m.add(e(j.join("")).appendTo(a.element)),this.handle=this.handles.eq(0),this.handles.add(this.range).filter("a").click(function(b){b.preventDefault()}).hover(function(){n.disabled||e(this).addClass("ui-state-hover")},function(){e(this).removeClass("ui-state-hover")}).focus(function(){n.disabled?e(this).blur():(e(".ui-slider .ui-state-focus").removeClass("ui-state-focus"),e(this).addClass("ui-state-focus"))}).blur(function(){e(this).removeClass("ui-state-focus")}),this.handles.each(function(h){e(this).data("index.ui-slider-handle",h)}),this.handles.keydown(function(s){var r=e(this).data("index.ui-slider-handle"),q,p,o,b;if(a.options.disabled){return}switch(s.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:s.preventDefault();if(!a._keySliding){a._keySliding=!0,e(this).addClass("ui-state-active"),q=a._start(s,r);if(q===!1){return}}}b=a.options.step,a.options.values&&a.options.values.length?p=o=a.values(r):p=o=a.value();switch(s.keyCode){case e.ui.keyCode.HOME:o=a._valueMin();break;case e.ui.keyCode.END:o=a._valueMax();break;case e.ui.keyCode.PAGE_UP:o=a._trimAlignValue(p+(a._valueMax()-a._valueMin())/f);break;case e.ui.keyCode.PAGE_DOWN:o=a._trimAlignValue(p-(a._valueMax()-a._valueMin())/f);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(p===a._valueMax()){return}o=a._trimAlignValue(p+b);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(p===a._valueMin()){return}o=a._trimAlignValue(p-b)}a._slide(s,r,o)}).keyup(function(h){var b=e(this).data("index.ui-slider-handle");a._keySliding&&(a._keySliding=!1,a._stop(h,b),a._change(h,b),e(this).removeClass("ui-state-active"))}),this._refreshValue(),this._animateOff=!1},destroy:function(){return this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider"),this._mouseDestroy(),this},_mouseCapture:function(v){var u=this.options,t,s,r,q,p,o,n,m,a;return u.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),t={x:v.pageX,y:v.pageY},s=this._normValueFromMouse(t),r=this._valueMax()-this._valueMin()+1,p=this,this.handles.each(function(h){var i=Math.abs(s-p.values(h));r>i&&(r=i,q=e(this),o=h)}),u.range===!0&&this.values(1)===u.min&&(o+=1,q=e(this.handles[o])),n=this._start(v,o),n===!1?!1:(this._mouseSliding=!0,p._handleIndex=o,q.addClass("ui-state-active").focus(),m=q.offset(),a=!e(v.target).parents().andSelf().is(".ui-slider-handle"),this._clickOffset=a?{left:0,top:0}:{left:v.pageX-m.left-q.width()/2,top:v.pageY-m.top-q.height()/2-(parseInt(q.css("borderTopWidth"),10)||0)-(parseInt(q.css("borderBottomWidth"),10)||0)+(parseInt(q.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(v,o,s),this._animateOff=!0,!0))},_mouseStart:function(b){return !0},_mouseDrag:function(i){var h={x:i.pageX,y:i.pageY},j=this._normValueFromMouse(h);return this._slide(i,this._handleIndex,j),!1},_mouseStop:function(b){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(b,this._handleIndex),this._change(b,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(i){var h,m,l,k,j;return this.orientation==="horizontal"?(h=this.elementSize.width,m=i.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(h=this.elementSize.height,m=i.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),l=m/h,l>1&&(l=1),l<0&&(l=0),this.orientation==="vertical"&&(l=1-l),k=this._valueMax()-this._valueMin(),j=this._valueMin()+l*k,this._trimAlignValue(j)},_start:function(i,h){var j={handle:this.handles[h],value:this.value()};return this.options.values&&this.options.values.length&&(j.value=this.values(h),j.values=this.values()),this._trigger("start",i,j)},_slide:function(i,h,m){var l,k,j;this.options.values&&this.options.values.length?(l=this.values(h?0:1),this.options.values.length===2&&this.options.range===!0&&(h===0&&m>l||h===1&&m<l)&&(m=l),m!==this.values(h)&&(k=this.values(),k[h]=m,j=this._trigger("slide",i,{handle:this.handles[h],value:m,values:k}),l=this.values(h?0:1),j!==!1&&this.values(h,m,!0))):m!==this.value()&&(j=this._trigger("slide",i,{handle:this.handles[h],value:m}),j!==!1&&this.value(m))},_stop:function(i,h){var j={handle:this.handles[h],value:this.value()};this.options.values&&this.options.values.length&&(j.value=this.values(h),j.values=this.values()),this._trigger("stop",i,j)},_change:function(i,h){if(!this._keySliding&&!this._mouseSliding){var j={handle:this.handles[h],value:this.value()};this.options.values&&this.options.values.length&&(j.value=this.values(h),j.values=this.values()),this._trigger("change",i,j)}},value:function(b){if(arguments.length){this.options.value=this._trimAlignValue(b),this._refreshValue(),this._change(null,0);return}return this._value()},values:function(a,k){var j,i,h;if(arguments.length>1){this.options.values[a]=this._trimAlignValue(k),this._refreshValue(),this._change(null,a);return}if(!arguments.length){return this._values()}if(!e.isArray(arguments[0])){return this.options.values&&this.options.values.length?this._values(a):this.value()}j=this.options.values,i=arguments[0];for(h=0;h<j.length;h+=1){j[h]=this._trimAlignValue(i[h]),this._change(null,h)}this._refreshValue()},_setOption:function(a,j){var i,h=0;e.isArray(this.options.values)&&(h=this.options.values.length),e.Widget.prototype._setOption.apply(this,arguments);switch(a){case"disabled":j?(this.handles.filter(".ui-state-focus").blur(),this.handles.removeClass("ui-state-hover"),this.handles.propAttr("disabled",!0),this.element.addClass("ui-disabled")):(this.handles.propAttr("disabled",!1),this.element.removeClass("ui-disabled"));break;case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":this._animateOff=!0,this._refreshValue();for(i=0;i<h;i+=1){this._change(null,i)}this._animateOff=!1}},_value:function(){var b=this.options.value;return b=this._trimAlignValue(b),b},_values:function(i){var h,k,j;if(arguments.length){return h=this.options.values[i],h=this._trimAlignValue(h),h}k=this.options.values.slice();for(j=0;j<k.length;j+=1){k[j]=this._trimAlignValue(k[j])}return k},_trimAlignValue:function(i){if(i<=this._valueMin()){return this._valueMin()}if(i>=this._valueMax()){return this._valueMax()}var h=this.options.step>0?this.options.step:1,k=(i-this._valueMin())%h,j=i-k;return Math.abs(k)*2>=h&&(j+=k>0?h:-h),parseFloat(j.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var t=this.options.range,s=this.options,r=this,q=this._animateOff?!1:s.animate,p,o={},n,m,l,a;this.options.values&&this.options.values.length?this.handles.each(function(c,h){p=(r.values(c)-r._valueMin())/(r._valueMax()-r._valueMin())*100,o[r.orientation==="horizontal"?"left":"bottom"]=p+"%",e(this).stop(1,1)[q?"animate":"css"](o,s.animate),r.options.range===!0&&(r.orientation==="horizontal"?(c===0&&r.range.stop(1,1)[q?"animate":"css"]({left:p+"%"},s.animate),c===1&&r.range[q?"animate":"css"]({width:p-n+"%"},{queue:!1,duration:s.animate})):(c===0&&r.range.stop(1,1)[q?"animate":"css"]({bottom:p+"%"},s.animate),c===1&&r.range[q?"animate":"css"]({height:p-n+"%"},{queue:!1,duration:s.animate}))),n=p}):(m=this.value(),l=this._valueMin(),a=this._valueMax(),p=a!==l?(m-l)/(a-l)*100:0,o[r.orientation==="horizontal"?"left":"bottom"]=p+"%",this.handle.stop(1,1)[q?"animate":"css"](o,s.animate),t==="min"&&this.orientation==="horizontal"&&this.range.stop(1,1)[q?"animate":"css"]({width:p+"%"},s.animate),t==="max"&&this.orientation==="horizontal"&&this.range[q?"animate":"css"]({width:100-p+"%"},{queue:!1,duration:s.animate}),t==="min"&&this.orientation==="vertical"&&this.range.stop(1,1)[q?"animate":"css"]({height:p+"%"},s.animate),t==="max"&&this.orientation==="vertical"&&this.range[q?"animate":"css"]({height:100-p+"%"},{queue:!1,duration:s.animate}))}}),e.extend(e.ui.slider,{version:"1.8.23"})})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.tabs.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(i,h){function k(){return ++m}function j(){return ++l}var m=0,l=0;i.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:!1,cookie:null,collapsible:!1,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(!0)},_setOption:function(d,c){if(d=="selected"){if(this.options.collapsible&&c==this.options.selected){return}this.select(c)}else{this.options[d]=c,this._tabify()}},_tabId:function(b){return b.title&&b.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+k()},_sanitizeSelector:function(b){return b.replace(/:/g,"\\:")},_cookie:function(){var a=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+j());return i.cookie.apply(null,[a].concat(i.makeArray(arguments)))},_ui:function(d,c){return{tab:d,panel:c,index:this.anchors.index(d)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var a=i(this);a.html(a.data("label.tabs")).removeData("label.tabs")})},_tabify:function(z){function p(d,e){d.css("display",""),!i.support.opacity&&e.opacity&&d[0].style.removeAttribute("filter")}var y=this,x=this.options,w=/^#.+/;this.list=this.element.find("ol,ul").eq(0),this.lis=i(" > li:has(a[href])",this.list),this.anchors=this.lis.map(function(){return i("a",this)[0]}),this.panels=i([]),this.anchors.each(function(d,B){var A=i(B).attr("href"),o=A.split("#")[0],n;o&&(o===location.toString().split("#")[0]||(n=i("base")[0])&&o===n.href)&&(A=B.hash,B.href=A);if(w.test(A)){y.panels=y.panels.add(y.element.find(y._sanitizeSelector(A)))}else{if(A&&A!=="#"){i.data(B,"href.tabs",A),i.data(B,"load.tabs",A.replace(/#.*$/,""));var f=y._tabId(B);B.href="#"+f;var e=y.element.find("#"+f);e.length||(e=i(x.panelTemplate).attr("id",f).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(y.panels[d-1]||y.list),e.data("destroy.tabs",!0)),y.panels=y.panels.add(e)}else{x.disabled.push(d)}}}),z?(this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all"),this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.lis.addClass("ui-state-default ui-corner-top"),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom"),x.selected===h?(location.hash&&this.anchors.each(function(d,c){if(c.hash==location.hash){return x.selected=d,!1}}),typeof x.selected!="number"&&x.cookie&&(x.selected=parseInt(y._cookie(),10)),typeof x.selected!="number"&&this.lis.filter(".ui-tabs-selected").length&&(x.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"))),x.selected=x.selected||(this.lis.length?0:-1)):x.selected===null&&(x.selected=-1),x.selected=x.selected>=0&&this.anchors[x.selected]||x.selected<0?x.selected:0,x.disabled=i.unique(x.disabled.concat(i.map(this.lis.filter(".ui-state-disabled"),function(d,c){return y.lis.index(d)}))).sort(),i.inArray(x.selected,x.disabled)!=-1&&x.disabled.splice(i.inArray(x.selected,x.disabled),1),this.panels.addClass("ui-tabs-hide"),this.lis.removeClass("ui-tabs-selected ui-state-active"),x.selected>=0&&this.anchors.length&&(y.element.find(y._sanitizeSelector(y.anchors[x.selected].hash)).removeClass("ui-tabs-hide"),this.lis.eq(x.selected).addClass("ui-tabs-selected ui-state-active"),y.element.queue("tabs",function(){y._trigger("show",null,y._ui(y.anchors[x.selected],y.element.find(y._sanitizeSelector(y.anchors[x.selected].hash))[0]))}),this.load(x.selected)),i(window).bind("unload",function(){y.lis.add(y.anchors).unbind(".tabs"),y.lis=y.anchors=y.panels=null})):x.selected=this.lis.index(this.lis.filter(".ui-tabs-selected")),this.element[x.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible"),x.cookie&&this._cookie(x.selected,x.cookie);for(var v=0,u;u=this.lis[v];v++){i(u)[i.inArray(v,x.disabled)!=-1&&!i(u).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled")}x.cache===!1&&this.anchors.removeData("cache.tabs"),this.lis.add(this.anchors).unbind(".tabs");if(x.event!=="mouseover"){var t=function(d,c){c.is(":not(.ui-state-disabled)")&&c.addClass("ui-state-"+d)},s=function(d,c){c.removeClass("ui-state-"+d)};this.lis.bind("mouseover.tabs",function(){t("hover",i(this))}),this.lis.bind("mouseout.tabs",function(){s("hover",i(this))}),this.anchors.bind("focus.tabs",function(){t("focus",i(this).closest("li"))}),this.anchors.bind("blur.tabs",function(){s("focus",i(this).closest("li"))})}var r,q;x.fx&&(i.isArray(x.fx)?(r=x.fx[0],q=x.fx[1]):r=q=x.fx);var b=q?function(d,e){i(d).closest("li").addClass("ui-tabs-selected ui-state-active"),e.hide().removeClass("ui-tabs-hide").animate(q,q.duration||"normal",function(){p(e,q),y._trigger("show",null,y._ui(d,e[0]))})}:function(d,e){i(d).closest("li").addClass("ui-tabs-selected ui-state-active"),e.removeClass("ui-tabs-hide"),y._trigger("show",null,y._ui(d,e[0]))},a=r?function(d,c){c.animate(r,r.duration||"normal",function(){y.lis.removeClass("ui-tabs-selected ui-state-active"),c.addClass("ui-tabs-hide"),p(c,r),y.element.dequeue("tabs")})}:function(e,d,f){y.lis.removeClass("ui-tabs-selected ui-state-active"),d.addClass("ui-tabs-hide"),y.element.dequeue("tabs")};this.anchors.bind(x.event+".tabs",function(){var d=this,o=i(d).closest("li"),n=y.panels.filter(":not(.ui-tabs-hide)"),e=y.element.find(y._sanitizeSelector(d.hash));if(o.hasClass("ui-tabs-selected")&&!x.collapsible||o.hasClass("ui-state-disabled")||o.hasClass("ui-state-processing")||y.panels.filter(":animated").length||y._trigger("select",null,y._ui(this,e[0]))===!1){return this.blur(),!1}x.selected=y.anchors.index(this),y.abort();if(x.collapsible){if(o.hasClass("ui-tabs-selected")){return x.selected=-1,x.cookie&&y._cookie(x.selected,x.cookie),y.element.queue("tabs",function(){a(d,n)}).dequeue("tabs"),this.blur(),!1}if(!n.length){return x.cookie&&y._cookie(x.selected,x.cookie),y.element.queue("tabs",function(){b(d,e)}),y.load(y.anchors.index(this)),this.blur(),!1}}x.cookie&&y._cookie(x.selected,x.cookie);if(e.length){n.length&&y.element.queue("tabs",function(){a(d,n)}),y.element.queue("tabs",function(){b(d,e)}),y.load(y.anchors.index(this))}else{throw"jQuery UI Tabs: Mismatching fragment identifier."}i.browser.msie&&this.blur()}),this.anchors.bind("click.tabs",function(){return !1})},_getIndex:function(b){return typeof b=="string"&&(b=this.anchors.index(this.anchors.filter("[href$='"+b+"']"))),b},destroy:function(){var a=this.options;return this.abort(),this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs"),this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.anchors.each(function(){var d=i.data(this,"href.tabs");d&&(this.href=d);var e=i(this).unbind(".tabs");i.each(["href","load","cache"],function(f,c){e.removeData(c+".tabs")})}),this.lis.unbind(".tabs").add(this.panels).each(function(){i.data(this,"destroy.tabs")?i(this).remove():i(this).removeClass(["ui-state-default","ui-corner-top","ui-tabs-selected","ui-state-active","ui-state-hover","ui-state-focus","ui-state-disabled","ui-tabs-panel","ui-widget-content","ui-corner-bottom","ui-tabs-hide"].join(" "))}),a.cookie&&this._cookie(null,a.cookie),this},add:function(s,r,q){q===h&&(q=this.anchors.length);var p=this,o=this.options,n=i(o.tabTemplate.replace(/#\{href\}/g,s).replace(/#\{label\}/g,r)),b=s.indexOf("#")?this._tabId(i("a",n)[0]):s.replace("#","");n.addClass("ui-state-default ui-corner-top").data("destroy.tabs",!0);var a=p.element.find("#"+b);return a.length||(a=i(o.panelTemplate).attr("id",b).data("destroy.tabs",!0)),a.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"),q>=this.lis.length?(n.appendTo(this.list),a.appendTo(this.list[0].parentNode)):(n.insertBefore(this.lis[q]),a.insertBefore(this.panels[q])),o.disabled=i.map(o.disabled,function(d,c){return d>=q?++d:d}),this._tabify(),this.anchors.length==1&&(o.selected=0,n.addClass("ui-tabs-selected ui-state-active"),a.removeClass("ui-tabs-hide"),this.element.queue("tabs",function(){p._trigger("show",null,p._ui(p.anchors[0],p.panels[0]))}),this.load(0)),this._trigger("add",null,this._ui(this.anchors[q],this.panels[q])),this},remove:function(a){a=this._getIndex(a);var o=this.options,n=this.lis.eq(a).remove(),f=this.panels.eq(a).remove();return n.hasClass("ui-tabs-selected")&&this.anchors.length>1&&this.select(a+(a+1<this.anchors.length?1:-1)),o.disabled=i.map(i.grep(o.disabled,function(b,d){return b!=a}),function(b,d){return b>=a?--b:b}),this._tabify(),this._trigger("remove",null,this._ui(n.find("a")[0],f[0])),this},enable:function(a){a=this._getIndex(a);var d=this.options;if(i.inArray(a,d.disabled)==-1){return}return this.lis.eq(a).removeClass("ui-state-disabled"),d.disabled=i.grep(d.disabled,function(b,e){return b!=a}),this._trigger("enable",null,this._ui(this.anchors[a],this.panels[a])),this},disable:function(e){e=this._getIndex(e);var d=this,f=this.options;return e!=f.selected&&(this.lis.eq(e).addClass("ui-state-disabled"),f.disabled.push(e),f.disabled.sort(),this._trigger("disable",null,this._ui(this.anchors[e],this.panels[e]))),this},select:function(b){b=this._getIndex(b);if(b==-1){if(this.options.collapsible&&this.options.selected!=-1){b=this.options.selected}else{return this}}return this.anchors.eq(b).trigger(this.options.event+".tabs"),this},load:function(a){a=this._getIndex(a);var r=this,q=this.options,p=this.anchors.eq(a)[0],o=i.data(p,"load.tabs");this.abort();if(!o||this.element.queue("tabs").length!==0&&i.data(p,"cache.tabs")){this.element.dequeue("tabs");return}this.lis.eq(a).addClass("ui-state-processing");if(q.spinner){var n=i("span",p);n.data("label.tabs",n.html()).html(q.spinner)}return this.xhr=i.ajax(i.extend({},q.ajaxOptions,{url:o,success:function(d,c){r.element.find(r._sanitizeSelector(p.hash)).html(d),r._cleanup(),q.cache&&i.data(p,"cache.tabs",!0),r._trigger("load",null,r._ui(r.anchors[a],r.panels[a]));try{q.ajaxOptions.success(d,c)}catch(b){}},error:function(b,d,c){r._cleanup(),r._trigger("load",null,r._ui(r.anchors[a],r.panels[a]));try{q.ajaxOptions.error(b,d,a,p)}catch(c){}}})),r.element.dequeue("tabs"),this},abort:function(){return this.element.queue([]),this.panels.stop(!1,!0),this.element.queue("tabs",this.element.queue("tabs").splice(-2,2)),this.xhr&&(this.xhr.abort(),delete this.xhr),this._cleanup(),this},url:function(d,c){return this.anchors.eq(d).removeData("cache.tabs").data("load.tabs",c),this},length:function(){return this.anchors.length}}),i.extend(i.ui.tabs,{version:"1.8.23"}),i.extend(i.ui.tabs.prototype,{rotation:null,rotate:function(o,n){var s=this,r=this.options,q=s._rotate||(s._rotate=function(a){clearTimeout(s.rotation),s.rotation=setTimeout(function(){var b=r.selected;s.select(++b<s.anchors.length?b:0)},o),a&&a.stopPropagation()}),p=s._unrotate||(s._unrotate=n?function(b){q()}:function(b){b.clientX&&s.rotate(null)});return o?(this.element.bind("tabsshow",q),this.anchors.bind(r.event+".tabs",p),q()):(clearTimeout(s.rotation),this.element.unbind("tabsshow",q),this.anchors.unbind(r.event+".tabs",p),delete this._rotate,delete this._unrotate),this}})})(jQuery);
/*! jQuery UI - v1.8.23 - 2012-08-15
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.datepicker.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function($,undefined){function Datepicker(){this.debug=!1,this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},$.extend(this._defaults,this.regional[""]),this.dpDiv=bindHover($('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}function bindHover(a){var b="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return a.bind("mouseout",function(a){var c=$(a.target).closest(b);if(!c.length){return}c.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")}).bind("mouseover",function(c){var d=$(c.target).closest(b);if($.datepicker._isDisabledDatepicker(instActive.inline?a.parent()[0]:instActive.input[0])||!d.length){return}d.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),d.addClass("ui-state-hover"),d.hasClass("ui-datepicker-prev")&&d.addClass("ui-datepicker-prev-hover"),d.hasClass("ui-datepicker-next")&&d.addClass("ui-datepicker-next-hover")})}function extendRemove(a,b){$.extend(a,b);for(var c in b){if(b[c]==null||b[c]==undefined){a[c]=b[c]}}return a}function isArray(a){return a&&($.browser.safari&&typeof a=="object"&&a.length||a.constructor&&a.constructor.toString().match(/\Array\(\)/))}$.extend($.ui,{datepicker:{version:"1.8.23"}});var PROP_NAME="datepicker",dpuuid=(new Date).getTime(),instActive;$.extend(Datepicker.prototype,{markerClassName:"hasDatepicker",maxRows:4,log:function(){this.debug&&console.log.apply("",arguments)},_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(a){return extendRemove(this._defaults,a||{}),this},_attachDatepicker:function(target,settings){var inlineSettings=null;for(var attrName in this._defaults){var attrValue=target.getAttribute("date:"+attrName);if(attrValue){inlineSettings=inlineSettings||{};try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}}var nodeName=target.nodeName.toLowerCase(),inline=nodeName=="div"||nodeName=="span";target.id||(this.uuid+=1,target.id="dp"+this.uuid);var inst=this._newInst($(target),inline);inst.settings=$.extend({},settings||{},inlineSettings||{}),nodeName=="input"?this._connectDatepicker(target,inst):inline&&this._inlineDatepicker(target,inst)},_newInst:function(a,b){var c=a[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1");return{id:c,input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:b,dpDiv:b?bindHover($('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')):this.dpDiv}},_connectDatepicker:function(a,b){var c=$(a);b.append=$([]),b.trigger=$([]);if(c.hasClass(this.markerClassName)){return}this._attachments(c,b),c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(a,c,d){b.settings[c]=d}).bind("getData.datepicker",function(a,c){return this._get(b,c)}),this._autoSize(b),$.data(a,PROP_NAME,b),b.settings.disabled&&this._disableDatepicker(a)},_attachments:function(a,b){var c=this._get(b,"appendText"),d=this._get(b,"isRTL");b.append&&b.append.remove(),c&&(b.append=$('<span class="'+this._appendClass+'">'+c+"</span>"),a[d?"before":"after"](b.append)),a.unbind("focus",this._showDatepicker),b.trigger&&b.trigger.remove();var e=this._get(b,"showOn");(e=="focus"||e=="both")&&a.focus(this._showDatepicker);if(e=="button"||e=="both"){var f=this._get(b,"buttonText"),g=this._get(b,"buttonImage");b.trigger=$(this._get(b,"buttonImageOnly")?$("<img/>").addClass(this._triggerClass).attr({src:g,alt:f,title:f}):$('<button type="button"></button>').addClass(this._triggerClass).html(g==""?f:$("<img/>").attr({src:g,alt:f,title:f}))),a[d?"before":"after"](b.trigger),b.trigger.click(function(){return $.datepicker._datepickerShowing&&$.datepicker._lastInput==a[0]?$.datepicker._hideDatepicker():$.datepicker._datepickerShowing&&$.datepicker._lastInput!=a[0]?($.datepicker._hideDatepicker(),$.datepicker._showDatepicker(a[0])):$.datepicker._showDatepicker(a[0]),!1})}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var b=new Date(2009,11,20),c=this._get(a,"dateFormat");if(c.match(/[DM]/)){var d=function(a){var b=0,c=0;for(var d=0;d<a.length;d++){a[d].length>b&&(b=a[d].length,c=d)}return c};b.setMonth(d(this._get(a,c.match(/MM/)?"monthNames":"monthNamesShort"))),b.setDate(d(this._get(a,c.match(/DD/)?"dayNames":"dayNamesShort"))+20-b.getDay())}a.input.attr("size",this._formatDate(a,b).length)}},_inlineDatepicker:function(a,b){var c=$(a);if(c.hasClass(this.markerClassName)){return}c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",function(a,c,d){b.settings[c]=d}).bind("getData.datepicker",function(a,c){return this._get(b,c)}),$.data(a,PROP_NAME,b),this._setDate(b,this._getDefaultDate(b),!0),this._updateDatepicker(b),this._updateAlternate(b),b.settings.disabled&&this._disableDatepicker(a),b.dpDiv.css("display","block")},_dialogDatepicker:function(a,b,c,d,e){var f=this._dialogInst;if(!f){this.uuid+=1;var g="dp"+this.uuid;this._dialogInput=$('<input type="text" id="'+g+'" style="position: absolute; top: -100px; width: 0px;"/>'),this._dialogInput.keydown(this._doKeyDown),$("body").append(this._dialogInput),f=this._dialogInst=this._newInst(this._dialogInput,!1),f.settings={},$.data(this._dialogInput[0],PROP_NAME,f)}extendRemove(f.settings,d||{}),b=b&&b.constructor==Date?this._formatDate(f,b):b,this._dialogInput.val(b),this._pos=e?e.length?e:[e.pageX,e.pageY]:null;if(!this._pos){var h=document.documentElement.clientWidth,i=document.documentElement.clientHeight,j=document.documentElement.scrollLeft||document.body.scrollLeft,k=document.documentElement.scrollTop||document.body.scrollTop;this._pos=[h/2-100+j,i/2-150+k]}return this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),f.settings.onSelect=c,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),$.blockUI&&$.blockUI(this.dpDiv),$.data(this._dialogInput[0],PROP_NAME,f),this},_destroyDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName)){return}var d=a.nodeName.toLowerCase();$.removeData(a,PROP_NAME),d=="input"?(c.append.remove(),c.trigger.remove(),b.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):(d=="div"||d=="span")&&b.removeClass(this.markerClassName).empty()},_enableDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName)){return}var d=a.nodeName.toLowerCase();if(d=="input"){a.disabled=!1,c.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})}else{if(d=="div"||d=="span"){var e=b.children("."+this._inlineClass);e.children().removeClass("ui-state-disabled"),e.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")}}this._disabledInputs=$.map(this._disabledInputs,function(b){return b==a?null:b})},_disableDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName)){return}var d=a.nodeName.toLowerCase();if(d=="input"){a.disabled=!0,c.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})}else{if(d=="div"||d=="span"){var e=b.children("."+this._inlineClass);e.children().addClass("ui-state-disabled"),e.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled","disabled")}}this._disabledInputs=$.map(this._disabledInputs,function(b){return b==a?null:b}),this._disabledInputs[this._disabledInputs.length]=a},_isDisabledDatepicker:function(a){if(!a){return !1}for(var b=0;b<this._disabledInputs.length;b++){if(this._disabledInputs[b]==a){return !0}}return !1},_getInst:function(a){try{return $.data(a,PROP_NAME)}catch(b){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(a,b,c){var d=this._getInst(a);if(arguments.length==2&&typeof b=="string"){return b=="defaults"?$.extend({},$.datepicker._defaults):d?b=="all"?$.extend({},d.settings):this._get(d,b):null}var e=b||{};typeof b=="string"&&(e={},e[b]=c);if(d){this._curInst==d&&this._hideDatepicker();var f=this._getDateDatepicker(a,!0),g=this._getMinMaxDate(d,"min"),h=this._getMinMaxDate(d,"max");extendRemove(d.settings,e),g!==null&&e.dateFormat!==undefined&&e.minDate===undefined&&(d.settings.minDate=this._formatDate(d,g)),h!==null&&e.dateFormat!==undefined&&e.maxDate===undefined&&(d.settings.maxDate=this._formatDate(d,h)),this._attachments($(a),d),this._autoSize(d),this._setDate(d,f),this._updateAlternate(d),this._updateDatepicker(d)}},_changeDatepicker:function(a,b,c){this._optionDatepicker(a,b,c)},_refreshDatepicker:function(a){var b=this._getInst(a);b&&this._updateDatepicker(b)},_setDateDatepicker:function(a,b){var c=this._getInst(a);c&&(this._setDate(c,b),this._updateDatepicker(c),this._updateAlternate(c))},_getDateDatepicker:function(a,b){var c=this._getInst(a);return c&&!c.inline&&this._setDateFromField(c,b),c?this._getDate(c):null},_doKeyDown:function(a){var b=$.datepicker._getInst(a.target),c=!0,d=b.dpDiv.is(".ui-datepicker-rtl");b._keyEvent=!0;if($.datepicker._datepickerShowing){switch(a.keyCode){case 9:$.datepicker._hideDatepicker(),c=!1;break;case 13:var e=$("td."+$.datepicker._dayOverClass+":not(."+$.datepicker._currentClass+")",b.dpDiv);e[0]&&$.datepicker._selectDay(a.target,b.selectedMonth,b.selectedYear,e[0]);var f=$.datepicker._get(b,"onSelect");if(f){var g=$.datepicker._formatDate(b);f.apply(b.input?b.input[0]:null,[g,b])}else{$.datepicker._hideDatepicker()}return !1;case 27:$.datepicker._hideDatepicker();break;case 33:$.datepicker._adjustDate(a.target,a.ctrlKey?-$.datepicker._get(b,"stepBigMonths"):-$.datepicker._get(b,"stepMonths"),"M");break;case 34:$.datepicker._adjustDate(a.target,a.ctrlKey?+$.datepicker._get(b,"stepBigMonths"):+$.datepicker._get(b,"stepMonths"),"M");break;case 35:(a.ctrlKey||a.metaKey)&&$.datepicker._clearDate(a.target),c=a.ctrlKey||a.metaKey;break;case 36:(a.ctrlKey||a.metaKey)&&$.datepicker._gotoToday(a.target),c=a.ctrlKey||a.metaKey;break;case 37:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,d?1:-1,"D"),c=a.ctrlKey||a.metaKey,a.originalEvent.altKey&&$.datepicker._adjustDate(a.target,a.ctrlKey?-$.datepicker._get(b,"stepBigMonths"):-$.datepicker._get(b,"stepMonths"),"M");break;case 38:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,-7,"D"),c=a.ctrlKey||a.metaKey;break;case 39:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,d?-1:1,"D"),c=a.ctrlKey||a.metaKey,a.originalEvent.altKey&&$.datepicker._adjustDate(a.target,a.ctrlKey?+$.datepicker._get(b,"stepBigMonths"):+$.datepicker._get(b,"stepMonths"),"M");break;case 40:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,7,"D"),c=a.ctrlKey||a.metaKey;break;default:c=!1}}else{a.keyCode==36&&a.ctrlKey?$.datepicker._showDatepicker(this):c=!1}c&&(a.preventDefault(),a.stopPropagation())},_doKeyPress:function(a){var b=$.datepicker._getInst(a.target);if($.datepicker._get(b,"constrainInput")){var c=$.datepicker._possibleChars($.datepicker._get(b,"dateFormat")),d=String.fromCharCode(a.charCode==undefined?a.keyCode:a.charCode);return a.ctrlKey||a.metaKey||d<" "||!c||c.indexOf(d)>-1}},_doKeyUp:function(a){var b=$.datepicker._getInst(a.target);if(b.input.val()!=b.lastVal){try{var c=$.datepicker.parseDate($.datepicker._get(b,"dateFormat"),b.input?b.input.val():null,$.datepicker._getFormatConfig(b));c&&($.datepicker._setDateFromField(b),$.datepicker._updateAlternate(b),$.datepicker._updateDatepicker(b))}catch(d){$.datepicker.log(d)}}return !0},_showDatepicker:function(a){a=a.target||a,a.nodeName.toLowerCase()!="input"&&(a=$("input",a.parentNode)[0]);if($.datepicker._isDisabledDatepicker(a)||$.datepicker._lastInput==a){return}var b=$.datepicker._getInst(a);$.datepicker._curInst&&$.datepicker._curInst!=b&&($.datepicker._curInst.dpDiv.stop(!0,!0),b&&$.datepicker._datepickerShowing&&$.datepicker._hideDatepicker($.datepicker._curInst.input[0]));var c=$.datepicker._get(b,"beforeShow"),d=c?c.apply(a,[a,b]):{};if(d===!1){return}extendRemove(b.settings,d),b.lastVal=null,$.datepicker._lastInput=a,$.datepicker._setDateFromField(b),$.datepicker._inDialog&&(a.value=""),$.datepicker._pos||($.datepicker._pos=$.datepicker._findPos(a),$.datepicker._pos[1]+=a.offsetHeight);var e=!1;$(a).parents().each(function(){return e|=$(this).css("position")=="fixed",!e}),e&&$.browser.opera&&($.datepicker._pos[0]-=document.documentElement.scrollLeft,$.datepicker._pos[1]-=document.documentElement.scrollTop);var f={left:$.datepicker._pos[0],top:$.datepicker._pos[1]};$.datepicker._pos=null,b.dpDiv.empty(),b.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),$.datepicker._updateDatepicker(b),f=$.datepicker._checkOffset(b,f,e),b.dpDiv.css({position:$.datepicker._inDialog&&$.blockUI?"static":e?"fixed":"absolute",display:"none",left:f.left+"px",top:f.top+"px"});if(!b.inline){var g=$.datepicker._get(b,"showAnim"),h=$.datepicker._get(b,"duration"),i=function(){var a=b.dpDiv.find("iframe.ui-datepicker-cover");if(!!a.length){var c=$.datepicker._getBorders(b.dpDiv);a.css({left:-c[0],top:-c[1],width:b.dpDiv.outerWidth(),height:b.dpDiv.outerHeight()})}};b.dpDiv.zIndex($(a).zIndex()+1),$.datepicker._datepickerShowing=!0,$.effects&&$.effects[g]?b.dpDiv.show(g,$.datepicker._get(b,"showOptions"),h,i):b.dpDiv[g||"show"](g?h:null,i),(!g||!h)&&i(),b.input.is(":visible")&&!b.input.is(":disabled")&&b.input.focus(),$.datepicker._curInst=b}},_updateDatepicker:function(a){var b=this;b.maxRows=4;var c=$.datepicker._getBorders(a.dpDiv);instActive=a,a.dpDiv.empty().append(this._generateHTML(a)),this._attachHandlers(a);var d=a.dpDiv.find("iframe.ui-datepicker-cover");!d.length||d.css({left:-c[0],top:-c[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()}),a.dpDiv.find("."+this._dayOverClass+" a").mouseover();var e=this._getNumberOfMonths(a),f=e[1],g=17;a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),f>1&&a.dpDiv.addClass("ui-datepicker-multi-"+f).css("width",g*f+"em"),a.dpDiv[(e[0]!=1||e[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi"),a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),a==$.datepicker._curInst&&$.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&!a.input.is(":disabled")&&a.input[0]!=document.activeElement&&a.input.focus();if(a.yearshtml){var h=a.yearshtml;setTimeout(function(){h===a.yearshtml&&a.yearshtml&&a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml),h=a.yearshtml=null},0)}},_getBorders:function(a){var b=function(a){return{thin:1,medium:2,thick:3}[a]||a};return[parseFloat(b(a.css("border-left-width"))),parseFloat(b(a.css("border-top-width")))]},_checkOffset:function(a,b,c){var d=a.dpDiv.outerWidth(),e=a.dpDiv.outerHeight(),f=a.input?a.input.outerWidth():0,g=a.input?a.input.outerHeight():0,h=document.documentElement.clientWidth+(c?0:$(document).scrollLeft()),i=document.documentElement.clientHeight+(c?0:$(document).scrollTop());return b.left-=this._get(a,"isRTL")?d-f:0,b.left-=c&&b.left==a.input.offset().left?$(document).scrollLeft():0,b.top-=c&&b.top==a.input.offset().top+g?$(document).scrollTop():0,b.left-=Math.min(b.left,b.left+d>h&&h>d?Math.abs(b.left+d-h):0),b.top-=Math.min(b.top,b.top+e>i&&i>e?Math.abs(e+g):0),b},_findPos:function(a){var b=this._getInst(a),c=this._get(b,"isRTL");while(a&&(a.type=="hidden"||a.nodeType!=1||$.expr.filters.hidden(a))){a=a[c?"previousSibling":"nextSibling"]}var d=$(a).offset();return[d.left,d.top]},_hideDatepicker:function(a){var b=this._curInst;if(!b||a&&b!=$.data(a,PROP_NAME)){return}if(this._datepickerShowing){var c=this._get(b,"showAnim"),d=this._get(b,"duration"),e=function(){$.datepicker._tidyDialog(b)};$.effects&&$.effects[c]?b.dpDiv.hide(c,$.datepicker._get(b,"showOptions"),d,e):b.dpDiv[c=="slideDown"?"slideUp":c=="fadeIn"?"fadeOut":"hide"](c?d:null,e),c||e(),this._datepickerShowing=!1;var f=this._get(b,"onClose");f&&f.apply(b.input?b.input[0]:null,[b.input?b.input.val():"",b]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),$.blockUI&&($.unblockUI(),$("body").append(this.dpDiv))),this._inDialog=!1}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(a){if(!$.datepicker._curInst){return}var b=$(a.target),c=$.datepicker._getInst(b[0]);(b[0].id!=$.datepicker._mainDivId&&b.parents("#"+$.datepicker._mainDivId).length==0&&!b.hasClass($.datepicker.markerClassName)&&!b.closest("."+$.datepicker._triggerClass).length&&$.datepicker._datepickerShowing&&(!$.datepicker._inDialog||!$.blockUI)||b.hasClass($.datepicker.markerClassName)&&$.datepicker._curInst!=c)&&$.datepicker._hideDatepicker()},_adjustDate:function(a,b,c){var d=$(a),e=this._getInst(d[0]);if(this._isDisabledDatepicker(d[0])){return}this._adjustInstDate(e,b+(c=="M"?this._get(e,"showCurrentAtPos"):0),c),this._updateDatepicker(e)},_gotoToday:function(a){var b=$(a),c=this._getInst(b[0]);if(this._get(c,"gotoCurrent")&&c.currentDay){c.selectedDay=c.currentDay,c.drawMonth=c.selectedMonth=c.currentMonth,c.drawYear=c.selectedYear=c.currentYear}else{var d=new Date;c.selectedDay=d.getDate(),c.drawMonth=c.selectedMonth=d.getMonth(),c.drawYear=c.selectedYear=d.getFullYear()}this._notifyChange(c),this._adjustDate(b)},_selectMonthYear:function(a,b,c){var d=$(a),e=this._getInst(d[0]);e["selected"+(c=="M"?"Month":"Year")]=e["draw"+(c=="M"?"Month":"Year")]=parseInt(b.options[b.selectedIndex].value,10),this._notifyChange(e),this._adjustDate(d)},_selectDay:function(a,b,c,d){var e=$(a);if($(d).hasClass(this._unselectableClass)||this._isDisabledDatepicker(e[0])){return}var f=this._getInst(e[0]);f.selectedDay=f.currentDay=$("a",d).html(),f.selectedMonth=f.currentMonth=b,f.selectedYear=f.currentYear=c,this._selectDate(a,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear))},_clearDate:function(a){var b=$(a),c=this._getInst(b[0]);this._selectDate(b,"")},_selectDate:function(a,b){var c=$(a),d=this._getInst(c[0]);b=b!=null?b:this._formatDate(d),d.input&&d.input.val(b),this._updateAlternate(d);var e=this._get(d,"onSelect");e?e.apply(d.input?d.input[0]:null,[b,d]):d.input&&d.input.trigger("change"),d.inline?this._updateDatepicker(d):(this._hideDatepicker(),this._lastInput=d.input[0],typeof d.input[0]!="object"&&d.input.focus(),this._lastInput=null)},_updateAlternate:function(a){var b=this._get(a,"altField");if(b){var c=this._get(a,"altFormat")||this._get(a,"dateFormat"),d=this._getDate(a),e=this.formatDate(c,d,this._getFormatConfig(a));$(b).each(function(){$(this).val(e)})}},noWeekends:function(a){var b=a.getDay();return[b>0&&b<6,""]},iso8601Week:function(a){var b=new Date(a.getTime());b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/86400000)/7)+1},parseDate:function(a,b,c){if(a==null||b==null){throw"Invalid arguments"}b=typeof b=="object"?b.toString():b+"";if(b==""){return null}var d=(c?c.shortYearCutoff:null)||this._defaults.shortYearCutoff;d=typeof d!="string"?d:(new Date).getFullYear()%100+parseInt(d,10);var e=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,f=(c?c.dayNames:null)||this._defaults.dayNames,g=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,h=(c?c.monthNames:null)||this._defaults.monthNames,i=-1,j=-1,k=-1,l=-1,m=!1,n=function(b){var c=s+1<a.length&&a.charAt(s+1)==b;return c&&s++,c},o=function(a){var c=n(a),d=a=="@"?14:a=="!"?20:a=="y"&&c?4:a=="o"?3:2,e=new RegExp("^\\d{1,"+d+"}"),f=b.substring(r).match(e);if(!f){throw"Missing number at position "+r}return r+=f[0].length,parseInt(f[0],10)},p=function(a,c,d){var e=$.map(n(a)?d:c,function(a,b){return[[b,a]]}).sort(function(a,b){return -(a[1].length-b[1].length)}),f=-1;$.each(e,function(a,c){var d=c[1];if(b.substr(r,d.length).toLowerCase()==d.toLowerCase()){return f=c[0],r+=d.length,!1}});if(f!=-1){return f+1}throw"Unknown name at position "+r},q=function(){if(b.charAt(r)!=a.charAt(s)){throw"Unexpected literal at position "+r}r++},r=0;for(var s=0;s<a.length;s++){if(m){a.charAt(s)=="'"&&!n("'")?m=!1:q()}else{switch(a.charAt(s)){case"d":k=o("d");break;case"D":p("D",e,f);break;case"o":l=o("o");break;case"m":j=o("m");break;case"M":j=p("M",g,h);break;case"y":i=o("y");break;case"@":var t=new Date(o("@"));i=t.getFullYear(),j=t.getMonth()+1,k=t.getDate();break;case"!":var t=new Date((o("!")-this._ticksTo1970)/10000);i=t.getFullYear(),j=t.getMonth()+1,k=t.getDate();break;case"'":n("'")?q():m=!0;break;default:q()}}}if(r<b.length){throw"Extra/unparsed characters found in date: "+b.substring(r)}i==-1?i=(new Date).getFullYear():i<100&&(i+=(new Date).getFullYear()-(new Date).getFullYear()%100+(i<=d?0:-100));if(l>-1){j=1,k=l;do{var u=this._getDaysInMonth(i,j-1);if(k<=u){break}j++,k-=u}while(!0)}var t=this._daylightSavingAdjust(new Date(i,j-1,k));if(t.getFullYear()!=i||t.getMonth()+1!=j||t.getDate()!=k){throw"Invalid date"}return t},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*10000000,formatDate:function(a,b,c){if(!b){return""}var d=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,e=(c?c.dayNames:null)||this._defaults.dayNames,f=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,g=(c?c.monthNames:null)||this._defaults.monthNames,h=function(b){var c=m+1<a.length&&a.charAt(m+1)==b;return c&&m++,c},i=function(a,b,c){var d=""+b;if(h(a)){while(d.length<c){d="0"+d}}return d},j=function(a,b,c,d){return h(a)?d[b]:c[b]},k="",l=!1;if(b){for(var m=0;m<a.length;m++){if(l){a.charAt(m)=="'"&&!h("'")?l=!1:k+=a.charAt(m)}else{switch(a.charAt(m)){case"d":k+=i("d",b.getDate(),2);break;case"D":k+=j("D",b.getDay(),d,e);break;case"o":k+=i("o",Math.round(((new Date(b.getFullYear(),b.getMonth(),b.getDate())).getTime()-(new Date(b.getFullYear(),0,0)).getTime())/86400000),3);break;case"m":k+=i("m",b.getMonth()+1,2);break;case"M":k+=j("M",b.getMonth(),f,g);break;case"y":k+=h("y")?b.getFullYear():(b.getYear()%100<10?"0":"")+b.getYear()%100;break;case"@":k+=b.getTime();break;case"!":k+=b.getTime()*10000+this._ticksTo1970;break;case"'":h("'")?k+="'":l=!0;break;default:k+=a.charAt(m)}}}}return k},_possibleChars:function(a){var b="",c=!1,d=function(b){var c=e+1<a.length&&a.charAt(e+1)==b;return c&&e++,c};for(var e=0;e<a.length;e++){if(c){a.charAt(e)=="'"&&!d("'")?c=!1:b+=a.charAt(e)}else{switch(a.charAt(e)){case"d":case"m":case"y":case"@":b+="0123456789";break;case"D":case"M":return null;case"'":d("'")?b+="'":c=!0;break;default:b+=a.charAt(e)}}}return b},_get:function(a,b){return a.settings[b]!==undefined?a.settings[b]:this._defaults[b]},_setDateFromField:function(a,b){if(a.input.val()==a.lastVal){return}var c=this._get(a,"dateFormat"),d=a.lastVal=a.input?a.input.val():null,e,f;e=f=this._getDefaultDate(a);var g=this._getFormatConfig(a);try{e=this.parseDate(c,d,g)||f}catch(h){this.log(h),d=b?"":d}a.selectedDay=e.getDate(),a.drawMonth=a.selectedMonth=e.getMonth(),a.drawYear=a.selectedYear=e.getFullYear(),a.currentDay=d?e.getDate():0,a.currentMonth=d?e.getMonth():0,a.currentYear=d?e.getFullYear():0,this._adjustInstDate(a)},_getDefaultDate:function(a){return this._restrictMinMax(a,this._determineDate(a,this._get(a,"defaultDate"),new Date))},_determineDate:function(a,b,c){var d=function(a){var b=new Date;return b.setDate(b.getDate()+a),b},e=function(b){try{return $.datepicker.parseDate($.datepicker._get(a,"dateFormat"),b,$.datepicker._getFormatConfig(a))}catch(c){}var d=(b.toLowerCase().match(/^c/)?$.datepicker._getDate(a):null)||new Date,e=d.getFullYear(),f=d.getMonth(),g=d.getDate(),h=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,i=h.exec(b);while(i){switch(i[2]||"d"){case"d":case"D":g+=parseInt(i[1],10);break;case"w":case"W":g+=parseInt(i[1],10)*7;break;case"m":case"M":f+=parseInt(i[1],10),g=Math.min(g,$.datepicker._getDaysInMonth(e,f));break;case"y":case"Y":e+=parseInt(i[1],10),g=Math.min(g,$.datepicker._getDaysInMonth(e,f))}i=h.exec(b)}return new Date(e,f,g)},f=b==null||b===""?c:typeof b=="string"?e(b):typeof b=="number"?isNaN(b)?c:d(b):new Date(b.getTime());return f=f&&f.toString()=="Invalid Date"?c:f,f&&(f.setHours(0),f.setMinutes(0),f.setSeconds(0),f.setMilliseconds(0)),this._daylightSavingAdjust(f)},_daylightSavingAdjust:function(a){return a?(a.setHours(a.getHours()>12?a.getHours()+2:0),a):null},_setDate:function(a,b,c){var d=!b,e=a.selectedMonth,f=a.selectedYear,g=this._restrictMinMax(a,this._determineDate(a,b,new Date));a.selectedDay=a.currentDay=g.getDate(),a.drawMonth=a.selectedMonth=a.currentMonth=g.getMonth(),a.drawYear=a.selectedYear=a.currentYear=g.getFullYear(),(e!=a.selectedMonth||f!=a.selectedYear)&&!c&&this._notifyChange(a),this._adjustInstDate(a),a.input&&a.input.val(d?"":this._formatDate(a))},_getDate:function(a){var b=!a.currentYear||a.input&&a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return b},_attachHandlers:function(a){var b=this._get(a,"stepMonths"),c="#"+a.id.replace(/\\\\/g,"\\");a.dpDiv.find("[data-handler]").map(function(){var a={prev:function(){window["DP_jQuery_"+dpuuid].datepicker._adjustDate(c,-b,"M")},next:function(){window["DP_jQuery_"+dpuuid].datepicker._adjustDate(c,+b,"M")},hide:function(){window["DP_jQuery_"+dpuuid].datepicker._hideDatepicker()},today:function(){window["DP_jQuery_"+dpuuid].datepicker._gotoToday(c)},selectDay:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectDay(c,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectMonthYear(c,this,"M"),!1},selectYear:function(){return window["DP_jQuery_"+dpuuid].datepicker._selectMonthYear(c,this,"Y"),!1}};$(this).bind(this.getAttribute("data-event"),a[this.getAttribute("data-handler")])})},_generateHTML:function(a){var b=new Date;b=this._daylightSavingAdjust(new Date(b.getFullYear(),b.getMonth(),b.getDate()));var c=this._get(a,"isRTL"),d=this._get(a,"showButtonPanel"),e=this._get(a,"hideIfNoPrevNext"),f=this._get(a,"navigationAsDateFormat"),g=this._getNumberOfMonths(a),h=this._get(a,"showCurrentAtPos"),i=this._get(a,"stepMonths"),j=g[0]!=1||g[1]!=1,k=this._daylightSavingAdjust(a.currentDay?new Date(a.currentYear,a.currentMonth,a.currentDay):new Date(9999,9,9)),l=this._getMinMaxDate(a,"min"),m=this._getMinMaxDate(a,"max"),n=a.drawMonth-h,o=a.drawYear;n<0&&(n+=12,o--);if(m){var p=this._daylightSavingAdjust(new Date(m.getFullYear(),m.getMonth()-g[0]*g[1]+1,m.getDate()));p=l&&p<l?l:p;while(this._daylightSavingAdjust(new Date(o,n,1))>p){n--,n<0&&(n=11,o--)}}a.drawMonth=n,a.drawYear=o;var q=this._get(a,"prevText");q=f?this.formatDate(q,this._daylightSavingAdjust(new Date(o,n-i,1)),this._getFormatConfig(a)):q;var r=this._canAdjustMonth(a,-1,o,n)?'<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click" title="'+q+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+q+"</span></a>":e?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+q+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+q+"</span></a>",s=this._get(a,"nextText");s=f?this.formatDate(s,this._daylightSavingAdjust(new Date(o,n+i,1)),this._getFormatConfig(a)):s;var t=this._canAdjustMonth(a,1,o,n)?'<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="'+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>":e?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>",u=this._get(a,"currentText"),v=this._get(a,"gotoCurrent")&&a.currentDay?k:b;u=f?this.formatDate(u,v,this._getFormatConfig(a)):u;var w=a.inline?"":'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">'+this._get(a,"closeText")+"</button>",x=d?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(c?w:"")+(this._isInRange(a,v)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click">'+u+"</button>":"")+(c?"":w)+"</div>":"",y=parseInt(this._get(a,"firstDay"),10);y=isNaN(y)?0:y;var z=this._get(a,"showWeek"),A=this._get(a,"dayNames"),B=this._get(a,"dayNamesShort"),C=this._get(a,"dayNamesMin"),D=this._get(a,"monthNames"),E=this._get(a,"monthNamesShort"),F=this._get(a,"beforeShowDay"),G=this._get(a,"showOtherMonths"),H=this._get(a,"selectOtherMonths"),I=this._get(a,"calculateWeek")||this.iso8601Week,J=this._getDefaultDate(a),K="";for(var L=0;L<g[0];L++){var M="";this.maxRows=4;for(var N=0;N<g[1];N++){var O=this._daylightSavingAdjust(new Date(o,n,a.selectedDay)),P=" ui-corner-all",Q="";if(j){Q+='<div class="ui-datepicker-group';if(g[1]>1){switch(N){case 0:Q+=" ui-datepicker-group-first",P=" ui-corner-"+(c?"right":"left");break;case g[1]-1:Q+=" ui-datepicker-group-last",P=" ui-corner-"+(c?"left":"right");break;default:Q+=" ui-datepicker-group-middle",P=""}}Q+='">'}Q+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+P+'">'+(/all|left/.test(P)&&L==0?c?t:r:"")+(/all|right/.test(P)&&L==0?c?r:t:"")+this._generateMonthYearHeader(a,n,o,l,m,L>0||N>0,D,E)+'</div><table class="ui-datepicker-calendar"><thead><tr>';var R=z?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";for(var S=0;S<7;S++){var T=(S+y)%7;R+="<th"+((S+y+6)%7>=5?' class="ui-datepicker-week-end"':"")+'><span title="'+A[T]+'">'+C[T]+"</span></th>"}Q+=R+"</tr></thead><tbody>";var U=this._getDaysInMonth(o,n);o==a.selectedYear&&n==a.selectedMonth&&(a.selectedDay=Math.min(a.selectedDay,U));var V=(this._getFirstDayOfMonth(o,n)-y+7)%7,W=Math.ceil((V+U)/7),X=j?this.maxRows>W?this.maxRows:W:W;this.maxRows=X;var Y=this._daylightSavingAdjust(new Date(o,n,1-V));for(var Z=0;Z<X;Z++){Q+="<tr>";var _=z?'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(Y)+"</td>":"";for(var S=0;S<7;S++){var ba=F?F.apply(a.input?a.input[0]:null,[Y]):[!0,""],bb=Y.getMonth()!=n,bc=bb&&!H||!ba[0]||l&&Y<l||m&&Y>m;_+='<td class="'+((S+y+6)%7>=5?" ui-datepicker-week-end":"")+(bb?" ui-datepicker-other-month":"")+(Y.getTime()==O.getTime()&&n==a.selectedMonth&&a._keyEvent||J.getTime()==Y.getTime()&&J.getTime()==O.getTime()?" "+this._dayOverClass:"")+(bc?" "+this._unselectableClass+" ui-state-disabled":"")+(bb&&!G?"":" "+ba[1]+(Y.getTime()==k.getTime()?" "+this._currentClass:"")+(Y.getTime()==b.getTime()?" ui-datepicker-today":""))+'"'+((!bb||G)&&ba[2]?' title="'+ba[2]+'"':"")+(bc?"":' data-handler="selectDay" data-event="click" data-month="'+Y.getMonth()+'" data-year="'+Y.getFullYear()+'"')+">"+(bb&&!G?"&#xa0;":bc?'<span class="ui-state-default">'+Y.getDate()+"</span>":'<a class="ui-state-default'+(Y.getTime()==b.getTime()?" ui-state-highlight":"")+(Y.getTime()==k.getTime()?" ui-state-active":"")+(bb?" ui-priority-secondary":"")+'" href="#">'+Y.getDate()+"</a>")+"</td>",Y.setDate(Y.getDate()+1),Y=this._daylightSavingAdjust(Y)}Q+=_+"</tr>"}n++,n>11&&(n=0,o++),Q+="</tbody></table>"+(j?"</div>"+(g[0]>0&&N==g[1]-1?'<div class="ui-datepicker-row-break"></div>':""):""),M+=Q}K+=M}return K+=x+($.browser.msie&&parseInt($.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':""),a._keyEvent=!1,K},_generateMonthYearHeader:function(a,b,c,d,e,f,g,h){var i=this._get(a,"changeMonth"),j=this._get(a,"changeYear"),k=this._get(a,"showMonthAfterYear"),l='<div class="ui-datepicker-title">',m="";if(f||!i){m+='<span class="ui-datepicker-month">'+g[b]+"</span>"}else{var n=d&&d.getFullYear()==c,o=e&&e.getFullYear()==c;m+='<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';for(var p=0;p<12;p++){(!n||p>=d.getMonth())&&(!o||p<=e.getMonth())&&(m+='<option value="'+p+'"'+(p==b?' selected="selected"':"")+">"+h[p]+"</option>")}m+="</select>"}k||(l+=m+(f||!i||!j?"&#xa0;":""));if(!a.yearshtml){a.yearshtml="";if(f||!j){l+='<span class="ui-datepicker-year">'+c+"</span>"}else{var q=this._get(a,"yearRange").split(":"),r=(new Date).getFullYear(),s=function(a){var b=a.match(/c[+-].*/)?c+parseInt(a.substring(1),10):a.match(/[+-].*/)?r+parseInt(a,10):parseInt(a,10);return isNaN(b)?r:b},t=s(q[0]),u=Math.max(t,s(q[1]||""));t=d?Math.max(t,d.getFullYear()):t,u=e?Math.min(u,e.getFullYear()):u,a.yearshtml+='<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';for(;t<=u;t++){a.yearshtml+='<option value="'+t+'"'+(t==c?' selected="selected"':"")+">"+t+"</option>"}a.yearshtml+="</select>",l+=a.yearshtml,a.yearshtml=null}}return l+=this._get(a,"yearSuffix"),k&&(l+=(f||!i||!j?"&#xa0;":"")+m),l+="</div>",l},_adjustInstDate:function(a,b,c){var d=a.drawYear+(c=="Y"?b:0),e=a.drawMonth+(c=="M"?b:0),f=Math.min(a.selectedDay,this._getDaysInMonth(d,e))+(c=="D"?b:0),g=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(d,e,f)));a.selectedDay=g.getDate(),a.drawMonth=a.selectedMonth=g.getMonth(),a.drawYear=a.selectedYear=g.getFullYear(),(c=="M"||c=="Y")&&this._notifyChange(a)},_restrictMinMax:function(a,b){var c=this._getMinMaxDate(a,"min"),d=this._getMinMaxDate(a,"max"),e=c&&b<c?c:b;return e=d&&e>d?d:e,e},_notifyChange:function(a){var b=this._get(a,"onChangeMonthYear");b&&b.apply(a.input?a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a])},_getNumberOfMonths:function(a){var b=this._get(a,"numberOfMonths");return b==null?[1,1]:typeof b=="number"?[1,b]:b},_getMinMaxDate:function(a,b){return this._determineDate(a,this._get(a,b+"Date"),null)},_getDaysInMonth:function(a,b){return 32-this._daylightSavingAdjust(new Date(a,b,32)).getDate()},_getFirstDayOfMonth:function(a,b){return(new Date(a,b,1)).getDay()},_canAdjustMonth:function(a,b,c,d){var e=this._getNumberOfMonths(a),f=this._daylightSavingAdjust(new Date(c,d+(b<0?b:e[0]*e[1]),1));return b<0&&f.setDate(this._getDaysInMonth(f.getFullYear(),f.getMonth())),this._isInRange(a,f)},_isInRange:function(a,b){var c=this._getMinMaxDate(a,"min"),d=this._getMinMaxDate(a,"max");return(!c||b.getTime()>=c.getTime())&&(!d||b.getTime()<=d.getTime())},_getFormatConfig:function(a){var b=this._get(a,"shortYearCutoff");return b=typeof b!="string"?b:(new Date).getFullYear()%100+parseInt(b,10),{shortYearCutoff:b,dayNamesShort:this._get(a,"dayNamesShort"),dayNames:this._get(a,"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")}},_formatDate:function(a,b,c,d){b||(a.currentDay=a.selectedDay,a.currentMonth=a.selectedMonth,a.currentYear=a.selectedYear);var e=b?typeof b=="object"?b:this._daylightSavingAdjust(new Date(d,c,b)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return this.formatDate(this._get(a,"dateFormat"),e,this._getFormatConfig(a))}}),$.fn.datepicker=function(a){if(!this.length){return this}$.datepicker.initialized||($(document).mousedown($.datepicker._checkExternalClick).find("body").append($.datepicker.dpDiv),$.datepicker.initialized=!0);var b=Array.prototype.slice.call(arguments,1);return typeof a!="string"||a!="isDisabled"&&a!="getDate"&&a!="widget"?a=="option"&&arguments.length==2&&typeof arguments[1]=="string"?$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this[0]].concat(b)):this.each(function(){typeof a=="string"?$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this].concat(b)):$.datepicker._attachDatepicker(this,a)}):$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this[0]].concat(b))},$.datepicker=new Datepicker,$.datepicker.initialized=!1,$.datepicker.uuid=(new Date).getTime(),$.datepicker.version="1.8.23",window["DP_jQuery_"+dpuuid]=$})(jQuery);(function(a){a.widget("ui.selectmenu",{options:{appendTo:"body",typeAhead:1000,style:"dropdown",positionOptions:{my:"left top",at:"left bottom",offset:null},width:null,menuWidth:null,handleWidth:26,maxHeight:null,icons:null,format:null,escapeHtml:false,bgImage:function(){}},_create:function(){var b=this,e=this.options;var d=(this.element.attr("id")||"ui-selectmenu-"+Math.random().toString(16).slice(2,10)).replace(/(:|\.)/g,"");this.ids=[d,d+"-button",d+"-menu"];this._safemouseup=true;this.isOpen=false;this.newelement=a("<a />",{"class":this.widgetBaseClass+" ui-widget ui-state-default ui-corner-all",id:this.ids[1],role:"button",href:"#nogo",tabindex:this.element.attr("disabled")?1:0,"aria-haspopup":true,"aria-owns":this.ids[2]});this.newelementWrap=a("<span />").append(this.newelement).insertAfter(this.element);var c=this.element.attr("tabindex");if(c){this.newelement.attr("tabindex",c)}this.newelement.data("selectelement",this.element);this.selectmenuIcon=a('<span class="'+this.widgetBaseClass+'-icon ui-icon"></span>').prependTo(this.newelement);this.newelement.prepend('<span class="'+b.widgetBaseClass+'-status" />');this.element.bind({"click.selectmenu":function(f){b.newelement.focus();f.preventDefault()}});this.newelement.bind("mousedown.selectmenu",function(f){b._toggle(f,true);if(e.style=="popup"){b._safemouseup=false;setTimeout(function(){b._safemouseup=true},300)}return false}).bind("click.selectmenu",function(){return false}).bind("keydown.selectmenu",function(h){var f=false;switch(h.keyCode){case a.ui.keyCode.ENTER:f=true;break;case a.ui.keyCode.SPACE:b._toggle(h);break;case a.ui.keyCode.UP:if(h.altKey){b.open(h)}else{b._moveSelection(-1)}break;case a.ui.keyCode.DOWN:if(h.altKey){b.open(h)}else{b._moveSelection(1)}break;case a.ui.keyCode.LEFT:b._moveSelection(-1);break;case a.ui.keyCode.RIGHT:b._moveSelection(1);break;case a.ui.keyCode.TAB:f=true;break;case a.ui.keyCode.PAGE_UP:case a.ui.keyCode.HOME:b.index(0);break;case a.ui.keyCode.PAGE_DOWN:case a.ui.keyCode.END:b.index(b._optionLis.length);break;default:f=true}return f}).bind("keypress.selectmenu",function(f){if(f.which>0){b._typeAhead(f.which,"mouseup")}return true}).bind("mouseover.selectmenu",function(){if(!e.disabled){a(this).addClass("ui-state-hover")}}).bind("mouseout.selectmenu",function(){if(!e.disabled){a(this).removeClass("ui-state-hover")}}).bind("focus.selectmenu",function(){if(!e.disabled){a(this).addClass("ui-state-focus")}}).bind("blur.selectmenu",function(){if(!e.disabled){a(this).removeClass("ui-state-focus")}});a(document).bind("mousedown.selectmenu-"+this.ids[0],function(f){if(b.isOpen){b.close(f)}});this.element.bind("click.selectmenu",function(){b._refreshValue()}).bind("focus.selectmenu",function(){if(b.newelement){b.newelement[0].focus()}});if(!e.width){e.width=this.element.outerWidth()}this.newelement.width(e.width);this.element.hide();this.list=a("<ul />",{"class":"ui-widget ui-widget-content","aria-hidden":true,role:"listbox","aria-labelledby":this.ids[1],id:this.ids[2]});this.listWrap=a("<div />",{"class":b.widgetBaseClass+"-menu"}).append(this.list).appendTo(e.appendTo);this.list.bind("keydown.selectmenu",function(h){var f=false;switch(h.keyCode){case a.ui.keyCode.UP:if(h.altKey){b.close(h,true)}else{b._moveFocus(-1)}break;case a.ui.keyCode.DOWN:if(h.altKey){b.close(h,true)}else{b._moveFocus(1)}break;case a.ui.keyCode.LEFT:b._moveFocus(-1);break;case a.ui.keyCode.RIGHT:b._moveFocus(1);break;case a.ui.keyCode.HOME:b._moveFocus(":first");break;case a.ui.keyCode.PAGE_UP:b._scrollPage("up");break;case a.ui.keyCode.PAGE_DOWN:b._scrollPage("down");break;case a.ui.keyCode.END:b._moveFocus(":last");break;case a.ui.keyCode.ENTER:case a.ui.keyCode.SPACE:b.close(h,true);a(h.target).parents("li:eq(0)").trigger("mouseup");break;case a.ui.keyCode.TAB:f=true;b.close(h,true);a(h.target).parents("li:eq(0)").trigger("mouseup");break;case a.ui.keyCode.ESCAPE:b.close(h,true);break;default:f=true}return f}).bind("keypress.selectmenu",function(f){if(f.which>0){b._typeAhead(f.which,"focus")}return true}).bind("mousedown.selectmenu mouseup.selectmenu",function(){return false});a(window).bind("resize.selectmenu-"+this.ids[0],a.proxy(b.close,this))},_init:function(){var t=this,e=this.options;var b=[];this.element.find("option").each(function(){var i=a(this);b.push({value:i.attr("value"),text:t._formatText(i.text(),i),selected:i.attr("selected"),disabled:i.attr("disabled"),classes:i.attr("class"),typeahead:i.attr("typeahead"),parentOptGroup:i.parent("optgroup"),bgImage:e.bgImage.call(i)})});var n=(t.options.style=="popup")?" ui-state-active":"";this.list.html("");if(b.length){for(var l=0;l<b.length;l++){var f={role:"presentation"};if(b[l].disabled){f["class"]=this.namespace+"-state-disabled"}var u={html:b[l].text||"&nbsp;",href:"#nogo",tabindex:-1,role:"option","aria-selected":false};if(b[l].disabled){u["aria-disabled"]=b[l].disabled}if(b[l].typeahead){u.typeahead=b[l].typeahead}var s=a("<a/>",u).bind("focus.selectmenu",function(){a(this).parent().mouseover()}).bind("blur.selectmenu",function(){a(this).parent().mouseout()});var d=a("<li/>",f).append(s).data("index",l).addClass(b[l].classes).data("optionClasses",b[l].classes||"").bind("mouseup.selectmenu",function(i){if(t._safemouseup&&!t._disabled(i.currentTarget)&&!t._disabled(a(i.currentTarget).parents("ul>li."+t.widgetBaseClass+"-group "))){t.index(a(this).data("index"));t.select(i);t.close(i,true)}return false}).bind("click.selectmenu",function(){return false}).bind("mouseover.selectmenu",function(){if(!a(this).hasClass(t.namespace+"-state-disabled")&&!a(this).parent("ul").parent("li").hasClass(t.namespace+"-state-disabled")){t._selectedOptionLi().addClass(n);t._focusedOptionLi().removeClass(t.widgetBaseClass+"-item-focus ui-state-hover");a(this).removeClass("ui-state-active").addClass(t.widgetBaseClass+"-item-focus ui-state-hover")}}).bind("mouseout.selectmenu",function(){if(a(this).is(t._selectedOptionLi())){a(this).addClass(n)}a(this).removeClass(t.widgetBaseClass+"-item-focus ui-state-hover")});if(b[l].parentOptGroup.length){var m=t.widgetBaseClass+"-group-"+this.element.find("optgroup").index(b[l].parentOptGroup);if(this.list.find("li."+m).length){this.list.find("li."+m+":last ul").append(d)}else{a(' <li role="presentation" class="'+t.widgetBaseClass+"-group "+m+(b[l].parentOptGroup.attr("disabled")?" "+this.namespace+'-state-disabled" aria-disabled="true"':'"')+'><span class="'+t.widgetBaseClass+'-group-label">'+b[l].parentOptGroup.attr("label")+"</span><ul></ul></li> ").appendTo(this.list).find("ul").append(d)}}else{d.appendTo(this.list)}if(e.icons){for(var k in e.icons){if(d.is(e.icons[k].find)){d.data("optionClasses",b[l].classes+" "+t.widgetBaseClass+"-hasIcon").addClass(t.widgetBaseClass+"-hasIcon");var q=e.icons[k].icon||"";d.find("a:eq(0)").prepend('<span class="'+t.widgetBaseClass+"-item-icon ui-icon "+q+'"></span>');if(b[l].bgImage){d.find("span").css("background-image",b[l].bgImage)}}}}}}else{a('<li role="presentation"><a href="#nogo" tabindex="-1" role="option"></a></li>').appendTo(this.list)}var c=(e.style=="dropdown");this.newelement.toggleClass(t.widgetBaseClass+"-dropdown",c).toggleClass(t.widgetBaseClass+"-popup",!c);this.list.toggleClass(t.widgetBaseClass+"-menu-dropdown ui-corner-bottom",c).toggleClass(t.widgetBaseClass+"-menu-popup ui-corner-all",!c).find("li:first").toggleClass("ui-corner-top",!c).end().find("li:last").addClass("ui-corner-bottom");this.selectmenuIcon.toggleClass("ui-icon-triangle-1-s",c).toggleClass("ui-icon-triangle-2-n-s",!c);if(e.style=="dropdown"){this.list.width(e.menuWidth?e.menuWidth:e.width)}else{this.list.width(e.menuWidth?e.menuWidth:e.width-e.handleWidth)}this.list.css("height","auto");var p=this.listWrap.height();var h=a(window).height();var r=e.maxHeight?Math.min(e.maxHeight,h):h/3;if(p>r){this.list.height(r)}this._optionLis=this.list.find("li:not(."+t.widgetBaseClass+"-group)");if(this.element.attr("disabled")){this.disable()}else{this.enable()}this._refreshValue();this._selectedOptionLi().addClass(this.widgetBaseClass+"-item-focus");clearTimeout(this.refreshTimeout);this.refreshTimeout=window.setTimeout(function(){t._refreshPosition()},200)},destroy:function(){this.element.removeData(this.widgetName).removeClass(this.widgetBaseClass+"-disabled "+this.namespace+"-state-disabled").removeAttr("aria-disabled").unbind(".selectmenu");a(window).unbind(".selectmenu-"+this.ids[0]);a(document).unbind(".selectmenu-"+this.ids[0]);this.newelementWrap.remove();this.listWrap.remove();this.element.unbind(".selectmenu").show();a.Widget.prototype.destroy.apply(this,arguments)},_typeAhead:function(e,f){var m=this,l=String.fromCharCode(e).toLowerCase(),d=null,k=null;if(m._typeAhead_timer){window.clearTimeout(m._typeAhead_timer);m._typeAhead_timer=undefined}m._typeAhead_chars=(m._typeAhead_chars===undefined?"":m._typeAhead_chars).concat(l);if(m._typeAhead_chars.length<2||(m._typeAhead_chars.substr(-2,1)===l&&m._typeAhead_cycling)){m._typeAhead_cycling=true;d=l}else{m._typeAhead_cycling=false;d=m._typeAhead_chars}var h=(f!=="focus"?this._selectedOptionLi().data("index"):this._focusedOptionLi().data("index"))||0;for(var j=0;j<this._optionLis.length;j++){var b=this._optionLis.eq(j).text().substr(0,d.length).toLowerCase();if(b===d){if(m._typeAhead_cycling){if(k===null){k=j}if(j>h){k=j;break}}else{k=j}}}if(k!==null){this._optionLis.eq(k).find("a").trigger(f)}m._typeAhead_timer=window.setTimeout(function(){m._typeAhead_timer=undefined;m._typeAhead_chars=undefined;m._typeAhead_cycling=undefined},m.options.typeAhead)},_uiHash:function(){var b=this.index();return{index:b,option:a("option",this.element).get(b),value:this.element[0].value}},open:function(e){var b=this,f=this.options;if(b.newelement.attr("aria-disabled")!="true"){b._closeOthers(e);b.newelement.addClass("ui-state-active");b.list.attr("aria-hidden",false);b.listWrap.addClass(b.widgetBaseClass+"-open");var c=this._selectedOptionLi();if(f.style=="dropdown"){b.newelement.removeClass("ui-corner-all").addClass("ui-corner-top")}else{this.list.css("left",-5000).scrollTop(this.list.scrollTop()+c.position().top-this.list.outerHeight()/2+c.outerHeight()/2).css("left","auto")}b._refreshPosition();var d=c.find("a");if(d.length){d[0].focus()}b.isOpen=true;b._trigger("open",e,b._uiHash())}},close:function(c,b){if(this.newelement.is(".ui-state-active")){this.newelement.removeClass("ui-state-active");this.listWrap.removeClass(this.widgetBaseClass+"-open");this.list.attr("aria-hidden",true);if(this.options.style=="dropdown"){this.newelement.removeClass("ui-corner-top").addClass("ui-corner-all")}if(b){this.newelement.focus()}this.isOpen=false;this._trigger("close",c,this._uiHash())}},change:function(b){this.element.trigger("change");this._trigger("change",b,this._uiHash())},select:function(b){if(this._disabled(b.currentTarget)){return false}this._trigger("select",b,this._uiHash())},widget:function(){return this.listWrap.add(this.newelementWrap)},_closeOthers:function(b){a("."+this.widgetBaseClass+".ui-state-active").not(this.newelement).each(function(){a(this).data("selectelement").selectmenu("close",b)});a("."+this.widgetBaseClass+".ui-state-hover").trigger("mouseout")},_toggle:function(c,b){if(this.isOpen){this.close(c,b)}else{this.open(c)}},_formatText:function(c,b){if(this.options.format){c=this.options.format(c,b)}else{if(this.options.escapeHtml){c=a("<div />").text(c).html()}}return c},_selectedIndex:function(){return this.element[0].selectedIndex},_selectedOptionLi:function(){return this._optionLis.eq(this._selectedIndex())},_focusedOptionLi:function(){return this.list.find("."+this.widgetBaseClass+"-item-focus")},_moveSelection:function(e,b){if(!this.options.disabled){var d=parseInt(this._selectedOptionLi().data("index")||0,10);var c=d+e;if(c<0){c=0}if(c>this._optionLis.size()-1){c=this._optionLis.size()-1}if(c===b){return false}if(this._optionLis.eq(c).hasClass(this.namespace+"-state-disabled")){(e>0)?++e:--e;this._moveSelection(e,c)}else{this._optionLis.eq(c).trigger("mouseover").trigger("mouseup")}}},_moveFocus:function(f,b){if(!isNaN(f)){var e=parseInt(this._focusedOptionLi().data("index")||0,10);var d=e+f}else{var d=parseInt(this._optionLis.filter(f).data("index"),10)}if(d<0){d=0}if(d>this._optionLis.size()-1){d=this._optionLis.size()-1}if(d===b){return false}var c=this.widgetBaseClass+"-item-"+Math.round(Math.random()*1000);this._focusedOptionLi().find("a:eq(0)").attr("id","");if(this._optionLis.eq(d).hasClass(this.namespace+"-state-disabled")){(f>0)?++f:--f;this._moveFocus(f,d)}else{this._optionLis.eq(d).find("a:eq(0)").attr("id",c).focus()}this.list.attr("aria-activedescendant",c)},_scrollPage:function(c){var b=Math.floor(this.list.outerHeight()/this._optionLis.first().outerHeight());b=(c=="up"?-b:b);this._moveFocus(b)},_setOption:function(b,c){this.options[b]=c;if(b=="disabled"){if(c){this.close()}this.element.add(this.newelement).add(this.list)[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled "+this.namespace+"-state-disabled").attr("aria-disabled",c)}},disable:function(b,c){if(typeof(b)=="undefined"){this._setOption("disabled",true)}else{if(c=="optgroup"){this._disableOptgroup(b)}else{this._disableOption(b)}}},enable:function(b,c){if(typeof(b)=="undefined"){this._setOption("disabled",false)}else{if(c=="optgroup"){this._enableOptgroup(b)}else{this._enableOption(b)}}},_disabled:function(b){return a(b).hasClass(this.namespace+"-state-disabled")},_disableOption:function(b){var c=this._optionLis.eq(b);if(c){c.addClass(this.namespace+"-state-disabled").find("a").attr("aria-disabled",true);this.element.find("option").eq(b).attr("disabled","disabled")}},_enableOption:function(b){var c=this._optionLis.eq(b);if(c){c.removeClass(this.namespace+"-state-disabled").find("a").attr("aria-disabled",false);this.element.find("option").eq(b).removeAttr("disabled")}},_disableOptgroup:function(c){var b=this.list.find("li."+this.widgetBaseClass+"-group-"+c);if(b){b.addClass(this.namespace+"-state-disabled").attr("aria-disabled",true);this.element.find("optgroup").eq(c).attr("disabled","disabled")}},_enableOptgroup:function(c){var b=this.list.find("li."+this.widgetBaseClass+"-group-"+c);if(b){b.removeClass(this.namespace+"-state-disabled").attr("aria-disabled",false);this.element.find("optgroup").eq(c).removeAttr("disabled")}},index:function(b){if(arguments.length){if(!this._disabled(a(this._optionLis[b]))&&b!=this._selectedIndex()){this.element[0].selectedIndex=b;this._refreshValue();this.change()}else{return false}}else{return this._selectedIndex()}},value:function(b){if(arguments.length&&b!=this.element[0].value){this.element[0].value=b;this._refreshValue();this.change()}else{return this.element[0].value}},_refreshValue:function(){var d=(this.options.style=="popup")?" ui-state-active":"";var c=this.widgetBaseClass+"-item-"+Math.round(Math.random()*1000);this.list.find("."+this.widgetBaseClass+"-item-selected").removeClass(this.widgetBaseClass+"-item-selected"+d).find("a").attr("aria-selected","false").attr("id","");this._selectedOptionLi().addClass(this.widgetBaseClass+"-item-selected"+d).find("a").attr("aria-selected","true").attr("id",c);var b=(this.newelement.data("optionClasses")?this.newelement.data("optionClasses"):"");var e=(this._selectedOptionLi().data("optionClasses")?this._selectedOptionLi().data("optionClasses"):"");this.newelement.removeClass(b).data("optionClasses",e).addClass(e).find("."+this.widgetBaseClass+"-status").html(this._selectedOptionLi().find("a:eq(0)").html());this.list.attr("aria-activedescendant",c)},_refreshPosition:function(){var d=this.options;if(d.style=="popup"&&!d.positionOptions.offset){var c=this._selectedOptionLi();var b="0 "+(this.list.offset().top-c.offset().top-(this.newelement.outerHeight()+c.outerHeight())/2)}this.listWrap.removeAttr("style").zIndex(this.element.zIndex()+1).position({of:d.positionOptions.of||this.newelement,my:d.positionOptions.my,at:d.positionOptions.at,offset:d.positionOptions.offset||b,collision:d.positionOptions.collision||(d.style=="popup"?"fit":"flip")})}})})(jQuery);$(document).ready(function(){$(document.body).on("change","#id_category",function(b){var a=$(this).closest("form");a.submit()})});
(function(){var g=this;var h=parseFloat("0.06"),k=isNaN(h)||1<h||0>h?0:h;var l=function(a,c){for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&c.call(null,a[d],d,a)};var m,n,p,q,r=function(){return g.navigator?g.navigator.userAgent:null};q=p=n=m=!1;var s;if(s=r()){var t=g.navigator;m=0==s.lastIndexOf("Opera",0);n=!m&&(-1!=s.indexOf("MSIE")||-1!=s.indexOf("Trident"));p=!m&&-1!=s.indexOf("WebKit");q=!m&&!p&&!n&&"Gecko"==t.product}var u=n,v=q,w=p;var x;if(m&&g.opera){var y=g.opera.version;"function"==typeof y&&y()}else v?x=/rv\:([^\);]+)(\)|;)/:u?x=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:w&&(x=/WebKit\/(\S+)/),x&&x.exec(r());var z=function(a){this.b=[];this.a={};for(var c=0,d=arguments.length;c<d;++c)this.a[arguments[c]]=""},C=function(){var a=A,c="317150500 317150501 317150502 317150503 317150504 317150505".split(" ");if(a.a.hasOwnProperty(1)&&""==a.a[1]){r:{if(!(1E-4>Math.random())){var d=Math.random();if(d<k){try{var b=new Uint16Array(1);window.crypto.getRandomValues(b);d=b[0]/65536}catch(e){d=Math.random()}c=c[Math.floor(d*c.length)];break r}}c=null}c&&""!=c&&a.a.hasOwnProperty(1)&&(a.a[1]=c)}};
z.prototype.c=function(a){return this.a.hasOwnProperty(a)?this.a[a]:""};z.prototype.geil=z.prototype.c;var D=function(){var a=A,c=[];l(a.a,function(a){""!=a&&c.push(a)});return 0<a.b.length&&0<c.length?a.b.join(",")+","+c.join(","):a.b.join(",")+c.join(",")};var A,E="google_conversion_id google_conversion_format google_conversion_type google_conversion_order_id google_conversion_language google_conversion_value google_conversion_currency_code google_conversion_domain google_conversion_label google_conversion_color google_disable_viewthrough google_remarketing_only google_remarketing_for_search google_conversion_items google_custom_params google_conversion_date google_conversion_time google_conversion_js_version onload_callback opt_image_generator google_is_call google_conversion_page_url".split(" ");
function F(a){return null!=a?escape(a.toString()):""}function G(a){return null!=a?a.toString().substring(0,512):""}function H(a,c){var d=F(c);if(""!=d){var b=F(a);if(""!=b)return"&".concat(b,"=",d)}return""}function I(a){var c=typeof a;return null==a||"object"==c||"function"==c?null:String(a).replace(/,/g,"\\,").replace(/;/g,"\\;").replace(/=/g,"\\=")}
function J(a){var c;if((a=a.google_custom_params)&&"object"==typeof a&&"function"!=typeof a.join){var d=[];for(c in a)if(Object.prototype.hasOwnProperty.call(a,c)){var b=a[c];if(b&&"function"==typeof b.join){for(var e=[],f=0;f<b.length;++f){var B=I(b[f]);null!=B&&e.push(B)}b=0==e.length?null:e.join(",")}else b=I(b);(e=I(c))&&null!=b&&d.push(e+"="+b)}c=d.join(";")}else c="";return""==c?"":"&".concat("data=",encodeURIComponent(c))}
function K(a){return"number"!=typeof a&&"string"!=typeof a?"":F(a.toString())}function L(a){if(!a)return"";a=a.google_conversion_items;if(!a)return"";for(var c=[],d=0,b=a.length;d<b;d++){var e=a[d],f=[];e&&(f.push(K(e.value)),f.push(K(e.quantity)),f.push(K(e.item_id)),f.push(K(e.adwords_grouping)),f.push(K(e.sku)),c.push("("+f.join("*")+")"))}return 0<c.length?"&item="+c.join(""):""}
function M(a,c,d){var b=[];if(a){var e=a.screen;e&&(b.push(H("u_h",e.height)),b.push(H("u_w",e.width)),b.push(H("u_ah",e.availHeight)),b.push(H("u_aw",e.availWidth)),b.push(H("u_cd",e.colorDepth)));a.history&&b.push(H("u_his",a.history.length))}d&&"function"==typeof d.getTimezoneOffset&&b.push(H("u_tz",-d.getTimezoneOffset()));c&&("function"==typeof c.javaEnabled&&b.push(H("u_java",c.javaEnabled())),c.plugins&&b.push(H("u_nplug",c.plugins.length)),c.mimeTypes&&b.push(H("u_nmime",c.mimeTypes.length)));
return b.join("")}function N(a,c,d){var b="";if(c){var e;if(a.top==a)e=0;else{var f=a.location.ancestorOrigins;if(f)e=f[f.length-1]==a.location.origin?1:2;else{f=a.top;try{e=!!f.location.href||""===f.location.href}catch(B){e=!1}e=e?1:2}}f="";f=d?d:1==e?a.top.location.href:a.location.href;b+=H("frm",e);b+=H("url",G(f));b+=H("ref",G(c.referrer))}return b}function O(a){return a&&a.location&&a.location.protocol&&"https:"==a.location.protocol.toString().toLowerCase()?"https:":"http:"}
function P(a){return a.google_remarketing_only?"googleads.g.doubleclick.net":a.google_conversion_domain||"www.googleadservices.com"}
function Q(a,c,d,b){var e="/?";"landing"==b.google_conversion_type&&(e="/extclk?");var e=O(a)+"//"+P(b)+"/pagead/"+[b.google_remarketing_only?"viewthroughconversion/":"conversion/",F(b.google_conversion_id),e,"random=",F(b.google_conversion_time)].join(""),f;r:{f=b.google_conversion_language;if(null!=f){f=f.toString();if(2==f.length){f=H("hl",f);break r}if(5==f.length){f=H("hl",f.substring(0,2))+H("gl",f.substring(3,5));break r}}f=""}a=[H("cv",b.google_conversion_js_version),H("fst",b.google_conversion_first_time),
H("num",b.google_conversion_snippets),H("fmt",b.google_conversion_format),H("value",b.google_conversion_value),H("currency_code",b.google_conversion_currency_code),H("label",b.google_conversion_label),H("oid",b.google_conversion_order_id),H("bg",b.google_conversion_color),f,H("guid","ON"),H("disvt",b.google_disable_viewthrough),H("is_call",b.google_is_call),H("eid",D()),L(b),M(a,c,b.google_conversion_date),J(b),N(a,d,b.google_conversion_page_url),b.google_remarketing_for_search&&!b.google_conversion_domain?
"&srr=n":""].join("");return e+a}function R(){var a=S,c=document,d=T,b;b=O(a)+"//www.google.com/ads/user-lists/"+[F(d.google_conversion_id),"/?random=",Math.floor(1E9*Math.random())].join("");return b+=[H("label",d.google_conversion_label),H("fmt","3"),N(a,c,d.google_conversion_page_url)].join("")}
function U(a){return{ar:1,bg:1,cs:1,da:1,de:1,el:1,en_AU:1,en_US:1,en_GB:1,es:1,et:1,fi:1,fr:1,hi:1,hr:1,hu:1,id:1,is:1,it:1,iw:1,ja:1,ko:1,lt:1,nl:1,no:1,pl:1,pt_BR:1,pt_PT:1,ro:1,ru:1,sk:1,sl:1,sr:1,sv:1,th:1,tl:1,tr:1,vi:1,zh_CN:1,zh_TW:1}[a]?a+".html":"en_US.html"}
function V(){var a=S,c=navigator,d=document,b=S;3!=b.google_conversion_format||b.google_remarketing_only||b.google_conversion_domain||A&&C();var e=A?A.c(1):"",c=Q(a,c,d,b),d=function(a,b,c){return'<img height="'+c+'" width="'+b+'" border="0" alt="" src="'+a+'" />'};return 0==b.google_conversion_format&&null==b.google_conversion_domain?'<a href="'+(O(a)+"//services.google.com/sitestats/"+U(b.google_conversion_language)+"?cid="+F(b.google_conversion_id))+'" target="_blank">'+d(c,135,27)+"</a>":1<b.google_conversion_snippets||
3==b.google_conversion_format?"317150501"==e||"317150502"==e||"317150503"==e||"317150504"==e||"317150505"==e?d(c,1,1)+('<script src="'+c.replace(/(&|\?)fmt=3(&|$)/,"$1fmt=4&adtest=on$2")+'">\x3c/script>'):d(c,1,1):'<iframe name="google_conversion_frame" title="Google conversion frame" width="'+(2==b.google_conversion_format?200:300)+'" height="'+(2==b.google_conversion_format?26:13)+'" src="'+c+'" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no">'+
d(c.replace(/\?random=/,"?frame=0&random="),1,1)+"</iframe>"}function aa(){return new Image}function ba(){var a=T,c=R(),d=aa;"function"===typeof a.opt_image_generator&&(d=a.opt_image_generator);a=d();c+=H("async","1");a.src=c;a.onload=function(){}};var S=window;
if(S)if(null!=/[\?&;]google_debug/.exec(document.URL)){var ca=S,W=document.getElementsByTagName("head")[0];W||(W=document.createElement("head"),document.getElementsByTagName("html")[0].insertBefore(W,document.getElementsByTagName("body")[0]));var X=document.createElement("script");X.src=O(window)+"//"+P(ca)+"/pagead/conversion_debug_overlay.js";W.appendChild(X)}else{try{var Y;var Z=S;"landing"==Z.google_conversion_type||!Z.google_conversion_id||Z.google_remarketing_only&&Z.google_disable_viewthrough?Y=
!1:(Z.google_conversion_date=new Date,Z.google_conversion_time=Z.google_conversion_date.getTime(),Z.google_conversion_snippets="number"==typeof Z.google_conversion_snippets&&0<Z.google_conversion_snippets?Z.google_conversion_snippets+1:1,"number"!=typeof Z.google_conversion_first_time&&(Z.google_conversion_first_time=Z.google_conversion_time),Z.google_conversion_js_version="7",0!=Z.google_conversion_format&&1!=Z.google_conversion_format&&2!=Z.google_conversion_format&&3!=Z.google_conversion_format&&
(Z.google_conversion_format=1),A=new z(1),Y=!0);if(Y&&(document.write(V()),S.google_remarketing_for_search&&!S.google_conversion_domain)){var T=S;ba()}}catch(da){}for(var ea=S,$=0;$<E.length;$++)ea[E[$]]=null};})();
document.createElement("article");document.createElement("aside");document.createElement("audio");document.createElement("canvas");document.createElement("command");document.createElement("datalist");document.createElement("details");document.createElement("embed");document.createElement("figcaption");document.createElement("figure");document.createElement("footer");document.createElement("header");document.createElement("hgroup");document.createElement("keygen");document.createElement("mark");document.createElement("meter");document.createElement("nav");document.createElement("output");document.createElement("progress");document.createElement("rp");document.createElement("rt");document.createElement("ruby");document.createElement("section");document.createElement("source");document.createElement("summary");document.createElement("time");document.createElement("video");var Placeholders=(function(){var q=["text","search","url","tel","email","password","number","textarea"],g={live:false,hideOnFocus:false,className:"placeholderspolyfill",textColor:"#999",styleImportant:true},j=[37,38,39,40],e,d,b=new RegExp("\\b"+g.className+"\\b");function n(t){var s;if(t.createTextRange){s=t.createTextRange();s.move("character",0);s.select()}else{if(t.selectionStart){t.focus();t.setSelectionRange(0,0)}}}function l(){var s;if(this.value===this.getAttribute("placeholder")){if(!g.hideOnFocus){n(this)}else{this.className=this.className.replace(b,"");this.value="";s=this.getAttribute("data-placeholdertype");if(s){this.type=s}}}}function k(){var s;if(this.value===""){this.className=this.className+" "+g.className;this.value=this.getAttribute("placeholder");s=this.getAttribute("data-placeholdertype");if(s){this.type="text"}}}function o(){var u=this.getElementsByTagName("input"),s=this.getElementsByTagName("textarea"),t=u.length,v=t+s.length,x,y,w;for(w=0;w<v;w+=1){x=(w<t)?u[w]:s[w-t];y=x.getAttribute("placeholder");if(x.value===y){x.value=""}}}function m(s){d=this.value;return !(d===this.getAttribute("placeholder")&&j.indexOf(s.keyCode)>-1)}function a(){var s;if(this.value!==d){this.className=this.className.replace(b,"");this.value=this.value.replace(this.getAttribute("placeholder"),"");s=this.getAttribute("data-placeholdertype");if(s){this.type=s}}if(this.value===""){k.call(this);n(this)}}function h(s,u,t){if(s.addEventListener){return s.addEventListener(u,t.bind(s),false)}if(s.attachEvent){return s.attachEvent("on"+u,t.bind(s))}}function f(s){if(!g.hideOnFocus){h(s,"keydown",m);h(s,"keyup",a)}h(s,"focus",l);h(s,"blur",k)}function i(){var y=document.getElementsByTagName("input"),A=document.getElementsByTagName("textarea"),t=y.length,w=t+A.length,u,s,v,z,x;for(u=0;u<w;u+=1){v=(u<t)?y[u]:A[u-t];x=v.getAttribute("placeholder");if(q.indexOf(v.type)>-1){if(x){z=v.getAttribute("data-currentplaceholder");if(x!==z){if(v.value===z||v.value===x||!v.value){v.value=x;v.className=v.className+" "+g.className}if(!z){if(v.form){s=v.form;if(!s.getAttribute("data-placeholdersubmit")){h(s,"submit",o);s.setAttribute("data-placeholdersubmit","true")}}f(v)}v.setAttribute("data-currentplaceholder",x)}}}}}function c(){var x=document.getElementsByTagName("input"),z=document.getElementsByTagName("textarea"),t=x.length,w=t+z.length,u,v,s,A;for(u=0;u<w;u+=1){v=(u<t)?x[u]:z[u-t];A=v.getAttribute("placeholder");if(q.indexOf(v.type)>-1){if(A){if(v.type==="password"){try{v.type="text";v.setAttribute("data-placeholdertype","password")}catch(y){}}v.setAttribute("data-currentplaceholder",A);if(v.value===""||v.value===A){v.className=v.className+" "+g.className;v.value=A}if(v.form){s=v.form;if(!s.getAttribute("data-placeholdersubmit")){h(s,"submit",o);s.setAttribute("data-placeholdersubmit","true")}}f(v)}}}}function r(w){var z=document.createElement("input"),v,y,u,t,s;if(typeof z.placeholder==="undefined"){for(v in w){if(w.hasOwnProperty(v)){g[v]=w[v]}}y=document.createElement("style");y.type="text/css";var x=(g.styleImportant)?"!important":"";u=document.createTextNode("."+g.className+" { color:"+g.textColor+x+"; }");if(y.styleSheet){y.styleSheet.cssText=u.nodeValue}else{y.appendChild(u)}document.getElementsByTagName("head")[0].appendChild(y);if(!Array.prototype.indexOf){Array.prototype.indexOf=function(A,B){for(t=(B||0),s=this.length;t<s;t+=1){if(this[t]===A){return t}}return -1}}if(!Function.prototype.bind){Function.prototype.bind=function(A){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var E=Array.prototype.slice.call(arguments,1),D=this,B=function(){},C=function(){return D.apply(this instanceof B?this:A,E.concat(Array.prototype.slice.call(arguments)))};B.prototype=this.prototype;C.prototype=new B();return C}}c();if(g.live){e=setInterval(i,100)}return true}return false}return{init:r,refresh:i}}());
/*! jQuery v1.8.2 jquery.com | jquery.org/license */
(function(a,b){function G(a){var b=F[a]={};return p.each(a.split(s),function(a,c){b[c]=!0}),b}function J(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(I,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:+d+""===d?+d:H.test(d)?p.parseJSON(d):d}catch(f){}p.data(a,c,d)}else{d=b}}return d}function K(a){var b;for(b in a){if(b==="data"&&p.isEmptyObject(a[b])){continue}if(b!=="toJSON"){return !1}}return !0}function ba(){return !1}function bb(){return !0}function bh(a){return !a||!a.parentNode||a.parentNode.nodeType===11}function bi(a,b){do{a=a[b]}while(a&&a.nodeType!==1);return a}function bj(a,b,c){b=b||0;if(p.isFunction(b)){return p.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c})}if(b.nodeType){return p.grep(a,function(a,d){return a===b===c})}if(typeof b=="string"){var d=p.grep(a,function(a){return a.nodeType===1});if(be.test(b)){return p.filter(b,d,!c)}b=p.filter(b,d)}return p.grep(a,function(a,d){return p.inArray(a,b)>=0===c})}function bk(a){var b=bl.split("|"),c=a.createDocumentFragment();if(c.createElement){while(b.length){c.createElement(b.pop())}}return c}function bC(a,b){return a.getElementsByTagName(b)[0]||a.appendChild(a.ownerDocument.createElement(b))}function bD(a,b){if(b.nodeType!==1||!p.hasData(a)){return}var c,d,e,f=p._data(a),g=p._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h){for(d=0,e=h[c].length;d<e;d++){p.event.add(b,c,h[c][d])}}}g.data&&(g.data=p.extend({},g.data))}function bE(a,b){var c;if(b.nodeType!==1){return}b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?(b.parentNode&&(b.outerHTML=a.outerHTML),p.support.html5Clone&&a.innerHTML&&!p.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):c==="input"&&bv.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text),b.removeAttribute(p.expando)}function bF(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bG(a){bv.test(a.type)&&(a.defaultChecked=a.checked)}function bY(a,b){if(b in a){return b}var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=bW.length;while(e--){b=bW[e]+c;if(b in a){return b}}return d}function bZ(a,b){return a=b||a,p.css(a,"display")==="none"||!p.contains(a.ownerDocument,a)}function b$(a,b){var c,d,e=[],f=0,g=a.length;for(;f<g;f++){c=a[f];if(!c.style){continue}e[f]=p._data(c,"olddisplay"),b?(!e[f]&&c.style.display==="none"&&(c.style.display=""),c.style.display===""&&bZ(c)&&(e[f]=p._data(c,"olddisplay",cc(c.nodeName)))):(d=bH(c,"display"),!e[f]&&d!=="none"&&p._data(c,"olddisplay",d))}for(f=0;f<g;f++){c=a[f];if(!c.style){continue}if(!b||c.style.display==="none"||c.style.display===""){c.style.display=b?e[f]||"":"none"}}return a}function b_(a,b,c){var d=bP.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function ca(a,b,c,d){var e=c===(d?"border":"content")?4:b==="width"?1:0,f=0;for(;e<4;e+=2){c==="margin"&&(f+=p.css(a,c+bV[e],!0)),d?(c==="content"&&(f-=parseFloat(bH(a,"padding"+bV[e]))||0),c!=="margin"&&(f-=parseFloat(bH(a,"border"+bV[e]+"Width"))||0)):(f+=parseFloat(bH(a,"padding"+bV[e]))||0,c!=="padding"&&(f+=parseFloat(bH(a,"border"+bV[e]+"Width"))||0))}return f}function cb(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=!0,f=p.support.boxSizing&&p.css(a,"boxSizing")==="border-box";if(d<=0||d==null){d=bH(a,b);if(d<0||d==null){d=a.style[b]}if(bQ.test(d)){return d}e=f&&(p.support.boxSizingReliable||d===a.style[b]),d=parseFloat(d)||0}return d+ca(a,b,c||(f?"border":"content"),e)+"px"}function cc(a){if(bS[a]){return bS[a]}var b=p("<"+a+">").appendTo(e.body),c=b.css("display");b.remove();if(c==="none"||c===""){bI=e.body.appendChild(bI||p.extend(e.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!bJ||!bI.createElement){bJ=(bI.contentWindow||bI.contentDocument).document,bJ.write("<!doctype html><html><body>"),bJ.close()}b=bJ.body.appendChild(bJ.createElement(a)),c=bH(b,"display"),e.body.removeChild(bI)}return bS[a]=c,c}function ci(a,b,c,d){var e;if(p.isArray(b)){p.each(b,function(b,e){c||ce.test(a)?d(a,e):ci(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)})}else{if(!c&&p.type(b)==="object"){for(e in b){ci(a+"["+e+"]",b[e],c,d)}}else{d(a,b)}}}function cz(a){return function(b,c){typeof b!="string"&&(c=b,b="*");var d,e,f,g=b.toLowerCase().split(s),h=0,i=g.length;if(p.isFunction(c)){for(;h<i;h++){d=g[h],f=/^\+/.test(d),f&&(d=d.substr(1)||"*"),e=a[d]=a[d]||[],e[f?"unshift":"push"](c)}}}}function cA(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h,i=a[f],j=0,k=i?i.length:0,l=a===cv;for(;j<k&&(l||!h);j++){h=i[j](c,d,e),typeof h=="string"&&(!l||g[h]?h=b:(c.dataTypes.unshift(h),h=cA(a,c,d,e,h,g)))}return(l||!h)&&!g["*"]&&(h=cA(a,c,d,e,"*",g)),h}function cB(a,c){var d,e,f=p.ajaxSettings.flatOptions||{};for(d in c){c[d]!==b&&((f[d]?a:e||(e={}))[d]=c[d])}e&&p.extend(!0,a,e)}function cC(a,c,d){var e,f,g,h,i=a.contents,j=a.dataTypes,k=a.responseFields;for(f in k){f in d&&(c[k[f]]=d[f])}while(j[0]==="*"){j.shift(),e===b&&(e=a.mimeType||c.getResponseHeader("content-type"))}if(e){for(f in i){if(i[f]&&i[f].test(e)){j.unshift(f);break}}}if(j[0] in d){g=j[0]}else{for(f in d){if(!j[0]||a.converters[f+" "+j[0]]){g=f;break}h||(h=f)}g=g||h}if(g){return g!==j[0]&&j.unshift(g),d[g]}}function cD(a,b){var c,d,e,f,g=a.dataTypes.slice(),h=g[0],i={},j=0;a.dataFilter&&(b=a.dataFilter(b,a.dataType));if(g[1]){for(c in a.converters){i[c.toLowerCase()]=a.converters[c]}}for(;e=g[++j];){if(e!=="*"){if(h!=="*"&&h!==e){c=i[h+" "+e]||i["* "+e];if(!c){for(d in i){f=d.split(" ");if(f[1]===e){c=i[h+" "+f[0]]||i["* "+f[0]];if(c){c===!0?c=i[d]:i[d]!==!0&&(e=f[0],g.splice(j--,0,e));break}}}}if(c!==!0){if(c&&a["throws"]){b=c(b)}else{try{b=c(b)}catch(k){return{state:"parsererror",error:c?k:"No conversion from "+h+" to "+e}}}}}h=e}}return{state:"success",data:b}}function cL(){try{return new a.XMLHttpRequest}catch(b){}}function cM(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function cU(){return setTimeout(function(){cN=b},0),cN=p.now()}function cV(a,b){p.each(b,function(b,c){var d=(cT[b]||[]).concat(cT["*"]),e=0,f=d.length;for(;e<f;e++){if(d[e].call(a,b,c)){return}}})}function cW(a,b,c){var d,e=0,f=0,g=cS.length,h=p.Deferred().always(function(){delete i.elem}),i=function(){var b=cN||cU(),c=Math.max(0,j.startTime+j.duration-b),d=1-(c/j.duration||0),e=0,f=j.tweens.length;for(;e<f;e++){j.tweens[e].run(d)}return h.notifyWith(a,[j,d,c]),d<1&&f?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:p.extend({},b),opts:p.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:cN||cU(),duration:c.duration,tweens:[],createTween:function(b,c,d){var e=p.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(e),e},stop:function(b){var c=0,d=b?j.tweens.length:0;for(;c<d;c++){j.tweens[c].run(1)}return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;cX(k,j.opts.specialEasing);for(;e<g;e++){d=cS[e].call(j,a,k,j.opts);if(d){return d}}return cV(j,k),p.isFunction(j.opts.start)&&j.opts.start.call(a,j),p.fx.timer(p.extend(i,{anim:j,queue:j.opts.queue,elem:a})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}function cX(a,b){var c,d,e,f,g;for(c in a){d=p.camelCase(c),e=b[d],f=a[c],p.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=p.cssHooks[d];if(g&&"expand" in g){f=g.expand(f),delete a[d];for(c in f){c in a||(a[c]=f[c],b[c]=e)}}else{b[d]=e}}}function cY(a,b,c){var d,e,f,g,h,i,j,k,l=this,m=a.style,n={},o=[],q=a.nodeType&&bZ(a);c.queue||(j=p._queueHooks(a,"fx"),j.unqueued==null&&(j.unqueued=0,k=j.empty.fire,j.empty.fire=function(){j.unqueued||k()}),j.unqueued++,l.always(function(){l.always(function(){j.unqueued--,p.queue(a,"fx").length||j.empty.fire()})})),a.nodeType===1&&("height" in b||"width" in b)&&(c.overflow=[m.overflow,m.overflowX,m.overflowY],p.css(a,"display")==="inline"&&p.css(a,"float")==="none"&&(!p.support.inlineBlockNeedsLayout||cc(a.nodeName)==="inline"?m.display="inline-block":m.zoom=1)),c.overflow&&(m.overflow="hidden",p.support.shrinkWrapBlocks||l.done(function(){m.overflow=c.overflow[0],m.overflowX=c.overflow[1],m.overflowY=c.overflow[2]}));for(d in b){f=b[d];if(cP.exec(f)){delete b[d];if(f===(q?"hide":"show")){continue}o.push(d)}}g=o.length;if(g){h=p._data(a,"fxshow")||p._data(a,"fxshow",{}),q?p(a).show():l.done(function(){p(a).hide()}),l.done(function(){var b;p.removeData(a,"fxshow",!0);for(b in n){p.style(a,b,n[b])}});for(d=0;d<g;d++){e=o[d],i=l.createTween(e,q?h[e]:0),n[e]=h[e]||p.style(a,e),e in h||(h[e]=i.start,q&&(i.end=i.start,i.start=e==="width"||e==="height"?1:0))}}}function cZ(a,b,c,d,e){return new cZ.prototype.init(a,b,c,d,e)}function c$(a,b){var c,d={height:a},e=0;b=b?1:0;for(;e<4;e+=2-b){c=bV[e],d["margin"+c]=d["padding"+c]=a}return b&&(d.opacity=d.width=a),d}function da(a){return p.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}var c,d,e=a.document,f=a.location,g=a.navigator,h=a.jQuery,i=a.$,j=Array.prototype.push,k=Array.prototype.slice,l=Array.prototype.indexOf,m=Object.prototype.toString,n=Object.prototype.hasOwnProperty,o=String.prototype.trim,p=function(a,b){return new p.fn.init(a,b,c)},q=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,r=/\S/,s=/\s+/,t=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,u=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,y=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,z=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,A=/^-ms-/,B=/-([\da-z])/gi,C=function(a,b){return(b+"").toUpperCase()},D=function(){e.addEventListener?(e.removeEventListener("DOMContentLoaded",D,!1),p.ready()):e.readyState==="complete"&&(e.detachEvent("onreadystatechange",D),p.ready())},E={};p.fn=p.prototype={constructor:p,init:function(a,c,d){var f,g,h,i;if(!a){return this}if(a.nodeType){return this.context=this[0]=a,this.length=1,this}if(typeof a=="string"){a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3?f=[null,a,null]:f=u.exec(a);if(f&&(f[1]||!c)){if(f[1]){return c=c instanceof p?c[0]:c,i=c&&c.nodeType?c.ownerDocument||c:e,a=p.parseHTML(f[1],i,!0),v.test(f[1])&&p.isPlainObject(c)&&this.attr.call(a,c,!0),p.merge(this,a)}g=e.getElementById(f[2]);if(g&&g.parentNode){if(g.id!==f[2]){return d.find(a)}this.length=1,this[0]=g}return this.context=e,this.selector=a,this}return !c||c.jquery?(c||d).find(a):this.constructor(c).find(a)}return p.isFunction(a)?d.ready(a):(a.selector!==b&&(this.selector=a.selector,this.context=a.context),p.makeArray(a,this))},selector:"",jquery:"1.8.2",length:0,size:function(){return this.length},toArray:function(){return k.call(this)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=p.merge(this.constructor(),a);return d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")"),d},each:function(a,b){return p.each(this,a,b)},ready:function(a){return p.ready.promise().done(a),this},eq:function(a){return a=+a,a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(k.apply(this,arguments),"slice",k.call(arguments).join(","))},map:function(a){return this.pushStack(p.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:j,sort:[].sort,splice:[].splice},p.fn.init.prototype=p.fn,p.extend=p.fn.extend=function(){var a,c,d,e,f,g,h=arguments[0]||{},i=1,j=arguments.length,k=!1;typeof h=="boolean"&&(k=h,h=arguments[1]||{},i=2),typeof h!="object"&&!p.isFunction(h)&&(h={}),j===i&&(h=this,--i);for(;i<j;i++){if((a=arguments[i])!=null){for(c in a){d=h[c],e=a[c];if(h===e){continue}k&&e&&(p.isPlainObject(e)||(f=p.isArray(e)))?(f?(f=!1,g=d&&p.isArray(d)?d:[]):g=d&&p.isPlainObject(d)?d:{},h[c]=p.extend(k,g,e)):e!==b&&(h[c]=e)}}}return h},p.extend({noConflict:function(b){return a.$===p&&(a.$=i),b&&a.jQuery===p&&(a.jQuery=h),p},isReady:!1,readyWait:1,holdReady:function(a){a?p.readyWait++:p.ready(!0)},ready:function(a){if(a===!0?--p.readyWait:p.isReady){return}if(!e.body){return setTimeout(p.ready,1)}p.isReady=!0;if(a!==!0&&--p.readyWait>0){return}d.resolveWith(e,[p]),p.fn.trigger&&p(e).trigger("ready").off("ready")},isFunction:function(a){return p.type(a)==="function"},isArray:Array.isArray||function(a){return p.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return !isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):E[m.call(a)]||"object"},isPlainObject:function(a){if(!a||p.type(a)!=="object"||a.nodeType||p.isWindow(a)){return !1}try{if(a.constructor&&!n.call(a,"constructor")&&!n.call(a.constructor.prototype,"isPrototypeOf")){return !1}}catch(c){return !1}var d;for(d in a){}return d===b||n.call(a,d)},isEmptyObject:function(a){var b;for(b in a){return !1}return !0},error:function(a){throw new Error(a)},parseHTML:function(a,b,c){var d;return !a||typeof a!="string"?null:(typeof b=="boolean"&&(c=b,b=0),b=b||e,(d=v.exec(a))?[b.createElement(d[1])]:(d=p.buildFragment([a],b,c?null:[]),p.merge([],(d.cacheable?p.clone(d.fragment):d.fragment).childNodes)))},parseJSON:function(b){if(!b||typeof b!="string"){return null}b=p.trim(b);if(a.JSON&&a.JSON.parse){return a.JSON.parse(b)}if(w.test(b.replace(y,"@").replace(z,"]").replace(x,""))){return(new Function("return "+b))()}p.error("Invalid JSON: "+b)},parseXML:function(c){var d,e;if(!c||typeof c!="string"){return null}try{a.DOMParser?(e=new DOMParser,d=e.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(f){d=b}return(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&p.error("Invalid XML: "+c),d},noop:function(){},globalEval:function(b){b&&r.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(A,"ms-").replace(B,C)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,c,d){var e,f=0,g=a.length,h=g===b||p.isFunction(a);if(d){if(h){for(e in a){if(c.apply(a[e],d)===!1){break}}}else{for(;f<g;){if(c.apply(a[f++],d)===!1){break}}}}else{if(h){for(e in a){if(c.call(a[e],e,a[e])===!1){break}}}else{for(;f<g;){if(c.call(a[f],f,a[f++])===!1){break}}}}return a},trim:o&&!o.call(" ")?function(a){return a==null?"":o.call(a)}:function(a){return a==null?"":(a+"").replace(t,"")},makeArray:function(a,b){var c,d=b||[];return a!=null&&(c=p.type(a),a.length==null||c==="string"||c==="function"||c==="regexp"||p.isWindow(a)?j.call(d,a):p.merge(d,a)),d},inArray:function(a,b,c){var d;if(b){if(l){return l.call(b,a,c)}d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++){if(c in b&&b[c]===a){return c}}}return -1},merge:function(a,c){var d=c.length,e=a.length,f=0;if(typeof d=="number"){for(;f<d;f++){a[e++]=c[f]}}else{while(c[f]!==b){a[e++]=c[f++]}}return a.length=e,a},grep:function(a,b,c){var d,e=[],f=0,g=a.length;c=!!c;for(;f<g;f++){d=!!b(a[f],f),c!==d&&e.push(a[f])}return e},map:function(a,c,d){var e,f,g=[],h=0,i=a.length,j=a instanceof p||i!==b&&typeof i=="number"&&(i>0&&a[0]&&a[i-1]||i===0||p.isArray(a));if(j){for(;h<i;h++){e=c(a[h],h,d),e!=null&&(g[g.length]=e)}}else{for(f in a){e=c(a[f],f,d),e!=null&&(g[g.length]=e)}}return g.concat.apply([],g)},guid:1,proxy:function(a,c){var d,e,f;return typeof c=="string"&&(d=a[c],c=a,a=d),p.isFunction(a)?(e=k.call(arguments,2),f=function(){return a.apply(c,e.concat(k.call(arguments)))},f.guid=a.guid=a.guid||p.guid++,f):b},access:function(a,c,d,e,f,g,h){var i,j=d==null,k=0,l=a.length;if(d&&typeof d=="object"){for(k in d){p.access(a,c,k,d[k],1,g,e)}f=1}else{if(e!==b){i=h===b&&p.isFunction(e),j&&(i?(i=c,c=function(a,b,c){return i.call(p(a),c)}):(c.call(a,e),c=null));if(c){for(;k<l;k++){c(a[k],d,i?e.call(a[k],k,c(a[k],d)):e,h)}}f=1}}return f?a:j?c.call(a):l?c(a[0],d):g},now:function(){return(new Date).getTime()}}),p.ready.promise=function(b){if(!d){d=p.Deferred();if(e.readyState==="complete"){setTimeout(p.ready,1)}else{if(e.addEventListener){e.addEventListener("DOMContentLoaded",D,!1),a.addEventListener("load",p.ready,!1)}else{e.attachEvent("onreadystatechange",D),a.attachEvent("onload",p.ready);var c=!1;try{c=a.frameElement==null&&e.documentElement}catch(f){}c&&c.doScroll&&function g(){if(!p.isReady){try{c.doScroll("left")}catch(a){return setTimeout(g,50)}p.ready()}}()}}}return d.promise(b)},p.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){E["[object "+b+"]"]=b.toLowerCase()}),c=p(e);var F={};p.Callbacks=function(a){a=typeof a=="string"?F[a]||G(a):p.extend({},a);var c,d,e,f,g,h,i=[],j=!a.once&&[],k=function(b){c=a.memory&&b,d=!0,h=f||0,f=0,g=i.length,e=!0;for(;i&&h<g;h++){if(i[h].apply(b[0],b[1])===!1&&a.stopOnFalse){c=!1;break}}e=!1,i&&(j?j.length&&k(j.shift()):c?i=[]:l.disable())},l={add:function(){if(i){var b=i.length;(function d(b){p.each(b,function(b,c){var e=p.type(c);e==="function"&&(!a.unique||!l.has(c))?i.push(c):c&&c.length&&e!=="string"&&d(c)})})(arguments),e?g=i.length:c&&(f=b,k(c))}return this},remove:function(){return i&&p.each(arguments,function(a,b){var c;while((c=p.inArray(b,i,c))>-1){i.splice(c,1),e&&(c<=g&&g--,c<=h&&h--)}}),this},has:function(a){return p.inArray(a,i)>-1},empty:function(){return i=[],this},disable:function(){return i=j=c=b,this},disabled:function(){return !i},lock:function(){return j=b,c||l.disable(),this},locked:function(){return !j},fireWith:function(a,b){return b=b||[],b=[a,b.slice?b.slice():b],i&&(!d||j)&&(e?j.push(b):k(b)),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return !!d}};return l},p.extend({Deferred:function(a){var b=[["resolve","done",p.Callbacks("once memory"),"resolved"],["reject","fail",p.Callbacks("once memory"),"rejected"],["notify","progress",p.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return p.Deferred(function(c){p.each(b,function(b,d){var f=d[0],g=a[b];e[d[1]](p.isFunction(g)?function(){var a=g.apply(this,arguments);a&&p.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f+"With"](this===e?c:this,[a])}:c[f])}),a=null}).promise()},promise:function(a){return a!=null?p.extend(a,d):d}},e={};return d.pipe=d.then,p.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[a^1][2].disable,b[2][2].lock),e[f[0]]=g.fire,e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=k.call(arguments),d=c.length,e=d!==1||a&&p.isFunction(a.promise)?d:0,f=e===1?a:p.Deferred(),g=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?k.call(arguments):d,c===h?f.notifyWith(b,c):--e||f.resolveWith(b,c)}},h,i,j;if(d>1){h=new Array(d),i=new Array(d),j=new Array(d);for(;b<d;b++){c[b]&&p.isFunction(c[b].promise)?c[b].promise().done(g(b,j,c)).fail(f.reject).progress(g(b,i,h)):--e}}return e||f.resolveWith(j,c),f.promise()}}),p.support=function(){var b,c,d,f,g,h,i,j,k,l,m,n=e.createElement("div");n.setAttribute("className","t"),n.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",c=n.getElementsByTagName("*"),d=n.getElementsByTagName("a")[0],d.style.cssText="top:1px;float:left;opacity:.5";if(!c||!c.length){return{}}f=e.createElement("select"),g=f.appendChild(e.createElement("option")),h=n.getElementsByTagName("input")[0],b={leadingWhitespace:n.firstChild.nodeType===3,tbody:!n.getElementsByTagName("tbody").length,htmlSerialize:!!n.getElementsByTagName("link").length,style:/top/.test(d.getAttribute("style")),hrefNormalized:d.getAttribute("href")==="/a",opacity:/^0.5/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:h.value==="on",optSelected:g.selected,getSetAttribute:n.className!=="t",enctype:!!e.createElement("form").enctype,html5Clone:e.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:e.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},h.checked=!0,b.noCloneChecked=h.cloneNode(!0).checked,f.disabled=!0,b.optDisabled=!g.disabled;try{delete n.test}catch(o){b.deleteExpando=!1}!n.addEventListener&&n.attachEvent&&n.fireEvent&&(n.attachEvent("onclick",m=function(){b.noCloneEvent=!1}),n.cloneNode(!0).fireEvent("onclick"),n.detachEvent("onclick",m)),h=e.createElement("input"),h.value="t",h.setAttribute("type","radio"),b.radioValue=h.value==="t",h.setAttribute("checked","checked"),h.setAttribute("name","t"),n.appendChild(h),i=e.createDocumentFragment(),i.appendChild(n.lastChild),b.checkClone=i.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=h.checked,i.removeChild(h),i.appendChild(n);if(n.attachEvent){for(k in {submit:!0,change:!0,focusin:!0}){j="on"+k,l=j in n,l||(n.setAttribute(j,"return;"),l=typeof n[j]=="function"),b[k+"Bubbles"]=l}}return p(function(){var c,d,f,g,h="padding:0;margin:0;border:0;display:block;overflow:hidden;",i=e.getElementsByTagName("body")[0];if(!i){return}c=e.createElement("div"),c.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",i.insertBefore(c,i.firstChild),d=e.createElement("div"),c.appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",f=d.getElementsByTagName("td"),f[0].style.cssText="padding:0;margin:0;border:0;display:none",l=f[0].offsetHeight===0,f[0].style.display="",f[1].style.display="none",b.reliableHiddenOffsets=l&&f[0].offsetHeight===0,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",b.boxSizing=d.offsetWidth===4,b.doesNotIncludeMarginInBodyOffset=i.offsetTop!==1,a.getComputedStyle&&(b.pixelPosition=(a.getComputedStyle(d,null)||{}).top!=="1%",b.boxSizingReliable=(a.getComputedStyle(d,null)||{width:"4px"}).width==="4px",g=e.createElement("div"),g.style.cssText=d.style.cssText=h,g.style.marginRight=g.style.width="0",d.style.width="1px",d.appendChild(g),b.reliableMarginRight=!parseFloat((a.getComputedStyle(g,null)||{}).marginRight)),typeof d.style.zoom!="undefined"&&(d.innerHTML="",d.style.cssText=h+"width:1px;padding:1px;display:inline;zoom:1",b.inlineBlockNeedsLayout=d.offsetWidth===3,d.style.display="block",d.style.overflow="visible",d.innerHTML="<div></div>",d.firstChild.style.width="5px",b.shrinkWrapBlocks=d.offsetWidth!==3,c.style.zoom=1),i.removeChild(c),c=d=f=g=null}),i.removeChild(n),c=d=f=g=h=i=n=null,b}();var H=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,I=/([A-Z])/g;p.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(p.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){return a=a.nodeType?p.cache[a[p.expando]]:a[p.expando],!!a&&!K(a)},data:function(a,c,d,e){if(!p.acceptData(a)){return}var f,g,h=p.expando,i=typeof c=="string",j=a.nodeType,k=j?p.cache:a,l=j?a[h]:a[h]&&h;if((!l||!k[l]||!e&&!k[l].data)&&i&&d===b){return}l||(j?a[h]=l=p.deletedIds.pop()||p.guid++:l=h),k[l]||(k[l]={},j||(k[l].toJSON=p.noop));if(typeof c=="object"||typeof c=="function"){e?k[l]=p.extend(k[l],c):k[l].data=p.extend(k[l].data,c)}return f=k[l],e||(f.data||(f.data={}),f=f.data),d!==b&&(f[p.camelCase(c)]=d),i?(g=f[c],g==null&&(g=f[p.camelCase(c)])):g=f,g},removeData:function(a,b,c){if(!p.acceptData(a)){return}var d,e,f,g=a.nodeType,h=g?p.cache:a,i=g?a[p.expando]:p.expando;if(!h[i]){return}if(b){d=c?h[i]:h[i].data;if(d){p.isArray(b)||(b in d?b=[b]:(b=p.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,f=b.length;e<f;e++){delete d[b[e]]}if(!(c?K:p.isEmptyObject)(d)){return}}}if(!c){delete h[i].data;if(!K(h[i])){return}}g?p.cleanData([a],!0):p.support.deleteExpando||h!=h.window?delete h[i]:h[i]=null},_data:function(a,b,c){return p.data(a,b,c,!0)},acceptData:function(a){var b=a.nodeName&&p.noData[a.nodeName.toLowerCase()];return !b||b!==!0&&a.getAttribute("classid")===b}}),p.fn.extend({data:function(a,c){var d,e,f,g,h,i=this[0],j=0,k=null;if(a===b){if(this.length){k=p.data(i);if(i.nodeType===1&&!p._data(i,"parsedAttrs")){f=i.attributes;for(h=f.length;j<h;j++){g=f[j].name,g.indexOf("data-")||(g=p.camelCase(g.substring(5)),J(i,g,k[g]))}p._data(i,"parsedAttrs",!0)}}return k}return typeof a=="object"?this.each(function(){p.data(this,a)}):(d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!",p.access(this,function(c){if(c===b){return k=this.triggerHandler("getData"+e,[d[0]]),k===b&&i&&(k=p.data(i,a),k=J(i,a,k)),k===b&&d[1]?this.data(d[0]):k}d[1]=c,this.each(function(){var b=p(this);b.triggerHandler("setData"+e,d),p.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1))},removeData:function(a){return this.each(function(){p.removeData(this,a)})}}),p.extend({queue:function(a,b,c){var d;if(a){return b=(b||"fx")+"queue",d=p._data(a,b),c&&(!d||p.isArray(c)?d=p._data(a,b,p.makeArray(c)):d.push(c)),d||[]}},dequeue:function(a,b){b=b||"fx";var c=p.queue(a,b),d=c.length,e=c.shift(),f=p._queueHooks(a,b),g=function(){p.dequeue(a,b)};e==="inprogress"&&(e=c.shift(),d--),e&&(b==="fx"&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return p._data(a,c)||p._data(a,c,{empty:p.Callbacks("once memory").add(function(){p.removeData(a,b+"queue",!0),p.removeData(a,c,!0)})})}}),p.fn.extend({queue:function(a,c){var d=2;return typeof a!="string"&&(c=a,a="fx",d--),arguments.length<d?p.queue(this[0],a):c===b?this:this.each(function(){var b=p.queue(this,a,c);p._queueHooks(this,a),a==="fx"&&b[0]!=="inprogress"&&p.dequeue(this,a)})},dequeue:function(a){return this.each(function(){p.dequeue(this,a)})},delay:function(a,b){return a=p.fx?p.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){var d,e=1,f=p.Deferred(),g=this,h=this.length,i=function(){--e||f.resolveWith(g,[g])};typeof a!="string"&&(c=a,a=b),a=a||"fx";while(h--){d=p._data(g[h],a+"queueHooks"),d&&d.empty&&(e++,d.empty.add(i))}return i(),f.promise(c)}});var L,M,N,O=/[\t\r\n]/g,P=/\r/g,Q=/^(?:button|input)$/i,R=/^(?:button|input|object|select|textarea)$/i,S=/^a(?:rea|)$/i,T=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,U=p.support.getSetAttribute;p.fn.extend({attr:function(a,b){return p.access(this,p.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){p.removeAttr(this,a)})},prop:function(a,b){return p.access(this,p.prop,a,b,arguments.length>1)},removeProp:function(a){return a=p.propFix[a]||a,this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,f,g,h;if(p.isFunction(a)){return this.each(function(b){p(this).addClass(a.call(this,b,this.className))})}if(a&&typeof a=="string"){b=a.split(s);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1){if(!e.className&&b.length===1){e.className=a}else{f=" "+e.className+" ";for(g=0,h=b.length;g<h;g++){f.indexOf(" "+b[g]+" ")<0&&(f+=b[g]+" ")}e.className=p.trim(f)}}}}return this},removeClass:function(a){var c,d,e,f,g,h,i;if(p.isFunction(a)){return this.each(function(b){p(this).removeClass(a.call(this,b,this.className))})}if(a&&typeof a=="string"||a===b){c=(a||"").split(s);for(h=0,i=this.length;h<i;h++){e=this[h];if(e.nodeType===1&&e.className){d=(" "+e.className+" ").replace(O," ");for(f=0,g=c.length;f<g;f++){while(d.indexOf(" "+c[f]+" ")>=0){d=d.replace(" "+c[f]+" "," ")}}e.className=a?p.trim(d):""}}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";return p.isFunction(a)?this.each(function(c){p(this).toggleClass(a.call(this,c,this.className,b),b)}):this.each(function(){if(c==="string"){var e,f=0,g=p(this),h=b,i=a.split(s);while(e=i[f++]){h=d?h:!g.hasClass(e),g[h?"addClass":"removeClass"](e)}}else{if(c==="undefined"||c==="boolean"){this.className&&p._data(this,"__className__",this.className),this.className=this.className||a===!1?"":p._data(this,"__className__")||""}}})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++){if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(O," ").indexOf(b)>=0){return !0}}return !1},val:function(a){var c,d,e,f=this[0];if(!arguments.length){if(f){return c=p.valHooks[f.type]||p.valHooks[f.nodeName.toLowerCase()],c&&"get" in c&&(d=c.get(f,"value"))!==b?d:(d=f.value,typeof d=="string"?d.replace(P,""):d==null?"":d)}return}return e=p.isFunction(a),this.each(function(d){var f,g=p(this);if(this.nodeType!==1){return}e?f=a.call(this,d,g.val()):f=a,f==null?f="":typeof f=="number"?f+="":p.isArray(f)&&(f=p.map(f,function(a){return a==null?"":a+""})),c=p.valHooks[this.type]||p.valHooks[this.nodeName.toLowerCase()];if(!c||!("set" in c)||c.set(this,f,"value")===b){this.value=f}})}}),p.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return !b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,f=a.selectedIndex,g=[],h=a.options,i=a.type==="select-one";if(f<0){return null}c=i?f:0,d=i?f+1:h.length;for(;c<d;c++){e=h[c];if(e.selected&&(p.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!p.nodeName(e.parentNode,"optgroup"))){b=p(e).val();if(i){return b}g.push(b)}}return i&&!g.length&&h.length?p(h[f]).val():g},set:function(a,b){var c=p.makeArray(b);return p(a).find("option").each(function(){this.selected=p.inArray(p(this).val(),c)>=0}),c.length||(a.selectedIndex=-1),c}}},attrFn:{},attr:function(a,c,d,e){var f,g,h,i=a.nodeType;if(!a||i===3||i===8||i===2){return}if(e&&p.isFunction(p.fn[c])){return p(a)[c](d)}if(typeof a.getAttribute=="undefined"){return p.prop(a,c,d)}h=i!==1||!p.isXMLDoc(a),h&&(c=c.toLowerCase(),g=p.attrHooks[c]||(T.test(c)?M:L));if(d!==b){if(d===null){p.removeAttr(a,c);return}return g&&"set" in g&&h&&(f=g.set(a,d,c))!==b?f:(a.setAttribute(c,d+""),d)}return g&&"get" in g&&h&&(f=g.get(a,c))!==null?f:(f=a.getAttribute(c),f===null?b:f)},removeAttr:function(a,b){var c,d,e,f,g=0;if(b&&a.nodeType===1){d=b.split(s);for(;g<d.length;g++){e=d[g],e&&(c=p.propFix[e]||e,f=T.test(e),f||p.attr(a,e,""),a.removeAttribute(U?e:c),f&&c in a&&(a[c]=!1))}}},attrHooks:{type:{set:function(a,b){if(Q.test(a.nodeName)&&a.parentNode){p.error("type property can't be changed")}else{if(!p.support.radioValue&&b==="radio"&&p.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},value:{get:function(a,b){return L&&p.nodeName(a,"button")?L.get(a,b):b in a?a.value:null},set:function(a,b,c){if(L&&p.nodeName(a,"button")){return L.set(a,b,c)}a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,f,g,h=a.nodeType;if(!a||h===3||h===8||h===2){return}return g=h!==1||!p.isXMLDoc(a),g&&(c=p.propFix[c]||c,f=p.propHooks[c]),d!==b?f&&"set" in f&&(e=f.set(a,d,c))!==b?e:a[c]=d:f&&"get" in f&&(e=f.get(a,c))!==null?e:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):R.test(a.nodeName)||S.test(a.nodeName)&&a.href?0:b}}}}),M={get:function(a,c){var d,e=p.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;return b===!1?p.removeAttr(a,c):(d=p.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase())),c}},U||(N={name:!0,id:!0,coords:!0},L=p.valHooks.button={get:function(a,c){var d;return d=a.getAttributeNode(c),d&&(N[c]?d.value!=="":d.specified)?d.value:b},set:function(a,b,c){var d=a.getAttributeNode(c);return d||(d=e.createAttribute(c),a.setAttributeNode(d)),d.value=b+""}},p.each(["width","height"],function(a,b){p.attrHooks[b]=p.extend(p.attrHooks[b],{set:function(a,c){if(c===""){return a.setAttribute(b,"auto"),c}}})}),p.attrHooks.contenteditable={get:L.get,set:function(a,b,c){b===""&&(b="false"),L.set(a,b,c)}}),p.support.hrefNormalized||p.each(["href","src","width","height"],function(a,c){p.attrHooks[c]=p.extend(p.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),p.support.style||(p.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=b+""}}),p.support.optSelected||(p.propHooks.selected=p.extend(p.propHooks.selected,{get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}})),p.support.enctype||(p.propFix.enctype="encoding"),p.support.checkOn||p.each(["radio","checkbox"],function(){p.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),p.each(["radio","checkbox"],function(){p.valHooks[this]=p.extend(p.valHooks[this],{set:function(a,b){if(p.isArray(b)){return a.checked=p.inArray(p(a).val(),b)>=0}}})});var V=/^(?:textarea|input|select)$/i,W=/^([^\.]*|)(?:\.(.+)|)$/,X=/(?:^|\s)hover(\.\S+|)\b/,Y=/^key/,Z=/^(?:mouse|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=function(a){return p.event.special.hover?a:a.replace(X,"mouseenter$1 mouseleave$1")};p.event={add:function(a,c,d,e,f){var g,h,i,j,k,l,m,n,o,q,r;if(a.nodeType===3||a.nodeType===8||!c||!d||!(g=p._data(a))){return}d.handler&&(o=d,d=o.handler,f=o.selector),d.guid||(d.guid=p.guid++),i=g.events,i||(g.events=i={}),h=g.handle,h||(g.handle=h=function(a){return typeof p!="undefined"&&(!a||p.event.triggered!==a.type)?p.event.dispatch.apply(h.elem,arguments):b},h.elem=a),c=p.trim(_(c)).split(" ");for(j=0;j<c.length;j++){k=W.exec(c[j])||[],l=k[1],m=(k[2]||"").split(".").sort(),r=p.event.special[l]||{},l=(f?r.delegateType:r.bindType)||l,r=p.event.special[l]||{},n=p.extend({type:l,origType:k[1],data:e,handler:d,guid:d.guid,selector:f,needsContext:f&&p.expr.match.needsContext.test(f),namespace:m.join(".")},o),q=i[l];if(!q){q=i[l]=[],q.delegateCount=0;if(!r.setup||r.setup.call(a,e,m,h)===!1){a.addEventListener?a.addEventListener(l,h,!1):a.attachEvent&&a.attachEvent("on"+l,h)}}r.add&&(r.add.call(a,n),n.handler.guid||(n.handler.guid=d.guid)),f?q.splice(q.delegateCount++,0,n):q.push(n),p.event.global[l]=!0}a=null},global:{},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,q,r=p.hasData(a)&&p._data(a);if(!r||!(m=r.events)){return}b=p.trim(_(b||"")).split(" ");for(f=0;f<b.length;f++){g=W.exec(b[f])||[],h=i=g[1],j=g[2];if(!h){for(h in m){p.event.remove(a,h+b[f],c,d,!0)}continue}n=p.event.special[h]||{},h=(d?n.delegateType:n.bindType)||h,o=m[h]||[],k=o.length,j=j?new RegExp("(^|\\.)"+j.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(l=0;l<o.length;l++){q=o[l],(e||i===q.origType)&&(!c||c.guid===q.guid)&&(!j||j.test(q.namespace))&&(!d||d===q.selector||d==="**"&&q.selector)&&(o.splice(l--,1),q.selector&&o.delegateCount--,n.remove&&n.remove.call(a,q))}o.length===0&&k!==o.length&&((!n.teardown||n.teardown.call(a,j,r.handle)===!1)&&p.removeEvent(a,h,r.handle),delete m[h])}p.isEmptyObject(m)&&(delete r.handle,p.removeData(a,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,f,g){if(!f||f.nodeType!==3&&f.nodeType!==8){var h,i,j,k,l,m,n,o,q,r,s=c.type||c,t=[];if($.test(s+p.event.triggered)){return}s.indexOf("!")>=0&&(s=s.slice(0,-1),i=!0),s.indexOf(".")>=0&&(t=s.split("."),s=t.shift(),t.sort());if((!f||p.event.customEvent[s])&&!p.event.global[s]){return}c=typeof c=="object"?c[p.expando]?c:new p.Event(s,c):new p.Event(s),c.type=s,c.isTrigger=!0,c.exclusive=i,c.namespace=t.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+t.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,m=s.indexOf(":")<0?"on"+s:"";if(!f){h=p.cache;for(j in h){h[j].events&&h[j].events[s]&&p.event.trigger(c,d,h[j].handle.elem,!0)}return}c.result=b,c.target||(c.target=f),d=d!=null?p.makeArray(d):[],d.unshift(c),n=p.event.special[s]||{};if(n.trigger&&n.trigger.apply(f,d)===!1){return}q=[[f,n.bindType||s]];if(!g&&!n.noBubble&&!p.isWindow(f)){r=n.delegateType||s,k=$.test(r+s)?f:f.parentNode;for(l=f;k;k=k.parentNode){q.push([k,r]),l=k}l===(f.ownerDocument||e)&&q.push([l.defaultView||l.parentWindow||a,r])}for(j=0;j<q.length&&!c.isPropagationStopped();j++){k=q[j][0],c.type=q[j][1],o=(p._data(k,"events")||{})[c.type]&&p._data(k,"handle"),o&&o.apply(k,d),o=m&&k[m],o&&p.acceptData(k)&&o.apply&&o.apply(k,d)===!1&&c.preventDefault()}return c.type=s,!g&&!c.isDefaultPrevented()&&(!n._default||n._default.apply(f.ownerDocument,d)===!1)&&(s!=="click"||!p.nodeName(f,"a"))&&p.acceptData(f)&&m&&f[s]&&(s!=="focus"&&s!=="blur"||c.target.offsetWidth!==0)&&!p.isWindow(f)&&(l=f[m],l&&(f[m]=null),p.event.triggered=s,f[s](),p.event.triggered=b,l&&(f[m]=l)),c.result}return},dispatch:function(c){c=p.event.fix(c||a.event);var d,e,f,g,h,i,j,l,m,n,o=(p._data(this,"events")||{})[c.type]||[],q=o.delegateCount,r=k.call(arguments),s=!c.exclusive&&!c.namespace,t=p.event.special[c.type]||{},u=[];r[0]=c,c.delegateTarget=this;if(t.preDispatch&&t.preDispatch.call(this,c)===!1){return}if(q&&(!c.button||c.type!=="click")){for(f=c.target;f!=this;f=f.parentNode||this){if(f.disabled!==!0||c.type!=="click"){h={},j=[];for(d=0;d<q;d++){l=o[d],m=l.selector,h[m]===b&&(h[m]=l.needsContext?p(m,this).index(f)>=0:p.find(m,this,null,[f]).length),h[m]&&j.push(l)}j.length&&u.push({elem:f,matches:j})}}}o.length>q&&u.push({elem:this,matches:o.slice(q)});for(d=0;d<u.length&&!c.isPropagationStopped();d++){i=u[d],c.currentTarget=i.elem;for(e=0;e<i.matches.length&&!c.isImmediatePropagationStopped();e++){l=i.matches[e];if(s||!c.namespace&&!l.namespace||c.namespace_re&&c.namespace_re.test(l.namespace)){c.data=l.data,c.handleObj=l,g=((p.event.special[l.origType]||{}).handle||l.handler).apply(i.elem,r),g!==b&&(c.result=g,g===!1&&(c.preventDefault(),c.stopPropagation()))}}}return t.postDispatch&&t.postDispatch.call(this,c),c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,c){var d,f,g,h=c.button,i=c.fromElement;return a.pageX==null&&c.clientX!=null&&(d=a.target.ownerDocument||e,f=d.documentElement,g=d.body,a.pageX=c.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=c.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?c.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0),a}},fix:function(a){if(a[p.expando]){return a}var b,c,d=a,f=p.event.fixHooks[a.type]||{},g=f.props?this.props.concat(f.props):this.props;a=p.Event(d);for(b=g.length;b;){c=g[--b],a[c]=d[c]}return a.target||(a.target=d.srcElement||e),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,f.filter?f.filter(a,d):a},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){p.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=p.extend(new p.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?p.event.trigger(e,null,b):p.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},p.event.handle=p.event.dispatch,p.removeEvent=e.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]=="undefined"&&(a[d]=null),a.detachEvent(d,c))},p.Event=function(a,b){if(this instanceof p.Event){a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.PreventDefault&&a.getPreventDefault()?bb:ba):this.type=a,b&&p.extend(this,b),this.timeStamp=a&&a.timeStamp||p.now(),this[p.expando]=!0}else{return new p.Event(a,b)}},p.Event.prototype={preventDefault:function(){this.isDefaultPrevented=bb;var a=this.originalEvent;if(!a){return}a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=bb;var a=this.originalEvent;if(!a){return}a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()},isDefaultPrevented:ba,isPropagationStopped:ba,isImmediatePropagationStopped:ba},p.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){p.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj,g=f.selector;if(!e||e!==d&&!p.contains(d,e)){a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b}return c}}}),p.support.submitBubbles||(p.event.special.submit={setup:function(){if(p.nodeName(this,"form")){return !1}p.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=p.nodeName(c,"input")||p.nodeName(c,"button")?c.form:b;d&&!p._data(d,"_submit_attached")&&(p.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),p._data(d,"_submit_attached",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&p.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(p.nodeName(this,"form")){return !1}p.event.remove(this,"._submit")}}),p.support.changeBubbles||(p.event.special.change={setup:function(){if(V.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio"){p.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),p.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),p.event.simulate("change",this,a,!0)})}return !1}p.event.add(this,"beforeactivate._change",function(a){var b=a.target;V.test(b.nodeName)&&!p._data(b,"_change_attached")&&(p.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&p.event.simulate("change",this.parentNode,a,!0)}),p._data(b,"_change_attached",!0))})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox"){return a.handleObj.handler.apply(this,arguments)}},teardown:function(){return p.event.remove(this,"._change"),!V.test(this.nodeName)}}),p.support.focusinBubbles||p.each({focus:"focusin",blur:"focusout"},function(a,b){var c=0,d=function(a){p.event.simulate(b,a.target,p.event.fix(a),!0)};p.event.special[b]={setup:function(){c++===0&&e.addEventListener(a,d,!0)},teardown:function(){--c===0&&e.removeEventListener(a,d,!0)}}}),p.fn.extend({on:function(a,c,d,e,f){var g,h;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(h in a){this.on(h,c,d,a[h],f)}return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1){e=ba}else{if(!e){return this}}return f===1&&(g=e,e=function(a){return p().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=p.guid++)),this.each(function(){p.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){var e,f;if(a&&a.preventDefault&&a.handleObj){return e=a.handleObj,p(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler),this}if(typeof a=="object"){for(f in a){this.off(f,c,a[f])}return this}if(c===!1||typeof c=="function"){d=c,c=b}return d===!1&&(d=ba),this.each(function(){p.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){return p(this.context).on(a,this.selector,b,c),this},die:function(a,b){return p(this.context).off(a,this.selector||"**",b),this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length===1?this.off(a,"**"):this.off(b,a||"**",c)},trigger:function(a,b){return this.each(function(){p.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){return p.event.trigger(a,b,this[0],!0)}},toggle:function(a){var b=arguments,c=a.guid||p.guid++,d=0,e=function(c){var e=(p._data(this,"lastToggle"+a.guid)||0)%d;return p._data(this,"lastToggle"+a.guid,e+1),c.preventDefault(),b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length){b[d++].guid=c}return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){p.fn[b]=function(a,c){return c==null&&(c=a,a=null),arguments.length>0?this.on(b,null,a,c):this.trigger(b)},Y.test(b)&&(p.event.fixHooks[b]=p.event.keyHooks),Z.test(b)&&(p.event.fixHooks[b]=p.event.mouseHooks)}),function(a,b){function bc(a,b,c,d){c=c||[],b=b||r;var e,f,i,j,k=b.nodeType;if(!a||typeof a!="string"){return c}if(k!==1&&k!==9){return[]}i=g(b);if(!i&&!d){if(e=P.exec(a)){if(j=e[1]){if(k===9){f=b.getElementById(j);if(!f||!f.parentNode){return c}if(f.id===j){return c.push(f),c}}else{if(b.ownerDocument&&(f=b.ownerDocument.getElementById(j))&&h(b,f)&&f.id===j){return c.push(f),c}}}else{if(e[2]){return w.apply(c,x.call(b.getElementsByTagName(a),0)),c}if((j=e[3])&&_&&b.getElementsByClassName){return w.apply(c,x.call(b.getElementsByClassName(j),0)),c}}}}return bp(a.replace(L,"$1"),b,c,d,i)}function bd(a){return function(b){var c=b.nodeName.toLowerCase();return c==="input"&&b.type===a}}function be(a){return function(b){var c=b.nodeName.toLowerCase();return(c==="input"||c==="button")&&b.type===a}}function bf(a){return z(function(b){return b=+b,z(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--){c[e=f[g]]&&(c[e]=!(d[e]=c[e]))}})})}function bg(a,b,c){if(a===b){return c}var d=a.nextSibling;while(d){if(d===b){return -1}d=d.nextSibling}return 1}function bh(a,b){var c,d,f,g,h,i,j,k=C[o][a];if(k){return b?0:k.slice(0)}h=a,i=[],j=e.preFilter;while(h){if(!c||(d=M.exec(h))){d&&(h=h.slice(d[0].length)),i.push(f=[])}c=!1;if(d=N.exec(h)){f.push(c=new q(d.shift())),h=h.slice(c.length),c.type=d[0].replace(L," ")}for(g in e.filter){(d=W[g].exec(h))&&(!j[g]||(d=j[g](d,r,!0)))&&(f.push(c=new q(d.shift())),h=h.slice(c.length),c.type=g,c.matches=d)}if(!c){break}}return b?h.length:h?bc.error(a):C(a,i).slice(0)}function bi(a,b,d){var e=b.dir,f=d&&b.dir==="parentNode",g=u++;return b.first?function(b,c,d){while(b=b[e]){if(f||b.nodeType===1){return a(b,c,d)}}}:function(b,d,h){if(!h){var i,j=t+" "+g+" ",k=j+c;while(b=b[e]){if(f||b.nodeType===1){if((i=b[o])===k){return b.sizset}if(typeof i=="string"&&i.indexOf(j)===0){if(b.sizset){return b}}else{b[o]=k;if(a(b,d,h)){return b.sizset=!0,b}b.sizset=!1}}}}else{while(b=b[e]){if(f||b.nodeType===1){if(a(b,d,h)){return b}}}}}}function bj(a){return a.length>1?function(b,c,d){var e=a.length;while(e--){if(!a[e](b,c,d)){return !1}}return !0}:a[0]}function bk(a,b,c,d,e){var f,g=[],h=0,i=a.length,j=b!=null;for(;h<i;h++){if(f=a[h]){if(!c||c(f,d,e)){g.push(f),j&&b.push(h)}}}return g}function bl(a,b,c,d,e,f){return d&&!d[o]&&(d=bl(d)),e&&!e[o]&&(e=bl(e,f)),z(function(f,g,h,i){if(f&&e){return}var j,k,l,m=[],n=[],o=g.length,p=f||bo(b||"*",h.nodeType?[h]:h,[],f),q=a&&(f||!b)?bk(p,m,a,h,i):p,r=c?e||(f?a:o||d)?[]:g:q;c&&c(q,r,h,i);if(d){l=bk(r,n),d(l,[],h,i),j=l.length;while(j--){if(k=l[j]){r[n[j]]=!(q[n[j]]=k)}}}if(f){j=a&&r.length;while(j--){if(k=r[j]){f[m[j]]=!(g[m[j]]=k)}}}else{r=bk(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):w.apply(g,r)}})}function bm(a){var b,c,d,f=a.length,g=e.relative[a[0].type],h=g||e.relative[" "],i=g?1:0,j=bi(function(a){return a===b},h,!0),k=bi(function(a){return y.call(b,a)>-1},h,!0),m=[function(a,c,d){return !g&&(d||c!==l)||((b=c).nodeType?j(a,c,d):k(a,c,d))}];for(;i<f;i++){if(c=e.relative[a[i].type]){m=[bi(bj(m),c)]}else{c=e.filter[a[i].type].apply(null,a[i].matches);if(c[o]){d=++i;for(;d<f;d++){if(e.relative[a[d].type]){break}}return bl(i>1&&bj(m),i>1&&a.slice(0,i-1).join("").replace(L,"$1"),c,i<d&&bm(a.slice(i,d)),d<f&&bm(a=a.slice(d)),d<f&&a.join(""))}m.push(c)}}return bj(m)}function bn(a,b){var d=b.length>0,f=a.length>0,g=function(h,i,j,k,m){var n,o,p,q=[],s=0,u="0",x=h&&[],y=m!=null,z=l,A=h||f&&e.find.TAG("*",m&&i.parentNode||i),B=t+=z==null?1:Math.E;y&&(l=i!==r&&i,c=g.el);for(;(n=A[u])!=null;u++){if(f&&n){for(o=0;p=a[o];o++){if(p(n,i,j)){k.push(n);break}}y&&(t=B,c=++g.el)}d&&((n=!p&&n)&&s--,h&&x.push(n))}s+=u;if(d&&u!==s){for(o=0;p=b[o];o++){p(x,q,i,j)}if(h){if(s>0){while(u--){!x[u]&&!q[u]&&(q[u]=v.call(k))}}q=bk(q)}w.apply(k,q),y&&!h&&q.length>0&&s+b.length>1&&bc.uniqueSort(k)}return y&&(t=B,l=z),x};return g.el=0,d?z(g):g}function bo(a,b,c,d){var e=0,f=b.length;for(;e<f;e++){bc(a,b[e],c,d)}return c}function bp(a,b,c,d,f){var g,h,j,k,l,m=bh(a),n=m.length;if(!d&&m.length===1){h=m[0]=m[0].slice(0);if(h.length>2&&(j=h[0]).type==="ID"&&b.nodeType===9&&!f&&e.relative[h[1].type]){b=e.find.ID(j.matches[0].replace(V,""),b,f)[0];if(!b){return c}a=a.slice(h.shift().length)}for(g=W.POS.test(a)?-1:h.length-1;g>=0;g--){j=h[g];if(e.relative[k=j.type]){break}if(l=e.find[k]){if(d=l(j.matches[0].replace(V,""),R.test(h[0].type)&&b.parentNode||b,f)){h.splice(g,1),a=d.length&&h.join("");if(!a){return w.apply(c,x.call(d,0)),c}break}}}}return i(a,m)(d,b,f,c,R.test(a)),c}function bq(){}var c,d,e,f,g,h,i,j,k,l,m=!0,n="undefined",o=("sizcache"+Math.random()).replace(".",""),q=String,r=a.document,s=r.documentElement,t=0,u=0,v=[].pop,w=[].push,x=[].slice,y=[].indexOf||function(a){var b=0,c=this.length;for(;b<c;b++){if(this[b]===a){return b}}return -1},z=function(a,b){return a[o]=b==null||b,a},A=function(){var a={},b=[];return z(function(c,d){return b.push(c)>e.cacheLength&&delete a[b.shift()],a[c]=d},a)},B=A(),C=A(),D=A(),E="[\\x20\\t\\r\\n\\f]",F="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",G=F.replace("w","w#"),H="([*^$|!~]?=)",I="\\["+E+"*("+F+")"+E+"*(?:"+H+E+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+G+")|)|)"+E+"*\\]",J=":("+F+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+I+")|[^:]|\\\\.)*|.*))\\)|)",K=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+E+"*((?:-\\d)?\\d*)"+E+"*\\)|)(?=[^-]|$)",L=new RegExp("^"+E+"+|((?:^|[^\\\\])(?:\\\\.)*)"+E+"+$","g"),M=new RegExp("^"+E+"*,"+E+"*"),N=new RegExp("^"+E+"*([\\x20\\t\\r\\n\\f>+~])"+E+"*"),O=new RegExp(J),P=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,Q=/^:not/,R=/[\x20\t\r\n\f]*[+~]/,S=/:not\($/,T=/h\d/i,U=/input|select|textarea|button/i,V=/\\(?!\\)/g,W={ID:new RegExp("^#("+F+")"),CLASS:new RegExp("^\\.("+F+")"),NAME:new RegExp("^\\[name=['\"]?("+F+")['\"]?\\]"),TAG:new RegExp("^("+F.replace("w","w*")+")"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+J),POS:new RegExp(K,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+E+"*(even|odd|(([+-]|)(\\d*)n|)"+E+"*(?:([+-]|)"+E+"*(\\d+)|))"+E+"*\\)|)","i"),needsContext:new RegExp("^"+E+"*[>+~]|"+K,"i")},X=function(a){var b=r.createElement("div");try{return a(b)}catch(c){return !1}finally{b=null}},Y=X(function(a){return a.appendChild(r.createComment("")),!a.getElementsByTagName("*").length}),Z=X(function(a){return a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!==n&&a.firstChild.getAttribute("href")==="#"}),$=X(function(a){a.innerHTML="<select></select>";var b=typeof a.lastChild.getAttribute("multiple");return b!=="boolean"&&b!=="string"}),_=X(function(a){return a.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!a.getElementsByClassName||!a.getElementsByClassName("e").length?!1:(a.lastChild.className="e",a.getElementsByClassName("e").length===2)}),ba=X(function(a){a.id=o+0,a.innerHTML="<a name='"+o+"'></a><div name='"+o+"'></div>",s.insertBefore(a,s.firstChild);var b=r.getElementsByName&&r.getElementsByName(o).length===2+r.getElementsByName(o+0).length;return d=!r.getElementById(o),s.removeChild(a),b});try{x.call(s.childNodes,0)[0].nodeType}catch(bb){x=function(a){var b,c=[];for(;b=this[a];a++){c.push(b)}return c}}bc.matches=function(a,b){return bc(a,null,null,b)},bc.matchesSelector=function(a,b){return bc(b,null,null,[a]).length>0},f=bc.getText=function(a){var b,c="",d=0,e=a.nodeType;if(e){if(e===1||e===9||e===11){if(typeof a.textContent=="string"){return a.textContent}for(a=a.firstChild;a;a=a.nextSibling){c+=f(a)}}else{if(e===3||e===4){return a.nodeValue}}}else{for(;b=a[d];d++){c+=f(b)}}return c},g=bc.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?b.nodeName!=="HTML":!1},h=bc.contains=s.contains?function(a,b){var c=a.nodeType===9?a.documentElement:a,d=b&&b.parentNode;return a===d||!!(d&&d.nodeType===1&&c.contains&&c.contains(d))}:s.compareDocumentPosition?function(a,b){return b&&!!(a.compareDocumentPosition(b)&16)}:function(a,b){while(b=b.parentNode){if(b===a){return !0}}return !1},bc.attr=function(a,b){var c,d=g(a);return d||(b=b.toLowerCase()),(c=e.attrHandle[b])?c(a):d||$?a.getAttribute(b):(c=a.getAttributeNode(b),c?typeof a[b]=="boolean"?a[b]?b:null:c.specified?c.value:null:null)},e=bc.selectors={cacheLength:50,createPseudo:z,match:W,attrHandle:Z?{}:{href:function(a){return a.getAttribute("href",2)},type:function(a){return a.getAttribute("type")}},find:{ID:d?function(a,b,c){if(typeof b.getElementById!==n&&!c){var d=b.getElementById(a);return d&&d.parentNode?[d]:[]}}:function(a,c,d){if(typeof c.getElementById!==n&&!d){var e=c.getElementById(a);return e?e.id===a||typeof e.getAttributeNode!==n&&e.getAttributeNode("id").value===a?[e]:b:[]}},TAG:Y?function(a,b){if(typeof b.getElementsByTagName!==n){return b.getElementsByTagName(a)}}:function(a,b){var c=b.getElementsByTagName(a);if(a==="*"){var d,e=[],f=0;for(;d=c[f];f++){d.nodeType===1&&e.push(d)}return e}return c},NAME:ba&&function(a,b){if(typeof b.getElementsByName!==n){return b.getElementsByName(name)}},CLASS:_&&function(a,b,c){if(typeof b.getElementsByClassName!==n&&!c){return b.getElementsByClassName(a)}}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(V,""),a[3]=(a[4]||a[5]||"").replace(V,""),a[2]==="~="&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),a[1]==="nth"?(a[2]||bc.error(a[0]),a[3]=+(a[3]?a[4]+(a[5]||1):2*(a[2]==="even"||a[2]==="odd")),a[4]=+(a[6]+a[7]||a[2]==="odd")):a[2]&&bc.error(a[0]),a},PSEUDO:function(a){var b,c;if(W.CHILD.test(a[0])){return null}if(a[3]){a[2]=a[3]}else{if(b=a[4]){O.test(b)&&(c=bh(b,!0))&&(c=b.indexOf(")",b.length-c)-b.length)&&(b=b.slice(0,c),a[0]=a[0].slice(0,c)),a[2]=b}}return a.slice(0,3)}},filter:{ID:d?function(a){return a=a.replace(V,""),function(b){return b.getAttribute("id")===a}}:function(a){return a=a.replace(V,""),function(b){var c=typeof b.getAttributeNode!==n&&b.getAttributeNode("id");return c&&c.value===a}},TAG:function(a){return a==="*"?function(){return !0}:(a=a.replace(V,"").toLowerCase(),function(b){return b.nodeName&&b.nodeName.toLowerCase()===a})},CLASS:function(a){var b=B[o][a];return b||(b=B(a,new RegExp("(^|"+E+")"+a+"("+E+"|$)"))),function(a){return b.test(a.className||typeof a.getAttribute!==n&&a.getAttribute("class")||"")}},ATTR:function(a,b,c){return function(d,e){var f=bc.attr(d,a);return f==null?b==="!=":b?(f+="",b==="="?f===c:b==="!="?f!==c:b==="^="?c&&f.indexOf(c)===0:b==="*="?c&&f.indexOf(c)>-1:b==="$="?c&&f.substr(f.length-c.length)===c:b==="~="?(" "+f+" ").indexOf(c)>-1:b==="|="?f===c||f.substr(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d){return a==="nth"?function(a){var b,e,f=a.parentNode;if(c===1&&d===0){return !0}if(f){e=0;for(b=f.firstChild;b;b=b.nextSibling){if(b.nodeType===1){e++;if(a===b){break}}}}return e-=d,e===c||e%c===0&&e/c>=0}:function(b){var c=b;switch(a){case"only":case"first":while(c=c.previousSibling){if(c.nodeType===1){return !1}}if(a==="first"){return !0}c=b;case"last":while(c=c.nextSibling){if(c.nodeType===1){return !1}}return !0}}},PSEUDO:function(a,b){var c,d=e.pseudos[a]||e.setFilters[a.toLowerCase()]||bc.error("unsupported pseudo: "+a);return d[o]?d(b):d.length>1?(c=[a,a,"",b],e.setFilters.hasOwnProperty(a.toLowerCase())?z(function(a,c){var e,f=d(a,b),g=f.length;while(g--){e=y.call(a,f[g]),a[e]=!(c[e]=f[g])}}):function(a){return d(a,0,c)}):d}},pseudos:{not:z(function(a){var b=[],c=[],d=i(a.replace(L,"$1"));return d[o]?z(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--){if(f=g[h]){a[h]=!(b[h]=f)}}}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:z(function(a){return function(b){return bc(a,b).length>0}}),contains:z(function(a){return function(b){return(b.textContent||b.innerText||f(b)).indexOf(a)>-1}}),enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&!!a.checked||b==="option"&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},parent:function(a){return !e.pseudos.empty(a)},empty:function(a){var b;a=a.firstChild;while(a){if(a.nodeName>"@"||(b=a.nodeType)===3||b===4){return !1}a=a.nextSibling}return !0},header:function(a){return T.test(a.nodeName)},text:function(a){var b,c;return a.nodeName.toLowerCase()==="input"&&(b=a.type)==="text"&&((c=a.getAttribute("type"))==null||c.toLowerCase()===b)},radio:bd("radio"),checkbox:bd("checkbox"),file:bd("file"),password:bd("password"),image:bd("image"),submit:be("submit"),reset:be("reset"),button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&a.type==="button"||b==="button"},input:function(a){return U.test(a.nodeName)},focus:function(a){var b=a.ownerDocument;return a===b.activeElement&&(!b.hasFocus||b.hasFocus())&&(!!a.type||!!a.href)},active:function(a){return a===a.ownerDocument.activeElement},first:bf(function(a,b,c){return[0]}),last:bf(function(a,b,c){return[b-1]}),eq:bf(function(a,b,c){return[c<0?c+b:c]}),even:bf(function(a,b,c){for(var d=0;d<b;d+=2){a.push(d)}return a}),odd:bf(function(a,b,c){for(var d=1;d<b;d+=2){a.push(d)}return a}),lt:bf(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;){a.push(d)}return a}),gt:bf(function(a,b,c){for(var d=c<0?c+b:c;++d<b;){a.push(d)}return a})}},j=s.compareDocumentPosition?function(a,b){return a===b?(k=!0,0):(!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition:a.compareDocumentPosition(b)&4)?-1:1}:function(a,b){if(a===b){return k=!0,0}if(a.sourceIndex&&b.sourceIndex){return a.sourceIndex-b.sourceIndex}var c,d,e=[],f=[],g=a.parentNode,h=b.parentNode,i=g;if(g===h){return bg(a,b)}if(!g){return -1}if(!h){return 1}while(i){e.unshift(i),i=i.parentNode}i=h;while(i){f.unshift(i),i=i.parentNode}c=e.length,d=f.length;for(var j=0;j<c&&j<d;j++){if(e[j]!==f[j]){return bg(e[j],f[j])}}return j===c?bg(a,f[j],-1):bg(e[j],b,1)},[0,0].sort(j),m=!k,bc.uniqueSort=function(a){var b,c=1;k=m,a.sort(j);if(k){for(;b=a[c];c++){b===a[c-1]&&a.splice(c--,1)}}return a},bc.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},i=bc.compile=function(a,b){var c,d=[],e=[],f=D[o][a];if(!f){b||(b=bh(a)),c=b.length;while(c--){f=bm(b[c]),f[o]?d.push(f):e.push(f)}f=D(a,bn(e,d))}return f},r.querySelectorAll&&function(){var a,b=bp,c=/'|\\/g,d=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,e=[":focus"],f=[":active",":focus"],h=s.matchesSelector||s.mozMatchesSelector||s.webkitMatchesSelector||s.oMatchesSelector||s.msMatchesSelector;X(function(a){a.innerHTML="<select><option selected=''></option></select>",a.querySelectorAll("[selected]").length||e.push("\\["+E+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),a.querySelectorAll(":checked").length||e.push(":checked")}),X(function(a){a.innerHTML="<p test=''></p>",a.querySelectorAll("[test^='']").length&&e.push("[*^$]="+E+"*(?:\"\"|'')"),a.innerHTML="<input type='hidden'/>",a.querySelectorAll(":enabled").length||e.push(":enabled",":disabled")}),e=new RegExp(e.join("|")),bp=function(a,d,f,g,h){if(!g&&!h&&(!e||!e.test(a))){var i,j,k=!0,l=o,m=d,n=d.nodeType===9&&a;if(d.nodeType===1&&d.nodeName.toLowerCase()!=="object"){i=bh(a),(k=d.getAttribute("id"))?l=k.replace(c,"\\$&"):d.setAttribute("id",l),l="[id='"+l+"'] ",j=i.length;while(j--){i[j]=l+i[j].join("")}m=R.test(a)&&d.parentNode||d,n=i.join(",")}if(n){try{return w.apply(f,x.call(m.querySelectorAll(n),0)),f}catch(p){}finally{k||d.removeAttribute("id")}}}return b(a,d,f,g,h)},h&&(X(function(b){a=h.call(b,"div");try{h.call(b,"[test!='']:sizzle"),f.push("!=",J)}catch(c){}}),f=new RegExp(f.join("|")),bc.matchesSelector=function(b,c){c=c.replace(d,"='$1']");if(!g(b)&&!f.test(c)&&(!e||!e.test(c))){try{var i=h.call(b,c);if(i||a||b.document&&b.document.nodeType!==11){return i}}catch(j){}}return bc(c,null,null,[b]).length>0})}(),e.pseudos.nth=e.pseudos.eq,e.filters=bq.prototype=e.pseudos,e.setFilters=new bq,bc.attr=p.attr,p.find=bc,p.expr=bc.selectors,p.expr[":"]=p.expr.pseudos,p.unique=bc.uniqueSort,p.text=bc.getText,p.isXMLDoc=bc.isXML,p.contains=bc.contains}(a);var bc=/Until$/,bd=/^(?:parents|prev(?:Until|All))/,be=/^.[^:#\[\.,]*$/,bf=p.expr.match.needsContext,bg={children:!0,contents:!0,next:!0,prev:!0};p.fn.extend({find:function(a){var b,c,d,e,f,g,h=this;if(typeof a!="string"){return p(a).filter(function(){for(b=0,c=h.length;b<c;b++){if(p.contains(h[b],this)){return !0}}})}g=this.pushStack("","find",a);for(b=0,c=this.length;b<c;b++){d=g.length,p.find(a,this[b],g);if(b>0){for(e=d;e<g.length;e++){for(f=0;f<d;f++){if(g[f]===g[e]){g.splice(e--,1);break}}}}}return g},has:function(a){var b,c=p(a,this),d=c.length;return this.filter(function(){for(b=0;b<d;b++){if(p.contains(this,c[b])){return !0}}})},not:function(a){return this.pushStack(bj(this,a,!1),"not",a)},filter:function(a){return this.pushStack(bj(this,a,!0),"filter",a)},is:function(a){return !!a&&(typeof a=="string"?bf.test(a)?p(a,this.context).index(this[0])>=0:p.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c,d=0,e=this.length,f=[],g=bf.test(a)||typeof a!="string"?p(a,b||this.context):0;for(;d<e;d++){c=this[d];while(c&&c.ownerDocument&&c!==b&&c.nodeType!==11){if(g?g.index(c)>-1:p.find.matchesSelector(c,a)){f.push(c);break}c=c.parentNode}}return f=f.length>1?p.unique(f):f,this.pushStack(f,"closest",a)},index:function(a){return a?typeof a=="string"?p.inArray(this[0],p(a)):p.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(a,b){var c=typeof a=="string"?p(a,b):p.makeArray(a&&a.nodeType?[a]:a),d=p.merge(this.get(),c);return this.pushStack(bh(c[0])||bh(d[0])?d:p.unique(d))},addBack:function(a){return this.add(a==null?this.prevObject:this.prevObject.filter(a))}}),p.fn.andSelf=p.fn.addBack,p.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return p.dir(a,"parentNode")},parentsUntil:function(a,b,c){return p.dir(a,"parentNode",c)},next:function(a){return bi(a,"nextSibling")},prev:function(a){return bi(a,"previousSibling")},nextAll:function(a){return p.dir(a,"nextSibling")},prevAll:function(a){return p.dir(a,"previousSibling")},nextUntil:function(a,b,c){return p.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return p.dir(a,"previousSibling",c)},siblings:function(a){return p.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return p.sibling(a.firstChild)},contents:function(a){return p.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:p.merge([],a.childNodes)}},function(a,b){p.fn[a]=function(c,d){var e=p.map(this,b,c);return bc.test(a)||(d=c),d&&typeof d=="string"&&(e=p.filter(d,e)),e=this.length>1&&!bg[a]?p.unique(e):e,this.length>1&&bd.test(a)&&(e=e.reverse()),this.pushStack(e,a,k.call(arguments).join(","))}}),p.extend({filter:function(a,b,c){return c&&(a=":not("+a+")"),b.length===1?p.find.matchesSelector(b[0],a)?[b[0]]:[]:p.find.matches(a,b)},dir:function(a,c,d){var e=[],f=a[c];while(f&&f.nodeType!==9&&(d===b||f.nodeType!==1||!p(f).is(d))){f.nodeType===1&&e.push(f),f=f[c]}return e},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling){a.nodeType===1&&a!==b&&c.push(a)}return c}});var bl="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",bm=/ jQuery\d+="(?:null|\d+)"/g,bn=/^\s+/,bo=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bp=/<([\w:]+)/,bq=/<tbody/i,br=/<|&#?\w+;/,bs=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,bu=new RegExp("<(?:"+bl+")[\\s/>]","i"),bv=/^(?:checkbox|radio)$/,bw=/checked\s*(?:[^=]|=\s*.checked.)/i,bx=/\/(java|ecma)script/i,by=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,bz={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bA=bk(e),bB=bA.appendChild(e.createElement("div"));bz.optgroup=bz.option,bz.tbody=bz.tfoot=bz.colgroup=bz.caption=bz.thead,bz.th=bz.td,p.support.htmlSerialize||(bz._default=[1,"X<div>","</div>"]),p.fn.extend({text:function(a){return p.access(this,function(a){return a===b?p.text(this):this.empty().append((this[0]&&this[0].ownerDocument||e).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(p.isFunction(a)){return this.each(function(b){p(this).wrapAll(a.call(this,b))})}if(this[0]){var b=p(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1){a=a.firstChild}return a}).append(this)}return this},wrapInner:function(a){return p.isFunction(a)?this.each(function(b){p(this).wrapInner(a.call(this,b))}):this.each(function(){var b=p(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=p.isFunction(a);return this.each(function(c){p(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){p.nodeName(this,"body")||p(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(a,this.firstChild)})},before:function(){if(!bh(this[0])){return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)})}if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(a,this),"before",this.selector)}},after:function(){if(!bh(this[0])){return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)})}if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(this,a),"after",this.selector)}},remove:function(a,b){var c,d=0;for(;(c=this[d])!=null;d++){if(!a||p.filter(a,[c]).length){!b&&c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),p.cleanData([c])),c.parentNode&&c.parentNode.removeChild(c)}}return this},empty:function(){var a,b=0;for(;(a=this[b])!=null;b++){a.nodeType===1&&p.cleanData(a.getElementsByTagName("*"));while(a.firstChild){a.removeChild(a.firstChild)}}return this},clone:function(a,b){return a=a==null?!1:a,b=b==null?a:b,this.map(function(){return p.clone(this,a,b)})},html:function(a){return p.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b){return c.nodeType===1?c.innerHTML.replace(bm,""):b}if(typeof a=="string"&&!bs.test(a)&&(p.support.htmlSerialize||!bu.test(a))&&(p.support.leadingWhitespace||!bn.test(a))&&!bz[(bp.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(bo,"<$1></$2>");try{for(;d<e;d++){c=this[d]||{},c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),c.innerHTML=a)}c=0}catch(f){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){return bh(this[0])?this.length?this.pushStack(p(p.isFunction(a)?a():a),"replaceWith",a):this:p.isFunction(a)?this.each(function(b){var c=p(this),d=c.html();c.replaceWith(a.call(this,b,d))}):(typeof a!="string"&&(a=p(a).detach()),this.each(function(){var b=this.nextSibling,c=this.parentNode;p(this).remove(),b?p(b).before(a):p(c).append(a)}))},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){a=[].concat.apply([],a);var e,f,g,h,i=0,j=a[0],k=[],l=this.length;if(!p.support.checkClone&&l>1&&typeof j=="string"&&bw.test(j)){return this.each(function(){p(this).domManip(a,c,d)})}if(p.isFunction(j)){return this.each(function(e){var f=p(this);a[0]=j.call(this,e,c?f.html():b),f.domManip(a,c,d)})}if(this[0]){e=p.buildFragment(a,this,k),g=e.fragment,f=g.firstChild,g.childNodes.length===1&&(g=f);if(f){c=c&&p.nodeName(f,"tr");for(h=e.cacheable||l-1;i<l;i++){d.call(c&&p.nodeName(this[i],"table")?bC(this[i],"tbody"):this[i],i===h?g:p.clone(g,!0,!0))}}g=f=null,k.length&&p.each(k,function(a,b){b.src?p.ajax?p.ajax({url:b.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):p.error("no ajax"):p.globalEval((b.text||b.textContent||b.innerHTML||"").replace(by,"")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),p.buildFragment=function(a,c,d){var f,g,h,i=a[0];return c=c||e,c=!c.nodeType&&c[0]||c,c=c.ownerDocument||c,a.length===1&&typeof i=="string"&&i.length<512&&c===e&&i.charAt(0)==="<"&&!bt.test(i)&&(p.support.checkClone||!bw.test(i))&&(p.support.html5Clone||!bu.test(i))&&(g=!0,f=p.fragments[i],h=f!==b),f||(f=c.createDocumentFragment(),p.clean(a,c,f,d),g&&(p.fragments[i]=h&&f)),{fragment:f,cacheable:g}},p.fragments={},p.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){p.fn[a]=function(c){var d,e=0,f=[],g=p(c),h=g.length,i=this.length===1&&this[0].parentNode;if((i==null||i&&i.nodeType===11&&i.childNodes.length===1)&&h===1){return g[b](this[0]),this}for(;e<h;e++){d=(e>0?this.clone(!0):this).get(),p(g[e])[b](d),f=f.concat(d)}return this.pushStack(f,a,g.selector)}}),p.extend({clone:function(a,b,c){var d,e,f,g;p.support.html5Clone||p.isXMLDoc(a)||!bu.test("<"+a.nodeName+">")?g=a.cloneNode(!0):(bB.innerHTML=a.outerHTML,bB.removeChild(g=bB.firstChild));if((!p.support.noCloneEvent||!p.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!p.isXMLDoc(a)){bE(a,g),d=bF(a),e=bF(g);for(f=0;d[f];++f){e[f]&&bE(d[f],e[f])}}if(b){bD(a,g);if(c){d=bF(a),e=bF(g);for(f=0;d[f];++f){bD(d[f],e[f])}}}return d=e=null,g},clean:function(a,b,c,d){var f,g,h,i,j,k,l,m,n,o,q,r,s=b===e&&bA,t=[];if(!b||typeof b.createDocumentFragment=="undefined"){b=e}for(f=0;(h=a[f])!=null;f++){typeof h=="number"&&(h+="");if(!h){continue}if(typeof h=="string"){if(!br.test(h)){h=b.createTextNode(h)}else{s=s||bk(b),l=b.createElement("div"),s.appendChild(l),h=h.replace(bo,"<$1></$2>"),i=(bp.exec(h)||["",""])[1].toLowerCase(),j=bz[i]||bz._default,k=j[0],l.innerHTML=j[1]+h+j[2];while(k--){l=l.lastChild}if(!p.support.tbody){m=bq.test(h),n=i==="table"&&!m?l.firstChild&&l.firstChild.childNodes:j[1]==="<table>"&&!m?l.childNodes:[];for(g=n.length-1;g>=0;--g){p.nodeName(n[g],"tbody")&&!n[g].childNodes.length&&n[g].parentNode.removeChild(n[g])}}!p.support.leadingWhitespace&&bn.test(h)&&l.insertBefore(b.createTextNode(bn.exec(h)[0]),l.firstChild),h=l.childNodes,l.parentNode.removeChild(l)}}h.nodeType?t.push(h):p.merge(t,h)}l&&(h=l=s=null);if(!p.support.appendChecked){for(f=0;(h=t[f])!=null;f++){p.nodeName(h,"input")?bG(h):typeof h.getElementsByTagName!="undefined"&&p.grep(h.getElementsByTagName("input"),bG)}}if(c){q=function(a){if(!a.type||bx.test(a.type)){return d?d.push(a.parentNode?a.parentNode.removeChild(a):a):c.appendChild(a)}};for(f=0;(h=t[f])!=null;f++){if(!p.nodeName(h,"script")||!q(h)){c.appendChild(h),typeof h.getElementsByTagName!="undefined"&&(r=p.grep(p.merge([],h.getElementsByTagName("script")),q),t.splice.apply(t,[f+1,0].concat(r)),f+=r.length)}}}return t},cleanData:function(a,b){var c,d,e,f,g=0,h=p.expando,i=p.cache,j=p.support.deleteExpando,k=p.event.special;for(;(e=a[g])!=null;g++){if(b||p.acceptData(e)){d=e[h],c=d&&i[d];if(c){if(c.events){for(f in c.events){k[f]?p.event.remove(e,f):p.removeEvent(e,f,c.handle)}}i[d]&&(delete i[d],j?delete e[h]:e.removeAttribute?e.removeAttribute(h):e[h]=null,p.deletedIds.push(d))}}}}}),function(){var a,b;p.uaMatch=function(a){a=a.toLowerCase();var b=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},a=p.uaMatch(g.userAgent),b={},a.browser&&(b[a.browser]=!0,b.version=a.version),b.chrome?b.webkit=!0:b.webkit&&(b.safari=!0),p.browser=b,p.sub=function(){function a(b,c){return new a.fn.init(b,c)}p.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function c(c,d){return d&&d instanceof p&&!(d instanceof a)&&(d=a(d)),p.fn.init.call(this,c,d,b)},a.fn.init.prototype=a.fn;var b=a(e);return a}}();var bH,bI,bJ,bK=/alpha\([^)]*\)/i,bL=/opacity=([^)]*)/,bM=/^(top|right|bottom|left)$/,bN=/^(none|table(?!-c[ea]).+)/,bO=/^margin/,bP=new RegExp("^("+q+")(.*)$","i"),bQ=new RegExp("^("+q+")(?!px)[a-z%]+$","i"),bR=new RegExp("^([-+])=("+q+")","i"),bS={},bT={position:"absolute",visibility:"hidden",display:"block"},bU={letterSpacing:0,fontWeight:400},bV=["Top","Right","Bottom","Left"],bW=["Webkit","O","Moz","ms"],bX=p.fn.toggle;p.fn.extend({css:function(a,c){return p.access(this,function(a,c,d){return d!==b?p.style(a,c,d):p.css(a,c)},a,c,arguments.length>1)},show:function(){return b$(this,!0)},hide:function(){return b$(this)},toggle:function(a,b){var c=typeof a=="boolean";return p.isFunction(a)&&p.isFunction(b)?bX.apply(this,arguments):this.each(function(){(c?a:bZ(this))?p(this).show():p(this).hide()})}}),p.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bH(a,"opacity");return c===""?"1":c}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":p.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!a||a.nodeType===3||a.nodeType===8||!a.style){return}var f,g,h,i=p.camelCase(c),j=a.style;c=p.cssProps[i]||(p.cssProps[i]=bY(j,i)),h=p.cssHooks[c]||p.cssHooks[i];if(d===b){return h&&"get" in h&&(f=h.get(a,!1,e))!==b?f:j[c]}g=typeof d,g==="string"&&(f=bR.exec(d))&&(d=(f[1]+1)*f[2]+parseFloat(p.css(a,c)),g="number");if(d==null||g==="number"&&isNaN(d)){return}g==="number"&&!p.cssNumber[i]&&(d+="px");if(!h||!("set" in h)||(d=h.set(a,d,e))!==b){try{j[c]=d}catch(k){}}},css:function(a,c,d,e){var f,g,h,i=p.camelCase(c);return c=p.cssProps[i]||(p.cssProps[i]=bY(a.style,i)),h=p.cssHooks[c]||p.cssHooks[i],h&&"get" in h&&(f=h.get(a,!0,e)),f===b&&(f=bH(a,c)),f==="normal"&&c in bU&&(f=bU[c]),d||e!==b?(g=parseFloat(f),d||p.isNumeric(g)?g||0:f):f},swap:function(a,b,c){var d,e,f={};for(e in b){f[e]=a.style[e],a.style[e]=b[e]}d=c.call(a);for(e in b){a.style[e]=f[e]}return d}}),a.getComputedStyle?bH=function(b,c){var d,e,f,g,h=a.getComputedStyle(b,null),i=b.style;return h&&(d=h[c],d===""&&!p.contains(b.ownerDocument,b)&&(d=p.style(b,c)),bQ.test(d)&&bO.test(c)&&(e=i.width,f=i.minWidth,g=i.maxWidth,i.minWidth=i.maxWidth=i.width=d,d=h.width,i.width=e,i.minWidth=f,i.maxWidth=g)),d}:e.documentElement.currentStyle&&(bH=function(a,b){var c,d,e=a.currentStyle&&a.currentStyle[b],f=a.style;return e==null&&f&&f[b]&&(e=f[b]),bQ.test(e)&&!bM.test(b)&&(c=f.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":e,e=f.pixelLeft+"px",f.left=c,d&&(a.runtimeStyle.left=d)),e===""?"auto":e}),p.each(["height","width"],function(a,b){p.cssHooks[b]={get:function(a,c,d){if(c){return a.offsetWidth===0&&bN.test(bH(a,"display"))?p.swap(a,bT,function(){return cb(a,b,d)}):cb(a,b,d)}},set:function(a,c,d){return b_(a,c,d?ca(a,b,d,p.support.boxSizing&&p.css(a,"boxSizing")==="border-box"):0)}}}),p.support.opacity||(p.cssHooks.opacity={get:function(a,b){return bL.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?0.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=p.isNumeric(b)?"alpha(opacity="+b*100+")":"",f=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&p.trim(f.replace(bK,""))===""&&c.removeAttribute){c.removeAttribute("filter");if(d&&!d.filter){return}}c.filter=bK.test(f)?f.replace(bK,e):f+" "+e}}),p(function(){p.support.reliableMarginRight||(p.cssHooks.marginRight={get:function(a,b){return p.swap(a,{display:"inline-block"},function(){if(b){return bH(a,"marginRight")}})}}),!p.support.pixelPosition&&p.fn.position&&p.each(["top","left"],function(a,b){p.cssHooks[b]={get:function(a,c){if(c){var d=bH(a,b);return bQ.test(d)?p(a).position()[b]+"px":d}}}})}),p.expr&&p.expr.filters&&(p.expr.filters.hidden=function(a){return a.offsetWidth===0&&a.offsetHeight===0||!p.support.reliableHiddenOffsets&&(a.style&&a.style.display||bH(a,"display"))==="none"},p.expr.filters.visible=function(a){return !p.expr.filters.hidden(a)}),p.each({margin:"",padding:"",border:"Width"},function(a,b){p.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++){f[a+bV[d]+b]=e[d]||e[d-2]||e[0]}return f}},bO.test(a)||(p.cssHooks[a+b].set=b_)});var cd=/%20/g,ce=/\[\]$/,cf=/\r?\n/g,cg=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,ch=/^(?:select|textarea)/i;p.fn.extend({serialize:function(){return p.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?p.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||ch.test(this.nodeName)||cg.test(this.type))}).map(function(a,b){var c=p(this).val();return c==null?null:p.isArray(c)?p.map(c,function(a,c){return{name:b.name,value:a.replace(cf,"\r\n")}}):{name:b.name,value:c.replace(cf,"\r\n")}}).get()}}),p.param=function(a,c){var d,e=[],f=function(a,b){b=p.isFunction(b)?b():b==null?"":b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=p.ajaxSettings&&p.ajaxSettings.traditional);if(p.isArray(a)||a.jquery&&!p.isPlainObject(a)){p.each(a,function(){f(this.name,this.value)})}else{for(d in a){ci(d,a[d],c,f)}}return e.join("&").replace(cd,"+")};var cj,ck,cl=/#.*$/,cm=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,cn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,co=/^(?:GET|HEAD)$/,cp=/^\/\//,cq=/\?/,cr=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,cs=/([?&])_=[^&]*/,ct=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,cu=p.fn.load,cv={},cw={},cx=["*/"]+["*"];try{ck=f.href}catch(cy){ck=e.createElement("a"),ck.href="",ck=ck.href}cj=ct.exec(ck.toLowerCase())||[],p.fn.load=function(a,c,d){if(typeof a!="string"&&cu){return cu.apply(this,arguments)}if(!this.length){return this}var e,f,g,h=this,i=a.indexOf(" ");return i>=0&&(e=a.slice(i,a.length),a=a.slice(0,i)),p.isFunction(c)?(d=c,c=b):c&&typeof c=="object"&&(f="POST"),p.ajax({url:a,type:f,dataType:"html",data:c,complete:function(a,b){d&&h.each(d,g||[a.responseText,b,a])}}).done(function(a){g=arguments,h.html(e?p("<div>").append(a.replace(cr,"")).find(e):a)}),this},p.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){p.fn[b]=function(a){return this.on(b,a)}}),p.each(["get","post"],function(a,c){p[c]=function(a,d,e,f){return p.isFunction(d)&&(f=f||e,e=d,d=b),p.ajax({type:c,url:a,data:d,success:e,dataType:f})}}),p.extend({getScript:function(a,c){return p.get(a,b,c,"script")},getJSON:function(a,b,c){return p.get(a,b,c,"json")},ajaxSetup:function(a,b){return b?cB(a,p.ajaxSettings):(b=a,a=p.ajaxSettings),cB(a,b),a},ajaxSettings:{url:ck,isLocal:cn.test(cj[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":cx},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":p.parseJSON,"text xml":p.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:cz(cv),ajaxTransport:cz(cw),ajax:function(a,c){function y(a,c,f,i){var k,s,t,u,w,y=c;if(v===2){return}v=2,h&&clearTimeout(h),g=b,e=i||"",x.readyState=a>0?4:0,f&&(u=cC(l,x,f));if(a>=200&&a<300||a===304){l.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(p.lastModified[d]=w),w=x.getResponseHeader("Etag"),w&&(p.etag[d]=w)),a===304?(y="notmodified",k=!0):(k=cD(l,u),y=k.state,s=k.data,t=k.error,k=!t)}else{t=y;if(!y||a){y="error",a<0&&(a=0)}}x.status=a,x.statusText=(c||y)+"",k?o.resolveWith(m,[s,y,x]):o.rejectWith(m,[x,y,t]),x.statusCode(r),r=b,j&&n.trigger("ajax"+(k?"Success":"Error"),[x,l,k?s:t]),q.fireWith(m,[x,y]),j&&(n.trigger("ajaxComplete",[x,l]),--p.active||p.event.trigger("ajaxStop"))}typeof a=="object"&&(c=a,a=b),c=c||{};var d,e,f,g,h,i,j,k,l=p.ajaxSetup({},c),m=l.context||l,n=m!==l&&(m.nodeType||m instanceof p)?p(m):p.event,o=p.Deferred(),q=p.Callbacks("once memory"),r=l.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,setRequestHeader:function(a,b){if(!v){var c=a.toLowerCase();a=u[c]=u[c]||a,t[a]=b}return this},getAllResponseHeaders:function(){return v===2?e:null},getResponseHeader:function(a){var c;if(v===2){if(!f){f={};while(c=cm.exec(e)){f[c[1].toLowerCase()]=c[2]}}c=f[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){return v||(l.mimeType=a),this},abort:function(a){return a=a||w,g&&g.abort(a),y(0,a),this}};o.promise(x),x.success=x.done,x.error=x.fail,x.complete=q.add,x.statusCode=function(a){if(a){var b;if(v<2){for(b in a){r[b]=[r[b],a[b]]}}else{b=a[x.status],x.always(b)}}return this},l.url=((a||l.url)+"").replace(cl,"").replace(cp,cj[1]+"//"),l.dataTypes=p.trim(l.dataType||"*").toLowerCase().split(s),l.crossDomain==null&&(i=ct.exec(l.url.toLowerCase())||!1,l.crossDomain=i&&i.join(":")+(i[3]?"":i[1]==="http:"?80:443)!==cj.join(":")+(cj[3]?"":cj[1]==="http:"?80:443)),l.data&&l.processData&&typeof l.data!="string"&&(l.data=p.param(l.data,l.traditional)),cA(cv,l,c,x);if(v===2){return x}j=l.global,l.type=l.type.toUpperCase(),l.hasContent=!co.test(l.type),j&&p.active++===0&&p.event.trigger("ajaxStart");if(!l.hasContent){l.data&&(l.url+=(cq.test(l.url)?"&":"?")+l.data,delete l.data),d=l.url;if(l.cache===!1){var z=p.now(),A=l.url.replace(cs,"$1_="+z);l.url=A+(A===l.url?(cq.test(l.url)?"&":"?")+"_="+z:"")}}(l.data&&l.hasContent&&l.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",l.contentType),l.ifModified&&(d=d||l.url,p.lastModified[d]&&x.setRequestHeader("If-Modified-Since",p.lastModified[d]),p.etag[d]&&x.setRequestHeader("If-None-Match",p.etag[d])),x.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+(l.dataTypes[0]!=="*"?", "+cx+"; q=0.01":""):l.accepts["*"]);for(k in l.headers){x.setRequestHeader(k,l.headers[k])}if(!l.beforeSend||l.beforeSend.call(m,x,l)!==!1&&v!==2){w="abort";for(k in {success:1,error:1,complete:1}){x[k](l[k])}g=cA(cw,l,c,x);if(!g){y(-1,"No Transport")}else{x.readyState=1,j&&n.trigger("ajaxSend",[x,l]),l.async&&l.timeout>0&&(h=setTimeout(function(){x.abort("timeout")},l.timeout));try{v=1,g.send(t,y)}catch(B){if(v<2){y(-1,B)}else{throw B}}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var cE=[],cF=/\?/,cG=/(=)\?(?=&|$)|\?\?/,cH=p.now();p.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=cE.pop()||p.expando+"_"+cH++;return this[a]=!0,a}}),p.ajaxPrefilter("json jsonp",function(c,d,e){var f,g,h,i=c.data,j=c.url,k=c.jsonp!==!1,l=k&&cG.test(j),m=k&&!l&&typeof i=="string"&&!(c.contentType||"").indexOf("application/x-www-form-urlencoded")&&cG.test(i);if(c.dataTypes[0]==="jsonp"||l||m){return f=c.jsonpCallback=p.isFunction(c.jsonpCallback)?c.jsonpCallback():c.jsonpCallback,g=a[f],l?c.url=j.replace(cG,"$1"+f):m?c.data=i.replace(cG,"$1"+f):k&&(c.url+=(cF.test(j)?"&":"?")+c.jsonp+"="+f),c.converters["script json"]=function(){return h||p.error(f+" was not called"),h[0]},c.dataTypes[0]="json",a[f]=function(){h=arguments},e.always(function(){a[f]=g,c[f]&&(c.jsonpCallback=d.jsonpCallback,cE.push(f)),h&&p.isFunction(g)&&g(h[0]),h=g=b}),"script"}}),p.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){return p.globalEval(a),a}}}),p.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),p.ajaxTransport("script",function(a){if(a.crossDomain){var c,d=e.head||e.getElementsByTagName("head")[0]||e.documentElement;return{send:function(f,g){c=e.createElement("script"),c.async="async",a.scriptCharset&&(c.charset=a.scriptCharset),c.src=a.url,c.onload=c.onreadystatechange=function(a,e){if(e||!c.readyState||/loaded|complete/.test(c.readyState)){c.onload=c.onreadystatechange=null,d&&c.parentNode&&d.removeChild(c),c=b,e||g(200,"success")}},d.insertBefore(c,d.firstChild)},abort:function(){c&&c.onload(0,1)}}}});var cI,cJ=a.ActiveXObject?function(){for(var a in cI){cI[a](0,1)}}:!1,cK=0;p.ajaxSettings.xhr=a.ActiveXObject?function(){return !this.isLocal&&cL()||cM()}:cL,function(a){p.extend(p.support,{ajax:!!a,cors:!!a&&"withCredentials" in a})}(p.ajaxSettings.xhr()),p.support.ajax&&p.ajaxTransport(function(c){if(!c.crossDomain||p.support.cors){var d;return{send:function(e,f){var g,h,i=c.xhr();c.username?i.open(c.type,c.url,c.async,c.username,c.password):i.open(c.type,c.url,c.async);if(c.xhrFields){for(h in c.xhrFields){i[h]=c.xhrFields[h]}}c.mimeType&&i.overrideMimeType&&i.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(h in e){i.setRequestHeader(h,e[h])}}catch(j){}i.send(c.hasContent&&c.data||null),d=function(a,e){var h,j,k,l,m;try{if(d&&(e||i.readyState===4)){d=b,g&&(i.onreadystatechange=p.noop,cJ&&delete cI[g]);if(e){i.readyState!==4&&i.abort()}else{h=i.status,k=i.getAllResponseHeaders(),l={},m=i.responseXML,m&&m.documentElement&&(l.xml=m);try{l.text=i.responseText}catch(a){}try{j=i.statusText}catch(n){j=""}!h&&c.isLocal&&!c.crossDomain?h=l.text?200:404:h===1223&&(h=204)}}}catch(o){e||f(-1,o)}l&&f(h,j,l,k)},c.async?i.readyState===4?setTimeout(d,0):(g=++cK,cJ&&(cI||(cI={},p(a).unload(cJ)),cI[g]=d),i.onreadystatechange=d):d()},abort:function(){d&&d(0,1)}}}});var cN,cO,cP=/^(?:toggle|show|hide)$/,cQ=new RegExp("^(?:([-+])=|)("+q+")([a-z%]*)$","i"),cR=/queueHooks$/,cS=[cY],cT={"*":[function(a,b){var c,d,e=this.createTween(a,b),f=cQ.exec(b),g=e.cur(),h=+g||0,i=1,j=20;if(f){c=+f[2],d=f[3]||(p.cssNumber[a]?"":"px");if(d!=="px"&&h){h=p.css(e.elem,a,!0)||c||1;do{i=i||".5",h=h/i,p.style(e.elem,a,h+d)}while(i!==(i=e.cur()/g)&&i!==1&&--j)}e.unit=d,e.start=h,e.end=f[1]?h+(f[1]+1)*c:c}return e}]};p.Animation=p.extend(cW,{tweener:function(a,b){p.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");var c,d=0,e=a.length;for(;d<e;d++){c=a[d],cT[c]=cT[c]||[],cT[c].unshift(b)}},prefilter:function(a,b){b?cS.unshift(a):cS.push(a)}}),p.Tween=cZ,cZ.prototype={constructor:cZ,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(p.cssNumber[c]?"":"px")},cur:function(){var a=cZ.propHooks[this.prop];return a&&a.get?a.get(this):cZ.propHooks._default.get(this)},run:function(a){var b,c=cZ.propHooks[this.prop];return this.options.duration?this.pos=b=p.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):cZ.propHooks._default.set(this),this}},cZ.prototype.init.prototype=cZ.prototype,cZ.propHooks={_default:{get:function(a){var b;return a.elem[a.prop]==null||!!a.elem.style&&a.elem.style[a.prop]!=null?(b=p.css(a.elem,a.prop,!1,""),!b||b==="auto"?0:b):a.elem[a.prop]},set:function(a){p.fx.step[a.prop]?p.fx.step[a.prop](a):a.elem.style&&(a.elem.style[p.cssProps[a.prop]]!=null||p.cssHooks[a.prop])?p.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},cZ.propHooks.scrollTop=cZ.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},p.each(["toggle","show","hide"],function(a,b){var c=p.fn[b];p.fn[b]=function(d,e,f){return d==null||typeof d=="boolean"||!a&&p.isFunction(d)&&p.isFunction(e)?c.apply(this,arguments):this.animate(c$(b,!0),d,e,f)}}),p.fn.extend({fadeTo:function(a,b,c,d){return this.filter(bZ).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=p.isEmptyObject(a),f=p.speed(b,c,d),g=function(){var b=cW(this,p.extend({},a),f);e&&b.stop(!0)};return e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,c,d){var e=function(a){var b=a.stop;delete a.stop,b(d)};return typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,c=a!=null&&a+"queueHooks",f=p.timers,g=p._data(this);if(c){g[c]&&g[c].stop&&e(g[c])}else{for(c in g){g[c]&&g[c].stop&&cR.test(c)&&e(g[c])}}for(c=f.length;c--;){f[c].elem===this&&(a==null||f[c].queue===a)&&(f[c].anim.stop(d),b=!1,f.splice(c,1))}(b||!d)&&p.dequeue(this,a)})}}),p.each({slideDown:c$("show"),slideUp:c$("hide"),slideToggle:c$("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){p.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),p.speed=function(a,b,c){var d=a&&typeof a=="object"?p.extend({},a):{complete:c||!c&&b||p.isFunction(a)&&a,duration:a,easing:c&&b||b&&!p.isFunction(b)&&b};d.duration=p.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in p.fx.speeds?p.fx.speeds[d.duration]:p.fx.speeds._default;if(d.queue==null||d.queue===!0){d.queue="fx"}return d.old=d.complete,d.complete=function(){p.isFunction(d.old)&&d.old.call(this),d.queue&&p.dequeue(this,d.queue)},d},p.easing={linear:function(a){return a},swing:function(a){return 0.5-Math.cos(a*Math.PI)/2}},p.timers=[],p.fx=cZ.prototype.init,p.fx.tick=function(){var a,b=p.timers,c=0;for(;c<b.length;c++){a=b[c],!a()&&b[c]===a&&b.splice(c--,1)}b.length||p.fx.stop()},p.fx.timer=function(a){a()&&p.timers.push(a)&&!cO&&(cO=setInterval(p.fx.tick,p.fx.interval))},p.fx.interval=13,p.fx.stop=function(){clearInterval(cO),cO=null},p.fx.speeds={slow:600,fast:200,_default:400},p.fx.step={},p.expr&&p.expr.filters&&(p.expr.filters.animated=function(a){return p.grep(p.timers,function(b){return a===b.elem}).length});var c_=/^(?:body|html)$/i;p.fn.offset=function(a){if(arguments.length){return a===b?this:this.each(function(b){p.offset.setOffset(this,a,b)})}var c,d,e,f,g,h,i,j={top:0,left:0},k=this[0],l=k&&k.ownerDocument;if(!l){return}return(d=l.body)===k?p.offset.bodyOffset(k):(c=l.documentElement,p.contains(c,k)?(typeof k.getBoundingClientRect!="undefined"&&(j=k.getBoundingClientRect()),e=da(l),f=c.clientTop||d.clientTop||0,g=c.clientLeft||d.clientLeft||0,h=e.pageYOffset||c.scrollTop,i=e.pageXOffset||c.scrollLeft,{top:j.top+h-f,left:j.left+i-g}):j)},p.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;return p.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(p.css(a,"marginTop"))||0,c+=parseFloat(p.css(a,"marginLeft"))||0),{top:b,left:c}},setOffset:function(a,b,c){var d=p.css(a,"position");d==="static"&&(a.style.position="relative");var e=p(a),f=e.offset(),g=p.css(a,"top"),h=p.css(a,"left"),i=(d==="absolute"||d==="fixed")&&p.inArray("auto",[g,h])>-1,j={},k={},l,m;i?(k=e.position(),l=k.top,m=k.left):(l=parseFloat(g)||0,m=parseFloat(h)||0),p.isFunction(b)&&(b=b.call(a,c,f)),b.top!=null&&(j.top=b.top-f.top+l),b.left!=null&&(j.left=b.left-f.left+m),"using" in b?b.using.call(a,j):e.css(j)}},p.fn.extend({position:function(){if(!this[0]){return}var a=this[0],b=this.offsetParent(),c=this.offset(),d=c_.test(b[0].nodeName)?{top:0,left:0}:b.offset();return c.top-=parseFloat(p.css(a,"marginTop"))||0,c.left-=parseFloat(p.css(a,"marginLeft"))||0,d.top+=parseFloat(p.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(p.css(b[0],"borderLeftWidth"))||0,{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||e.body;while(a&&!c_.test(a.nodeName)&&p.css(a,"position")==="static"){a=a.offsetParent}return a||e.body})}}),p.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);p.fn[a]=function(e){return p.access(this,function(a,e,f){var g=da(a);if(f===b){return g?c in g?g[c]:g.document.documentElement[e]:a[e]}g?g.scrollTo(d?p(g).scrollLeft():f,d?f:p(g).scrollTop()):a[e]=f},a,e,arguments.length,null)}}),p.each({Height:"height",Width:"width"},function(a,c){p.each({padding:"inner"+a,content:c,"":"outer"+a},function(d,e){p.fn[e]=function(e,f){var g=arguments.length&&(d||typeof e!="boolean"),h=d||(e===!0||f===!0?"margin":"border");return p.access(this,function(c,d,e){var f;return p.isWindow(c)?c.document.documentElement["client"+a]:c.nodeType===9?(f=c.documentElement,Math.max(c.body["scroll"+a],f["scroll"+a],c.body["offset"+a],f["offset"+a],f["client"+a])):e===b?p.css(c,d,e,h):p.style(c,d,e,h)},c,g?e:b,g,null)}})}),a.jQuery=a.$=p,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return p})})(window);(function(){var a=false,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(g){var f=this.prototype;a=true;var e=new this();a=false;for(var d in g){e[d]=typeof g[d]=="function"&&typeof f[d]=="function"&&b.test(g[d])?(function(h,i){return function(){var k=this._super;this._super=f[h];var j=i.apply(this,arguments);this._super=k;return j}})(d,g[d]):g[d]}function c(){if(!a&&this.init){this.init.apply(this,arguments)}}c.prototype=e;c.prototype.constructor=c;c.extend=arguments.callee;return c}})();var namespace=function(c,f,b){var e=c.split(f||"."),g=b||window,d,a;for(d=0,a=e.length;d<a;d++){g=g[e[d]]=g[e[d]]||{}}return g};String.prototype.strip_tags=function(d){var c=this;d=d||[];var b=new RegExp("(</?(.*?)/?>)","gi");var a;while(a=b.exec(this)){if(!d.exists(a[2].split(" ")[0])){c=c.replace(a[1],"")}}return c.toString()};Array.prototype.exists=function(a){for(p=0;p<this.length;p++){if(a==this[p]){return true}}return false};var requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1000/60)}})();var cancelAnimFrame=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||function(a){window.clearInterval(a)};function getParameterByName(b){b=b.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var a="[\\?&]"+b+"=([^&#]*)";var d=new RegExp(a);var c=d.exec(window.location.search);if(c==null){return""}else{return decodeURIComponent(c[1].replace(/\+/g," "))}}function setCookie(a,d,b){var e=new Date();e.setDate(e.getDate()+b);var c=escape(d)+((b==null)?"":"; expires="+e.toUTCString());document.cookie=a+"="+c}function getCookie(a){var e=null;if(document.cookie&&document.cookie!=""){var d=document.cookie.split(";");for(var c=0;c<d.length;c++){var b=jQuery.trim(d[c]);if(b.substring(0,a.length+1)==(a+"=")){e=decodeURIComponent(b.substring(a.length+1));break}}}return e}function sameOrigin(b){var d=document.location.host;var e=document.location.protocol;var c="//"+d;var a=e+c;return(b==a||b.slice(0,a.length+1)==a+"/")||(b==c||b.slice(0,c.length+1)==c+"/")||!(/^(\/\/|http:|https:).*/.test(b))}function safeMethod(a){return(/^(GET|HEAD|OPTIONS|TRACE)$/.test(a))}jQuery(document).ajaxSend(function(b,c,a){if(!safeMethod(a.type)&&sameOrigin(a.url)){c.setRequestHeader("X-CSRFToken",getCookie("csrftoken"))}});function pasteHtmlAtCaret(b){var f,a;if(window.getSelection){f=window.getSelection();if(f.getRangeAt&&f.rangeCount){a=f.getRangeAt(0);a.deleteContents();var c=document.createElement("div");c.innerHTML=b;var g=document.createDocumentFragment(),e,d;while((e=c.firstChild)){d=g.appendChild(e)}a.insertNode(g);if(d){a=a.cloneRange();a.setStartAfter(d);a.collapse(true);f.removeAllRanges();f.addRange(a)}}}else{if(document.selection&&document.selection.type!="Control"){document.selection.createRange().pasteHTML(b)}}}var saveSelection,restoreSelection;if(window.getSelection){saveSelection=function(){var d=window.getSelection(),b=[];if(d.rangeCount){for(var c=0,a=d.rangeCount;c<a;++c){b.push(d.getRangeAt(c))}}return b};restoreSelection=function(b){var d=window.getSelection();d.removeAllRanges();for(var c=0,a=b.length;c<a;++c){d.addRange(b[c])}}}else{if(document.selection&&document.selection.createRange){saveSelection=function(){var a=document.selection;return(a.type!="None")?a.createRange():null};restoreSelection=function(a){if(a){a.select()}}}}function getCSSSelector(a){var d=[];while(a.parentNode){if(a.id){d.unshift("#"+a.id);break}else{if(a==a.ownerDocument.documentElement){d.unshift(a.tagName)}else{for(var f=1,b=a;b.previousElementSibling;b=b.previousElementSibling,f++){}d.unshift(a.tagName+":nth-child("+f+")")}a=a.parentNode}}return d.join(" > ")}function updateQueryStringParameter(c,a,d){var b=new RegExp("([?|&])"+a+"=.*?(&|$)","i");separator=c.indexOf("?")!==-1?"&":"?";if(c.match(b)){return c.replace(b,"$1"+a+"="+d+"$2")}else{return c+separator+a+"="+d}}"".trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")})
/*!
 * jQuery Form Plugin
 * version: 3.28.0-2013.02.06
 * @requires jQuery v1.5 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses:
 *    http://malsup.github.com/mit-license.txt
 *    http://malsup.github.com/gpl-license-v2.txt
 */
;(function(e){var c={};c.fileapi=e("<input type='file'/>").get(0).files!==undefined;c.formdata=window.FormData!==undefined;e.fn.ajaxSubmit=function(h){if(!this.length){d("ajaxSubmit: skipping submit process - no element selected");return this}var g,z,j,m=this;if(typeof h=="function"){h={success:h}}g=this.attr("method");z=this.attr("action");j=(typeof z==="string")?e.trim(z):"";j=j||window.location.href||"";if(j){j=(j.match(/^([^#]+)/)||[])[1]}h=e.extend(true,{url:j,success:e.ajaxSettings.success,type:g||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},h);var t={};this.trigger("form-pre-serialize",[this,h,t]);if(t.veto){d("ajaxSubmit: submit vetoed via form-pre-serialize trigger");return this}if(h.beforeSerialize&&h.beforeSerialize(this,h)===false){d("ajaxSubmit: submit aborted via beforeSerialize callback");return this}var l=h.traditional;if(l===undefined){l=e.ajaxSettings.traditional}var r=[];var C,D=this.formToArray(h.semantic,r);if(h.data){h.extraData=h.data;C=e.param(h.data,l)}if(h.beforeSubmit&&h.beforeSubmit(D,this,h)===false){d("ajaxSubmit: submit aborted via beforeSubmit callback");return this}this.trigger("form-submit-validate",[D,this,h,t]);if(t.veto){d("ajaxSubmit: submit vetoed via form-submit-validate trigger");return this}var x=e.param(D,l);if(C){x=(x?(x+"&"+C):C)}if(h.type.toUpperCase()=="GET"){h.url+=(h.url.indexOf("?")>=0?"&":"?")+x;h.data=null}else{h.data=x}var F=[];if(h.resetForm){F.push(function(){m.resetForm()})}if(h.clearForm){F.push(function(){m.clearForm(h.includeHidden)})}if(!h.dataType&&h.target){var i=h.success||function(){};F.push(function(q){var k=h.replaceTarget?"replaceWith":"html";e(h.target)[k](q).each(i,arguments)})}else{if(h.success){F.push(h.success)}}h.success=function(I,q,J){var H=h.context||this;for(var G=0,k=F.length;G<k;G++){F[G].apply(H,[I,q,J||m,m])}};var B=e('input[type=file]:enabled[value!=""]',this);var n=B.length>0;var A="multipart/form-data";var w=(m.attr("enctype")==A||m.attr("encoding")==A);var v=c.fileapi&&c.formdata;d("fileAPI :"+v);var o=(n||w)&&!v;var u;if(h.iframe!==false&&(h.iframe||o)){if(h.closeKeepAlive){e.get(h.closeKeepAlive,function(){u=E(D)})}else{u=E(D)}}else{if((n||w)&&v){u=s(D)}else{u=e.ajax(h)}}m.removeData("jqxhr").data("jqxhr",u);for(var y=0;y<r.length;y++){r[y]=null}this.trigger("form-submit-notify",[this,h]);return this;function f(I){var J=e.param(I).split("&");var q=J.length;var k=[];var H,G;for(H=0;H<q;H++){J[H]=J[H].replace(/\+/g," ");G=J[H].split("=");k.push([decodeURIComponent(G[0]),decodeURIComponent(G[1])])}return k}function s(q){var k=new FormData();for(var G=0;G<q.length;G++){k.append(q[G].name,q[G].value)}if(h.extraData){var J=f(h.extraData);for(G=0;G<J.length;G++){if(J[G]){k.append(J[G][0],J[G][1])}}}h.data=null;var I=e.extend(true,{},e.ajaxSettings,h,{contentType:false,processData:false,cache:false,type:g||"POST"});if(h.uploadProgress){I.xhr=function(){var K=jQuery.ajaxSettings.xhr();if(K.upload){K.upload.addEventListener("progress",function(O){var N=0;var L=O.loaded||O.position;var M=O.total;if(O.lengthComputable){N=Math.ceil(L/M*100)}h.uploadProgress(O,L,M,N)},false)}return K}}I.data=null;var H=I.beforeSend;I.beforeSend=function(L,K){K.data=k;if(H){H.call(this,L,K)}};return e.ajax(I)}function E(ae){var J=m[0],I,aa,U,ac,X,L,P,N,O,Y,ab,S;var M=!!e.fn.prop;var ah=e.Deferred();if(ae){for(aa=0;aa<r.length;aa++){I=e(r[aa]);if(M){I.prop("disabled",false)}else{I.removeAttr("disabled")}}}U=e.extend(true,{},e.ajaxSettings,h);U.context=U.context||U;X="jqFormIO"+(new Date().getTime());if(U.iframeTarget){L=e(U.iframeTarget);Y=L.attr("name");if(!Y){L.attr("name",X)}else{X=Y}}else{L=e('<iframe name="'+X+'" src="'+U.iframeSrc+'" />');L.css({position:"absolute",top:"-1000px",left:"-1000px"})}P=L[0];N={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(ai){var aj=(ai==="timeout"?"timeout":"aborted");d("aborting upload... "+aj);this.aborted=1;try{if(P.contentWindow.document.execCommand){P.contentWindow.document.execCommand("Stop")}}catch(ak){}L.attr("src",U.iframeSrc);N.error=aj;if(U.error){U.error.call(U.context,N,aj,ai)}if(ac){e.event.trigger("ajaxError",[N,U,aj])}if(U.complete){U.complete.call(U.context,N,aj)}}};ac=U.global;if(ac&&0===e.active++){e.event.trigger("ajaxStart")}if(ac){e.event.trigger("ajaxSend",[N,U])}if(U.beforeSend&&U.beforeSend.call(U.context,N,U)===false){if(U.global){e.active--}ah.reject();return ah}if(N.aborted){ah.reject();return ah}O=J.clk;if(O){Y=O.name;if(Y&&!O.disabled){U.extraData=U.extraData||{};U.extraData[Y]=O.value;if(O.type=="image"){U.extraData[Y+".x"]=J.clk_x;U.extraData[Y+".y"]=J.clk_y}}}var T=1;var Q=2;function R(aj){var ai=aj.contentWindow?aj.contentWindow.document:aj.contentDocument?aj.contentDocument:aj.document;return ai}var H=e("meta[name=csrf-token]").attr("content");var G=e("meta[name=csrf-param]").attr("content");if(G&&H){U.extraData=U.extraData||{};U.extraData[G]=H}function Z(){var ak=m.attr("target"),ai=m.attr("action");J.setAttribute("target",X);if(!g){J.setAttribute("method","POST")}if(ai!=U.url){J.setAttribute("action",U.url)}if(!U.skipEncodingOverride&&(!g||/post/i.test(g))){m.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"})}if(U.timeout){S=setTimeout(function(){ab=true;W(T)},U.timeout)}function al(){try{var ap=R(P).readyState;d("state = "+ap);if(ap&&ap.toLowerCase()=="uninitialized"){setTimeout(al,50)}}catch(aq){d("Server abort: ",aq," (",aq.name,")");W(Q);if(S){clearTimeout(S)}S=undefined}}var aj=[];try{if(U.extraData){for(var ao in U.extraData){if(U.extraData.hasOwnProperty(ao)){if(e.isPlainObject(U.extraData[ao])&&U.extraData[ao].hasOwnProperty("name")&&U.extraData[ao].hasOwnProperty("value")){aj.push(e('<input type="hidden" name="'+U.extraData[ao].name+'">').val(U.extraData[ao].value).appendTo(J)[0])}else{aj.push(e('<input type="hidden" name="'+ao+'">').val(U.extraData[ao]).appendTo(J)[0])}}}}if(!U.iframeTarget){L.appendTo("body");if(P.attachEvent){P.attachEvent("onload",W)}else{P.addEventListener("load",W,false)}}setTimeout(al,15);try{J.submit()}catch(am){var an=document.createElement("form").submit;an.apply(J)}}finally{J.setAttribute("action",ai);if(ak){J.setAttribute("target",ak)}else{m.removeAttr("target")}e(aj).remove()}}if(U.forceSync){Z()}else{setTimeout(Z,10)}var af,ag,ad=50,K;function W(ao){if(N.aborted||K){return}try{ag=R(P)}catch(ar){d("cannot access response document: ",ar);ao=Q}if(ao===T&&N){N.abort("timeout");ah.reject(N,"timeout");return}else{if(ao==Q&&N){N.abort("server abort");ah.reject(N,"error","server abort");return}}if(!ag||ag.location.href==U.iframeSrc){if(!ab){return}}if(P.detachEvent){P.detachEvent("onload",W)}else{P.removeEventListener("load",W,false)}var am="success",aq;try{if(ab){throw"timeout"}var al=U.dataType=="xml"||ag.XMLDocument||e.isXMLDoc(ag);d("isXml="+al);if(!al&&window.opera&&(ag.body===null||!ag.body.innerHTML)){if(--ad){d("requeing onLoad callback, DOM not available");setTimeout(W,250);return}}var at=ag.body?ag.body:ag.documentElement;N.responseText=at?at.innerHTML:null;N.responseXML=ag.XMLDocument?ag.XMLDocument:ag;if(al){U.dataType="xml"}N.getResponseHeader=function(aw){var av={"content-type":U.dataType};return av[aw]};if(at){N.status=Number(at.getAttribute("status"))||N.status;N.statusText=at.getAttribute("statusText")||N.statusText}var ai=(U.dataType||"").toLowerCase();var ap=/(json|script|text)/.test(ai);if(ap||U.textarea){var an=ag.getElementsByTagName("textarea")[0];if(an){N.responseText=an.value;N.status=Number(an.getAttribute("status"))||N.status;N.statusText=an.getAttribute("statusText")||N.statusText}else{if(ap){var aj=ag.getElementsByTagName("pre")[0];var au=ag.getElementsByTagName("body")[0];if(aj){N.responseText=aj.textContent?aj.textContent:aj.innerText}else{if(au){N.responseText=au.textContent?au.textContent:au.innerText}}}}}else{if(ai=="xml"&&!N.responseXML&&N.responseText){N.responseXML=V(N.responseText)}}try{af=k(N,ai,U)}catch(ak){am="parsererror";N.error=aq=(ak||am)}}catch(ak){d("error caught: ",ak);am="error";N.error=aq=(ak||am)}if(N.aborted){d("upload aborted");am=null}if(N.status){am=(N.status>=200&&N.status<300||N.status===304)?"success":"error"}if(am==="success"){if(U.success){U.success.call(U.context,af,"success",N)}ah.resolve(N.responseText,"success",N);if(ac){e.event.trigger("ajaxSuccess",[N,U])}}else{if(am){if(aq===undefined){aq=N.statusText}if(U.error){U.error.call(U.context,N,am,aq)}ah.reject(N,"error",aq);if(ac){e.event.trigger("ajaxError",[N,U,aq])}}}if(ac){e.event.trigger("ajaxComplete",[N,U])}if(ac&&!--e.active){e.event.trigger("ajaxStop")}if(U.complete){U.complete.call(U.context,N,am)}K=true;if(U.timeout){clearTimeout(S)}setTimeout(function(){if(!U.iframeTarget){L.remove()}N.responseXML=null},100)}var V=e.parseXML||function(ai,aj){if(window.ActiveXObject){aj=new ActiveXObject("Microsoft.XMLDOM");aj.async="false";aj.loadXML(ai)}else{aj=(new DOMParser()).parseFromString(ai,"text/xml")}return(aj&&aj.documentElement&&aj.documentElement.nodeName!="parsererror")?aj:null};var q=e.parseJSON||function(ai){return window["eval"]("("+ai+")")};var k=function(an,al,ak){var aj=an.getResponseHeader("content-type")||"",ai=al==="xml"||!al&&aj.indexOf("xml")>=0,am=ai?an.responseXML:an.responseText;if(ai&&am.documentElement.nodeName==="parsererror"){if(e.error){e.error("parsererror")}}if(ak&&ak.dataFilter){am=ak.dataFilter(am,al)}if(typeof am==="string"){if(al==="json"||!al&&aj.indexOf("json")>=0){am=q(am)}else{if(al==="script"||!al&&aj.indexOf("javascript")>=0){e.globalEval(am)}}}return am};return ah}};e.fn.ajaxForm=function(f){f=f||{};f.delegation=f.delegation&&e.isFunction(e.fn.on);if(!f.delegation&&this.length===0){var g={s:this.selector,c:this.context};if(!e.isReady&&g.s){d("DOM not ready, queuing ajaxForm");e(function(){e(g.s,g.c).ajaxForm(f)});return this}d("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)"));return this}if(f.delegation){e(document).off("submit.form-plugin",this.selector,b).off("click.form-plugin",this.selector,a).on("submit.form-plugin",this.selector,f,b).on("click.form-plugin",this.selector,f,a);return this}return this.ajaxFormUnbind().bind("submit.form-plugin",f,b).bind("click.form-plugin",f,a)};function b(g){var f=g.data;if(!g.isDefaultPrevented()){g.preventDefault();e(this).ajaxSubmit(f)}}function a(j){var i=j.target;var g=e(i);if(!(g.is("[type=submit],[type=image]"))){var f=g.closest("[type=submit]");if(f.length===0){return}i=f[0]}var h=this;h.clk=i;if(i.type=="image"){if(j.offsetX!==undefined){h.clk_x=j.offsetX;h.clk_y=j.offsetY}else{if(typeof e.fn.offset=="function"){var k=g.offset();h.clk_x=j.pageX-k.left;h.clk_y=j.pageY-k.top}else{h.clk_x=j.pageX-i.offsetLeft;h.clk_y=j.pageY-i.offsetTop}}}setTimeout(function(){h.clk=h.clk_x=h.clk_y=null},100)}e.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")};e.fn.formToArray=function(x,f){var w=[];if(this.length===0){return w}var k=this[0];var o=x?k.getElementsByTagName("*"):k.elements;if(!o){return w}var r,q,m,y,l,t,h;for(r=0,t=o.length;r<t;r++){l=o[r];m=l.name;if(!m){continue}if(x&&k.clk&&l.type=="image"){if(!l.disabled&&k.clk==l){w.push({name:m,value:e(l).val(),type:l.type});w.push({name:m+".x",value:k.clk_x},{name:m+".y",value:k.clk_y})}continue}y=e.fieldValue(l,true);if(y&&y.constructor==Array){if(f){f.push(l)}for(q=0,h=y.length;q<h;q++){w.push({name:m,value:y[q]})}}else{if(c.fileapi&&l.type=="file"&&!l.disabled){if(f){f.push(l)}var g=l.files;if(g.length){for(q=0;q<g.length;q++){w.push({name:m,value:g[q],type:l.type})}}else{w.push({name:m,value:"",type:l.type})}}else{if(y!==null&&typeof y!="undefined"){if(f){f.push(l)}w.push({name:m,value:y,type:l.type,required:l.required})}}}}if(!x&&k.clk){var s=e(k.clk),u=s[0];m=u.name;if(m&&!u.disabled&&u.type=="image"){w.push({name:m,value:s.val()});w.push({name:m+".x",value:k.clk_x},{name:m+".y",value:k.clk_y})}}return w};e.fn.formSerialize=function(f){return e.param(this.formToArray(f))};e.fn.fieldSerialize=function(g){var f=[];this.each(function(){var l=this.name;if(!l){return}var j=e.fieldValue(this,g);if(j&&j.constructor==Array){for(var k=0,h=j.length;k<h;k++){f.push({name:l,value:j[k]})}}else{if(j!==null&&typeof j!="undefined"){f.push({name:this.name,value:j})}}});return e.param(f)};e.fn.fieldValue=function(l){for(var k=[],h=0,f=this.length;h<f;h++){var j=this[h];var g=e.fieldValue(j,l);if(g===null||typeof g=="undefined"||(g.constructor==Array&&!g.length)){continue}if(g.constructor==Array){e.merge(k,g)}else{k.push(g)}}return k};e.fieldValue=function(f,m){var h=f.name,u=f.type,w=f.tagName.toLowerCase();if(m===undefined){m=true}if(m&&(!h||f.disabled||u=="reset"||u=="button"||(u=="checkbox"||u=="radio")&&!f.checked||(u=="submit"||u=="image")&&f.form&&f.form.clk!=f||w=="select"&&f.selectedIndex==-1)){return null}if(w=="select"){var o=f.selectedIndex;if(o<0){return null}var r=[],g=f.options;var k=(u=="select-one");var q=(k?o+1:g.length);for(var j=(k?o:0);j<q;j++){var l=g[j];if(l.selected){var s=l.value;if(!s){s=(l.attributes&&l.attributes.value&&!(l.attributes.value.specified))?l.text:l.value}if(k){return s}r.push(s)}}return r}return e(f).val()};e.fn.clearForm=function(f){return this.each(function(){e("input,select,textarea",this).clearFields(f)})};e.fn.clearFields=e.fn.clearInputs=function(f){var g=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var i=this.type,h=this.tagName.toLowerCase();if(g.test(i)||h=="textarea"){this.value=""}else{if(i=="checkbox"||i=="radio"){this.checked=false}else{if(h=="select"){this.selectedIndex=-1}else{if(i=="file"){if(/MSIE/.test(navigator.userAgent)){e(this).replaceWith(e(this).clone())}else{e(this).val("")}}else{if(f){if((f===true&&/hidden/.test(i))||(typeof f=="string"&&e(this).is(f))){this.value=""}}}}}}})};e.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=="function"||(typeof this.reset=="object"&&!this.reset.nodeType)){this.reset()}})};e.fn.enable=function(f){if(f===undefined){f=true}return this.each(function(){this.disabled=!f})};e.fn.selected=function(f){if(f===undefined){f=true}return this.each(function(){var g=this.type;if(g=="checkbox"||g=="radio"){this.checked=f}else{if(this.tagName.toLowerCase()=="option"){var h=e(this).parent("select");if(f&&h[0]&&h[0].type=="select-one"){h.find("option").selected(false)}this.selected=f}}})};e.fn.ajaxSubmit.debug=false;function d(){if(!e.fn.ajaxSubmit.debug){return}var f="[jquery.form] "+Array.prototype.join.call(arguments,"");if(window.console&&window.console.log){window.console.log(f)}else{if(window.opera&&window.opera.postError){window.opera.postError(f)}}}})(jQuery);namespace("net.allyou.utils.forms");net.allyou.utils.form=Class.extend({init:function(b,a){this.options=a||{};this.$form=$(b);this.formContainsFiles=this.formContainsFiles||false;this.$uploadScreen=$('      <div id="uploadScreen">       <div class="panel">         <div class="status"><span class="percentage"></span><span class="uploaded"></span></div>          <div class="progressBar">           <div class="progress"></div>          </div>        </div>      </div>');this.initInfieldLabels();this.initSelectmenu();if(this.$form.is(":not(.noAjax)")){this.initAjaxForm()}},initInfieldLabels:function(){$("div.infieldLabel :input",this.$form).focus(function(a){$(this).parent().find("label").fadeOut(300)}).blur(function(a){if($(this).val().length==0){$(this).parent().find("label").fadeIn(300)}})},initSelectmenu:function(){$("select",this.$form).each(function(){var c=[],a=$(this).attr("name"),b={style:"popup",maxHeight:400,menuWidth:$(this).outerWidth(),escapeHtml:true};if($(this).closest("div.field").hasClass("selectWithIcons")){$(this).children("option").each(function(){var d=$(this).val();c.push({find:".ui-icon-"+a+"-"+d,icon:"ui-icon-"+a+"-"+d})});b.icons=c}$(this).selectmenu(b)})},initAjaxForm:function(){this.$form.ajaxForm({beforeSubmit:$.proxy(function(a,b,c){allyouLoading.isLoading();this.preserveFormState(b);if(window.File){for(var d=0;d<a.length;d++){var e=a[d];if(e.type=="file"&&e.value){this.formContainsFiles=true;break}}if(this.formContainsFiles){this.$uploadScreen.appendTo(document.body)}}},this),success:$.proxy(function(b,e,d,c){var f=$(c).parent();$(c).replaceWith(b);var a=f.children("form");this.init(a,this.options);if(this.options.onSuccess){this.options.onSuccess(b)}this.restoreFormState();allyouLoading.finishedLoading();if(this.formContainsFiles){$("#uploadScreen").remove()}},this),error:$.proxy(function(){allyouLoading.finishedLoading();if(this.formContainsFiles){$("#uploadScreen").remove()}},this),uploadProgress:function(f,b,e,g){var d=$("#uploadScreen"),c=g+"%",a="( of "+parseInt((e/1024),10)/1000+" MB)";if(g==100){c="Processing ...";a="";$("div.progress",d).addClass("processing")}$("span.percentage",d).html(c);$("span.uploaded",d).html(a);$("div.progress",d).css("width",g+"%")}});$("div.buttons input[name=cancel]",this.$form).click($.proxy(function(a){a.preventDefault();a.stopPropagation();if(this.options.onCancel){this.options.onCancel()}},this));$("div.field.submitOnChange :input",this.$form).change($.proxy(function(){this.$form.submit()},this))},preserveFormState:function(b){var e=b.attr("data-preserve-scroll"),c=b.attr("data-preserve-visibility"),a=b.attr("data-preserve-class"),d=this;this.preservedFormStates={scroll:{},visibility:{},"class":{}};$(e,b).each(function(){d.preservedFormStates.scroll[getCSSSelector($(this).get(0))]=$(this).scrollTop()});$(c,b).each(function(){d.preservedFormStates.visibility[getCSSSelector($(this).get(0))]=$(this).is(":visible")});$(a,b).each(function(){d.preservedFormStates["class"][getCSSSelector($(this).get(0))]=$(this).attr("class")})},restoreFormState:function(){$.each(this.preservedFormStates.visibility,function(a,b){if(b){$(a).show()}else{$(a).hide()}});$.each(this.preservedFormStates["class"],function(a,b){$(a).attr("class",b)});$.each(this.preservedFormStates.scroll,function(a,b){$(a).scrollTop(b)})}});namespace("net.allyou.utils");net.allyou.utils.loading=Class.extend({init:function(){this.counter=0},isLoading:function(){if(!this.counter++){$(document.body).addClass("loading");this.$modalCover=$('<div id="modalCover" class="coverEverything" />').click(function(a){a.preventDefault();a.stopPropagation();a.stopImmediatePropagation()}).appendTo(document.body)}},finishedLoading:function(){if(!--this.counter){$(document.body).removeClass("loading");this.$modalCover.remove()}}});var allyouLoading=new net.allyou.utils.loading();$(function(){window.setTimeout(function(){$(document.body).addClass("loaded")},500);$("form:not(.noAjaxForm)").each(function(){new net.allyou.utils.form(this)});var a=$("header#navigation");a.on("click","div.menu > a",$.proxy(function(c){c.preventDefault();var d=$(c.currentTarget).closest(".contentContainer");var b=$(c.currentTarget).parent();if(!b.hasClass("active")){$.ajax({url:$(c.currentTarget).attr("href"),success:$.proxy(function(i){var f=$("div.context",b).html(i);b.addClass("active");var g=$('<div id="modalCover" />').appendTo(d);var e=$(">a",b);var h=$("img.menuArrow",f).css({left:(e.offset().left-f.offset().left-4)+"px"});$(document.body).bind("click.outsideDialog",$.proxy(function(){b.removeClass("active");g.remove();$(document.body).unbind("click.outsideDialog")},this))},this)})}else{b.removeClass("active");$(document.body).unbind("click.outsideDialog")}},this));$(document).on("scroll",function(b){if($(document).scrollTop()<30){a.removeClass("small").addClass("large")}else{a.removeClass("large").addClass("small")}});Placeholders.init({live:true,hideOnFocus:false});$(document).on("click","a.registerLink",function(b){b.preventDefault();var c=$(b.currentTarget).attr("href");if(c!="#"){window.location.href=c+"&rnd="+Math.random()}$(b.currentTarget).attr("href","#")})});
;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $.fn.placeholder                ? $('input, textarea').placeholder() : null;

    // toggle order
    var showOrder    = false;
    var headerBottom = $('.main-header').outerHeight();
    var header       = $('.main-header');

    $('#nav-order').on('click', function() {
      $('.wrapper').toggleClass('slide');
      $('.header-bg').toggleClass('bg-slide');
      $('.order.row').toggleClass('visible');
      $('.main-header').toggleClass('left-indent');
      $('.main-header').toggleClass('default');
    });

    $(window).scroll(function() {
      evaluateHeader();
    });

    var evaluateHeader = function(){
      var windowPosition = $(window).scrollTop();
      if (windowPosition >= headerBottom) {
        if ( (header.hasClass('left-indent')) && ( !header.hasClass('sticky-header-left'))) {
          header.addClass('sticky-header-left');
        }
        if (! header.hasClass('sticky-header') && (!header.hasClass('sticky-header-left')) && (!header.hasClass('left-indent'))) {
          $('.main-header').addClass('hidden-header').delay(500).addClass('sticky-header');
          $('.content').addClass('sticky-header');
        }
      } else {
        if ( header.hasClass('sticky-header') || (header.hasClass('sticky-header-left'))) {
          $('.main-header').removeClass('sticky-header').removeClass('sticky-header-left').removeClass('hidden-header');
          $('.content').removeClass('sticky-header');
        }
      }
    };

    $('.quantity-order .quantity').on('change', function() {
      var val = $(this).val();
      var digitCheck = /^\d+$/;
      if ((val <= 0) || (! digitCheck.test(val)))  {
        $(this).val(1);
      } else {
        $(this).val(val);
      }
    });

    var generate_line_item = function(data) {
      var output = "";
      output += '<li class="order-item order-item-' + data.order_item.id + '">';
      output += '  <div class="order-item-info">';
      output += '    <div class="order-item-title-total">';
      output += '      <span class="order-item-title block">';
      output += '        ' + data.item.title;
      output += '      </span>';
      output += '      <span class="order-item-total block">';
      output += '        ' + data.order_item.subtotal;
      output += '      </span>';
      output += '    </div><!-- //order-item-title-total -->';
      output += '    <div class="item-quantity-modify">';
      output += '      <div class="quantity-price">';
      output += '        <span class="label">';
      output += '          Quantity';
      output += '        </span>';
      output += '        <span class="value">';
      output += '          ' + data.order_item.quantity + ' x ' + data.item.price;
      output += '        </span>';
      output += '      </div><!-- //quantity-price -->';
      output += '      <div class="modify">';
      output += '        <a class="remove-order-item" data-method="delete" data-confirm="Are you sure?" href="/order_items/' + data.order_item.id + '" rel="nofollow">Remove</a>';
      output += '      </div><!-- //modify -->';
      output += '    </div><!-- item-quantity-price -->';
      output += '  </div><!-- order-item-info -->';
      output += '</li>';

      return output;
    };

    $('.add-item').closest('form').on('ajax:success', function(event, data) {
      window.data = data
      $('.nav-order-item-count').text(data.order.total_items + " items");
      $('.nav-order-total').text(data.order.subtotal);
      if ( $('.no-order').length > 0 ) {
        $('.no-order').remove();
        $('.my-order').append('<ul class="my-order-items"></ul>');
        $('.my-order').append('<div class="order-total"><span class="label">Total</span><span class="value"></span></div>');
        $('.my-order').append('<div class="checkout"><a class="order-checkout" href="/review-my-order">Checkout</a></div>');
      }
      console.log('.order-item-' + data.order_item.id);
      if ($('.order-item-' + data.order_item.id).length > 0) {
        $('.order-item-' + data.order_item.id + ' .order-item-total').text(data.order_item.subtotal);
        $('.order-item-' + data.order_item.id + ' .order-item-quantity').text(data.order_item.quantity);
      } else {
        var new_line_item = generate_line_item(data);
        $('.my-order-items').append(new_line_item);
      }
      $('.order-total .value').text(data.order.subtotal);
    });

    if ( $('.remove-order-item').length > 0 ) {
      $('.remove-order-item').on('ajax:success', function(event, data) {
        window.order_data = data;
        $(this).closest('.order-item').fadeOut();
        $('.order-total .value').text(data.order.subtotal);
        $('.nav-order-item-count').text(data.order.total_items + " items");
        $('.nav-order-total').text(data.order.subtotal);
        if (data.order.total_items === 0) {
          $('.my-order').prepend('<p class="no-order">Sorry, it looks like you have not added any items yet!</p>');
          $('.my-order-items').remove();
          $('.checkout').remove();
          $('.order-total').remove();
          $('.order-checkout').remove();
        }
      });
    }

    var footer = $('.footer');
    var footerTop = footer.position().top;
    var footerHeight = footer.outerHeight();
    var documentHeight = footerTop + footerHeight + 5
    $('.order.row').css({'height':documentHeight});


  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }
})(jQuery, this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//





;
