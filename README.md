# gmail2calendar

## Setup
### メール設定
フィルタを作成してメールに自動的にラベルを付ける  
see: https://support.google.com/a/users/answer/9308833?hl=ja

| 対象フィルタ         | ラベル                  |
|----------------------|-------------------------|
| TOHO CINEMAS         | `unexecuted`, `movie`   |
| ユナイテッド・シネマ | `unexecuted`, `movie`   |
| DMM英会話            | `unexecuted`, `English` |

`unexecuted`ラベルがある場合に処理をする。処理の最後で`unexecuted`ラベルを削除する。

### config.jsにcalendarIdを定義
カレンダーidはGoogleカレンダーの「設定」 -> 利用したいカレンダーの「マイカレンダーの設定」->「カレンダーの統合」から確認
```
echo "var calendarId = 'calendarId'" >> config.js
```

### clasp でApps Script プロジェクトを作成
[clasp](https://github.com/google/clasp)を利用してプロジェクトを作成する

```
npm install -g @google/clasp
```
Google Apps Script API を有効にする: https://script.google.com/home/usersettings


```
clasp login
clasp create
clasp push
```

### トリガー設定
https://script.google.com/home からプロジェクトページに移動、「トリガー」で設定

| 関数 | イベントソース | トリガータイプ | 間隔    |
|------|----------------|----------------|---------|
| main | 時間主導型     | 分             | 1分おき |
