# Codex + VS Code + GitHub Beginner Guide (Build and Upload a Small Game)

This guide is for complete beginners. The goal is to go from zero to done:

1. Use Codex inside VS Code
2. Ask Codex to build a simple browser game
3. Upload the project to GitHub

---

## What You Need First

- A `GitHub` account
- `VS Code` installed
- `Git` installed

Check whether Git is installed (in terminal):

```bash
git --version
```

---

## Step 1: Use Codex in VS Code

1. Open VS Code
2. Install and sign in to your Codex/AI assistant extension
3. Open an empty folder (for example: `flight-game`)
4. In the chat panel, send this prompt:

```text
Build a simple pixel airplane shooting game with separate HTML/CSS/JS files.
```

5. Let Codex generate the files (usually `index.html`, `style.css`, `game.js`)

---

## Step 2: Run the Game Locally

Simplest way:

- Double-click `index.html` to open it in a browser

Recommended way (local server):

- Use the VS Code Live Server extension
- Or run this in terminal (if Python is available):

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

---

## Step 3: Initialize Git and Commit Code

Open terminal in the project root and run:

```bash
git init
git add .
git commit -m "feat: add pixel plane shooter game"
```

If Git asks for your name/email, set them once:

```bash
git config --global user.name "your-github-username"
git config --global user.email "your-email@example.com"
```

---

## Step 4: Create a GitHub Repo and Push

1. Create a new empty repo on GitHub (do not initialize with README)
2. Copy the repo URL, for example:

```text
https://github.com/your-username/flight-game.git
```

3. Run:

```bash
git remote add origin https://github.com/your-username/flight-game.git
git branch -M main
git push -u origin main
```

---

## Common Issues (Very Common)

### 1) `403 Permission denied`

Cause: Your current Git credentials are signed in as another account that does not have write access.  
Fix:

- Sign in with an account that has permission
- Or push to a repo under your currently signed-in account

### 2) `not a git repository`

Cause: You are not in the project root folder.  
Fix: `cd` into the correct folder, then run Git commands again.

### 3) Git asks for username/password when pushing

GitHub usually uses token/keychain-based auth now, not plain password.  
Follow the OS credential prompt or GitHub sign-in flow.

---

## Practical Tips for Beginners

- Make it run first, then make it look better
- Commit after each small feature
- Do not delete error messages; paste them directly to Codex for faster fixes

---

## One-Sentence Summary

Have Codex generate the project, verify it runs in your browser, then upload it to GitHub with the three Git basics (`init`, `commit`, `push`) to finish your first shareable mini-game project.
