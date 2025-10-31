// Хранилище данных
let blocks = [];
let emailBlocks = [];
let currentEditingBlock = null;
let currentRole = null;
let selectedRole = 'user';

// Пароли
const PASSWORDS = {
    admin: 'admin-m2',
    user: 'user-m2'
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadBlocksFromStorage();
    initializeEventListeners();
    initializeLoginListeners();
});

// Загрузка блоков из localStorage
function loadBlocksFromStorage() {
    const savedBlocks = localStorage.getItem('emailBlocks');
    if (savedBlocks) {
        try {
            blocks = JSON.parse(savedBlocks);
            // Если массив пустой или поврежден, загружаем по умолчанию
            if (!Array.isArray(blocks) || blocks.length === 0) {
                loadDefaultBlocks();
            }
        } catch (e) {
            console.error('Ошибка загрузки блоков:', e);
            loadDefaultBlocks();
        }
    } else {
        loadDefaultBlocks();
    }
}

// Загрузка блоков по умолчанию
function loadDefaultBlocks() {
        // Примеры блоков по умолчанию
        blocks = [
            {
                id: generateId(),
                name: 'Заголовок',
                html: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"><tr><td style="padding: 40px 20px; text-align: center;"><h1 style="font-size: 24px; margin: 0 0 1.25rem 0; font-weight: 600; color: white;" data-editable="text">Привет!</h1></td></tr></table>'
            },
            {
                id: generateId(),
                name: 'Подзаголовок',
                html: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff;"><tr><td style="padding: 20px 20px 30px 20px; text-align: center;"><h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #667eea;" data-editable="text">Ваш успех начинается здесь</h2><p style="margin: 10px 0 0 0; font-size: 14px; color: #999; font-style: italic;" data-editable="text">Присоединяйтесь к тысячам довольных пользователей</p></td></tr></table>'
            },
            {
                id: generateId(),
                name: 'Текстовый блок',
                html: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff;"><tr><td style="padding: 30px 20px;"><p style="line-height: 140%; margin: 0 0 1rem 0;" data-editable="text">Поздравляем с успешным прохождением испытательного срока!</p></td></tr></table>'
            },
            {
                id: generateId(),
                name: 'Кнопка',
                html: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8f9fa;"><tr><td style="padding: 30px 20px; text-align: center;"><a href="https://example.com" style="display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;" data-editable="text" data-editable-href="href">Нажми меня</a></td></tr></table>'
            },
            {
                id: generateId(),
                name: 'Изображение',
                html: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff;"><tr><td style="padding: 20px; text-align: center;"><img src="https://via.placeholder.com/600x300" alt="Изображение" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" data-editable-src="src" /></td></tr></table>'
            },
            {
                id: generateId(),
                name: 'Две колонки',
                html: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff;"><tr><td style="padding: 30px 20px;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="48%" style="padding: 15px; background: #f8f9fa; vertical-align: top;"><h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px;" data-editable="text">Левая колонка</h3><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;" data-editable="text">Текст левой колонки</p></td><td width="4%"></td><td width="48%" style="padding: 15px; background: #f8f9fa; vertical-align: top;"><h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px;" data-editable="text">Правая колонка</h3><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;" data-editable="text">Текст правой колонки</p></td></tr></table></td></tr></table>'
            },
            {
                id: generateId(),
                name: 'Футер',
                html: '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #2c3e50;"><tr><td style="padding: 30px 20px; text-align: center;"><p style="margin: 0 0 10px 0; font-size: 14px; color: white;" data-editable="text">© 2025 Ваша Компания. Все права защищены.</p><p style="margin: 0; font-size: 12px; color: #95a5a6;" data-editable="text">Email: info@example.com | Телефон: +7 (123) 456-78-90</p></td></tr></table>'
            }
        ];
        saveBlocksToStorage();
}

// Сброс блоков к значениям по умолчанию
function resetToDefaultBlocks() {
    if (!confirm('Вы уверены, что хотите сбросить все блоки к значениям по умолчанию? Это удалит все ваши пользовательские блоки!')) {
        return;
    }
    
    loadDefaultBlocks();
    renderAdminBlocks();
    renderAvailableBlocks();
    alert('Блоки успешно восстановлены к значениям по умолчанию!');
}

// Сохранение блоков в localStorage
function saveBlocksToStorage() {
    localStorage.setItem('emailBlocks', JSON.stringify(blocks));
}

// Генерация уникального ID
function generateId() {
    return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Проверка авторизации
function checkAuthentication() {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
        currentRole = auth;
        showMainApp();
    } else {
        showLoginScreen();
    }
}

// Показать экран входа
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

// Показать главное приложение
function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Настроить интерфейс в зависимости от роли
    if (currentRole === 'admin') {
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('userPanel').classList.add('hidden');
        document.getElementById('adminMode').classList.add('active');
        document.getElementById('userMode').classList.remove('active');
    } else {
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('userPanel').classList.remove('hidden');
        document.getElementById('adminMode').classList.remove('active');
        document.getElementById('userMode').classList.add('active');
        
        // Скрыть кнопку администратора для обычных пользователей
        document.getElementById('adminMode').style.display = 'none';
    }
    
    renderAvailableBlocks();
    renderAdminBlocks();
}

// Инициализация обработчиков для экрана входа
function initializeLoginListeners() {
    // Выбор роли
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            roleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedRole = this.dataset.role;
            document.getElementById('loginError').classList.add('hidden');
        });
    });
    
    // Вход по кнопке
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    
    // Вход по Enter
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

// Обработка входа
function handleLogin() {
    const password = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('loginError');
    
    if (password === PASSWORDS[selectedRole]) {
        // Успешная авторизация
        currentRole = selectedRole;
        sessionStorage.setItem('auth', currentRole);
        document.getElementById('passwordInput').value = '';
        errorElement.classList.add('hidden');
        showMainApp();
    } else {
        // Неверный пароль
        errorElement.classList.remove('hidden');
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// Выход из системы
function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        sessionStorage.removeItem('auth');
        currentRole = null;
        selectedRole = 'user';
        emailBlocks = [];
        showLoginScreen();
        
        // Сброс формы входа
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.role === 'user') {
                btn.classList.add('active');
            }
        });
        document.getElementById('passwordInput').value = '';
        document.getElementById('loginError').classList.add('hidden');
        
        // Показать кнопку администратора обратно
        document.getElementById('adminMode').style.display = '';
    }
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    // Переключение режимов
    document.getElementById('adminMode').addEventListener('click', function() {
        if (currentRole !== 'admin') {
            alert('Доступ запрещен. Требуются права администратора.');
            return;
        }
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
    
    // Выход из системы
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

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
    
    // Переключение режимов редактора
    document.querySelectorAll('.editor-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.editor-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            switchEditorMode(this.dataset.mode);
        });
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
    const modal = document.getElementById('editBlockModal');
    const isEditing = modal && !modal.classList.contains('hidden') && modal.dataset.editingId;
    
    if (isEditing) {
        // Если в режиме редактирования, сохраняем изменения
        saveEditedBlock();
        return;
    }
    
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
            <div class="admin-block-actions">
                <button onclick="editAdminBlock('${block.id}')" class="btn-edit-admin">Редактировать</button>
                <button onclick="deleteBlock('${block.id}')" class="btn-delete-admin">Удалить</button>
            </div>
        `;
        container.appendChild(blockElement);
    });
}

// Редактирование блока администратором
function editAdminBlock(blockId) {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    // Заполняем поля формы данными блока
    document.getElementById('blockName').value = block.name;
    document.getElementById('blockHTML').value = block.html;
    
    // Показываем модальное окно редактирования
    const modal = document.getElementById('editBlockModal');
    modal.classList.remove('hidden');
    modal.dataset.editingId = blockId;
    
    // Обновляем UI
    document.getElementById('adminFormTitle').textContent = 'Редактировать блок';
    document.getElementById('editingIndicator').classList.remove('hidden');
    document.getElementById('addBlock').textContent = 'Сохранить изменения';
    
    // Прокручиваем к форме
    document.getElementById('blockName').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Сохранение отредактированного блока
function saveEditedBlock() {
    const modal = document.getElementById('editBlockModal');
    const blockId = modal.dataset.editingId;
    
    if (!blockId) return;
    
    const name = document.getElementById('blockName').value.trim();
    const html = document.getElementById('blockHTML').value.trim();
    
    if (!name || !html) {
        alert('Пожалуйста, заполните название и HTML код блока');
        return;
    }
    
    const block = blocks.find(b => b.id === blockId);
    if (block) {
        block.name = name;
        block.html = html;
        
        saveBlocksToStorage();
        renderAdminBlocks();
        renderAvailableBlocks();
        
        // Очищаем форму и закрываем режим редактирования
        cancelEditBlock();
        
        alert('Блок успешно обновлен!');
    }
}

// Отмена редактирования блока
function cancelEditBlock() {
    const modal = document.getElementById('editBlockModal');
    modal.classList.add('hidden');
    modal.dataset.editingId = '';
    
    // Очищаем форму
    document.getElementById('blockName').value = '';
    document.getElementById('blockHTML').value = '';
    
    // Восстанавливаем UI
    document.getElementById('adminFormTitle').textContent = 'Добавить новый блок';
    document.getElementById('editingIndicator').classList.add('hidden');
    document.getElementById('addBlock').textContent = 'Добавить блок';
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
    
    // Добавляем контрол для фона всего блока
    const blockBgField = document.createElement('div');
    blockBgField.className = 'editable-field';
    const blockBgLabel = document.createElement('label');
    blockBgLabel.textContent = '🎨 Фон всего блока:';
    blockBgField.appendChild(blockBgLabel);
    
    // Находим главную таблицу блока
    const mainTable = tempDiv.querySelector('table');
    const currentBlockBg = mainTable ? (mainTable.style.background || mainTable.style.backgroundColor || '#ffffff') : '#ffffff';
    
    const blockBgInput = document.createElement('input');
    blockBgInput.type = 'color';
    blockBgInput.value = rgbToHex(currentBlockBg);
    blockBgInput.id = 'blockBackgroundColor';
    blockBgInput.className = 'color-input';
    blockBgField.appendChild(blockBgInput);
    
    editorContent.appendChild(blockBgField);
    
    // Разделитель
    const separator = document.createElement('hr');
    separator.style.margin = '20px 0';
    separator.style.border = 'none';
    separator.style.borderTop = '2px solid #e0e0e0';
    editorContent.appendChild(separator);
    
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
                
                // WYSIWYG редактор для текста
                const wysiwygContainer = document.createElement('div');
                wysiwygContainer.className = 'wysiwyg-container';
                
                // Панель инструментов
                const toolbar = document.createElement('div');
                toolbar.className = 'wysiwyg-toolbar';
                toolbar.innerHTML = `
                    <button type="button" onclick="formatText('bold', ${index})" title="Жирный"><b>B</b></button>
                    <button type="button" onclick="formatText('italic', ${index})" title="Курсив"><i>I</i></button>
                    <button type="button" onclick="formatText('underline', ${index})" title="Подчеркнутый"><u>U</u></button>
                    <span class="toolbar-separator">|</span>
                    <button type="button" onclick="formatText('insertUnorderedList', ${index})" title="Список">• Список</button>
                    <button type="button" onclick="formatText('removeFormat', ${index})" title="Очистить">🗑️</button>
                `;
                wysiwygContainer.appendChild(toolbar);
                
                // Редактируемая область
                const editableDiv = document.createElement('div');
                editableDiv.className = 'wysiwyg-editor';
                editableDiv.contentEditable = true;
                editableDiv.innerHTML = element.innerHTML || element.textContent;
                editableDiv.dataset.index = index;
                editableDiv.dataset.type = 'text';
                editableDiv.id = `wysiwyg-${index}`;
                
                wysiwygContainer.appendChild(editableDiv);
                field.appendChild(wysiwygContainer);
                
                // Контролы форматирования
                const stylesContainer = document.createElement('div');
                stylesContainer.className = 'style-controls';
                
                // Получаем текущие стили
                const computedStyle = element.style || {};
                const currentColor = computedStyle.color || getComputedColor(element, 'color') || '#333333';
                const currentBgColor = computedStyle.backgroundColor || getComputedColor(element, 'background-color') || '#ffffff';
                const currentLineHeight = computedStyle.lineHeight || getComputedStyle(element, 'line-height') || '1.5';
                const currentFontWeight = computedStyle.fontWeight || window.getComputedStyle(element).fontWeight || 'normal';
                const isBold = currentFontWeight === 'bold' || currentFontWeight === '700' || parseInt(currentFontWeight) >= 700;
                
                // Жирность текста
                const boldContainer = document.createElement('div');
                boldContainer.className = 'style-control-item';
                const boldCheckbox = document.createElement('input');
                boldCheckbox.type = 'checkbox';
                boldCheckbox.id = `bold-${index}`;
                boldCheckbox.checked = isBold;
                boldCheckbox.dataset.index = index;
                boldCheckbox.dataset.type = 'bold';
                const boldLabel = document.createElement('label');
                boldLabel.htmlFor = `bold-${index}`;
                boldLabel.textContent = '🅱️ Жирный';
                boldContainer.appendChild(boldCheckbox);
                boldContainer.appendChild(boldLabel);
                stylesContainer.appendChild(boldContainer);
                
                // Интерлиньяж
                const lineHeightContainer = document.createElement('div');
                lineHeightContainer.className = 'style-control-item';
                const lineHeightLabel = document.createElement('label');
                lineHeightLabel.textContent = '📏 Межстрочный интервал:';
                const lineHeightInput = document.createElement('input');
                lineHeightInput.type = 'number';
                lineHeightInput.min = '0.5';
                lineHeightInput.max = '3';
                lineHeightInput.step = '0.1';
                lineHeightInput.value = parseFloat(currentLineHeight) || 1.5;
                lineHeightInput.dataset.index = index;
                lineHeightInput.dataset.type = 'lineHeight';
                lineHeightInput.className = 'small-input';
                lineHeightContainer.appendChild(lineHeightLabel);
                lineHeightContainer.appendChild(lineHeightInput);
                stylesContainer.appendChild(lineHeightContainer);
                
                // Цвет текста
                const colorContainer = document.createElement('div');
                colorContainer.className = 'style-control-item';
                const colorLabel = document.createElement('label');
                colorLabel.textContent = '🎨 Цвет текста:';
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = rgbToHex(currentColor);
                colorInput.dataset.index = index;
                colorInput.dataset.type = 'color';
                colorInput.className = 'color-input';
                colorContainer.appendChild(colorLabel);
                colorContainer.appendChild(colorInput);
                stylesContainer.appendChild(colorContainer);
                
                // Цвет фона
                const bgColorContainer = document.createElement('div');
                bgColorContainer.className = 'style-control-item';
                const bgColorLabel = document.createElement('label');
                bgColorLabel.textContent = '🖌️ Цвет фона:';
                const bgColorInput = document.createElement('input');
                bgColorInput.type = 'color';
                bgColorInput.value = rgbToHex(currentBgColor);
                bgColorInput.dataset.index = index;
                bgColorInput.dataset.type = 'backgroundColor';
                bgColorInput.className = 'color-input';
                bgColorContainer.appendChild(bgColorLabel);
                bgColorContainer.appendChild(bgColorInput);
                stylesContainer.appendChild(bgColorContainer);
                
                field.appendChild(stylesContainer);
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
                label.textContent = `Изображение ${index + 1}:`;
                field.appendChild(label);
                
                // URL изображения
                const input = document.createElement('input');
                input.type = 'url';
                input.value = element.getAttribute('src') || '';
                input.dataset.index = index;
                input.dataset.type = 'src';
                input.placeholder = 'URL изображения или base64';
                field.appendChild(input);
                
                // Кнопка загрузки файла
                const uploadContainer = document.createElement('div');
                uploadContainer.className = 'image-upload-container';
                
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.id = `fileInput-${index}`;
                fileInput.style.display = 'none';
                fileInput.dataset.index = index;
                fileInput.addEventListener('change', function(e) {
                    handleImageUpload(e, index);
                });
                
                const uploadBtn = document.createElement('button');
                uploadBtn.className = 'btn-upload-image';
                uploadBtn.textContent = '📁 Загрузить изображение';
                uploadBtn.type = 'button';
                uploadBtn.addEventListener('click', function() {
                    fileInput.click();
                });
                
                uploadContainer.appendChild(fileInput);
                uploadContainer.appendChild(uploadBtn);
                field.appendChild(uploadContainer);
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
    const inputs = document.querySelectorAll('#editorContent input, #editorContent textarea, #editorContent input[type="checkbox"]');
    
    inputs.forEach(input => {
        const index = parseInt(input.dataset.index);
        const type = input.dataset.type;
        const element = editableElements[index];
        
        if (!element) return;
        
        if (type === 'text') {
            // Проверяем, это WYSIWYG редактор или обычный input
            const wysiwygEditor = document.getElementById(`wysiwyg-${index}`);
            if (wysiwygEditor) {
                element.innerHTML = wysiwygEditor.innerHTML;
            } else if (input.value !== undefined) {
                element.textContent = input.value;
            }
        } else if (type === 'href') {
            element.setAttribute('href', input.value);
        } else if (type === 'src') {
            element.setAttribute('src', input.value);
        } else if (type === 'bold') {
            // Применяем жирность
            const currentStyle = element.getAttribute('style') || '';
            if (input.checked) {
                element.style.fontWeight = 'bold';
            } else {
                element.style.fontWeight = 'normal';
            }
        } else if (type === 'lineHeight') {
            // Применяем интерлиньяж
            element.style.lineHeight = input.value;
        } else if (type === 'color') {
            // Применяем цвет текста
            element.style.color = input.value;
        } else if (type === 'backgroundColor') {
            // Применяем цвет фона
            element.style.backgroundColor = input.value;
        }
    });
    
    // Применяем фон блока
    const blockBgInput = document.getElementById('blockBackgroundColor');
    if (blockBgInput) {
        const mainTable = tempDiv.querySelector('table');
        if (mainTable) {
            mainTable.style.background = blockBgInput.value;
        }
    }
    
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

// Получение вычисленного цвета элемента
function getComputedColor(element, property) {
    try {
        const color = element.style[property];
        if (color) return color;
        return '';
    } catch (e) {
        return '';
    }
}

// Получение вычисленного стиля элемента
function getComputedStyle(element, property) {
    try {
        const style = element.style[property];
        if (style) return style;
        return '';
    } catch (e) {
        return '';
    }
}

// Конвертация RGB в HEX
function rgbToHex(color) {
    // Если уже в hex формате
    if (color.startsWith('#')) {
        return color;
    }
    
    // Если в rgb/rgba формате
    if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
            const r = parseInt(match[0]);
            const g = parseInt(match[1]);
            const b = parseInt(match[2]);
            return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
    }
    
    // Если название цвета или что-то другое
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    
    if (computedColor && computedColor.startsWith('rgb')) {
        const match = computedColor.match(/\d+/g);
        if (match && match.length >= 3) {
            const r = parseInt(match[0]);
            const g = parseInt(match[1]);
            const b = parseInt(match[2]);
            return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
    }
    
    return '#333333';
}

// Конвертация компонента цвета в hex
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

// Переключение режима редактора
let currentEditorMode = 'visual';
let currentBlockHtml = '';

function switchEditorMode(mode) {
    currentEditorMode = mode;
    const block = emailBlocks.find(b => b.id === currentEditingBlock);
    if (!block) return;
    
    if (mode === 'code') {
        // Режим кода - показываем HTML
        showCodeEditor(block);
    } else {
        // Визуальный режим - показываем контролы
        editBlock(currentEditingBlock);
    }
}

// Показать редактор кода
function showCodeEditor(block) {
    const editorContent = document.getElementById('editorContent');
    editorContent.innerHTML = '<p style="color: #666; margin-bottom: 20px;">Редактируйте HTML код блока:</p>';
    
    const textarea = document.createElement('textarea');
    textarea.id = 'codeEditor';
    textarea.value = formatHtml(block.html);
    textarea.style.cssText = 'width: 100%; min-height: 400px; padding: 15px; font-family: "Fira Code", "Consolas", "Monaco", monospace; font-size: 13px; line-height: 1.6; background: #1e1e1e; color: #d4d4d4; border: 2px solid #e0e0e0; border-radius: 8px; resize: vertical;';
    editorContent.appendChild(textarea);
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-primary';
    saveBtn.textContent = 'Сохранить код';
    saveBtn.style.marginTop = '20px';
    saveBtn.addEventListener('click', function() {
        const block = emailBlocks.find(b => b.id === currentEditingBlock);
        if (block) {
            block.html = textarea.value.trim();
            renderEmailCanvas();
            document.querySelector('.editor-panel').classList.add('hidden');
            alert('Код сохранен!');
        }
    });
    editorContent.appendChild(saveBtn);
}

// Форматирование HTML для читаемости
function formatHtml(html) {
    // Простое форматирование для читаемости
    return html
        .replace(/></g, '>\n<')
        .replace(/<table/g, '\n<table')
        .replace(/<\/table>/g, '</table>\n')
        .replace(/<tr>/g, '\n  <tr>')
        .replace(/<\/tr>/g, '</tr>\n')
        .replace(/<td/g, '\n    <td')
        .replace(/<\/td>/g, '</td>');
}

// Форматирование текста в WYSIWYG редакторе
function formatText(command, index) {
    const editor = document.getElementById(`wysiwyg-${index}`);
    if (!editor) return;
    
    editor.focus();
    document.execCommand(command, false, null);
}

// Обработка загрузки изображения
function handleImageUpload(event, index) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения');
        return;
    }
    
    // Проверка размера (максимум 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Размер изображения не должен превышать 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        // Находим соответствующий input для URL
        const urlInput = document.querySelector(`input[data-index="${index}"][data-type="src"]`);
        if (urlInput) {
            urlInput.value = base64;
        }
    };
    reader.readAsDataURL(file);
}

