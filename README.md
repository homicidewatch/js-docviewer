A JavaScript (actually CoffeeScript) Document Viewer
===============

This is an attempt to build a portable document library and viewer entirely client-side, using the public [API](http://documentcloud.org/api) provided by [DocumentCloud](http://documentcloud.org).

Getting started:

Clone or download from this repository. Include on your page the following dependencies:

 - [jQuery](http://jquery.com)
 - [underscore.js](https://github.com/documentcloud/underscore)
 - [backbone.js](https://github.com/documentcloud/backbone)
 - documents.js

(At some point in the future, I'll probably package everything into one download using [Jammit](https://github.com/documentcloud/jammit). For now, you're stuck with dependencies.)

Embed:

    <div id="documents"></div>
    <script>
    var docs = new DocumentViewer({
        q: "group:homicide-watch",
        per_page: 12,
        page: 1
    })
    </script>
    
See [DocumentCloud's API documentation](http://documentcloud.org/api) for arguments.