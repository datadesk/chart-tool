/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Chart Tool
	 * @author Jeremy Agius <jagius@globeandmail.com>
	 * @author Tom Cardoso <tcardoso@globeandmail.com>
	 * @author Michael Pereira <mpereira@globeandmail.com>
	 * @see {@link} for further information.
	 * @see {@link http://www.github.com/globeandmail/chart-tool|Chart Tool}
	 * @license MIT
	 */
	
	(function ChartToolInit(root) {
	
	  if (root.d3) {
	
	    var ChartTool = (function ChartTool() {
	
	      var charts = root.__charttool || [],
	          dispatchFunctions = root.__charttooldispatcher || [],
	          drawn = [];
	
	      var settings = __webpack_require__(1),
	          utils = __webpack_require__(4);
	
	      var dispatcher = d3.dispatch("start", "finish", "redraw", "mouseOver", "mouseMove", "mouseOut", "click");
	
	      for (var prop in dispatchFunctions) {
	        if (dispatchFunctions.hasOwnProperty(prop)) {
	          if (d3.keys(dispatcher).indexOf(prop) > -1) {
	            dispatcher.on(prop, dispatchFunctions[prop]);
	          } else {
	            throw "Chart Tool does not offer a dispatcher of type '" + prop + "'. For available dispatcher types, please see the ChartTool.dispatch() method." ;
	          }
	        }
	      }
	
	      /**
	       * Clears previous iterations of chart objects stored in obj or the drawn array, then punts chart construction to the Chart Manager.
	       * @param  {String} container A string representing the container's selector.
	       * @param  {Object} obj       The chart ID and embed data.
	       */
	      function createChart(container, obj) {
	
	        dispatcher.start(obj);
	
	        drawn = utils.clearDrawn(drawn, obj);
	        obj = utils.clearObj(obj);
	        container = utils.clearChart(container);
	
	        var ChartManager = __webpack_require__(9);
	
	        obj.data.width = utils.getBounding(container, "width");
	        obj.dispatch = dispatcher;
	
	        var chartObj;
	
	        if (utils.svgTest(root)) {
	          chartObj = ChartManager(container, obj);
	        } else {
	          utils.generateThumb(container, obj, settings);
	        }
	
	        drawn.push({ id: obj.id, chartObj: chartObj });
	        obj.chartObj = chartObj;
	
	        d3.select(container)
	          .on("click", function() { dispatcher.click(this, chartObj); })
	          .on("mouseover", function() { dispatcher.mouseOver(this, chartObj); })
	          .on("mousemove", function() { dispatcher.mouseMove(this, chartObj);  })
	          .on("mouseout", function() { dispatcher.mouseOut(this, chartObj); });
	
	        dispatcher.finish(chartObj);
	
	      }
	
	      /**
	       * Grabs data on a chart based on an ID.
	       * @param {Array} charts Array of charts on the page.
	       * @param  {String} id The ID for the chart.
	       * @return {Object}    Returns stored embed object.
	       */
	      function readChart(id) {
	        for (var i = 0; i < charts.length; i++) {
	           if (charts[i].id === id) {
	            return charts[i];
	          }
	        };
	      }
	
	      /**
	       * List all the charts stored in the Chart Tool by chartid.
	       * @param {Array} charts Array of charts on the page.
	       * @return {Array}       List of chartid's.
	       */
	      function listCharts(charts) {
	        var chartsArr = [];
	        for (var i = 0; i < charts.length; i++) {
	          chartsArr.push(charts[i].id);
	        };
	        return chartsArr;
	      }
	
	      function updateChart(id, obj) {
	        var container = '.' + settings.baseClass() + '[data-chartid=' + settings.prefix + id + ']';
	        createChart(container, { id: id, data: obj });
	      }
	
	      function destroyChart(id) {
	        var container, obj;
	        for (var i = 0; i < charts.length; i++) {
	          if (charts[i].id === id) {
	            obj = charts[i];
	          }
	        };
	        container = '.' + settings.baseClass() + '[data-chartid=' + obj.id + ']';
	        utils.clearDrawn(drawn, obj);
	        utils.clearObj(obj);
	        utils.clearChart(container);
	      }
	
	      /**
	       * Iterate over all the charts, draw each chart into its respective container.
	       * @param {Array} charts Array of charts on the page.
	       */
	      function createLoop(charts) {
	        var chartList = listCharts(charts);
	        for (var i = 0; i < chartList.length; i++) {
	          var obj = readChart(chartList[i]);
	          var container = '.' + settings.baseClass() + '[data-chartid=' + chartList[i] + ']';
	          createChart(container, obj);
	        };
	      }
	
	      /**
	       * Chart Tool initializer which sets up debouncing and runs the createLoop(). Run only once, when the library is first loaded.
	       * @param {Array} charts Array of charts on the page.
	       */
	      function initializer(charts) {
	        createLoop(charts);
	        var debounce = utils.debounce(createLoop, charts, settings.debounce, root);
	        d3.select(root)
	          .on('resize.' + settings.prefix + 'debounce', debounce)
	          .on('resize.' + settings.prefix + 'redraw', dispatcher.redraw(charts));
	      }
	
	      return {
	
	        init: function init() {
	          return initializer(charts);
	        },
	
	        create: function create(container, obj) {
	          return createChart(container, obj);
	        },
	
	        read: function read(id) {
	          return readChart(id);
	        },
	
	        list: function list() {
	          return listCharts(charts);
	        },
	
	        update: function update(id, obj) {
	          return updateChart(id, obj);
	        },
	
	        destroy: function destroy(id) {
	          return destroyChart(id);
	        },
	
	        dispatch: function dispatch() {
	          return d3.keys(dispatcher);
	        },
	
	        wat: function wat() {
	          console.info("ChartTool v" + settings.version + " is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: www.github.com/globeandmail/chart-tool");
	        },
	
	        version: settings.version,
	        build: settings.build,
	        settings: __webpack_require__(1),
	        charts: __webpack_require__(9),
	        components: __webpack_require__(10),
	        helpers: __webpack_require__(8),
	        utils: __webpack_require__(4),
	        line: __webpack_require__(15),
	        area: __webpack_require__(19),
	        multiline: __webpack_require__(18),
	        stackedArea: __webpack_require__(20),
	        column: __webpack_require__(21),
	        stackedColumn: __webpack_require__(23),
	        streamgraph: __webpack_require__(24),
	        bar: __webpack_require__(22)
	
	      }
	
	    })();
	
	    if (!root.Meteor) { ChartTool.init(); }
	
	  } else {
	
	    var Meteor = this.Meteor || {},
	        isServer = Meteor.isServer || undefined;
	
	    if (!isServer) {
	      console.error("Chart Tool: no D3 library detected.");
	    }
	
	
	  }
	
	  root.ChartTool = ChartTool;
	
	})(typeof window !== "undefined" ? window : this);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var version = {
	  version: __webpack_require__(2).version,
	  build: __webpack_require__(2).buildver
	};
	
	var settings = __webpack_require__(3);
	
	module.exports = {
	
	  CUSTOM: settings.CUSTOM,
	  version: version.version,
	  build: version.build,
	  id: "",
	  data: "",
	  dateFormat: settings.dateFormat,
	  timeFormat: settings.timeFormat,
	  image: settings.image,
	  heading: "",
	  qualifier: "",
	  source: "",
	  deck: "",
	  index: "",
	  hasHours: false,
	  social: settings.social,
	  seriesHighlight: function() {
	    if (this.data.seriesAmount && this.data.seriesAmount <= 1) {
	      return 1;
	    } else {
	      return 0;
	    }
	  },
	  baseClass: function() { return this.prefix + "chart"; },
	  customClass: "",
	
	  options: {
	    type: "line",
	    interpolation: "linear",
	    stacked: false,
	    expanded: false,
	    head: true,
	    deck: false,
	    qualifier: true,
	    legend: true,
	    footer: true,
	    x_axis: true,
	    y_axis: true,
	    tips: false,
	    annotations: false,
	    range: false,
	    series: false,
	    share_data: true,
	    social: true
	  },
	
	  range: {},
	  series: {},
	  xAxis: settings.xAxis,
	  yAxis: settings.yAxis,
	
	  exportable: false, // this can be overwritten by the backend as needed
	  editable: false,
	
	  prefix: settings.prefix,
	  debounce: settings.debounce,
	  tipTimeout: settings.tipTimeout,
	  monthsAbr: settings.monthsAbr,
	
	  dimensions: {
	    width: 0,
	    computedWidth: function() {
	      return this.width - this.margin.left - this.margin.right;
	    },
	    height: function() {
	      var ratioScale = d3.scale.linear().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
	      return Math.round(ratioScale(this.width));
	    },
	    computedHeight: function() {
	      return (this.height() - this.headerHeight - this.footerHeight - this.margin.top - this.margin.bottom);
	    },
	    ratioMobile: settings.ratioMobile,
	    ratioDesktop: settings.ratioDesktop,
	    margin: settings.margin,
	    tipPadding: settings.tipPadding,
	    tipOffset: settings.tipOffset,
	    headerHeight: 0,
	    footerHeight: 0,
	    xAxisHeight: 0,
	    yAxisHeight: function() {
	      return (this.computedHeight() - this.xAxisHeight);
	    },
	    xAxisWidth: 0,
	    labelWidth: 0,
	    yAxisPaddingRight: settings.yAxis.paddingRight,
	    tickWidth: function() {
	      return (this.computedWidth() - (this.labelWidth + this.yAxisPaddingRight));
	    },
	    barHeight: settings.barHeight,
	    bands: {
	      padding: settings.bands.padding,
	      offset: settings.bands.offset,
	      outerPadding: settings.bands.outerPadding
	    }
	  }
	
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
		"name": "chart-tool",
		"version": "1.1.0",
		"buildVer": "0",
		"description": "A responsive charting application",
		"main": "gulpfile.js",
		"dependencies": {},
		"devDependencies": {
			"browser-sync": "^2.8.0",
			"gulp": "^3.8.11",
			"gulp-clean": "^0.3.1",
			"gulp-json-editor": "^2.2.1",
			"gulp-minify-css": "^1.2.0",
			"gulp-rename": "^1.2.2",
			"gulp-replace": "^0.5.3",
			"gulp-sass": "^2.0.4",
			"gulp-shell": "^0.4.2",
			"gulp-sourcemaps": "^1.5.2",
			"gulp-util": "^3.0.6",
			"jsdoc": "^3.3.2",
			"json-loader": "^0.5.3",
			"run-sequence": "^1.1.4",
			"webpack": "^1.12.14",
			"webpack-stream": "^3.1.0",
			"yargs": "^3.15.0"
		},
		"scripts": {
			"test": ""
		},
		"keywords": [
			"charts",
			"d3",
			"d3js",
			"meteor",
			"gulp",
			"webpack",
			"data visualization",
			"chart",
			"mongo"
		],
		"repository": {
			"type": "git",
			"url": "git@github.com:globeandmail/chart-tool.git"
		},
		"contributors": [
			{
				"author": "Tom Cardoso",
				"email": "tcardoso@globeandmail.com"
			},
			{
				"author": "Jeremy Agius",
				"email": "jagius@globeandmail.com"
			},
			{
				"author": "Michael Pereira",
				"email": "mpereira@globeandmail.com"
			}
		],
		"license": "MIT"
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
		"CUSTOM": false,
		"prefix": "la-g-",
		"monthsAbr": [
			"Jan.",
			"Feb.",
			"Mar.",
			"Apr.",
			"May",
			"June",
			"July",
			"Aug.",
			"Sept.",
			"Oct.",
			"Nov.",
			"Dec.",
			"Jan."
		],
		"debounce": 500,
		"tipTimeout": 5000,
		"ratioMobile": 1.15,
		"ratioDesktop": 0.65,
		"dateFormat": "%Y-%m-%d",
		"timeFormat": "%H:%M",
		"margin": {
			"top": 10,
			"right": 3,
			"bottom": 0,
			"left": 0
		},
		"tipOffset": {
			"vertical": 4,
			"horizontal": 1
		},
		"tipPadding": {
			"top": 4,
			"right": 9,
			"bottom": 4,
			"left": 9
		},
		"yAxis": {
			"display": true,
			"scale": "linear",
			"ticks": "5",
			"orient": "right",
			"format": "comma",
			"prefix": "",
			"suffix": "",
			"min": "",
			"max": "",
			"rescale": false,
			"nice": true,
			"paddingRight": 9,
			"tickLowerBound": 3,
			"tickUpperBound": 8,
			"tickGoal": 5,
			"widthThreshold": 420,
			"dy": "",
			"textX": 0,
			"textY": ""
		},
		"xAxis": {
			"display": true,
			"scale": "time",
			"ticks": "auto",
			"orient": "bottom",
			"format": "auto",
			"prefix": "",
			"suffix": "",
			"min": "",
			"max": "",
			"rescale": false,
			"nice": false,
			"rangePoints": 1,
			"tickTarget": 6,
			"ticksSmall": 4,
			"widthThreshold": 420,
			"dy": 0.7,
			"upper": {
				"tickHeight": 7,
				"textX": 6,
				"textY": 7
			},
			"lower": {
				"tickHeight": 12,
				"textX": 6,
				"textY": 2
			}
		},
		"barHeight": 30,
		"bands": {
			"padding": 0.06,
			"offset": 0.12,
			"outerPadding": 0.03
		},
		"source": {
			"prefix": "Source: ",
			"suffix": ""
		},
		"social": {
			"facebook": {
				"label": "Facebook",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-facebook.svg",
				"redirect": "",
				"appID": ""
			},
			"twitter": {
				"label": "Twitter",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-twitter.svg",
				"via": "latimesgraphics",
				"hashtag": ""
			},
			"email": {
				"label": "Email",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mail.svg"
			},
			"sms": {
				"label": "SMS",
				"icon": "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-telephone.svg"
			}
		},
		"image": {
			"enable": false,
			"base_path": "",
			"expiration": 30000,
			"filename": "thumbnail",
			"extension": "png",
			"thumbnailWidth": 460
		}
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Utilities module. Functions that aren't specific to any one module.
	 * @module utils/utils
	 */
	
	/**
	 * Given a function to perform, a timeout period, a parameter to pass to the performed function, and a reference to the window, fire a specific function.
	 * @param  {Function} fn      Function to perform on debounce.
	 * @param  {Object} obj      Object passed to Function which is performed on debounce.
	 * @param  {Integer}   timeout Timeout period in milliseconds.
	 * @param  {Object}   root    Window object.
	 * @return {Function}           Final debounce function.
	 */
	function debounce(fn, obj, timeout, root) {
	  var timeoutID = -1;
	  return function() {
	    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
	    timeoutID = root.setTimeout(function(){
	      fn(obj)
	    }, timeout);
	  }
	};
	
	/**
	 * Remove chart SVG and divs inside a container from the DOM.
	 * @param  {String} container
	 */
	function clearChart(container) {
	
	  var cont = document.querySelector(container);
	
	  while (cont && cont.querySelectorAll("svg").length) {
	    var svg = cont.querySelectorAll("svg");
	    svg[svg.length - 1].parentNode.removeChild(svg[svg.length - 1]);
	  }
	
	  while (cont && cont.querySelectorAll("div").length) {
	    var div = cont.querySelectorAll("div");
	    div[div.length - 1].parentNode.removeChild(div[div.length - 1]);
	  }
	
	  return container;
	}
	
	/**
	 * Clears the chart data of its post-render chartObj object.
	 * @param  {Object} obj Object used to construct charts.
	 * @return {Object}     The new version of the object.
	 */
	function clearObj(obj) {
	  if (obj.chartObj) { obj.chartObj = undefined; }
	  return obj;
	}
	
	/**
	 * Clears the drawn array.
	 * @param  {Array} drawn
	 * @param  {Object} obj
	 * @return {Array}
	 */
	function clearDrawn(drawn, obj) {
	  if (drawn.length) {
	    for (var i = drawn.length - 1; i >= 0; i--) {
	      if (drawn[i].id === obj.id) {
	        drawn.splice(i, 1);
	      }
	    };
	  }
	
	  return drawn;
	}
	
	/**
	 * Get the boundingClientRect dimensions given a selector.
	 * @param  {String} container
	 * @return {Object}           The boundingClientRect object.
	 */
	function getBounding(selector, dimension) {
	  return document.querySelector(selector).getBoundingClientRect()[dimension];
	}
	
	/**
	 * Basic factory for figuring out amount of milliseconds in a given time period.
	 */
	function TimeObj() {
	  this.sec = 1000;
	  this.min = this.sec * 60;
	  this.hour = this.min * 60;
	  this.day = this.hour * 24;
	  this.week = this.day * 7;
	  this.month = this.day * 30;
	  this.year = this.day * 365;
	}
	
	/**
	 * Slightly altered Bostock magic to wrap SVG <text> nodes based on available width
	 * @param  {Object} text    D3 text selection.
	 * @param  {Integer} width
	 */
	function wrapText(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.0, // ems
	        x = 0,
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan")
	          .attr("x", x)
	          .attr("y", y)
	          .attr("dy", dy + "em");
	
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan")
	          .attr("x", x)
	          .attr("y", y)
	          .attr("dy", ++lineNumber * lineHeight + dy + "em")
	          .text(word);
	      }
	    }
	  });
	}
	
	/**
	 * Given two dates date and a tolerance level, return a time "context" for the difference between the two values.
	 * @param  {Object} d1     Beginning date object.
	 * @param  {Object} d2     End date object.
	 * @param  {Integer} tolerance
	 * @return {String}           The resulting time context.
	 */
	function timeDiff(d1, d2, tolerance) {
	
	  var diff = d2 - d1,
	      time = new TimeObj();
	
	  // returning the context
	  if ((diff / time.year) > tolerance) { return "years"; }
	  else if ((diff / time.month) > tolerance) { return "months"; }
	  else if ((diff / time.week) > tolerance) { return "weeks"; }
	  else if ((diff / time.day) > tolerance) { return "days"; }
	  else if ((diff / time.hour) > tolerance) { return "hours"; }
	  else if ((diff / time.min) > tolerance) { return "minutes"; }
	  else { return "days"; }
	  // if none of these work i feel bad for you son
	  // i've got 99 problems but an if/else ain"t one
	
	}
	
	/**
	 * Given a dataset, figure out what the time context is and
	 * what the number of time units elapsed is
	 * @param  {Array} data
	 * @return {Integer}
	 */
	function timeInterval(data) {
	
	  var dataLength = data.length,
	      d1 = data[0].key,
	      d2 = data[dataLength - 1].key;
	
	  var ret;
	
	  var intervals = [
	    { type: "years", step: 1 },
	    { type: "months", step: 3 }, // quarters
	    { type: "months", step: 1 },
	    { type: "days", step: 1 },
	    { type: "hours", step: 1 },
	    { type: "minutes", step: 1 }
	  ];
	
	  for (var i = 0; i < intervals.length; i++) {
	    var intervalCandidate = d3.time[intervals[i].type](d1, d2, intervals[i].step).length;
	    if (intervalCandidate >= dataLength - 1) {
	      var ret = intervalCandidate;
	      break;
	    }
	  };
	
	  return ret;
	
	}
	
	/**
	 * Returns the transform position of an element as an array
	 * @param  {Object} node
	 * @return {Array}
	 */
	function getTranslateXY(node) {
	  return d3.transform(d3.select(node).attr("transform")).translate;
	}
	
	/**
	 * Returns a translate statement because it's annoying to type out
	 * @return {String}
	 */
	function translate(x, y) {
	    return "translate(" + x + ", " + y + ")";
	}
	
	/**
	 * Tests for SVG support, taken from https://github.com/viljamis/feature.js/
	 * @param  {Object} root A reference to the browser window object.
	 * @return {Boolean}
	 */
	function svgTest(root) {
	  return !!root.document && !!root.document.createElementNS && !!root.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
	}
	
	/**
	 * Constructs the AWS URL for a given chart ID.
	 * @param  {Object} obj
	 * @return {String}
	 */
	function getThumbnailPath(obj) {
	  var imgSettings = obj.image;
	
	  imgSettings.bucket = __webpack_require__(5);
	
	  var id = obj.id.replace(obj.prefix, "");
	
	  return "https://s3.amazonaws.com/" + imgSettings.bucket + "/" + imgSettings.base_path + id + "/" + imgSettings.filename + "." + imgSettings.extension;
	}
	
	/**
	 * Given a chart object and container, generate and append a thumbnail
	 */
	function generateThumb(container, obj, settings) {
	
	  var imgSettings = settings.image;
	
	  var cont = document.querySelector(container),
	      fallback = cont.querySelector("." + settings.prefix + "base64img");
	
	  if (imgSettings && imgSettings.enable && obj.data.id) {
	
	    var img = document.createElement('img');
	
	    img.setAttribute('src', getThumbnailPath(obj));
	    img.setAttribute('alt', obj.data.heading);
	    img.setAttribute('class', settings.prefix + "thumbnail");
	
	    cont.appendChild(img);
	
	  } else if (fallback) {
	
	    fallback.style.display = 'block';
	
	  }
	
	}
	
	function csvToTable(target, data) {
	  var parsedCSV = d3.csv.parseRows(data);
	
	  target.append("table").selectAll("tr")
	    .data(parsedCSV).enter()
	    .append("tr").selectAll("td")
	    .data(function(d) { return d; }).enter()
	    .append("td")
	    .text(function(d) { return d; });
	}
	
	module.exports = {
	  debounce: debounce,
	  clearChart: clearChart,
	  clearObj: clearObj,
	  clearDrawn: clearDrawn,
	  getBounding: getBounding,
	  TimeObj: TimeObj,
	  wrapText: wrapText,
	  timeDiff: timeDiff,
	  timeInterval: timeInterval,
	  getTranslateXY: getTranslateXY,
	  translate: translate,
	  svgTest: svgTest,
	  getThumbnailPath: getThumbnailPath,
	  generateThumb: generateThumb,
	  csvToTable: csvToTable,
	  dataParse: __webpack_require__(6),
	  factory: __webpack_require__(7)
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// s3_bucket is defined in webpack.config.js
	module.exports = (undefined);


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Data parsing module. Takes a CSV and turns it into an Object, and optionally determines the formatting to use when parsing dates.
	 * @module utils/dataparse
	 * @see module:utils/factory
	 */
	
	/**
	 * Determines whether a scale returns an input date or not.
	 * @param  {String} scaleType      The type of scale.
	 * @param  {String} defaultFormat  Format set by the chart tool settings.
	 * @param  {String} declaredFormat Format passed by the chart embed code, if there is one
	 * @return {String|Undefined}
	 */
	function inputDate(scaleType, defaultFormat, declaredFormat) {
	
	  if (scaleType === "time" || scaleType === "ordinal-time") {
	    return declaredFormat || defaultFormat;
	  } else {
	    return undefined;
	  }
	
	}
	
	/**
	 * Parses a CSV string using d3.csv.parse() and turns it into an array of objects.
	 * @param  {String} csv             CSV string to be parsed
	 * @param  {String inputDateFormat Date format in D3 strftime style, if there is one
	 * @param  {String} index           Value to index the data to, if there is one
	 * @return { {csv: String, data: Array, seriesAmount: Integer, keys: Array} }                 An object with the original CSV string, the newly-formatted data, the number of series in the data and an array of keys used.
	 */
	function parse(csv, inputDateFormat, index, stacked, type) {
	
	  var keys, val;
	
	  var firstVals = {};
	
	  var data = d3.csv.parse(csv, function(d, i) {
	
	    var obj = {};
	
	    if (i === 0) { keys = d3.keys(d); }
	
	    if (inputDateFormat) {
	      var dateFormat = d3.time.format(inputDateFormat);
	      obj.key = dateFormat.parse(d3.values(d)[0]);
	    } else {
	      obj.key = d3.values(d)[0];
	    }
	
	    obj.series = [];
	
	    for (var j = 1; j < d3.keys(d).length; j++) {
	
	      var key = d3.keys(d)[j];
	
	      if (d[key] === 0 || d[key] === "") {
	        d[key] = "__undefined__";
	      }
	
	      if (index) {
	
	        if (i === 0 && !firstVals[key]) {
	          firstVals[key] = d[key];
	        }
	
	        if (index === "0") {
	          val = ((d[key] / firstVals[key]) - 1) * 100;
	        } else {
	          val = (d[key] / firstVals[key]) * index;
	        }
	
	      } else {
	        val = d[key];
	      }
	
	      obj.series.push({
	        val: val,
	        key: key
	      });
	
	    }
	
	    return obj;
	
	  });
	
	  var seriesAmount = data[0].series.length;
	
	  if (stacked) {
	    if (type === "stream") {
	      var stack = d3.layout.stack().offset("silhouette");
	    } else {
	      var stack = d3.layout.stack();
	    }
	    var stackedData = stack(d3.range(seriesAmount).map(function(key) {
	      return data.map(function(d) {
	        return {
	          legend: keys[key + 1],
	          x: d.key,
	          y: Number(d.series[key].val),
	          raw: d
	        };
	      });
	    }));
	  }
	
	  return {
	    csv: csv,
	    data: data,
	    seriesAmount: seriesAmount,
	    keys: keys,
	    stackedData: stackedData || undefined
	  }
	}
	
	module.exports = {
	  inputDate: inputDate,
	  parse: parse
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Recipe factor factory module.
	 * @module utils/factory
	 * @see module:charts/index
	 */
	
	/**
	 * Given a "recipe" of settings for a chart, patch it with an object and parse the data for the chart.
	 * @param {Object} settings
	 * @param {Object} obj
	 * @return {Object} The final chart recipe.
	 */
	function RecipeFactory(settings, obj) {
	  var dataParse = __webpack_require__(6);
	  var helpers = __webpack_require__(8);
	
	  var t = helpers.extend(settings); // short for template
	
	  var embed = obj.data;
	  var chart = embed.chart;
	
	  // I'm not a big fan of indenting stuff like this
	  // (looking at you, Pereira), but I'm making an exception
	  // in this case because my eyes were bleeding.
	
	  t.dispatch         = obj.dispatch;
	
	  t.version          = embed.version                          || t.version;
	  t.id               = obj.id                                 || t.id;
	  t.heading          = embed.heading                          || t.heading;
	  t.qualifier        = embed.qualifier                        || t.qualifier;
	  t.source           = embed.source                           || t.source;
	  t.deck             = embed.deck                             || t.deck
	  t.customClass      = chart.class                            || t.customClass;
	
	  t.xAxis            = helpers.extend(t.xAxis, chart.x_axis)  || t.xAxis;
	  t.yAxis            = helpers.extend(t.yAxis, chart.y_axis)  || t.yAxis;
	
	  var o = t.options,
	      co = chart.options;
	
	  //  "options" area of embed code
	  o.type             = chart.options.type                     || o.type;
	  o.interpolation    = chart.options.interpolation            || o.interpolation;
	
	  o.social      = !helpers.isUndefined(co.social) === true ? co.social           : o.social;
	  o.share_data   = !helpers.isUndefined(co.share_data) === true ? co.share_data  : o.share_data;
	  o.stacked     = !helpers.isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
	  o.expanded    = !helpers.isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
	  o.head        = !helpers.isUndefined(co.head) === true ? co.head               : o.head;
	  o.deck        = !helpers.isUndefined(co.deck) === true ? co.deck               : o.deck;
	  o.legend      = !helpers.isUndefined(co.legend) === true ? co.legend           : o.legend;
	  o.qualifier   = !helpers.isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
	  o.footer      = !helpers.isUndefined(co.footer) === true ? co.footer           : o.footer;
	  o.x_axis      = !helpers.isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
	  o.y_axis      = !helpers.isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
	  o.tips        = !helpers.isUndefined(co.tips) === true ? co.tips               : o.tips;
	  o.annotations = !helpers.isUndefined(co.annotations) === true ? co.annotations : o.annotations;
	  o.range       = !helpers.isUndefined(co.range) === true ? co.range             : o.range;
	  o.series      = !helpers.isUndefined(co.series) === true ? co.series           : o.series;
	  o.index       = !helpers.isUndefined(co.indexed) === true ? co.indexed         : o.index;
	
	  //  these are specific to the t object and don't exist in the embed
	  t.baseClass        = embed.baseClass                        || t.baseClass;
	
	  t.dimensions.width = embed.width                            || t.dimensions.width;
	
	  t.prefix           = chart.prefix                           || t.prefix;
	  t.exportable       = chart.exportable                       || t.exportable;
	  t.editable         = chart.editable                         || t.editable;
	
	  if (t.exportable) {
	    t.dimensions.width = chart.exportable.width || embed.width || t.dimensions.width;
	    t.dimensions.height = function() { return chart.exportable.height; }
	    t.dimensions.margin = chart.exportable.margin || t.dimensions.margin;
	  }
	
	  if (chart.hasHours) { t.dateFormat += " " + t.timeFormat; }
	  t.hasHours         = chart.hasHours                         || t.hasHours;
	  t.dateFormat       = chart.dateFormat                       || t.dateFormat;
	
	  t.dateFormat = dataParse.inputDate(t.xAxis.scale, t.dateFormat, chart.date_format);
	  t.data = dataParse.parse(chart.data, t.dateFormat, o.index, o.stacked, o.type) || t.data;
	
	  return t;
	
	}
	
	module.exports = RecipeFactory;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Helpers that manipulate and check primitives. Nothing D3-specific here.
	 * @module helpers/helpers
	 */
	
	/**
	 * Returns true if value is an integer, false otherwise.
	 * @return {Boolean}
	 */
	function isInteger(x) {
	  return x % 1 === 0;
	}
	
	/**
	 * Returns true if value is a float.
	 * @return {Boolean}
	 */
	function isFloat(n) {
	  return n === +n && n !== (n|0);
	}
	
	/**
	 * Returns true if a value is empty. Works for Objects, Arrays, Strings and Integers.
	 * @return {Boolean}
	 */
	function isEmpty(val) {
	  if (val.constructor == Object) {
	    for (var prop in val) {
	      if (val.hasOwnProperty(prop)) { return false; }
	    }
	    return true;
	  } else if (val.constructor == Array) {
	    return !val.length;
	  } else {
	    return !val;
	  }
	}
	
	/**
	 * Simple check for whether a value is undefined or not
	 * @return {Boolean}
	 */
	function isUndefined(val) {
	  return val === undefined ? true : false;
	}
	
	/**
	 * Given two arrays, returns only unique values in those arrays.
	 * @param  {Array} a1
	 * @param  {Array} a2
	 * @return {Array}    Array of unique values.
	 */
	function arrayDiff(a1, a2) {
	  var o1 = {}, o2 = {}, diff= [], i, len, k;
	  for (i = 0, len = a1.length; i < len; i++) { o1[a1[i]] = true; }
	  for (i = 0, len = a2.length; i < len; i++) { o2[a2[i]] = true; }
	  for (k in o1) { if (!(k in o2)) { diff.push(k); } }
	  for (k in o2) { if (!(k in o1)) { diff.push(k); } }
	  return diff;
	}
	
	/**
	 * Opposite of arrayDiff(), this returns only common elements between arrays.
	 * @param  {Array} arr1
	 * @param  {Array} arr2
	 * @return {Array}      Array of common values.
	 */
	function arraySame(a1, a2) {
	  var ret = [];
	  for (i in a1) {
	    if (a2.indexOf( a1[i] ) > -1){
	      ret.push( a1[i] );
	    }
	  }
	  return ret;
	}
	
	/**
	 * Extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned
	 * @param  {*} from
	 * @param  {*} to
	 * @return {*}      Cloned object.
	 */
	function extend(from, to) {
	  if (from == null || typeof from != "object") return from;
	  if (from.constructor != Object && from.constructor != Array) return from;
	  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
	    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
	    return new from.constructor(from);
	
	  to = to || new from.constructor();
	
	  for (var name in from) {
	    to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
	  }
	
	  return to;
	}
	
	/**
	 * Compares two objects, returning an array of unique keys.
	 * @param  {Object} o1
	 * @param  {Object} o2
	 * @return {Array}
	 */
	function uniqueKeys(o1, o2) {
	  return arrayDiff(d3.keys(o1), d3.keys(o2));
	}
	
	/**
	 * Compares two objects, returning an array of common keys.
	 * @param  {Object} o1
	 * @param  {Object} o2
	 * @return {Array}
	 */
	function sameKeys(o1, o2) {
	  return arraySame(d3.keys(o1), d3.keys(o2));
	}
	
	/**
	 * If a string is undefined, return an empty string instead.
	 * @param  {String} str
	 * @return {String}
	 */
	function cleanStr(str){
	  if (str === undefined) {
	    return "";
	  } else {
	    return str;
	  }
	}
	
	module.exports = {
	  isInteger: isInteger,
	  isFloat: isFloat,
	  isEmpty: isEmpty,
	  isUndefined: isUndefined,
	  extend: extend,
	  arrayDiff: arrayDiff,
	  arraySame: arraySame,
	  uniqueKeys: uniqueKeys,
	  sameKeys: sameKeys,
	  cleanStr: cleanStr
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Chart contruction manager module.
	 * @module charts/manager
	 */
	
	/**
	 * Manages the step-by-step creation of a chart, and returns the full configuration for the chart, including references to nodes, scales, axes, etc.
	 * @param {String} container Selector for the container the chart will be drawn into.
	 * @param {Object} obj       Object that contains settings for the chart.
	 */
	function ChartManager(container, obj) {
	
	  var Recipe = __webpack_require__(7),
	      settings = __webpack_require__(1),
	      components = __webpack_require__(10);
	
	  var chartRecipe = new Recipe(settings, obj);
	
	  var rendered = chartRecipe.rendered = {};
	
	  // check that each section is needed
	
	  if (chartRecipe.options.head) {
	    rendered.header = components.header(container, chartRecipe);
	  }
	
	  if (chartRecipe.options.footer) {
	    rendered.footer = components.footer(container, chartRecipe);
	  }
	
	  var node = components.base(container, chartRecipe);
	
	  rendered.container = node;
	
	  rendered.plot = components.plot(node, chartRecipe);
	
	  if (chartRecipe.options.qualifier) {
	    rendered.qualifier = components.qualifier(node, chartRecipe);
	  }
	
	  if (chartRecipe.options.tips) {
	    rendered.tips = components.tips(node, chartRecipe);
	  }
	
	  if (!chartRecipe.editable && !chartRecipe.exportable) {
	    if (chartRecipe.options.share_data) {
	      rendered.shareData = components.shareData(container, chartRecipe);
	    }
	    if (chartRecipe.options.social) {
	      rendered.social = components.social(container, chartRecipe);
	    }
	  }
	
	  if (chartRecipe.CUSTOM) {
	    var custom = __webpack_require__(29);
	    rendered.custom = custom(node, chartRecipe, rendered);
	  }
	
	  return chartRecipe;
	
	};
	
	module.exports = ChartManager;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var components = {
	  base: __webpack_require__(11),
	  header: __webpack_require__(12),
	  footer: __webpack_require__(13),
	  plot: __webpack_require__(14),
	  qualifier: __webpack_require__(25),
	  axis: __webpack_require__(16),
	  scale: __webpack_require__(17),
	  tips: __webpack_require__(26),
	  social: __webpack_require__(27),
	  shareData: __webpack_require__(28)
	};
	
	module.exports = components;


/***/ },
/* 11 */
/***/ function(module, exports) {

	function append(container, obj) {
	
	  var margin = obj.dimensions.margin;
	
	  var chartBase = d3.select(container)
	    .insert("svg", "." + obj.prefix + "chart_source")
	    .attr({
	      "class": obj.baseClass() + "_svg " + obj.prefix + obj.customClass + " " + obj.prefix + "type_" + obj.options.type + " " + obj.prefix + "series-" + obj.data.seriesAmount,
	      "width": obj.dimensions.computedWidth() + margin.left + margin.right,
	      "height": obj.dimensions.computedHeight() + margin.top + margin.bottom,
	      "version": 1.1,
	      "xmlns": "http://www.w3.org/2000/svg"
	    });
	
	  // background rect
	  chartBase
	    .append("rect")
	    .attr({
	      "class": obj.prefix + "bg",
	      "x": 0,
	      "y": 0,
	      "width": obj.dimensions.computedWidth(),
	      "height": obj.dimensions.computedHeight(),
	      "transform": "translate(" + margin.left + "," + margin.top + ")"
	    });
	
	  var graph = chartBase.append("g")
	    .attr({
	      "class": obj.prefix + "graph",
	      "transform": "translate(" + margin.left + "," + margin.top + ")"
	    });
	
	  return graph;
	
	}
	
	module.exports = append;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	function headerComponent(container, obj) {
	
	  var helpers = __webpack_require__(8);
	
	  var headerGroup = d3.select(container)
	    .append("div")
	    .classed(obj.prefix + "chart_title " + obj.prefix + obj.customClass, true)
	
	  // hack necessary to ensure PDF fields are sized properly
	  if (obj.exportable) {
	    headerGroup.style("width", obj.exportable.width + "px");
	  }
	
	  if (obj.heading !== "" || obj.editable) {
	    var headerText = headerGroup
	      .append("div")
	      .attr("class", obj.prefix + "chart_title-text")
	      .text(obj.heading);
	
	    if (obj.editable) {
	      headerText
	        .attr("contentEditable", true)
	        .classed("editable-chart_title", true);
	    }
	
	  }
	
	  var qualifier;
	
	  if (obj.options.type === "bar") {
	    qualifier = headerGroup
	      .append("div")
	      .attr({
	        "class": function() {
	          var str = obj.prefix + "chart_qualifier " + obj.prefix + "chart_qualifier-bar";
	          if (obj.editable) {
	            str += " editable-chart_qualifier";
	          }
	          return str;
	        },
	        "contentEditable": function() {
	          return obj.editable ? true : false;
	        }
	      })
	      .text(obj.qualifier);
	  }
	
	  if (obj.data.keys.length > 2) {
	
	    var legend = headerGroup.append("div")
	      .classed(obj.prefix + "chart_legend", true);
	
	    var keys = helpers.extend(obj.data.keys);
	
	    // get rid of the first item as it doesnt represent a series
	    keys.shift();
	
	    if (obj.options.type === "multiline") {
	      keys = [keys[0], keys[1]];
	      legend.classed(obj.prefix + "chart_legend-" + obj.options.type, true);
	    }
	
	    var legendItem = legend.selectAll("div." + obj.prefix + "legend_item")
	      .data(keys)
	      .enter()
	      .append("div")
	      .attr("class", function(d, i) {
	        return obj.prefix + "legend_item " + obj.prefix + "legend_item_" + (i);
	      });
	
	    legendItem.append("span")
	      .attr("class", obj.prefix + "legend_item_icon");
	
	    legendItem.append("span")
	      .attr("class", obj.prefix + "legend_item_text")
	      .text(function(d) { return d; });
	  }
	
	  obj.dimensions.headerHeight = headerGroup.node().getBoundingClientRect().height;
	
	  return {
	    headerGroup: headerGroup,
	    legend: legend,
	    qualifier: qualifier
	  };
	
	}
	
	module.exports = headerComponent;


/***/ },
/* 13 */
/***/ function(module, exports) {

	function footerComponent(container, obj) {
	
	  var footerGroup;
	
	  if (obj.source !== "" || obj.editable) {
	    footerGroup = d3.select(container)
	      .append("div")
	      .classed(obj.prefix + "chart_source", true);
	
	    // hack necessary to ensure PDF fields are sized properly
	    if (obj.exportable) {
	      footerGroup.style("width", obj.exportable.width + "px");
	    }
	
	    var footerText = footerGroup.append("div")
	      .attr("class", obj.prefix + "chart_source-text")
	      .text(obj.source);
	
	    if (obj.editable) {
	      footerText
	        .attr("contentEditable", true)
	        .classed("editable-chart_source", true);
	    }
	
	    obj.dimensions.footerHeight = footerGroup.node().getBoundingClientRect().height;
	
	  }
	
	  return {
	    footerGroup: footerGroup
	  };
	
	}
	
	module.exports = footerComponent;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	function plot(node, obj) {
	
	  var draw = {
	    line: __webpack_require__(15),
	    multiline: __webpack_require__(18),
	    area: __webpack_require__(19),
	    stackedArea: __webpack_require__(20),
	    column: __webpack_require__(21),
	    bar: __webpack_require__(22),
	    stackedColumn: __webpack_require__(23),
	    streamgraph: __webpack_require__(24)
	  };
	
	  var chartRef;
	
	  switch(obj.options.type) {
	
	    case "line":
	      chartRef = draw.line(node, obj);
	      break;
	
	    case "multiline":
	      chartRef = draw.multiline(node, obj);
	      break;
	
	    case "area":
	      chartRef = obj.options.stacked ? draw.stackedArea(node, obj) : draw.area(node, obj);
	      break;
	
	    case "bar":
	      chartRef = draw.bar(node, obj);
	      break;
	
	    case "column":
	      chartRef = obj.options.stacked ? draw.stackedColumn(node, obj) : draw.column(node, obj);
	      break;
	
	    case "stream":
	      chartRef = draw.streamgraph(node, obj);
	      break;
	
	    default:
	      chartRef = draw.line(node, obj);
	      break;
	  }
	
	  return chartRef;
	
	}
	
	module.exports = plot;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	function LineChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "line " + obj.prefix + "line-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "line " + obj.prefix + "line-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      },
	      "d": hLine
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };
	
	};
	
	module.exports = LineChart;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	function AxisFactory(axisObj, scale) {
	
	  var axis = d3.svg.axis()
	    .scale(scale)
	    .orient(axisObj.orient);
	
	  return axis;
	
	}
	
	function axisManager(node, obj, scale, axisType) {
	
	  var axisObj = obj[axisType];
	  var axis = new AxisFactory(axisObj, scale);
	
	  var prevAxis = node.select("." + obj.prefix + "axis-group" + "." + obj.prefix + axisType).node();
	
	  if (prevAxis !== null) { d3.select(prevAxis).remove(); }
	
	  var axisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + axisType);
	
	  if (axisType === "xAxis") {
	    appendXAxis(axisGroup, obj, scale, axis, axisType);
	  } else if (axisType === "yAxis") {
	    appendYAxis(axisGroup, obj, scale, axis, axisType);
	  }
	
	  return {
	    node: axisGroup,
	    axis: axis
	  };
	
	}
	
	function determineFormat(context) {
	
	  switch (context) {
	    case "years": return d3.time.format("%Y");
	    case "months": return d3.time.format("%b");
	    case "weeks": return d3.time.format("%W");
	    case "days": return d3.time.format("%j");
	    case "hours": return d3.time.format("%H");
	    case "minutes": return d3.time.format("%M");
	  }
	
	}
	
	function appendXAxis(axisGroup, obj, scale, axis, axisName) {
	
	  var axisObj = obj[axisName],
	      axisSettings;
	
	  if (obj.exportable && obj.exportable.x_axis) {
	    var extend = __webpack_require__(8).extend;
	    axisSettings = extend(axisObj, obj.exportable.x_axis);
	  } else {
	    axisSettings = axisObj;
	  }
	
	  axisGroup
	    .attr("transform", "translate(0," + obj.dimensions.yAxisHeight() + ")");
	
	  var axisNode = axisGroup.append("g")
	    .attr("class", obj.prefix + "x-axis");
	
	  switch(axisObj.scale) {
	    case "time":
	      timeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	    case "ordinal":
	      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
	      break;
	    case "ordinal-time":
	      ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	  }
	
	  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;
	
	}
	
	function appendYAxis(axisGroup, obj, scale, axis, axisName) {
	
	  axisGroup.attr("transform", "translate(0,0)");
	
	  var axisNode = axisGroup.append("g")
	    .attr("class", obj.prefix + "y-axis");
	
	  drawYAxis(obj, axis, axisNode);
	
	}
	
	function drawYAxis(obj, axis, axisNode) {
	
	  var axisSettings;
	
	  var axisObj = obj["yAxis"];
	
	  if (obj.exportable && obj.exportable.y_axis) {
	    var extend = __webpack_require__(8).extend;
	    axisSettings = extend(axisObj, obj.exportable.y_axis);
	  } else {
	    axisSettings = axisObj;
	  }
	
	  obj.dimensions.yAxisPaddingRight = axisSettings.paddingRight;
	
	  axis.scale().range([obj.dimensions.yAxisHeight(), 0]);
	
	  axis.tickValues(tickFinderY(axis.scale(), axisObj.ticks, axisSettings));
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  axisNode.selectAll(".tick text")
	    .attr("transform", "translate(0,0)")
	    .call(updateTextY, axisNode, obj, axis, axisObj)
	    .call(repositionTextY, obj.dimensions, axisObj.textX);
	
	  axisNode.selectAll(".tick line")
	    .attr({
	      "x1": obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	      "x2": obj.dimensions.computedWidth()
	    });
	
	}
	
	function timeAxis(axisNode, obj, scale, axis, axisSettings) {
	
	  var timeDiff = __webpack_require__(4).timeDiff,
	      domain = scale.domain(),
	      ctx = timeDiff(domain[0], domain[1], 3),
	      currentFormat = determineFormat(ctx);
	
	  axis.tickFormat(currentFormat);
	
	  var ticks;
	
	  var tickGoal;
	  if (axisSettings.ticks === 'auto') {
	    tickGoal = axisSettings.tickTarget;
	  } else {
	    tickGoal = axisSettings.ticks;
	  }
	
	  if (obj.dimensions.tickWidth() > axisSettings.widthThreshold) {
	    ticks = tickFinderX(domain, ctx, tickGoal);
	  } else {
	    ticks = tickFinderX(domain, ctx, axisSettings.ticksSmall);
	  }
	
	  if (obj.options.type !== "column") {
	    axis.tickValues(ticks);
	  } else {
	    axis.ticks();
	  }
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .attr({
	      "x": axisSettings.upper.textX,
	      "y": axisSettings.upper.textY,
	      "dy": axisSettings.dy + "em"
	    })
	    .style("text-anchor", "start")
	    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);
	
	  if (obj.options.type === "column") { dropRedundantTicks(axisNode, ctx); }
	
	  axisNode.selectAll(".tick")
	    .call(dropTicks);
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	}
	
	function discreteAxis(axisNode, scale, axis, axisSettings, dimensions) {
	
	  var wrapText = __webpack_require__(4).wrapText;
	
	  axis.tickPadding(0);
	
	  scale.rangeExtent([0, dimensions.tickWidth()]);
	
	  scale.rangeRoundBands([0, dimensions.tickWidth()], dimensions.bands.padding, dimensions.bands.outerPadding);
	
	  var bandStep = scale.rangeBand();
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .style("text-anchor", "middle")
	    .attr("dy", axisSettings.dy + "em")
	    .call(wrapText, bandStep);
	
	  var firstXPos = d3.transform(axisNode.select(".tick").attr("transform")).translate[0] * -1;
	
	  var xPos = (- (bandStep / 2) - (bandStep * dimensions.bands.outerPadding));
	
	  axisNode.selectAll("line")
	    .attr({
	      "x1": xPos,
	      "x2": xPos
	    });
	
	  axisNode.select("line")
	    .attr({
	      "x1": firstXPos,
	      "x2": firstXPos
	    });
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	  var lastTick = axisNode.append("g")
	    .attr({
	      "class": "tick",
	      "transform": "translate(" + (dimensions.tickWidth() + (bandStep / 2) + bandStep * dimensions.bands.outerPadding) + ",0)"
	    });
	
	  lastTick.append("line")
	    .attr({
	      "y2": axisSettings.upper.tickHeight,
	      "x1": xPos,
	      "x2": xPos
	    });
	
	}
	
	function ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings) {
	
	  var timeDiff = __webpack_require__(4).timeDiff,
	      domain = scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 3),
	      currentFormat = determineFormat(ctx);
	
	  axis.tickFormat(currentFormat);
	
	  axisNode.call(axis);
	
	  axisNode.selectAll("text")
	    .attr({
	      "x": axisSettings.upper.textX,
	      "y": axisSettings.upper.textY,
	      "dy": axisSettings.dy + "em"
	    })
	    .style("text-anchor", "start")
	    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);
	
	  if (obj.dimensions.computedWidth() > obj.xAxis.widthThreshold) {
	    var ordinalTickPadding = 7;
	  } else {
	    var ordinalTickPadding = 4;
	  }
	
	  axisNode.selectAll(".tick")
	    .call(ordinalTimeTicks, axisNode, ctx, scale, ordinalTickPadding);
	
	  axisNode.selectAll("line")
	    .attr("y2", axisSettings.upper.tickHeight);
	
	}
	
	// text formatting functions
	
	function setTickFormatX(selection, ctx, ems, monthsAbr) {
	
	  var prevYear,
	      prevMonth,
	      prevDate,
	      dYear,
	      dMonth,
	      dDate,
	      dHour,
	      dMinute;
	
	  selection.text(function(d) {
	
	    var node = d3.select(this);
	
	    var dStr;
	
	    switch (ctx) {
	      case "years":
	        dStr = d.getFullYear();
	        break;
	      case "months":
	
	        dMonth = monthsAbr[d.getMonth()];
	        dYear = d.getFullYear();
	
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	
	        dStr = dMonth;
	
	        prevYear = dYear;
	
	        break;
	      case "weeks":
	      case "days":
	        dYear = d.getFullYear();
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	
	        if (dMonth !== prevMonth) {
	          dStr = dMonth + " " + dDate;
	        } else {
	          dStr = dDate;
	        }
	
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	
	        prevMonth = dMonth;
	        prevYear = dYear;
	
	        break;
	
	      case "hours":
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        var dHourStr,
	            dMinuteStr;
	
	        // Convert from 24h time
	        var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
	        if (dHour === 0) {
	          dHourStr = 12;
	        } else if (dHour > 12) {
	          dHourStr = dHour - 12;
	        } else {
	          dHourStr = dHour;
	        }
	
	        // Make minutes follow Globe style
	        if (dMinute === 0) {
	          dMinuteStr = '';
	        } else if (dMinute < 10) {
	          dMinuteStr = ':0' + dMinute;
	        } else {
	          dMinuteStr = ':' + dMinute;
	        }
	
	        dStr = dHourStr + dMinuteStr + ' ' + suffix;
	
	        if (dDate !== prevDate) {
	          var dateStr = dMonth + " " + dDate;
	          newTextNode(node, dateStr, ems);
	        }
	
	        prevDate = dDate;
	
	        break;
	      default:
	        dStr = d;
	        break;
	    }
	
	    return dStr;
	
	  });
	
	}
	
	function setTickFormatY(format, d, lastTick) {
	  // checking for a format and formatting y-axis values accordingly
	
	  var isFloat = __webpack_require__(8).isFloat;
	
	  var currentFormat;
	
	  switch (format) {
	    case "general":
	      currentFormat = d3.format("g")(d);
	      break;
	    case "si":
	      var prefix = d3.formatPrefix(lastTick),
	          format = d3.format(".1f");
	      currentFormat = format(prefix.scale(d)) + prefix.symbol;
	      break;
	    case "comma":
	      if (isFloat(parseFloat(d))) {
	        currentFormat = d3.format(",.2f")(d);
	      } else {
	        currentFormat = d3.format(",g")(d);
	      }
	      break;
	    case "round1":
	      currentFormat = d3.format(",.1f")(d);
	      break;
	    case "round2":
	      currentFormat = d3.format(",.2f")(d);
	      break;
	    case "round3":
	      currentFormat = d3.format(",.3f")(d);
	      break;
	    case "round4":
	      currentFormat = d3.format(",.4f")(d);
	      break;
	    default:
	      currentFormat = d3.format(",g")(d);
	      break;
	  }
	
	  return currentFormat;
	
	}
	
	function updateTextX(textNodes, axisNode, obj, axis, axisObj) {
	
	  var lastTick = axis.tickValues()[axis.tickValues().length - 1];
	
	  textNodes
	    .text(function(d, i) {
	      var val = setTickFormatY(axisObj.format, d, lastTick);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || "") + val + (axisObj.suffix || "");
	      }
	      return val;
	    });
	
	}
	
	function updateTextY(textNodes, axisNode, obj, axis, axisObj) {
	
	  var arr = [],
	      lastTick = axis.tickValues()[axis.tickValues().length - 1];
	
	  textNodes
	    .attr("transform", "translate(0,0)")
	    .text(function(d, i) {
	      var val = setTickFormatY(axisObj.format, d, lastTick);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || "") + val + (axisObj.suffix || "");
	      }
	      return val;
	    })
	    .text(function() {
	      var sel = d3.select(this);
	      var textChar = sel.node().getBoundingClientRect().width;
	      arr.push(textChar);
	      return sel.text();
	    })
	    .attr({
	      "dy": function() {
	        if (axisObj.dy !== "") {
	          return axisObj.dy + "em";
	        } else {
	          return d3.select(this).attr("dy");
	        }
	      },
	      "x": function() {
	        if (axisObj.textX !== "") {
	          return axisObj.textX;
	        } else {
	          return d3.select(this).attr("x");
	        }
	      },
	      "y": function() {
	        if (axisObj.textY !== "") {
	          return axisObj.textY;
	        } else {
	          return d3.select(this).attr("y");
	        }
	      }
	    });
	
	  obj.dimensions.labelWidth = d3.max(arr);
	
	}
	
	function repositionTextY(text, dimensions, textX) {
	  text.attr({
	    "transform": "translate(" + (dimensions.labelWidth - textX) + ",0)",
	    "x": 0
	  });
	}
	
	// Clones current text selection and appends
	// a new text node below the selection
	function newTextNode(selection, text, ems) {
	
	  var nodeName = selection.property("nodeName"),
	      parent = d3.select(selection.node().parentNode),
	      lineHeight = ems || 1.6, // ems
	      dy = parseFloat(selection.attr("dy")),
	      x = parseFloat(selection.attr("x")),
	
	      cloned = parent.append(nodeName)
	        .attr("dy", lineHeight + dy + "em")
	        .attr("x", x)
	        .text(function() { return text; });
	
	  return cloned;
	
	}
	
	// tick dropping functions
	
	function dropTicks(selection, opts) {
	
	  var opts = opts || {};
	
	  var tolerance = opts.tolerance || 0,
	      from = opts.from || 0,
	      to = opts.to || selection[0].length;
	
	  for (var j = from; j < to; j++) {
	
	    var c = selection[0][j], // current selection
	        n = selection[0][j + 1]; // next selection
	
	    if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect) { continue; }
	
	    while ((c.getBoundingClientRect().right + tolerance) > n.getBoundingClientRect().left) {
	
	      if (d3.select(n).data()[0] === selection.data()[to]) {
	        d3.select(c).remove();
	      } else {
	        d3.select(n).remove();
	      }
	
	      j++;
	
	      n = selection[0][j + 1];
	
	      if (!n) { break; }
	
	    }
	
	  }
	
	}
	
	function dropRedundantTicks(selection, ctx) {
	
	  var ticks = selection.selectAll(".tick");
	
	  var prevYear, prevMonth, prevDate, prevHour, prevMinute, dYear, dMonth, dDate, dHour, dMinute;
	
	  ticks.each(function(d) {
	    switch (ctx) {
	      case "years":
	        dYear = d.getFullYear();
	        if (dYear === prevYear) {
	          d3.select(this).remove();
	        }
	        prevYear = dYear;
	        break;
	      case "months":
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        if ((dMonth === prevMonth) && (dYear === prevYear)) {
	          d3.select(this).remove();
	        }
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case "weeks":
	      case "days":
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        dDate = d.getDate();
	
	        if ((dDate === prevDate) && (dMonth === prevMonth) && (dYear === prevYear)) {
	          d3.select(this).remove();
	        }
	
	        prevDate = dDate;
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case "hours":
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        if ((dDate === prevDate) && (dHour === prevHour) && (dMinute === prevMinute)) {
	          d3.select(this).remove();
	        }
	
	        prevDate = dDate;
	        prevHour = dHour;
	        prevMinute = dMinute;
	        break;
	    }
	  });
	
	}
	
	function dropOversetTicks(axisNode, tickWidth) {
	
	  var axisGroupWidth = axisNode.node().getBBox().width,
	      tickArr = axisNode.selectAll(".tick")[0];
	
	  if (tickArr.length) {
	
	    var firstTickOffset = d3.transform(d3.select(tickArr[0])
	      .attr("transform")).translate[0];
	
	    if ((axisGroupWidth + firstTickOffset) >= tickWidth) {
	      var lastTick = tickArr[tickArr.length - 1];
	      d3.select(lastTick).attr("class", "last-tick-hide");
	      axisGroupWidth = axisNode.node().getBBox().width;
	      tickArr = axisNode.selectAll(".tick")[0];
	    }
	
	  }
	
	}
	
	function tickFinderX(domain, period, tickGoal) {
	
	  // set ranges
	  var startDate = domain[0],
	      endDate = domain[1];
	
	  // set upper and lower bounds for number of steps per tick
	  // i.e. if you have four months and set steps to 1, you'll get 4 ticks
	  // and if you have six months and set steps to 2, you'll get 3 ticks
	  var stepLowerBound = 1,
	      stepUpperBound = 12,
	      tickCandidates = [],
	      closestArr;
	
	  // using the tick bounds, generate multiple arrays-in-objects using
	  // different tick steps. push all those generated objects to tickCandidates
	  for (var i = stepLowerBound; i <= stepUpperBound; i++) {
	    var obj = {};
	    obj.interval = i;
	    obj.arr = d3.time[period](startDate, endDate, i).length;
	    tickCandidates.push(obj);
	  }
	
	  // reduce to find a best candidate based on the defined tickGoal
	  if (tickCandidates.length > 1) {
	    closestArr = tickCandidates.reduce(function (prev, curr) {
	      return (Math.abs(curr.arr - tickGoal) < Math.abs(prev.arr - tickGoal) ? curr : prev);
	    });
	  } else if (tickCandidates.length === 1) {
	    closestArr = tickCandidates[0];
	  } else {
	    // sigh. we tried.
	    closestArr.interval = 1;
	  }
	
	  var tickArr = d3.time[period](startDate, endDate, closestArr.interval);
	
	  var startDiff = tickArr[0] - startDate;
	  var tickDiff = tickArr[1] - tickArr[0];
	
	  // if distance from startDate to tickArr[0] is greater than half the
	  // distance between tickArr[1] and tickArr[0], add startDate to tickArr
	
	  if ( startDiff > (tickDiff / 2) ) { tickArr.unshift(startDate); }
	
	  return tickArr;
	
	}
	
	function tickFinderY(scale, tickCount, tickSettings) {
	
	  // In a nutshell:
	  // Checks if an explicit number of ticks has been declared
	  // If not, sets lower and upper bounds for the number of ticks
	  // Iterates over those and makes sure that there are tick arrays where
	  // the last value in the array matches the domain max value
	  // if so, tries to find the tick number closest to tickGoal out of the winners,
	  // and returns that arr to the scale for use
	
	  var min = scale.domain()[0],
	      max = scale.domain()[1];
	
	  if (tickCount !== "auto") {
	
	    return scale.ticks(tickCount);
	
	  } else {
	
	    var tickLowerBound = tickSettings.tickLowerBound,
	        tickUpperBound = tickSettings.tickUpperBound,
	        tickGoal = tickSettings.tickGoal,
	        arr = [],
	        tickCandidates = [],
	        closestArr;
	
	    for (var i = tickLowerBound; i <= tickUpperBound; i++) {
	      var tickCandidate = scale.ticks(i);
	
	      if (min < 0) {
	        if ((tickCandidate[0] === min) && (tickCandidate[tickCandidate.length - 1] === max)) {
	          arr.push(tickCandidate);
	        }
	      } else {
	        if (tickCandidate[tickCandidate.length - 1] === max) {
	          arr.push(tickCandidate);
	        }
	      }
	    }
	
	    arr.forEach(function (value) {
	      tickCandidates.push(value.length);
	    });
	
	    var closestArr;
	
	    if (tickCandidates.length > 1) {
	      closestArr = tickCandidates.reduce(function (prev, curr) {
	        return (Math.abs(curr - tickGoal) < Math.abs(prev - tickGoal) ? curr : prev);
	      });
	    } else if (tickCandidates.length === 1) {
	      closestArr = tickCandidates[0];
	    } else {
	      closestArr = null;
	    }
	
	    return scale.ticks(closestArr);
	
	  }
	}
	
	
	function ordinalTimeTicks(selection, axisNode, ctx, scale, tolerance) {
	
	  dropRedundantTicks(axisNode, ctx);
	
	  // dropRedundantTicks has modified the selection, so we need to reselect
	  // to get a proper idea of what's still available
	  var newSelection = axisNode.selectAll(".tick");
	
	  // if the context is "years", every tick is a majortick so we can
	  // just pass on the block below
	  if (ctx !== "years") {
	
	    // array for any "major ticks", i.e. ticks with a change in context
	    // one level up. i.e., a "months" context set of ticks with a change in the year,
	    // or "days" context ticks with a change in month or year
	    var majorTicks = [];
	
	    var prevYear, prevMonth, prevDate, dYear, dMonth, dDate;
	
	    newSelection.each(function(d) {
	      var currSel = d3.select(this);
	      switch (ctx) {
	        case "months":
	          dYear = d.getFullYear();
	          if (dYear !== prevYear) { majorTicks.push(currSel); }
	          prevYear = d.getFullYear();
	          break;
	        case "weeks":
	        case "days":
	          dYear = d.getFullYear();
	          dMonth = d.getMonth();
	          if ((dMonth !== prevMonth) && (dYear !== prevYear)) {
	            majorTicks.push(currSel);
	          } else if (dMonth !== prevMonth) {
	            majorTicks.push(currSel);
	          } else if (dYear !== prevYear) {
	            majorTicks.push(currSel);
	          }
	          prevMonth = d.getMonth();
	          prevYear = d.getFullYear();
	          break;
	        case "hours":
	          dDate = d.getDate();
	          if (dDate !== prevDate) { majorTicks.push(currSel); }
	          prevDate = dDate;
	          break;
	      }
	    });
	
	    var t0, tn;
	
	    if (majorTicks.length > 1) {
	
	      for (var i = 0; i < majorTicks.length + 1; i++) {
	
	        if (i === 0) { // from t0 to m0
	          t0 = 0;
	          tn = newSelection.data().indexOf(majorTicks[0].data()[0]);
	        } else if (i === (majorTicks.length)) { // from mn to tn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection.length - 1;
	        } else { // from m0 to mn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection.data().indexOf(majorTicks[i].data()[0]);
	        }
	
	        if (!!(tn - t0)) {
	          dropTicks(newSelection, {
	            from: t0,
	            to: tn,
	            tolerance: tolerance
	          });
	        }
	
	      }
	
	    }
	
	  } else {
	    dropTicks(newSelection, { tolerance: tolerance });
	  }
	
	}
	
	function axisCleanup(node, obj, xAxisObj, yAxisObj) {
	
	  // this section is kinda gross, sorry:
	  // resets ranges and dimensions, redraws yAxis, redraws xAxis
	  // …then redraws yAxis again if tick wrapping has changed xAxis height
	
	  drawYAxis(obj, yAxisObj.axis, yAxisObj.node);
	
	  var setRangeType = __webpack_require__(17).setRangeType,
	      setRangeArgs = __webpack_require__(17).setRangeArgs;
	
	  var scaleObj = {
	    rangeType: setRangeType(obj.xAxis),
	    range: xAxisObj.range || [0, obj.dimensions.tickWidth()],
	    bands: obj.dimensions.bands,
	    rangePoints: obj.xAxis.rangePoints
	  };
	
	  setRangeArgs(xAxisObj.axis.scale(), scaleObj);
	
	  var prevXAxisHeight = obj.dimensions.xAxisHeight;
	
	  xAxisObj = axisManager(node, obj, xAxisObj.axis.scale(), "xAxis");
	
	  xAxisObj.node
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	  if (obj.xAxis.scale !== "ordinal") {
	    dropOversetTicks(xAxisObj.node, obj.dimensions.tickWidth());
	  }
	
	  if (prevXAxisHeight !== obj.dimensions.xAxisHeight) {
	    drawYAxis(obj, yAxisObj.axis, yAxisObj.node);
	  }
	
	}
	
	function addZeroLine(obj, node, Axis, axisType) {
	
	  var ticks = Axis.axis.tickValues(),
	      tickMin = ticks[0],
	      tickMax = ticks[ticks.length - 1];
	
	  if ((tickMin <= 0) && (0 <= tickMax)) {
	
	    var refGroup = Axis.node.selectAll(".tick:not(." + obj.prefix + "minor)"),
	        refLine = refGroup.select("line");
	
	    // zero line
	    var zeroLine = node.append("line")
	      .style("shape-rendering", "crispEdges")
	      .attr("class", obj.prefix + "zero-line");
	
	    var transform = [0, 0];
	
	    transform[0] += d3.transform(node.select("." + obj.prefix + axisType).attr("transform")).translate[0];
	    transform[1] += d3.transform(node.select("." + obj.prefix + axisType).attr("transform")).translate[1];
	    transform[0] += d3.transform(refGroup.attr("transform")).translate[0];
	    transform[1] += d3.transform(refGroup.attr("transform")).translate[1];
	
	    if (axisType === "xAxis") {
	
	      zeroLine.attr({
	        "y1": refLine.attr("y1"),
	        "y2": refLine.attr("y2"),
	        "x1": 0,
	        "x2": 0,
	        "transform": "translate(" + transform[0] + "," + transform[1] + ")"
	      });
	
	    } else if (axisType === "yAxis") {
	
	      zeroLine.attr({
	        "x1": refLine.attr("x1"),
	        "x2": refLine.attr("x2"),
	        "y1": 0,
	        "y2": 0,
	        "transform": "translate(" + transform[0] + "," + transform[1] + ")"
	      });
	
	    }
	
	    refLine.style("display", "none");
	
	  }
	
	}
	
	module.exports = {
	  AxisFactory: AxisFactory,
	  axisManager: axisManager,
	  determineFormat: determineFormat,
	  appendXAxis: appendXAxis,
	  appendYAxis: appendYAxis,
	  drawYAxis: drawYAxis,
	  timeAxis: timeAxis,
	  discreteAxis: discreteAxis,
	  ordinalTimeAxis: ordinalTimeAxis,
	  setTickFormatX: setTickFormatX,
	  setTickFormatY: setTickFormatY,
	  updateTextX: updateTextX,
	  updateTextY: updateTextY,
	  repositionTextY: repositionTextY,
	  newTextNode: newTextNode,
	  dropTicks: dropTicks,
	  dropOversetTicks: dropOversetTicks,
	  dropRedundantTicks: dropRedundantTicks,
	  tickFinderX: tickFinderX,
	  tickFinderY: tickFinderY,
	  axisCleanup: axisCleanup,
	  addZeroLine: addZeroLine
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	function scaleManager(obj, axisType) {
	
	  var axis = obj[axisType],
	      scaleObj = new ScaleObj(obj, axis, axisType);
	
	  var scale = setScaleType(scaleObj.type);
	
	  scale.domain(scaleObj.domain);
	
	  setRangeArgs(scale, scaleObj);
	
	  if (axis.nice) { niceify(scale, axisType, scaleObj); }
	  if (axis.rescale) { rescale(scale, axisType, axis); }
	
	  return {
	    obj: scaleObj,
	    scale: scale
	  };
	
	}
	
	function ScaleObj(obj, axis, axisType) {
	  this.type = axis.scale;
	  this.domain = setDomain(obj, axis);
	  this.rangeType = setRangeType(axis);
	  this.range = setRange(obj, axisType);
	  this.bands = obj.dimensions.bands;
	  this.rangePoints = axis.rangePoints || 1.0;
	}
	
	function setScaleType(type) {
	
	  var scaleType;
	
	  switch (type) {
	    case "time":
	      scaleType = d3.time.scale();
	      break;
	    case "ordinal":
	    case "ordinal-time":
	      scaleType = d3.scale.ordinal();
	      break;
	    case "linear":
	      scaleType = d3.scale.linear();
	      break;
	    case "identity":
	      scaleType = d3.scale.identity();
	      break;
	    case "pow":
	      scaleType = d3.scale.pow();
	      break;
	    case "sqrt":
	      scaleType = d3.scale.sqrt();
	      break;
	    case "log":
	      scaleType = d3.scale.log();
	      break;
	    case "quantize":
	      scaleType = d3.scale.quantize();
	      break;
	    case "quantile":
	      scaleType = d3.scale.quantile();
	      break;
	    case "threshold":
	      scaleType = d3.scale.threshold();
	      break;
	    default:
	      scaleType = d3.scale.linear();
	      break;
	  }
	
	  return scaleType;
	
	}
	
	function setRangeType(axis) {
	
	  var type;
	
	  switch(axis.scale) {
	    case "time":
	    case "linear":
	      type = "range";
	      break;
	    case "ordinal":
	    case "discrete":
	      type = "rangeRoundBands";
	      break;
	    case "ordinal-time":
	      type = "rangePoints";
	      break;
	    default:
	      type = "range";
	      break;
	  }
	
	  return type;
	
	}
	
	function setRange(obj, axisType) {
	
	  var range;
	
	  if (axisType === "xAxis") {
	    range = [0, obj.dimensions.tickWidth()]; // operating on width
	  } else if (axisType === "yAxis") {
	    range = [obj.dimensions.yAxisHeight(), 0]; // operating on height
	  }
	
	  return range;
	
	}
	
	function setRangeArgs(scale, scaleObj) {
	
	  switch (scaleObj.rangeType) {
	    case "range":
	      return scale[scaleObj.rangeType](scaleObj.range);
	    case "rangeRoundBands":
	      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.bands.padding, scaleObj.bands.outerPadding);
	    case "rangePoints":
	      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.rangePoints);
	  }
	
	}
	
	function setDomain(obj, axis) {
	
	  var data = obj.data;
	  var domain;
	
	  // included fallbacks just in case
	  switch(axis.scale) {
	    case "time":
	      domain = setDateDomain(data, axis.min, axis.max);
	      break;
	    case "linear":
	      var chartType = obj.options.type,
	          forceMaxVal;
	      if (chartType === "area" || chartType === "column" || chartType === "bar") {
	        forceMaxVal = true;
	      }
	      domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked, forceMaxVal);
	      break;
	    case "ordinal":
	    case "ordinal-time":
	      domain = setDiscreteDomain(data);
	      break;
	  }
	
	  return domain;
	
	}
	
	function setDateDomain(data, min, max) {
	  if (min && max) {
	    var startDate = min, endDate = max;
	  } else {
	    var dateRange = d3.extent(data.data, function(d) { return d.key; });
	    var startDate = min || new Date(dateRange[0]),
	        endDate = max || new Date(dateRange[1]);
	  }
	  return [startDate, endDate];
	}
	
	function setNumericalDomain(data, min, max, stacked, forceMaxVal) {
	
	  var minVal, maxVal;
	  var mArr = [];
	
	  d3.map(data.data, function(d) {
	    for (var j = 0; j < d.series.length; j++) {
	      mArr.push(Number(d.series[j].val));
	    }
	  });
	
	  if (stacked) {
	    maxVal = d3.max(data.stackedData[data.stackedData.length - 1], function(d) {
	      return (d.y0 + d.y);
	    });
	  } else {
	    maxVal = d3.max(mArr);
	  }
	
	  minVal = d3.min(mArr);
	
	  if (min) {
	    minVal = min;
	  } else if (minVal > 0) {
	    minVal = 0;
	  }
	
	  if (max) {
	    maxVal = max;
	  } else if (maxVal < 0 && forceMaxVal) {
	    maxVal = 0;
	  }
	
	  return [minVal, maxVal];
	
	}
	
	function setDiscreteDomain(data) {
	  return data.data.map(function(d) { return d.key; });
	}
	
	function rescale(scale, axisType, axisObj) {
	
	  switch(axisObj.scale) {
	    case "linear":
	      if (!axisObj.max) { rescaleNumerical(scale, axisObj); }
	      break;
	  }
	}
	
	function rescaleNumerical(scale, axisObj) {
	
	  // rescales the "top" end of the domain
	  var ticks = scale.ticks(10).slice(),
	      tickIncr = Math.abs(ticks[ticks.length - 1]) - Math.abs(ticks[ticks.length - 2]);
	
	  var newMax = ticks[ticks.length - 1] + tickIncr;
	
	  scale.domain([scale.domain()[0], newMax]);
	
	}
	
	function niceify(scale, axisType, scaleObj) {
	
	  switch(scaleObj.type) {
	    case "time":
	      var timeDiff = __webpack_require__(4).timeDiff;
	      var context = timeDiff(scale.domain()[0], scale.domain()[1], 3);
	      niceifyTime(scale, context);
	      break;
	    case "linear":
	      niceifyNumerical(scale);
	      break;
	  }
	
	}
	
	function niceifyTime(scale, context) {
	  var getTimeInterval = __webpack_require__(4).timeInterval;
	  var timeInterval = getTimeInterval(context);
	  scale.domain(scale.domain()).nice(timeInterval);
	}
	
	function niceifyNumerical(scale) {
	  scale.domain(scale.domain()).nice();
	}
	
	module.exports = {
	  scaleManager: scaleManager,
	  ScaleObj: ScaleObj,
	  setScaleType: setScaleType,
	  setRangeType: setRangeType,
	  setRangeArgs: setRangeArgs,
	  setRange: setRange,
	  setDomain: setDomain,
	  setDateDomain: setDateDomain,
	  setNumericalDomain: setNumericalDomain,
	  setDiscreteDomain: setDiscreteDomain,
	  rescale: rescale,
	  rescaleNumerical: rescaleNumerical,
	  niceify: niceify,
	  niceifyTime: niceifyTime,
	  niceifyNumerical: niceifyNumerical
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	function MultiLineChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "multiline " + obj.prefix + "multiline-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "multiline " + obj.prefix + "multiline-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      },
	      "d": hLine
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };
	
	};
	
	module.exports = MultiLineChart;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	function AreaChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  // wha?
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  // Secondary array is used to store a reference to all series except for the highlighted item
	  var secondaryArr = [];
	
	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines
	
	    if (i !== obj.seriesHighlight()) {
	
	      var area = d3.svg.area().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y0(yScale(0))
	        .y1(function(d) { return yScale(d.series[i].val); });
	
	      var line = d3.svg.line().interpolate(obj.options.interpolation)
	        .defined(function(d) { return !isNaN(d.series[i].val); })
	        .x(function(d) { return xScale(d.key); })
	        .y(function(d) { return yScale(d.series[i].val); });
	
	      var pathRef = seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": area,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
	            return output;
	          }
	        });
	
	      seriesGroup.append("path")
	        .datum(obj.data.data)
	        .attr({
	          "d": line,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "class": function() {
	            var output = obj.prefix + "line " + obj.prefix + "line-" + (i);
	            return output;
	          }
	        });
	
	      secondaryArr.push(pathRef);
	    }
	
	  }
	
	  // Loop through all the secondary series (all series except the highlighted one)
	  // and set the colours in the correct order
	
	  var secondaryArr = secondaryArr.reverse();
	
	  var hArea = d3.svg.area().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y0(yScale(0))
	    .y1(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function(d) { return xScale(d.key); })
	    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "d": hArea,
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "fill " + obj.prefix + "fill-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      }
	    });
	
	  seriesGroup.append("path")
	    .datum(obj.data.data)
	    .attr({
	      "d": hLine,
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function() {
	        var output = obj.prefix + "line " + obj.prefix + "line-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
	        return output;
	      }
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    hArea: hArea,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = AreaChart;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	function StackedAreaChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  // wha?
	  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }
	
	  node.classed(obj.prefix + "stacked", true);
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    });
	
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("svg:g")
	    .attr({
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	      "class": function(d, i) {
	        var output = obj.prefix + "series " + obj.prefix + "series_" + (i);
	        if (i === obj.seriesHighlight()) {
	          output = obj.prefix + "series " + obj.prefix + "series_" + (i) + " " + obj.prefix + "highlight";
	        }
	        return output;
	      }
	    });
	
	  var area = d3.svg.area().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.y0 + d.y); })
	    .x(function(d) { return xScale(d.x); })
	    .y0(function(d) { return yScale(d.y0); })
	    .y1(function(d) { return yScale(d.y0 + d.y); });
	
	  var line = d3.svg.line().interpolate(obj.options.interpolation)
	    .defined(function(d) { return !isNaN(d.y0 + d.y); })
	    .x(function(d) { return xScale(d.x); })
	    .y(function(d) { return yScale(d.y0 + d.y); });
	
	  series.append("path")
	    .attr("class", function(d, i) {
	      var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
	      if (i === obj.seriesHighlight()) {
	        output = obj.prefix + "fill " + obj.prefix + "fill-" + (i) + " " + obj.prefix + "highlight";
	      }
	      return output;
	    })
	    .attr("d", area);
	
	  series.append("path")
	    .attr("class", function(d, i) { return obj.prefix + "line " + obj.prefix + "line-" + (i); })
	    .attr("d", line);
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = StackedAreaChart;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	function ColumnChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  switch (obj.xAxis.scale) {
	    case "time":
	
	      var timeInterval = __webpack_require__(4).timeInterval,
	          timeElapsed = timeInterval(obj.data.data) + 1;
	      var singleColumn = obj.dimensions.tickWidth() / timeElapsed / obj.data.seriesAmount;
	
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - (singleColumn * obj.data.seriesAmount))];
	
	      axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	      break;
	    case "ordinal-time":
	
	      var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);
	
	      node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
	        .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	      break;
	    case "ordinal":
	      var singleColumn = xScale.rangeBand() / obj.data.seriesAmount;
	      break;
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'multiple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", function() {
	      var xOffset;
	      if (obj.xAxis.scale === "ordinal-time") {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2);
	      } else {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
	      }
	      return "translate(" + xOffset + ",0)";
	    });
	
	  for (var i = 0; i < obj.data.seriesAmount; i++) {
	
	    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);
	
	    var columnItem = series
	      .selectAll("." + obj.prefix + "column")
	      .data(obj.data.data).enter()
	      .append("g")
	      .attr({
	        "class": obj.prefix + "column " + obj.prefix + "column-" + (i),
	        "data-series": i,
	        "data-key": function(d) { return d.key; },
	        "data-legend": function() { return obj.data.keys[i + 1]; },
	        "transform": function(d) {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return "translate(" + xScale(d.key) + ",0)";
	          }
	        }
	      });
	
	    columnItem.append("rect")
	      .attr({
	        "class": function(d) {
	          return d.series[i].val < 0 ? "negative" : "positive";
	        },
	        "x": function(d) {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return i * singleColumn;
	          } else {
	            return xScale(d.key)
	          }
	        },
	        "y": function(d) {
	          if (d.series[i].val !== "__undefined__") {
	            return yScale(Math.max(0, d.series[i].val));
	          }
	        },
	        "height": function(d) {
	          if (d.series[i].val !== "__undefined__") {
	            return Math.abs(yScale(d.series[i].val) - yScale(0));
	          }
	        },
	        "width": function() {
	          if (obj.xAxis.scale !== "ordinal-time") {
	            return singleColumn;
	          } else {
	            return singleColumn / obj.data.seriesAmount;
	          }
	        }
	      });
	
	    if (obj.data.seriesAmount > 1) {
	
	      var columnOffset = obj.dimensions.bands.offset;
	
	      columnItem.selectAll("rect")
	        .attr({
	          "x": function(d) {
	            if (obj.xAxis.scale !== "ordinal-time") {
	              return ((i * singleColumn) + (singleColumn * (columnOffset / 2)));
	            } else {
	              return xScale(d.key) + (i * (singleColumn / obj.data.seriesAmount));
	            }
	          },
	          "width": function() {
	            if (obj.xAxis.scale !== "ordinal-time") {
	              return (singleColumn - (singleColumn * columnOffset));
	            } else {
	              return singleColumn / obj.data.seriesAmount;
	            }
	          }
	        });
	    }
	
	  }
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleColumn: singleColumn,
	    columnItem: columnItem
	  };
	
	}
	
	module.exports = ColumnChart;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	function BarChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	    scaleModule = __webpack_require__(17),
	    Scale = scaleModule.scaleManager;
	
	  // because the elements will be appended in reverse due to the
	  // bar chart operating on the y-axis, need to reverse the dataset.
	  obj.data.data.reverse();
	
	  var xAxisOffset = 9;
	
	  var xScaleObj = new Scale(obj, "xAxis"),
	      xScale = xScaleObj.scale;
	
	  var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");
	
	  var xAxisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "xAxis")
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");
	
	  var xAxisNode = xAxisGroup.append("g")
	    .attr("class", obj.prefix + "x-axis")
	    .call(xAxis);
	
	  var textLengths = [];
	
	  xAxisNode.selectAll("text")
	    .attr("y", xAxisOffset)
	    .each(function() {
	      textLengths.push(d3.select(this).node().getBoundingClientRect().height);
	    });
	
	  var tallestText = textLengths.reduce(function(a, b) { return (a > b ? a : b) });
	
	  obj.dimensions.xAxisHeight = tallestText + xAxisOffset;
	
	  xAxisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  //  scales
	  var yScaleObj = new Scale(obj, "yAxis"),
	      yScale = yScaleObj.scale;
	
	  // need this for fixed-height bars
	  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
	    var totalBarHeight = (obj.dimensions.barHeight * obj.data.data.length * obj.data.seriesAmount);
	    yScale.rangeRoundBands([totalBarHeight, 0], obj.dimensions.bands.padding, obj.dimensions.bands.outerPadding);
	    obj.dimensions.yAxisHeight = totalBarHeight - (totalBarHeight * obj.dimensions.bands.outerPadding * 2);
	  }
	
	  var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");
	
	  var yAxisGroup = node.append("g")
	    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "yAxis")
	    .attr("transform", "translate(0,0)");
	
	  var yAxisNode = yAxisGroup.append("g")
	    .attr("class", obj.prefix + "y-axis")
	    .call(yAxis);
	
	  yAxisNode.selectAll("line").remove();
	  yAxisNode.selectAll("text").attr("x", 0);
	
	  if (obj.dimensions.width > obj.yAxis.widthThreshold) {
	    var maxLabelWidth = obj.dimensions.computedWidth() / 3.5;
	  } else {
	    var maxLabelWidth = obj.dimensions.computedWidth() / 3;
	  }
	
	  if (yAxisNode.node().getBBox().width > maxLabelWidth) {
	    var wrapText = __webpack_require__(4).wrapText;
	    yAxisNode.selectAll("text")
	      .call(wrapText, maxLabelWidth)
	      .each(function() {
	        var tspans = d3.select(this).selectAll("tspan"),
	            tspanCount = tspans[0].length,
	            textHeight = d3.select(this).node().getBBox().height;
	        if (tspanCount > 1) {
	          tspans
	            .attr({
	              "y": ((textHeight / tspanCount) / 2) - (textHeight / 2)
	            });
	        }
	      });
	  }
	
	  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;
	
	  yAxisGroup.attr("transform", "translate(" + obj.dimensions.labelWidth + ",0)");
	
	  if (obj.exportable && obj.exportable.x_axis) {
	    xAxisSettings = obj.exportable.x_axis;
	  } else {
	    xAxisSettings = obj.xAxis;
	  }
	
	  var tickFinderX = axisModule.tickFinderY;
	
	  if (obj.xAxis.widthThreshold > obj.dimensions.width) {
	    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 6 };
	  } else {
	    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 4 };
	  }
	
	  var ticks = tickFinderX(xScale, obj.xAxis.ticks, xAxisTickSettings);
	
	  xScale.range([0, obj.dimensions.tickWidth()]);
	
	  xAxis.tickValues(ticks);
	
	  xAxisNode.call(xAxis);
	
	  xAxisNode.selectAll(".tick text")
	    .attr("y", xAxisOffset)
	    .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);
	
	  if (obj.exportable && obj.exportable.dynamicHeight) {
	    // working with a dynamic bar height
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + obj.dimensions.computedHeight() + ")");
	  } else {
	    // working with a fixed bar height
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + totalBarHeight + ")");
	  }
	
	  var xAxisWidth = d3.transform(xAxisGroup.attr("transform")).translate[0] + xAxisGroup.node().getBBox().width;
	
	  if (xAxisWidth > obj.dimensions.computedWidth()) {
	
	    xScale.range([0, obj.dimensions.tickWidth() - (xAxisWidth - obj.dimensions.computedWidth())]);
	
	    xAxisNode.call(xAxis);
	
	    xAxisNode.selectAll(".tick text")
	      .attr("y", xAxisOffset)
	      .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);
	
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");
	
	  var singleBar = yScale.rangeBand() / obj.data.seriesAmount;
	
	  for (var i = 0; i < obj.data.seriesAmount; i++) {
	
	    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);
	
	    var barItem = series
	      .selectAll("." + obj.prefix + "bar")
	      .data(obj.data.data).enter()
	      .append("g")
	      .attr({
	        "class": obj.prefix + "bar " + obj.prefix + "bar-" + (i),
	        "data-series": i,
	        "data-key": function(d) { return d.key; },
	        "data-legend": function() { return obj.data.keys[i + 1]; },
	        "transform": function(d) {
	          return "translate(0," + yScale(d.key) + ")";
	        }
	      });
	
	    barItem.append("rect")
	      .attr({
	        "class": function(d) {
	          return d.series[i].val < 0 ? "negative" : "positive";
	        },
	        "x": function(d) {
	          return xScale(Math.min(0, d.series[i].val));
	        },
	        "y": function() {
	          return i * singleBar;
	        },
	        "width": function(d) {
	          return Math.abs(xScale(d.series[i].val) - xScale(0));
	        },
	        "height": function(d) { return singleBar; }
	      });
	
	    if (obj.data.seriesAmount > 1) {
	      var barOffset = obj.dimensions.bands.offset;
	      barItem.selectAll("rect")
	        .attr({
	          "y": function() {
	            return ((i * singleBar) + (singleBar * (barOffset / 2)));
	          },
	          "height": singleBar - (singleBar * barOffset)
	        });
	    }
	
	  }
	
	  xAxisNode.selectAll("g")
	    .filter(function(d) { return d; })
	    .classed(obj.prefix + "minor", true);
	
	  xAxisNode.selectAll("line")
	    .attr({
	      "y1": function() {
	        if (obj.exportable && obj.exportable.dynamicHeight) {
	          // dynamic height, so calculate where the y1 should go
	          return -(obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight);
	        } else {
	          // fixed height, so use that
	          return -(totalBarHeight);
	        }
	      },
	      "y2": 0
	  });
	
	  if (obj.exportable && obj.exportable.dynamicHeight) {
	
	    // dynamic height, only need to transform x-axis group
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	  } else {
	
	    // fixed height, so transform accordingly and modify the dimension function and parent rects
	
	    xAxisGroup
	      .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + totalBarHeight + ")");
	
	    obj.dimensions.totalXAxisHeight = xAxisGroup.node().getBoundingClientRect().height;
	
	    obj.dimensions.computedHeight = function() { return this.totalXAxisHeight; };
	
	    d3.select(node.node().parentNode)
	      .attr("height", function() {
	        var margin = obj.dimensions.margin;
	        return obj.dimensions.computedHeight() + margin.top + margin.bottom;
	      });
	
	    d3.select(node.node().parentNode).select("." + obj.prefix + "bg")
	      .attr({
	        "height": obj.dimensions.computedHeight()
	      });
	
	  }
	
	  var xAxisObj = { node: xAxisGroup, axis: xAxis },
	      yAxisObj = { node: yAxisGroup, axis: yAxis };
	
	  var axisModule = __webpack_require__(16);
	
	  axisModule.addZeroLine(obj, node, xAxisObj, "xAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleBar: singleBar,
	    barItem: barItem
	  };
	
	}
	
	module.exports = BarChart;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	function StackedColumnChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var yScaleObj = new Scale(obj, "yAxis"),
	      xScaleObj = new Scale(obj, "xAxis"),
	      yScale = yScaleObj.scale,
	      xScale = xScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  switch (obj.xAxis.scale) {
	    case "time":
	
	      var timeInterval = __webpack_require__(4).timeInterval,
	          timeElapsed = timeInterval(obj.data.data);
	      var singleColumn = obj.dimensions.tickWidth() / timeElapsed;
	
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - singleColumn)];
	
	      axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	      break;
	    case "ordinal-time":
	
	      var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);
	
	      node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
	        .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");
	
	      break;
	    case "ordinal":
	      var singleColumn = xScale.rangeBand();
	      break;
	  }
	
	  var seriesGroup = node.append("g")
	    .attr("class", function() {
	      var output = obj.prefix + "series_group";
	      if (obj.data.seriesAmount > 1) {
	        // If more than one series append a 'muliple' class so we can target
	        output += " " + obj.prefix + "multiple";
	      }
	      return output;
	    })
	    .attr("transform", function() {
	      var xOffset;
	      if (obj.xAxis.scale === "ordinal-time") {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2);
	      } else {
	        xOffset = obj.dimensions.computedWidth() - obj.dimensions.tickWidth();
	      }
	      return "translate(" + xOffset + ",0)";
	    })
	
	  // Add a group for each
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("g")
	    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });
	
	  // Add a rect for each data point.
	  var rect = series.selectAll("rect")
	    .data(function(d) { return d; })
	    .enter().append("rect")
	    .attr({
	      "class": obj.prefix + "column",
	      "data-key": function(d) { return d.x; },
	      "data-legend": function(d) { return d.legend; },
	      "x": function(d) { return xScale(d.x); },
	      "y": function(d) { return yScale(Math.max(0, d.y0 + d.y)); },
	      "height": function(d) { return Math.abs(yScale(d.y) - yScale(0)); },
	      "width": singleColumn
	    });
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    rect: rect
	  };
	
	}
	
	module.exports = StackedColumnChart;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	function StreamgraphChart(node, obj) {
	
	  var axisModule = __webpack_require__(16),
	      scaleModule = __webpack_require__(17),
	      Axis = axisModule.axisManager,
	      Scale = scaleModule.scaleManager;
	
	  //  scales
	  var xScaleObj = new Scale(obj, "xAxis"),
	      yScaleObj = new Scale(obj, "yAxis"),
	      xScale = xScaleObj.scale, yScale = yScaleObj.scale;
	
	  // axes
	  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
	      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");
	
	  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);
	
	  if (xScaleObj.obj.type === "ordinal") {
	    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
	  }
	
	  var seriesGroup = node.append("g")
	    .attr({
	      "class": obj.prefix + "series_group",
	      "transform": function() {
	        return "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"
	    }});
	
	  // Add a group for each cause.
	  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
	    .data(obj.data.stackedData)
	    .enter().append("g")
	    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });
	
	  var area = d3.svg.area().interpolate(obj.options.interpolation)
	    .x(function(d) { return xScale(d.x); })
	    .y0(function(d) { return yScale(d.y0); })
	    .y1(function(d) { return yScale(d.y0 + d.y); });
	
	  var line = d3.svg.line().interpolate(obj.options.interpolation)
	    .x(function(d) { return xScale(d.x); })
	    .y(function(d) { return yScale(d.y0 + d.y); });
	
	  series.append("path")
	    .attr("class", function(d, i) {
	      var output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i);
	      if (i === obj.seriesHighlight()) {
	        output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i) + " " + obj.prefix + "highlight";
	      }
	      return output;
	    })
	    .attr("d", area);
	
	  series.append("path")
	    .attr("class", function() { return obj.prefix + "stream-series " + obj.prefix + "line"; })
	    .attr("d", line);
	
	  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");
	
	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    line: line,
	    area: area
	  };
	
	};
	
	module.exports = StreamgraphChart;


/***/ },
/* 25 */
/***/ function(module, exports) {

	function qualifierComponent(node, obj) {
	
	  if (obj.options.type !== "bar") {
	
	    var yAxisNode = node.select("." + obj.prefix + "yAxis");
	
	    if (obj.editable) {
	
	      var foreignObject = yAxisNode.append("foreignObject")
	        .attr({
	          "class": obj.prefix + "fo " + obj.prefix + "qualifier",
	          "width": "100%"
	        });
	
	      var foreignObjectGroup = foreignObject.append("xhtml:div")
	        .attr("xmlns", "http://www.w3.org/1999/xhtml");
	
	      var qualifierField = foreignObjectGroup.append("div")
	        .attr({
	          "class": obj.prefix + "chart_qualifier editable-chart_qualifier",
	          "contentEditable": true,
	          "xmlns": "http://www.w3.org/1999/xhtml"
	        })
	        .text(obj.qualifier);
	
	      foreignObject
	        .attr({
	          "width": qualifierField.node().getBoundingClientRect().width + 15,
	          "height": qualifierField.node().getBoundingClientRect().height,
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + ( - (qualifierField.node().getBoundingClientRect().height) / 2 ) + ")"
	        });
	
	    } else {
	
	      var qualifierBg = yAxisNode.append("text")
	        .attr("class", obj.prefix + "chart_qualifier-text-bg")
	        .text(obj.qualifier)
	        .attr({
	          "dy": "0.32em",
	          "y": "0",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
	        });
	
	      var qualifierText = yAxisNode.append("text")
	        .attr("class", obj.prefix + "chart_qualifier-text")
	        .text(obj.qualifier)
	        .attr({
	          "dy": "0.32em",
	          "y": "0",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
	        });
	
	    }
	
	  }
	
	  return {
	    qualifierBg: qualifierBg,
	    qualifierText: qualifierText
	  };
	
	}
	
	module.exports = qualifierComponent;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Tips handling module.
	 * @module charts/components/tips
	 */
	
	function bisector(data, keyVal, stacked, index) {
	  if (stacked) {
	    var arr = [];
	    var bisect = d3.bisector(function(d) { return d.x; }).left;
	    for (var i = 0; i < data.length; i++) {
	      arr.push(bisect(data[i], keyVal));
	    };
	    return arr;
	  } else {
	    var bisect = d3.bisector(function(d) { return d.key; }).left;
	    return bisect(data, keyVal);
	  }
	}
	
	function cursorPos(overlay) {
	  return {
	    x: d3.mouse(overlay.node())[0],
	    y: d3.mouse(overlay.node())[1]
	  };
	}
	
	function getTipData(obj, cursor) {
	
	  var xScaleObj = obj.rendered.plot.xScaleObj,
	      xScale = xScaleObj.scale,
	      scaleType = xScaleObj.obj.type;
	
	  var xVal;
	
	  if (scaleType === "ordinal-time" || scaleType === "ordinal") {
	
	    var ordinalBisection = d3.bisector(function(d) { return d; }).left,
	        rangePos = ordinalBisection(xScale.range(), cursor.x);
	
	    xVal = xScale.domain()[rangePos];
	
	  } else {
	    xVal = xScale.invert(cursor.x);
	  }
	
	  var tipData;
	
	  if (obj.options.stacked) {
	    var data = obj.data.stackedData;
	    var i = bisector(data, xVal, obj.options.stacked);
	
	    var arr = [],
	        refIndex;
	
	    for (var k = 0; k < data.length; k++) {
	      if (refIndex) {
	        arr.push(data[k][refIndex]);
	      } else {
	        var d0 = data[k][i[k] - 1],
	            d1 = data[k][i[k]];
	        refIndex = xVal - d0.x > d1.x - xVal ? i[k] : (i[k] - 1);
	        arr.push(data[k][refIndex]);
	      }
	    }
	
	    tipData = arr;
	
	  } else {
	    var data = obj.data.data;
	    var i = bisector(data, xVal);
	    var d0 = data[i - 1],
	        d1 = data[i];
	
	    tipData = xVal - d0.key > d1.key - xVal ? d1 : d0;
	  }
	
	  return tipData;
	
	}
	
	function showTips(tipNodes, obj) {
	
	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(obj.prefix + "active", true);
	  }
	
	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(obj.prefix + "active", true);
	  }
	
	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(obj.prefix + "active", true);
	  }
	
	}
	
	function hideTips(tipNodes, obj) {
	
	  if (obj.options.type === "column") {
	    if(obj.options.stacked){
	      obj.rendered.plot.series.selectAll("rect").classed(obj.prefix + "muted", false);
	    }
	    else{
	      obj.rendered.plot.columnItem.selectAll("rect").classed(obj.prefix + "muted", false);
	    }
	
	  }
	
	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(obj.prefix + "active", false);
	  }
	
	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(obj.prefix + "active", false);
	  }
	
	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(obj.prefix + "active", false);
	  }
	
	}
	
	function mouseIdle(tipNodes, obj) {
	  return setTimeout(function() {
	    hideTips(tipNodes, obj);
	  }, obj.tipTimeout);
	}
	
	var timeout;
	
	function tipsManager(node, obj) {
	
	  var tipNodes = appendTipGroup(node, obj);
	
	  var fns = {
	    line: LineChartTips,
	    multiline: LineChartTips,
	    area: obj.options.stacked ? StackedAreaChartTips : AreaChartTips,
	    column: obj.options.stacked ? StackedColumnChartTips : ColumnChartTips,
	    stream: StreamgraphTips
	  };
	
	  var dataReference;
	
	  if (obj.options.type === "multiline") {
	    dataReference = [obj.data.data[0].series[0]];
	  } else {
	    dataReference = obj.data.data[0].series;
	  }
	
	  var innerTipElements = appendTipElements(node, obj, tipNodes, dataReference);
	
	  switch (obj.options.type) {
	    case "line":
	    case "multiline":
	    case "area":
	    case "stream":
	
	      tipNodes.overlay = tipNodes.tipNode.append("rect")
	        .attr({
	          "class": obj.prefix + "tip_overlay",
	          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
	          "width": obj.dimensions.tickWidth(),
	          "height": obj.dimensions.computedHeight()
	        });
	
	      tipNodes.overlay
	        .on("mouseover", function() { showTips(tipNodes, obj); })
	        .on("mouseout", function() { hideTips(tipNodes, obj); })
	        .on("mousemove", function() {
	          showTips(tipNodes, obj);
	          clearTimeout(timeout);
	          timeout = mouseIdle(tipNodes, obj);
	          return fns[obj.options.type](tipNodes, innerTipElements, obj);
	        });
	
	      break;
	
	    case "column":
	
	      var columnRects;
	
	      if (obj.options.stacked) {
	        columnRects = obj.rendered.plot.series.selectAll('rect')
	      } else {
	        columnRects = obj.rendered.plot.columnItem.selectAll('rect');
	      }
	
	      columnRects
	        .on("mouseover", function(d) {
	          showTips(tipNodes, obj);
	          clearTimeout(timeout);
	          timeout = mouseIdle(tipNodes, obj);
	          fns.column(tipNodes, obj, d, this);
	        })
	        .on("mouseout", function(d) {
	          hideTips(tipNodes, obj);
	        });
	
	      break;
	  }
	
	}
	
	function appendTipGroup(node, obj) {
	
	  var svgNode = d3.select(node.node().parentNode),
	      chartNode = d3.select(node.node().parentNode.parentNode);
	
	  var tipNode = svgNode.append("g")
	    .attr({
	      "transform": "translate(" + obj.dimensions.margin.left + "," + obj.dimensions.margin.top + ")",
	      "class": obj.prefix + "tip"
	    })
	    .classed(obj.prefix + "tip_stacked", function() {
	      return obj.options.stacked ? true : false;
	    });
	
	  var xTipLine = tipNode.append("g")
	    .attr("class", obj.prefix + "tip_line-x")
	    .classed(obj.prefix + "active", false);
	
	  xTipLine.append("line");
	
	  var tipBox = tipNode.append("g")
	    .attr({
	      "class": obj.prefix + "tip_box",
	      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"
	    });
	
	  var tipRect = tipBox.append("rect")
	    .attr({
	      "class": obj.prefix + "tip_rect",
	      "transform": "translate(0,0)",
	      "width": 1,
	      "height": 1
	    });
	
	  var tipGroup = tipBox.append("g")
	    .attr("class", obj.prefix + "tip_group");
	
	  var legendIcon = chartNode.select("." + obj.prefix + "legend_item_icon").node();
	
	  if (legendIcon) {
	    var radius = legendIcon.getBoundingClientRect().width / 2;
	  } else {
	    var radius = 0;
	  }
	
	  var tipPathCircles = tipNode.append("g")
	    .attr("class", obj.prefix + "tip_path-circle-group");
	
	  var tipTextDate = tipGroup
	    .insert("g", ":first-child")
	    .attr("class", obj.prefix + "tip_text-date-group")
	    .append("text")
	    .attr({
	      "class": obj.prefix + "tip_text-date",
	      "x": 0,
	      "y": 0,
	      "dy": "1em"
	    });
	
	  return {
	    svg: svgNode,
	    tipNode: tipNode,
	    xTipLine: xTipLine,
	    tipBox: tipBox,
	    tipRect: tipRect,
	    tipGroup: tipGroup,
	    legendIcon: legendIcon,
	    tipPathCircles: tipPathCircles,
	    radius: radius,
	    tipTextDate: tipTextDate
	  };
	
	}
	
	function appendTipElements(node, obj, tipNodes, dataRef) {
	
	  var tipTextGroupContainer = tipNodes.tipGroup
	    .append("g")
	    .attr("class", function() {
	      return obj.prefix + "tip_text-group-container";
	    });
	
	  var tipTextGroups = tipTextGroupContainer
	    .selectAll("." + obj.prefix + "tip_text-group")
	    .data(dataRef)
	    .enter()
	    .append("g")
	    .attr("class", function(d, i) {
	      return obj.prefix + "tip_text-group " + obj.prefix + "tip_text-group-" + (i);
	    });
	
	  var lineHeight;
	
	  tipTextGroups.append("text")
	    .text(function(d) { return d.val; })
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_text " + obj.prefix + "tip_text-" + (i));
	      },
	      "data-series": function(d, i) { return d.key; },
	      "x": function() {
	        return (tipNodes.radius * 2) + (tipNodes.radius / 1.5);
	      },
	      "y": function(d, i) {
	        lineHeight = lineHeight || parseInt(d3.select(this).style("line-height"));
	        return (i + 1) * lineHeight;
	      },
	      "dy": "1em"
	    });
	
	  tipTextGroups
	    .append("circle")
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_circle " + obj.prefix + "tip_circle-" + (i));
	      },
	      "r": function(d, i) { return tipNodes.radius; },
	      "cx": function() { return tipNodes.radius; },
	      "cy": function(d, i) {
	        return ((i + 1) * lineHeight) + (tipNodes.radius * 1.5);
	      }
	    });
	
	  tipNodes.tipPathCircles
	    .selectAll("circle")
	    .data(dataRef)
	    .enter()
	    .append("circle")
	    .attr({
	      "class": function(d, i) {
	        return (obj.prefix + "tip_path-circle " + obj.prefix + "tip_path-circle-" + (i));
	      },
	      "r": (tipNodes.radius / 2) || 2.5
	    });
	
	  return tipTextGroups;
	
	}
	
	function LineChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData.series)
	        .classed(obj.prefix + "active", function(d) { return d.val ? true : false; })
	        .attr({
	          "cx": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	          "cy": function(d) {
	            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function AreaChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData.series)
	        .classed(obj.prefix + "active", function(d) { return d.val ? true : false; })
	        .attr({
	          "cx": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	          "cy": function(d) {
	            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function StackedAreaChartTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.length; i++) {
	    if (tipData[i].y === NaN || tipData[i].y0 === NaN) {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        var text;
	
	        for (var k = 0; k < tipData.length; k++) {
	          if (i === 0) {
	            if (d.raw.series[i].val !== "__undefined__") {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          } else if (k === i) {
	            var hasUndefined = 0;
	            for (var j = 0; j < i; j++) {
	              if (d.raw.series[j].val === "__undefined__") {
	                hasUndefined++;
	                break;
	              }
	            }
	            if (!hasUndefined && (d.raw.series[i].val !== "__undefined__")) {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          }
	        }
	        return text;
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData)
	      .classed(obj.prefix + "active", function(d, i) {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (d.raw.series[j].val === "__undefined__") {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	          return true;
	        } else {
	          return false;
	        }
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData)
	        .classed(obj.prefix + "active", function(d, i) {
	          var hasUndefined = 0;
	          for (var j = 0; j < i; j++) {
	            if (d.raw.series[j].val === "__undefined__") {
	              hasUndefined++;
	              break;
	            }
	          }
	          if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	            return true;
	          } else {
	            return false;
	          }
	        })
	        .attr({
	          "cx": function(d) {
	            return obj.rendered.plot.xScaleObj.scale(d.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight
	          },
	          "cy": function(d) {
	            var y = d.y || 0,
	                y0 = d.y0 || 0;
	            return obj.rendered.plot.yScaleObj.scale(y + y0);
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function StreamgraphTips(tipNodes, innerTipEls, obj) {
	
	  var cursor = cursorPos(tipNodes.overlay),
	      tipData = getTipData(obj, cursor);
	
	  var isUndefined = 0;
	
	  for (var i = 0; i < tipData.length; i++) {
	    if (tipData[i].y === NaN || tipData[i].y0 === NaN) {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	        timeDiff = __webpack_require__(4).timeDiff;
	        domain = obj.rendered.plot.xScaleObj.scale.domain(),
	        ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        var text;
	
	        for (var k = 0; k < tipData.length; k++) {
	          if (i === 0) {
	            if (d.raw.series[i].val !== "__undefined__") {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          } else if (k === i) {
	            var hasUndefined = 0;
	            for (var j = 0; j < i; j++) {
	              if (d.raw.series[j].val === "__undefined__") {
	                hasUndefined++;
	                break;
	              }
	            }
	            if (!hasUndefined && (d.raw.series[i].val !== "__undefined__")) {
	              text = obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.raw.series[i].val) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = "n/a";
	              break;
	            }
	          }
	        }
	        return text;
	      });
	
	    tipNodes.tipTextDate
	      .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].x);
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData)
	      .classed(obj.prefix + "active", function(d, i) {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (d.raw.series[j].val === "__undefined__") {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	          return true;
	        } else {
	          return false;
	        }
	      });
	
	    tipNodes.tipGroup
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.dimensions.tipPadding.left;
	          } else {
	            // tipbox pointing right
	            var x = obj.dimensions.tipPadding.left;
	          }
	          var y = obj.dimensions.tipPadding.top;
	          return "translate(" + x + "," + y + ")";
	        }
	      });
	
	    tipNodes.tipPathCircles
	      .selectAll("." + obj.prefix + "tip_path-circle")
	        .data(tipData)
	        .classed(obj.prefix + "active", function(d, i) {
	          var hasUndefined = 0;
	          for (var j = 0; j < i; j++) {
	            if (d.raw.series[j].val === "__undefined__") {
	              hasUndefined++;
	              break;
	            }
	          }
	          if (d.raw.series[i].val !== "__undefined__" && !hasUndefined) {
	            return true;
	          } else {
	            return false;
	          }
	        })
	        .attr({
	          "cx": function(d) {
	            return obj.rendered.plot.xScaleObj.scale(d.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight
	          },
	          "cy": function(d) {
	            var y = d.y || 0,
	                y0 = d.y0 || 0;
	            return obj.rendered.plot.yScaleObj.scale(y + y0);
	          }
	        });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.xTipLine.select("line")
	      .attr({
	        "x1": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "x2": obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        "y1": 0,
	        "y2": obj.dimensions.yAxisHeight()
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	          if (cursor.x > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData[0].x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	  }
	
	}
	
	function ColumnChartTips(tipNodes, obj, d, thisRef) {
	
	  var columnRects = obj.rendered.plot.columnItem.selectAll('rect'),
	      isUndefined = 0;
	
	  var thisColumn = thisRef,
	      tipData = d;
	
	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	      timeDiff = __webpack_require__(4).timeDiff,
	      getTranslateXY = __webpack_require__(4).getTranslateXY,
	      domain = obj.rendered.plot.xScaleObj.scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    var cursorX = getTranslateXY(thisColumn.parentNode);
	
	    columnRects
	      .classed(obj.prefix + 'muted', function () {
	        return (this === thisColumn) ? false : true;
	      });
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.series)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	
	    });
	
	    if(obj.dateFormat !== undefined){
	      tipNodes.tipTextDate
	        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	    }
	    else{
	      tipNodes.tipTextDate
	        .text(tipData.key);
	    }
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	
	          var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	
	          if(x > obj.dimensions.tickWidth() / 2){
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          }
	
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	        }
	      });
	
	    showTips(tipNodes, obj);
	
	  }
	
	}
	
	
	function StackedColumnChartTips(tipNodes, obj, d, thisRef) {
	
	  var columnRects = obj.rendered.plot.series.selectAll('rect'),
	      isUndefined = 0;
	
	  var thisColumnRect = thisRef,
	      tipData = d;
	
	  for (var i = 0; i < tipData.raw.series.length; i++) {
	    if (tipData.raw.series[i].val === "__undefined__") {
	      isUndefined++;
	      break;
	    }
	  }
	
	  if (!isUndefined) {
	
	    var yFormatter = __webpack_require__(16).setTickFormatY,
	      timeDiff = __webpack_require__(4).timeDiff,
	      domain = obj.rendered.plot.xScaleObj.scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
	
	    var parentEl = d3.select(thisColumnRect.parentNode.parentNode);
	    var refPos = d3.select(thisColumnRect).attr("x");
	
	    var thisColumnKey = '';
	
	    /* Figure out which stack this selected rect is in then loop back through and (un)assign muted class */
	    columnRects.classed(obj.prefix + 'muted',function (d) {
	
	      if(this === thisColumnRect){
	        thisColumnKey = d.raw.key;
	      }
	
	      return (this === thisColumnRect) ? false : true;
	
	    });
	
	    columnRects.classed(obj.prefix + 'muted',function (d) {
	
	      return (d.raw.key === thisColumnKey) ? false : true;
	
	    });
	
	    tipNodes.tipGroup.selectAll("." + obj.prefix + "tip_text-group text")
	      .data(tipData.raw.series)
	      .text(function(d, i) {
	
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ""; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ""; }
	
	        if (d.val) {
	          return obj.yAxis.prefix + yFormatter(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return "n/a";
	        }
	
	    });
	
	    if(obj.dateFormat !== undefined){
	      tipNodes.tipTextDate
	        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
	    }
	    else{
	      tipNodes.tipTextDate
	        .text(function() {
	          var d = tipData.raw.key;
	          return d;
	        });
	    }
	
	    tipNodes.tipGroup
	      .append("circle")
	      .attr({
	        "class": function(d, i) {
	          return (obj.prefix + "tip_circle " + obj.prefix + "tip_circle-" + (i));
	        },
	        "r": function(d, i) { return tipNodes.radius; },
	        "cx": function() { return tipNodes.radius; },
	        "cy": function(d, i) {
	          return ( (i + 1) * parseInt(d3.select(this).style("font-size")) * 1.13 + 9);
	        }
	      });
	
	    tipNodes.tipGroup
	      .selectAll("." + obj.prefix + "tip_text-group")
	      .data(tipData.raw.series)
	      .classed(obj.prefix + "active", function(d, i) {
	        return d.val ? true : false;
	      });
	
	    tipNodes.tipRect
	      .attr({
	        "width": tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	        "height": tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	      });
	
	    tipNodes.tipBox
	      .attr({
	        "transform": function() {
	
	          if (refPos > obj.dimensions.tickWidth() / 2) {
	            // tipbox pointing left
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - d3.select(this).node().getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	          } else {
	            // tipbox pointing right
	            var x = obj.rendered.plot.xScaleObj.scale(tipData.x) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	          }
	
	          return "translate(" + x + "," + obj.dimensions.tipOffset.vertical + ")";
	
	        }
	
	      });
	
	  }
	
	}
	
	function tipDateFormatter(selection, ctx, months, data) {
	
	  var dMonth,
	      dDate,
	      dYear,
	      dHour,
	      dMinute;
	
	  selection.text(function() {
	    var d = data;
	    var dStr;
	    switch (ctx) {
	      case "years":
	        dStr = d.getFullYear();
	        break;
	      case "months":
	        dMonth = months[d.getMonth()];
	        dDate = d.getDate();
	        dYear = d.getFullYear();
	        dStr = dMonth + " " + dDate + ", " + dYear;
	        break;
	      case "weeks":
	      case "days":
	        dMonth = months[d.getMonth()];
	        dDate = d.getDate();
	        dYear = d.getFullYear();
	        dStr = dMonth + " " + dDate;
	        break;
	      case "hours":
	
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();
	
	        var dHourStr,
	          dMinuteStr;
	
	        // Convert from 24h time
	        var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
	
	        if (dHour === 0) {
	          dHourStr = 12;
	        } else if (dHour > 12) {
	          dHourStr = dHour - 12;
	        } else {
	          dHourStr = dHour;
	        }
	
	        // Make minutes follow Globe style
	        if (dMinute === 0) {
	          dMinuteStr = '';
	        } else if (dMinute < 10) {
	          dMinuteStr = ':0' + dMinute;
	        } else {
	          dMinuteStr = ':' + dMinute;
	        }
	
	        dStr = dHourStr + dMinuteStr + ' ' + suffix;
	
	        break;
	      default:
	        dStr = d;
	        break;
	    }
	
	    return dStr;
	
	  });
	
	}
	
	
	// [function BarChartTips(tipNodes, obj) {
	
	// }
	
	module.exports = tipsManager;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Social module.
	 * @module charts/components/social
	 */
	
	/*
	This component adds a "social" button to each chart which can be toggled to present the user with social sharing options
	 */
	
	var getThumbnail = __webpack_require__(4).getThumbnailPath;
	
	function socialComponent(node, obj) {
	
		var socialOptions = [];
	
		for (var prop in obj.social) {
			if (obj.social[prop]) {
				switch (obj.social[prop].label) {
					case "Twitter":
						obj.social[prop].url = constructTwitterURL(obj);
						obj.social[prop].popup = true;
						break;
					case "Facebook":
						obj.social[prop].url = constructFacebookURL(obj);
						obj.social[prop].popup = true;
						break;
					case "Email":
						obj.social[prop].url = constructMailURL(obj);
						obj.social[prop].popup = false;
						break;
					case "SMS":
						obj.social[prop].url = constructSMSURL(obj);
						obj.social[prop].popup = false;
						break;
					default:
						console.log('INCORRECT SOCIAL ITEM DEFINITION')
				}
				socialOptions.push(obj.social[prop]);
			}
		}
	
		var chartContainer = d3.select(node);
	
	  var chartMeta = chartContainer.select('.' + obj.prefix + 'chart_meta');
	
	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', obj.prefix + 'chart_meta');
	  }
	
		var chartSocialBtn = chartMeta
			.append('div')
			.attr('class', obj.prefix + 'chart_meta_btn')
			.html('share');
	
		var chartSocial = chartContainer
			.append('div')
			.attr('class', obj.prefix + 'chart_social');
	
		var chartSocialCloseBtn = chartSocial
			.append('div')
			.attr('class', obj.prefix + 'chart_social_close')
			.html('&#xd7;');
	
		var chartSocialOptions = chartSocial
			.append('div')
			.attr('class', obj.prefix + 'chart_social_options');
	
		chartSocialOptions
			.append('h3')
			.html('Share this chart:');
	
		chartSocialBtn.on('click', function() {
			chartSocial.classed(obj.prefix + 'active', true);
		});
	
		chartSocialCloseBtn.on('click', function() {
			chartSocial.classed(obj.prefix + 'active', false);
		});
	
		var itemAmount = socialOptions.length;
	
		for(var i = 0; i < itemAmount; i++ ) {
			chartSocialOptions
				.selectAll('.' + obj.prefix + 'social-item')
				.data(socialOptions)
				.enter()
				.append('div')
				.attr('class', obj.prefix + 'social-item').html(function(d) {
					if (!d.popup) {
						return '<a href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
					} else {
						return '<a class="' + obj.prefix + 'js-share" href="' + d.url + '"><img class="' + obj.prefix + 'social-icon" src="' + d.icon + '" title="' + d.label + '"/></a>';
					}
				});
		}
	
	  if (obj.image && obj.image.enable) {
	    chartSocialOptions
	      .append('div')
	      .attr('class', obj.prefix + 'image-url')
	      .attr('contentEditable', 'true')
	      .html(getThumbnail(obj));
	  }
	
		var sharePopup = document.querySelectorAll("." + obj.prefix + "js-share");
	
	  if (sharePopup) {
	    [].forEach.call(sharePopup, function(anchor) {
	      anchor.addEventListener("click", function(e) {
	        e.preventDefault();
	        windowPopup(this.href, 600, 620);
	      });
	    });
	  }
	
		return {
			meta_nav: chartMeta
		};
	
	}
	
	// social popup
	function windowPopup(url, width, height) {
	  // calculate the position of the popup so it’s centered on the screen.
	  var left = (screen.width / 2) - (width / 2),
	      top = (screen.height / 2) - (height / 2);
	  window.open(
	    url,
	    "",
	    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
	  );
	}
	
	function constructFacebookURL(obj){
	  var base = 'https://www.facebook.com/dialog/share?',
	      redirect = obj.social.facebook.redirect,
	      url = 'app_id=' + obj.social.facebook.appID + '&amp;display=popup&amp;title=' + obj.heading + '&amp;description=From%20article' + document.title + '&amp;href=' + window.location.href + '&amp;redirect_uri=' + redirect;
	  if (obj.image && obj.image.enable) {  url += '&amp;picture=' + getThumbnail(obj); }
	  return base + url;
	}
	
	function constructMailURL(obj){
	  var base = 'mailto:?';
	  var thumbnail = (obj.image && obj.image.enable) ? '%0A' + getThumbnail(obj) : "";
	  return base + 'subject=' + obj.heading + '&amp;body=' + obj.heading + thumbnail + '%0Afrom article: ' + document.title + '%0A' + window.location.href;
	}
	
	function constructSMSURL(obj){
	  var base = 'sms:',
	      url = '&body=Check%20out%20this%20chart: ' + obj.heading;
	  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
	  return base + url;
	}
	
	function constructTwitterURL(obj){
	  var base = 'https://twitter.com/intent/tweet?',
	      hashtag = !!(obj.social.twitter.hashtag) ? '&amp;hashtags=' + obj.social.twitter.hashtag : "",
	      via = !!(obj.social.twitter.via) ? '&amp;via=' + obj.social.twitter.via : "",
	      url = 'url=' + window.location.href  + via + '&amp;text=' + encodeURI(obj.heading) + hashtag;
	  if (obj.image && obj.image.enable) {  url += '%20' + getThumbnail(obj); }
	  return base + url;
	}
	
	module.exports = socialComponent;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Sharing Data module.
	 * @module charts/components/share-data
	 */
	
	/*
	This component adds a "data" button to each chart which can be toggled to present the charts data in a tabular form along with buttons allowing the raw data to be downloaded
	 */
	
	function shareDataComponent(node, obj) {
	
	 	var chartContainer = d3.select(node);
	
	  var chartMeta = chartContainer.select('.' + obj.prefix + 'chart_meta');
	
	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', obj.prefix + 'chart_meta');
	  }
	
		var chartDataBtn = chartMeta
			.append('div')
			.attr('class', obj.prefix + 'chart_meta_btn')
			.html('data');
	
		var chartData = chartContainer
			.append('div')
			.attr('class', obj.prefix + 'chart_data');
	
		var chartDataCloseBtn = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_close')
			.html('&#xd7;');
	
		var chartDataTable = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_inner');
	
		chartData
			.append('h2')
			.html(obj.heading);
	
		var chartDataNav = chartData
			.append('div')
			.attr('class', obj.prefix + 'chart_data_nav');
	
		var csvDLBtn = chartDataNav
			.append('a')
			.attr('class', obj.prefix + 'chart_data_btn csv')
			.html('download csv');
	
	  var csvToTable = __webpack_require__(4).csvToTable;
	
		csvToTable(chartDataTable, obj.data.csv);
	
		chartDataBtn.on('click', function() {
			chartData.classed(obj.prefix + 'active', true);
		});
	
		chartDataCloseBtn.on('click', function() {
			chartData.classed(obj.prefix + 'active', false);
		});
	
		csvDLBtn.on('click',function() {
		  var dlData = 'data:text/plain;charset=utf-8,' + encodeURIComponent(obj.data.csv);
		  d3.select(this)
		  	.attr('href', dlData)
		  	.attr('download','data_' + obj.id + '.csv');
		});
	
		return {
			meta_nav: chartMeta,
			data_panel: chartData
		};
	
	}
	
	module.exports = shareDataComponent;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * Custom code function that can be invoked to modify chart elements after chart drawing has occurred.
	 * @param  {Object} node         The main container group for the chart.
	 * @param  {Object} chartRecipe  Object that contains settings for the chart.
	 * @param  {Object} rendered     An object containing references to all rendered chart elements, including axes, scales, paths, nodes, and so forth.
	 * @return {Object}              Optional.
	 */
	function custom(node, chartRecipe, rendered) {
	
	  // With this function, you can access all elements of a chart and modify
	  // them at will. For instance: you might want to play with colour
	  // interpolation for a multi-series line chart, or modify the width and position
	  // of the x- and y-axis ticks. With this function, you can do all that!
	
	  // If you can, it's good Chart Tool practice to return references to newly
	  // created nodes and d3 objects so they be accessed later — by a dispatcher
	  // event, for instance.
	  return;
	
	}
	
	module.exports = custom;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODc1YTJmZmM2OTM4ODMyYWJiOWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb25maWcvY2hhcnQtc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29uZmlnL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy91dGlscy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9tYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9jb21wb25lbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcGxvdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvbXVsdGlsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3F1YWxpZmllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvdGlwcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzIiwid2VicGFjazovLy8uL2N1c3RvbS9jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVMsTUFBTTtBQUNmLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBa0IsT0FBTztB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QUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFD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QTs7Ozs7OztBQ3BDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUF5QixVQUFVLEVBQUU7QUFDckM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ3hGQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNsREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFDQUFvQyxtQ0FBbUMsVUFBVSxFQUFFOztBQUVuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBLDBDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBOEIsZ0NBQWdDLEVBQUU7QUFDaEUseUJBQXdCLHNCQUFzQixFQUFFO0FBQ2hELHlCQUF3QixnQ0FBZ0MsRUFBRTs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwyQkFBMEIsb0RBQW9ELEVBQUU7QUFDaEYscUJBQW9CLHNCQUFzQixFQUFFO0FBQzVDLHFCQUFvQixvREFBb0QsRUFBRTs7QUFFMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQSxNQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQy9GQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSwyQkFBMEIsOEJBQThCOztBQUV4RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLDBCQUF5QixVQUFVLEVBQUU7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBLHVDQUFzQyxtQ0FBbUM7O0FBRXpFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMEIsYUFBYSxFQUFFOztBQUV6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QTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDOUVBO0FBQ0E7QUFDQSxhQUFZLE9BQU87QUFDbkIsYUFBWSxPQUFPO0FBQ25CLGFBQVksT0FBTztBQUNuQixhQUFZLE9BQU87QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx5QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDg3NWEyZmZjNjkzODgzMmFiYjlhXG4gKiovIiwiLyoqXG4gKiBDaGFydCBUb29sXG4gKiBAYXV0aG9yIEplcmVteSBBZ2l1cyA8amFnaXVzQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAYXV0aG9yIFRvbSBDYXJkb3NvIDx0Y2FyZG9zb0BnbG9iZWFuZG1haWwuY29tPlxuICogQGF1dGhvciBNaWNoYWVsIFBlcmVpcmEgPG1wZXJlaXJhQGdsb2JlYW5kbWFpbC5jb20+XG4gKiBAc2VlIHtAbGlua30gZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uXG4gKiBAc2VlIHtAbGluayBodHRwOi8vd3d3LmdpdGh1Yi5jb20vZ2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2x8Q2hhcnQgVG9vbH1cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiBDaGFydFRvb2xJbml0KHJvb3QpIHtcblxuICBpZiAocm9vdC5kMykge1xuXG4gICAgdmFyIENoYXJ0VG9vbCA9IChmdW5jdGlvbiBDaGFydFRvb2woKSB7XG5cbiAgICAgIHZhciBjaGFydHMgPSByb290Ll9fY2hhcnR0b29sIHx8IFtdLFxuICAgICAgICAgIGRpc3BhdGNoRnVuY3Rpb25zID0gcm9vdC5fX2NoYXJ0dG9vbGRpc3BhdGNoZXIgfHwgW10sXG4gICAgICAgICAgZHJhd24gPSBbXTtcblxuICAgICAgdmFyIHNldHRpbmdzID0gcmVxdWlyZShcIi4vY29uZmlnL2NoYXJ0LXNldHRpbmdzXCIpLFxuICAgICAgICAgIHV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMvdXRpbHNcIik7XG5cbiAgICAgIHZhciBkaXNwYXRjaGVyID0gZDMuZGlzcGF0Y2goXCJzdGFydFwiLCBcImZpbmlzaFwiLCBcInJlZHJhd1wiLCBcIm1vdXNlT3ZlclwiLCBcIm1vdXNlTW92ZVwiLCBcIm1vdXNlT3V0XCIsIFwiY2xpY2tcIik7XG5cbiAgICAgIGZvciAodmFyIHByb3AgaW4gZGlzcGF0Y2hGdW5jdGlvbnMpIHtcbiAgICAgICAgaWYgKGRpc3BhdGNoRnVuY3Rpb25zLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgaWYgKGQzLmtleXMoZGlzcGF0Y2hlcikuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLm9uKHByb3AsIGRpc3BhdGNoRnVuY3Rpb25zW3Byb3BdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgXCJDaGFydCBUb29sIGRvZXMgbm90IG9mZmVyIGEgZGlzcGF0Y2hlciBvZiB0eXBlICdcIiArIHByb3AgKyBcIicuIEZvciBhdmFpbGFibGUgZGlzcGF0Y2hlciB0eXBlcywgcGxlYXNlIHNlZSB0aGUgQ2hhcnRUb29sLmRpc3BhdGNoKCkgbWV0aG9kLlwiIDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDbGVhcnMgcHJldmlvdXMgaXRlcmF0aW9ucyBvZiBjaGFydCBvYmplY3RzIHN0b3JlZCBpbiBvYmogb3IgdGhlIGRyYXduIGFycmF5LCB0aGVuIHB1bnRzIGNoYXJ0IGNvbnN0cnVjdGlvbiB0byB0aGUgQ2hhcnQgTWFuYWdlci5cbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gY29udGFpbmVyIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY29udGFpbmVyJ3Mgc2VsZWN0b3IuXG4gICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgICAgICBUaGUgY2hhcnQgSUQgYW5kIGVtYmVkIGRhdGEuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5zdGFydChvYmopO1xuXG4gICAgICAgIGRyYXduID0gdXRpbHMuY2xlYXJEcmF3bihkcmF3biwgb2JqKTtcbiAgICAgICAgb2JqID0gdXRpbHMuY2xlYXJPYmoob2JqKTtcbiAgICAgICAgY29udGFpbmVyID0gdXRpbHMuY2xlYXJDaGFydChjb250YWluZXIpO1xuXG4gICAgICAgIHZhciBDaGFydE1hbmFnZXIgPSByZXF1aXJlKFwiLi9jaGFydHMvbWFuYWdlclwiKTtcblxuICAgICAgICBvYmouZGF0YS53aWR0aCA9IHV0aWxzLmdldEJvdW5kaW5nKGNvbnRhaW5lciwgXCJ3aWR0aFwiKTtcbiAgICAgICAgb2JqLmRpc3BhdGNoID0gZGlzcGF0Y2hlcjtcblxuICAgICAgICB2YXIgY2hhcnRPYmo7XG5cbiAgICAgICAgaWYgKHV0aWxzLnN2Z1Rlc3Qocm9vdCkpIHtcbiAgICAgICAgICBjaGFydE9iaiA9IENoYXJ0TWFuYWdlcihjb250YWluZXIsIG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXRpbHMuZ2VuZXJhdGVUaHVtYihjb250YWluZXIsIG9iaiwgc2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhd24ucHVzaCh7IGlkOiBvYmouaWQsIGNoYXJ0T2JqOiBjaGFydE9iaiB9KTtcbiAgICAgICAgb2JqLmNoYXJ0T2JqID0gY2hhcnRPYmo7XG5cbiAgICAgICAgZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHsgZGlzcGF0Y2hlci5jbGljayh0aGlzLCBjaGFydE9iaik7IH0pXG4gICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlT3Zlcih0aGlzLCBjaGFydE9iaik7IH0pXG4gICAgICAgICAgLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlTW92ZSh0aGlzLCBjaGFydE9iaik7ICB9KVxuICAgICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkgeyBkaXNwYXRjaGVyLm1vdXNlT3V0KHRoaXMsIGNoYXJ0T2JqKTsgfSk7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5maW5pc2goY2hhcnRPYmopO1xuXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogR3JhYnMgZGF0YSBvbiBhIGNoYXJ0IGJhc2VkIG9uIGFuIElELlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgY2hhcnQuXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgIFJldHVybnMgc3RvcmVkIGVtYmVkIG9iamVjdC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVhZENoYXJ0KGlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgIGlmIChjaGFydHNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hhcnRzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBMaXN0IGFsbCB0aGUgY2hhcnRzIHN0b3JlZCBpbiB0aGUgQ2hhcnQgVG9vbCBieSBjaGFydGlkLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqIEByZXR1cm4ge0FycmF5fSAgICAgICBMaXN0IG9mIGNoYXJ0aWQncy5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gbGlzdENoYXJ0cyhjaGFydHMpIHtcbiAgICAgICAgdmFyIGNoYXJ0c0FyciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNoYXJ0c0Fyci5wdXNoKGNoYXJ0c1tpXS5pZCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjaGFydHNBcnI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNoYXJ0KGlkLCBvYmopIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIHNldHRpbmdzLnByZWZpeCArIGlkICsgJ10nO1xuICAgICAgICBjcmVhdGVDaGFydChjb250YWluZXIsIHsgaWQ6IGlkLCBkYXRhOiBvYmogfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lDaGFydChpZCkge1xuICAgICAgICB2YXIgY29udGFpbmVyLCBvYmo7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNoYXJ0c1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIG9iaiA9IGNoYXJ0c1tpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIG9iai5pZCArICddJztcbiAgICAgICAgdXRpbHMuY2xlYXJEcmF3bihkcmF3biwgb2JqKTtcbiAgICAgICAgdXRpbHMuY2xlYXJPYmoob2JqKTtcbiAgICAgICAgdXRpbHMuY2xlYXJDaGFydChjb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIGNoYXJ0cywgZHJhdyBlYWNoIGNoYXJ0IGludG8gaXRzIHJlc3BlY3RpdmUgY29udGFpbmVyLlxuICAgICAgICogQHBhcmFtIHtBcnJheX0gY2hhcnRzIEFycmF5IG9mIGNoYXJ0cyBvbiB0aGUgcGFnZS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gY3JlYXRlTG9vcChjaGFydHMpIHtcbiAgICAgICAgdmFyIGNoYXJ0TGlzdCA9IGxpc3RDaGFydHMoY2hhcnRzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFydExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgb2JqID0gcmVhZENoYXJ0KGNoYXJ0TGlzdFtpXSk7XG4gICAgICAgICAgdmFyIGNvbnRhaW5lciA9ICcuJyArIHNldHRpbmdzLmJhc2VDbGFzcygpICsgJ1tkYXRhLWNoYXJ0aWQ9JyArIGNoYXJ0TGlzdFtpXSArICddJztcbiAgICAgICAgICBjcmVhdGVDaGFydChjb250YWluZXIsIG9iaik7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hhcnQgVG9vbCBpbml0aWFsaXplciB3aGljaCBzZXRzIHVwIGRlYm91bmNpbmcgYW5kIHJ1bnMgdGhlIGNyZWF0ZUxvb3AoKS4gUnVuIG9ubHkgb25jZSwgd2hlbiB0aGUgbGlicmFyeSBpcyBmaXJzdCBsb2FkZWQuXG4gICAgICAgKiBAcGFyYW0ge0FycmF5fSBjaGFydHMgQXJyYXkgb2YgY2hhcnRzIG9uIHRoZSBwYWdlLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBpbml0aWFsaXplcihjaGFydHMpIHtcbiAgICAgICAgY3JlYXRlTG9vcChjaGFydHMpO1xuICAgICAgICB2YXIgZGVib3VuY2UgPSB1dGlscy5kZWJvdW5jZShjcmVhdGVMb29wLCBjaGFydHMsIHNldHRpbmdzLmRlYm91bmNlLCByb290KTtcbiAgICAgICAgZDMuc2VsZWN0KHJvb3QpXG4gICAgICAgICAgLm9uKCdyZXNpemUuJyArIHNldHRpbmdzLnByZWZpeCArICdkZWJvdW5jZScsIGRlYm91bmNlKVxuICAgICAgICAgIC5vbigncmVzaXplLicgKyBzZXR0aW5ncy5wcmVmaXggKyAncmVkcmF3JywgZGlzcGF0Y2hlci5yZWRyYXcoY2hhcnRzKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXIoY2hhcnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShjb250YWluZXIsIG9iaikge1xuICAgICAgICAgIHJldHVybiBjcmVhdGVDaGFydChjb250YWluZXIsIG9iaik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChpZCkge1xuICAgICAgICAgIHJldHVybiByZWFkQ2hhcnQoaWQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxpc3Q6IGZ1bmN0aW9uIGxpc3QoKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RDaGFydHMoY2hhcnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShpZCwgb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZUNoYXJ0KGlkLCBvYmopO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgICAgICByZXR1cm4gZGVzdHJveUNoYXJ0KGlkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgICAgICAgcmV0dXJuIGQzLmtleXMoZGlzcGF0Y2hlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2F0OiBmdW5jdGlvbiB3YXQoKSB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKFwiQ2hhcnRUb29sIHZcIiArIHNldHRpbmdzLnZlcnNpb24gKyBcIiBpcyBhIGZyZWUsIG9wZW4tc291cmNlIGNoYXJ0IGdlbmVyYXRvciBhbmQgZnJvbnQtZW5kIGxpYnJhcnkgbWFpbnRhaW5lZCBieSBUaGUgR2xvYmUgYW5kIE1haWwuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBjaGVjayBvdXQgb3VyIEdpdEh1YiByZXBvOiB3d3cuZ2l0aHViLmNvbS9nbG9iZWFuZG1haWwvY2hhcnQtdG9vbFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICB2ZXJzaW9uOiBzZXR0aW5ncy52ZXJzaW9uLFxuICAgICAgICBidWlsZDogc2V0dGluZ3MuYnVpbGQsXG4gICAgICAgIHNldHRpbmdzOiByZXF1aXJlKFwiLi9jb25maWcvY2hhcnQtc2V0dGluZ3NcIiksXG4gICAgICAgIGNoYXJ0czogcmVxdWlyZShcIi4vY2hhcnRzL21hbmFnZXJcIiksXG4gICAgICAgIGNvbXBvbmVudHM6IHJlcXVpcmUoXCIuL2NoYXJ0cy9jb21wb25lbnRzL2NvbXBvbmVudHNcIiksXG4gICAgICAgIGhlbHBlcnM6IHJlcXVpcmUoXCIuL2hlbHBlcnMvaGVscGVyc1wiKSxcbiAgICAgICAgdXRpbHM6IHJlcXVpcmUoXCIuL3V0aWxzL3V0aWxzXCIpLFxuICAgICAgICBsaW5lOiByZXF1aXJlKFwiLi9jaGFydHMvdHlwZXMvbGluZVwiKSxcbiAgICAgICAgYXJlYTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2FyZWFcIiksXG4gICAgICAgIG11bHRpbGluZTogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL211bHRpbGluZVwiKSxcbiAgICAgICAgc3RhY2tlZEFyZWE6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9zdGFja2VkLWFyZWFcIiksXG4gICAgICAgIGNvbHVtbjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL2NvbHVtblwiKSxcbiAgICAgICAgc3RhY2tlZENvbHVtbjogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0YWNrZWQtY29sdW1uXCIpLFxuICAgICAgICBzdHJlYW1ncmFwaDogcmVxdWlyZShcIi4vY2hhcnRzL3R5cGVzL3N0cmVhbWdyYXBoXCIpLFxuICAgICAgICBiYXI6IHJlcXVpcmUoXCIuL2NoYXJ0cy90eXBlcy9iYXJcIilcblxuICAgICAgfVxuXG4gICAgfSkoKTtcblxuICAgIGlmICghcm9vdC5NZXRlb3IpIHsgQ2hhcnRUb29sLmluaXQoKTsgfVxuXG4gIH0gZWxzZSB7XG5cbiAgICB2YXIgTWV0ZW9yID0gdGhpcy5NZXRlb3IgfHwge30sXG4gICAgICAgIGlzU2VydmVyID0gTWV0ZW9yLmlzU2VydmVyIHx8IHVuZGVmaW5lZDtcblxuICAgIGlmICghaXNTZXJ2ZXIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDaGFydCBUb29sOiBubyBEMyBsaWJyYXJ5IGRldGVjdGVkLlwiKTtcbiAgICB9XG5cblxuICB9XG5cbiAgcm9vdC5DaGFydFRvb2wgPSBDaGFydFRvb2w7XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdmVyc2lvbiA9IHtcbiAgdmVyc2lvbjogcmVxdWlyZShcImpzb24hLi4vLi4vLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb24sXG4gIGJ1aWxkOiByZXF1aXJlKFwianNvbiEuLi8uLi8uLi9wYWNrYWdlLmpzb25cIikuYnVpbGR2ZXJcbn07XG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoXCJqc29uIS4uLy4uLy4uL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBDVVNUT006IHNldHRpbmdzLkNVU1RPTSxcbiAgdmVyc2lvbjogdmVyc2lvbi52ZXJzaW9uLFxuICBidWlsZDogdmVyc2lvbi5idWlsZCxcbiAgaWQ6IFwiXCIsXG4gIGRhdGE6IFwiXCIsXG4gIGRhdGVGb3JtYXQ6IHNldHRpbmdzLmRhdGVGb3JtYXQsXG4gIHRpbWVGb3JtYXQ6IHNldHRpbmdzLnRpbWVGb3JtYXQsXG4gIGltYWdlOiBzZXR0aW5ncy5pbWFnZSxcbiAgaGVhZGluZzogXCJcIixcbiAgcXVhbGlmaWVyOiBcIlwiLFxuICBzb3VyY2U6IFwiXCIsXG4gIGRlY2s6IFwiXCIsXG4gIGluZGV4OiBcIlwiLFxuICBoYXNIb3VyczogZmFsc2UsXG4gIHNvY2lhbDogc2V0dGluZ3Muc29jaWFsLFxuICBzZXJpZXNIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmRhdGEuc2VyaWVzQW1vdW50ICYmIHRoaXMuZGF0YS5zZXJpZXNBbW91bnQgPD0gMSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfSxcbiAgYmFzZUNsYXNzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMucHJlZml4ICsgXCJjaGFydFwiOyB9LFxuICBjdXN0b21DbGFzczogXCJcIixcblxuICBvcHRpb25zOiB7XG4gICAgdHlwZTogXCJsaW5lXCIsXG4gICAgaW50ZXJwb2xhdGlvbjogXCJsaW5lYXJcIixcbiAgICBzdGFja2VkOiBmYWxzZSxcbiAgICBleHBhbmRlZDogZmFsc2UsXG4gICAgaGVhZDogdHJ1ZSxcbiAgICBkZWNrOiBmYWxzZSxcbiAgICBxdWFsaWZpZXI6IHRydWUsXG4gICAgbGVnZW5kOiB0cnVlLFxuICAgIGZvb3RlcjogdHJ1ZSxcbiAgICB4X2F4aXM6IHRydWUsXG4gICAgeV9heGlzOiB0cnVlLFxuICAgIHRpcHM6IGZhbHNlLFxuICAgIGFubm90YXRpb25zOiBmYWxzZSxcbiAgICByYW5nZTogZmFsc2UsXG4gICAgc2VyaWVzOiBmYWxzZSxcbiAgICBzaGFyZV9kYXRhOiB0cnVlLFxuICAgIHNvY2lhbDogdHJ1ZVxuICB9LFxuXG4gIHJhbmdlOiB7fSxcbiAgc2VyaWVzOiB7fSxcbiAgeEF4aXM6IHNldHRpbmdzLnhBeGlzLFxuICB5QXhpczogc2V0dGluZ3MueUF4aXMsXG5cbiAgZXhwb3J0YWJsZTogZmFsc2UsIC8vIHRoaXMgY2FuIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBiYWNrZW5kIGFzIG5lZWRlZFxuICBlZGl0YWJsZTogZmFsc2UsXG5cbiAgcHJlZml4OiBzZXR0aW5ncy5wcmVmaXgsXG4gIGRlYm91bmNlOiBzZXR0aW5ncy5kZWJvdW5jZSxcbiAgdGlwVGltZW91dDogc2V0dGluZ3MudGlwVGltZW91dCxcbiAgbW9udGhzQWJyOiBzZXR0aW5ncy5tb250aHNBYnIsXG5cbiAgZGltZW5zaW9uczoge1xuICAgIHdpZHRoOiAwLFxuICAgIGNvbXB1dGVkV2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMud2lkdGggLSB0aGlzLm1hcmdpbi5sZWZ0IC0gdGhpcy5tYXJnaW4ucmlnaHQ7XG4gICAgfSxcbiAgICBoZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJhdGlvU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5yYW5nZShbMzAwLCA5MDBdKS5kb21haW4oW3RoaXMud2lkdGggKiB0aGlzLnJhdGlvTW9iaWxlLCB0aGlzLndpZHRoICogdGhpcy5yYXRpb0Rlc2t0b3BdKTtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHJhdGlvU2NhbGUodGhpcy53aWR0aCkpO1xuICAgIH0sXG4gICAgY29tcHV0ZWRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmhlaWdodCgpIC0gdGhpcy5oZWFkZXJIZWlnaHQgLSB0aGlzLmZvb3RlckhlaWdodCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbSk7XG4gICAgfSxcbiAgICByYXRpb01vYmlsZTogc2V0dGluZ3MucmF0aW9Nb2JpbGUsXG4gICAgcmF0aW9EZXNrdG9wOiBzZXR0aW5ncy5yYXRpb0Rlc2t0b3AsXG4gICAgbWFyZ2luOiBzZXR0aW5ncy5tYXJnaW4sXG4gICAgdGlwUGFkZGluZzogc2V0dGluZ3MudGlwUGFkZGluZyxcbiAgICB0aXBPZmZzZXQ6IHNldHRpbmdzLnRpcE9mZnNldCxcbiAgICBoZWFkZXJIZWlnaHQ6IDAsXG4gICAgZm9vdGVySGVpZ2h0OiAwLFxuICAgIHhBeGlzSGVpZ2h0OiAwLFxuICAgIHlBeGlzSGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAodGhpcy5jb21wdXRlZEhlaWdodCgpIC0gdGhpcy54QXhpc0hlaWdodCk7XG4gICAgfSxcbiAgICB4QXhpc1dpZHRoOiAwLFxuICAgIGxhYmVsV2lkdGg6IDAsXG4gICAgeUF4aXNQYWRkaW5nUmlnaHQ6IHNldHRpbmdzLnlBeGlzLnBhZGRpbmdSaWdodCxcbiAgICB0aWNrV2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLmNvbXB1dGVkV2lkdGgoKSAtICh0aGlzLmxhYmVsV2lkdGggKyB0aGlzLnlBeGlzUGFkZGluZ1JpZ2h0KSk7XG4gICAgfSxcbiAgICBiYXJIZWlnaHQ6IHNldHRpbmdzLmJhckhlaWdodCxcbiAgICBiYW5kczoge1xuICAgICAgcGFkZGluZzogc2V0dGluZ3MuYmFuZHMucGFkZGluZyxcbiAgICAgIG9mZnNldDogc2V0dGluZ3MuYmFuZHMub2Zmc2V0LFxuICAgICAgb3V0ZXJQYWRkaW5nOiBzZXR0aW5ncy5iYW5kcy5vdXRlclBhZGRpbmdcbiAgICB9XG4gIH1cblxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY29uZmlnL2NoYXJ0LXNldHRpbmdzLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibmFtZVwiOiBcImNoYXJ0LXRvb2xcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4xLjBcIixcblx0XCJidWlsZFZlclwiOiBcIjBcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIkEgcmVzcG9uc2l2ZSBjaGFydGluZyBhcHBsaWNhdGlvblwiLFxuXHRcIm1haW5cIjogXCJndWxwZmlsZS5qc1wiLFxuXHRcImRlcGVuZGVuY2llc1wiOiB7fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiYnJvd3Nlci1zeW5jXCI6IFwiXjIuOC4wXCIsXG5cdFx0XCJndWxwXCI6IFwiXjMuOC4xMVwiLFxuXHRcdFwiZ3VscC1jbGVhblwiOiBcIl4wLjMuMVwiLFxuXHRcdFwiZ3VscC1qc29uLWVkaXRvclwiOiBcIl4yLjIuMVwiLFxuXHRcdFwiZ3VscC1taW5pZnktY3NzXCI6IFwiXjEuMi4wXCIsXG5cdFx0XCJndWxwLXJlbmFtZVwiOiBcIl4xLjIuMlwiLFxuXHRcdFwiZ3VscC1yZXBsYWNlXCI6IFwiXjAuNS4zXCIsXG5cdFx0XCJndWxwLXNhc3NcIjogXCJeMi4wLjRcIixcblx0XHRcImd1bHAtc2hlbGxcIjogXCJeMC40LjJcIixcblx0XHRcImd1bHAtc291cmNlbWFwc1wiOiBcIl4xLjUuMlwiLFxuXHRcdFwiZ3VscC11dGlsXCI6IFwiXjMuMC42XCIsXG5cdFx0XCJqc2RvY1wiOiBcIl4zLjMuMlwiLFxuXHRcdFwianNvbi1sb2FkZXJcIjogXCJeMC41LjNcIixcblx0XHRcInJ1bi1zZXF1ZW5jZVwiOiBcIl4xLjEuNFwiLFxuXHRcdFwid2VicGFja1wiOiBcIl4xLjEyLjE0XCIsXG5cdFx0XCJ3ZWJwYWNrLXN0cmVhbVwiOiBcIl4zLjEuMFwiLFxuXHRcdFwieWFyZ3NcIjogXCJeMy4xNS4wXCJcblx0fSxcblx0XCJzY3JpcHRzXCI6IHtcblx0XHRcInRlc3RcIjogXCJcIlxuXHR9LFxuXHRcImtleXdvcmRzXCI6IFtcblx0XHRcImNoYXJ0c1wiLFxuXHRcdFwiZDNcIixcblx0XHRcImQzanNcIixcblx0XHRcIm1ldGVvclwiLFxuXHRcdFwiZ3VscFwiLFxuXHRcdFwid2VicGFja1wiLFxuXHRcdFwiZGF0YSB2aXN1YWxpemF0aW9uXCIsXG5cdFx0XCJjaGFydFwiLFxuXHRcdFwibW9uZ29cIlxuXHRdLFxuXHRcInJlcG9zaXRvcnlcIjoge1xuXHRcdFwidHlwZVwiOiBcImdpdFwiLFxuXHRcdFwidXJsXCI6IFwiZ2l0QGdpdGh1Yi5jb206Z2xvYmVhbmRtYWlsL2NoYXJ0LXRvb2wuZ2l0XCJcblx0fSxcblx0XCJjb250cmlidXRvcnNcIjogW1xuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiVG9tIENhcmRvc29cIixcblx0XHRcdFwiZW1haWxcIjogXCJ0Y2FyZG9zb0BnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwiYXV0aG9yXCI6IFwiSmVyZW15IEFnaXVzXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwiamFnaXVzQGdsb2JlYW5kbWFpbC5jb21cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0XCJhdXRob3JcIjogXCJNaWNoYWVsIFBlcmVpcmFcIixcblx0XHRcdFwiZW1haWxcIjogXCJtcGVyZWlyYUBnbG9iZWFuZG1haWwuY29tXCJcblx0XHR9XG5cdF0sXG5cdFwibGljZW5zZVwiOiBcIk1JVFwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcGFja2FnZS5qc29uXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJDVVNUT01cIjogZmFsc2UsXG5cdFwicHJlZml4XCI6IFwibGEtZy1cIixcblx0XCJtb250aHNBYnJcIjogW1xuXHRcdFwiSmFuLlwiLFxuXHRcdFwiRmViLlwiLFxuXHRcdFwiTWFyLlwiLFxuXHRcdFwiQXByLlwiLFxuXHRcdFwiTWF5XCIsXG5cdFx0XCJKdW5lXCIsXG5cdFx0XCJKdWx5XCIsXG5cdFx0XCJBdWcuXCIsXG5cdFx0XCJTZXB0LlwiLFxuXHRcdFwiT2N0LlwiLFxuXHRcdFwiTm92LlwiLFxuXHRcdFwiRGVjLlwiLFxuXHRcdFwiSmFuLlwiXG5cdF0sXG5cdFwiZGVib3VuY2VcIjogNTAwLFxuXHRcInRpcFRpbWVvdXRcIjogNTAwMCxcblx0XCJyYXRpb01vYmlsZVwiOiAxLjE1LFxuXHRcInJhdGlvRGVza3RvcFwiOiAwLjY1LFxuXHRcImRhdGVGb3JtYXRcIjogXCIlWS0lbS0lZFwiLFxuXHRcInRpbWVGb3JtYXRcIjogXCIlSDolTVwiLFxuXHRcIm1hcmdpblwiOiB7XG5cdFx0XCJ0b3BcIjogMTAsXG5cdFx0XCJyaWdodFwiOiAzLFxuXHRcdFwiYm90dG9tXCI6IDAsXG5cdFx0XCJsZWZ0XCI6IDBcblx0fSxcblx0XCJ0aXBPZmZzZXRcIjoge1xuXHRcdFwidmVydGljYWxcIjogNCxcblx0XHRcImhvcml6b250YWxcIjogMVxuXHR9LFxuXHRcInRpcFBhZGRpbmdcIjoge1xuXHRcdFwidG9wXCI6IDQsXG5cdFx0XCJyaWdodFwiOiA5LFxuXHRcdFwiYm90dG9tXCI6IDQsXG5cdFx0XCJsZWZ0XCI6IDlcblx0fSxcblx0XCJ5QXhpc1wiOiB7XG5cdFx0XCJkaXNwbGF5XCI6IHRydWUsXG5cdFx0XCJzY2FsZVwiOiBcImxpbmVhclwiLFxuXHRcdFwidGlja3NcIjogXCI1XCIsXG5cdFx0XCJvcmllbnRcIjogXCJyaWdodFwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiY29tbWFcIixcblx0XHRcInByZWZpeFwiOiBcIlwiLFxuXHRcdFwic3VmZml4XCI6IFwiXCIsXG5cdFx0XCJtaW5cIjogXCJcIixcblx0XHRcIm1heFwiOiBcIlwiLFxuXHRcdFwicmVzY2FsZVwiOiBmYWxzZSxcblx0XHRcIm5pY2VcIjogdHJ1ZSxcblx0XHRcInBhZGRpbmdSaWdodFwiOiA5LFxuXHRcdFwidGlja0xvd2VyQm91bmRcIjogMyxcblx0XHRcInRpY2tVcHBlckJvdW5kXCI6IDgsXG5cdFx0XCJ0aWNrR29hbFwiOiA1LFxuXHRcdFwid2lkdGhUaHJlc2hvbGRcIjogNDIwLFxuXHRcdFwiZHlcIjogXCJcIixcblx0XHRcInRleHRYXCI6IDAsXG5cdFx0XCJ0ZXh0WVwiOiBcIlwiXG5cdH0sXG5cdFwieEF4aXNcIjoge1xuXHRcdFwiZGlzcGxheVwiOiB0cnVlLFxuXHRcdFwic2NhbGVcIjogXCJ0aW1lXCIsXG5cdFx0XCJ0aWNrc1wiOiBcImF1dG9cIixcblx0XHRcIm9yaWVudFwiOiBcImJvdHRvbVwiLFxuXHRcdFwiZm9ybWF0XCI6IFwiYXV0b1wiLFxuXHRcdFwicHJlZml4XCI6IFwiXCIsXG5cdFx0XCJzdWZmaXhcIjogXCJcIixcblx0XHRcIm1pblwiOiBcIlwiLFxuXHRcdFwibWF4XCI6IFwiXCIsXG5cdFx0XCJyZXNjYWxlXCI6IGZhbHNlLFxuXHRcdFwibmljZVwiOiBmYWxzZSxcblx0XHRcInJhbmdlUG9pbnRzXCI6IDEsXG5cdFx0XCJ0aWNrVGFyZ2V0XCI6IDYsXG5cdFx0XCJ0aWNrc1NtYWxsXCI6IDQsXG5cdFx0XCJ3aWR0aFRocmVzaG9sZFwiOiA0MjAsXG5cdFx0XCJkeVwiOiAwLjcsXG5cdFx0XCJ1cHBlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogNyxcblx0XHRcdFwidGV4dFhcIjogNixcblx0XHRcdFwidGV4dFlcIjogN1xuXHRcdH0sXG5cdFx0XCJsb3dlclwiOiB7XG5cdFx0XHRcInRpY2tIZWlnaHRcIjogMTIsXG5cdFx0XHRcInRleHRYXCI6IDYsXG5cdFx0XHRcInRleHRZXCI6IDJcblx0XHR9XG5cdH0sXG5cdFwiYmFySGVpZ2h0XCI6IDMwLFxuXHRcImJhbmRzXCI6IHtcblx0XHRcInBhZGRpbmdcIjogMC4wNixcblx0XHRcIm9mZnNldFwiOiAwLjEyLFxuXHRcdFwib3V0ZXJQYWRkaW5nXCI6IDAuMDNcblx0fSxcblx0XCJzb3VyY2VcIjoge1xuXHRcdFwicHJlZml4XCI6IFwiU291cmNlOiBcIixcblx0XHRcInN1ZmZpeFwiOiBcIlwiXG5cdH0sXG5cdFwic29jaWFsXCI6IHtcblx0XHRcImZhY2Vib29rXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJGYWNlYm9va1wiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXNvY2lhbC1mYWNlYm9vay5zdmdcIixcblx0XHRcdFwicmVkaXJlY3RcIjogXCJcIixcblx0XHRcdFwiYXBwSURcIjogXCJcIlxuXHRcdH0sXG5cdFx0XCJ0d2l0dGVyXCI6IHtcblx0XHRcdFwibGFiZWxcIjogXCJUd2l0dGVyXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktc29jaWFsLXR3aXR0ZXIuc3ZnXCIsXG5cdFx0XHRcInZpYVwiOiBcImxhdGltZXNncmFwaGljc1wiLFxuXHRcdFx0XCJoYXNodGFnXCI6IFwiXCJcblx0XHR9LFxuXHRcdFwiZW1haWxcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIkVtYWlsXCIsXG5cdFx0XHRcImljb25cIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb3VuZGljb25zLzMuMC4wL3N2Z3MvZmktbWFpbC5zdmdcIlxuXHRcdH0sXG5cdFx0XCJzbXNcIjoge1xuXHRcdFx0XCJsYWJlbFwiOiBcIlNNU1wiLFxuXHRcdFx0XCJpY29uXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm91bmRpY29ucy8zLjAuMC9zdmdzL2ZpLXRlbGVwaG9uZS5zdmdcIlxuXHRcdH1cblx0fSxcblx0XCJpbWFnZVwiOiB7XG5cdFx0XCJlbmFibGVcIjogZmFsc2UsXG5cdFx0XCJiYXNlX3BhdGhcIjogXCJcIixcblx0XHRcImV4cGlyYXRpb25cIjogMzAwMDAsXG5cdFx0XCJmaWxlbmFtZVwiOiBcInRodW1ibmFpbFwiLFxuXHRcdFwiZXh0ZW5zaW9uXCI6IFwicG5nXCIsXG5cdFx0XCJ0aHVtYm5haWxXaWR0aFwiOiA0NjBcblx0fVxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL2N1c3RvbS9jaGFydC10b29sLWNvbmZpZy5qc29uXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIFV0aWxpdGllcyBtb2R1bGUuIEZ1bmN0aW9ucyB0aGF0IGFyZW4ndCBzcGVjaWZpYyB0byBhbnkgb25lIG1vZHVsZS5cbiAqIEBtb2R1bGUgdXRpbHMvdXRpbHNcbiAqL1xuXG4vKipcbiAqIEdpdmVuIGEgZnVuY3Rpb24gdG8gcGVyZm9ybSwgYSB0aW1lb3V0IHBlcmlvZCwgYSBwYXJhbWV0ZXIgdG8gcGFzcyB0byB0aGUgcGVyZm9ybWVkIGZ1bmN0aW9uLCBhbmQgYSByZWZlcmVuY2UgdG8gdGhlIHdpbmRvdywgZmlyZSBhIHNwZWNpZmljIGZ1bmN0aW9uLlxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgICAgRnVuY3Rpb24gdG8gcGVyZm9ybSBvbiBkZWJvdW5jZS5cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqICAgICAgT2JqZWN0IHBhc3NlZCB0byBGdW5jdGlvbiB3aGljaCBpcyBwZXJmb3JtZWQgb24gZGVib3VuY2UuXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSAgIHRpbWVvdXQgVGltZW91dCBwZXJpb2QgaW4gbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtICB7T2JqZWN0fSAgIHJvb3QgICAgV2luZG93IG9iamVjdC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAgICAgICAgICAgRmluYWwgZGVib3VuY2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZuLCBvYmosIHRpbWVvdXQsIHJvb3QpIHtcbiAgdmFyIHRpbWVvdXRJRCA9IC0xO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXRJRCA+IC0xKSB7IHJvb3QuY2xlYXJUaW1lb3V0KHRpbWVvdXRJRCk7IH1cbiAgICB0aW1lb3V0SUQgPSByb290LnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGZuKG9iailcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmUgY2hhcnQgU1ZHIGFuZCBkaXZzIGluc2lkZSBhIGNvbnRhaW5lciBmcm9tIHRoZSBET00uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNvbnRhaW5lclxuICovXG5mdW5jdGlvbiBjbGVhckNoYXJ0KGNvbnRhaW5lcikge1xuXG4gIHZhciBjb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xuXG4gIHdoaWxlIChjb250ICYmIGNvbnQucXVlcnlTZWxlY3RvckFsbChcInN2Z1wiKS5sZW5ndGgpIHtcbiAgICB2YXIgc3ZnID0gY29udC5xdWVyeVNlbGVjdG9yQWxsKFwic3ZnXCIpO1xuICAgIHN2Z1tzdmcubGVuZ3RoIC0gMV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdmdbc3ZnLmxlbmd0aCAtIDFdKTtcbiAgfVxuXG4gIHdoaWxlIChjb250ICYmIGNvbnQucXVlcnlTZWxlY3RvckFsbChcImRpdlwiKS5sZW5ndGgpIHtcbiAgICB2YXIgZGl2ID0gY29udC5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpO1xuICAgIGRpdltkaXYubGVuZ3RoIC0gMV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXZbZGl2Lmxlbmd0aCAtIDFdKTtcbiAgfVxuXG4gIHJldHVybiBjb250YWluZXI7XG59XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBjaGFydCBkYXRhIG9mIGl0cyBwb3N0LXJlbmRlciBjaGFydE9iaiBvYmplY3QuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9iaiBPYmplY3QgdXNlZCB0byBjb25zdHJ1Y3QgY2hhcnRzLlxuICogQHJldHVybiB7T2JqZWN0fSAgICAgVGhlIG5ldyB2ZXJzaW9uIG9mIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsZWFyT2JqKG9iaikge1xuICBpZiAob2JqLmNoYXJ0T2JqKSB7IG9iai5jaGFydE9iaiA9IHVuZGVmaW5lZDsgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIENsZWFycyB0aGUgZHJhd24gYXJyYXkuXG4gKiBAcGFyYW0gIHtBcnJheX0gZHJhd25cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gY2xlYXJEcmF3bihkcmF3biwgb2JqKSB7XG4gIGlmIChkcmF3bi5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gZHJhd24ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChkcmF3bltpXS5pZCA9PT0gb2JqLmlkKSB7XG4gICAgICAgIGRyYXduLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGRyYXduO1xufVxuXG4vKipcbiAqIEdldCB0aGUgYm91bmRpbmdDbGllbnRSZWN0IGRpbWVuc2lvbnMgZ2l2ZW4gYSBzZWxlY3Rvci5cbiAqIEBwYXJhbSAge1N0cmluZ30gY29udGFpbmVyXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICBUaGUgYm91bmRpbmdDbGllbnRSZWN0IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZ2V0Qm91bmRpbmcoc2VsZWN0b3IsIGRpbWVuc2lvbikge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbZGltZW5zaW9uXTtcbn1cblxuLyoqXG4gKiBCYXNpYyBmYWN0b3J5IGZvciBmaWd1cmluZyBvdXQgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyBpbiBhIGdpdmVuIHRpbWUgcGVyaW9kLlxuICovXG5mdW5jdGlvbiBUaW1lT2JqKCkge1xuICB0aGlzLnNlYyA9IDEwMDA7XG4gIHRoaXMubWluID0gdGhpcy5zZWMgKiA2MDtcbiAgdGhpcy5ob3VyID0gdGhpcy5taW4gKiA2MDtcbiAgdGhpcy5kYXkgPSB0aGlzLmhvdXIgKiAyNDtcbiAgdGhpcy53ZWVrID0gdGhpcy5kYXkgKiA3O1xuICB0aGlzLm1vbnRoID0gdGhpcy5kYXkgKiAzMDtcbiAgdGhpcy55ZWFyID0gdGhpcy5kYXkgKiAzNjU7XG59XG5cbi8qKlxuICogU2xpZ2h0bHkgYWx0ZXJlZCBCb3N0b2NrIG1hZ2ljIHRvIHdyYXAgU1ZHIDx0ZXh0PiBub2RlcyBiYXNlZCBvbiBhdmFpbGFibGUgd2lkdGhcbiAqIEBwYXJhbSAge09iamVjdH0gdGV4dCAgICBEMyB0ZXh0IHNlbGVjdGlvbi5cbiAqIEBwYXJhbSAge0ludGVnZXJ9IHdpZHRoXG4gKi9cbmZ1bmN0aW9uIHdyYXBUZXh0KHRleHQsIHdpZHRoKSB7XG4gIHRleHQuZWFjaChmdW5jdGlvbigpIHtcbiAgICB2YXIgdGV4dCA9IGQzLnNlbGVjdCh0aGlzKSxcbiAgICAgICAgd29yZHMgPSB0ZXh0LnRleHQoKS5zcGxpdCgvXFxzKy8pLnJldmVyc2UoKSxcbiAgICAgICAgd29yZCxcbiAgICAgICAgbGluZSA9IFtdLFxuICAgICAgICBsaW5lTnVtYmVyID0gMCxcbiAgICAgICAgbGluZUhlaWdodCA9IDEuMCwgLy8gZW1zXG4gICAgICAgIHggPSAwLFxuICAgICAgICB5ID0gdGV4dC5hdHRyKFwieVwiKSxcbiAgICAgICAgZHkgPSBwYXJzZUZsb2F0KHRleHQuYXR0cihcImR5XCIpKSxcbiAgICAgICAgdHNwYW4gPSB0ZXh0LnRleHQobnVsbCkuYXBwZW5kKFwidHNwYW5cIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgeClcbiAgICAgICAgICAuYXR0cihcInlcIiwgeSlcbiAgICAgICAgICAuYXR0cihcImR5XCIsIGR5ICsgXCJlbVwiKTtcblxuICAgIHdoaWxlICh3b3JkID0gd29yZHMucG9wKCkpIHtcbiAgICAgIGxpbmUucHVzaCh3b3JkKTtcbiAgICAgIHRzcGFuLnRleHQobGluZS5qb2luKFwiIFwiKSk7XG4gICAgICBpZiAodHNwYW4ubm9kZSgpLmdldENvbXB1dGVkVGV4dExlbmd0aCgpID4gd2lkdGggJiYgbGluZS5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxpbmUucG9wKCk7XG4gICAgICAgIHRzcGFuLnRleHQobGluZS5qb2luKFwiIFwiKSk7XG4gICAgICAgIGxpbmUgPSBbd29yZF07XG4gICAgICAgIHRzcGFuID0gdGV4dC5hcHBlbmQoXCJ0c3BhblwiKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCB4KVxuICAgICAgICAgIC5hdHRyKFwieVwiLCB5KVxuICAgICAgICAgIC5hdHRyKFwiZHlcIiwgKytsaW5lTnVtYmVyICogbGluZUhlaWdodCArIGR5ICsgXCJlbVwiKVxuICAgICAgICAgIC50ZXh0KHdvcmQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogR2l2ZW4gdHdvIGRhdGVzIGRhdGUgYW5kIGEgdG9sZXJhbmNlIGxldmVsLCByZXR1cm4gYSB0aW1lIFwiY29udGV4dFwiIGZvciB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSB0d28gdmFsdWVzLlxuICogQHBhcmFtICB7T2JqZWN0fSBkMSAgICAgQmVnaW5uaW5nIGRhdGUgb2JqZWN0LlxuICogQHBhcmFtICB7T2JqZWN0fSBkMiAgICAgRW5kIGRhdGUgb2JqZWN0LlxuICogQHBhcmFtICB7SW50ZWdlcn0gdG9sZXJhbmNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICBUaGUgcmVzdWx0aW5nIHRpbWUgY29udGV4dC5cbiAqL1xuZnVuY3Rpb24gdGltZURpZmYoZDEsIGQyLCB0b2xlcmFuY2UpIHtcblxuICB2YXIgZGlmZiA9IGQyIC0gZDEsXG4gICAgICB0aW1lID0gbmV3IFRpbWVPYmooKTtcblxuICAvLyByZXR1cm5pbmcgdGhlIGNvbnRleHRcbiAgaWYgKChkaWZmIC8gdGltZS55ZWFyKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJ5ZWFyc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS5tb250aCkgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwibW9udGhzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLndlZWspID4gdG9sZXJhbmNlKSB7IHJldHVybiBcIndlZWtzXCI7IH1cbiAgZWxzZSBpZiAoKGRpZmYgLyB0aW1lLmRheSkgPiB0b2xlcmFuY2UpIHsgcmV0dXJuIFwiZGF5c1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS5ob3VyKSA+IHRvbGVyYW5jZSkgeyByZXR1cm4gXCJob3Vyc1wiOyB9XG4gIGVsc2UgaWYgKChkaWZmIC8gdGltZS5taW4pID4gdG9sZXJhbmNlKSB7IHJldHVybiBcIm1pbnV0ZXNcIjsgfVxuICBlbHNlIHsgcmV0dXJuIFwiZGF5c1wiOyB9XG4gIC8vIGlmIG5vbmUgb2YgdGhlc2Ugd29yayBpIGZlZWwgYmFkIGZvciB5b3Ugc29uXG4gIC8vIGkndmUgZ290IDk5IHByb2JsZW1zIGJ1dCBhbiBpZi9lbHNlIGFpblwidCBvbmVcblxufVxuXG4vKipcbiAqIEdpdmVuIGEgZGF0YXNldCwgZmlndXJlIG91dCB3aGF0IHRoZSB0aW1lIGNvbnRleHQgaXMgYW5kXG4gKiB3aGF0IHRoZSBudW1iZXIgb2YgdGltZSB1bml0cyBlbGFwc2VkIGlzXG4gKiBAcGFyYW0gIHtBcnJheX0gZGF0YVxuICogQHJldHVybiB7SW50ZWdlcn1cbiAqL1xuZnVuY3Rpb24gdGltZUludGVydmFsKGRhdGEpIHtcblxuICB2YXIgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgZDEgPSBkYXRhWzBdLmtleSxcbiAgICAgIGQyID0gZGF0YVtkYXRhTGVuZ3RoIC0gMV0ua2V5O1xuXG4gIHZhciByZXQ7XG5cbiAgdmFyIGludGVydmFscyA9IFtcbiAgICB7IHR5cGU6IFwieWVhcnNcIiwgc3RlcDogMSB9LFxuICAgIHsgdHlwZTogXCJtb250aHNcIiwgc3RlcDogMyB9LCAvLyBxdWFydGVyc1xuICAgIHsgdHlwZTogXCJtb250aHNcIiwgc3RlcDogMSB9LFxuICAgIHsgdHlwZTogXCJkYXlzXCIsIHN0ZXA6IDEgfSxcbiAgICB7IHR5cGU6IFwiaG91cnNcIiwgc3RlcDogMSB9LFxuICAgIHsgdHlwZTogXCJtaW51dGVzXCIsIHN0ZXA6IDEgfVxuICBdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW50ZXJ2YWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGludGVydmFsQ2FuZGlkYXRlID0gZDMudGltZVtpbnRlcnZhbHNbaV0udHlwZV0oZDEsIGQyLCBpbnRlcnZhbHNbaV0uc3RlcCkubGVuZ3RoO1xuICAgIGlmIChpbnRlcnZhbENhbmRpZGF0ZSA+PSBkYXRhTGVuZ3RoIC0gMSkge1xuICAgICAgdmFyIHJldCA9IGludGVydmFsQ2FuZGlkYXRlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiByZXQ7XG5cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0cmFuc2Zvcm0gcG9zaXRpb24gb2YgYW4gZWxlbWVudCBhcyBhbiBhcnJheVxuICogQHBhcmFtICB7T2JqZWN0fSBub2RlXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gZ2V0VHJhbnNsYXRlWFkobm9kZSkge1xuICByZXR1cm4gZDMudHJhbnNmb3JtKGQzLnNlbGVjdChub2RlKS5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGU7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHRyYW5zbGF0ZSBzdGF0ZW1lbnQgYmVjYXVzZSBpdCdzIGFubm95aW5nIHRvIHR5cGUgb3V0XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHRyYW5zbGF0ZSh4LCB5KSB7XG4gICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLCBcIiArIHkgKyBcIilcIjtcbn1cblxuLyoqXG4gKiBUZXN0cyBmb3IgU1ZHIHN1cHBvcnQsIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3ZpbGphbWlzL2ZlYXR1cmUuanMvXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJvb3QgQSByZWZlcmVuY2UgdG8gdGhlIGJyb3dzZXIgd2luZG93IG9iamVjdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIHN2Z1Rlc3Qocm9vdCkge1xuICByZXR1cm4gISFyb290LmRvY3VtZW50ICYmICEhcm9vdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgISFyb290LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpLmNyZWF0ZVNWR1JlY3Q7XG59XG5cbi8qKlxuICogQ29uc3RydWN0cyB0aGUgQVdTIFVSTCBmb3IgYSBnaXZlbiBjaGFydCBJRC5cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFRodW1ibmFpbFBhdGgob2JqKSB7XG4gIHZhciBpbWdTZXR0aW5ncyA9IG9iai5pbWFnZTtcblxuICBpbWdTZXR0aW5ncy5idWNrZXQgPSByZXF1aXJlKFwiLi4vY29uZmlnL2VudlwiKTtcblxuICB2YXIgaWQgPSBvYmouaWQucmVwbGFjZShvYmoucHJlZml4LCBcIlwiKTtcblxuICByZXR1cm4gXCJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vXCIgKyBpbWdTZXR0aW5ncy5idWNrZXQgKyBcIi9cIiArIGltZ1NldHRpbmdzLmJhc2VfcGF0aCArIGlkICsgXCIvXCIgKyBpbWdTZXR0aW5ncy5maWxlbmFtZSArIFwiLlwiICsgaW1nU2V0dGluZ3MuZXh0ZW5zaW9uO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgY2hhcnQgb2JqZWN0IGFuZCBjb250YWluZXIsIGdlbmVyYXRlIGFuZCBhcHBlbmQgYSB0aHVtYm5haWxcbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVUaHVtYihjb250YWluZXIsIG9iaiwgc2V0dGluZ3MpIHtcblxuICB2YXIgaW1nU2V0dGluZ3MgPSBzZXR0aW5ncy5pbWFnZTtcblxuICB2YXIgY29udCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKSxcbiAgICAgIGZhbGxiYWNrID0gY29udC5xdWVyeVNlbGVjdG9yKFwiLlwiICsgc2V0dGluZ3MucHJlZml4ICsgXCJiYXNlNjRpbWdcIik7XG5cbiAgaWYgKGltZ1NldHRpbmdzICYmIGltZ1NldHRpbmdzLmVuYWJsZSAmJiBvYmouZGF0YS5pZCkge1xuXG4gICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgZ2V0VGh1bWJuYWlsUGF0aChvYmopKTtcbiAgICBpbWcuc2V0QXR0cmlidXRlKCdhbHQnLCBvYmouZGF0YS5oZWFkaW5nKTtcbiAgICBpbWcuc2V0QXR0cmlidXRlKCdjbGFzcycsIHNldHRpbmdzLnByZWZpeCArIFwidGh1bWJuYWlsXCIpO1xuXG4gICAgY29udC5hcHBlbmRDaGlsZChpbWcpO1xuXG4gIH0gZWxzZSBpZiAoZmFsbGJhY2spIHtcblxuICAgIGZhbGxiYWNrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBjc3ZUb1RhYmxlKHRhcmdldCwgZGF0YSkge1xuICB2YXIgcGFyc2VkQ1NWID0gZDMuY3N2LnBhcnNlUm93cyhkYXRhKTtcblxuICB0YXJnZXQuYXBwZW5kKFwidGFibGVcIikuc2VsZWN0QWxsKFwidHJcIilcbiAgICAuZGF0YShwYXJzZWRDU1YpLmVudGVyKClcbiAgICAuYXBwZW5kKFwidHJcIikuc2VsZWN0QWxsKFwidGRcIilcbiAgICAuZGF0YShmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KS5lbnRlcigpXG4gICAgLmFwcGVuZChcInRkXCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWJvdW5jZTogZGVib3VuY2UsXG4gIGNsZWFyQ2hhcnQ6IGNsZWFyQ2hhcnQsXG4gIGNsZWFyT2JqOiBjbGVhck9iaixcbiAgY2xlYXJEcmF3bjogY2xlYXJEcmF3bixcbiAgZ2V0Qm91bmRpbmc6IGdldEJvdW5kaW5nLFxuICBUaW1lT2JqOiBUaW1lT2JqLFxuICB3cmFwVGV4dDogd3JhcFRleHQsXG4gIHRpbWVEaWZmOiB0aW1lRGlmZixcbiAgdGltZUludGVydmFsOiB0aW1lSW50ZXJ2YWwsXG4gIGdldFRyYW5zbGF0ZVhZOiBnZXRUcmFuc2xhdGVYWSxcbiAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gIHN2Z1Rlc3Q6IHN2Z1Rlc3QsXG4gIGdldFRodW1ibmFpbFBhdGg6IGdldFRodW1ibmFpbFBhdGgsXG4gIGdlbmVyYXRlVGh1bWI6IGdlbmVyYXRlVGh1bWIsXG4gIGNzdlRvVGFibGU6IGNzdlRvVGFibGUsXG4gIGRhdGFQYXJzZTogcmVxdWlyZShcIi4vZGF0YXBhcnNlXCIpLFxuICBmYWN0b3J5OiByZXF1aXJlKFwiLi9mYWN0b3J5XCIpXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy91dGlscy91dGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHMzX2J1Y2tldCBpcyBkZWZpbmVkIGluIHdlYnBhY2suY29uZmlnLmpzXG5tb2R1bGUuZXhwb3J0cyA9IHMzX2J1Y2tldDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY29uZmlnL2Vudi5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogRGF0YSBwYXJzaW5nIG1vZHVsZS4gVGFrZXMgYSBDU1YgYW5kIHR1cm5zIGl0IGludG8gYW4gT2JqZWN0LCBhbmQgb3B0aW9uYWxseSBkZXRlcm1pbmVzIHRoZSBmb3JtYXR0aW5nIHRvIHVzZSB3aGVuIHBhcnNpbmcgZGF0ZXMuXG4gKiBAbW9kdWxlIHV0aWxzL2RhdGFwYXJzZVxuICogQHNlZSBtb2R1bGU6dXRpbHMvZmFjdG9yeVxuICovXG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc2NhbGUgcmV0dXJucyBhbiBpbnB1dCBkYXRlIG9yIG5vdC5cbiAqIEBwYXJhbSAge1N0cmluZ30gc2NhbGVUeXBlICAgICAgVGhlIHR5cGUgb2Ygc2NhbGUuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGRlZmF1bHRGb3JtYXQgIEZvcm1hdCBzZXQgYnkgdGhlIGNoYXJ0IHRvb2wgc2V0dGluZ3MuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGRlY2xhcmVkRm9ybWF0IEZvcm1hdCBwYXNzZWQgYnkgdGhlIGNoYXJ0IGVtYmVkIGNvZGUsIGlmIHRoZXJlIGlzIG9uZVxuICogQHJldHVybiB7U3RyaW5nfFVuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gaW5wdXREYXRlKHNjYWxlVHlwZSwgZGVmYXVsdEZvcm1hdCwgZGVjbGFyZWRGb3JtYXQpIHtcblxuICBpZiAoc2NhbGVUeXBlID09PSBcInRpbWVcIiB8fCBzY2FsZVR5cGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICByZXR1cm4gZGVjbGFyZWRGb3JtYXQgfHwgZGVmYXVsdEZvcm1hdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBDU1Ygc3RyaW5nIHVzaW5nIGQzLmNzdi5wYXJzZSgpIGFuZCB0dXJucyBpdCBpbnRvIGFuIGFycmF5IG9mIG9iamVjdHMuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGNzdiAgICAgICAgICAgICBDU1Ygc3RyaW5nIHRvIGJlIHBhcnNlZFxuICogQHBhcmFtICB7U3RyaW5nIGlucHV0RGF0ZUZvcm1hdCBEYXRlIGZvcm1hdCBpbiBEMyBzdHJmdGltZSBzdHlsZSwgaWYgdGhlcmUgaXMgb25lXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGluZGV4ICAgICAgICAgICBWYWx1ZSB0byBpbmRleCB0aGUgZGF0YSB0bywgaWYgdGhlcmUgaXMgb25lXG4gKiBAcmV0dXJuIHsge2NzdjogU3RyaW5nLCBkYXRhOiBBcnJheSwgc2VyaWVzQW1vdW50OiBJbnRlZ2VyLCBrZXlzOiBBcnJheX0gfSAgICAgICAgICAgICAgICAgQW4gb2JqZWN0IHdpdGggdGhlIG9yaWdpbmFsIENTViBzdHJpbmcsIHRoZSBuZXdseS1mb3JtYXR0ZWQgZGF0YSwgdGhlIG51bWJlciBvZiBzZXJpZXMgaW4gdGhlIGRhdGEgYW5kIGFuIGFycmF5IG9mIGtleXMgdXNlZC5cbiAqL1xuZnVuY3Rpb24gcGFyc2UoY3N2LCBpbnB1dERhdGVGb3JtYXQsIGluZGV4LCBzdGFja2VkLCB0eXBlKSB7XG5cbiAgdmFyIGtleXMsIHZhbDtcblxuICB2YXIgZmlyc3RWYWxzID0ge307XG5cbiAgdmFyIGRhdGEgPSBkMy5jc3YucGFyc2UoY3N2LCBmdW5jdGlvbihkLCBpKSB7XG5cbiAgICB2YXIgb2JqID0ge307XG5cbiAgICBpZiAoaSA9PT0gMCkgeyBrZXlzID0gZDMua2V5cyhkKTsgfVxuXG4gICAgaWYgKGlucHV0RGF0ZUZvcm1hdCkge1xuICAgICAgdmFyIGRhdGVGb3JtYXQgPSBkMy50aW1lLmZvcm1hdChpbnB1dERhdGVGb3JtYXQpO1xuICAgICAgb2JqLmtleSA9IGRhdGVGb3JtYXQucGFyc2UoZDMudmFsdWVzKGQpWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqLmtleSA9IGQzLnZhbHVlcyhkKVswXTtcbiAgICB9XG5cbiAgICBvYmouc2VyaWVzID0gW107XG5cbiAgICBmb3IgKHZhciBqID0gMTsgaiA8IGQzLmtleXMoZCkubGVuZ3RoOyBqKyspIHtcblxuICAgICAgdmFyIGtleSA9IGQzLmtleXMoZClbal07XG5cbiAgICAgIGlmIChkW2tleV0gPT09IDAgfHwgZFtrZXldID09PSBcIlwiKSB7XG4gICAgICAgIGRba2V5XSA9IFwiX191bmRlZmluZWRfX1wiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5kZXgpIHtcblxuICAgICAgICBpZiAoaSA9PT0gMCAmJiAhZmlyc3RWYWxzW2tleV0pIHtcbiAgICAgICAgICBmaXJzdFZhbHNba2V5XSA9IGRba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCA9PT0gXCIwXCIpIHtcbiAgICAgICAgICB2YWwgPSAoKGRba2V5XSAvIGZpcnN0VmFsc1trZXldKSAtIDEpICogMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbCA9IChkW2tleV0gLyBmaXJzdFZhbHNba2V5XSkgKiBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBkW2tleV07XG4gICAgICB9XG5cbiAgICAgIG9iai5zZXJpZXMucHVzaCh7XG4gICAgICAgIHZhbDogdmFsLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuXG4gIH0pO1xuXG4gIHZhciBzZXJpZXNBbW91bnQgPSBkYXRhWzBdLnNlcmllcy5sZW5ndGg7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJzdHJlYW1cIikge1xuICAgICAgdmFyIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKCkub2Zmc2V0KFwic2lsaG91ZXR0ZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrID0gZDMubGF5b3V0LnN0YWNrKCk7XG4gICAgfVxuICAgIHZhciBzdGFja2VkRGF0YSA9IHN0YWNrKGQzLnJhbmdlKHNlcmllc0Ftb3VudCkubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsZWdlbmQ6IGtleXNba2V5ICsgMV0sXG4gICAgICAgICAgeDogZC5rZXksXG4gICAgICAgICAgeTogTnVtYmVyKGQuc2VyaWVzW2tleV0udmFsKSxcbiAgICAgICAgICByYXc6IGRcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3N2OiBjc3YsXG4gICAgZGF0YTogZGF0YSxcbiAgICBzZXJpZXNBbW91bnQ6IHNlcmllc0Ftb3VudCxcbiAgICBrZXlzOiBrZXlzLFxuICAgIHN0YWNrZWREYXRhOiBzdGFja2VkRGF0YSB8fCB1bmRlZmluZWRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXREYXRlOiBpbnB1dERhdGUsXG4gIHBhcnNlOiBwYXJzZVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvdXRpbHMvZGF0YXBhcnNlLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBSZWNpcGUgZmFjdG9yIGZhY3RvcnkgbW9kdWxlLlxuICogQG1vZHVsZSB1dGlscy9mYWN0b3J5XG4gKiBAc2VlIG1vZHVsZTpjaGFydHMvaW5kZXhcbiAqL1xuXG4vKipcbiAqIEdpdmVuIGEgXCJyZWNpcGVcIiBvZiBzZXR0aW5ncyBmb3IgYSBjaGFydCwgcGF0Y2ggaXQgd2l0aCBhbiBvYmplY3QgYW5kIHBhcnNlIHRoZSBkYXRhIGZvciB0aGUgY2hhcnQuXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZpbmFsIGNoYXJ0IHJlY2lwZS5cbiAqL1xuZnVuY3Rpb24gUmVjaXBlRmFjdG9yeShzZXR0aW5ncywgb2JqKSB7XG4gIHZhciBkYXRhUGFyc2UgPSByZXF1aXJlKFwiLi9kYXRhcGFyc2VcIik7XG4gIHZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvaGVscGVyc1wiKTtcblxuICB2YXIgdCA9IGhlbHBlcnMuZXh0ZW5kKHNldHRpbmdzKTsgLy8gc2hvcnQgZm9yIHRlbXBsYXRlXG5cbiAgdmFyIGVtYmVkID0gb2JqLmRhdGE7XG4gIHZhciBjaGFydCA9IGVtYmVkLmNoYXJ0O1xuXG4gIC8vIEknbSBub3QgYSBiaWcgZmFuIG9mIGluZGVudGluZyBzdHVmZiBsaWtlIHRoaXNcbiAgLy8gKGxvb2tpbmcgYXQgeW91LCBQZXJlaXJhKSwgYnV0IEknbSBtYWtpbmcgYW4gZXhjZXB0aW9uXG4gIC8vIGluIHRoaXMgY2FzZSBiZWNhdXNlIG15IGV5ZXMgd2VyZSBibGVlZGluZy5cblxuICB0LmRpc3BhdGNoICAgICAgICAgPSBvYmouZGlzcGF0Y2g7XG5cbiAgdC52ZXJzaW9uICAgICAgICAgID0gZW1iZWQudmVyc2lvbiAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC52ZXJzaW9uO1xuICB0LmlkICAgICAgICAgICAgICAgPSBvYmouaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmlkO1xuICB0LmhlYWRpbmcgICAgICAgICAgPSBlbWJlZC5oZWFkaW5nICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmhlYWRpbmc7XG4gIHQucXVhbGlmaWVyICAgICAgICA9IGVtYmVkLnF1YWxpZmllciAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQucXVhbGlmaWVyO1xuICB0LnNvdXJjZSAgICAgICAgICAgPSBlbWJlZC5zb3VyY2UgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnNvdXJjZTtcbiAgdC5kZWNrICAgICAgICAgICAgID0gZW1iZWQuZGVjayAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5kZWNrXG4gIHQuY3VzdG9tQ2xhc3MgICAgICA9IGNoYXJ0LmNsYXNzICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuY3VzdG9tQ2xhc3M7XG5cbiAgdC54QXhpcyAgICAgICAgICAgID0gaGVscGVycy5leHRlbmQodC54QXhpcywgY2hhcnQueF9heGlzKSAgfHwgdC54QXhpcztcbiAgdC55QXhpcyAgICAgICAgICAgID0gaGVscGVycy5leHRlbmQodC55QXhpcywgY2hhcnQueV9heGlzKSAgfHwgdC55QXhpcztcblxuICB2YXIgbyA9IHQub3B0aW9ucyxcbiAgICAgIGNvID0gY2hhcnQub3B0aW9ucztcblxuICAvLyAgXCJvcHRpb25zXCIgYXJlYSBvZiBlbWJlZCBjb2RlXG4gIG8udHlwZSAgICAgICAgICAgICA9IGNoYXJ0Lm9wdGlvbnMudHlwZSAgICAgICAgICAgICAgICAgICAgIHx8IG8udHlwZTtcbiAgby5pbnRlcnBvbGF0aW9uICAgID0gY2hhcnQub3B0aW9ucy5pbnRlcnBvbGF0aW9uICAgICAgICAgICAgfHwgby5pbnRlcnBvbGF0aW9uO1xuXG4gIG8uc29jaWFsICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zb2NpYWwpID09PSB0cnVlID8gY28uc29jaWFsICAgICAgICAgICA6IG8uc29jaWFsO1xuICBvLnNoYXJlX2RhdGEgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnNoYXJlX2RhdGEpID09PSB0cnVlID8gY28uc2hhcmVfZGF0YSAgOiBvLnNoYXJlX2RhdGE7XG4gIG8uc3RhY2tlZCAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5zdGFja2VkKSA9PT0gdHJ1ZSA/IGNvLnN0YWNrZWQgICAgICAgICA6IG8uc3RhY2tlZDtcbiAgby5leHBhbmRlZCAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmV4cGFuZGVkKSA9PT0gdHJ1ZSA/IGNvLmV4cGFuZGVkICAgICAgIDogby5leHBhbmRlZDtcbiAgby5oZWFkICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmhlYWQpID09PSB0cnVlID8gY28uaGVhZCAgICAgICAgICAgICAgIDogby5oZWFkO1xuICBvLmRlY2sgICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uZGVjaykgPT09IHRydWUgPyBjby5kZWNrICAgICAgICAgICAgICAgOiBvLmRlY2s7XG4gIG8ubGVnZW5kICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby5sZWdlbmQpID09PSB0cnVlID8gY28ubGVnZW5kICAgICAgICAgICA6IG8ubGVnZW5kO1xuICBvLnF1YWxpZmllciAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ucXVhbGlmaWVyKSA9PT0gdHJ1ZSA/IGNvLnF1YWxpZmllciAgICAgOiBvLnF1YWxpZmllcjtcbiAgby5mb290ZXIgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmZvb3RlcikgPT09IHRydWUgPyBjby5mb290ZXIgICAgICAgICAgIDogby5mb290ZXI7XG4gIG8ueF9heGlzICAgICAgPSAhaGVscGVycy5pc1VuZGVmaW5lZChjby54X2F4aXMpID09PSB0cnVlID8gY28ueF9heGlzICAgICAgICAgICA6IG8ueF9heGlzO1xuICBvLnlfYXhpcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ueV9heGlzKSA9PT0gdHJ1ZSA/IGNvLnlfYXhpcyAgICAgICAgICAgOiBvLnlfYXhpcztcbiAgby50aXBzICAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLnRpcHMpID09PSB0cnVlID8gY28udGlwcyAgICAgICAgICAgICAgIDogby50aXBzO1xuICBvLmFubm90YXRpb25zID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uYW5ub3RhdGlvbnMpID09PSB0cnVlID8gY28uYW5ub3RhdGlvbnMgOiBvLmFubm90YXRpb25zO1xuICBvLnJhbmdlICAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28ucmFuZ2UpID09PSB0cnVlID8gY28ucmFuZ2UgICAgICAgICAgICAgOiBvLnJhbmdlO1xuICBvLnNlcmllcyAgICAgID0gIWhlbHBlcnMuaXNVbmRlZmluZWQoY28uc2VyaWVzKSA9PT0gdHJ1ZSA/IGNvLnNlcmllcyAgICAgICAgICAgOiBvLnNlcmllcztcbiAgby5pbmRleCAgICAgICA9ICFoZWxwZXJzLmlzVW5kZWZpbmVkKGNvLmluZGV4ZWQpID09PSB0cnVlID8gY28uaW5kZXhlZCAgICAgICAgIDogby5pbmRleDtcblxuICAvLyAgdGhlc2UgYXJlIHNwZWNpZmljIHRvIHRoZSB0IG9iamVjdCBhbmQgZG9uJ3QgZXhpc3QgaW4gdGhlIGVtYmVkXG4gIHQuYmFzZUNsYXNzICAgICAgICA9IGVtYmVkLmJhc2VDbGFzcyAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuYmFzZUNsYXNzO1xuXG4gIHQuZGltZW5zaW9ucy53aWR0aCA9IGVtYmVkLndpZHRoICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHQuZGltZW5zaW9ucy53aWR0aDtcblxuICB0LnByZWZpeCAgICAgICAgICAgPSBjaGFydC5wcmVmaXggICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LnByZWZpeDtcbiAgdC5leHBvcnRhYmxlICAgICAgID0gY2hhcnQuZXhwb3J0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgfHwgdC5leHBvcnRhYmxlO1xuICB0LmVkaXRhYmxlICAgICAgICAgPSBjaGFydC5lZGl0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmVkaXRhYmxlO1xuXG4gIGlmICh0LmV4cG9ydGFibGUpIHtcbiAgICB0LmRpbWVuc2lvbnMud2lkdGggPSBjaGFydC5leHBvcnRhYmxlLndpZHRoIHx8IGVtYmVkLndpZHRoIHx8IHQuZGltZW5zaW9ucy53aWR0aDtcbiAgICB0LmRpbWVuc2lvbnMuaGVpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBjaGFydC5leHBvcnRhYmxlLmhlaWdodDsgfVxuICAgIHQuZGltZW5zaW9ucy5tYXJnaW4gPSBjaGFydC5leHBvcnRhYmxlLm1hcmdpbiB8fCB0LmRpbWVuc2lvbnMubWFyZ2luO1xuICB9XG5cbiAgaWYgKGNoYXJ0Lmhhc0hvdXJzKSB7IHQuZGF0ZUZvcm1hdCArPSBcIiBcIiArIHQudGltZUZvcm1hdDsgfVxuICB0Lmhhc0hvdXJzICAgICAgICAgPSBjaGFydC5oYXNIb3VycyAgICAgICAgICAgICAgICAgICAgICAgICB8fCB0Lmhhc0hvdXJzO1xuICB0LmRhdGVGb3JtYXQgICAgICAgPSBjaGFydC5kYXRlRm9ybWF0ICAgICAgICAgICAgICAgICAgICAgICB8fCB0LmRhdGVGb3JtYXQ7XG5cbiAgdC5kYXRlRm9ybWF0ID0gZGF0YVBhcnNlLmlucHV0RGF0ZSh0LnhBeGlzLnNjYWxlLCB0LmRhdGVGb3JtYXQsIGNoYXJ0LmRhdGVfZm9ybWF0KTtcbiAgdC5kYXRhID0gZGF0YVBhcnNlLnBhcnNlKGNoYXJ0LmRhdGEsIHQuZGF0ZUZvcm1hdCwgby5pbmRleCwgby5zdGFja2VkLCBvLnR5cGUpIHx8IHQuZGF0YTtcblxuICByZXR1cm4gdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY2lwZUZhY3Rvcnk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL3V0aWxzL2ZhY3RvcnkuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEhlbHBlcnMgdGhhdCBtYW5pcHVsYXRlIGFuZCBjaGVjayBwcmltaXRpdmVzLiBOb3RoaW5nIEQzLXNwZWNpZmljIGhlcmUuXG4gKiBAbW9kdWxlIGhlbHBlcnMvaGVscGVyc1xuICovXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzSW50ZWdlcih4KSB7XG4gIHJldHVybiB4ICUgMSA9PT0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdmFsdWUgaXMgYSBmbG9hdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRmxvYXQobikge1xuICByZXR1cm4gbiA9PT0gK24gJiYgbiAhPT0gKG58MCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgdmFsdWUgaXMgZW1wdHkuIFdvcmtzIGZvciBPYmplY3RzLCBBcnJheXMsIFN0cmluZ3MgYW5kIEludGVnZXJzLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWwpIHtcbiAgaWYgKHZhbC5jb25zdHJ1Y3RvciA9PSBPYmplY3QpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHZhbCkge1xuICAgICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAodmFsLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG4gICAgcmV0dXJuICF2YWwubGVuZ3RoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAhdmFsO1xuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIGNoZWNrIGZvciB3aGV0aGVyIGEgdmFsdWUgaXMgdW5kZWZpbmVkIG9yIG5vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gYXJyYXlzLCByZXR1cm5zIG9ubHkgdW5pcXVlIHZhbHVlcyBpbiB0aG9zZSBhcnJheXMuXG4gKiBAcGFyYW0gIHtBcnJheX0gYTFcbiAqIEBwYXJhbSAge0FycmF5fSBhMlxuICogQHJldHVybiB7QXJyYXl9ICAgIEFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RGlmZihhMSwgYTIpIHtcbiAgdmFyIG8xID0ge30sIG8yID0ge30sIGRpZmY9IFtdLCBpLCBsZW4sIGs7XG4gIGZvciAoaSA9IDAsIGxlbiA9IGExLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7IG8xW2ExW2ldXSA9IHRydWU7IH1cbiAgZm9yIChpID0gMCwgbGVuID0gYTIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsgbzJbYTJbaV1dID0gdHJ1ZTsgfVxuICBmb3IgKGsgaW4gbzEpIHsgaWYgKCEoayBpbiBvMikpIHsgZGlmZi5wdXNoKGspOyB9IH1cbiAgZm9yIChrIGluIG8yKSB7IGlmICghKGsgaW4gbzEpKSB7IGRpZmYucHVzaChrKTsgfSB9XG4gIHJldHVybiBkaWZmO1xufVxuXG4vKipcbiAqIE9wcG9zaXRlIG9mIGFycmF5RGlmZigpLCB0aGlzIHJldHVybnMgb25seSBjb21tb24gZWxlbWVudHMgYmV0d2VlbiBhcnJheXMuXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyMVxuICogQHBhcmFtICB7QXJyYXl9IGFycjJcbiAqIEByZXR1cm4ge0FycmF5fSAgICAgIEFycmF5IG9mIGNvbW1vbiB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U2FtZShhMSwgYTIpIHtcbiAgdmFyIHJldCA9IFtdO1xuICBmb3IgKGkgaW4gYTEpIHtcbiAgICBpZiAoYTIuaW5kZXhPZiggYTFbaV0gKSA+IC0xKXtcbiAgICAgIHJldC5wdXNoKCBhMVtpXSApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgJ2Zyb20nIG9iamVjdCB3aXRoIG1lbWJlcnMgZnJvbSAndG8nLiBJZiAndG8nIGlzIG51bGwsIGEgZGVlcCBjbG9uZSBvZiAnZnJvbScgaXMgcmV0dXJuZWRcbiAqIEBwYXJhbSAgeyp9IGZyb21cbiAqIEBwYXJhbSAgeyp9IHRvXG4gKiBAcmV0dXJuIHsqfSAgICAgIENsb25lZCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChmcm9tLCB0bykge1xuICBpZiAoZnJvbSA9PSBudWxsIHx8IHR5cGVvZiBmcm9tICE9IFwib2JqZWN0XCIpIHJldHVybiBmcm9tO1xuICBpZiAoZnJvbS5jb25zdHJ1Y3RvciAhPSBPYmplY3QgJiYgZnJvbS5jb25zdHJ1Y3RvciAhPSBBcnJheSkgcmV0dXJuIGZyb207XG4gIGlmIChmcm9tLmNvbnN0cnVjdG9yID09IERhdGUgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBSZWdFeHAgfHwgZnJvbS5jb25zdHJ1Y3RvciA9PSBGdW5jdGlvbiB8fFxuICAgIGZyb20uY29uc3RydWN0b3IgPT0gU3RyaW5nIHx8IGZyb20uY29uc3RydWN0b3IgPT0gTnVtYmVyIHx8IGZyb20uY29uc3RydWN0b3IgPT0gQm9vbGVhbilcbiAgICByZXR1cm4gbmV3IGZyb20uY29uc3RydWN0b3IoZnJvbSk7XG5cbiAgdG8gPSB0byB8fCBuZXcgZnJvbS5jb25zdHJ1Y3RvcigpO1xuXG4gIGZvciAodmFyIG5hbWUgaW4gZnJvbSkge1xuICAgIHRvW25hbWVdID0gdHlwZW9mIHRvW25hbWVdID09IFwidW5kZWZpbmVkXCIgPyBleHRlbmQoZnJvbVtuYW1lXSwgbnVsbCkgOiB0b1tuYW1lXTtcbiAgfVxuXG4gIHJldHVybiB0bztcbn1cblxuLyoqXG4gKiBDb21wYXJlcyB0d28gb2JqZWN0cywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHVuaXF1ZSBrZXlzLlxuICogQHBhcmFtICB7T2JqZWN0fSBvMVxuICogQHBhcmFtICB7T2JqZWN0fSBvMlxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUtleXMobzEsIG8yKSB7XG4gIHJldHVybiBhcnJheURpZmYoZDMua2V5cyhvMSksIGQzLmtleXMobzIpKTtcbn1cblxuLyoqXG4gKiBDb21wYXJlcyB0d28gb2JqZWN0cywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGNvbW1vbiBrZXlzLlxuICogQHBhcmFtICB7T2JqZWN0fSBvMVxuICogQHBhcmFtICB7T2JqZWN0fSBvMlxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHNhbWVLZXlzKG8xLCBvMikge1xuICByZXR1cm4gYXJyYXlTYW1lKGQzLmtleXMobzEpLCBkMy5rZXlzKG8yKSk7XG59XG5cbi8qKlxuICogSWYgYSBzdHJpbmcgaXMgdW5kZWZpbmVkLCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluc3RlYWQuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBjbGVhblN0cihzdHIpe1xuICBpZiAoc3RyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ludGVnZXI6IGlzSW50ZWdlcixcbiAgaXNGbG9hdDogaXNGbG9hdCxcbiAgaXNFbXB0eTogaXNFbXB0eSxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgYXJyYXlEaWZmOiBhcnJheURpZmYsXG4gIGFycmF5U2FtZTogYXJyYXlTYW1lLFxuICB1bmlxdWVLZXlzOiB1bmlxdWVLZXlzLFxuICBzYW1lS2V5czogc2FtZUtleXMsXG4gIGNsZWFuU3RyOiBjbGVhblN0clxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvaGVscGVycy9oZWxwZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDaGFydCBjb250cnVjdGlvbiBtYW5hZ2VyIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL21hbmFnZXJcbiAqL1xuXG4vKipcbiAqIE1hbmFnZXMgdGhlIHN0ZXAtYnktc3RlcCBjcmVhdGlvbiBvZiBhIGNoYXJ0LCBhbmQgcmV0dXJucyB0aGUgZnVsbCBjb25maWd1cmF0aW9uIGZvciB0aGUgY2hhcnQsIGluY2x1ZGluZyByZWZlcmVuY2VzIHRvIG5vZGVzLCBzY2FsZXMsIGF4ZXMsIGV0Yy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb250YWluZXIgU2VsZWN0b3IgZm9yIHRoZSBjb250YWluZXIgdGhlIGNoYXJ0IHdpbGwgYmUgZHJhd24gaW50by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogICAgICAgT2JqZWN0IHRoYXQgY29udGFpbnMgc2V0dGluZ3MgZm9yIHRoZSBjaGFydC5cbiAqL1xuZnVuY3Rpb24gQ2hhcnRNYW5hZ2VyKGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIFJlY2lwZSA9IHJlcXVpcmUoXCIuLi91dGlscy9mYWN0b3J5XCIpLFxuICAgICAgc2V0dGluZ3MgPSByZXF1aXJlKFwiLi4vY29uZmlnL2NoYXJ0LXNldHRpbmdzXCIpLFxuICAgICAgY29tcG9uZW50cyA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvY29tcG9uZW50c1wiKTtcblxuICB2YXIgY2hhcnRSZWNpcGUgPSBuZXcgUmVjaXBlKHNldHRpbmdzLCBvYmopO1xuXG4gIHZhciByZW5kZXJlZCA9IGNoYXJ0UmVjaXBlLnJlbmRlcmVkID0ge307XG5cbiAgLy8gY2hlY2sgdGhhdCBlYWNoIHNlY3Rpb24gaXMgbmVlZGVkXG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuaGVhZCkge1xuICAgIHJlbmRlcmVkLmhlYWRlciA9IGNvbXBvbmVudHMuaGVhZGVyKGNvbnRhaW5lciwgY2hhcnRSZWNpcGUpO1xuICB9XG5cbiAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuZm9vdGVyKSB7XG4gICAgcmVuZGVyZWQuZm9vdGVyID0gY29tcG9uZW50cy5mb290ZXIoY29udGFpbmVyLCBjaGFydFJlY2lwZSk7XG4gIH1cblxuICB2YXIgbm9kZSA9IGNvbXBvbmVudHMuYmFzZShjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcblxuICByZW5kZXJlZC5jb250YWluZXIgPSBub2RlO1xuXG4gIHJlbmRlcmVkLnBsb3QgPSBjb21wb25lbnRzLnBsb3Qobm9kZSwgY2hhcnRSZWNpcGUpO1xuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnF1YWxpZmllcikge1xuICAgIHJlbmRlcmVkLnF1YWxpZmllciA9IGNvbXBvbmVudHMucXVhbGlmaWVyKG5vZGUsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmIChjaGFydFJlY2lwZS5vcHRpb25zLnRpcHMpIHtcbiAgICByZW5kZXJlZC50aXBzID0gY29tcG9uZW50cy50aXBzKG5vZGUsIGNoYXJ0UmVjaXBlKTtcbiAgfVxuXG4gIGlmICghY2hhcnRSZWNpcGUuZWRpdGFibGUgJiYgIWNoYXJ0UmVjaXBlLmV4cG9ydGFibGUpIHtcbiAgICBpZiAoY2hhcnRSZWNpcGUub3B0aW9ucy5zaGFyZV9kYXRhKSB7XG4gICAgICByZW5kZXJlZC5zaGFyZURhdGEgPSBjb21wb25lbnRzLnNoYXJlRGF0YShjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgICB9XG4gICAgaWYgKGNoYXJ0UmVjaXBlLm9wdGlvbnMuc29jaWFsKSB7XG4gICAgICByZW5kZXJlZC5zb2NpYWwgPSBjb21wb25lbnRzLnNvY2lhbChjb250YWluZXIsIGNoYXJ0UmVjaXBlKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY2hhcnRSZWNpcGUuQ1VTVE9NKSB7XG4gICAgdmFyIGN1c3RvbSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jdXN0b20vY3VzdG9tLmpzXCIpO1xuICAgIHJlbmRlcmVkLmN1c3RvbSA9IGN1c3RvbShub2RlLCBjaGFydFJlY2lwZSwgcmVuZGVyZWQpO1xuICB9XG5cbiAgcmV0dXJuIGNoYXJ0UmVjaXBlO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0TWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL21hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgY29tcG9uZW50cyA9IHtcbiAgYmFzZTogcmVxdWlyZShcIi4vYmFzZVwiKSxcbiAgaGVhZGVyOiByZXF1aXJlKFwiLi9oZWFkZXJcIiksXG4gIGZvb3RlcjogcmVxdWlyZShcIi4vZm9vdGVyXCIpLFxuICBwbG90OiByZXF1aXJlKFwiLi9wbG90XCIpLFxuICBxdWFsaWZpZXI6IHJlcXVpcmUoXCIuL3F1YWxpZmllclwiKSxcbiAgYXhpczogcmVxdWlyZShcIi4vYXhpc1wiKSxcbiAgc2NhbGU6IHJlcXVpcmUoXCIuL3NjYWxlXCIpLFxuICB0aXBzOiByZXF1aXJlKFwiLi90aXBzXCIpLFxuICBzb2NpYWw6IHJlcXVpcmUoXCIuL3NvY2lhbFwiKSxcbiAgc2hhcmVEYXRhOiByZXF1aXJlKFwiLi9zaGFyZS1kYXRhXCIpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudHM7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2NvbXBvbmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gYXBwZW5kKGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIG1hcmdpbiA9IG9iai5kaW1lbnNpb25zLm1hcmdpbjtcblxuICB2YXIgY2hhcnRCYXNlID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuaW5zZXJ0KFwic3ZnXCIsIFwiLlwiICsgb2JqLnByZWZpeCArIFwiY2hhcnRfc291cmNlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmouYmFzZUNsYXNzKCkgKyBcIl9zdmcgXCIgKyBvYmoucHJlZml4ICsgb2JqLmN1c3RvbUNsYXNzICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJ0eXBlX1wiICsgb2JqLm9wdGlvbnMudHlwZSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwic2VyaWVzLVwiICsgb2JqLmRhdGEuc2VyaWVzQW1vdW50LFxuICAgICAgXCJ3aWR0aFwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCxcbiAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSxcbiAgICAgIFwidmVyc2lvblwiOiAxLjEsXG4gICAgICBcInhtbG5zXCI6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgIH0pO1xuXG4gIC8vIGJhY2tncm91bmQgcmVjdFxuICBjaGFydEJhc2VcbiAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiYmdcIixcbiAgICAgIFwieFwiOiAwLFxuICAgICAgXCJ5XCI6IDAsXG4gICAgICBcIndpZHRoXCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSxcbiAgICAgIFwiaGVpZ2h0XCI6IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCksXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCJcbiAgICB9KTtcblxuICB2YXIgZ3JhcGggPSBjaGFydEJhc2UuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiZ3JhcGhcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIlxuICAgIH0pO1xuXG4gIHJldHVybiBncmFwaDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGVuZDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBoZWFkZXJDb21wb25lbnQoY29udGFpbmVyLCBvYmopIHtcblxuICB2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIik7XG5cbiAgdmFyIGhlYWRlckdyb3VwID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiY2hhcnRfdGl0bGUgXCIgKyBvYmoucHJlZml4ICsgb2JqLmN1c3RvbUNsYXNzLCB0cnVlKVxuXG4gIC8vIGhhY2sgbmVjZXNzYXJ5IHRvIGVuc3VyZSBQREYgZmllbGRzIGFyZSBzaXplZCBwcm9wZXJseVxuICBpZiAob2JqLmV4cG9ydGFibGUpIHtcbiAgICBoZWFkZXJHcm91cC5zdHlsZShcIndpZHRoXCIsIG9iai5leHBvcnRhYmxlLndpZHRoICsgXCJweFwiKTtcbiAgfVxuXG4gIGlmIChvYmouaGVhZGluZyAhPT0gXCJcIiB8fCBvYmouZWRpdGFibGUpIHtcbiAgICB2YXIgaGVhZGVyVGV4dCA9IGhlYWRlckdyb3VwXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3RpdGxlLXRleHRcIilcbiAgICAgIC50ZXh0KG9iai5oZWFkaW5nKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcbiAgICAgIGhlYWRlclRleHRcbiAgICAgICAgLmF0dHIoXCJjb250ZW50RWRpdGFibGVcIiwgdHJ1ZSlcbiAgICAgICAgLmNsYXNzZWQoXCJlZGl0YWJsZS1jaGFydF90aXRsZVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgfVxuXG4gIHZhciBxdWFsaWZpZXI7XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwiYmFyXCIpIHtcbiAgICBxdWFsaWZpZXIgPSBoZWFkZXJHcm91cFxuICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBzdHIgPSBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXIgXCIgKyBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXItYmFyXCI7XG4gICAgICAgICAgaWYgKG9iai5lZGl0YWJsZSkge1xuICAgICAgICAgICAgc3RyICs9IFwiIGVkaXRhYmxlLWNoYXJ0X3F1YWxpZmllclwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9LFxuICAgICAgICBcImNvbnRlbnRFZGl0YWJsZVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLmVkaXRhYmxlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnRleHQob2JqLnF1YWxpZmllcik7XG4gIH1cblxuICBpZiAob2JqLmRhdGEua2V5cy5sZW5ndGggPiAyKSB7XG5cbiAgICB2YXIgbGVnZW5kID0gaGVhZGVyR3JvdXAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9sZWdlbmRcIiwgdHJ1ZSk7XG5cbiAgICB2YXIga2V5cyA9IGhlbHBlcnMuZXh0ZW5kKG9iai5kYXRhLmtleXMpO1xuXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgZmlyc3QgaXRlbSBhcyBpdCBkb2VzbnQgcmVwcmVzZW50IGEgc2VyaWVzXG4gICAga2V5cy5zaGlmdCgpO1xuXG4gICAgaWYgKG9iai5vcHRpb25zLnR5cGUgPT09IFwibXVsdGlsaW5lXCIpIHtcbiAgICAgIGtleXMgPSBba2V5c1swXSwga2V5c1sxXV07XG4gICAgICBsZWdlbmQuY2xhc3NlZChvYmoucHJlZml4ICsgXCJjaGFydF9sZWdlbmQtXCIgKyBvYmoub3B0aW9ucy50eXBlLCB0cnVlKTtcbiAgICB9XG5cbiAgICB2YXIgbGVnZW5kSXRlbSA9IGxlZ2VuZC5zZWxlY3RBbGwoXCJkaXYuXCIgKyBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbVwiKVxuICAgICAgLmRhdGEoa2V5cylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtIFwiICsgb2JqLnByZWZpeCArIFwibGVnZW5kX2l0ZW1fXCIgKyAoaSk7XG4gICAgICB9KTtcblxuICAgIGxlZ2VuZEl0ZW0uYXBwZW5kKFwic3BhblwiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJsZWdlbmRfaXRlbV9pY29uXCIpO1xuXG4gICAgbGVnZW5kSXRlbS5hcHBlbmQoXCJzcGFuXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX3RleHRcIilcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMuaGVhZGVySGVpZ2h0ID0gaGVhZGVyR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICByZXR1cm4ge1xuICAgIGhlYWRlckdyb3VwOiBoZWFkZXJHcm91cCxcbiAgICBsZWdlbmQ6IGxlZ2VuZCxcbiAgICBxdWFsaWZpZXI6IHF1YWxpZmllclxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGVhZGVyQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9oZWFkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gZm9vdGVyQ29tcG9uZW50KGNvbnRhaW5lciwgb2JqKSB7XG5cbiAgdmFyIGZvb3Rlckdyb3VwO1xuXG4gIGlmIChvYmouc291cmNlICE9PSBcIlwiIHx8IG9iai5lZGl0YWJsZSkge1xuICAgIGZvb3Rlckdyb3VwID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImNoYXJ0X3NvdXJjZVwiLCB0cnVlKTtcblxuICAgIC8vIGhhY2sgbmVjZXNzYXJ5IHRvIGVuc3VyZSBQREYgZmllbGRzIGFyZSBzaXplZCBwcm9wZXJseVxuICAgIGlmIChvYmouZXhwb3J0YWJsZSkge1xuICAgICAgZm9vdGVyR3JvdXAuc3R5bGUoXCJ3aWR0aFwiLCBvYmouZXhwb3J0YWJsZS53aWR0aCArIFwicHhcIik7XG4gICAgfVxuXG4gICAgdmFyIGZvb3RlclRleHQgPSBmb290ZXJHcm91cC5hcHBlbmQoXCJkaXZcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfc291cmNlLXRleHRcIilcbiAgICAgIC50ZXh0KG9iai5zb3VyY2UpO1xuXG4gICAgaWYgKG9iai5lZGl0YWJsZSkge1xuICAgICAgZm9vdGVyVGV4dFxuICAgICAgICAuYXR0cihcImNvbnRlbnRFZGl0YWJsZVwiLCB0cnVlKVxuICAgICAgICAuY2xhc3NlZChcImVkaXRhYmxlLWNoYXJ0X3NvdXJjZVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgICBvYmouZGltZW5zaW9ucy5mb290ZXJIZWlnaHQgPSBmb290ZXJHcm91cC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvb3Rlckdyb3VwOiBmb290ZXJHcm91cFxuICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9vdGVyQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9mb290ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gcGxvdChub2RlLCBvYmopIHtcblxuICB2YXIgZHJhdyA9IHtcbiAgICBsaW5lOiByZXF1aXJlKFwiLi4vdHlwZXMvbGluZVwiKSxcbiAgICBtdWx0aWxpbmU6IHJlcXVpcmUoXCIuLi90eXBlcy9tdWx0aWxpbmVcIiksXG4gICAgYXJlYTogcmVxdWlyZShcIi4uL3R5cGVzL2FyZWFcIiksXG4gICAgc3RhY2tlZEFyZWE6IHJlcXVpcmUoXCIuLi90eXBlcy9zdGFja2VkLWFyZWFcIiksXG4gICAgY29sdW1uOiByZXF1aXJlKFwiLi4vdHlwZXMvY29sdW1uXCIpLFxuICAgIGJhcjogcmVxdWlyZShcIi4uL3R5cGVzL2JhclwiKSxcbiAgICBzdGFja2VkQ29sdW1uOiByZXF1aXJlKFwiLi4vdHlwZXMvc3RhY2tlZC1jb2x1bW5cIiksXG4gICAgc3RyZWFtZ3JhcGg6IHJlcXVpcmUoXCIuLi90eXBlcy9zdHJlYW1ncmFwaFwiKVxuICB9O1xuXG4gIHZhciBjaGFydFJlZjtcblxuICBzd2l0Y2gob2JqLm9wdGlvbnMudHlwZSkge1xuXG4gICAgY2FzZSBcImxpbmVcIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5saW5lKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJtdWx0aWxpbmVcIjpcbiAgICAgIGNoYXJ0UmVmID0gZHJhdy5tdWx0aWxpbmUobm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcImFyZWFcIjpcbiAgICAgIGNoYXJ0UmVmID0gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IGRyYXcuc3RhY2tlZEFyZWEobm9kZSwgb2JqKSA6IGRyYXcuYXJlYShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiYmFyXCI6XG4gICAgICBjaGFydFJlZiA9IGRyYXcuYmFyKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgXCJjb2x1bW5cIjpcbiAgICAgIGNoYXJ0UmVmID0gb2JqLm9wdGlvbnMuc3RhY2tlZCA/IGRyYXcuc3RhY2tlZENvbHVtbihub2RlLCBvYmopIDogZHJhdy5jb2x1bW4obm9kZSwgb2JqKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcInN0cmVhbVwiOlxuICAgICAgY2hhcnRSZWYgPSBkcmF3LnN0cmVhbWdyYXBoKG5vZGUsIG9iaik7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBjaGFydFJlZiA9IGRyYXcubGluZShub2RlLCBvYmopO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gY2hhcnRSZWY7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwbG90O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9wbG90LmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIExpbmVDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPT09IDEpIHsgb2JqLnNlcmllc0hpZ2hsaWdodCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfSB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pO1xuXG4gIC8vIFNlY29uZGFyeSBhcnJheSBpcyB1c2VkIHRvIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGFsbCBzZXJpZXMgZXhjZXB0IGZvciB0aGUgaGlnaGxpZ2h0ZWQgaXRlbVxuICB2YXIgc2Vjb25kYXJ5QXJyID0gW107XG5cbiAgZm9yICh2YXIgaSA9IG9iai5kYXRhLnNlcmllc0Ftb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgLy8gRG9udCB3YW50IHRvIGluY2x1ZGUgdGhlIGhpZ2hsaWdodGVkIGl0ZW0gaW4gdGhlIGxvb3BcbiAgICAvLyBiZWNhdXNlIHdlIGFsd2F5cyB3YW50IGl0IHRvIHNpdCBhYm92ZSBhbGwgdGhlIG90aGVyIGxpbmVzXG5cbiAgICBpZiAoaSAhPT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoTGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAob2JqLnNlcmllc0hpZ2hsaWdodCgpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9LFxuICAgICAgXCJkXCI6IGhMaW5lXG4gICAgfSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgaExpbmU6IGhMaW5lLFxuICAgIGxpbmU6IGxpbmVcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9saW5lLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIEF4aXNGYWN0b3J5KGF4aXNPYmosIHNjYWxlKSB7XG5cbiAgdmFyIGF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgLnNjYWxlKHNjYWxlKVxuICAgIC5vcmllbnQoYXhpc09iai5vcmllbnQpO1xuXG4gIHJldHVybiBheGlzO1xuXG59XG5cbmZ1bmN0aW9uIGF4aXNNYW5hZ2VyKG5vZGUsIG9iaiwgc2NhbGUsIGF4aXNUeXBlKSB7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbYXhpc1R5cGVdO1xuICB2YXIgYXhpcyA9IG5ldyBBeGlzRmFjdG9yeShheGlzT2JqLCBzY2FsZSk7XG5cbiAgdmFyIHByZXZBeGlzID0gbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkubm9kZSgpO1xuXG4gIGlmIChwcmV2QXhpcyAhPT0gbnVsbCkgeyBkMy5zZWxlY3QocHJldkF4aXMpLnJlbW92ZSgpOyB9XG5cbiAgdmFyIGF4aXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiYXhpcy1ncm91cFwiICsgXCIgXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpO1xuXG4gIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG4gICAgYXBwZW5kWEF4aXMoYXhpc0dyb3VwLCBvYmosIHNjYWxlLCBheGlzLCBheGlzVHlwZSk7XG4gIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuICAgIGFwcGVuZFlBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1R5cGUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBub2RlOiBheGlzR3JvdXAsXG4gICAgYXhpczogYXhpc1xuICB9O1xuXG59XG5cbmZ1bmN0aW9uIGRldGVybWluZUZvcm1hdChjb250ZXh0KSB7XG5cbiAgc3dpdGNoIChjb250ZXh0KSB7XG4gICAgY2FzZSBcInllYXJzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVZXCIpO1xuICAgIGNhc2UgXCJtb250aHNcIjogcmV0dXJuIGQzLnRpbWUuZm9ybWF0KFwiJWJcIik7XG4gICAgY2FzZSBcIndlZWtzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVXXCIpO1xuICAgIGNhc2UgXCJkYXlzXCI6IHJldHVybiBkMy50aW1lLmZvcm1hdChcIiVqXCIpO1xuICAgIGNhc2UgXCJob3Vyc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlSFwiKTtcbiAgICBjYXNlIFwibWludXRlc1wiOiByZXR1cm4gZDMudGltZS5mb3JtYXQoXCIlTVwiKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFhBeGlzKGF4aXNHcm91cCwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc05hbWUpIHtcblxuICB2YXIgYXhpc09iaiA9IG9ialtheGlzTmFtZV0sXG4gICAgICBheGlzU2V0dGluZ3M7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnhfYXhpcykge1xuICAgIHZhciBleHRlbmQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmV4dGVuZDtcbiAgICBheGlzU2V0dGluZ3MgPSBleHRlbmQoYXhpc09iaiwgb2JqLmV4cG9ydGFibGUueF9heGlzKTtcbiAgfSBlbHNlIHtcbiAgICBheGlzU2V0dGluZ3MgPSBheGlzT2JqO1xuICB9XG5cbiAgYXhpc0dyb3VwXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCxcIiArIG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KCkgKyBcIilcIik7XG5cbiAgdmFyIGF4aXNOb2RlID0gYXhpc0dyb3VwLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcIngtYXhpc1wiKTtcblxuICBzd2l0Y2goYXhpc09iai5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICB0aW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgICBkaXNjcmV0ZUF4aXMoYXhpc05vZGUsIHNjYWxlLCBheGlzLCBheGlzU2V0dGluZ3MsIG9iai5kaW1lbnNpb25zKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIG9yZGluYWxUaW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQgPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLmhlaWdodDtcblxufVxuXG5mdW5jdGlvbiBhcHBlbmRZQXhpcyhheGlzR3JvdXAsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNOYW1lKSB7XG5cbiAgYXhpc0dyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKTtcblxuICB2YXIgYXhpc05vZGUgPSBheGlzR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwieS1heGlzXCIpO1xuXG4gIGRyYXdZQXhpcyhvYmosIGF4aXMsIGF4aXNOb2RlKTtcblxufVxuXG5mdW5jdGlvbiBkcmF3WUF4aXMob2JqLCBheGlzLCBheGlzTm9kZSkge1xuXG4gIHZhciBheGlzU2V0dGluZ3M7XG5cbiAgdmFyIGF4aXNPYmogPSBvYmpbXCJ5QXhpc1wiXTtcblxuICBpZiAob2JqLmV4cG9ydGFibGUgJiYgb2JqLmV4cG9ydGFibGUueV9heGlzKSB7XG4gICAgdmFyIGV4dGVuZCA9IHJlcXVpcmUoXCIuLi8uLi9oZWxwZXJzL2hlbHBlcnNcIikuZXh0ZW5kO1xuICAgIGF4aXNTZXR0aW5ncyA9IGV4dGVuZChheGlzT2JqLCBvYmouZXhwb3J0YWJsZS55X2F4aXMpO1xuICB9IGVsc2Uge1xuICAgIGF4aXNTZXR0aW5ncyA9IGF4aXNPYmo7XG4gIH1cblxuICBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCA9IGF4aXNTZXR0aW5ncy5wYWRkaW5nUmlnaHQ7XG5cbiAgYXhpcy5zY2FsZSgpLnJhbmdlKFtvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpLCAwXSk7XG5cbiAgYXhpcy50aWNrVmFsdWVzKHRpY2tGaW5kZXJZKGF4aXMuc2NhbGUoKSwgYXhpc09iai50aWNrcywgYXhpc1NldHRpbmdzKSk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm1pbm9yXCIsIHRydWUpO1xuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpXG4gICAgLmNhbGwodXBkYXRlVGV4dFksIGF4aXNOb2RlLCBvYmosIGF4aXMsIGF4aXNPYmopXG4gICAgLmNhbGwocmVwb3NpdGlvblRleHRZLCBvYmouZGltZW5zaW9ucywgYXhpc09iai50ZXh0WCk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2sgbGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieDFcIjogb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgXCJ4MlwiOiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKClcbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiB0aW1lQXhpcyhheGlzTm9kZSwgb2JqLCBzY2FsZSwgYXhpcywgYXhpc1NldHRpbmdzKSB7XG5cbiAgdmFyIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluKCksXG4gICAgICBjdHggPSB0aW1lRGlmZihkb21haW5bMF0sIGRvbWFpblsxXSwgMyksXG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZGV0ZXJtaW5lRm9ybWF0KGN0eCk7XG5cbiAgYXhpcy50aWNrRm9ybWF0KGN1cnJlbnRGb3JtYXQpO1xuXG4gIHZhciB0aWNrcztcblxuICB2YXIgdGlja0dvYWw7XG4gIGlmIChheGlzU2V0dGluZ3MudGlja3MgPT09ICdhdXRvJykge1xuICAgIHRpY2tHb2FsID0gYXhpc1NldHRpbmdzLnRpY2tUYXJnZXQ7XG4gIH0gZWxzZSB7XG4gICAgdGlja0dvYWwgPSBheGlzU2V0dGluZ3MudGlja3M7XG4gIH1cblxuICBpZiAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgPiBheGlzU2V0dGluZ3Mud2lkdGhUaHJlc2hvbGQpIHtcbiAgICB0aWNrcyA9IHRpY2tGaW5kZXJYKGRvbWFpbiwgY3R4LCB0aWNrR29hbCk7XG4gIH0gZWxzZSB7XG4gICAgdGlja3MgPSB0aWNrRmluZGVyWChkb21haW4sIGN0eCwgYXhpc1NldHRpbmdzLnRpY2tzU21hbGwpO1xuICB9XG5cbiAgaWYgKG9iai5vcHRpb25zLnR5cGUgIT09IFwiY29sdW1uXCIpIHtcbiAgICBheGlzLnRpY2tWYWx1ZXModGlja3MpO1xuICB9IGVsc2Uge1xuICAgIGF4aXMudGlja3MoKTtcbiAgfVxuXG4gIGF4aXNOb2RlLmNhbGwoYXhpcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieFwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFgsXG4gICAgICBcInlcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRleHRZLFxuICAgICAgXCJkeVwiOiBheGlzU2V0dGluZ3MuZHkgKyBcImVtXCJcbiAgICB9KVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAuY2FsbChzZXRUaWNrRm9ybWF0WCwgY3R4LCBheGlzU2V0dGluZ3MuZW1zLCBvYmoubW9udGhzQWJyKTtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJjb2x1bW5cIikgeyBkcm9wUmVkdW5kYW50VGlja3MoYXhpc05vZGUsIGN0eCk7IH1cblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKVxuICAgIC5jYWxsKGRyb3BUaWNrcyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG59XG5cbmZ1bmN0aW9uIGRpc2NyZXRlQXhpcyhheGlzTm9kZSwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncywgZGltZW5zaW9ucykge1xuXG4gIHZhciB3cmFwVGV4dCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS53cmFwVGV4dDtcblxuICBheGlzLnRpY2tQYWRkaW5nKDApO1xuXG4gIHNjYWxlLnJhbmdlRXh0ZW50KFswLCBkaW1lbnNpb25zLnRpY2tXaWR0aCgpXSk7XG5cbiAgc2NhbGUucmFuZ2VSb3VuZEJhbmRzKFswLCBkaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgZGltZW5zaW9ucy5iYW5kcy5wYWRkaW5nLCBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZyk7XG5cbiAgdmFyIGJhbmRTdGVwID0gc2NhbGUucmFuZ2VCYW5kKCk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAuYXR0cihcImR5XCIsIGF4aXNTZXR0aW5ncy5keSArIFwiZW1cIilcbiAgICAuY2FsbCh3cmFwVGV4dCwgYmFuZFN0ZXApO1xuXG4gIHZhciBmaXJzdFhQb3MgPSBkMy50cmFuc2Zvcm0oYXhpc05vZGUuc2VsZWN0KFwiLnRpY2tcIikuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdICogLTE7XG5cbiAgdmFyIHhQb3MgPSAoLSAoYmFuZFN0ZXAgLyAyKSAtIChiYW5kU3RlcCAqIGRpbWVuc2lvbnMuYmFuZHMub3V0ZXJQYWRkaW5nKSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieDFcIjogeFBvcyxcbiAgICAgIFwieDJcIjogeFBvc1xuICAgIH0pO1xuXG4gIGF4aXNOb2RlLnNlbGVjdChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICBcIngxXCI6IGZpcnN0WFBvcyxcbiAgICAgIFwieDJcIjogZmlyc3RYUG9zXG4gICAgfSk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG4gIHZhciBsYXN0VGljayA9IGF4aXNOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IFwidGlja1wiLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAoZGltZW5zaW9ucy50aWNrV2lkdGgoKSArIChiYW5kU3RlcCAvIDIpICsgYmFuZFN0ZXAgKiBkaW1lbnNpb25zLmJhbmRzLm91dGVyUGFkZGluZykgKyBcIiwwKVwiXG4gICAgfSk7XG5cbiAgbGFzdFRpY2suYXBwZW5kKFwibGluZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwieTJcIjogYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQsXG4gICAgICBcIngxXCI6IHhQb3MsXG4gICAgICBcIngyXCI6IHhQb3NcbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiBvcmRpbmFsVGltZUF4aXMoYXhpc05vZGUsIG9iaiwgc2NhbGUsIGF4aXMsIGF4aXNTZXR0aW5ncykge1xuXG4gIHZhciB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCAzKSxcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkZXRlcm1pbmVGb3JtYXQoY3R4KTtcblxuICBheGlzLnRpY2tGb3JtYXQoY3VycmVudEZvcm1hdCk7XG5cbiAgYXhpc05vZGUuY2FsbChheGlzKTtcblxuICBheGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ4XCI6IGF4aXNTZXR0aW5ncy51cHBlci50ZXh0WCxcbiAgICAgIFwieVwiOiBheGlzU2V0dGluZ3MudXBwZXIudGV4dFksXG4gICAgICBcImR5XCI6IGF4aXNTZXR0aW5ncy5keSArIFwiZW1cIlxuICAgIH0pXG4gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJzdGFydFwiKVxuICAgIC5jYWxsKHNldFRpY2tGb3JtYXRYLCBjdHgsIGF4aXNTZXR0aW5ncy5lbXMsIG9iai5tb250aHNBYnIpO1xuXG4gIGlmIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgPiBvYmoueEF4aXMud2lkdGhUaHJlc2hvbGQpIHtcbiAgICB2YXIgb3JkaW5hbFRpY2tQYWRkaW5nID0gNztcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3JkaW5hbFRpY2tQYWRkaW5nID0gNDtcbiAgfVxuXG4gIGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpXG4gICAgLmNhbGwob3JkaW5hbFRpbWVUaWNrcywgYXhpc05vZGUsIGN0eCwgc2NhbGUsIG9yZGluYWxUaWNrUGFkZGluZyk7XG5cbiAgYXhpc05vZGUuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgIC5hdHRyKFwieTJcIiwgYXhpc1NldHRpbmdzLnVwcGVyLnRpY2tIZWlnaHQpO1xuXG59XG5cbi8vIHRleHQgZm9ybWF0dGluZyBmdW5jdGlvbnNcblxuZnVuY3Rpb24gc2V0VGlja0Zvcm1hdFgoc2VsZWN0aW9uLCBjdHgsIGVtcywgbW9udGhzQWJyKSB7XG5cbiAgdmFyIHByZXZZZWFyLFxuICAgICAgcHJldk1vbnRoLFxuICAgICAgcHJldkRhdGUsXG4gICAgICBkWWVhcixcbiAgICAgIGRNb250aCxcbiAgICAgIGREYXRlLFxuICAgICAgZEhvdXIsXG4gICAgICBkTWludXRlO1xuXG4gIHNlbGVjdGlvbi50ZXh0KGZ1bmN0aW9uKGQpIHtcblxuICAgIHZhciBub2RlID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgdmFyIGRTdHI7XG5cbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRTdHIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuXG4gICAgICAgIGRNb250aCA9IG1vbnRoc0FicltkLmdldE1vbnRoKCldO1xuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZFllYXIsIGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBkU3RyID0gZE1vbnRoO1xuXG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwid2Vla3NcIjpcbiAgICAgIGNhc2UgXCJkYXlzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcblxuICAgICAgICBpZiAoZE1vbnRoICE9PSBwcmV2TW9udGgpIHtcbiAgICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkU3RyID0gZERhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgbmV3VGV4dE5vZGUobm9kZSwgZFllYXIsIGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2TW9udGggPSBkTW9udGg7XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICBkTW9udGggPSBtb250aHNBYnJbZC5nZXRNb250aCgpXTtcbiAgICAgICAgZERhdGUgPSBkLmdldERhdGUoKTtcbiAgICAgICAgZEhvdXIgPSBkLmdldEhvdXJzKCk7XG4gICAgICAgIGRNaW51dGUgPSBkLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICB2YXIgZEhvdXJTdHIsXG4gICAgICAgICAgICBkTWludXRlU3RyO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSAyNGggdGltZVxuICAgICAgICB2YXIgc3VmZml4ID0gKGRIb3VyID49IDEyKSA/ICdwLm0uJyA6ICdhLm0uJztcbiAgICAgICAgaWYgKGRIb3VyID09PSAwKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSAxMjtcbiAgICAgICAgfSBlbHNlIGlmIChkSG91ciA+IDEyKSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91ciAtIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRIb3VyU3RyID0gZEhvdXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIG1pbnV0ZXMgZm9sbG93IEdsb2JlIHN0eWxlXG4gICAgICAgIGlmIChkTWludXRlID09PSAwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKGRNaW51dGUgPCAxMCkge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOjAnICsgZE1pbnV0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJzonICsgZE1pbnV0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRTdHIgPSBkSG91clN0ciArIGRNaW51dGVTdHIgKyAnICcgKyBzdWZmaXg7XG5cbiAgICAgICAgaWYgKGREYXRlICE9PSBwcmV2RGF0ZSkge1xuICAgICAgICAgIHZhciBkYXRlU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgICBuZXdUZXh0Tm9kZShub2RlLCBkYXRlU3RyLCBlbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRTdHIgPSBkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZFN0cjtcblxuICB9KTtcblxufVxuXG5mdW5jdGlvbiBzZXRUaWNrRm9ybWF0WShmb3JtYXQsIGQsIGxhc3RUaWNrKSB7XG4gIC8vIGNoZWNraW5nIGZvciBhIGZvcm1hdCBhbmQgZm9ybWF0dGluZyB5LWF4aXMgdmFsdWVzIGFjY29yZGluZ2x5XG5cbiAgdmFyIGlzRmxvYXQgPSByZXF1aXJlKFwiLi4vLi4vaGVscGVycy9oZWxwZXJzXCIpLmlzRmxvYXQ7XG5cbiAgdmFyIGN1cnJlbnRGb3JtYXQ7XG5cbiAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICBjYXNlIFwiZ2VuZXJhbFwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcImdcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic2lcIjpcbiAgICAgIHZhciBwcmVmaXggPSBkMy5mb3JtYXRQcmVmaXgobGFzdFRpY2spLFxuICAgICAgICAgIGZvcm1hdCA9IGQzLmZvcm1hdChcIi4xZlwiKTtcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBmb3JtYXQocHJlZml4LnNjYWxlKGQpKSArIHByZWZpeC5zeW1ib2w7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY29tbWFcIjpcbiAgICAgIGlmIChpc0Zsb2F0KHBhcnNlRmxvYXQoZCkpKSB7XG4gICAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjJmXCIpKGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIixnXCIpKGQpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kMVwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuMWZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicm91bmQyXCI6XG4gICAgICBjdXJyZW50Rm9ybWF0ID0gZDMuZm9ybWF0KFwiLC4yZlwiKShkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyb3VuZDNcIjpcbiAgICAgIGN1cnJlbnRGb3JtYXQgPSBkMy5mb3JtYXQoXCIsLjNmXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInJvdW5kNFwiOlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIiwuNGZcIikoZCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY3VycmVudEZvcm1hdCA9IGQzLmZvcm1hdChcIixnXCIpKGQpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gY3VycmVudEZvcm1hdDtcblxufVxuXG5mdW5jdGlvbiB1cGRhdGVUZXh0WCh0ZXh0Tm9kZXMsIGF4aXNOb2RlLCBvYmosIGF4aXMsIGF4aXNPYmopIHtcblxuICB2YXIgbGFzdFRpY2sgPSBheGlzLnRpY2tWYWx1ZXMoKVtheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxXTtcblxuICB0ZXh0Tm9kZXNcbiAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG4gICAgICB2YXIgdmFsID0gc2V0VGlja0Zvcm1hdFkoYXhpc09iai5mb3JtYXQsIGQsIGxhc3RUaWNrKTtcbiAgICAgIGlmIChpID09PSBheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHZhbCA9IChheGlzT2JqLnByZWZpeCB8fCBcIlwiKSArIHZhbCArIChheGlzT2JqLnN1ZmZpeCB8fCBcIlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gdXBkYXRlVGV4dFkodGV4dE5vZGVzLCBheGlzTm9kZSwgb2JqLCBheGlzLCBheGlzT2JqKSB7XG5cbiAgdmFyIGFyciA9IFtdLFxuICAgICAgbGFzdFRpY2sgPSBheGlzLnRpY2tWYWx1ZXMoKVtheGlzLnRpY2tWYWx1ZXMoKS5sZW5ndGggLSAxXTtcblxuICB0ZXh0Tm9kZXNcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgwLDApXCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIHZhbCA9IHNldFRpY2tGb3JtYXRZKGF4aXNPYmouZm9ybWF0LCBkLCBsYXN0VGljayk7XG4gICAgICBpZiAoaSA9PT0gYXhpcy50aWNrVmFsdWVzKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICB2YWwgPSAoYXhpc09iai5wcmVmaXggfHwgXCJcIikgKyB2YWwgKyAoYXhpc09iai5zdWZmaXggfHwgXCJcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0pXG4gICAgLnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgdmFyIHRleHRDaGFyID0gc2VsLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgIGFyci5wdXNoKHRleHRDaGFyKTtcbiAgICAgIHJldHVybiBzZWwudGV4dCgpO1xuICAgIH0pXG4gICAgLmF0dHIoe1xuICAgICAgXCJkeVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmouZHkgIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai5keSArIFwiZW1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJkeVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGF4aXNPYmoudGV4dFggIT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gYXhpc09iai50ZXh0WDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ4XCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYXhpc09iai50ZXh0WSAhPT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiBheGlzT2JqLnRleHRZO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcykuYXR0cihcInlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoID0gZDMubWF4KGFycik7XG5cbn1cblxuZnVuY3Rpb24gcmVwb3NpdGlvblRleHRZKHRleHQsIGRpbWVuc2lvbnMsIHRleHRYKSB7XG4gIHRleHQuYXR0cih7XG4gICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAoZGltZW5zaW9ucy5sYWJlbFdpZHRoIC0gdGV4dFgpICsgXCIsMClcIixcbiAgICBcInhcIjogMFxuICB9KTtcbn1cblxuLy8gQ2xvbmVzIGN1cnJlbnQgdGV4dCBzZWxlY3Rpb24gYW5kIGFwcGVuZHNcbi8vIGEgbmV3IHRleHQgbm9kZSBiZWxvdyB0aGUgc2VsZWN0aW9uXG5mdW5jdGlvbiBuZXdUZXh0Tm9kZShzZWxlY3Rpb24sIHRleHQsIGVtcykge1xuXG4gIHZhciBub2RlTmFtZSA9IHNlbGVjdGlvbi5wcm9wZXJ0eShcIm5vZGVOYW1lXCIpLFxuICAgICAgcGFyZW50ID0gZDMuc2VsZWN0KHNlbGVjdGlvbi5ub2RlKCkucGFyZW50Tm9kZSksXG4gICAgICBsaW5lSGVpZ2h0ID0gZW1zIHx8IDEuNiwgLy8gZW1zXG4gICAgICBkeSA9IHBhcnNlRmxvYXQoc2VsZWN0aW9uLmF0dHIoXCJkeVwiKSksXG4gICAgICB4ID0gcGFyc2VGbG9hdChzZWxlY3Rpb24uYXR0cihcInhcIikpLFxuXG4gICAgICBjbG9uZWQgPSBwYXJlbnQuYXBwZW5kKG5vZGVOYW1lKVxuICAgICAgICAuYXR0cihcImR5XCIsIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIHgpXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uKCkgeyByZXR1cm4gdGV4dDsgfSk7XG5cbiAgcmV0dXJuIGNsb25lZDtcblxufVxuXG4vLyB0aWNrIGRyb3BwaW5nIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBkcm9wVGlja3Moc2VsZWN0aW9uLCBvcHRzKSB7XG5cbiAgdmFyIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gIHZhciB0b2xlcmFuY2UgPSBvcHRzLnRvbGVyYW5jZSB8fCAwLFxuICAgICAgZnJvbSA9IG9wdHMuZnJvbSB8fCAwLFxuICAgICAgdG8gPSBvcHRzLnRvIHx8IHNlbGVjdGlvblswXS5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaiA9IGZyb207IGogPCB0bzsgaisrKSB7XG5cbiAgICB2YXIgYyA9IHNlbGVjdGlvblswXVtqXSwgLy8gY3VycmVudCBzZWxlY3Rpb25cbiAgICAgICAgbiA9IHNlbGVjdGlvblswXVtqICsgMV07IC8vIG5leHQgc2VsZWN0aW9uXG5cbiAgICBpZiAoIWMgfHwgIW4gfHwgIWMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHx8ICFuLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkgeyBjb250aW51ZTsgfVxuXG4gICAgd2hpbGUgKChjLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0ICsgdG9sZXJhbmNlKSA+IG4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkge1xuXG4gICAgICBpZiAoZDMuc2VsZWN0KG4pLmRhdGEoKVswXSA9PT0gc2VsZWN0aW9uLmRhdGEoKVt0b10pIHtcbiAgICAgICAgZDMuc2VsZWN0KGMpLnJlbW92ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZDMuc2VsZWN0KG4pLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBqKys7XG5cbiAgICAgIG4gPSBzZWxlY3Rpb25bMF1baiArIDFdO1xuXG4gICAgICBpZiAoIW4pIHsgYnJlYWs7IH1cblxuICAgIH1cblxuICB9XG5cbn1cblxuZnVuY3Rpb24gZHJvcFJlZHVuZGFudFRpY2tzKHNlbGVjdGlvbiwgY3R4KSB7XG5cbiAgdmFyIHRpY2tzID0gc2VsZWN0aW9uLnNlbGVjdEFsbChcIi50aWNrXCIpO1xuXG4gIHZhciBwcmV2WWVhciwgcHJldk1vbnRoLCBwcmV2RGF0ZSwgcHJldkhvdXIsIHByZXZNaW51dGUsIGRZZWFyLCBkTW9udGgsIGREYXRlLCBkSG91ciwgZE1pbnV0ZTtcblxuICB0aWNrcy5lYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgY2FzZSBcInllYXJzXCI6XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBpZiAoZFllYXIgPT09IHByZXZZZWFyKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBpZiAoKGRNb250aCA9PT0gcHJldk1vbnRoKSAmJiAoZFllYXIgPT09IHByZXZZZWFyKSkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2TW9udGggPSBkTW9udGg7XG4gICAgICAgIHByZXZZZWFyID0gZFllYXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIndlZWtzXCI6XG4gICAgICBjYXNlIFwiZGF5c1wiOlxuICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgZE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIGlmICgoZERhdGUgPT09IHByZXZEYXRlKSAmJiAoZE1vbnRoID09PSBwcmV2TW9udGgpICYmIChkWWVhciA9PT0gcHJldlllYXIpKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgcHJldk1vbnRoID0gZE1vbnRoO1xuICAgICAgICBwcmV2WWVhciA9IGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJob3Vyc1wiOlxuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkSG91ciA9IGQuZ2V0SG91cnMoKTtcbiAgICAgICAgZE1pbnV0ZSA9IGQuZ2V0TWludXRlcygpO1xuXG4gICAgICAgIGlmICgoZERhdGUgPT09IHByZXZEYXRlKSAmJiAoZEhvdXIgPT09IHByZXZIb3VyKSAmJiAoZE1pbnV0ZSA9PT0gcHJldk1pbnV0ZSkpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2RGF0ZSA9IGREYXRlO1xuICAgICAgICBwcmV2SG91ciA9IGRIb3VyO1xuICAgICAgICBwcmV2TWludXRlID0gZE1pbnV0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcblxufVxuXG5mdW5jdGlvbiBkcm9wT3ZlcnNldFRpY2tzKGF4aXNOb2RlLCB0aWNrV2lkdGgpIHtcblxuICB2YXIgYXhpc0dyb3VwV2lkdGggPSBheGlzTm9kZS5ub2RlKCkuZ2V0QkJveCgpLndpZHRoLFxuICAgICAgdGlja0FyciA9IGF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrXCIpWzBdO1xuXG4gIGlmICh0aWNrQXJyLmxlbmd0aCkge1xuXG4gICAgdmFyIGZpcnN0VGlja09mZnNldCA9IGQzLnRyYW5zZm9ybShkMy5zZWxlY3QodGlja0FyclswXSlcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF07XG5cbiAgICBpZiAoKGF4aXNHcm91cFdpZHRoICsgZmlyc3RUaWNrT2Zmc2V0KSA+PSB0aWNrV2lkdGgpIHtcbiAgICAgIHZhciBsYXN0VGljayA9IHRpY2tBcnJbdGlja0Fyci5sZW5ndGggLSAxXTtcbiAgICAgIGQzLnNlbGVjdChsYXN0VGljaykuYXR0cihcImNsYXNzXCIsIFwibGFzdC10aWNrLWhpZGVcIik7XG4gICAgICBheGlzR3JvdXBXaWR0aCA9IGF4aXNOb2RlLm5vZGUoKS5nZXRCQm94KCkud2lkdGg7XG4gICAgICB0aWNrQXJyID0gYXhpc05vZGUuc2VsZWN0QWxsKFwiLnRpY2tcIilbMF07XG4gICAgfVxuXG4gIH1cblxufVxuXG5mdW5jdGlvbiB0aWNrRmluZGVyWChkb21haW4sIHBlcmlvZCwgdGlja0dvYWwpIHtcblxuICAvLyBzZXQgcmFuZ2VzXG4gIHZhciBzdGFydERhdGUgPSBkb21haW5bMF0sXG4gICAgICBlbmREYXRlID0gZG9tYWluWzFdO1xuXG4gIC8vIHNldCB1cHBlciBhbmQgbG93ZXIgYm91bmRzIGZvciBudW1iZXIgb2Ygc3RlcHMgcGVyIHRpY2tcbiAgLy8gaS5lLiBpZiB5b3UgaGF2ZSBmb3VyIG1vbnRocyBhbmQgc2V0IHN0ZXBzIHRvIDEsIHlvdSdsbCBnZXQgNCB0aWNrc1xuICAvLyBhbmQgaWYgeW91IGhhdmUgc2l4IG1vbnRocyBhbmQgc2V0IHN0ZXBzIHRvIDIsIHlvdSdsbCBnZXQgMyB0aWNrc1xuICB2YXIgc3RlcExvd2VyQm91bmQgPSAxLFxuICAgICAgc3RlcFVwcGVyQm91bmQgPSAxMixcbiAgICAgIHRpY2tDYW5kaWRhdGVzID0gW10sXG4gICAgICBjbG9zZXN0QXJyO1xuXG4gIC8vIHVzaW5nIHRoZSB0aWNrIGJvdW5kcywgZ2VuZXJhdGUgbXVsdGlwbGUgYXJyYXlzLWluLW9iamVjdHMgdXNpbmdcbiAgLy8gZGlmZmVyZW50IHRpY2sgc3RlcHMuIHB1c2ggYWxsIHRob3NlIGdlbmVyYXRlZCBvYmplY3RzIHRvIHRpY2tDYW5kaWRhdGVzXG4gIGZvciAodmFyIGkgPSBzdGVwTG93ZXJCb3VuZDsgaSA8PSBzdGVwVXBwZXJCb3VuZDsgaSsrKSB7XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIG9iai5pbnRlcnZhbCA9IGk7XG4gICAgb2JqLmFyciA9IGQzLnRpbWVbcGVyaW9kXShzdGFydERhdGUsIGVuZERhdGUsIGkpLmxlbmd0aDtcbiAgICB0aWNrQ2FuZGlkYXRlcy5wdXNoKG9iaik7XG4gIH1cblxuICAvLyByZWR1Y2UgdG8gZmluZCBhIGJlc3QgY2FuZGlkYXRlIGJhc2VkIG9uIHRoZSBkZWZpbmVkIHRpY2tHb2FsXG4gIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPiAxKSB7XG4gICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgcmV0dXJuIChNYXRoLmFicyhjdXJyLmFyciAtIHRpY2tHb2FsKSA8IE1hdGguYWJzKHByZXYuYXJyIC0gdGlja0dvYWwpID8gY3VyciA6IHByZXYpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIGNsb3Nlc3RBcnIgPSB0aWNrQ2FuZGlkYXRlc1swXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBzaWdoLiB3ZSB0cmllZC5cbiAgICBjbG9zZXN0QXJyLmludGVydmFsID0gMTtcbiAgfVxuXG4gIHZhciB0aWNrQXJyID0gZDMudGltZVtwZXJpb2RdKHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgY2xvc2VzdEFyci5pbnRlcnZhbCk7XG5cbiAgdmFyIHN0YXJ0RGlmZiA9IHRpY2tBcnJbMF0gLSBzdGFydERhdGU7XG4gIHZhciB0aWNrRGlmZiA9IHRpY2tBcnJbMV0gLSB0aWNrQXJyWzBdO1xuXG4gIC8vIGlmIGRpc3RhbmNlIGZyb20gc3RhcnREYXRlIHRvIHRpY2tBcnJbMF0gaXMgZ3JlYXRlciB0aGFuIGhhbGYgdGhlXG4gIC8vIGRpc3RhbmNlIGJldHdlZW4gdGlja0FyclsxXSBhbmQgdGlja0FyclswXSwgYWRkIHN0YXJ0RGF0ZSB0byB0aWNrQXJyXG5cbiAgaWYgKCBzdGFydERpZmYgPiAodGlja0RpZmYgLyAyKSApIHsgdGlja0Fyci51bnNoaWZ0KHN0YXJ0RGF0ZSk7IH1cblxuICByZXR1cm4gdGlja0FycjtcblxufVxuXG5mdW5jdGlvbiB0aWNrRmluZGVyWShzY2FsZSwgdGlja0NvdW50LCB0aWNrU2V0dGluZ3MpIHtcblxuICAvLyBJbiBhIG51dHNoZWxsOlxuICAvLyBDaGVja3MgaWYgYW4gZXhwbGljaXQgbnVtYmVyIG9mIHRpY2tzIGhhcyBiZWVuIGRlY2xhcmVkXG4gIC8vIElmIG5vdCwgc2V0cyBsb3dlciBhbmQgdXBwZXIgYm91bmRzIGZvciB0aGUgbnVtYmVyIG9mIHRpY2tzXG4gIC8vIEl0ZXJhdGVzIG92ZXIgdGhvc2UgYW5kIG1ha2VzIHN1cmUgdGhhdCB0aGVyZSBhcmUgdGljayBhcnJheXMgd2hlcmVcbiAgLy8gdGhlIGxhc3QgdmFsdWUgaW4gdGhlIGFycmF5IG1hdGNoZXMgdGhlIGRvbWFpbiBtYXggdmFsdWVcbiAgLy8gaWYgc28sIHRyaWVzIHRvIGZpbmQgdGhlIHRpY2sgbnVtYmVyIGNsb3Nlc3QgdG8gdGlja0dvYWwgb3V0IG9mIHRoZSB3aW5uZXJzLFxuICAvLyBhbmQgcmV0dXJucyB0aGF0IGFyciB0byB0aGUgc2NhbGUgZm9yIHVzZVxuXG4gIHZhciBtaW4gPSBzY2FsZS5kb21haW4oKVswXSxcbiAgICAgIG1heCA9IHNjYWxlLmRvbWFpbigpWzFdO1xuXG4gIGlmICh0aWNrQ291bnQgIT09IFwiYXV0b1wiKSB7XG5cbiAgICByZXR1cm4gc2NhbGUudGlja3ModGlja0NvdW50KTtcblxuICB9IGVsc2Uge1xuXG4gICAgdmFyIHRpY2tMb3dlckJvdW5kID0gdGlja1NldHRpbmdzLnRpY2tMb3dlckJvdW5kLFxuICAgICAgICB0aWNrVXBwZXJCb3VuZCA9IHRpY2tTZXR0aW5ncy50aWNrVXBwZXJCb3VuZCxcbiAgICAgICAgdGlja0dvYWwgPSB0aWNrU2V0dGluZ3MudGlja0dvYWwsXG4gICAgICAgIGFyciA9IFtdLFxuICAgICAgICB0aWNrQ2FuZGlkYXRlcyA9IFtdLFxuICAgICAgICBjbG9zZXN0QXJyO1xuXG4gICAgZm9yICh2YXIgaSA9IHRpY2tMb3dlckJvdW5kOyBpIDw9IHRpY2tVcHBlckJvdW5kOyBpKyspIHtcbiAgICAgIHZhciB0aWNrQ2FuZGlkYXRlID0gc2NhbGUudGlja3MoaSk7XG5cbiAgICAgIGlmIChtaW4gPCAwKSB7XG4gICAgICAgIGlmICgodGlja0NhbmRpZGF0ZVswXSA9PT0gbWluKSAmJiAodGlja0NhbmRpZGF0ZVt0aWNrQ2FuZGlkYXRlLmxlbmd0aCAtIDFdID09PSBtYXgpKSB7XG4gICAgICAgICAgYXJyLnB1c2godGlja0NhbmRpZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aWNrQ2FuZGlkYXRlW3RpY2tDYW5kaWRhdGUubGVuZ3RoIC0gMV0gPT09IG1heCkge1xuICAgICAgICAgIGFyci5wdXNoKHRpY2tDYW5kaWRhdGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB0aWNrQ2FuZGlkYXRlcy5wdXNoKHZhbHVlLmxlbmd0aCk7XG4gICAgfSk7XG5cbiAgICB2YXIgY2xvc2VzdEFycjtcblxuICAgIGlmICh0aWNrQ2FuZGlkYXRlcy5sZW5ndGggPiAxKSB7XG4gICAgICBjbG9zZXN0QXJyID0gdGlja0NhbmRpZGF0ZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoY3VyciAtIHRpY2tHb2FsKSA8IE1hdGguYWJzKHByZXYgLSB0aWNrR29hbCkgPyBjdXJyIDogcHJldik7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRpY2tDYW5kaWRhdGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY2xvc2VzdEFyciA9IHRpY2tDYW5kaWRhdGVzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZXN0QXJyID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NhbGUudGlja3MoY2xvc2VzdEFycik7XG5cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIG9yZGluYWxUaW1lVGlja3Moc2VsZWN0aW9uLCBheGlzTm9kZSwgY3R4LCBzY2FsZSwgdG9sZXJhbmNlKSB7XG5cbiAgZHJvcFJlZHVuZGFudFRpY2tzKGF4aXNOb2RlLCBjdHgpO1xuXG4gIC8vIGRyb3BSZWR1bmRhbnRUaWNrcyBoYXMgbW9kaWZpZWQgdGhlIHNlbGVjdGlvbiwgc28gd2UgbmVlZCB0byByZXNlbGVjdFxuICAvLyB0byBnZXQgYSBwcm9wZXIgaWRlYSBvZiB3aGF0J3Mgc3RpbGwgYXZhaWxhYmxlXG4gIHZhciBuZXdTZWxlY3Rpb24gPSBheGlzTm9kZS5zZWxlY3RBbGwoXCIudGlja1wiKTtcblxuICAvLyBpZiB0aGUgY29udGV4dCBpcyBcInllYXJzXCIsIGV2ZXJ5IHRpY2sgaXMgYSBtYWpvcnRpY2sgc28gd2UgY2FuXG4gIC8vIGp1c3QgcGFzcyBvbiB0aGUgYmxvY2sgYmVsb3dcbiAgaWYgKGN0eCAhPT0gXCJ5ZWFyc1wiKSB7XG5cbiAgICAvLyBhcnJheSBmb3IgYW55IFwibWFqb3IgdGlja3NcIiwgaS5lLiB0aWNrcyB3aXRoIGEgY2hhbmdlIGluIGNvbnRleHRcbiAgICAvLyBvbmUgbGV2ZWwgdXAuIGkuZS4sIGEgXCJtb250aHNcIiBjb250ZXh0IHNldCBvZiB0aWNrcyB3aXRoIGEgY2hhbmdlIGluIHRoZSB5ZWFyLFxuICAgIC8vIG9yIFwiZGF5c1wiIGNvbnRleHQgdGlja3Mgd2l0aCBhIGNoYW5nZSBpbiBtb250aCBvciB5ZWFyXG4gICAgdmFyIG1ham9yVGlja3MgPSBbXTtcblxuICAgIHZhciBwcmV2WWVhciwgcHJldk1vbnRoLCBwcmV2RGF0ZSwgZFllYXIsIGRNb250aCwgZERhdGU7XG5cbiAgICBuZXdTZWxlY3Rpb24uZWFjaChmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgY3VyclNlbCA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgIHN3aXRjaCAoY3R4KSB7XG4gICAgICAgIGNhc2UgXCJtb250aHNcIjpcbiAgICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBpZiAoZFllYXIgIT09IHByZXZZZWFyKSB7IG1ham9yVGlja3MucHVzaChjdXJyU2VsKTsgfVxuICAgICAgICAgIHByZXZZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwid2Vla3NcIjpcbiAgICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgICBkWWVhciA9IGQuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBkTW9udGggPSBkLmdldE1vbnRoKCk7XG4gICAgICAgICAgaWYgKChkTW9udGggIT09IHByZXZNb250aCkgJiYgKGRZZWFyICE9PSBwcmV2WWVhcikpIHtcbiAgICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRNb250aCAhPT0gcHJldk1vbnRoKSB7XG4gICAgICAgICAgICBtYWpvclRpY2tzLnB1c2goY3VyclNlbCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkWWVhciAhPT0gcHJldlllYXIpIHtcbiAgICAgICAgICAgIG1ham9yVGlja3MucHVzaChjdXJyU2VsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcHJldk1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgICAgICAgIHByZXZZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaG91cnNcIjpcbiAgICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICAgIGlmIChkRGF0ZSAhPT0gcHJldkRhdGUpIHsgbWFqb3JUaWNrcy5wdXNoKGN1cnJTZWwpOyB9XG4gICAgICAgICAgcHJldkRhdGUgPSBkRGF0ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB0MCwgdG47XG5cbiAgICBpZiAobWFqb3JUaWNrcy5sZW5ndGggPiAxKSB7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFqb3JUaWNrcy5sZW5ndGggKyAxOyBpKyspIHtcblxuICAgICAgICBpZiAoaSA9PT0gMCkgeyAvLyBmcm9tIHQwIHRvIG0wXG4gICAgICAgICAgdDAgPSAwO1xuICAgICAgICAgIHRuID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbMF0uZGF0YSgpWzBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChpID09PSAobWFqb3JUaWNrcy5sZW5ndGgpKSB7IC8vIGZyb20gbW4gdG8gdG5cbiAgICAgICAgICB0MCA9IG5ld1NlbGVjdGlvbi5kYXRhKCkuaW5kZXhPZihtYWpvclRpY2tzW2kgLSAxXS5kYXRhKClbMF0pO1xuICAgICAgICAgIHRuID0gbmV3U2VsZWN0aW9uLmxlbmd0aCAtIDE7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZyb20gbTAgdG8gbW5cbiAgICAgICAgICB0MCA9IG5ld1NlbGVjdGlvbi5kYXRhKCkuaW5kZXhPZihtYWpvclRpY2tzW2kgLSAxXS5kYXRhKClbMF0pO1xuICAgICAgICAgIHRuID0gbmV3U2VsZWN0aW9uLmRhdGEoKS5pbmRleE9mKG1ham9yVGlja3NbaV0uZGF0YSgpWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghISh0biAtIHQwKSkge1xuICAgICAgICAgIGRyb3BUaWNrcyhuZXdTZWxlY3Rpb24sIHtcbiAgICAgICAgICAgIGZyb206IHQwLFxuICAgICAgICAgICAgdG86IHRuLFxuICAgICAgICAgICAgdG9sZXJhbmNlOiB0b2xlcmFuY2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICBkcm9wVGlja3MobmV3U2VsZWN0aW9uLCB7IHRvbGVyYW5jZTogdG9sZXJhbmNlIH0pO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopIHtcblxuICAvLyB0aGlzIHNlY3Rpb24gaXMga2luZGEgZ3Jvc3MsIHNvcnJ5OlxuICAvLyByZXNldHMgcmFuZ2VzIGFuZCBkaW1lbnNpb25zLCByZWRyYXdzIHlBeGlzLCByZWRyYXdzIHhBeGlzXG4gIC8vIOKApnRoZW4gcmVkcmF3cyB5QXhpcyBhZ2FpbiBpZiB0aWNrIHdyYXBwaW5nIGhhcyBjaGFuZ2VkIHhBeGlzIGhlaWdodFxuXG4gIGRyYXdZQXhpcyhvYmosIHlBeGlzT2JqLmF4aXMsIHlBeGlzT2JqLm5vZGUpO1xuXG4gIHZhciBzZXRSYW5nZVR5cGUgPSByZXF1aXJlKFwiLi9zY2FsZVwiKS5zZXRSYW5nZVR5cGUsXG4gICAgICBzZXRSYW5nZUFyZ3MgPSByZXF1aXJlKFwiLi9zY2FsZVwiKS5zZXRSYW5nZUFyZ3M7XG5cbiAgdmFyIHNjYWxlT2JqID0ge1xuICAgIHJhbmdlVHlwZTogc2V0UmFuZ2VUeXBlKG9iai54QXhpcyksXG4gICAgcmFuZ2U6IHhBeGlzT2JqLnJhbmdlIHx8IFswLCBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKV0sXG4gICAgYmFuZHM6IG9iai5kaW1lbnNpb25zLmJhbmRzLFxuICAgIHJhbmdlUG9pbnRzOiBvYmoueEF4aXMucmFuZ2VQb2ludHNcbiAgfTtcblxuICBzZXRSYW5nZUFyZ3MoeEF4aXNPYmouYXhpcy5zY2FsZSgpLCBzY2FsZU9iaik7XG5cbiAgdmFyIHByZXZYQXhpc0hlaWdodCA9IG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0O1xuXG4gIHhBeGlzT2JqID0gYXhpc01hbmFnZXIobm9kZSwgb2JqLCB4QXhpc09iai5heGlzLnNjYWxlKCksIFwieEF4aXNcIik7XG5cbiAgeEF4aXNPYmoubm9kZVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsXCIpIHtcbiAgICBkcm9wT3ZlcnNldFRpY2tzKHhBeGlzT2JqLm5vZGUsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKTtcbiAgfVxuXG4gIGlmIChwcmV2WEF4aXNIZWlnaHQgIT09IG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSB7XG4gICAgZHJhd1lBeGlzKG9iaiwgeUF4aXNPYmouYXhpcywgeUF4aXNPYmoubm9kZSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBhZGRaZXJvTGluZShvYmosIG5vZGUsIEF4aXMsIGF4aXNUeXBlKSB7XG5cbiAgdmFyIHRpY2tzID0gQXhpcy5heGlzLnRpY2tWYWx1ZXMoKSxcbiAgICAgIHRpY2tNaW4gPSB0aWNrc1swXSxcbiAgICAgIHRpY2tNYXggPSB0aWNrc1t0aWNrcy5sZW5ndGggLSAxXTtcblxuICBpZiAoKHRpY2tNaW4gPD0gMCkgJiYgKDAgPD0gdGlja01heCkpIHtcblxuICAgIHZhciByZWZHcm91cCA9IEF4aXMubm9kZS5zZWxlY3RBbGwoXCIudGljazpub3QoLlwiICsgb2JqLnByZWZpeCArIFwibWlub3IpXCIpLFxuICAgICAgICByZWZMaW5lID0gcmVmR3JvdXAuc2VsZWN0KFwibGluZVwiKTtcblxuICAgIC8vIHplcm8gbGluZVxuICAgIHZhciB6ZXJvTGluZSA9IG5vZGUuYXBwZW5kKFwibGluZVwiKVxuICAgICAgLnN0eWxlKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwiY3Jpc3BFZGdlc1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ6ZXJvLWxpbmVcIik7XG5cbiAgICB2YXIgdHJhbnNmb3JtID0gWzAsIDBdO1xuXG4gICAgdHJhbnNmb3JtWzBdICs9IGQzLnRyYW5zZm9ybShub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBheGlzVHlwZSkuYXR0cihcInRyYW5zZm9ybVwiKSkudHJhbnNsYXRlWzBdO1xuICAgIHRyYW5zZm9ybVsxXSArPSBkMy50cmFuc2Zvcm0obm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgYXhpc1R5cGUpLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVsxXTtcbiAgICB0cmFuc2Zvcm1bMF0gKz0gZDMudHJhbnNmb3JtKHJlZkdyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVswXTtcbiAgICB0cmFuc2Zvcm1bMV0gKz0gZDMudHJhbnNmb3JtKHJlZkdyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIikpLnRyYW5zbGF0ZVsxXTtcblxuICAgIGlmIChheGlzVHlwZSA9PT0gXCJ4QXhpc1wiKSB7XG5cbiAgICAgIHplcm9MaW5lLmF0dHIoe1xuICAgICAgICBcInkxXCI6IHJlZkxpbmUuYXR0cihcInkxXCIpLFxuICAgICAgICBcInkyXCI6IHJlZkxpbmUuYXR0cihcInkyXCIpLFxuICAgICAgICBcIngxXCI6IDAsXG4gICAgICAgIFwieDJcIjogMCxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2Zvcm1bMF0gKyBcIixcIiArIHRyYW5zZm9ybVsxXSArIFwiKVwiXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuXG4gICAgICB6ZXJvTGluZS5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiByZWZMaW5lLmF0dHIoXCJ4MVwiKSxcbiAgICAgICAgXCJ4MlwiOiByZWZMaW5lLmF0dHIoXCJ4MlwiKSxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IDAsXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgdHJhbnNmb3JtWzBdICsgXCIsXCIgKyB0cmFuc2Zvcm1bMV0gKyBcIilcIlxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZWZMaW5lLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG5cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBeGlzRmFjdG9yeTogQXhpc0ZhY3RvcnksXG4gIGF4aXNNYW5hZ2VyOiBheGlzTWFuYWdlcixcbiAgZGV0ZXJtaW5lRm9ybWF0OiBkZXRlcm1pbmVGb3JtYXQsXG4gIGFwcGVuZFhBeGlzOiBhcHBlbmRYQXhpcyxcbiAgYXBwZW5kWUF4aXM6IGFwcGVuZFlBeGlzLFxuICBkcmF3WUF4aXM6IGRyYXdZQXhpcyxcbiAgdGltZUF4aXM6IHRpbWVBeGlzLFxuICBkaXNjcmV0ZUF4aXM6IGRpc2NyZXRlQXhpcyxcbiAgb3JkaW5hbFRpbWVBeGlzOiBvcmRpbmFsVGltZUF4aXMsXG4gIHNldFRpY2tGb3JtYXRYOiBzZXRUaWNrRm9ybWF0WCxcbiAgc2V0VGlja0Zvcm1hdFk6IHNldFRpY2tGb3JtYXRZLFxuICB1cGRhdGVUZXh0WDogdXBkYXRlVGV4dFgsXG4gIHVwZGF0ZVRleHRZOiB1cGRhdGVUZXh0WSxcbiAgcmVwb3NpdGlvblRleHRZOiByZXBvc2l0aW9uVGV4dFksXG4gIG5ld1RleHROb2RlOiBuZXdUZXh0Tm9kZSxcbiAgZHJvcFRpY2tzOiBkcm9wVGlja3MsXG4gIGRyb3BPdmVyc2V0VGlja3M6IGRyb3BPdmVyc2V0VGlja3MsXG4gIGRyb3BSZWR1bmRhbnRUaWNrczogZHJvcFJlZHVuZGFudFRpY2tzLFxuICB0aWNrRmluZGVyWDogdGlja0ZpbmRlclgsXG4gIHRpY2tGaW5kZXJZOiB0aWNrRmluZGVyWSxcbiAgYXhpc0NsZWFudXA6IGF4aXNDbGVhbnVwLFxuICBhZGRaZXJvTGluZTogYWRkWmVyb0xpbmVcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL2F4aXMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gc2NhbGVNYW5hZ2VyKG9iaiwgYXhpc1R5cGUpIHtcblxuICB2YXIgYXhpcyA9IG9ialtheGlzVHlwZV0sXG4gICAgICBzY2FsZU9iaiA9IG5ldyBTY2FsZU9iaihvYmosIGF4aXMsIGF4aXNUeXBlKTtcblxuICB2YXIgc2NhbGUgPSBzZXRTY2FsZVR5cGUoc2NhbGVPYmoudHlwZSk7XG5cbiAgc2NhbGUuZG9tYWluKHNjYWxlT2JqLmRvbWFpbik7XG5cbiAgc2V0UmFuZ2VBcmdzKHNjYWxlLCBzY2FsZU9iaik7XG5cbiAgaWYgKGF4aXMubmljZSkgeyBuaWNlaWZ5KHNjYWxlLCBheGlzVHlwZSwgc2NhbGVPYmopOyB9XG4gIGlmIChheGlzLnJlc2NhbGUpIHsgcmVzY2FsZShzY2FsZSwgYXhpc1R5cGUsIGF4aXMpOyB9XG5cbiAgcmV0dXJuIHtcbiAgICBvYmo6IHNjYWxlT2JqLFxuICAgIHNjYWxlOiBzY2FsZVxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIFNjYWxlT2JqKG9iaiwgYXhpcywgYXhpc1R5cGUpIHtcbiAgdGhpcy50eXBlID0gYXhpcy5zY2FsZTtcbiAgdGhpcy5kb21haW4gPSBzZXREb21haW4ob2JqLCBheGlzKTtcbiAgdGhpcy5yYW5nZVR5cGUgPSBzZXRSYW5nZVR5cGUoYXhpcyk7XG4gIHRoaXMucmFuZ2UgPSBzZXRSYW5nZShvYmosIGF4aXNUeXBlKTtcbiAgdGhpcy5iYW5kcyA9IG9iai5kaW1lbnNpb25zLmJhbmRzO1xuICB0aGlzLnJhbmdlUG9pbnRzID0gYXhpcy5yYW5nZVBvaW50cyB8fCAxLjA7XG59XG5cbmZ1bmN0aW9uIHNldFNjYWxlVHlwZSh0eXBlKSB7XG5cbiAgdmFyIHNjYWxlVHlwZTtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMudGltZS5zY2FsZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5vcmRpbmFsKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpZGVudGl0eVwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUuaWRlbnRpdHkoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJwb3dcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnBvdygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNxcnRcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLnNxcnQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsb2dcIjpcbiAgICAgIHNjYWxlVHlwZSA9IGQzLnNjYWxlLmxvZygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInF1YW50aXplXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5xdWFudGl6ZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInF1YW50aWxlXCI6XG4gICAgICBzY2FsZVR5cGUgPSBkMy5zY2FsZS5xdWFudGlsZSgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRocmVzaG9sZFwiOlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUudGhyZXNob2xkKCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgc2NhbGVUeXBlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBzY2FsZVR5cGU7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2VUeXBlKGF4aXMpIHtcblxuICB2YXIgdHlwZTtcblxuICBzd2l0Y2goYXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgY2FzZSBcImxpbmVhclwiOlxuICAgICAgdHlwZSA9IFwicmFuZ2VcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsXCI6XG4gICAgY2FzZSBcImRpc2NyZXRlXCI6XG4gICAgICB0eXBlID0gXCJyYW5nZVJvdW5kQmFuZHNcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcbiAgICAgIHR5cGUgPSBcInJhbmdlUG9pbnRzXCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdHlwZSA9IFwicmFuZ2VcIjtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHR5cGU7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2Uob2JqLCBheGlzVHlwZSkge1xuXG4gIHZhciByYW5nZTtcblxuICBpZiAoYXhpc1R5cGUgPT09IFwieEF4aXNcIikge1xuICAgIHJhbmdlID0gWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXTsgLy8gb3BlcmF0aW5nIG9uIHdpZHRoXG4gIH0gZWxzZSBpZiAoYXhpc1R5cGUgPT09IFwieUF4aXNcIikge1xuICAgIHJhbmdlID0gW29iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KCksIDBdOyAvLyBvcGVyYXRpbmcgb24gaGVpZ2h0XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG5cbn1cblxuZnVuY3Rpb24gc2V0UmFuZ2VBcmdzKHNjYWxlLCBzY2FsZU9iaikge1xuXG4gIHN3aXRjaCAoc2NhbGVPYmoucmFuZ2VUeXBlKSB7XG4gICAgY2FzZSBcInJhbmdlXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSk7XG4gICAgY2FzZSBcInJhbmdlUm91bmRCYW5kc1wiOlxuICAgICAgcmV0dXJuIHNjYWxlW3NjYWxlT2JqLnJhbmdlVHlwZV0oc2NhbGVPYmoucmFuZ2UsIHNjYWxlT2JqLmJhbmRzLnBhZGRpbmcsIHNjYWxlT2JqLmJhbmRzLm91dGVyUGFkZGluZyk7XG4gICAgY2FzZSBcInJhbmdlUG9pbnRzXCI6XG4gICAgICByZXR1cm4gc2NhbGVbc2NhbGVPYmoucmFuZ2VUeXBlXShzY2FsZU9iai5yYW5nZSwgc2NhbGVPYmoucmFuZ2VQb2ludHMpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gc2V0RG9tYWluKG9iaiwgYXhpcykge1xuXG4gIHZhciBkYXRhID0gb2JqLmRhdGE7XG4gIHZhciBkb21haW47XG5cbiAgLy8gaW5jbHVkZWQgZmFsbGJhY2tzIGp1c3QgaW4gY2FzZVxuICBzd2l0Y2goYXhpcy5zY2FsZSkge1xuICAgIGNhc2UgXCJ0aW1lXCI6XG4gICAgICBkb21haW4gPSBzZXREYXRlRG9tYWluKGRhdGEsIGF4aXMubWluLCBheGlzLm1heCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGluZWFyXCI6XG4gICAgICB2YXIgY2hhcnRUeXBlID0gb2JqLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICBmb3JjZU1heFZhbDtcbiAgICAgIGlmIChjaGFydFR5cGUgPT09IFwiYXJlYVwiIHx8IGNoYXJ0VHlwZSA9PT0gXCJjb2x1bW5cIiB8fCBjaGFydFR5cGUgPT09IFwiYmFyXCIpIHtcbiAgICAgICAgZm9yY2VNYXhWYWwgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZG9tYWluID0gc2V0TnVtZXJpY2FsRG9tYWluKGRhdGEsIGF4aXMubWluLCBheGlzLm1heCwgb2JqLm9wdGlvbnMuc3RhY2tlZCwgZm9yY2VNYXhWYWwpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG4gICAgICBkb21haW4gPSBzZXREaXNjcmV0ZURvbWFpbihkYXRhKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIGRvbWFpbjtcblxufVxuXG5mdW5jdGlvbiBzZXREYXRlRG9tYWluKGRhdGEsIG1pbiwgbWF4KSB7XG4gIGlmIChtaW4gJiYgbWF4KSB7XG4gICAgdmFyIHN0YXJ0RGF0ZSA9IG1pbiwgZW5kRGF0ZSA9IG1heDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZGF0ZVJhbmdlID0gZDMuZXh0ZW50KGRhdGEuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0pO1xuICAgIHZhciBzdGFydERhdGUgPSBtaW4gfHwgbmV3IERhdGUoZGF0ZVJhbmdlWzBdKSxcbiAgICAgICAgZW5kRGF0ZSA9IG1heCB8fCBuZXcgRGF0ZShkYXRlUmFuZ2VbMV0pO1xuICB9XG4gIHJldHVybiBbc3RhcnREYXRlLCBlbmREYXRlXTtcbn1cblxuZnVuY3Rpb24gc2V0TnVtZXJpY2FsRG9tYWluKGRhdGEsIG1pbiwgbWF4LCBzdGFja2VkLCBmb3JjZU1heFZhbCkge1xuXG4gIHZhciBtaW5WYWwsIG1heFZhbDtcbiAgdmFyIG1BcnIgPSBbXTtcblxuICBkMy5tYXAoZGF0YS5kYXRhLCBmdW5jdGlvbihkKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBkLnNlcmllcy5sZW5ndGg7IGorKykge1xuICAgICAgbUFyci5wdXNoKE51bWJlcihkLnNlcmllc1tqXS52YWwpKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChzdGFja2VkKSB7XG4gICAgbWF4VmFsID0gZDMubWF4KGRhdGEuc3RhY2tlZERhdGFbZGF0YS5zdGFja2VkRGF0YS5sZW5ndGggLSAxXSwgZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIChkLnkwICsgZC55KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBtYXhWYWwgPSBkMy5tYXgobUFycik7XG4gIH1cblxuICBtaW5WYWwgPSBkMy5taW4obUFycik7XG5cbiAgaWYgKG1pbikge1xuICAgIG1pblZhbCA9IG1pbjtcbiAgfSBlbHNlIGlmIChtaW5WYWwgPiAwKSB7XG4gICAgbWluVmFsID0gMDtcbiAgfVxuXG4gIGlmIChtYXgpIHtcbiAgICBtYXhWYWwgPSBtYXg7XG4gIH0gZWxzZSBpZiAobWF4VmFsIDwgMCAmJiBmb3JjZU1heFZhbCkge1xuICAgIG1heFZhbCA9IDA7XG4gIH1cblxuICByZXR1cm4gW21pblZhbCwgbWF4VmFsXTtcblxufVxuXG5mdW5jdGlvbiBzZXREaXNjcmV0ZURvbWFpbihkYXRhKSB7XG4gIHJldHVybiBkYXRhLmRhdGEubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQua2V5OyB9KTtcbn1cblxuZnVuY3Rpb24gcmVzY2FsZShzY2FsZSwgYXhpc1R5cGUsIGF4aXNPYmopIHtcblxuICBzd2l0Y2goYXhpc09iai5zY2FsZSkge1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIGlmICghYXhpc09iai5tYXgpIHsgcmVzY2FsZU51bWVyaWNhbChzY2FsZSwgYXhpc09iaik7IH1cbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc2NhbGVOdW1lcmljYWwoc2NhbGUsIGF4aXNPYmopIHtcblxuICAvLyByZXNjYWxlcyB0aGUgXCJ0b3BcIiBlbmQgb2YgdGhlIGRvbWFpblxuICB2YXIgdGlja3MgPSBzY2FsZS50aWNrcygxMCkuc2xpY2UoKSxcbiAgICAgIHRpY2tJbmNyID0gTWF0aC5hYnModGlja3NbdGlja3MubGVuZ3RoIC0gMV0pIC0gTWF0aC5hYnModGlja3NbdGlja3MubGVuZ3RoIC0gMl0pO1xuXG4gIHZhciBuZXdNYXggPSB0aWNrc1t0aWNrcy5sZW5ndGggLSAxXSArIHRpY2tJbmNyO1xuXG4gIHNjYWxlLmRvbWFpbihbc2NhbGUuZG9tYWluKClbMF0sIG5ld01heF0pO1xuXG59XG5cbmZ1bmN0aW9uIG5pY2VpZnkoc2NhbGUsIGF4aXNUeXBlLCBzY2FsZU9iaikge1xuXG4gIHN3aXRjaChzY2FsZU9iai50eXBlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcbiAgICAgIHZhciB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZjtcbiAgICAgIHZhciBjb250ZXh0ID0gdGltZURpZmYoc2NhbGUuZG9tYWluKClbMF0sIHNjYWxlLmRvbWFpbigpWzFdLCAzKTtcbiAgICAgIG5pY2VpZnlUaW1lKHNjYWxlLCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsaW5lYXJcIjpcbiAgICAgIG5pY2VpZnlOdW1lcmljYWwoc2NhbGUpO1xuICAgICAgYnJlYWs7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBuaWNlaWZ5VGltZShzY2FsZSwgY29udGV4dCkge1xuICB2YXIgZ2V0VGltZUludGVydmFsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVJbnRlcnZhbDtcbiAgdmFyIHRpbWVJbnRlcnZhbCA9IGdldFRpbWVJbnRlcnZhbChjb250ZXh0KTtcbiAgc2NhbGUuZG9tYWluKHNjYWxlLmRvbWFpbigpKS5uaWNlKHRpbWVJbnRlcnZhbCk7XG59XG5cbmZ1bmN0aW9uIG5pY2VpZnlOdW1lcmljYWwoc2NhbGUpIHtcbiAgc2NhbGUuZG9tYWluKHNjYWxlLmRvbWFpbigpKS5uaWNlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzY2FsZU1hbmFnZXI6IHNjYWxlTWFuYWdlcixcbiAgU2NhbGVPYmo6IFNjYWxlT2JqLFxuICBzZXRTY2FsZVR5cGU6IHNldFNjYWxlVHlwZSxcbiAgc2V0UmFuZ2VUeXBlOiBzZXRSYW5nZVR5cGUsXG4gIHNldFJhbmdlQXJnczogc2V0UmFuZ2VBcmdzLFxuICBzZXRSYW5nZTogc2V0UmFuZ2UsXG4gIHNldERvbWFpbjogc2V0RG9tYWluLFxuICBzZXREYXRlRG9tYWluOiBzZXREYXRlRG9tYWluLFxuICBzZXROdW1lcmljYWxEb21haW46IHNldE51bWVyaWNhbERvbWFpbixcbiAgc2V0RGlzY3JldGVEb21haW46IHNldERpc2NyZXRlRG9tYWluLFxuICByZXNjYWxlOiByZXNjYWxlLFxuICByZXNjYWxlTnVtZXJpY2FsOiByZXNjYWxlTnVtZXJpY2FsLFxuICBuaWNlaWZ5OiBuaWNlaWZ5LFxuICBuaWNlaWZ5VGltZTogbmljZWlmeVRpbWUsXG4gIG5pY2VpZnlOdW1lcmljYWw6IG5pY2VpZnlOdW1lcmljYWxcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3NjYWxlLmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIE11bHRpTGluZUNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgLy8gU2Vjb25kYXJ5IGFycmF5IGlzIHVzZWQgdG8gc3RvcmUgYSByZWZlcmVuY2UgdG8gYWxsIHNlcmllcyBleGNlcHQgZm9yIHRoZSBoaWdobGlnaHRlZCBpdGVtXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBbXTtcblxuICBmb3IgKHZhciBpID0gb2JqLmRhdGEuc2VyaWVzQW1vdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAvLyBEb250IHdhbnQgdG8gaW5jbHVkZSB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSBpbiB0aGUgbG9vcFxuICAgIC8vIGJlY2F1c2Ugd2UgYWx3YXlzIHdhbnQgaXQgdG8gc2l0IGFib3ZlIGFsbCB0aGUgb3RoZXIgbGluZXNcblxuICAgIGlmIChpICE9PSBvYmouc2VyaWVzSGlnaGxpZ2h0KCkpIHtcblxuICAgICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tpXS52YWwpOyB9KVxuICAgICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC5rZXkpOyB9KVxuICAgICAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbaV0udmFsKTsgfSk7XG5cbiAgICAgIHZhciBwYXRoUmVmID0gc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAuZGF0dW0ob2JqLmRhdGEuZGF0YSlcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZFwiOiBsaW5lLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aWxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoTGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgc2VyaWVzR3JvdXAuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5kYXR1bShvYmouZGF0YS5kYXRhKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibXVsdGlsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlsaW5lLVwiICsgKG9iai5zZXJpZXNIaWdobGlnaHQoKSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfSxcbiAgICAgIFwiZFwiOiBoTGluZVxuICAgIH0pO1xuXG4gIGF4aXNNb2R1bGUuYWRkWmVyb0xpbmUob2JqLCBub2RlLCB5QXhpc09iaiwgXCJ5QXhpc1wiKTtcblxuICByZXR1cm4ge1xuICAgIHhTY2FsZU9iajogeFNjYWxlT2JqLFxuICAgIHlTY2FsZU9iajogeVNjYWxlT2JqLFxuICAgIHhBeGlzT2JqOiB4QXhpc09iaixcbiAgICB5QXhpc09iajogeUF4aXNPYmosXG4gICAgc2VyaWVzR3JvdXA6IHNlcmllc0dyb3VwLFxuICAgIGhMaW5lOiBoTGluZSxcbiAgICBsaW5lOiBsaW5lXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTXVsdGlMaW5lQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9tdWx0aWxpbmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gQXJlYUNoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgLy8gd2hhP1xuICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID09PSAxKSB7IG9iai5zZXJpZXNIaWdobGlnaHQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH0gfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsaXBsZScgY2xhc3Mgc28gd2UgY2FuIHRhcmdldFxuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KTtcblxuICAvLyBTZWNvbmRhcnkgYXJyYXkgaXMgdXNlZCB0byBzdG9yZSBhIHJlZmVyZW5jZSB0byBhbGwgc2VyaWVzIGV4Y2VwdCBmb3IgdGhlIGhpZ2hsaWdodGVkIGl0ZW1cbiAgdmFyIHNlY29uZGFyeUFyciA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSBvYmouZGF0YS5zZXJpZXNBbW91bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgIC8vIERvbnQgd2FudCB0byBpbmNsdWRlIHRoZSBoaWdobGlnaHRlZCBpdGVtIGluIHRoZSBsb29wXG4gICAgLy8gYmVjYXVzZSB3ZSBhbHdheXMgd2FudCBpdCB0byBzaXQgYWJvdmUgYWxsIHRoZSBvdGhlciBsaW5lc1xuXG4gICAgaWYgKGkgIT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuXG4gICAgICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAgICAgLmRlZmluZWQoZnVuY3Rpb24oZCkgeyByZXR1cm4gIWlzTmFOKGQuc2VyaWVzW2ldLnZhbCk7IH0pXG4gICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgICAgIC55MCh5U2NhbGUoMCkpXG4gICAgICAgIC55MShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbaV0udmFsKTsgfSk7XG5cbiAgICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgICAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbaV0udmFsKTsgfSlcbiAgICAgICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW2ldLnZhbCk7IH0pO1xuXG4gICAgICB2YXIgcGF0aFJlZiA9IHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogYXJlYSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwiZmlsbCBcIiArIG9iai5wcmVmaXggKyBcImZpbGwtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlcmllc0dyb3VwLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImRcIjogbGluZSxcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwibGluZSBcIiArIG9iai5wcmVmaXggKyBcImxpbmUtXCIgKyAoaSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIHNlY29uZGFyeUFyci5wdXNoKHBhdGhSZWYpO1xuICAgIH1cblxuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgc2Vjb25kYXJ5IHNlcmllcyAoYWxsIHNlcmllcyBleGNlcHQgdGhlIGhpZ2hsaWdodGVkIG9uZSlcbiAgLy8gYW5kIHNldCB0aGUgY29sb3VycyBpbiB0aGUgY29ycmVjdCBvcmRlclxuXG4gIHZhciBzZWNvbmRhcnlBcnIgPSBzZWNvbmRhcnlBcnIucmV2ZXJzZSgpO1xuXG4gIHZhciBoQXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLmtleSk7IH0pXG4gICAgLnkwKHlTY2FsZSgwKSlcbiAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQuc2VyaWVzW29iai5zZXJpZXNIaWdobGlnaHQoKV0udmFsKTsgfSk7XG5cbiAgdmFyIGhMaW5lID0gZDMuc3ZnLmxpbmUoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC5kZWZpbmVkKGZ1bmN0aW9uKGQpIHsgcmV0dXJuICFpc05hTihkLnNlcmllc1tvYmouc2VyaWVzSGlnaGxpZ2h0KCldLnZhbCk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQua2V5KTsgfSlcbiAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC5zZXJpZXNbb2JqLnNlcmllc0hpZ2hsaWdodCgpXS52YWwpOyB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJkXCI6IGhBcmVhLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICBzZXJpZXNHcm91cC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmRhdHVtKG9iai5kYXRhLmRhdGEpXG4gICAgLmF0dHIoe1xuICAgICAgXCJkXCI6IGhMaW5lLFxuICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIixcbiAgICAgIFwiY2xhc3NcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChvYmouc2VyaWVzSGlnaGxpZ2h0KCkpICsgXCIgXCIgKyBvYmoucHJlZml4ICsgXCJoaWdobGlnaHRcIjtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBoTGluZTogaExpbmUsXG4gICAgaEFyZWE6IGhBcmVhLFxuICAgIGxpbmU6IGxpbmUsXG4gICAgYXJlYTogYXJlYVxuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFyZWFDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2FyZWEuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gU3RhY2tlZEFyZWFDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIGlmICh4U2NhbGVPYmoub2JqLnR5cGUgPT09IFwib3JkaW5hbFwiKSB7XG4gICAgeFNjYWxlLnJhbmdlUm91bmRQb2ludHMoWzAsIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpXSwgMS4wKTtcbiAgfVxuXG4gIC8vIHdoYT9cbiAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA9PT0gMSkgeyBvYmouc2VyaWVzSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9IH1cblxuICBub2RlLmNsYXNzZWQob2JqLnByZWZpeCArIFwic3RhY2tlZFwiLCB0cnVlKTtcblxuICB2YXIgc2VyaWVzR3JvdXAgPSBub2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllc19ncm91cFwiO1xuICAgICAgaWYgKG9iai5kYXRhLnNlcmllc0Ftb3VudCA+IDEpIHtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIG9uZSBzZXJpZXMgYXBwZW5kIGEgJ211bGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG5cbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJzdmc6Z1wiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIsXG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKTtcbiAgICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICAgIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICB9KTtcblxuICB2YXIgYXJlYSA9IGQzLnN2Zy5hcmVhKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC55MCArIGQueSk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwKTsgfSlcbiAgICAueTEoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKCkuaW50ZXJwb2xhdGUob2JqLm9wdGlvbnMuaW50ZXJwb2xhdGlvbilcbiAgICAuZGVmaW5lZChmdW5jdGlvbihkKSB7IHJldHVybiAhaXNOYU4oZC55MCArIGQueSk7IH0pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcImZpbGwgXCIgKyBvYmoucHJlZml4ICsgXCJmaWxsLVwiICsgKGkpO1xuICAgICAgaWYgKGkgPT09IG9iai5zZXJpZXNIaWdobGlnaHQoKSkge1xuICAgICAgICBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJmaWxsIFwiICsgb2JqLnByZWZpeCArIFwiZmlsbC1cIiArIChpKSArIFwiIFwiICsgb2JqLnByZWZpeCArIFwiaGlnaGxpZ2h0XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJkXCIsIGFyZWEpO1xuXG4gIHNlcmllcy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJsaW5lIFwiICsgb2JqLnByZWZpeCArIFwibGluZS1cIiArIChpKTsgfSlcbiAgICAuYXR0cihcImRcIiwgbGluZSk7XG5cbiAgYXhpc01vZHVsZS5hZGRaZXJvTGluZShvYmosIG5vZGUsIHlBeGlzT2JqLCBcInlBeGlzXCIpO1xuXG4gIHJldHVybiB7XG4gICAgeFNjYWxlT2JqOiB4U2NhbGVPYmosXG4gICAgeVNjYWxlT2JqOiB5U2NhbGVPYmosXG4gICAgeEF4aXNPYmo6IHhBeGlzT2JqLFxuICAgIHlBeGlzT2JqOiB5QXhpc09iaixcbiAgICBzZXJpZXNHcm91cDogc2VyaWVzR3JvdXAsXG4gICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgbGluZTogbGluZSxcbiAgICBhcmVhOiBhcmVhXG4gIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2tlZEFyZWFDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL3N0YWNrZWQtYXJlYS5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBDb2x1bW5DaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgICBzY2FsZU1vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL3NjYWxlXCIpLFxuICAgICAgQXhpcyA9IGF4aXNNb2R1bGUuYXhpc01hbmFnZXIsXG4gICAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyAgc2NhbGVzXG4gIHZhciB4U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInhBeGlzXCIpLFxuICAgICAgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZSwgeVNjYWxlID0geVNjYWxlT2JqLnNjYWxlO1xuXG4gIC8vIGF4ZXNcbiAgdmFyIHhBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB4U2NhbGVPYmouc2NhbGUsIFwieEF4aXNcIiksXG4gICAgICB5QXhpc09iaiA9IG5ldyBBeGlzKG5vZGUsIG9iaiwgeVNjYWxlT2JqLnNjYWxlLCBcInlBeGlzXCIpO1xuXG4gIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gIHN3aXRjaCAob2JqLnhBeGlzLnNjYWxlKSB7XG4gICAgY2FzZSBcInRpbWVcIjpcblxuICAgICAgdmFyIHRpbWVJbnRlcnZhbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lSW50ZXJ2YWwsXG4gICAgICAgICAgdGltZUVsYXBzZWQgPSB0aW1lSW50ZXJ2YWwob2JqLmRhdGEuZGF0YSkgKyAxO1xuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gdGltZUVsYXBzZWQgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG5cbiAgICAgIHhBeGlzT2JqLnJhbmdlID0gWzAsIChvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gKiBvYmouZGF0YS5zZXJpZXNBbW91bnQpKV07XG5cbiAgICAgIGF4aXNNb2R1bGUuYXhpc0NsZWFudXAobm9kZSwgb2JqLCB4QXhpc09iaiwgeUF4aXNPYmopO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbC10aW1lXCI6XG5cbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUob2JqLmRhdGEuZGF0YVsxXS5rZXkpIC0geFNjYWxlKG9iai5kYXRhLmRhdGFbMF0ua2V5KTtcblxuICAgICAgbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwLlwiICsgb2JqLnByZWZpeCArIFwieEF4aXNcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uIC8gMikpICsgXCIsXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSAtIG9iai5kaW1lbnNpb25zLnhBeGlzSGVpZ2h0KSArIFwiKVwiKTtcblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSB4U2NhbGUucmFuZ2VCYW5kKCkgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gb25lIHNlcmllcyBhcHBlbmQgYSAnbXVsdGlwbGUnIGNsYXNzIHNvIHdlIGNhbiB0YXJnZXRcbiAgICAgICAgb3V0cHV0ICs9IFwiIFwiICsgb2JqLnByZWZpeCArIFwibXVsdGlwbGVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSlcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4T2Zmc2V0O1xuICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSA9PT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICB4T2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoc2luZ2xlQ29sdW1uIC8gMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4T2Zmc2V0ID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4T2Zmc2V0ICsgXCIsMClcIjtcbiAgICB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5kYXRhLnNlcmllc0Ftb3VudDsgaSsrKSB7XG5cbiAgICB2YXIgc2VyaWVzID0gc2VyaWVzR3JvdXAuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwic2VyaWVzX1wiICsgaSk7XG5cbiAgICB2YXIgY29sdW1uSXRlbSA9IHNlcmllc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcImNvbHVtblwiKVxuICAgICAgLmRhdGEob2JqLmRhdGEuZGF0YSkuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJjb2x1bW4gXCIgKyBvYmoucHJlZml4ICsgXCJjb2x1bW4tXCIgKyAoaSksXG4gICAgICAgIFwiZGF0YS1zZXJpZXNcIjogaSxcbiAgICAgICAgXCJkYXRhLWtleVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgICAgXCJkYXRhLWxlZ2VuZFwiOiBmdW5jdGlvbigpIHsgcmV0dXJuIG9iai5kYXRhLmtleXNbaSArIDFdOyB9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKG9iai54QXhpcy5zY2FsZSAhPT0gXCJvcmRpbmFsLXRpbWVcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeFNjYWxlKGQua2V5KSArIFwiLDApXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGNvbHVtbkl0ZW0uYXBwZW5kKFwicmVjdFwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gZC5zZXJpZXNbaV0udmFsIDwgMCA/IFwibmVnYXRpdmVcIiA6IFwicG9zaXRpdmVcIjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBpZiAob2JqLnhBeGlzLnNjYWxlICE9PSBcIm9yZGluYWwtdGltZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gaSAqIHNpbmdsZUNvbHVtbjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkLmtleSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwieVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKGQuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB5U2NhbGUoTWF0aC5tYXgoMCwgZC5zZXJpZXNbaV0udmFsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhlaWdodFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaWYgKGQuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh5U2NhbGUoZC5zZXJpZXNbaV0udmFsKSAtIHlTY2FsZSgwKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpZHRoXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBzaW5nbGVDb2x1bW47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzaW5nbGVDb2x1bW4gLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG5cbiAgICAgIHZhciBjb2x1bW5PZmZzZXQgPSBvYmouZGltZW5zaW9ucy5iYW5kcy5vZmZzZXQ7XG5cbiAgICAgIGNvbHVtbkl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICgoaSAqIHNpbmdsZUNvbHVtbikgKyAoc2luZ2xlQ29sdW1uICogKGNvbHVtbk9mZnNldCAvIDIpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geFNjYWxlKGQua2V5KSArIChpICogKHNpbmdsZUNvbHVtbiAvIG9iai5kYXRhLnNlcmllc0Ftb3VudCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ3aWR0aFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgIT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChzaW5nbGVDb2x1bW4gLSAoc2luZ2xlQ29sdW1uICogY29sdW1uT2Zmc2V0KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlQ29sdW1uIC8gb2JqLmRhdGEuc2VyaWVzQW1vdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBzaW5nbGVDb2x1bW46IHNpbmdsZUNvbHVtbixcbiAgICBjb2x1bW5JdGVtOiBjb2x1bW5JdGVtXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2x1bW5DaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2NvbHVtbi5qc1xuICoqIG1vZHVsZSBpZCA9IDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBCYXJDaGFydChub2RlLCBvYmopIHtcblxuICB2YXIgYXhpc01vZHVsZSA9IHJlcXVpcmUoXCIuLi9jb21wb25lbnRzL2F4aXNcIiksXG4gICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICBTY2FsZSA9IHNjYWxlTW9kdWxlLnNjYWxlTWFuYWdlcjtcblxuICAvLyBiZWNhdXNlIHRoZSBlbGVtZW50cyB3aWxsIGJlIGFwcGVuZGVkIGluIHJldmVyc2UgZHVlIHRvIHRoZVxuICAvLyBiYXIgY2hhcnQgb3BlcmF0aW5nIG9uIHRoZSB5LWF4aXMsIG5lZWQgdG8gcmV2ZXJzZSB0aGUgZGF0YXNldC5cbiAgb2JqLmRhdGEuZGF0YS5yZXZlcnNlKCk7XG5cbiAgdmFyIHhBeGlzT2Zmc2V0ID0gOTtcblxuICB2YXIgeFNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ4QXhpc1wiKSxcbiAgICAgIHhTY2FsZSA9IHhTY2FsZU9iai5zY2FsZTtcblxuICB2YXIgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgLnNjYWxlKHhTY2FsZSlcbiAgICAub3JpZW50KFwiYm90dG9tXCIpO1xuXG4gIHZhciB4QXhpc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcInhBeGlzXCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIik7XG5cbiAgdmFyIHhBeGlzTm9kZSA9IHhBeGlzR3JvdXAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwieC1heGlzXCIpXG4gICAgLmNhbGwoeEF4aXMpO1xuXG4gIHZhciB0ZXh0TGVuZ3RocyA9IFtdO1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoXCJ5XCIsIHhBeGlzT2Zmc2V0KVxuICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdGV4dExlbmd0aHMucHVzaChkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCk7XG4gICAgfSk7XG5cbiAgdmFyIHRhbGxlc3RUZXh0ID0gdGV4dExlbmd0aHMucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIChhID4gYiA/IGEgOiBiKSB9KTtcblxuICBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCA9IHRhbGxlc3RUZXh0ICsgeEF4aXNPZmZzZXQ7XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcImdcIilcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQ7IH0pXG4gICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwibWlub3JcIiwgdHJ1ZSk7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHlTY2FsZSA9IHlTY2FsZU9iai5zY2FsZTtcblxuICAvLyBuZWVkIHRoaXMgZm9yIGZpeGVkLWhlaWdodCBiYXJzXG4gIGlmICghb2JqLmV4cG9ydGFibGUgfHwgKG9iai5leHBvcnRhYmxlICYmICFvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSkge1xuICAgIHZhciB0b3RhbEJhckhlaWdodCA9IChvYmouZGltZW5zaW9ucy5iYXJIZWlnaHQgKiBvYmouZGF0YS5kYXRhLmxlbmd0aCAqIG9iai5kYXRhLnNlcmllc0Ftb3VudCk7XG4gICAgeVNjYWxlLnJhbmdlUm91bmRCYW5kcyhbdG90YWxCYXJIZWlnaHQsIDBdLCBvYmouZGltZW5zaW9ucy5iYW5kcy5wYWRkaW5nLCBvYmouZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcpO1xuICAgIG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0ID0gdG90YWxCYXJIZWlnaHQgLSAodG90YWxCYXJIZWlnaHQgKiBvYmouZGltZW5zaW9ucy5iYW5kcy5vdXRlclBhZGRpbmcgKiAyKTtcbiAgfVxuXG4gIHZhciB5QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAuc2NhbGUoeVNjYWxlKVxuICAgIC5vcmllbnQoXCJsZWZ0XCIpO1xuXG4gIHZhciB5QXhpc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJheGlzLWdyb3VwXCIgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcInlBeGlzXCIpXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwwKVwiKTtcblxuICB2YXIgeUF4aXNOb2RlID0geUF4aXNHcm91cC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ5LWF4aXNcIilcbiAgICAuY2FsbCh5QXhpcyk7XG5cbiAgeUF4aXNOb2RlLnNlbGVjdEFsbChcImxpbmVcIikucmVtb3ZlKCk7XG4gIHlBeGlzTm9kZS5zZWxlY3RBbGwoXCJ0ZXh0XCIpLmF0dHIoXCJ4XCIsIDApO1xuXG4gIGlmIChvYmouZGltZW5zaW9ucy53aWR0aCA+IG9iai55QXhpcy53aWR0aFRocmVzaG9sZCkge1xuICAgIHZhciBtYXhMYWJlbFdpZHRoID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC8gMy41O1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXhMYWJlbFdpZHRoID0gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC8gMztcbiAgfVxuXG4gIGlmICh5QXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aCA+IG1heExhYmVsV2lkdGgpIHtcbiAgICB2YXIgd3JhcFRleHQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikud3JhcFRleHQ7XG4gICAgeUF4aXNOb2RlLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgIC5jYWxsKHdyYXBUZXh0LCBtYXhMYWJlbFdpZHRoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0c3BhbnMgPSBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKFwidHNwYW5cIiksXG4gICAgICAgICAgICB0c3BhbkNvdW50ID0gdHNwYW5zWzBdLmxlbmd0aCxcbiAgICAgICAgICAgIHRleHRIZWlnaHQgPSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJCb3goKS5oZWlnaHQ7XG4gICAgICAgIGlmICh0c3BhbkNvdW50ID4gMSkge1xuICAgICAgICAgIHRzcGFuc1xuICAgICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICBcInlcIjogKCh0ZXh0SGVpZ2h0IC8gdHNwYW5Db3VudCkgLyAyKSAtICh0ZXh0SGVpZ2h0IC8gMilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggPSB5QXhpc05vZGUubm9kZSgpLmdldEJCb3goKS53aWR0aDtcblxuICB5QXhpc0dyb3VwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgXCIsMClcIik7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLnhfYXhpcykge1xuICAgIHhBeGlzU2V0dGluZ3MgPSBvYmouZXhwb3J0YWJsZS54X2F4aXM7XG4gIH0gZWxzZSB7XG4gICAgeEF4aXNTZXR0aW5ncyA9IG9iai54QXhpcztcbiAgfVxuXG4gIHZhciB0aWNrRmluZGVyWCA9IGF4aXNNb2R1bGUudGlja0ZpbmRlclk7XG5cbiAgaWYgKG9iai54QXhpcy53aWR0aFRocmVzaG9sZCA+IG9iai5kaW1lbnNpb25zLndpZHRoKSB7XG4gICAgdmFyIHhBeGlzVGlja1NldHRpbmdzID0geyB0aWNrTG93ZXJCb3VuZDogMywgdGlja1VwcGVyQm91bmQ6IDgsIHRpY2tHb2FsOiA2IH07XG4gIH0gZWxzZSB7XG4gICAgdmFyIHhBeGlzVGlja1NldHRpbmdzID0geyB0aWNrTG93ZXJCb3VuZDogMywgdGlja1VwcGVyQm91bmQ6IDgsIHRpY2tHb2FsOiA0IH07XG4gIH1cblxuICB2YXIgdGlja3MgPSB0aWNrRmluZGVyWCh4U2NhbGUsIG9iai54QXhpcy50aWNrcywgeEF4aXNUaWNrU2V0dGluZ3MpO1xuXG4gIHhTY2FsZS5yYW5nZShbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldKTtcblxuICB4QXhpcy50aWNrVmFsdWVzKHRpY2tzKTtcblxuICB4QXhpc05vZGUuY2FsbCh4QXhpcyk7XG5cbiAgeEF4aXNOb2RlLnNlbGVjdEFsbChcIi50aWNrIHRleHRcIilcbiAgICAuYXR0cihcInlcIiwgeEF4aXNPZmZzZXQpXG4gICAgLmNhbGwoYXhpc01vZHVsZS51cGRhdGVUZXh0WCwgeEF4aXNOb2RlLCBvYmosIHhBeGlzLCBvYmoueEF4aXMpO1xuXG4gIGlmIChvYmouZXhwb3J0YWJsZSAmJiBvYmouZXhwb3J0YWJsZS5keW5hbWljSGVpZ2h0KSB7XG4gICAgLy8gd29ya2luZyB3aXRoIGEgZHluYW1pYyBiYXIgaGVpZ2h0XG4gICAgeEF4aXNHcm91cFxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpICsgXCIpXCIpO1xuICB9IGVsc2Uge1xuICAgIC8vIHdvcmtpbmcgd2l0aCBhIGZpeGVkIGJhciBoZWlnaHRcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIHRvdGFsQmFySGVpZ2h0ICsgXCIpXCIpO1xuICB9XG5cbiAgdmFyIHhBeGlzV2lkdGggPSBkMy50cmFuc2Zvcm0oeEF4aXNHcm91cC5hdHRyKFwidHJhbnNmb3JtXCIpKS50cmFuc2xhdGVbMF0gKyB4QXhpc0dyb3VwLm5vZGUoKS5nZXRCQm94KCkud2lkdGg7XG5cbiAgaWYgKHhBeGlzV2lkdGggPiBvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkpIHtcblxuICAgIHhTY2FsZS5yYW5nZShbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSAoeEF4aXNXaWR0aCAtIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSldKTtcblxuICAgIHhBeGlzTm9kZS5jYWxsKHhBeGlzKTtcblxuICAgIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCIudGljayB0ZXh0XCIpXG4gICAgICAuYXR0cihcInlcIiwgeEF4aXNPZmZzZXQpXG4gICAgICAuY2FsbChheGlzTW9kdWxlLnVwZGF0ZVRleHRYLCB4QXhpc05vZGUsIG9iaiwgeEF4aXMsIG9iai54QXhpcyk7XG5cbiAgfVxuXG4gIHZhciBzZXJpZXNHcm91cCA9IG5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gb2JqLnByZWZpeCArIFwic2VyaWVzX2dyb3VwXCI7XG4gICAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgICBvdXRwdXQgKz0gXCIgXCIgKyBvYmoucHJlZml4ICsgXCJtdWx0aXBsZVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLDApXCIpO1xuXG4gIHZhciBzaW5nbGVCYXIgPSB5U2NhbGUucmFuZ2VCYW5kKCkgLyBvYmouZGF0YS5zZXJpZXNBbW91bnQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZGF0YS5zZXJpZXNBbW91bnQ7IGkrKykge1xuXG4gICAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIGkpO1xuXG4gICAgdmFyIGJhckl0ZW0gPSBzZXJpZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJiYXJcIilcbiAgICAgIC5kYXRhKG9iai5kYXRhLmRhdGEpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwiYmFyIFwiICsgb2JqLnByZWZpeCArIFwiYmFyLVwiICsgKGkpLFxuICAgICAgICBcImRhdGEtc2VyaWVzXCI6IGksXG4gICAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5rZXk7IH0sXG4gICAgICAgIFwiZGF0YS1sZWdlbmRcIjogZnVuY3Rpb24oKSB7IHJldHVybiBvYmouZGF0YS5rZXlzW2kgKyAxXTsgfSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgwLFwiICsgeVNjYWxlKGQua2V5KSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGJhckl0ZW0uYXBwZW5kKFwicmVjdFwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gZC5zZXJpZXNbaV0udmFsIDwgMCA/IFwibmVnYXRpdmVcIiA6IFwicG9zaXRpdmVcIjtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4geFNjYWxlKE1hdGgubWluKDAsIGQuc2VyaWVzW2ldLnZhbCkpO1xuICAgICAgICB9LFxuICAgICAgICBcInlcIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGkgKiBzaW5nbGVCYXI7XG4gICAgICAgIH0sXG4gICAgICAgIFwid2lkdGhcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBNYXRoLmFicyh4U2NhbGUoZC5zZXJpZXNbaV0udmFsKSAtIHhTY2FsZSgwKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGVpZ2h0XCI6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHNpbmdsZUJhcjsgfVxuICAgICAgfSk7XG5cbiAgICBpZiAob2JqLmRhdGEuc2VyaWVzQW1vdW50ID4gMSkge1xuICAgICAgdmFyIGJhck9mZnNldCA9IG9iai5kaW1lbnNpb25zLmJhbmRzLm9mZnNldDtcbiAgICAgIGJhckl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJ5XCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICgoaSAqIHNpbmdsZUJhcikgKyAoc2luZ2xlQmFyICogKGJhck9mZnNldCAvIDIpKSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImhlaWdodFwiOiBzaW5nbGVCYXIgLSAoc2luZ2xlQmFyICogYmFyT2Zmc2V0KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJnXCIpXG4gICAgLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm1pbm9yXCIsIHRydWUpO1xuXG4gIHhBeGlzTm9kZS5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJ5MVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpIHtcbiAgICAgICAgICAvLyBkeW5hbWljIGhlaWdodCwgc28gY2FsY3VsYXRlIHdoZXJlIHRoZSB5MSBzaG91bGQgZ29cbiAgICAgICAgICByZXR1cm4gLShvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZpeGVkIGhlaWdodCwgc28gdXNlIHRoYXRcbiAgICAgICAgICByZXR1cm4gLSh0b3RhbEJhckhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInkyXCI6IDBcbiAgfSk7XG5cbiAgaWYgKG9iai5leHBvcnRhYmxlICYmIG9iai5leHBvcnRhYmxlLmR5bmFtaWNIZWlnaHQpIHtcblxuICAgIC8vIGR5bmFtaWMgaGVpZ2h0LCBvbmx5IG5lZWQgdG8gdHJhbnNmb3JtIHgtYXhpcyBncm91cFxuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0KCkgLSBvYmouZGltZW5zaW9ucy54QXhpc0hlaWdodCkgKyBcIilcIik7XG5cbiAgfSBlbHNlIHtcblxuICAgIC8vIGZpeGVkIGhlaWdodCwgc28gdHJhbnNmb3JtIGFjY29yZGluZ2x5IGFuZCBtb2RpZnkgdGhlIGRpbWVuc2lvbiBmdW5jdGlvbiBhbmQgcGFyZW50IHJlY3RzXG5cbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIixcIiArIHRvdGFsQmFySGVpZ2h0ICsgXCIpXCIpO1xuXG4gICAgb2JqLmRpbWVuc2lvbnMudG90YWxYQXhpc0hlaWdodCA9IHhBeGlzR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIG9iai5kaW1lbnNpb25zLmNvbXB1dGVkSGVpZ2h0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnRvdGFsWEF4aXNIZWlnaHQ7IH07XG5cbiAgICBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZSlcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFyZ2luID0gb2JqLmRpbWVuc2lvbnMubWFyZ2luO1xuICAgICAgICByZXR1cm4gb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKSArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xuICAgICAgfSk7XG5cbiAgICBkMy5zZWxlY3Qobm9kZS5ub2RlKCkucGFyZW50Tm9kZSkuc2VsZWN0KFwiLlwiICsgb2JqLnByZWZpeCArIFwiYmdcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgfVxuXG4gIHZhciB4QXhpc09iaiA9IHsgbm9kZTogeEF4aXNHcm91cCwgYXhpczogeEF4aXMgfSxcbiAgICAgIHlBeGlzT2JqID0geyBub2RlOiB5QXhpc0dyb3VwLCBheGlzOiB5QXhpcyB9O1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeEF4aXNPYmosIFwieEF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBzaW5nbGVCYXI6IHNpbmdsZUJhcixcbiAgICBiYXJJdGVtOiBiYXJJdGVtXG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXJDaGFydDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL3R5cGVzL2Jhci5qc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBTdGFja2VkQ29sdW1uQ2hhcnQobm9kZSwgb2JqKSB7XG5cbiAgdmFyIGF4aXNNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9heGlzXCIpLFxuICAgICAgc2NhbGVNb2R1bGUgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zY2FsZVwiKSxcbiAgICAgIEF4aXMgPSBheGlzTW9kdWxlLmF4aXNNYW5hZ2VyLFxuICAgICAgU2NhbGUgPSBzY2FsZU1vZHVsZS5zY2FsZU1hbmFnZXI7XG5cbiAgLy8gIHNjYWxlc1xuICB2YXIgeVNjYWxlT2JqID0gbmV3IFNjYWxlKG9iaiwgXCJ5QXhpc1wiKSxcbiAgICAgIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGUsXG4gICAgICB4U2NhbGUgPSB4U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgc3dpdGNoIChvYmoueEF4aXMuc2NhbGUpIHtcbiAgICBjYXNlIFwidGltZVwiOlxuXG4gICAgICB2YXIgdGltZUludGVydmFsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVJbnRlcnZhbCxcbiAgICAgICAgICB0aW1lRWxhcHNlZCA9IHRpbWVJbnRlcnZhbChvYmouZGF0YS5kYXRhKTtcbiAgICAgIHZhciBzaW5nbGVDb2x1bW4gPSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIHRpbWVFbGFwc2VkO1xuXG4gICAgICB4QXhpc09iai5yYW5nZSA9IFswLCAob2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLSBzaW5nbGVDb2x1bW4pXTtcblxuICAgICAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJvcmRpbmFsLXRpbWVcIjpcblxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZShvYmouZGF0YS5kYXRhWzFdLmtleSkgLSB4U2NhbGUob2JqLmRhdGEuZGF0YVswXS5rZXkpO1xuXG4gICAgICBub2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImF4aXMtZ3JvdXAuXCIgKyBvYmoucHJlZml4ICsgXCJ4QXhpc1wiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAtIChzaW5nbGVDb2x1bW4gLyAyKSkgKyBcIixcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZEhlaWdodCgpIC0gb2JqLmRpbWVuc2lvbnMueEF4aXNIZWlnaHQpICsgXCIpXCIpO1xuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwib3JkaW5hbFwiOlxuICAgICAgdmFyIHNpbmdsZUNvbHVtbiA9IHhTY2FsZS5yYW5nZUJhbmQoKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIjtcbiAgICAgIGlmIChvYmouZGF0YS5zZXJpZXNBbW91bnQgPiAxKSB7XG4gICAgICAgIC8vIElmIG1vcmUgdGhhbiBvbmUgc2VyaWVzIGFwcGVuZCBhICdtdWxpcGxlJyBjbGFzcyBzbyB3ZSBjYW4gdGFyZ2V0XG4gICAgICAgIG91dHB1dCArPSBcIiBcIiArIG9iai5wcmVmaXggKyBcIm11bHRpcGxlXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeE9mZnNldDtcbiAgICAgIGlmIChvYmoueEF4aXMuc2NhbGUgPT09IFwib3JkaW5hbC10aW1lXCIpIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC0gKHNpbmdsZUNvbHVtbiAvIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeE9mZnNldCA9IG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeE9mZnNldCArIFwiLDApXCI7XG4gICAgfSlcblxuICAvLyBBZGQgYSBncm91cCBmb3IgZWFjaFxuICB2YXIgc2VyaWVzID0gc2VyaWVzR3JvdXAuc2VsZWN0QWxsKFwiZy5cIiArIG9iai5wcmVmaXggKyBcInNlcmllc1wiKVxuICAgIC5kYXRhKG9iai5kYXRhLnN0YWNrZWREYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIG9iai5wcmVmaXggKyBcInNlcmllcyBcIiArIG9iai5wcmVmaXggKyBcInNlcmllc19cIiArIChpKTsgfSk7XG5cbiAgLy8gQWRkIGEgcmVjdCBmb3IgZWFjaCBkYXRhIHBvaW50LlxuICB2YXIgcmVjdCA9IHNlcmllcy5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgLmRhdGEoZnVuY3Rpb24oZCkgeyByZXR1cm4gZDsgfSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJjb2x1bW5cIixcbiAgICAgIFwiZGF0YS1rZXlcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gZC54OyB9LFxuICAgICAgXCJkYXRhLWxlZ2VuZFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiBkLmxlZ2VuZDsgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB4U2NhbGUoZC54KTsgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoTWF0aC5tYXgoMCwgZC55MCArIGQueSkpOyB9LFxuICAgICAgXCJoZWlnaHRcIjogZnVuY3Rpb24oZCkgeyByZXR1cm4gTWF0aC5hYnMoeVNjYWxlKGQueSkgLSB5U2NhbGUoMCkpOyB9LFxuICAgICAgXCJ3aWR0aFwiOiBzaW5nbGVDb2x1bW5cbiAgICB9KTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICByZWN0OiByZWN0XG4gIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGFja2VkQ29sdW1uQ2hhcnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy90eXBlcy9zdGFja2VkLWNvbHVtbi5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBTdHJlYW1ncmFwaENoYXJ0KG5vZGUsIG9iaikge1xuXG4gIHZhciBheGlzTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvYXhpc1wiKSxcbiAgICAgIHNjYWxlTW9kdWxlID0gcmVxdWlyZShcIi4uL2NvbXBvbmVudHMvc2NhbGVcIiksXG4gICAgICBBeGlzID0gYXhpc01vZHVsZS5heGlzTWFuYWdlcixcbiAgICAgIFNjYWxlID0gc2NhbGVNb2R1bGUuc2NhbGVNYW5hZ2VyO1xuXG4gIC8vICBzY2FsZXNcbiAgdmFyIHhTY2FsZU9iaiA9IG5ldyBTY2FsZShvYmosIFwieEF4aXNcIiksXG4gICAgICB5U2NhbGVPYmogPSBuZXcgU2NhbGUob2JqLCBcInlBeGlzXCIpLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLCB5U2NhbGUgPSB5U2NhbGVPYmouc2NhbGU7XG5cbiAgLy8gYXhlc1xuICB2YXIgeEF4aXNPYmogPSBuZXcgQXhpcyhub2RlLCBvYmosIHhTY2FsZU9iai5zY2FsZSwgXCJ4QXhpc1wiKSxcbiAgICAgIHlBeGlzT2JqID0gbmV3IEF4aXMobm9kZSwgb2JqLCB5U2NhbGVPYmouc2NhbGUsIFwieUF4aXNcIik7XG5cbiAgYXhpc01vZHVsZS5heGlzQ2xlYW51cChub2RlLCBvYmosIHhBeGlzT2JqLCB5QXhpc09iaik7XG5cbiAgaWYgKHhTY2FsZU9iai5vYmoudHlwZSA9PT0gXCJvcmRpbmFsXCIpIHtcbiAgICB4U2NhbGUucmFuZ2VSb3VuZFBvaW50cyhbMCwgb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCldLCAxLjApO1xuICB9XG5cbiAgdmFyIHNlcmllc0dyb3VwID0gbm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJzZXJpZXNfZ3JvdXBcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsMClcIlxuICAgIH19KTtcblxuICAvLyBBZGQgYSBncm91cCBmb3IgZWFjaCBjYXVzZS5cbiAgdmFyIHNlcmllcyA9IHNlcmllc0dyb3VwLnNlbGVjdEFsbChcImcuXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNcIilcbiAgICAuZGF0YShvYmouZGF0YS5zdGFja2VkRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzZXJpZXNfXCIgKyAoaSk7IH0pO1xuXG4gIHZhciBhcmVhID0gZDMuc3ZnLmFyZWEoKS5pbnRlcnBvbGF0ZShvYmoub3B0aW9ucy5pbnRlcnBvbGF0aW9uKVxuICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgIC55MChmdW5jdGlvbihkKSB7IHJldHVybiB5U2NhbGUoZC55MCk7IH0pXG4gICAgLnkxKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHlTY2FsZShkLnkwICsgZC55KTsgfSk7XG5cbiAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpLmludGVycG9sYXRlKG9iai5vcHRpb25zLmludGVycG9sYXRpb24pXG4gICAgLngoZnVuY3Rpb24oZCkgeyByZXR1cm4geFNjYWxlKGQueCk7IH0pXG4gICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueTAgKyBkLnkpOyB9KTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgdmFyIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInN0cmVhbS1zZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzdHJlYW0tXCIgKyAoaSk7XG4gICAgICBpZiAoaSA9PT0gb2JqLnNlcmllc0hpZ2hsaWdodCgpKSB7XG4gICAgICAgIG91dHB1dCA9IG9iai5wcmVmaXggKyBcInN0cmVhbS1zZXJpZXMgXCIgKyBvYmoucHJlZml4ICsgXCJzdHJlYW0tXCIgKyAoaSkgKyBcIiBcIiArIG9iai5wcmVmaXggKyBcImhpZ2hsaWdodFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9KVxuICAgIC5hdHRyKFwiZFwiLCBhcmVhKTtcblxuICBzZXJpZXMuYXBwZW5kKFwicGF0aFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBvYmoucHJlZml4ICsgXCJzdHJlYW0tc2VyaWVzIFwiICsgb2JqLnByZWZpeCArIFwibGluZVwiOyB9KVxuICAgIC5hdHRyKFwiZFwiLCBsaW5lKTtcblxuICBheGlzTW9kdWxlLmFkZFplcm9MaW5lKG9iaiwgbm9kZSwgeUF4aXNPYmosIFwieUF4aXNcIik7XG5cbiAgcmV0dXJuIHtcbiAgICB4U2NhbGVPYmo6IHhTY2FsZU9iaixcbiAgICB5U2NhbGVPYmo6IHlTY2FsZU9iaixcbiAgICB4QXhpc09iajogeEF4aXNPYmosXG4gICAgeUF4aXNPYmo6IHlBeGlzT2JqLFxuICAgIHNlcmllc0dyb3VwOiBzZXJpZXNHcm91cCxcbiAgICBzZXJpZXM6IHNlcmllcyxcbiAgICBsaW5lOiBsaW5lLFxuICAgIGFyZWE6IGFyZWFcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW1ncmFwaENoYXJ0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvdHlwZXMvc3RyZWFtZ3JhcGguanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gcXVhbGlmaWVyQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlICE9PSBcImJhclwiKSB7XG5cbiAgICB2YXIgeUF4aXNOb2RlID0gbm9kZS5zZWxlY3QoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ5QXhpc1wiKTtcblxuICAgIGlmIChvYmouZWRpdGFibGUpIHtcblxuICAgICAgdmFyIGZvcmVpZ25PYmplY3QgPSB5QXhpc05vZGUuYXBwZW5kKFwiZm9yZWlnbk9iamVjdFwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJmbyBcIiArIG9iai5wcmVmaXggKyBcInF1YWxpZmllclwiLFxuICAgICAgICAgIFwid2lkdGhcIjogXCIxMDAlXCJcbiAgICAgICAgfSk7XG5cbiAgICAgIHZhciBmb3JlaWduT2JqZWN0R3JvdXAgPSBmb3JlaWduT2JqZWN0LmFwcGVuZChcInhodG1sOmRpdlwiKVxuICAgICAgICAuYXR0cihcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiKTtcblxuICAgICAgdmFyIHF1YWxpZmllckZpZWxkID0gZm9yZWlnbk9iamVjdEdyb3VwLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJjaGFydF9xdWFsaWZpZXIgZWRpdGFibGUtY2hhcnRfcXVhbGlmaWVyXCIsXG4gICAgICAgICAgXCJjb250ZW50RWRpdGFibGVcIjogdHJ1ZSxcbiAgICAgICAgICBcInhtbG5zXCI6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgICAgIH0pXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpO1xuXG4gICAgICBmb3JlaWduT2JqZWN0XG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcIndpZHRoXCI6IHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIDE1LFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsXCIgKyAoIC0gKHF1YWxpZmllckZpZWxkLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpIC8gMiApICsgXCIpXCJcbiAgICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB2YXIgcXVhbGlmaWVyQmcgPSB5QXhpc05vZGUuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIG9iai5wcmVmaXggKyBcImNoYXJ0X3F1YWxpZmllci10ZXh0LWJnXCIpXG4gICAgICAgIC50ZXh0KG9iai5xdWFsaWZpZXIpXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImR5XCI6IFwiMC4zMmVtXCIsXG4gICAgICAgICAgXCJ5XCI6IFwiMFwiLFxuICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKFwiICsgKG9iai5kaW1lbnNpb25zLmNvbXB1dGVkV2lkdGgoKSAtIG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpKSArIFwiLCAwKVwiXG4gICAgICAgIH0pO1xuXG4gICAgICB2YXIgcXVhbGlmaWVyVGV4dCA9IHlBeGlzTm9kZS5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwiY2hhcnRfcXVhbGlmaWVyLXRleHRcIilcbiAgICAgICAgLnRleHQob2JqLnF1YWxpZmllcilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiZHlcIjogXCIwLjMyZW1cIixcbiAgICAgICAgICBcInlcIjogXCIwXCIsXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXCJ0cmFuc2xhdGUoXCIgKyAob2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRXaWR0aCgpIC0gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkpICsgXCIsIDApXCJcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcXVhbGlmaWVyQmc6IHF1YWxpZmllckJnLFxuICAgIHF1YWxpZmllclRleHQ6IHF1YWxpZmllclRleHRcbiAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YWxpZmllckNvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvcXVhbGlmaWVyLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogVGlwcyBoYW5kbGluZyBtb2R1bGUuXG4gKiBAbW9kdWxlIGNoYXJ0cy9jb21wb25lbnRzL3RpcHNcbiAqL1xuXG5mdW5jdGlvbiBiaXNlY3RvcihkYXRhLCBrZXlWYWwsIHN0YWNrZWQsIGluZGV4KSB7XG4gIGlmIChzdGFja2VkKSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIHZhciBiaXNlY3QgPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkLng7IH0pLmxlZnQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnIucHVzaChiaXNlY3QoZGF0YVtpXSwga2V5VmFsKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYXJyO1xuICB9IGVsc2Uge1xuICAgIHZhciBiaXNlY3QgPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmtleTsgfSkubGVmdDtcbiAgICByZXR1cm4gYmlzZWN0KGRhdGEsIGtleVZhbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3Vyc29yUG9zKG92ZXJsYXkpIHtcbiAgcmV0dXJuIHtcbiAgICB4OiBkMy5tb3VzZShvdmVybGF5Lm5vZGUoKSlbMF0sXG4gICAgeTogZDMubW91c2Uob3ZlcmxheS5ub2RlKCkpWzFdXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFRpcERhdGEob2JqLCBjdXJzb3IpIHtcblxuICB2YXIgeFNjYWxlT2JqID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLFxuICAgICAgeFNjYWxlID0geFNjYWxlT2JqLnNjYWxlLFxuICAgICAgc2NhbGVUeXBlID0geFNjYWxlT2JqLm9iai50eXBlO1xuXG4gIHZhciB4VmFsO1xuXG4gIGlmIChzY2FsZVR5cGUgPT09IFwib3JkaW5hbC10aW1lXCIgfHwgc2NhbGVUeXBlID09PSBcIm9yZGluYWxcIikge1xuXG4gICAgdmFyIG9yZGluYWxCaXNlY3Rpb24gPSBkMy5iaXNlY3RvcihmdW5jdGlvbihkKSB7IHJldHVybiBkOyB9KS5sZWZ0LFxuICAgICAgICByYW5nZVBvcyA9IG9yZGluYWxCaXNlY3Rpb24oeFNjYWxlLnJhbmdlKCksIGN1cnNvci54KTtcblxuICAgIHhWYWwgPSB4U2NhbGUuZG9tYWluKClbcmFuZ2VQb3NdO1xuXG4gIH0gZWxzZSB7XG4gICAgeFZhbCA9IHhTY2FsZS5pbnZlcnQoY3Vyc29yLngpO1xuICB9XG5cbiAgdmFyIHRpcERhdGE7XG5cbiAgaWYgKG9iai5vcHRpb25zLnN0YWNrZWQpIHtcbiAgICB2YXIgZGF0YSA9IG9iai5kYXRhLnN0YWNrZWREYXRhO1xuICAgIHZhciBpID0gYmlzZWN0b3IoZGF0YSwgeFZhbCwgb2JqLm9wdGlvbnMuc3RhY2tlZCk7XG5cbiAgICB2YXIgYXJyID0gW10sXG4gICAgICAgIHJlZkluZGV4O1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBkYXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICBpZiAocmVmSW5kZXgpIHtcbiAgICAgICAgYXJyLnB1c2goZGF0YVtrXVtyZWZJbmRleF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGQwID0gZGF0YVtrXVtpW2tdIC0gMV0sXG4gICAgICAgICAgICBkMSA9IGRhdGFba11baVtrXV07XG4gICAgICAgIHJlZkluZGV4ID0geFZhbCAtIGQwLnggPiBkMS54IC0geFZhbCA/IGlba10gOiAoaVtrXSAtIDEpO1xuICAgICAgICBhcnIucHVzaChkYXRhW2tdW3JlZkluZGV4XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGlwRGF0YSA9IGFycjtcblxuICB9IGVsc2Uge1xuICAgIHZhciBkYXRhID0gb2JqLmRhdGEuZGF0YTtcbiAgICB2YXIgaSA9IGJpc2VjdG9yKGRhdGEsIHhWYWwpO1xuICAgIHZhciBkMCA9IGRhdGFbaSAtIDFdLFxuICAgICAgICBkMSA9IGRhdGFbaV07XG5cbiAgICB0aXBEYXRhID0geFZhbCAtIGQwLmtleSA+IGQxLmtleSAtIHhWYWwgPyBkMSA6IGQwO1xuICB9XG5cbiAgcmV0dXJuIHRpcERhdGE7XG5cbn1cblxuZnVuY3Rpb24gc2hvd1RpcHModGlwTm9kZXMsIG9iaikge1xuXG4gIGlmICh0aXBOb2Rlcy54VGlwTGluZSkge1xuICAgIHRpcE5vZGVzLnhUaXBMaW5lLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIHRydWUpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcEJveCkge1xuICAgIHRpcE5vZGVzLnRpcEJveC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCB0cnVlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlcykge1xuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIHRydWUpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gaGlkZVRpcHModGlwTm9kZXMsIG9iaikge1xuXG4gIGlmIChvYmoub3B0aW9ucy50eXBlID09PSBcImNvbHVtblwiKSB7XG4gICAgaWYob2JqLm9wdGlvbnMuc3RhY2tlZCl7XG4gICAgICBvYmoucmVuZGVyZWQucGxvdC5zZXJpZXMuc2VsZWN0QWxsKFwicmVjdFwiKS5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm11dGVkXCIsIGZhbHNlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG9iai5yZW5kZXJlZC5wbG90LmNvbHVtbkl0ZW0uc2VsZWN0QWxsKFwicmVjdFwiKS5jbGFzc2VkKG9iai5wcmVmaXggKyBcIm11dGVkXCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy54VGlwTGluZSkge1xuICAgIHRpcE5vZGVzLnhUaXBMaW5lLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZhbHNlKTtcbiAgfVxuXG4gIGlmICh0aXBOb2Rlcy50aXBCb3gpIHtcbiAgICB0aXBOb2Rlcy50aXBCb3guY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuICB9XG5cbiAgaWYgKHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzKSB7XG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXMuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZmFsc2UpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gbW91c2VJZGxlKHRpcE5vZGVzLCBvYmopIHtcbiAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7XG4gIH0sIG9iai50aXBUaW1lb3V0KTtcbn1cblxudmFyIHRpbWVvdXQ7XG5cbmZ1bmN0aW9uIHRpcHNNYW5hZ2VyKG5vZGUsIG9iaikge1xuXG4gIHZhciB0aXBOb2RlcyA9IGFwcGVuZFRpcEdyb3VwKG5vZGUsIG9iaik7XG5cbiAgdmFyIGZucyA9IHtcbiAgICBsaW5lOiBMaW5lQ2hhcnRUaXBzLFxuICAgIG11bHRpbGluZTogTGluZUNoYXJ0VGlwcyxcbiAgICBhcmVhOiBvYmoub3B0aW9ucy5zdGFja2VkID8gU3RhY2tlZEFyZWFDaGFydFRpcHMgOiBBcmVhQ2hhcnRUaXBzLFxuICAgIGNvbHVtbjogb2JqLm9wdGlvbnMuc3RhY2tlZCA/IFN0YWNrZWRDb2x1bW5DaGFydFRpcHMgOiBDb2x1bW5DaGFydFRpcHMsXG4gICAgc3RyZWFtOiBTdHJlYW1ncmFwaFRpcHNcbiAgfTtcblxuICB2YXIgZGF0YVJlZmVyZW5jZTtcblxuICBpZiAob2JqLm9wdGlvbnMudHlwZSA9PT0gXCJtdWx0aWxpbmVcIikge1xuICAgIGRhdGFSZWZlcmVuY2UgPSBbb2JqLmRhdGEuZGF0YVswXS5zZXJpZXNbMF1dO1xuICB9IGVsc2Uge1xuICAgIGRhdGFSZWZlcmVuY2UgPSBvYmouZGF0YS5kYXRhWzBdLnNlcmllcztcbiAgfVxuXG4gIHZhciBpbm5lclRpcEVsZW1lbnRzID0gYXBwZW5kVGlwRWxlbWVudHMobm9kZSwgb2JqLCB0aXBOb2RlcywgZGF0YVJlZmVyZW5jZSk7XG5cbiAgc3dpdGNoIChvYmoub3B0aW9ucy50eXBlKSB7XG4gICAgY2FzZSBcImxpbmVcIjpcbiAgICBjYXNlIFwibXVsdGlsaW5lXCI6XG4gICAgY2FzZSBcImFyZWFcIjpcbiAgICBjYXNlIFwic3RyZWFtXCI6XG5cbiAgICAgIHRpcE5vZGVzLm92ZXJsYXkgPSB0aXBOb2Rlcy50aXBOb2RlLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoe1xuICAgICAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX292ZXJsYXlcIixcbiAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiLFxuICAgICAgICAgIFwid2lkdGhcIjogb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCksXG4gICAgICAgICAgXCJoZWlnaHRcIjogb2JqLmRpbWVuc2lvbnMuY29tcHV0ZWRIZWlnaHQoKVxuICAgICAgICB9KTtcblxuICAgICAgdGlwTm9kZXMub3ZlcmxheVxuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7IHNob3dUaXBzKHRpcE5vZGVzLCBvYmopOyB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHsgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7IH0pXG4gICAgICAgIC5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICByZXR1cm4gZm5zW29iai5vcHRpb25zLnR5cGVdKHRpcE5vZGVzLCBpbm5lclRpcEVsZW1lbnRzLCBvYmopO1xuICAgICAgICB9KTtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFwiY29sdW1uXCI6XG5cbiAgICAgIHZhciBjb2x1bW5SZWN0cztcblxuICAgICAgaWYgKG9iai5vcHRpb25zLnN0YWNrZWQpIHtcbiAgICAgICAgY29sdW1uUmVjdHMgPSBvYmoucmVuZGVyZWQucGxvdC5zZXJpZXMuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoJ3JlY3QnKTtcbiAgICAgIH1cblxuICAgICAgY29sdW1uUmVjdHNcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBzaG93VGlwcyh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG1vdXNlSWRsZSh0aXBOb2Rlcywgb2JqKTtcbiAgICAgICAgICBmbnMuY29sdW1uKHRpcE5vZGVzLCBvYmosIGQsIHRoaXMpO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgaGlkZVRpcHModGlwTm9kZXMsIG9iaik7XG4gICAgICAgIH0pO1xuXG4gICAgICBicmVhaztcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRpcEdyb3VwKG5vZGUsIG9iaikge1xuXG4gIHZhciBzdmdOb2RlID0gZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUpLFxuICAgICAgY2hhcnROb2RlID0gZDMuc2VsZWN0KG5vZGUubm9kZSgpLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG5cbiAgdmFyIHRpcE5vZGUgPSBzdmdOb2RlLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIG9iai5kaW1lbnNpb25zLm1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy5tYXJnaW4udG9wICsgXCIpXCIsXG4gICAgICBcImNsYXNzXCI6IG9iai5wcmVmaXggKyBcInRpcFwiXG4gICAgfSlcbiAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJ0aXBfc3RhY2tlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmoub3B0aW9ucy5zdGFja2VkID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH0pO1xuXG4gIHZhciB4VGlwTGluZSA9IHRpcE5vZGUuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX2xpbmUteFwiKVxuICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmYWxzZSk7XG5cbiAgeFRpcExpbmUuYXBwZW5kKFwibGluZVwiKTtcblxuICB2YXIgdGlwQm94ID0gdGlwTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfYm94XCIsXG4gICAgICBcInRyYW5zZm9ybVwiOiBcInRyYW5zbGF0ZShcIiArIChvYmouZGltZW5zaW9ucy5jb21wdXRlZFdpZHRoKCkgLSBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSkgKyBcIiwwKVwiXG4gICAgfSk7XG5cbiAgdmFyIHRpcFJlY3QgPSB0aXBCb3guYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIFwiY2xhc3NcIjogb2JqLnByZWZpeCArIFwidGlwX3JlY3RcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKDAsMClcIixcbiAgICAgIFwid2lkdGhcIjogMSxcbiAgICAgIFwiaGVpZ2h0XCI6IDFcbiAgICB9KTtcblxuICB2YXIgdGlwR3JvdXAgPSB0aXBCb3guYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX2dyb3VwXCIpO1xuXG4gIHZhciBsZWdlbmRJY29uID0gY2hhcnROb2RlLnNlbGVjdChcIi5cIiArIG9iai5wcmVmaXggKyBcImxlZ2VuZF9pdGVtX2ljb25cIikubm9kZSgpO1xuXG4gIGlmIChsZWdlbmRJY29uKSB7XG4gICAgdmFyIHJhZGl1cyA9IGxlZ2VuZEljb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLyAyO1xuICB9IGVsc2Uge1xuICAgIHZhciByYWRpdXMgPSAwO1xuICB9XG5cbiAgdmFyIHRpcFBhdGhDaXJjbGVzID0gdGlwTm9kZS5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUtZ3JvdXBcIik7XG5cbiAgdmFyIHRpcFRleHREYXRlID0gdGlwR3JvdXBcbiAgICAuaW5zZXJ0KFwiZ1wiLCBcIjpmaXJzdC1jaGlsZFwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZGF0ZS1ncm91cFwiKVxuICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1kYXRlXCIsXG4gICAgICBcInhcIjogMCxcbiAgICAgIFwieVwiOiAwLFxuICAgICAgXCJkeVwiOiBcIjFlbVwiXG4gICAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdmc6IHN2Z05vZGUsXG4gICAgdGlwTm9kZTogdGlwTm9kZSxcbiAgICB4VGlwTGluZTogeFRpcExpbmUsXG4gICAgdGlwQm94OiB0aXBCb3gsXG4gICAgdGlwUmVjdDogdGlwUmVjdCxcbiAgICB0aXBHcm91cDogdGlwR3JvdXAsXG4gICAgbGVnZW5kSWNvbjogbGVnZW5kSWNvbixcbiAgICB0aXBQYXRoQ2lyY2xlczogdGlwUGF0aENpcmNsZXMsXG4gICAgcmFkaXVzOiByYWRpdXMsXG4gICAgdGlwVGV4dERhdGU6IHRpcFRleHREYXRlXG4gIH07XG5cbn1cblxuZnVuY3Rpb24gYXBwZW5kVGlwRWxlbWVudHMobm9kZSwgb2JqLCB0aXBOb2RlcywgZGF0YVJlZikge1xuXG4gIHZhciB0aXBUZXh0R3JvdXBDb250YWluZXIgPSB0aXBOb2Rlcy50aXBHcm91cFxuICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cC1jb250YWluZXJcIjtcbiAgICB9KTtcblxuICB2YXIgdGlwVGV4dEdyb3VwcyA9IHRpcFRleHRHcm91cENvbnRhaW5lclxuICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cFwiKVxuICAgIC5kYXRhKGRhdGFSZWYpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwiZ1wiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgcmV0dXJuIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIFwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXAtXCIgKyAoaSk7XG4gICAgfSk7XG5cbiAgdmFyIGxpbmVIZWlnaHQ7XG5cbiAgdGlwVGV4dEdyb3Vwcy5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWw7IH0pXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX3RleHQgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1cIiArIChpKSk7XG4gICAgICB9LFxuICAgICAgXCJkYXRhLXNlcmllc1wiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiBkLmtleTsgfSxcbiAgICAgIFwieFwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aXBOb2Rlcy5yYWRpdXMgKiAyKSArICh0aXBOb2Rlcy5yYWRpdXMgLyAxLjUpO1xuICAgICAgfSxcbiAgICAgIFwieVwiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGxpbmVIZWlnaHQgPSBsaW5lSGVpZ2h0IHx8IHBhcnNlSW50KGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImxpbmUtaGVpZ2h0XCIpKTtcbiAgICAgICAgcmV0dXJuIChpICsgMSkgKiBsaW5lSGVpZ2h0O1xuICAgICAgfSxcbiAgICAgIFwiZHlcIjogXCIxZW1cIlxuICAgIH0pO1xuXG4gIHRpcFRleHRHcm91cHNcbiAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgLmF0dHIoe1xuICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAob2JqLnByZWZpeCArIFwidGlwX2NpcmNsZSBcIiArIG9iai5wcmVmaXggKyBcInRpcF9jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiclwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICBcImN4XCI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGlwTm9kZXMucmFkaXVzOyB9LFxuICAgICAgXCJjeVwiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiAoKGkgKyAxKSAqIGxpbmVIZWlnaHQpICsgKHRpcE5vZGVzLnJhZGl1cyAqIDEuNSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgLmRhdGEoZGF0YVJlZilcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAuYXR0cih7XG4gICAgICBcImNsYXNzXCI6IGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUgXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGUtXCIgKyAoaSkpO1xuICAgICAgfSxcbiAgICAgIFwiclwiOiAodGlwTm9kZXMucmFkaXVzIC8gMikgfHwgMi41XG4gICAgfSk7XG5cbiAgcmV0dXJuIHRpcFRleHRHcm91cHM7XG5cbn1cblxuZnVuY3Rpb24gTGluZUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7IH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAoZC52YWwpIHsgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZShkLnZhbCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gQXJlYUNoYXJ0VGlwcyh0aXBOb2RlcywgaW5uZXJUaXBFbHMsIG9iaikge1xuXG4gIHZhciBjdXJzb3IgPSBjdXJzb3JQb3ModGlwTm9kZXMub3ZlcmxheSksXG4gICAgICB0aXBEYXRhID0gZ2V0VGlwRGF0YShvYmosIGN1cnNvcik7XG5cbiAgdmFyIGlzVW5kZWZpbmVkID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoZC52YWwpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJuL2FcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLmxlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB5ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy50b3A7XG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFBhdGhDaXJjbGVzXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3BhdGgtY2lyY2xlXCIpXG4gICAgICAgIC5kYXRhKHRpcERhdGEuc2VyaWVzKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWwgPyB0cnVlIDogZmFsc2U7IH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICBpZiAoZC52YWwpIHsgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZShkLnZhbCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQsXG4gICAgICAgIFwieTFcIjogMCxcbiAgICAgICAgXCJ5MlwiOiBvYmouZGltZW5zaW9ucy55QXhpc0hlaWdodCgpXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YS5rZXkpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gU3RhY2tlZEFyZWFDaGFydFRpcHModGlwTm9kZXMsIGlubmVyVGlwRWxzLCBvYmopIHtcblxuICB2YXIgY3Vyc29yID0gY3Vyc29yUG9zKHRpcE5vZGVzLm92ZXJsYXkpLFxuICAgICAgdGlwRGF0YSA9IGdldFRpcERhdGEob2JqLCBjdXJzb3IpO1xuXG4gIHZhciBpc1VuZGVmaW5lZCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXBEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGFbaV0ueSA9PT0gTmFOIHx8IHRpcERhdGFbaV0ueTAgPT09IE5hTikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgICAgdGltZURpZmYgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikudGltZURpZmY7XG4gICAgICAgIGRvbWFpbiA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZS5kb21haW4oKSxcbiAgICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwIHRleHRcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIHZhciB0ZXh0O1xuXG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGlwRGF0YS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgdGV4dCA9IG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQucmF3LnNlcmllc1tpXS52YWwpICsgb2JqLnlBeGlzLnN1ZmZpeDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0ZXh0ID0gXCJuL2FcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChrID09PSBpKSB7XG4gICAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChkLnJhdy5zZXJpZXNbal0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWhhc1VuZGVmaW5lZCAmJiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIpKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgIC5jYWxsKHRpcERhdGVGb3JtYXR0ZXIsIGN0eCwgb2JqLm1vbnRoc0FiciwgdGlwRGF0YVswXS54KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEpXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkLnJhdy5zZXJpZXNbaV0udmFsICE9PSBcIl9fdW5kZWZpbmVkX19cIiAmJiAhaGFzVW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgeSA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wO1xuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBQYXRoQ2lyY2xlc1xuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF9wYXRoLWNpcmNsZVwiKVxuICAgICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgXCJhY3RpdmVcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHZhciBoYXNVbmRlZmluZWQgPSAwO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgaGFzVW5kZWZpbmVkKys7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKHtcbiAgICAgICAgICBcImN4XCI6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUoZC54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjeVwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICB2YXIgeSA9IGQueSB8fCAwLFxuICAgICAgICAgICAgICAgIHkwID0gZC55MCB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuIG9iai5yZW5kZXJlZC5wbG90LnlTY2FsZU9iai5zY2FsZSh5ICsgeTApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBSZWN0XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwid2lkdGhcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5sZWZ0ICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5yaWdodCxcbiAgICAgICAgXCJoZWlnaHRcIjogdGlwTm9kZXMudGlwR3JvdXAubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcudG9wICsgb2JqLmRpbWVuc2lvbnMudGlwUGFkZGluZy5ib3R0b21cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMueFRpcExpbmUuc2VsZWN0KFwibGluZVwiKVxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIngxXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcIngyXCI6IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0LFxuICAgICAgICBcInkxXCI6IDAsXG4gICAgICAgIFwieTJcIjogb2JqLmRpbWVuc2lvbnMueUF4aXNIZWlnaHQoKVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBCb3hcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGN1cnNvci54ID4gb2JqLmRpbWVuc2lvbnMudGlja1dpZHRoKCkgLyAyKSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCAtIGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhWzBdLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0ICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHggKyBcIixcIiArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC52ZXJ0aWNhbCArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICB9XG5cbn1cblxuZnVuY3Rpb24gU3RyZWFtZ3JhcGhUaXBzKHRpcE5vZGVzLCBpbm5lclRpcEVscywgb2JqKSB7XG5cbiAgdmFyIGN1cnNvciA9IGN1cnNvclBvcyh0aXBOb2Rlcy5vdmVybGF5KSxcbiAgICAgIHRpcERhdGEgPSBnZXRUaXBEYXRhKG9iaiwgY3Vyc29yKTtcblxuICB2YXIgaXNVbmRlZmluZWQgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGlwRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhW2ldLnkgPT09IE5hTiB8fCB0aXBEYXRhW2ldLnkwID09PSBOYU4pIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmO1xuICAgICAgICBkb21haW4gPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUuZG9tYWluKCksXG4gICAgICAgIGN0eCA9IHRpbWVEaWZmKGRvbWFpblswXSwgZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXSwgOCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCwgaSkge1xuXG4gICAgICAgIGlmICghb2JqLnlBeGlzLnByZWZpeCkgeyBvYmoueUF4aXMucHJlZml4ID0gXCJcIjsgfVxuICAgICAgICBpZiAoIW9iai55QXhpcy5zdWZmaXgpIHsgb2JqLnlBeGlzLnN1ZmZpeCA9IFwiXCI7IH1cblxuICAgICAgICB2YXIgdGV4dDtcblxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRpcERhdGEubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIHRleHQgPSBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnJhdy5zZXJpZXNbaV0udmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGV4dCA9IFwibi9hXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoayA9PT0gaSkge1xuICAgICAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2pdLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNVbmRlZmluZWQgJiYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiKSkge1xuICAgICAgICAgICAgICB0ZXh0ID0gb2JqLnlBeGlzLnByZWZpeCArIHlGb3JtYXR0ZXIob2JqLnlBeGlzLmZvcm1hdCwgZC5yYXcuc2VyaWVzW2ldLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSBcIm4vYVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGFbMF0ueCk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhKVxuICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGhhc1VuZGVmaW5lZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICBoYXNVbmRlZmluZWQrKztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZC5yYXcuc2VyaWVzW2ldLnZhbCAhPT0gXCJfX3VuZGVmaW5lZF9fXCIgJiYgIWhhc1VuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoY3Vyc29yLnggPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHkgPSBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUGF0aENpcmNsZXNcbiAgICAgIC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfcGF0aC1jaXJjbGVcIilcbiAgICAgICAgLmRhdGEodGlwRGF0YSlcbiAgICAgICAgLmNsYXNzZWQob2JqLnByZWZpeCArIFwiYWN0aXZlXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICB2YXIgaGFzVW5kZWZpbmVkID0gMDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tqXS52YWwgPT09IFwiX191bmRlZmluZWRfX1wiKSB7XG4gICAgICAgICAgICAgIGhhc1VuZGVmaW5lZCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGQucmF3LnNlcmllc1tpXS52YWwgIT09IFwiX191bmRlZmluZWRfX1wiICYmICFoYXNVbmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgXCJjeFwiOiBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKGQueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgdmFyIHkgPSBkLnkgfHwgMCxcbiAgICAgICAgICAgICAgICB5MCA9IGQueTAgfHwgMDtcbiAgICAgICAgICAgIHJldHVybiBvYmoucmVuZGVyZWQucGxvdC55U2NhbGVPYmouc2NhbGUoeSArIHkwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnhUaXBMaW5lLnNlbGVjdChcImxpbmVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJ4MVwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ4MlwiOiBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCxcbiAgICAgICAgXCJ5MVwiOiAwLFxuICAgICAgICBcInkyXCI6IG9iai5kaW1lbnNpb25zLnlBeGlzSGVpZ2h0KClcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwQm94XG4gICAgICAuYXR0cih7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChjdXJzb3IueCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMikge1xuICAgICAgICAgICAgLy8gdGlwYm94IHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGFbMF0ueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdmFyIHggPSBvYmoucmVuZGVyZWQucGxvdC54U2NhbGVPYmouc2NhbGUodGlwRGF0YVswXS54KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIENvbHVtbkNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqLCBkLCB0aGlzUmVmKSB7XG5cbiAgdmFyIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3QuY29sdW1uSXRlbS5zZWxlY3RBbGwoJ3JlY3QnKSxcbiAgICAgIGlzVW5kZWZpbmVkID0gMDtcblxuICB2YXIgdGhpc0NvbHVtbiA9IHRoaXNSZWYsXG4gICAgICB0aXBEYXRhID0gZDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEuc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRpcERhdGEuc2VyaWVzW2ldLnZhbCA9PT0gXCJfX3VuZGVmaW5lZF9fXCIpIHtcbiAgICAgIGlzVW5kZWZpbmVkKys7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgeUZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2F4aXNcIikuc2V0VGlja0Zvcm1hdFksXG4gICAgICB0aW1lRGlmZiA9IHJlcXVpcmUoXCIuLi8uLi91dGlscy91dGlsc1wiKS50aW1lRGlmZixcbiAgICAgIGdldFRyYW5zbGF0ZVhZID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmdldFRyYW5zbGF0ZVhZLFxuICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHZhciBjdXJzb3JYID0gZ2V0VHJhbnNsYXRlWFkodGhpc0NvbHVtbi5wYXJlbnROb2RlKTtcblxuICAgIGNvbHVtblJlY3RzXG4gICAgICAuY2xhc3NlZChvYmoucHJlZml4ICsgJ211dGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMgPT09IHRoaXNDb2x1bW4pID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQsIGkpIHtcblxuICAgICAgICBpZiAoIW9iai55QXhpcy5wcmVmaXgpIHsgb2JqLnlBeGlzLnByZWZpeCA9IFwiXCI7IH1cbiAgICAgICAgaWYgKCFvYmoueUF4aXMuc3VmZml4KSB7IG9iai55QXhpcy5zdWZmaXggPSBcIlwiOyB9XG5cbiAgICAgICAgaWYgKGQudmFsKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai55QXhpcy5wcmVmaXggKyB5Rm9ybWF0dGVyKG9iai55QXhpcy5mb3JtYXQsIGQudmFsKSArIG9iai55QXhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwibi9hXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgaWYob2JqLmRhdGVGb3JtYXQgIT09IHVuZGVmaW5lZCl7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAuY2FsbCh0aXBEYXRlRm9ybWF0dGVyLCBjdHgsIG9iai5tb250aHNBYnIsIHRpcERhdGEua2V5KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRpcE5vZGVzLnRpcFRleHREYXRlXG4gICAgICAgIC50ZXh0KHRpcERhdGEua2V5KTtcbiAgICB9XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cFxuICAgICAgLnNlbGVjdEFsbChcIi5cIiArIG9iai5wcmVmaXggKyBcInRpcF90ZXh0LWdyb3VwXCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEua2V5KSArIG9iai5kaW1lbnNpb25zLmxhYmVsV2lkdGggKyBvYmouZGltZW5zaW9ucy55QXhpc1BhZGRpbmdSaWdodCArIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuXG4gICAgICAgICAgaWYoeCA+IG9iai5kaW1lbnNpb25zLnRpY2tXaWR0aCgpIC8gMil7XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLmtleSkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgLSBkMy5zZWxlY3QodGhpcykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0Lmhvcml6b250YWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgb2JqLmRpbWVuc2lvbnMudGlwT2Zmc2V0LnZlcnRpY2FsICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgc2hvd1RpcHModGlwTm9kZXMsIG9iaik7XG5cbiAgfVxuXG59XG5cblxuZnVuY3Rpb24gU3RhY2tlZENvbHVtbkNoYXJ0VGlwcyh0aXBOb2Rlcywgb2JqLCBkLCB0aGlzUmVmKSB7XG5cbiAgdmFyIGNvbHVtblJlY3RzID0gb2JqLnJlbmRlcmVkLnBsb3Quc2VyaWVzLnNlbGVjdEFsbCgncmVjdCcpLFxuICAgICAgaXNVbmRlZmluZWQgPSAwO1xuXG4gIHZhciB0aGlzQ29sdW1uUmVjdCA9IHRoaXNSZWYsXG4gICAgICB0aXBEYXRhID0gZDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRpcERhdGEucmF3LnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aXBEYXRhLnJhdy5zZXJpZXNbaV0udmFsID09PSBcIl9fdW5kZWZpbmVkX19cIikge1xuICAgICAgaXNVbmRlZmluZWQrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNVbmRlZmluZWQpIHtcblxuICAgIHZhciB5Rm9ybWF0dGVyID0gcmVxdWlyZShcIi4vYXhpc1wiKS5zZXRUaWNrRm9ybWF0WSxcbiAgICAgIHRpbWVEaWZmID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLnRpbWVEaWZmLFxuICAgICAgZG9tYWluID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlLmRvbWFpbigpLFxuICAgICAgY3R4ID0gdGltZURpZmYoZG9tYWluWzBdLCBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLCA4KTtcblxuICAgIHZhciBwYXJlbnRFbCA9IGQzLnNlbGVjdCh0aGlzQ29sdW1uUmVjdC5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIHZhciByZWZQb3MgPSBkMy5zZWxlY3QodGhpc0NvbHVtblJlY3QpLmF0dHIoXCJ4XCIpO1xuXG4gICAgdmFyIHRoaXNDb2x1bW5LZXkgPSAnJztcblxuICAgIC8qIEZpZ3VyZSBvdXQgd2hpY2ggc3RhY2sgdGhpcyBzZWxlY3RlZCByZWN0IGlzIGluIHRoZW4gbG9vcCBiYWNrIHRocm91Z2ggYW5kICh1bilhc3NpZ24gbXV0ZWQgY2xhc3MgKi9cbiAgICBjb2x1bW5SZWN0cy5jbGFzc2VkKG9iai5wcmVmaXggKyAnbXV0ZWQnLGZ1bmN0aW9uIChkKSB7XG5cbiAgICAgIGlmKHRoaXMgPT09IHRoaXNDb2x1bW5SZWN0KXtcbiAgICAgICAgdGhpc0NvbHVtbktleSA9IGQucmF3LmtleTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICh0aGlzID09PSB0aGlzQ29sdW1uUmVjdCkgPyBmYWxzZSA6IHRydWU7XG5cbiAgICB9KTtcblxuICAgIGNvbHVtblJlY3RzLmNsYXNzZWQob2JqLnByZWZpeCArICdtdXRlZCcsZnVuY3Rpb24gKGQpIHtcblxuICAgICAgcmV0dXJuIChkLnJhdy5rZXkgPT09IHRoaXNDb2x1bW5LZXkpID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgfSk7XG5cbiAgICB0aXBOb2Rlcy50aXBHcm91cC5zZWxlY3RBbGwoXCIuXCIgKyBvYmoucHJlZml4ICsgXCJ0aXBfdGV4dC1ncm91cCB0ZXh0XCIpXG4gICAgICAuZGF0YSh0aXBEYXRhLnJhdy5zZXJpZXMpXG4gICAgICAudGV4dChmdW5jdGlvbihkLCBpKSB7XG5cbiAgICAgICAgaWYgKCFvYmoueUF4aXMucHJlZml4KSB7IG9iai55QXhpcy5wcmVmaXggPSBcIlwiOyB9XG4gICAgICAgIGlmICghb2JqLnlBeGlzLnN1ZmZpeCkgeyBvYmoueUF4aXMuc3VmZml4ID0gXCJcIjsgfVxuXG4gICAgICAgIGlmIChkLnZhbCkge1xuICAgICAgICAgIHJldHVybiBvYmoueUF4aXMucHJlZml4ICsgeUZvcm1hdHRlcihvYmoueUF4aXMuZm9ybWF0LCBkLnZhbCkgKyBvYmoueUF4aXMuc3VmZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIm4vYVwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGlmKG9iai5kYXRlRm9ybWF0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGlwTm9kZXMudGlwVGV4dERhdGVcbiAgICAgICAgLmNhbGwodGlwRGF0ZUZvcm1hdHRlciwgY3R4LCBvYmoubW9udGhzQWJyLCB0aXBEYXRhLmtleSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICB0aXBOb2Rlcy50aXBUZXh0RGF0ZVxuICAgICAgICAudGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZCA9IHRpcERhdGEucmF3LmtleTtcbiAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGlwTm9kZXMudGlwR3JvdXBcbiAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgXCJjbGFzc1wiOiBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIChvYmoucHJlZml4ICsgXCJ0aXBfY2lyY2xlIFwiICsgb2JqLnByZWZpeCArIFwidGlwX2NpcmNsZS1cIiArIChpKSk7XG4gICAgICAgIH0sXG4gICAgICAgIFwiclwiOiBmdW5jdGlvbihkLCBpKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICAgIFwiY3hcIjogZnVuY3Rpb24oKSB7IHJldHVybiB0aXBOb2Rlcy5yYWRpdXM7IH0sXG4gICAgICAgIFwiY3lcIjogZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHJldHVybiAoIChpICsgMSkgKiBwYXJzZUludChkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJmb250LXNpemVcIikpICogMS4xMyArIDkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEdyb3VwXG4gICAgICAuc2VsZWN0QWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwidGlwX3RleHQtZ3JvdXBcIilcbiAgICAgIC5kYXRhKHRpcERhdGEucmF3LnNlcmllcylcbiAgICAgIC5jbGFzc2VkKG9iai5wcmVmaXggKyBcImFjdGl2ZVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBkLnZhbCA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGlwTm9kZXMudGlwUmVjdFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcIndpZHRoXCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcubGVmdCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcucmlnaHQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHRpcE5vZGVzLnRpcEdyb3VwLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBQYWRkaW5nLnRvcCArIG9iai5kaW1lbnNpb25zLnRpcFBhZGRpbmcuYm90dG9tXG4gICAgICB9KTtcblxuICAgIHRpcE5vZGVzLnRpcEJveFxuICAgICAgLmF0dHIoe1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGlmIChyZWZQb3MgPiBvYmouZGltZW5zaW9ucy50aWNrV2lkdGgoKSAvIDIpIHtcbiAgICAgICAgICAgIC8vIHRpcGJveCBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB2YXIgeCA9IG9iai5yZW5kZXJlZC5wbG90LnhTY2FsZU9iai5zY2FsZSh0aXBEYXRhLngpICsgb2JqLmRpbWVuc2lvbnMubGFiZWxXaWR0aCArIG9iai5kaW1lbnNpb25zLnlBeGlzUGFkZGluZ1JpZ2h0IC0gZDMuc2VsZWN0KHRoaXMpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIG9iai5kaW1lbnNpb25zLnRpcE9mZnNldC5ob3Jpem9udGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aXBib3ggcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIHZhciB4ID0gb2JqLnJlbmRlcmVkLnBsb3QueFNjYWxlT2JqLnNjYWxlKHRpcERhdGEueCkgKyBvYmouZGltZW5zaW9ucy5sYWJlbFdpZHRoICsgb2JqLmRpbWVuc2lvbnMueUF4aXNQYWRkaW5nUmlnaHQgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQuaG9yaXpvbnRhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCIsXCIgKyBvYmouZGltZW5zaW9ucy50aXBPZmZzZXQudmVydGljYWwgKyBcIilcIjtcblxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gIH1cblxufVxuXG5mdW5jdGlvbiB0aXBEYXRlRm9ybWF0dGVyKHNlbGVjdGlvbiwgY3R4LCBtb250aHMsIGRhdGEpIHtcblxuICB2YXIgZE1vbnRoLFxuICAgICAgZERhdGUsXG4gICAgICBkWWVhcixcbiAgICAgIGRIb3VyLFxuICAgICAgZE1pbnV0ZTtcblxuICBzZWxlY3Rpb24udGV4dChmdW5jdGlvbigpIHtcbiAgICB2YXIgZCA9IGRhdGE7XG4gICAgdmFyIGRTdHI7XG4gICAgc3dpdGNoIChjdHgpIHtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOlxuICAgICAgICBkU3RyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZSArIFwiLCBcIiArIGRZZWFyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3ZWVrc1wiOlxuICAgICAgY2FzZSBcImRheXNcIjpcbiAgICAgICAgZE1vbnRoID0gbW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgICAgIGREYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICAgIGRZZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkU3RyID0gZE1vbnRoICsgXCIgXCIgKyBkRGF0ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaG91cnNcIjpcblxuICAgICAgICBkRGF0ZSA9IGQuZ2V0RGF0ZSgpO1xuICAgICAgICBkSG91ciA9IGQuZ2V0SG91cnMoKTtcbiAgICAgICAgZE1pbnV0ZSA9IGQuZ2V0TWludXRlcygpO1xuXG4gICAgICAgIHZhciBkSG91clN0cixcbiAgICAgICAgICBkTWludXRlU3RyO1xuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSAyNGggdGltZVxuICAgICAgICB2YXIgc3VmZml4ID0gKGRIb3VyID49IDEyKSA/ICdwLm0uJyA6ICdhLm0uJztcblxuICAgICAgICBpZiAoZEhvdXIgPT09IDApIHtcbiAgICAgICAgICBkSG91clN0ciA9IDEyO1xuICAgICAgICB9IGVsc2UgaWYgKGRIb3VyID4gMTIpIHtcbiAgICAgICAgICBkSG91clN0ciA9IGRIb3VyIC0gMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZEhvdXJTdHIgPSBkSG91cjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2UgbWludXRlcyBmb2xsb3cgR2xvYmUgc3R5bGVcbiAgICAgICAgaWYgKGRNaW51dGUgPT09IDApIHtcbiAgICAgICAgICBkTWludXRlU3RyID0gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAoZE1pbnV0ZSA8IDEwKSB7XG4gICAgICAgICAgZE1pbnV0ZVN0ciA9ICc6MCcgKyBkTWludXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRNaW51dGVTdHIgPSAnOicgKyBkTWludXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZFN0ciA9IGRIb3VyU3RyICsgZE1pbnV0ZVN0ciArICcgJyArIHN1ZmZpeDtcblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRTdHIgPSBkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZFN0cjtcblxuICB9KTtcblxufVxuXG5cbi8vIFtmdW5jdGlvbiBCYXJDaGFydFRpcHModGlwTm9kZXMsIG9iaikge1xuXG4vLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gdGlwc01hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2pzL2NoYXJ0cy9jb21wb25lbnRzL3RpcHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBTb2NpYWwgbW9kdWxlLlxuICogQG1vZHVsZSBjaGFydHMvY29tcG9uZW50cy9zb2NpYWxcbiAqL1xuXG4vKlxuVGhpcyBjb21wb25lbnQgYWRkcyBhIFwic29jaWFsXCIgYnV0dG9uIHRvIGVhY2ggY2hhcnQgd2hpY2ggY2FuIGJlIHRvZ2dsZWQgdG8gcHJlc2VudCB0aGUgdXNlciB3aXRoIHNvY2lhbCBzaGFyaW5nIG9wdGlvbnNcbiAqL1xuXG52YXIgZ2V0VGh1bWJuYWlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3V0aWxzXCIpLmdldFRodW1ibmFpbFBhdGg7XG5cbmZ1bmN0aW9uIHNvY2lhbENvbXBvbmVudChub2RlLCBvYmopIHtcblxuXHR2YXIgc29jaWFsT3B0aW9ucyA9IFtdO1xuXG5cdGZvciAodmFyIHByb3AgaW4gb2JqLnNvY2lhbCkge1xuXHRcdGlmIChvYmouc29jaWFsW3Byb3BdKSB7XG5cdFx0XHRzd2l0Y2ggKG9iai5zb2NpYWxbcHJvcF0ubGFiZWwpIHtcblx0XHRcdFx0Y2FzZSBcIlR3aXR0ZXJcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdFR3aXR0ZXJVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkZhY2Vib29rXCI6XG5cdFx0XHRcdFx0b2JqLnNvY2lhbFtwcm9wXS51cmwgPSBjb25zdHJ1Y3RGYWNlYm9va1VSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiRW1haWxcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdE1haWxVUkwob2JqKTtcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnBvcHVwID0gZmFsc2U7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJTTVNcIjpcblx0XHRcdFx0XHRvYmouc29jaWFsW3Byb3BdLnVybCA9IGNvbnN0cnVjdFNNU1VSTChvYmopO1xuXHRcdFx0XHRcdG9iai5zb2NpYWxbcHJvcF0ucG9wdXAgPSBmYWxzZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnSU5DT1JSRUNUIFNPQ0lBTCBJVEVNIERFRklOSVRJT04nKVxuXHRcdFx0fVxuXHRcdFx0c29jaWFsT3B0aW9ucy5wdXNoKG9iai5zb2NpYWxbcHJvcF0pO1xuXHRcdH1cblx0fVxuXG5cdHZhciBjaGFydENvbnRhaW5lciA9IGQzLnNlbGVjdChub2RlKTtcblxuICB2YXIgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXIuc2VsZWN0KCcuJyArIG9iai5wcmVmaXggKyAnY2hhcnRfbWV0YScpO1xuXG4gIGlmIChjaGFydE1ldGEubm9kZSgpID09PSBudWxsKSB7XG4gICAgY2hhcnRNZXRhID0gY2hhcnRDb250YWluZXJcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcbiAgfVxuXG5cdHZhciBjaGFydFNvY2lhbEJ0biA9IGNoYXJ0TWV0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhX2J0bicpXG5cdFx0Lmh0bWwoJ3NoYXJlJyk7XG5cblx0dmFyIGNoYXJ0U29jaWFsID0gY2hhcnRDb250YWluZXJcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfc29jaWFsJyk7XG5cblx0dmFyIGNoYXJ0U29jaWFsQ2xvc2VCdG4gPSBjaGFydFNvY2lhbFxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9zb2NpYWxfY2xvc2UnKVxuXHRcdC5odG1sKCcmI3hkNzsnKTtcblxuXHR2YXIgY2hhcnRTb2NpYWxPcHRpb25zID0gY2hhcnRTb2NpYWxcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfc29jaWFsX29wdGlvbnMnKTtcblxuXHRjaGFydFNvY2lhbE9wdGlvbnNcblx0XHQuYXBwZW5kKCdoMycpXG5cdFx0Lmh0bWwoJ1NoYXJlIHRoaXMgY2hhcnQ6Jyk7XG5cblx0Y2hhcnRTb2NpYWxCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y2hhcnRTb2NpYWwuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIHRydWUpO1xuXHR9KTtcblxuXHRjaGFydFNvY2lhbENsb3NlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNoYXJ0U29jaWFsLmNsYXNzZWQob2JqLnByZWZpeCArICdhY3RpdmUnLCBmYWxzZSk7XG5cdH0pO1xuXG5cdHZhciBpdGVtQW1vdW50ID0gc29jaWFsT3B0aW9ucy5sZW5ndGg7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IGl0ZW1BbW91bnQ7IGkrKyApIHtcblx0XHRjaGFydFNvY2lhbE9wdGlvbnNcblx0XHRcdC5zZWxlY3RBbGwoJy4nICsgb2JqLnByZWZpeCArICdzb2NpYWwtaXRlbScpXG5cdFx0XHQuZGF0YShzb2NpYWxPcHRpb25zKVxuXHRcdFx0LmVudGVyKClcblx0XHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ3NvY2lhbC1pdGVtJykuaHRtbChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdGlmICghZC5wb3B1cCkge1xuXHRcdFx0XHRcdHJldHVybiAnPGEgaHJlZj1cIicgKyBkLnVybCArICdcIj48aW1nIGNsYXNzPVwiJyArIG9iai5wcmVmaXggKyAnc29jaWFsLWljb25cIiBzcmM9XCInICsgZC5pY29uICsgJ1wiIHRpdGxlPVwiJyArIGQubGFiZWwgKyAnXCIvPjwvYT4nO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiAnPGEgY2xhc3M9XCInICsgb2JqLnByZWZpeCArICdqcy1zaGFyZVwiIGhyZWY9XCInICsgZC51cmwgKyAnXCI+PGltZyBjbGFzcz1cIicgKyBvYmoucHJlZml4ICsgJ3NvY2lhbC1pY29uXCIgc3JjPVwiJyArIGQuaWNvbiArICdcIiB0aXRsZT1cIicgKyBkLmxhYmVsICsgJ1wiLz48L2E+Jztcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH1cblxuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHtcbiAgICBjaGFydFNvY2lhbE9wdGlvbnNcbiAgICAgIC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2ltYWdlLXVybCcpXG4gICAgICAuYXR0cignY29udGVudEVkaXRhYmxlJywgJ3RydWUnKVxuICAgICAgLmh0bWwoZ2V0VGh1bWJuYWlsKG9iaikpO1xuICB9XG5cblx0dmFyIHNoYXJlUG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiICsgb2JqLnByZWZpeCArIFwianMtc2hhcmVcIik7XG5cbiAgaWYgKHNoYXJlUG9wdXApIHtcbiAgICBbXS5mb3JFYWNoLmNhbGwoc2hhcmVQb3B1cCwgZnVuY3Rpb24oYW5jaG9yKSB7XG4gICAgICBhbmNob3IuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3dQb3B1cCh0aGlzLmhyZWYsIDYwMCwgNjIwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cblx0cmV0dXJuIHtcblx0XHRtZXRhX25hdjogY2hhcnRNZXRhXG5cdH07XG5cbn1cblxuLy8gc29jaWFsIHBvcHVwXG5mdW5jdGlvbiB3aW5kb3dQb3B1cCh1cmwsIHdpZHRoLCBoZWlnaHQpIHtcbiAgLy8gY2FsY3VsYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wdXAgc28gaXTigJlzIGNlbnRlcmVkIG9uIHRoZSBzY3JlZW4uXG4gIHZhciBsZWZ0ID0gKHNjcmVlbi53aWR0aCAvIDIpIC0gKHdpZHRoIC8gMiksXG4gICAgICB0b3AgPSAoc2NyZWVuLmhlaWdodCAvIDIpIC0gKGhlaWdodCAvIDIpO1xuICB3aW5kb3cub3BlbihcbiAgICB1cmwsXG4gICAgXCJcIixcbiAgICBcIm1lbnViYXI9bm8sdG9vbGJhcj1ubyxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzLHdpZHRoPVwiICsgd2lkdGggKyBcIixoZWlnaHQ9XCIgKyBoZWlnaHQgKyBcIix0b3A9XCIgKyB0b3AgKyBcIixsZWZ0PVwiICsgbGVmdFxuICApO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RGYWNlYm9va1VSTChvYmope1xuICB2YXIgYmFzZSA9ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vZGlhbG9nL3NoYXJlPycsXG4gICAgICByZWRpcmVjdCA9IG9iai5zb2NpYWwuZmFjZWJvb2sucmVkaXJlY3QsXG4gICAgICB1cmwgPSAnYXBwX2lkPScgKyBvYmouc29jaWFsLmZhY2Vib29rLmFwcElEICsgJyZhbXA7ZGlzcGxheT1wb3B1cCZhbXA7dGl0bGU9JyArIG9iai5oZWFkaW5nICsgJyZhbXA7ZGVzY3JpcHRpb249RnJvbSUyMGFydGljbGUnICsgZG9jdW1lbnQudGl0bGUgKyAnJmFtcDtocmVmPScgKyB3aW5kb3cubG9jYXRpb24uaHJlZiArICcmYW1wO3JlZGlyZWN0X3VyaT0nICsgcmVkaXJlY3Q7XG4gIGlmIChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgeyAgdXJsICs9ICcmYW1wO3BpY3R1cmU9JyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RNYWlsVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ21haWx0bzo/JztcbiAgdmFyIHRodW1ibmFpbCA9IChvYmouaW1hZ2UgJiYgb2JqLmltYWdlLmVuYWJsZSkgPyAnJTBBJyArIGdldFRodW1ibmFpbChvYmopIDogXCJcIjtcbiAgcmV0dXJuIGJhc2UgKyAnc3ViamVjdD0nICsgb2JqLmhlYWRpbmcgKyAnJmFtcDtib2R5PScgKyBvYmouaGVhZGluZyArIHRodW1ibmFpbCArICclMEFmcm9tIGFydGljbGU6ICcgKyBkb2N1bWVudC50aXRsZSArICclMEEnICsgd2luZG93LmxvY2F0aW9uLmhyZWY7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFNNU1VSTChvYmope1xuICB2YXIgYmFzZSA9ICdzbXM6JyxcbiAgICAgIHVybCA9ICcmYm9keT1DaGVjayUyMG91dCUyMHRoaXMlMjBjaGFydDogJyArIG9iai5oZWFkaW5nO1xuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHsgIHVybCArPSAnJTIwJyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RUd2l0dGVyVVJMKG9iail7XG4gIHZhciBiYXNlID0gJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0PycsXG4gICAgICBoYXNodGFnID0gISEob2JqLnNvY2lhbC50d2l0dGVyLmhhc2h0YWcpID8gJyZhbXA7aGFzaHRhZ3M9JyArIG9iai5zb2NpYWwudHdpdHRlci5oYXNodGFnIDogXCJcIixcbiAgICAgIHZpYSA9ICEhKG9iai5zb2NpYWwudHdpdHRlci52aWEpID8gJyZhbXA7dmlhPScgKyBvYmouc29jaWFsLnR3aXR0ZXIudmlhIDogXCJcIixcbiAgICAgIHVybCA9ICd1cmw9JyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICArIHZpYSArICcmYW1wO3RleHQ9JyArIGVuY29kZVVSSShvYmouaGVhZGluZykgKyBoYXNodGFnO1xuICBpZiAob2JqLmltYWdlICYmIG9iai5pbWFnZS5lbmFibGUpIHsgIHVybCArPSAnJTIwJyArIGdldFRodW1ibmFpbChvYmopOyB9XG4gIHJldHVybiBiYXNlICsgdXJsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvY2lhbENvbXBvbmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvanMvY2hhcnRzL2NvbXBvbmVudHMvc29jaWFsLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogU2hhcmluZyBEYXRhIG1vZHVsZS5cbiAqIEBtb2R1bGUgY2hhcnRzL2NvbXBvbmVudHMvc2hhcmUtZGF0YVxuICovXG5cbi8qXG5UaGlzIGNvbXBvbmVudCBhZGRzIGEgXCJkYXRhXCIgYnV0dG9uIHRvIGVhY2ggY2hhcnQgd2hpY2ggY2FuIGJlIHRvZ2dsZWQgdG8gcHJlc2VudCB0aGUgY2hhcnRzIGRhdGEgaW4gYSB0YWJ1bGFyIGZvcm0gYWxvbmcgd2l0aCBidXR0b25zIGFsbG93aW5nIHRoZSByYXcgZGF0YSB0byBiZSBkb3dubG9hZGVkXG4gKi9cblxuZnVuY3Rpb24gc2hhcmVEYXRhQ29tcG9uZW50KG5vZGUsIG9iaikge1xuXG4gXHR2YXIgY2hhcnRDb250YWluZXIgPSBkMy5zZWxlY3Qobm9kZSk7XG5cbiAgdmFyIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyLnNlbGVjdCgnLicgKyBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGEnKTtcblxuICBpZiAoY2hhcnRNZXRhLm5vZGUoKSA9PT0gbnVsbCkge1xuICAgIGNoYXJ0TWV0YSA9IGNoYXJ0Q29udGFpbmVyXG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9tZXRhJyk7XG4gIH1cblxuXHR2YXIgY2hhcnREYXRhQnRuID0gY2hhcnRNZXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X21ldGFfYnRuJylcblx0XHQuaHRtbCgnZGF0YScpO1xuXG5cdHZhciBjaGFydERhdGEgPSBjaGFydENvbnRhaW5lclxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhJyk7XG5cblx0dmFyIGNoYXJ0RGF0YUNsb3NlQnRuID0gY2hhcnREYXRhXG5cdFx0LmFwcGVuZCgnZGl2Jylcblx0XHQuYXR0cignY2xhc3MnLCBvYmoucHJlZml4ICsgJ2NoYXJ0X2RhdGFfY2xvc2UnKVxuXHRcdC5odG1sKCcmI3hkNzsnKTtcblxuXHR2YXIgY2hhcnREYXRhVGFibGUgPSBjaGFydERhdGFcblx0XHQuYXBwZW5kKCdkaXYnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9pbm5lcicpO1xuXG5cdGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2gyJylcblx0XHQuaHRtbChvYmouaGVhZGluZyk7XG5cblx0dmFyIGNoYXJ0RGF0YU5hdiA9IGNoYXJ0RGF0YVxuXHRcdC5hcHBlbmQoJ2RpdicpXG5cdFx0LmF0dHIoJ2NsYXNzJywgb2JqLnByZWZpeCArICdjaGFydF9kYXRhX25hdicpO1xuXG5cdHZhciBjc3ZETEJ0biA9IGNoYXJ0RGF0YU5hdlxuXHRcdC5hcHBlbmQoJ2EnKVxuXHRcdC5hdHRyKCdjbGFzcycsIG9iai5wcmVmaXggKyAnY2hhcnRfZGF0YV9idG4gY3N2Jylcblx0XHQuaHRtbCgnZG93bmxvYWQgY3N2Jyk7XG5cbiAgdmFyIGNzdlRvVGFibGUgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvdXRpbHNcIikuY3N2VG9UYWJsZTtcblxuXHRjc3ZUb1RhYmxlKGNoYXJ0RGF0YVRhYmxlLCBvYmouZGF0YS5jc3YpO1xuXG5cdGNoYXJ0RGF0YUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydERhdGEuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIHRydWUpO1xuXHR9KTtcblxuXHRjaGFydERhdGFDbG9zZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjaGFydERhdGEuY2xhc3NlZChvYmoucHJlZml4ICsgJ2FjdGl2ZScsIGZhbHNlKTtcblx0fSk7XG5cblx0Y3N2RExCdG4ub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcblx0ICB2YXIgZGxEYXRhID0gJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQob2JqLmRhdGEuY3N2KTtcblx0ICBkMy5zZWxlY3QodGhpcylcblx0ICBcdC5hdHRyKCdocmVmJywgZGxEYXRhKVxuXHQgIFx0LmF0dHIoJ2Rvd25sb2FkJywnZGF0YV8nICsgb2JqLmlkICsgJy5jc3YnKTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHRtZXRhX25hdjogY2hhcnRNZXRhLFxuXHRcdGRhdGFfcGFuZWw6IGNoYXJ0RGF0YVxuXHR9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hhcmVEYXRhQ29tcG9uZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9qcy9jaGFydHMvY29tcG9uZW50cy9zaGFyZS1kYXRhLmpzXG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ3VzdG9tIGNvZGUgZnVuY3Rpb24gdGhhdCBjYW4gYmUgaW52b2tlZCB0byBtb2RpZnkgY2hhcnQgZWxlbWVudHMgYWZ0ZXIgY2hhcnQgZHJhd2luZyBoYXMgb2NjdXJyZWQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IG5vZGUgICAgICAgICBUaGUgbWFpbiBjb250YWluZXIgZ3JvdXAgZm9yIHRoZSBjaGFydC5cbiAqIEBwYXJhbSAge09iamVjdH0gY2hhcnRSZWNpcGUgIE9iamVjdCB0aGF0IGNvbnRhaW5zIHNldHRpbmdzIGZvciB0aGUgY2hhcnQuXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJlbmRlcmVkICAgICBBbiBvYmplY3QgY29udGFpbmluZyByZWZlcmVuY2VzIHRvIGFsbCByZW5kZXJlZCBjaGFydCBlbGVtZW50cywgaW5jbHVkaW5nIGF4ZXMsIHNjYWxlcywgcGF0aHMsIG5vZGVzLCBhbmQgc28gZm9ydGguXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICBPcHRpb25hbC5cbiAqL1xuZnVuY3Rpb24gY3VzdG9tKG5vZGUsIGNoYXJ0UmVjaXBlLCByZW5kZXJlZCkge1xuXG4gIC8vIFdpdGggdGhpcyBmdW5jdGlvbiwgeW91IGNhbiBhY2Nlc3MgYWxsIGVsZW1lbnRzIG9mIGEgY2hhcnQgYW5kIG1vZGlmeVxuICAvLyB0aGVtIGF0IHdpbGwuIEZvciBpbnN0YW5jZTogeW91IG1pZ2h0IHdhbnQgdG8gcGxheSB3aXRoIGNvbG91clxuICAvLyBpbnRlcnBvbGF0aW9uIGZvciBhIG11bHRpLXNlcmllcyBsaW5lIGNoYXJ0LCBvciBtb2RpZnkgdGhlIHdpZHRoIGFuZCBwb3NpdGlvblxuICAvLyBvZiB0aGUgeC0gYW5kIHktYXhpcyB0aWNrcy4gV2l0aCB0aGlzIGZ1bmN0aW9uLCB5b3UgY2FuIGRvIGFsbCB0aGF0IVxuXG4gIC8vIElmIHlvdSBjYW4sIGl0J3MgZ29vZCBDaGFydCBUb29sIHByYWN0aWNlIHRvIHJldHVybiByZWZlcmVuY2VzIHRvIG5ld2x5XG4gIC8vIGNyZWF0ZWQgbm9kZXMgYW5kIGQzIG9iamVjdHMgc28gdGhleSBiZSBhY2Nlc3NlZCBsYXRlciDigJQgYnkgYSBkaXNwYXRjaGVyXG4gIC8vIGV2ZW50LCBmb3IgaW5zdGFuY2UuXG4gIHJldHVybjtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGN1c3RvbTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vY3VzdG9tL2N1c3RvbS5qc1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9