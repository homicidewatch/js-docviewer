fs = require 'fs'
{exec} = require 'child_process'

task 'hello', 'Say hello', ->
    console.log "Hello, World!"

task 'compile', 'Compile all CoffeeScript files into JavaScript', ->
    exec 'coffee --compile *.coffee', (err, stdout, stderr) ->
        throw err if err
        console.log stdout
        console.log stderr