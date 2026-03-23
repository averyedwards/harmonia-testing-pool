@echo off
set NODE_PATH=C:\Program Files\Microsoft Visual Studio\18\Insiders\MSBuild\Microsoft\VisualStudio\NodeJs
set PATH=%PATH%;%NODE_PATH%
cd /d "C:\Users\porte\OneDrive\Desktop\Testing Pool Claude Code\harmonia-testing-pool"
"%NODE_PATH%\npm.cmd" run dev
