@echo off
setlocal

REM Delete PostgreSQL folder
set "postgreFolderName=postgresql"

REM Combine the current path and the PostgreSQL folder
set "postgreFolderPath=%cd%\%postgreFolderName%"

REM Check if the folder exists before attempting to delete it
if exist "%postgreFolderPath%" (
    rmdir /s /q "%postgreFolderPath%"
    echo RESTService PostgreSQL folder deleted successfully.
) else (
    echo RESTService PostgreSQL folder does not exist.
)

REM Delete Redis folder
set "redisFolderName=redis"

REM Combine the current path and the Redis folder
set "redisFolderPath=%cd%\%redisFolderName%"

REM Check if the folder exists before attempting to delete it
if exist "%redisFolderPath%" (
    rmdir /s /q "%redisFolderPath%"
    echo RESTService Redis folder deleted successfully.
) else (
    echo RESTService Redis folder does not exist.
)

endlocal

REM Delete the Docker image with the tag "spaces-rest-service:latest"
docker rmi spaces-rest-service:latest

echo.