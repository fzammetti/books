@echo off
cls

IF "%1" == "" GOTO BLANK

del response.txt

echo ------------------------------------------------------------------------
echo Testing %1 create (POST)...
echo ------------------------------------------------------------------------
curl -# -v -X POST http://127.0.0.1:80/%1 -H "Content-Type:application/json" -d @%1_create.json -o response.txt
curl -# -v -X POST http://127.0.0.1:80/%1 -H "Content-Type:application/json" -d @%1_create.json -o response.txt

SET /p ident= < response.txt

echo.
echo.
echo ------------------------------------------------------------------------
echo Testing %1 read (GET)...
echo ------------------------------------------------------------------------
curl -# -v -X GET http://127.0.0.1:80/%1/%ident%

echo.
echo.
echo ------------------------------------------------------------------------
echo Testing %1 get all...
echo ------------------------------------------------------------------------
curl -# -v -X GET http://127.0.0.1:80/%1

echo.
echo.
echo ------------------------------------------------------------------------
echo Testing %1 update (PUT)...
echo ------------------------------------------------------------------------
curl -# -v -X PUT http://127.0.0.1:80/%1/%ident% -H "Content-Type:application/json" -d @%1_update.json
curl -# -v -X GET http://127.0.0.1:80/%1/%ident%

echo.
echo.
echo ------------------------------------------------------------------------
echo Testing %1 delete (DELETE)...
echo ------------------------------------------------------------------------
curl -# -v -X DELETE http://127.0.0.1:80/%1/%ident%
curl -# -v -X GET http://127.0.0.1:80/%1/%ident%

GOTO DONE

:BLANK
echo Must specify appointment, contact, note or task

:DONE
