# База данных

PostgreSQL: миграции и сиды для Enzine.

## Структура

```
database/
├── migrations/   # SQL-миграции (порядок по имени файла)
└── seeds/        # Начальные данные
```

## Применение

```bash
# Миграции
psql $DATABASE_URL -f database/migrations/001_init.sql

# Сиды
psql $DATABASE_URL -f database/seeds/001_users.sql
```

## Переменные окружения

`DATABASE_URL` — см. `.env.example` в корне репозитория.
