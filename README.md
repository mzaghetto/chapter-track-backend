## Which episode were you in your manga reading?
Now, you can save your manhwa readings

#### Tech Stack
- [Typescript](https://www.typescriptlang.org/)
- [tsup](https://github.com/egoist/tsup)
- [Node.js](https://nodejs.org/en)
- [Fastify](https://www.fastify.io/)
- [@fastify/cookie](https://github.com/fastify/fastify-cookie)
- [JWT](https://jwt.io/)
- [node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
- [Zod](https://github.com/colinhacks/zod)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Vite](https://vitejs.dev/)
- [SuperTest](https://github.com/ladjs/supertest)

#### Run:
```
npm run docker:start
```
or
```
npm run start:dev
```


#### Tests:
```
npm run test
```

## MongoDB Collections
The collections mapped to refactor

### Manhwas:
  - id: String
  - name: String
  - last_episode_released: Integer `[note: It will be updated according to the crawler]`
  - last_episode_notified: Integer `[note: The last episode has been notified to users]`
  - available_read_url: Array `[note: Websites that users can read the manhwa]`
    - Mangatop
    - Neox
    - Etc
  - manhwa_thumb: String
  - url_crawler:? String
  - users_to_notify: Array `[note: List of users who want to be notified. The @username of Telegram will be registered here]`

### Users:
  - id: String
  - name:? String `[note: If the name is not available, the username will be used to send the email]`
  - username: String `[note: To show in website]`
  - password_hash: String `[note: Password registered will be hashed]`
  - email: String
  - role: String `[note: 'admin' ou 'user']`
  - created_at: DateTime
  - updated_at:? DateTime

### User_manhwa:
  - user_id: String `[note: To find the user's information in the Users collection]`
  - manhwas: Array of Obj
    - manhwa_id: String `[note: To find the manhwa's information in the Manhwas collection]`
    - manhwa_position: Integer
    - last_episode_read: Integer
    - read_url: Array `[note: The website registered by the user to read the manhwa]`
    - notify_telegram: Boolean
    - notification_website: Boolean
  - telegram_active: Boolean `[note: Field to verify if the user want to receive notifications on Telegram]`
  - telegram_id:? String `[note: The @username of Telegram to notify the user]`