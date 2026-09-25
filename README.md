# Kvíz Aréna

Jeopardy-style kvíz na jeden Vercel free plán. Statický `index.html` +
dvě malé serverless funkce (`/api/config`, `/api/admin-login`), realtime
synchronizace přes Firebase Realtime Database (taky free tier).

## Co je nového oproti staré verzi

- **Firebase config i admin heslo jsou v env proměnných** na Vercelu, ne
  natvrdo v kódu. Front-end si je při načtení vyzvedne z `/api/config`;
  heslo admina se ověřuje na serveru přes `/api/admin-login`, takže není
  vidět v "zobrazit zdroj".
- **Lobby**: na úvodní obrazovce založíš hru (dostaneš kód místnosti) nebo
  se připojíš k existující. Po vstupu do místnosti čekárna ukazuje, kdo je
  připojený; moderátor hru spustí tlačítkem **▶ Spustit hru**, do té doby
  hráči vidí jen čekárnu.
- **Editor otázek je dynamický**: libovolný počet kategorií (➕/🗑
  kategorie), libovolný počet otázek na kategorii (➕/➖ řádek pro všechny
  najednou, nebo jen pro jednu kategorii), a bodová hodnota každé otázky
  je editovatelné číslo (takže klidně 100–1000 nebo cokoliv jiného).
- **Obrázky u otázek**: v editoru je pole "Obrázek (URL)" u každé otázky
  s náhledem; obrázek se ukáže v otázce při hraní. (Je to URL adresa, ne
  upload souboru — nejjednodušší a nejrychlejší řešení bez potřeby
  Firebase Storage. Stačí obrázek nahrát např. na imgur.com a vložit
  odkaz.)
- **Nový vizuál**: tmavě fialové pozadí s korálovo-zlatým akcentem,
  animované "bubliny" na pozadí, plynulejší přechody, pulzující BZZ!
  tlačítko, konfety při správné odpovědi, popup animace hráčů v lobby.

## Nasazení na Vercel (zdarma)

1. **Firebase**
   - Založ projekt na [firebase.google.com](https://firebase.google.com) (free Spark plán stačí).
   - V Build → Realtime Database vytvoř databázi (zvol region, např. `europe-west1`).
   - V záložce Rules vlož obsah souboru `database.rules.json` z tohoto projektu a publikuj.
   - V Project settings → General → Your apps přidej Web app a zkopíruj si
     hodnoty `apiKey`, `authDomain`, `databaseURL`, `projectId`,
     `storageBucket`, `messagingSenderId`, `appId`.

2. **Vercel**
   - Nahraj tuhle složku do GitHub repa (nebo použij `vercel` CLI přímo).
   - Na [vercel.com](https://vercel.com) → New Project → import repo. Framework
     preset nech "Other" (je to obyčejné statické `index.html` + `/api`
     složka, žádný build krok není potřeba).
   - V Project → Settings → Environment Variables přidej všechny proměnné
     z `.env.example` (hodnoty z kroku 1 + vlastní `ADMIN_PASSWORD`).
   - Deploy. Hotovo — vše běží na free plánu (statický hosting + 2
     drobné serverless funkce).

3. **Lokální test** (nepovinné, potřebuje Node a `vercel` CLI):
   ```bash
   npm i -g vercel
   vercel dev
   ```
   Vercel dev umí číst `.env` soubor — zkopíruj `.env.example` do `.env`
   a vyplň hodnoty.

## Jak se hraje

1. Někdo zvolí **Založit hru** → dostane kód místnosti (např. `FOX42`) a
   pošle ho ostatním.
2. Každý na `Připojit se` zadá kód a zvolí roli:
   - **Moderátor** — jeden na hru, klikáte na dlaždice, vyhodnocujete
     odpovědi, spouštíte hru z lobby.
   - **Hráč** — zadá jméno, čeká v lobby a pak bzučí mezerníkem / tlačítkem.
   - **Admin** — heslem chráněná role pro přípravu otázek (může se
     přihlásit kdykoliv, i uprostřed jiné hry v jiné místnosti).
3. Admin si otevře editor, přidá kategorie/otázky/obrázky a uloží.
4. Moderátor v lobby klikne **Spustit hru** → všem se zobrazí hrací plán.
5. Moderátor klikáním otevírá otázky, hráči bzučí, moderátor označuje
   správně/špatně. **Nová hra** v horní liště resetuje skóre a vrátí
   všechny zpátky do lobby (otázky zůstanou zachované).

## Struktura projektu

```
index.html          statická appka (lobby + hra + admin editor)
api/config.js        vrací Firebase config z env proměnných
api/admin-login.js    ověří heslo admina proti env proměnné
database.rules.json   doporučená pravidla pro Firebase Realtime DB
.env.example          seznam potřebných proměnných
```

## Poznámka k bezpečnosti

Firebase pravidla v `database.rules.json` jsou záměrně jednoduchá
(kdokoliv se znalostí kódu místnosti může číst/psát) — to stačí na
rodinný/kamarádský kvíz. Pro veřejnější použití by šlo přidat Firebase
Anonymous Auth a omezit zápis jen na ověřené uživatele, ale to už je nad
rámec "rychle a zadarmo".
