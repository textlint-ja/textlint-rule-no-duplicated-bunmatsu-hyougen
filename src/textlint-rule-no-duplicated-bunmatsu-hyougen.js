// LICENSE : MIT
"use strict";
const filter = require('unist-util-filter');
const kuromoji = require("kuromojin");

const StringSource = require("textlint-util-to-string");
const match = require("morpheme-match");
const splitSentence = require("sentence-splitter").split;
const SentenceSyntax = require("sentence-splitter").Syntax;
/**
 * 文末表現となるtokenを取り出す
 * @param {Object[]} tokens
 */
const selectsBunmatsuHyougen = (tokens) => {
    // 名詞 または 動詞が見つかるまで
    const bunmatsuTokens = [];
    const reverseTokens = tokens.reverse();
    reverseTokens.some(token => {
        bunmatsuTokens.unshift(token);
        return token.pos === "名詞" || token.pos === "動詞";
    });
    // next token
    const nextToken = reverseTokens[bunmatsuTokens.length];
    if (nextToken && nextToken.pos === "助詞") {
        bunmatsuTokens.unshift(nextToken);
    }
    return bunmatsuTokens;
};
module.exports = function(context) {
    const {Syntax, RuleError, report, shouldIgnore, getSource} = context;
    // split sentences
    // match sentence
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
                const sentenceText = sentence.value;
                return kuromoji(sentenceText).then(tokens => {
                    return selectsBunmatsuHyougen(tokens);
                });
            });
            return Promise.all(task).then((bunmatsuList) => {
                const bunmatsuTexts = bunmatsuList.map(bunmatsuTokens => {
                    return bunmatsuTokens.map(token => token.surface_form).join("");
                });
                bunmatsuTexts.forEach((bunmatsuText, index) => {
                    // find same text in forward texts
                    const matchIndex = bunmatsuTexts.indexOf(bunmatsuText, index + 1);
                    if (matchIndex === -1) {
                        return;
                    }
                    // 距離
                    const differenceIndex = matchIndex - index;
                    if (differenceIndex === 1) {
                        const matchSentence = sentences[matchIndex];
                        const originalIndex = stringSource.originalIndexFromIndex(matchSentence.range[1]);
                        report(node, new RuleError(`文末表現 "${bunmatsuText}" が連続しています。`, {
                            index: originalIndex - 1
                        }))
                    }
                });
            });
        }
    }
};