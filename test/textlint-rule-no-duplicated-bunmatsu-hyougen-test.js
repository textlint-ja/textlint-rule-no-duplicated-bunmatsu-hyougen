// LICENSE : MIT
"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("../src/textlint-rule-no-duplicated-bunmatsu-hyougen");
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-no-duplicated-bunmatsu-hyougen", rule, {
    valid: [
        `これはAについて紹介しています。
だがこちらは何も説明していません。`,
        `これはAです。これはBです。`,
        `Aがあります。Bもあります。`
    ],
    invalid: [
        {
            text: `
理由として、先ほど紹介したようにNaNは何と演算しても結果がNaNとなってしまうためです。
これにより、計算していた値がどこでNaNとなったのかが分かりにくく、デバッグが難しくなるためです。
`,
            errors: [
                {
                    message: `文末表現 "ためです。" が連続しています。`,
                    line: 3,
                    column: 49
                }
            ]
        },
        {
            text: `
これは問題です。
それは問題です。
`, // "は"まで助詞が一致してる
            errors: [
                {
                    message: `文末表現 "は問題です。" が連続しています。`,
                    line: 3,
                    column: 8
                }
            ]
        },
        {
            text: `
暗黙的な型変換は避けるべき挙動であるといえます。
明示的な型変換は避けなくてもいい挙動であるといえます。
`,
            errors: [
                {
                    message: `文末表現 "といえます。" が連続しています。`,
                    line: 3,
                    column: 27
                }
            ]
        },
        {
            text: `
このケースでは、JavaScriptは文字列の結合を優先する仕様となります。
しかし、次のケースでは数値の加算を優先する仕様となります。
`,
            errors: [
                {
                    message: `文末表現 "となります。" が連続しています。`,
                    line: 3,
                    column: 29
                }
            ]
        },
        {
            text: `
Aを利用するとよいでしょう。
Bを利用するとよいでしょう。
`,
            errors: [
                {
                    message: `文末表現 "するとよいでしょう。" が連続しています。`,
                    line: 3,
                    column: 14
                }
            ]
        }
    ]
});