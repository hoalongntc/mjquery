mQuery
======
Simple and lightweigh jQuery replacement. Using the same API with jQuery.

## Supported APIs

### Global
Globally exported as `$`, `mQuery` and `jQuery`

### Selecting Elements
```
$(selector)
```
`selector` can be:
+ `String`
+ `Node`
+ `NodeList`
+ `HTMLElement`
+ `HTMLCollection`
+ or another mQuery instance.

### DOM Manipulation
```
$(selector).show()          # Set display to none
$(selector).hide()          # Clear display css attribute
$(selector).addClass()
$(selector).removeClass()
$(selector).hasClass()
$(selector).toggleClass()
$(selector).css(cssClassname, cssValue)
```

### Events
```
$(selector).on(eventName, eventHandler);
$(selector).click(eventHandler);
```

### Ajax Requests
```
$.ajax(url, options)
$.ajax(options)
```

`options` is a plain javascript object. Supported options:
+ `url`: The request URL
+ `method`: Request method. Eg: GET, POST, PUT, DELETE...
+ `data`: Data to send with request. Can be object or URLEncoded string
+ `success`: Function called on success (200 <= statusCode < 400)
+ `error`: Function called on failed

### Utils
```
$.param(obj) # Return URLEncoded query string
$.clone(obj) # Clone an object
```

## LICENSE
MIT