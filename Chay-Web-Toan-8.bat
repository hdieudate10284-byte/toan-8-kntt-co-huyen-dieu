@echo off
title He Thong Toan 8 KNTT - Co Huyen Dieu (THCS Nguyen Hue)
chcp 65001 >nul
cls

echo =========================================================================
echo   🏫 TRƯỜNG THCS NGUYỄN HUỆ - MÔN TOÁN 8 (KẾT NỐI TRI THỨC)
echo   👩‍🏫 GIÁO VIÊN PHỤ TRÁCH: CÔ NGUYỄN THỊ HUYỀN DIỆU
echo =========================================================================
echo.
echo   🚀 Đang khởi động máy chủ Web App trên cổng http://localhost:3000 ...
echo   🌐 Trình duyệt Google Chrome / Edge sẽ tự động mở trong giây lát!
echo.
echo =========================================================================
echo.

cd /d "%~dp0"
npm run dev

pause
