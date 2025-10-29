#!/bin/bash

# Скрипт для быстрого деплоя на GitHub Pages

echo "🚀 Деплой конструктора писем на GitHub Pages"
echo ""

# Проверка, инициализирован ли git
if [ ! -d .git ]; then
    echo "❌ Git репозиторий не инициализирован!"
    echo "Выполните следующие команды:"
    echo ""
    echo "git init"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    exit 1
fi

# Проверка статуса
echo "📊 Проверка изменений..."
git status

echo ""
read -p "❓ Добавить все изменения? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Добавление файлов
    echo "➕ Добавление файлов..."
    git add .
    
    # Коммит
    echo ""
    read -p "📝 Введите сообщение коммита: " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update files"
    fi
    
    git commit -m "$commit_message"
    
    # Пуш
    echo ""
    echo "⬆️  Отправка на GitHub..."
    git push
    
    echo ""
    echo "✅ Деплой завершен!"
    echo "🌐 Ваш сайт обновится через 1-2 минуты"
    echo ""
else
    echo "❌ Деплой отменен"
fi

