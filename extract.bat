@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ==========================================
echo    三板斧大师综断内容一键提取工具
echo ==========================================
echo.

set "input_date=%~1"
set "input_gender=%~2"

if "%input_date%"=="" (
    set /p "input_date=请输入出生日期时间 (格式: 1990-01-01 12:00): "
)

if "%input_gender%"=="" (
    set /p "input_gender=请输入性别 (男/女): "
)

echo.
echo 正在解析内容，请稍候...
echo.

node "%~dp0extract_master.js" "%input_date%" "%input_gender%"

echo.
pause
