
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

TEMPLATE = '''
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
        return this
    
    render: =>
        $(@el).html( _.template TEMPLATE, @model.toJSON() )
            .css({
                float: "left"
                position: "relative"
                margin: ".5em 1em 1.5em 1em"
                height: "250px"
            })

class @DocWidget extends Backbone.View
    
    initialize: (opts) ->
        @el = $(opts.target)
        delete opts.target
        @results = new SearchResult [], opts
        return this
    
    render: =>
        root = this
        $(document).ready ->
            root.results.fetch 
                dataType: 'jsonp'
                success: ->
                    root.results.each (doc, i) ->
                        root.el.append doc.view.render()
        return this
        