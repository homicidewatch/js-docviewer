fs = require 'fs'
{exec} = require 'child_process'

task 'compile:all', 'Compile all CoffeeScript files into JavaScript', ->
    exec 'coffee --compile --output lib/ src/', (err, stdout, stderr) ->
        throw err if err
        console.log stdout
        console.log stderr