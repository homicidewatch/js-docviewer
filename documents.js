(function() {
  var DocView, DocWidget, Document, SearchResult, TEMPLATE;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Document = (function() {
    function Document() {
      Document.__super__.constructor.apply(this, arguments);
    }
    __extends(Document, Backbone.Model);
    Document.prototype.url = function() {
      return "http://www.documentcloud.org/api/documents/" + this.id + ".json";
    };
    Document.prototype.toString = function() {
      return this.get('title');
    };
    Document.prototype.getThumbnail = function() {
      return this.get('resources')['thumbnail'];
    };
    return Document;
  })();
  this.DocumentSearch = (function() {
    function DocumentSearch() {
      DocumentSearch.__super__.constructor.apply(this, arguments);
    }
    __extends(DocumentSearch, Backbone.Model);
    DocumentSearch.prototype.initialize = function(attrs) {
      this.results = new SearchResult([], {
        params: attrs
      });
      this.view = new DocWidget({
        model: this
      });
      return this;
    };
    DocumentSearch.prototype.render = function() {
      return this.view.render();
    };
    return DocumentSearch;
  })();
  SearchResult = (function() {
    function SearchResult() {
      SearchResult.__super__.constructor.apply(this, arguments);
    }
    __extends(SearchResult, Backbone.Collection);
    SearchResult.prototype.initialize = function(models, opts) {
      return this.params = opts.params || {};
    };
    SearchResult.prototype.url = function() {
      return "http://www.documentcloud.org/api/search.json?" + ($.param(this.params));
    };
    return SearchResult;
  })();
  TEMPLATE = '<div class="doc-innter">\n    <div class"img">\n        <a href="<%= canonical_url %>"><img src="<%= resources.thumbnail %>" /></a>\n    </div>\n    <div class="title">\n        <a href="<%= canonical_url %>"><%= title %></a>\n    </div>\n</div>';
  DocView = (function() {
    function DocView() {
      this.render = __bind(this.render, this);;      DocView.__super__.constructor.apply(this, arguments);
    }
    __extends(DocView, Backbone.View);
    DocView.prototype.initialize = function(opts) {
      this.id = opts.model.id;
      return this.className = "document";
    };
    DocView.prototype.render = function() {
      return _.template(TEMPLATE, this.model);
    };
    return DocView;
  })();
  DocWidget = (function() {
    function DocWidget() {
      this.render = __bind(this.render, this);;      DocWidget.__super__.constructor.apply(this, arguments);
    }
    __extends(DocWidget, Backbone.View);
    DocWidget.prototype.render = function() {
      var root;
      root = this;
      return this.model.results.each(function(doc, i) {
        return root.el.append(doc.view.render());
      });
    };
    return DocWidget;
  })();
}).call(this);
