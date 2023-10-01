@echo off
@REM Compile script
@REM Use "compile all" to compile all project

set name=%1

set install=true
where google-closure-compiler >nul && set install=false

IF %install% == true (
    echo Installing Google Clouse Compiler ...
    call npm i -g google-closure-compiler
)

IF "%name%" == "all"  (
    call :compile modules/sl_rloader e
    call :compile modules/lang e
    call :compile reanet 
    goto :end
)
if "%name%" == "" (
    call :compile reanet 
    goto :end
)
call :compile %name% %2

goto :end

:compile <nm> <e> <o>
echo Start compiling %1...
set sub=%2
set opt=-O ADVANCED
set goog=--js goog-base.js

IF "%2" == "e" (
    set sub=--externs reanet.js --hide_warnings_for reanet.js
)
if "%3" == "s" (
    set opt=
    set goog=
    echo Using Simple
)

google-closure-compiler %goog% --js %1.js %opt% --js_output_file dist/%1-min.js %sub% && (
    echo Success! Saved to %1-min.js.
)
goto :eof

:end