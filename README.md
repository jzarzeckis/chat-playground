# Simple Chat App
An app that connects to a websocket server and allows people to send/receive chat messages.

Call `npm install` before running. Use `npm start` to run the devserver.

The server is separated from the client, therefore to test connections to the server, proxy configuration is used to allow the `create-react-app` dev server to connect to the server.

---
## Requirements
### Server
1. ✅ Sends received messages to all connected clients (no rooms).
2. ✅ If a client is silent for more than a certain (configurable) amount of time, it is
disconnected; a message about the event (e.g. "John was disconnected due to
inactivity") is sent to all connected clients.
3. ✅ If a client is disconnected, but not due to inactivity, a different message is sent (e.g.
"John left the chat, connection lost" instead.)
4. ✅ Doesn't allow multiple active users with the same nickname.
5. 🤔 Validates data received over the network.
6. ✅ Terminates gracefully upon receiving SIGINT or SIGTERM signals.
7. ✅ Provide readable logging solution

### Client
1. ✅ Has two pages ​​ landing page (shown when not connected to the server) and chat (shown only when connected to the server). 
2. Landing page has: 
  * ✅ a box to enter nickname,
  * ✅ a button to connect,
  * and also displays feedback like:
    - ✅ Failed to connect. (Interpreted as timeout when failing to receive authentication response from server)
    - ✅ Nickname already taken.',
    - ✅ Server unavailable. (Interpreted when the websocket connection fails)
    - ✅ Disconnected by the server due to inactivity.'.
3. ✅ Chat page displays messages from the server together with the sender's nickname (but no messages from before the user's current session started), a box to enter a message, a button to send it, and a button to disconnect from the server.
4. ✅ Does not have any inactivity timeouts.
5. ✅ Should display landing page if it's disconnected from the server.

### UI/UX
1. Feel free to design/define your own UI and UX

---
## Summary
I used tried to keep everything type safe, and reuse the message interfaces between client and server. `React`, `typesafe-actions`, `rxjs` together with `redux-obserbable` was used in this example. Most of the async sidefects have been declared in the [`wsEpic.ts`](src/state/wsEpic.ts) file that pipes the redux actions to creating a new websocket and vice-versa received messages to redux actions.
Whenever a new message arrives, window is scrolled to the latest message.

### Room for improvement:
Of course there's still a lot of room for improvement, and if this was a real world project, here are the things I'd consider:
* Adding [Marble tests](https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing) for the epics
* Add some spring based animations to messages arriving, to make them more exciting
