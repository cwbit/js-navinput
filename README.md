# js-navinput
Lightweight Javascript Lib that allows &lt;input> fields to use familiar Microsoft Dynamics Navision shortcuts

# What is it?

> TLDR; This is a lightweight JS Lib that allows <input> fields to use the shortcuts familiar to users of Microsoft Dynamics Navision.

Microsoft's Dynamics Navision (NAV) is an app with a ton of sweet input field shortcuts that make data entry quicker and more reliable. I always wished I had them for my web apps, so this lib is my attempt to make exactly that. 

This lib has *no dependencies*, but most of the examples are going to use jQuery to get the elements and attach change listeners to them. Again, not required, just used in the examples.

For a list of input shortcuts we are imitating
[https://msdn.microsoft.com/en-us/library/hh179519(v=nav.90).aspx](https://msdn.microsoft.com/en-us/library/hh179519(v=nav.90).aspx)

The ACTUAL shortcuts are determined by the *Replacers in the code (you can add/modify your own dynamically, too)

# Installation
Just add `navinput.js` to your project, and load it with `<script .. >` or equiv

# Usage
Here are some examples of usage.

CODEPEN (LIVE) : [http://codepen.io/cwbit/pen/wzwwVw](http://codepen.io/cwbit/pen/wzwwVw)

> NOTE : These examples use jQuery to listen for input changes and update the values but it's not required

```html
<input type="text" data-navinput-date placeholder="date"/>
<input type="text" data-navinput-time placeholder="time"/>
<input type="text" data-navinput-datetime placeholder="datetime"/>
<script type="text/javascript">
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
</script>
```

Here are some of the data transformations supported out of the box

## Dates

| input | converted to |
|-------|-------|
| `t | .` | 08/30/2016 (curr day) |
| `su[n|nday]` | sun of curr week |
| `m[o|on|onday]` | mon of curr week |
| `tu[e|es|esday]` | tue of curr week |
| `w[e|ed|ednesday]` | wed of curr week |
| `th[u|urs|ursday]` | thu of curr week |
| `f[r|ri|riday]` | fri of curr week |
| `sa[t|turday]` | sat of curr week |
| `5` | 5th day of curr month |
| `10.9` | 10th mo 9th day of curr year |
| `1.1.16` | 01/01/2016 |

## Times

| input | converted to |
|-------|-------|
| `t | .` | curr time |
| `5 | 05` | 05:00:00 |
| `5.5` | 05:05:00 |
| `0530` | 05:30:00 |
| `5.5.30` | 05:05:30 |
| `050530` | 05:05:30 |
| `5.5.30,5` | 05:05:30.5 |
| `0505305` | 05:05:30.5 |

## DateTime

| input | converted to |
|-------|-------|
| `t | .` | curr date time |
| `any any` | date time |
| `wed 10:45` | wed of curr week at 10:45:00 |
| `10/9 10:45` | 10/09/2016 10:45:00 |
