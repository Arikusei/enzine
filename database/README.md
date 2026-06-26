# База данных

PostgreSQL-схема для Enzine.

## Применение схемы

```bash
psql $DATABASE_URL -f database/schema.sql
```

## Переменные окружения

См. `.env.example` — параметр `DATABASE_URL`.

## Миграции

На текущем этапе используется единый файл `schema.sql`. По мере роста проекта рекомендуется подключить инструмент миграций (например, Drizzle или Prisma).
