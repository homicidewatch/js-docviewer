(function() {
  var DEFAULT_TEMPLATE, DocView, Document, SearchResult;
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
      this.params = _.extend({
        per_page: 10,
        page: 1
      }, opts.params);
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
  DEFAULT_TEMPLATE = '<span class="doc-innter">\n    <div class"img">\n        <a href="#<%= id %>"><img src="<%= resources.page.image.replace(/{page}/, 1).replace(/{size}/, \'small\') %>" /></a>\n    </div>\n    <div class="title" style="width: 180px;text-align:center;">\n        <a href="#<%= id %>"><%= title %></a>\n    </div>\n</span>';
  DocView = (function() {
    function DocView() {
      this.render = __bind(this.render, this);;      DocView.__super__.constructor.apply(this, arguments);
    }
    __extends(DocView, Backbone.View);
    DocView.prototype.className = "dw-document";
    DocView.prototype.initialize = function(opts) {
      this.id = opts.model.id;
      this.template = window.DOCUMENT_LIST_TEMPLATE || DEFAULT_TEMPLATE;
      return this;
    };
    DocView.prototype.render = function() {
      return $(this.el).html(_.template(this.template, this.model.toJSON())).css({
        float: "left",
        position: "relative",
        margin: ".5em 1em 1.5em 1em",
        height: "250px"
      });
    };
    return DocView;
  })();
  this.DocumentList = (function() {
    function DocumentList() {
      this.render = __bind(this.render, this);;
      this.empty = __bind(this.empty, this);;      DocumentList.__super__.constructor.apply(this, arguments);
    }
    __extends(DocumentList, Backbone.View);
    DocumentList.prototype.initialize = function(opts) {
      this.container = opts.container || '#documents';
      this.el = $(this.container);
      delete opts.container;
      this.results = new SearchResult([], {
        params: opts
      });
      return this;
    };
    DocumentList.prototype.empty = function() {
      $(this.el).empty();
      $(this.el).css({
        width: '',
        height: ''
      });
      return this;
    };
    DocumentList.prototype.render = function() {
      var root;
      this.empty();
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
    return DocumentList;
  })();
  this.DocumentViewer = (function() {
    function DocumentViewer() {
      this.getPage = __bind(this.getPage, this);;
      this.documentList = __bind(this.documentList, this);;
      this.documentDetail = __bind(this.documentDetail, this);;      DocumentViewer.__super__.constructor.apply(this, arguments);
    }
    __extends(DocumentViewer, Backbone.Controller);
    DocumentViewer.prototype.initialize = function(opts) {
      this.viewerOpts = _.extend({
        container: opts.container || '#documents',
        sidebar: true,
        width: $(opts.container).width() || 960
      }, opts.viewer || {});
      delete opts.viewer;
      this.list = new DocumentList(opts);
      Backbone.history.start();
      return this;
    };
    DocumentViewer.prototype.routes = {
      ":id": "documentDetail",
      "page/:page": "getPage"
    };
    DocumentViewer.prototype.documentDetail = function(id) {
      if (id) {
        this.list.empty();
        DV.load("http://www.documentcloud.org/documents/" + id + ".js", this.viewerOpts);
        return this;
      } else {
        return this.documentList();
      }
    };
    DocumentViewer.prototype.documentList = function() {
      this.list.render();
      return this;
    };
    DocumentViewer.prototype.getPage = function(page) {
      if (page == null) {
        page = 1;
      }
      this.list.results.params.page = page;
      return this.documentList();
    };
    return DocumentViewer;
  })();
}).call(this);
