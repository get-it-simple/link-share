# Links Share Storage

React + TypeScript застосунок для локального збереження посилань у `localStorage`.

## Features

- Додавання / редагування / видалення посилань
- Відновлення з `localStorage` при повторному відкритті
- Click по назві відкриває URL у новій вкладці та збільшує `clicks +1`
- Пошук (OR) по `url` або `title` або `description`
- Сортування ASC/DESC: `createdAt`, `updatedAt`, `title`, `clicks`
- `Sync previews` підтягує favicon для записів без зображення

---

## Встановлення локально

### 1) Вимоги

- Node.js 18+ (рекомендовано 20+)
- npm (йде разом з Node.js)

### 2) Клонувати репозиторій

```bash
git clone https://github.com/<your-username>/links-share-storage.git
cd links-share-storage
```
