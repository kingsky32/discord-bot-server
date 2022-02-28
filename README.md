# Discord DiscordBot Server

It is an easy-to-use [discord.js](https://www.npmjs.com/package/discord.js) library

```javascript
import { createDiscordBot } from 'discord-bot-server';

createDiscordBot({
  token: YOUR_DISCORD_BOT_TOKEN,
  clientId: YOUR_CLIENT_ID,
  controllerConfig: {
    prefix: '~',
  },
  controllers: [
    {
      command: 'hello',
      description: 'Say, Hello!',
      action: ({ message }) => {
        message.channel.send('Hello, World!');
      },
    },
  ],
})
  .then(() => {
    console.log('✅ SUCCESSES');
  })
  .catch(console.error);
```

## Installation

```bash
$ npm install discord-bot-server
```
