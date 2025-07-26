# Chat App (Backend)

Это серверная часть простого чата с авторизацией, Socket.IO, загрузкой изображений и хранением сообщений. Используются Express, JWT, Multer и Socket.IO для чата в реальном времени.

🚀 Функции
- Регистрация и вход с JWT-токеном
- Реальное время: чат через Socket.IO
- Загрузка изображений
- Статическая отдача загруженных файлов
- Простая mock-база на `json-server`

---

🧠 Технологии
- **Node.js** / **Express**
- **Socket.IO**
- **JWT** (`jsonwebtoken`)
- **bcryptjs**
- **multer**
- **axios**
- **json-server** (в качестве имитации базы данных)

---

📦 Установка и запуск

```bash
# Клонировать проект
git clone <репозиторий>
cd chat-app/backend

# Backend
# Установить зависимости
npm install

# Запустить сервер
node index.js

# Запустить json-server
npx json-server --watch db.json --port 3001

# Frontend
npm run dev  # для разработки
npm start    # для продакшена
