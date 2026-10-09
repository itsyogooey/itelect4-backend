# ITElect4 Backend

REST API for lost-and-found items. Copy `.env.example` to `.env`, fill in the Atlas URI and a long random JWT secret, then run `npm run dev`.

All item routes require `Authorization: Bearer <token>`. Get a token from login. Items are only visible to their owner; an item owned by another user is returned as 404.

## Endpoints

### `POST /api/auth/register`

Request:

```json
{"name":"Alex Student","email":"alex@example.com","password":"a-long-password"}
```

Response `201`:

```json
{"id":"665f00000000000000000001","name":"Alex Student","email":"alex@example.com","role":"student","isActive":true}
```

### `POST /api/auth/login`

Request:

```json
{"email":"alex@example.com","password":"a-long-password"}
```

Response `200`:

```json
{"token":"<jwt>","user":{"id":"665f00000000000000000001","name":"Alex Student","email":"alex@example.com","role":"student","isActive":true}}
```

### `GET /api/items`

Header: `Authorization: Bearer <token>`

Response `200`: `[{"id":"665f00000000000000000002","title":"Blue backpack","status":"lost","createdAt":"2026-10-08T12:00:00.000Z","ownerId":"665f00000000000000000001"}]`

### `GET /api/items/:id`

Header: `Authorization: Bearer <token>`

Response `200`: `{"id":"665f00000000000000000002","title":"Blue backpack","status":"lost","createdAt":"2026-10-08T12:00:00.000Z","ownerId":"665f00000000000000000001"}`. Missing or another user's item returns `404`.

### `POST /api/items`

Header: `Authorization: Bearer <token>`

Request:

```json
{"title":"Blue backpack","status":"lost","reward":25}
```

Response `201`: the created item, including its generated `id`, `createdAt`, and token-derived `ownerId`.

### `PATCH /api/items/:id`

Header: `Authorization: Bearer <token>`

Request: `{"status":"found"}`

Response `200`: the updated item. Missing or another user's item returns `404`.

### `DELETE /api/items/:id`

Header: `Authorization: Bearer <token>`

Response `204` with no body. Missing or another user's item returns `404`.

`GET /api/health` is also available without authentication and reports whether MongoDB is connected.