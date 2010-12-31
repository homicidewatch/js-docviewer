(function() {
  var DocView, Document, SearchResult, TEMPLATE;
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
    Document.prototype.initialize = function(attrs) {
      this.view = new DocView({
        model: this
      });
      return this;
    };
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
  SearchResult = (function() {
    function SearchResult() {
      SearchResult.__super__.constructor.apply(this, arguments);
    }
    __extends(SearchResult, Backbone.Collection);
    SearchResult.prototype.model = Document;
    SearchResult.prototype.initialize = function(models, opts) {
      this.params = opts.params || {};
      return this;
    };
    SearchResult.prototype.parse = function(resp) {
      return resp.documents;
    };
    SearchResult.prototype.url = function() {
      return "http://www.documentcloud.org/api/search.json?" + ($.param(this.params));
    };
    return SearchResult;
  })();
  TEMPLATE = '<span class="doc-innter">\n    <div class"img">\n        <a href="<%= canonical_url %>"><img src="<%= resources.page.image.replace(/{page}/, 1).replace(/{size}/, \'small\') %>" /></a>\n    </div>\n    <div class="title" style="width: 180px;text-align:center;">\n        <a href="<%= canonical_url %>"><%= title %></a>\n    </div>\n</span>';
  DocView = (function() {
    function DocView() {
      this.render = __bind(this.render, this);;      DocView.__super__.constructor.apply(this, arguments);
    }
    __extends(DocView, Backbone.View);
    DocView.prototype.className = "dw-document";
    DocView.prototype.initialize = function(opts) {
      this.id = opts.model.id;
      return this;
    };
    DocView.prototype.render = function() {
      return $(this.el).html(_.template(TEMPLATE, this.model.toJSON())).css({
        float: "left",
        position: "relative",
        margin: ".5em 1em 1.5em 1em",
        height: "250px"
      });
    };
    return DocView;
  })();
  this.DocWidget = (function() {
    function DocWidget() {
      this.render = __bind(this.render, this);;      DocWidget.__super__.constructor.apply(this, arguments);
    }
    __extends(DocWidget, Backbone.View);
    DocWidget.prototype.initialize = function(opts) {
      this.el = $(opts.target);
      delete opts.target;
      this.results = new SearchResult([], opts);
      return this;
    };
    DocWidget.prototype.render = function() {
      var root;
      root = this;
      $(document).ready(function() {
        return root.results.fetch({
          dataType: 'jsonp',
          success: function() {
            return root.results.each(function(doc, i) {
              return root.el.append(doc.view.render());
            });
          }
        });
      });
      return this;
    };
    return DocWidget;
  })();
}).call(this);
