// LICENSE : MIT
"use strict";
const filter = require('unist-util-filter');
const kuromoji = require("kuromojin");
const StringSource = require("textlint-util-to-string");
const splitSentence = require("sentence-splitter").split;
const SentenceSyntax = require("sentence-splitter").Syntax;
const debug = require("debug")("textlint-rule-no-duplicated-bunmatsu-hyougen");
import { matchPatterns } from "@textlint/regexp-string-matcher";
/**
 * 文末表現となるtokenを取り出す
 *
 * 助詞+(名詞|動詞)+助動詞+記号
 * @param {Object[]} tokens
 */
const selectsBunmatsuHyougen = (tokens) => {
    // 名詞 または 動詞が見つかるまで
    const bunmatsuTokens = [];
    const reverseTokens = tokens.reverse();
    let currentIndex = 0;
    reverseTokens.some((token, index) => {
        currentIndex = index;
        bunmatsuTokens.unshift(token);
        return token.pos === "動詞" || token.pos === "名詞";
    });
    // 名詞を見つける
    reverseTokens.slice(currentIndex + 1).some(token => {
        currentIndex++;
        if (token.pos !== "名詞") {
            return true;
        }
        // 名詞を追加する
        bunmatsuTokens.unshift(token);
        return false;
    });
    // 助詞 or 動詞を見つける
    reverseTokens.slice(currentIndex).some(token => {
        currentIndex++;
        if (token.pos !== "動詞" && token.pos !== "助詞") {
            return true;
        }
        // 名詞を追加する
        bunmatsuTokens.unshift(token);
        return false;
    });
    return bunmatsuTokens;
};
/**
 * @param {string[]} only
 * @param {string} text
 * @return {boolean}
 */
const matchOnly = (only, text) => {
    return matchPatterns(text, only);
};
// デフォルトオプション
const defaultOptions = {
    /**
     * @type {string[]} チェック対象となる文末表現の配列
     * @example
     * ["があります。", "/.*ためです。/"]
     **/
    only: []
};
module.exports = function(context, options = {}) {
    const {Syntax, RuleError, report} = context;
    const only = options.only ? options.only : defaultOptions.only;
    const enabledOnlyOption = options.only !== undefined;
    return {
        [Syntax.Paragraph](node){
            const newNode = filter(node, {cascade: false}, (node) => {
                return node.type !== Syntax.Code || node.type !== Syntax.BlockQuote;
            });
            // source
            const stringSource = new StringSource(newNode);
            const text = stringSource.toString();
            // sentence
            const sentences = splitSentence(text).filter(sentence => {
                return sentence.type === SentenceSyntax.Sentence;
            });
            const task = sentences.map(sentence => {
                const sentenceText = sentence.raw;
                return kuromoji(sentenceText).then(tokens => {
                    return selectsBunmatsuHyougen(tokens);
                });
            });
            return Promise.all(task).then((bunmatsuList) => {
                const bunmatsuTexts = bunmatsuList.map(bunmatsuTokens => {
                    return bunmatsuTokens.map(token => token.surface_form).join("");
                });
                bunmatsuTexts.forEach((bunmatsuText, index) => {
                    debug("bunmatsuText", bunmatsuText);
                    // 短すぎるものは排除 .
                    if (bunmatsuText.length <= 1) {
                        return;
                    }
                    // find same text in forward texts
                    const matchIndex = bunmatsuTexts.indexOf(bunmatsuText, index + 1);
                    if (matchIndex === -1) {
                        return;
                    }
                    // 距離 が 1
                    const differenceIndex = matchIndex - index;
                    if (differenceIndex > 1) {
                        return;
                    }
                    // only オプションが指定されている場合は、その指定に一致しているものだけチェックする
                    if (enabledOnlyOption) {
                        if (!matchOnly(only, bunmatsuText)) {
                            return;
                        }
                    }
                    const matchSentence = sentences[matchIndex];
                    const originalIndex = stringSource.originalIndexFromIndex(matchSentence.range[1]);
                    if (originalIndex) {
                        report(node, new RuleError(`文末表現 "${bunmatsuText}" が連続しています。`, {
                            index: originalIndex - 1
                        }));
                    } else {
                        report(node, new RuleError(`文末表現 "${bunmatsuText}" が連続しています。`));

                    }
                });
            });
        }
    }
};