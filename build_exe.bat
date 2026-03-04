@echo off
echo =========================================
echo   八字大师智断终端 - EXE 打包程序
echo =========================================
echo.
echo [1/3] 正在安装打包工具 pkg...
call npm install -g pkg
echo.
echo [2/3] 正在执行打包...
call npm run build
echo.
echo [3/3] 打包完成！
echo.
echo 生成文件: bazi_master.exe
echo 您可以直接双击该文件运行，无需 Node.js 环境。
echo =========================================
pause
