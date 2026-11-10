# Margreeta POS: one-time setup

The POS lives in the `pos/` folder of this website. Once this is merged and Netlify publishes, it's at
**https://margreeta.com/pos/** and, after step 6, also at **https://pos.margreeta.com**.
It shows "Firebase isn't connected yet" until steps 1–5 are done.

## 1. Create the Firebase project (5 minutes)
1. Go to https://console.firebase.google.com and sign in with the Google account that should own the POS data.
2. Click **Create a project**. Name it `margreeta-pos`. Turn **Google Analytics off**. Click **Create project**, then **Continue**.

The free "Spark" plan is enough: about 50,000 reads and 20,000 writes per day.

## 2. Turn on staff login
1. In the left menu: **Build → Authentication → Get started**.
2. **Sign-in method** tab → **Email/Password** → switch on the **first** toggle only → **Save**.
3. **Users** tab → **Add user** → email `staff@margreeta.com`, plus a strong password you choose → **Add user**.
   (The email doesn't need to be a real mailbox.)
4. **Settings** tab → **User actions** → untick **Enable create (sign-up)** → **Save**. This stops strangers from making their own accounts.

## 3. Create the database
1. Left menu: **Build → Firestore Database → Create database**.
2. Location: pick **eur3 (europe)** (closest to Egypt). This can't be changed later.
3. Choose **Start in production mode** → **Create**.

## 4. Paste the security rules
1. Still in Firestore Database, open the **Rules** tab.
2. Delete everything in the editor, paste the whole contents of `firebase/firestore.rules`, then click **Publish**.
3. If you ever add another staff login, add its email to the list in the rules, e.g.
   `['staff@margreeta.com', 'karim@margreeta.com']`, and Publish again.

## 5. Connect the POS to Firebase
1. Click the **gear icon → Project settings**. On the **General** tab, scroll to **Your apps** and click the **Web** icon (`</>`).
2. Nickname: `POS`. Leave "Firebase Hosting" unticked. Click **Register app**.
3. You'll see `const firebaseConfig = { apiKey: "…", authDomain: "…", projectId: "…", storageBucket: "…", messagingSenderId: "…", appId: "…" };`
4. Open `pos/firebase-config.js` and replace the six `PASTE-…-HERE` values with yours. Keep the quotes and commas.
   (Or send the six values to Claude to fill in. They aren't secret: the rules and the login protect the data.)

## 6. The pos.margreeta.com address (Netlify)
1. Netlify → your margreeta.com site → **Domain management** → **Add a domain** (or "Add domain alias") → `pos.margreeta.com` → confirm.
2. If Netlify manages your DNS, that's it. If not, add a **CNAME** record at your domain company: name `pos`, value `<your-site-name>.netlify.app`.
3. Wait for Netlify to show the HTTPS certificate as active (usually minutes).
   The `_redirects` file already sends pos.margreeta.com to the `/pos` folder.

## Website orders (margreeta.com order form → kitchen screen)
Nothing extra to set up: once steps 1–5 are done, the website reads the same `pos/firebase-config.js`.
- When a customer taps **Place order**, the order still opens WhatsApp as before, **and** lands in the POS
  as channel "margreeta.com", status "in kitchen", **not paid**. It pops up on the Kitchen screen right away.
- The ticket shows the customer, delivery compound or pickup time, and the customer's note.
  The Orders screen shows the full address, how the customer said they'd pay (cash or InstaPay), and any promo code.
- Promo codes (LOYAL10 / LOYAL20) come in as a discount, so the POS asks for the same amount the website showed.
- When the money comes in, take payment in **Orders → Take payment**, as for any unpaid order.
- The rules let the public website **only add new, unpaid kitchen orders**. It can't read, change or delete any order.
- Website orders use Firebase's own clock, so a customer's phone with the wrong time doesn't mess up the kitchen timer.

## Notes
- Orders are stored in `orders/{id}` and the sold-out list in `menu/state`, with the same fields as before.
  The one difference: Firestore can't store a list inside a list, so a line's `extras` are saved as
  `[{name, price}]` and turned back into `[[name, price]]` inside the app.
- The app listens live to this month and last month. Older months are fetched when you open them in the Month report.
- Offline: each tablet keeps its own copy and syncs when the Wi-Fi is back. The badge shows "Offline · will sync".
- Before going live, use **Orders → Clear all test orders** to wipe test data.
