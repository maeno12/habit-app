# 習慣の記録（PWA）

30日間で習慣を身につけるシンプルな習慣化PWAアプリです。

## 技術スタック

- **Vue 3** (Composition API + `<script setup>`)
- **Vite 7**
- **TypeScript**
- **Vue Router 4**
- **vite-plugin-pwa**（PWA・Service Worker）

## 機能

- **目標設定**: 単一の習慣目標のみ設定可能。設定画面で名前の変更が可能。
- **記録追跡**: ホーム画面をワンタップで今日の記録を追加。30日間の達成率を円形で表示。
- **自動リセット**: 2日間記録がないと記録データが自動でリセットされます。
- **通知**: 設定で「通知を有効にする」後、指定時刻（デフォルト20時）を過ぎて未記録の場合にリマインド通知（1日1回まで）。

## 開発

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

## ビルド・プレビュー

```bash
npm run build
npm run preview
```

## PWAインストール

- ホーム画面の円形プログレス下に「アプリをインストール」ボタン（Chrome/Edge でインストール可能なときのみ表示）を表示します。
- インストール後はボタンは非表示になります。
- iOS/Safari では `beforeinstallprompt` が無いため、「共有 → ホーム画面に追加」の案内テキストを表示します。

## PWAアイコン（推奨）

`public/icon-192.png`（192x192）と `public/icon-512.png`（512x512）を用意すると、ホーム画面に追加したときのアイコンとして使われます。未設定でもビルドは通りますが、インストール時にブラウザのデフォルトアイコンになることがあります。

## データ

- 習慣名・記録日はすべて **localStorage** に保存されます（サーバー不要）。
- 記録をリセットすると過去の記録日はすべて削除されます。

## Vercel へのデプロイ

このプロジェクトは `vercel.json` で SPA ルーティングとビルド設定済みです。

### 方法1: Vercel CLI

1. [Vercel](https://vercel.com) にログインし、[Vercel CLI](https://vercel.com/docs/cli) をインストール:
   ```bash
   npm i -g vercel
   ```
2. プロジェクトルートで実行:
   ```bash
   vercel
   ```
3. プロンプトに従い（初回はログイン・プロジェクト名など）、デプロイ完了後に表示される URL でアクセスできます。本番デプロイは `vercel --prod` で実行します。

### 方法2: GitHub と連携

1. このリポジトリを GitHub にプッシュする。
2. [vercel.com](https://vercel.com) で **Add New Project** を選択し、対象の GitHub リポジトリをインポートする。
3. **Framework Preset** は **Vite** のまま（または自動検出）、**Build Command** は `npm run build`、**Output Directory** は `dist` のままデプロイする。
4. デプロイ後、プッシュのたびに自動でビルド・デプロイされます。
