// Хранилище данных
let blocks = [];
let emailBlocks = [];
let currentEditingBlock = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadBlocksFromStorage();
    initializeEventListeners();
    renderAvailableBlocks();
    renderAdminBlocks();
});

// Загрузка блоков из localStorage
function loadBlocksFromStorage() {
    const savedBlocks = localStorage.getItem('emailBlocks');
    if (savedBlocks) {
        blocks = JSON.parse(savedBlocks);
    } else {
        // Примеры блоков по умолчанию
        blocks = [
            {
                id: generateId(),
                name: 'Заголовок',
                html: '<div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;"><h1 style="margin: 0; font-size: 32px; font-weight: bold;" data-editable="text">Добро пожаловать!</h1></div>'
            },
            {
                id: generateId(),
                name: 'Текстовый блок',
                html: '<div style="padding: 30px 20px; background: #ffffff;"><p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;" data-editable="text">Это текстовый блок. Вы можете редактировать этот текст по своему усмотрению.</p></div>'
            },
            {
                id: generateId(),
                name: 'Кнопка',
                html: '<div style="text-align: center; padding: 30px 20px; background: #f8f9fa;"><a href="https://example.com" style="display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;" data-editable="text" data-editable-href="href">Нажми меня</a></div>'
            },
            {
                id: generateId(),
                name: 'Изображение',
                html: '<div style="padding: 20px; text-align: center; background: #ffffff;"><img src="https://via.placeholder.com/600x300" alt="Изображение" style="max-width: 100%; height: auto; border-radius: 8px;" data-editable-src="src" /></div>'
            },
            {
                id: generateId(),
                name: 'Две колонки',
                html: '<div style="padding: 30px 20px; background: #ffffff;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="48%" style="padding: 15px; background: #f8f9fa; border-radius: 8px; vertical-align: top;"><h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px;" data-editable="text">Левая колонка</h3><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;" data-editable="text">Текст левой колонки</p></td><td width="4%"></td><td width="48%" style="padding: 15px; background: #f8f9fa; border-radius: 8px; vertical-align: top;"><h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px;" data-editable="text">Правая колонка</h3><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;" data-editable="text">Текст правой колонки</p></td></tr></table></div>'
            },
            {
                id: generateId(),
                name: 'Футер',
                html: '<div style="text-align: center; padding: 30px 20px; background: #2c3e50; color: white;"><p style="margin: 0 0 10px 0; font-size: 14px;" data-editable="text">© 2025 Ваша Компания. Все права защищены.</p><p style="margin: 0; font-size: 12px; color: #95a5a6;" data-editable="text">Email: info@example.com | Телефон: +7 (123) 456-78-90</p></div>'
            }
        ];
        saveBlocksToStorage();
    }
}

// Сохранение блоков в localStorage
function saveBlocksToStorage() {
    localStorage.setItem('emailBlocks', JSON.stringify(blocks));
}

// Генерация уникального ID
function generateId() {
    return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    // Переключение режимов
    document.getElementById('adminMode').addEventListener('click', function() {
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('userPanel').classList.add('hidden');
        this.classList.add('active');
        document.getElementById('userMode').classList.remove('active');
    });

    document.getElementById('userMode').addEventListener('click', function() {
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('userPanel').classList.remove('hidden');
        this.classList.add('active');
        document.getElementById('adminMode').classList.remove('active');
    });

    // Админ панель
    document.getElementById('addBlock').addEventListener('click', addNewBlock);

    // Панель пользователя
    document.getElementById('clearEmail').addEventListener('click', clearEmail);
    document.getElementById('previewEmail').addEventListener('click', showPreview);
    document.getElementById('exportEmail').addEventListener('click', showExport);

    // Редактор
    document.getElementById('closeEditor').addEventListener('click', function() {
        document.querySelector('.editor-panel').classList.add('hidden');
    });

    // Модальные окна
    document.getElementById('closePreview').addEventListener('click', function() {
        document.getElementById('previewModal').classList.add('hidden');
    });

    document.getElementById('closeExport').addEventListener('click', function() {
        document.getElementById('exportModal').classList.add('hidden');
    });

    document.getElementById('copyHTML').addEventListener('click', copyToClipboard);
}

// Добавление нового блока администратором
function addNewBlock() {
    const name = document.getElementById('blockName').value.trim();
    const html = document.getElementById('blockHTML').value.trim();

    if (!name || !html) {
        alert('Пожалуйста, заполните название и HTML код блока');
        return;
    }

    const newBlock = {
        id: generateId(),
        name: name,
        html: html
    };

    blocks.push(newBlock);
    saveBlocksToStorage();
    renderAdminBlocks();
    renderAvailableBlocks();

    // Очистка полей
    document.getElementById('blockName').value = '';
    document.getElementById('blockHTML').value = '';

    alert('Блок успешно добавлен!');
}

// Удаление блока администратором
function deleteBlock(blockId) {
    if (!confirm('Вы уверены, что хотите удалить этот блок?')) {
        return;
    }

    blocks = blocks.filter(block => block.id !== blockId);
    saveBlocksToStorage();
    renderAdminBlocks();
    renderAvailableBlocks();
}

// Отображение блоков в админ панели
function renderAdminBlocks() {
    const container = document.getElementById('adminBlocksList');
    container.innerHTML = '';

    if (blocks.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Нет добавленных блоков</p>';
        return;
    }

    blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.className = 'admin-block-item';
        blockElement.innerHTML = `
            <h4>${escapeHtml(block.name)}</h4>
            <pre>${escapeHtml(block.html)}</pre>
            <button onclick="deleteBlock('${block.id}')">Удалить</button>
        `;
        container.appendChild(blockElement);
    });
}

// Отображение доступных блоков для пользователя
function renderAvailableBlocks() {
    const container = document.getElementById('availableBlocks');
    container.innerHTML = '';

    if (blocks.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Нет доступных блоков</p>';
        return;
    }

    blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.className = 'block-item';
        blockElement.innerHTML = `<h4>${escapeHtml(block.name)}</h4>`;
        blockElement.addEventListener('click', () => addBlockToEmail(block));
        container.appendChild(blockElement);
    });
}

// Добавление блока в email
function addBlockToEmail(block) {
    const emailBlock = {
        id: generateId(),
        sourceId: block.id,
        name: block.name,
        html: block.html
    };

    emailBlocks.push(emailBlock);
    renderEmailCanvas();
}

// Отображение email canvas
function renderEmailCanvas() {
    const canvas = document.getElementById('emailCanvas');
    canvas.innerHTML = '';

    if (emailBlocks.length === 0) {
        canvas.innerHTML = '<div class="empty-state"><p>👈 Выберите блоки из библиотеки слева</p></div>';
        return;
    }

    emailBlocks.forEach((block, index) => {
        const blockElement = document.createElement('div');
        blockElement.className = 'canvas-block';
        blockElement.innerHTML = `
            <div class="canvas-block-content">${block.html}</div>
            <div class="canvas-block-controls">
                <button class="edit-btn" onclick="editBlock('${block.id}')">✏️ Редактировать</button>
                ${index > 0 ? `<button class="move-up-btn" onclick="moveBlock('${block.id}', 'up')">↑</button>` : ''}
                ${index < emailBlocks.length - 1 ? `<button class="move-down-btn" onclick="moveBlock('${block.id}', 'down')">↓</button>` : ''}
                <button class="delete-btn" onclick="deleteEmailBlock('${block.id}')">🗑️ Удалить</button>
            </div>
        `;
        canvas.appendChild(blockElement);
    });
}

// Редактирование блока
function editBlock(blockId) {
    const block = emailBlocks.find(b => b.id === blockId);
    if (!block) return;

    currentEditingBlock = blockId;
    
    const editorPanel = document.querySelector('.editor-panel');
    const editorContent = document.getElementById('editorContent');
    
    // Парсим HTML и находим редактируемые элементы
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = block.html;
    
    const editableElements = tempDiv.querySelectorAll('[data-editable], [data-editable-href], [data-editable-src]');
    
    editorContent.innerHTML = '<p style="color: #666; margin-bottom: 20px;">Редактируйте содержимое блока:</p>';
    
    if (editableElements.length === 0) {
        editorContent.innerHTML += '<p style="color: #999;">Этот блок не содержит редактируемых элементов</p>';
    } else {
        editableElements.forEach((element, index) => {
            const field = document.createElement('div');
            field.className = 'editable-field';
            
            if (element.hasAttribute('data-editable')) {
                const label = document.createElement('label');
                label.textContent = `Текст ${index + 1}:`;
                field.appendChild(label);
                
                if (element.tagName === 'P' || element.tagName === 'DIV') {
                    const textarea = document.createElement('textarea');
                    textarea.value = element.textContent;
                    textarea.dataset.index = index;
                    textarea.dataset.type = 'text';
                    field.appendChild(textarea);
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = element.textContent;
                    input.dataset.index = index;
                    input.dataset.type = 'text';
                    field.appendChild(input);
                }
            }
            
            if (element.hasAttribute('data-editable-href')) {
                const label = document.createElement('label');
                label.textContent = `Ссылка ${index + 1}:`;
                field.appendChild(label);
                
                const input = document.createElement('input');
                input.type = 'url';
                input.value = element.getAttribute('href') || '';
                input.dataset.index = index;
                input.dataset.type = 'href';
                field.appendChild(input);
            }
            
            if (element.hasAttribute('data-editable-src')) {
                const label = document.createElement('label');
                label.textContent = `URL изображения ${index + 1}:`;
                field.appendChild(label);
                
                const input = document.createElement('input');
                input.type = 'url';
                input.value = element.getAttribute('src') || '';
                input.dataset.index = index;
                input.dataset.type = 'src';
                field.appendChild(input);
            }
            
            editorContent.appendChild(field);
        });
        
        // Добавляем кнопку сохранения
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-primary';
        saveBtn.textContent = 'Сохранить изменения';
        saveBtn.style.marginTop = '20px';
        saveBtn.addEventListener('click', saveBlockEdits);
        editorContent.appendChild(saveBtn);
    }
    
    editorPanel.classList.remove('hidden');
}

// Сохранение изменений блока
function saveBlockEdits() {
    const block = emailBlocks.find(b => b.id === currentEditingBlock);
    if (!block) return;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = block.html;
    
    const editableElements = tempDiv.querySelectorAll('[data-editable], [data-editable-href], [data-editable-src]');
    const inputs = document.querySelectorAll('#editorContent input, #editorContent textarea');
    
    inputs.forEach(input => {
        const index = parseInt(input.dataset.index);
        const type = input.dataset.type;
        const element = editableElements[index];
        
        if (type === 'text') {
            element.textContent = input.value;
        } else if (type === 'href') {
            element.setAttribute('href', input.value);
        } else if (type === 'src') {
            element.setAttribute('src', input.value);
        }
    });
    
    block.html = tempDiv.innerHTML;
    renderEmailCanvas();
    
    document.querySelector('.editor-panel').classList.add('hidden');
    alert('Изменения сохранены!');
}

// Перемещение блока
function moveBlock(blockId, direction) {
    const index = emailBlocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
        [emailBlocks[index], emailBlocks[index - 1]] = [emailBlocks[index - 1], emailBlocks[index]];
    } else if (direction === 'down' && index < emailBlocks.length - 1) {
        [emailBlocks[index], emailBlocks[index + 1]] = [emailBlocks[index + 1], emailBlocks[index]];
    }
    
    renderEmailCanvas();
}

// Удаление блока из email
function deleteEmailBlock(blockId) {
    emailBlocks = emailBlocks.filter(b => b.id !== blockId);
    renderEmailCanvas();
}

// Очистка email
function clearEmail() {
    if (emailBlocks.length === 0) return;
    
    if (confirm('Вы уверены, что хотите очистить письмо?')) {
        emailBlocks = [];
        document.getElementById('emailSubject').value = '';
        renderEmailCanvas();
    }
}

// Предпросмотр email
function showPreview() {
    if (emailBlocks.length === 0) {
        alert('Сначала добавьте блоки в письмо');
        return;
    }
    
    const subject = document.getElementById('emailSubject').value || 'Без темы';
    const html = generateFullEmailHTML();
    
    document.querySelector('.preview-subject').textContent = `Тема: ${subject}`;
    
    const iframe = document.getElementById('previewFrame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    document.getElementById('previewModal').classList.remove('hidden');
}

// Экспорт HTML
function showExport() {
    if (emailBlocks.length === 0) {
        alert('Сначала добавьте блоки в письмо');
        return;
    }
    
    const html = generateFullEmailHTML();
    document.getElementById('exportHTML').value = html;
    document.getElementById('exportModal').classList.remove('hidden');
}

// Генерация полного HTML письма
function generateFullEmailHTML() {
    const subject = document.getElementById('emailSubject').value || 'Без темы';
    const blocksHTML = emailBlocks.map(block => block.html).join('\n');
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(subject)}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${blocksHTML}
    </div>
</body>
</html>`;
}

// Копирование HTML в буфер обмена
function copyToClipboard() {
    const textarea = document.getElementById('exportHTML');
    textarea.select();
    document.execCommand('copy');
    alert('HTML скопирован в буфер обмена!');
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

