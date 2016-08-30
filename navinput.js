/**
 * TLDR; This is a lightweight JS Lib that allows <input> fields to use the shortcuts
 * familiar to users of Microsoft Dynamics Navision
 *
 * Microsoft's Dynamics Navision (NAV) is an app with a ton of sweet
 * input field shortcuts that make data entry quicker and more reliable.
 * I always wished I had them for my web apps, so this lib is my attempt
 * to make exactly that. 
 * 
 * This lib has no dependencies, but most of the examples are going to use jQuery
 * to get the elements and attach change listeners to them. Again, not required.
 *
 * For a list of input shortcuts we are imitating
 * @see https://msdn.microsoft.com/en-us/library/hh179519(v=nav.90).aspx
 * The ACTUAL shortcuts are determined by the *Replacers below
 *
 * EXAMPLES!!!
   <input type="text" data-navinput-date placeholder="date"/>
   <input type="text" data-navinput-time placeholder="time"/>
   <input type="text" data-navinput-datetime placeholder="datetime"/>

   $('input[data-navinput-date]').on('change', function(e){
     var t = $(this);
     var o = t.val();
     t.val(NavInput('date').parse(o));
   });
   $('input[data-navinput-time]').on('change', function(e){
     var t = $(this);
     var o = t.val();
     t.val(NavInput()['time'].parse(o));
   });
   $('input[data-navinput-datetime]').on('change', function(e){
      var t = $(this);
      var o = t.val();
      t.val(NavInput()['datetime'].parse(o));
    });
 **/
/**
 * NavInput
 * @see https://github.com/cwbit/js-navinput/
 * This creates an object in the format (see the bottom, it's the last thing to happen since we're not forcing any ES dep which allow
 * functions to bubble up to when they're first needed)
 * {
 *  type : {
 *    parse : function()
 *    formatter : function()
 *    replacers : [
 *      {
 *        pattern : RegExp
 *        replacer : function()
 *      }, ..
 *    ]
 *   }, ..
 * }
 * Optionally you can specify a type when creating it NavInput('date') to get an object back with just that particular set of functions
 */
var NavInput = function(type){

  /**
   * Array of replacer Objects for dealing with dates
   */
  var dateReplacers = [
    // t | . => 08/30/2016 (curr day)
    { pattern : /^(t|[.])$/i, replacer :  function(full, a){ var d = new Date(); return this.formatter(d.getDate(), d.getMonth()+1, d.getFullYear()); } },
    // su[n|nday] => sun of curr week
    { pattern : /^(su(?:(?:n)|(?:nday))?)$/i, replacer :  function(full, a){ var d = new Date(), dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+(0-d.getDay())); return this.formatter(dd.getDate(), dd.getMonth()+1, dd.getFullYear()); } },
    // m[o|on|onday] => mon of curr week
    { pattern : /^(m(?:(?:o)|(?:on)|(?:onday))?)$/i, replacer :  function(full, a){ var d = new Date(), dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+(1-d.getDay())); return this.formatter(dd.getDate(), dd.getMonth()+1, dd.getFullYear()); } },
    // tu[e|es|esday] => tue of curr week
    { pattern : /^(tu(?:(?:e)|(?:es)|(?:esday))?)$/i, replacer :  function(full, a){ var d = new Date(), dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+(2-d.getDay())); return this.formatter(dd.getDate(), dd.getMonth()+1, dd.getFullYear()); } },
    // w[e|ed|ednesday] => wed of curr week
    { pattern : /^(w(?:(?:e)|(?:ed)|(?:ednesday))?)$/i, replacer :  function(full, a){ var d = new Date(), dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+(3-d.getDay())); return this.formatter(dd.getDate(), dd.getMonth()+1, dd.getFullYear()); } },
    // th[u|urs|ursday] => thu of curr week
    { pattern : /^(th(?:(?:u)|(?:urs)|(?:ursday))?)$/i, replacer :  function(full, a){ var d = new Date(), dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+(4-d.getDay())); return this.formatter(dd.getDate(), dd.getMonth()+1, dd.getFullYear()); } },
    // f[r|ri|riday] => fri of curr week
    { pattern : /^(f(?:(?:r)|(?:ri)|(?:riday))?)$/i, replacer :  function(full, a){ var d = new Date(), dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+(5-d.getDay())); return this.formatter(dd.getDate(), dd.getMonth()+1, dd.getFullYear()); } },
    // sa[t|turday] => sat of curr week
    { pattern : /^(sa(?:(?:t)|(?:turday))?)$/i, replacer :  function(full, a){ var d = new Date(), dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()+(6-d.getDay())); return this.formatter(dd.getDate(), dd.getMonth()+1, dd.getFullYear()); } },
    // 5 => 5th day of curr month
    { pattern : /^(\d{1,2})$/i, replacer : function(full, a){ var d = new Date(); return this.formatter(a, d.getMonth()+1, d.getFullYear()); } },
    // 10.9 => 10th mo 9th day of curr year
    { pattern : /^(\d{1,2})[. /](\d{1,2})$/i, replacer : function(full, a, b){ var d = new Date(); return this.formatter(b, a, d.getFullYear()); } },
    // 1.1.16 => 01/01/2016
    { pattern : /^(\d{1,2})[. /](\d{1,2})[. /](\d{2,4})$/i, replacer : function(full, a, b, c){ c = c.match(/^(\d{2})$/) ? 2000 + parseInt(c) : c; return this.formatter(b, a, c); } }
  ];

  /**
   * Array of replacer Objects for dealing with times
   */  
  var timeReplacers = [
    // t | .
    { pattern : /^(t|[.])$/i, replacer :  function(full, a){ var d = new Date(); return this.formatter(d.getHours(), d.getMinutes(), d.getSeconds()); } },
    // 5 | 05 => 05:00:00
    { pattern : /^(\d{1,2})$/i, replacer : function(full, a){ return this.formatter(a, '00', '00'); } },
    // 5.5 => 05:05:00
    { pattern : /^(\d{1,2})[. :](\d{1,2})$/i, replacer : function(full, a, b){ return this.formatter(a, b, '00');  } },
    // 0530 => 05:30:00
    { pattern : /^(\d{2})(\d{2})$/i, replacer : function(full, a, b){ return this.formatter(a, b, '00'); } },
    // 5.5.30 => 05:05:30
    { pattern : /^(\d{1,2})[. :](\d{1,2})[. :](\d{1,2})$/i, replacer : function(full, a, b, c){ return this.formatter(a, b, c); } },
    // 050530 => 05:05:30
    { pattern : /^(\d{2})(\d{2})(\d{2})$/i, replacer : function(full, a, b, c){ return this.formatter(a, b, c); } },
    // 5.5.30,5 => 05:05:30.5
    { pattern : /^(\d{1,2})[. :](\d{1,2})[. :](\d{1,2})[,](\d{1,3})$/i, replacer : function(full, a, b, c, d){ return this.formatter(a, b, c, d); } },
    // 0505305 => 05:05:30.5
    { pattern : /^(\d{2})(\d{2})(\d{2})[,]?(\d{1,3})$/i, replacer : function(full, a, b, c, d){ return this.formatter(a, b, c, d); } }
  ];

  /**
   * Array of replacer Objects for dealing with datetimes
   * per NAV regulations these are essentially any valid date and time patterns seperated BY A SPACE
   */  
  var datetimeReplacers = [
    // t | . => 08/30/2016 14:27:01
    { pattern : /^(t|[.])$/i, replacer :  function(full, all){ return this.formatter(all,all); } },
    // all_pattern time_pattern => 08/30/2016 14:27:01; where date_pattern and time_pattern are strings matched by dateReplacers and timeReplacers respectively
    { pattern : /^(.+) (.+)$/i, replacer : function(full, date, time){ return this.formatter(date,time); } }
  ];

  /**
   * formatter function for Dates
   */
  var formatDate = function(day, month, year) {
    return month + '/' + day + '/' + year;
  };

  /**
   * formatter function for Times
   */
  var formatTime = function(hours, minutes, seconds, milliseconds) {
    return String("00" + hours).substring(String(hours).length) + 
          ':' + String("00" + minutes).substring(String(minutes).length) + 
          ':' + String("00" + seconds).substring(String(seconds).length) +  
          (milliseconds ? '.' + milliseconds : '');
  };

  /**
   * formatter function for DateTime
   */
  var formatDateTime = function(date, time){
    return NavInput().date.parse(date) + ' ' + NavInput().time.parse(time);
  };

  /**
   * Generic input parser that tries to match the input against the replacer.patterns
   * and returns either the parsed input or the original (unmodified) input
   */
  var parseGeneric = function(o){
   var t = this.replacers.filter(function(replacer){
      return o.match(replacer.pattern);
    });

   return o.replace(t[0].pattern, t[0].replacer.bind(this)) || o;
  };

  /**
   * Object of supported Nav Input types
   * Expected format type : { parse, replacers : [ { pattern , replacer }], format }
   */
  var supported = {
    date : {
      parse : parseGeneric,
      replacers : dateReplacers,
      formatter : formatDate
    },
    time : {
      parse : parseGeneric,
      replacers : timeReplacers,
      formatter : formatTime
    },
    datetime : {
      parse : parseGeneric,
      replacers : datetimeReplacers,
      formatter : formatDateTime
    }
  };
  
  // return an Object containing a collection of field types
  // we support and the functions for manipulating them
  if (typeof type != 'undefined') {
    return supported[type];
  } else {
    return supported;
  }
};
