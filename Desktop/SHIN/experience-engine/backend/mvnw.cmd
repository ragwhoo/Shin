@echo off
setlocal enabledelayedexpansion

set "MVNW_REPOURL=https://repo.maven.apache.org/maven2"
set "MAVEN_VERSION=3.9.6"
set "WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar"
set "MAVEN_DIST=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%"

if not exist "%WRAPPER_JAR%" (
    echo Maven Wrapper JAR not found at %WRAPPER_JAR%
    exit /b 1
)

if not exist "%MAVEN_DIST%\bin\mvn.cmd" (
    echo Downloading Maven %MAVEN_VERSION% (one-time)...
    if not exist "%MAVEN_DIST%" mkdir "%MAVEN_DIST%"
    powershell -Command "try { $wc = New-Object System.Net.WebClient; $wc.DownloadFile('%MVNW_REPOURL%/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip', '%TEMP%\maven.zip'); } catch { exit 1 }"
    if errorlevel 1 (
        echo Download failed. Install Maven manually from https://maven.apache.org/download.cgi
        exit /b 1
    )
    powershell -Command "try { Expand-Archive '%TEMP%\maven.zip' -DestinationPath '%MAVEN_DIST%' -Force; } catch { exit 1 }"
    if errorlevel 1 (
        echo Extraction failed
        exit /b 1
    )
)

"%MAVEN_DIST%\apache-maven-%MAVEN_VERSION%\bin\mvn.cmd" %*
