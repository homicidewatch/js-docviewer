
# models

class Document extends Backbone.Model
    
    initialize: (attrs) ->
        @view = new DocView model: this
        return this
    
    url: ->
        "http://www.documentcloud.org/api/documents/#{this.id}.json"
    
    toString: ->
        @get('title')
    
    getThumbnail: ->
        @get('resources')['thumbnail']

# Collection

class SearchResult extends Backbone.Collection
    
    model: Document
    
    initialize: (models, opts) ->
        @params = opts.params or {}
        return this
    
    parse: (resp) ->
        resp.documents
    
    url: ->
        "http://www.documentcloud.org/api/search.json?#{ $.param @params }"

# views

DEFAULT_TEMPLATE = '''
           <span class="doc-innter">
               <div class"img">
                   <a href="<%= canonical_url %>"><img src="<%= resources.page.image.replace(/{page}/, 1).replace(/{size}/, 'small') %>" /></a>
               </div>
               <div class="title" style="width: 180px;text-align:center;">
                   <a href="<%= canonical_url %>"><%= title %></a>
               </div>
           </span>
           '''

class DocView extends Backbone.View
    
    className: "dw-document"
    
    initialize: (opts) ->
        @id = opts.model.id
        @template = window.DOCUMENT_LIST_TEMPLATE or DEFAULT_TEMPLATE
        return this
    
    render: =>
        $(@el).html( _.template @template, @model.toJSON() )
            .css({
                float: "left"
                position: "relative"
                margin: ".5em 1em 1.5em 1em"
                height: "250px"
            })

class @DocumentList extends Backbone.View
    
    initialize: (opts) ->
        @container = opts.container or '#documents'
        @el = $(@container)
        delete opts.container
        
        @results = new SearchResult [], params: opts
        return this
    
    empty: =>
        $(@el).empty()
        return this
    
    render: =>
        @empty()
        root = this
        $(document).ready ->
            root.results.fetch 
                dataType: 'jsonp'
                success: ->
                    root.results.each (doc, i) ->
                        root.el.append doc.view.render()
        return this

class @DocumentViewer extends Backbone.Controller
    
    initialize: (opts) ->
        @viewerOpts = _.extend({
            container: opts.container or '#documents'
            sidebar: true
            width: $(opts.container).width() or 960
        }, opts.viewer or {})
        delete opts.viewer
        
        @list = new DocumentList opts
        Backbone.history.start()
        return this
            
    routes:
        ":id" : "documentDetail"
        ""        : "documentList"
    
    documentDetail: (id) =>
        @list.empty()
        DV.load "http://www.documentcloud.org/documents/#{id}.js", @viewerOpts
    
    documentList: =>
        @list.render()


