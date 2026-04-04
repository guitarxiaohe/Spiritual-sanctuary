// .prettierrc.js
module.exports = {
  // 每行最大字符数，默认80
  printWidth: 100,
  // 一个tab代表几个空格数，默认2
  tabWidth: 2,
  // 是否使用tab进行缩进，默认false，表示用空格缩进
  useTabs: false,
  // 是否在语句末尾添加分号
  semi: false,
  // 字符串是否使用单引号，默认false使用双引号
  singleQuote: true,
  // 对象属性是否添加引号，as-needed表示仅在需要时添加
  quoteProps: "as-needed",
  // 是否使用尾逗号，es5表示在ES5中有效的地方添加
  trailingComma: "es5",
  // 对象大括号内是否有空格，默认true，效果：{ foo: bar }
  bracketSpacing: true,
  // JSX标签的>是否单独一行
  bracketSameLine: false,
  // 箭头函数参数是否添加括号，avoid表示尽量避免
  arrowParens: "avoid",
  // 格式化范围，默认整个文件
  rangeStart: 0,
  rangeEnd: Infinity,
  // 是否格式化嵌入的代码块
  embeddedLanguageFormatting: "auto",
  // HTML空白敏感性
  htmlWhitespaceSensitivity: "css",
  // Vue文件中的script和style标签缩进
  vueIndentScriptAndStyle: false,
  // 换行符，lf表示使用\n
  endOfLine: "lf",

};
