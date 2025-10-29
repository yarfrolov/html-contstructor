@echo off
REM Скрипт для быстрого деплоя на GitHub Pages (Windows)

echo.
echo 🚀 Деплой конструктора писем на GitHub Pages
echo.

REM Проверка, инициализирован ли git
if not exist .git (
    echo ❌ Git репозиторий не инициализирован!
    echo Выполните следующие команды:
    echo.
    echo git init
    echo git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo.
    pause
    exit /b 1
)

REM Проверка статуса
echo 📊 Проверка изменений...
git status

echo.
set /p choice="❓ Добавить все изменения? (y/n): "

if /i "%choice%"=="y" (
    REM Добавление файлов
    echo ➕ Добавление файлов...
    git add .
    
    REM Коммит
    echo.
    set /p commit_message="📝 Введите сообщение коммита: "
    
    if "%commit_message%"=="" (
        set commit_message=Update files
    )
    
    git commit -m "%commit_message%"
    
    REM Пуш
    echo.
    echo ⬆️  Отправка на GitHub...
    git push
    
    echo.
    echo ✅ Деплой завершен!
    echo 🌐 Ваш сайт обновится через 1-2 минуты
    echo.
) else (
    echo ❌ Деплой отменен
)

pause

