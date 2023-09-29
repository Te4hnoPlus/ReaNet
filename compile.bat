@echo off
@REM Project Name
set name=reanet

set install=true

where google-closure-compiler >nul && set install=false

IF %install% == true (
    echo Installing Google Clouse Compiler ...
    call npm i -g google-closure-compiler
)
echo Start compiling %name%...

google-closure-compiler --js goog-base.js --js %name%.js -O ADVANCED --js_output_file %name%-min.js && (
    echo Success! Saved to %name%-min.js.
)