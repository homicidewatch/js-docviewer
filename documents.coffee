
# models

class Document extends Backbone.Model
    
    url: ->
        "http://www.documentcloud.org/api/documents/#{this.id}.json"
    
    toString: ->
        @get('title')
    
    getThumbnail: ->
        @get('resources')['thumbnail']

class @DocumentSearch extends Backbone.Model
    
    initialize: (attrs) ->
        @results = new SearchResult [], params: attrs
        @view = new DocWidget model: this
        return this
    
    render: ->
        
        @view.render()

# Collection

class SearchResult extends Backbone.Collection
    
    initialize: (models, opts) ->
        @params = opts.params or {}
    
    parse: (resp) ->
        resp.documents
    
    url: ->
        "http://www.documentcloud.org/api/search.json?#{ $.param @params }"

# views

TEMPLATE = '''
           <div class="doc-innter">
               <div class"img">
                   <a href="<%= canonical_url %>"><img src="<%= resources.thumbnail %>" /></a>
               </div>
               <div class="title">
                   <a href="<%= canonical_url %>"><%= title %></a>
               </div>
           </div>
           '''

class DocView extends Backbone.View
    
    initialize: (opts) ->
        @id = opts.model.id
        @className = "document"
    
    render: =>
        _.template TEMPLATE, @model

class DocWidget extends Backbone.View
    
    render: =>
        root = this
        @model.results.each (doc, i) ->
            root.el.append doc.view.render()
        