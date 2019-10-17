@echo off

:BEGIN
if exist config.json (
    npm start
) else (
    npm run-script first-run
    call BEGIN
)