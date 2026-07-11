# EventHub — Chat Widget Module (extracted)

This folder contains **only** the Chat Widget part of the EventHub project,
pulled out of the main app so it can live on its own `chatwidget` branch.

## Files included

```
src/
  components/Chat/
    ChatWidget.tsx
    ChatHeader.tsx
    ChatMessages.tsx
    ChatBubble.tsx
    ChatInput.tsx
    TypingIndicator.tsx
  styles/
    ChatWidget.css
    ChatHeader.css
    ChatMessages.css
    ChatBubble.css
    ChatInput.css
    TypingIndicator.css
  utils/
    chatBotLogic.ts       -> imports from ../data/events
  data/
    events.ts             -> event database used by the bot
```

## External dependency

This module uses **lucide-react** for icons (Bot, User, Send, MessageSquare,
Minus, ChevronUp, X, Sparkles). Make sure it's installed in whichever repo
this branch gets merged into:

```bash
npm install lucide-react
```
(the main project already has it pinned at `^0.546.0` in package.json)

## How to wire it back into an app

```tsx
import ChatWidget from './components/Chat/ChatWidget';

function App() {
  return (
    <>
      {/* rest of the app */}
      <ChatWidget />
    </>
  );
}
```

No other props/setup required — `ChatWidget` owns all of its own state
internally and reads directly from `chatBotLogic.ts` / `data/events.ts`.

## Pushing this to the `chatwidget` branch

```bash
# from inside your existing eventhub git repo
git checkout -b chatwidget
# copy this src/ folder's contents into your repo's src/ folder
cp -r path/to/this/src/* ./src/
git add src/components/Chat src/styles/Chat*.css src/styles/TypingIndicator.css src/utils/chatBotLogic.ts src/data/events.ts
git commit -m "Add chat widget module"
git push -u origin chatwidget
```
