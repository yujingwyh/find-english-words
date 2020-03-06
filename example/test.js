const findEnglishWords = require('../index');
const path = require('path');

//注意执行路径
//必须进入example后执行 node test.js

findEnglishWords({
  src:['../node_modules/**/*'],
  order:'frequency',
  output:'./words.txt'
});
