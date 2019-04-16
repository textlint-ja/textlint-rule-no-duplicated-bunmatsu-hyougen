// LICENSE : MIT
"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("../src/textlint-rule-no-duplicated-bunmatsu-hyougen");
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-no-duplicated-bunmatsu-hyougen", rule, {
    valid: [
        // 紹介|説明
        `これはAについて紹介しています。
だがこちらは何も説明していません。`,
        // は{A|B}です
        `これはAです。これはBです。`,
        // が|もあります
        `Aがあります。Bもあります。`
    ],
    invalid: [
        {
            text: `
理由として、先ほど紹介したようにNaNは何と演算しても結果がNaNになるためです。
これにより、計算していた値がどこでNaNになるためです。
`,
            options: {
                only: ["/.*ためです。/"]
            },
            errors: [
                {
                    message: `文末表現 "になるためです。" が連続しています。`,
                    line: 3,
                    column: 28
                }
            ]
        },
        {
            text: `
暗黙的な型変換は避けるべき挙動であるといえます。
明示的な型変換は避けなくてもいい挙動であるといえます。
`,
            options: {
                only: ["といえます。"]
            },
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
たとえばGitHubのユーザー名に<や>が含まれていると、意図しない構造のHTMLになる可能性があります。
これを回避するために、文字列をセットする前に、特定の記号を安全な表現に置換する必要があります。
`,
            options: {
                only: ["があります。"]
            },
            errors: [
                {
                    message: `文末表現 "があります。" が連続しています。`,
                    line: 3,
                    column: 47
                }
            ]
        },
    ]
});