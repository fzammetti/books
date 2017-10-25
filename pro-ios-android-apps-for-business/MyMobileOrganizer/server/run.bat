@echo off

REM ***************************************************************************
REM ********* This assumes that Node.js and MongoDB are in your path! *********
REM ***************************************************************************

cls

start mongod --dbpath .\db
node.exe main.js
