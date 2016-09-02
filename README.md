# textlint-rule-no-duplicated-bunmatsu-hyougen

同じ文末表現が連続しているのを見つける[textlint](https://textlint.github.io/ "textlint")ルール

一つのパラグラフ内で、同じ文末表現が連続していると読みにくく感じるのを見つけるルールです。
パラグラフ内での連続性を見るので、パラグラフをまたいでの連続はカウントしません。

文末表現とは、 `助詞名詞*?(動詞|名詞)語尾?記号(。)`のような文の末尾の塊を示しています。

> Aは問題を示しています。

この文では "を示しています。" を文末表現として認識しています。

次のような文では、"は問題です"という文末表現が連続しています。
どちらがメインの文であるかがわかりにくいので、まとめてもよいかもしれません。

> Aは問題です。
> Bは問題です。

つぎのような、文章は、"ためです。"という文末表現が連続しています。
"ためです。"と繰り返しある場合、そのパラグラフでのメインとなる主張がわかりにくくなります。

> `NaN`は暗黙的な型変換の中でももっとも避けたい値となります。  
> 理由として、先ほど紹介したように`NaN`は何と演算しても結果が`NaN`となってしまうためです。  
> これにより、計算していた値がどこで`NaN`となったのかが分かりにくく、デバッグが難しくなるためです。

しかし、同じ文末表現が連続した方がリズムがよい場合もあります。

そのため、`only` オプションを使い、チェックする文末表現を制限して利用することを推奨します。

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-no-duplicated-bunmatsu-hyougen

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "no-duplicated-bunmatsu-hyougen": true
    }
}
```

Via CLI

```
textlint --rule no-duplicated-bunmatsu-hyougen README.md
```

## Options

- `only`: `string[]`
    - デフォルトなし : 設定することを推奨

```js
{
    "rules": {
        "no-duplicated-bunmatsu-hyougen": {
            // "ためです。"という文末表現の連続しているのをチェックする
            // 他の文末表現の連続は無視される
            only: ["ためです。"]
        }
    }
}
```

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-no-duplicated-bunmatsu-hyougen/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-no-duplicated-bunmatsu-hyougen/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
