@echo off
@REM Settings
set name=reanet

echo Start compiling %name%...

google-closure-compiler --js goog-base.js --js %name%.js -O ADVANCED --js_output_file %name%-min.js && (
    echo Success! Saved to %name%-min.js.
)