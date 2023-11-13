@echo off
setlocal

REM Delete PostgreSQL folder
set "postgreFolderName=postgresql"

REM Combine the current path and the PostgreSQL folder
set "postgreFolderPath=%cd%\%postgreFolderName%"

REM Check if the folder exists before attempting to delete it
if exist "%postgreFolderPath%" (
    rmdir /s /q "%postgreFolderPath%"
    echo PostgreSQL folder deleted successfully.
) else (
    echo PostgreSQL folder does not exist.
)
echo.

REM Delete Redis folder
set "redisFolderName=redis"

REM Combine the current path and the Redis folder
set "redisFolderPath=%cd%\%redisFolderName%"

REM Check if the folder exists before attempting to delete it
if exist "%redisFolderPath%" (
    rmdir /s /q "%redisFolderPath%"
    echo Redis folder deleted successfully.
) else (
    echo Redis folder does not exist.
)
echo.

endlocal

REM Delete the Docker image with the tag "restservice-rest-api:latest"
docker rmi restservice-rest-api:latest