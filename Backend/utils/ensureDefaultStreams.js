const { Stream } = require('../models/stream');
const { Subject } = require('../models/Subject');
const { Topic } = require('../models/Topic');
const { Question } = require('../models/Question');

const TARGET_STREAM_NAME = 'Capgemini Pseudo Code';
const LEGACY_NAMES = ['Capgemini Pseudo'];

const defaultStreamPayload = {
  name: TARGET_STREAM_NAME,
  description: 'Capgemini pseudo-coding assessment resources',
  resourceType: 'pdf',
  resourceTitle: 'Capgemini Pseudo Questions',
  resourceUrl: '/resources/capgemini-pseudo.pdf',
  resourceDescription: 'Download the Capgemini pseudo coding questions PDF.'
};

const CAPGEMINI_SUBJECT_NAME = 'Capgemini Pseudo Code';
const CAPGEMINI_TOPIC_NAME = 'Practice Set 1';

const lines = (...rows) => rows.join('\n');
const labelledOptions = (choices) =>
  choices.map(({ label, text, correct }) => ({
    text: `${label}. ${text}`,
    isCorrect: Boolean(correct)
  }));

const capgeminiQuestions = [
  {
    slug: 'Q81',
    questionText: lines(
      'Q81. What will be the value of s if n = 127?',
      'Read n',
      'i = 0, s = 0',
      'Function Sample(int n)',
      'while (n > 0)',
      'r = n % 10',
      'p = 8 ^ i',
      's = s + p * r',
      'i++',
      'n = n / 10',
      'end while',
      'return s'
    ),
    options: labelledOptions([
      { label: 'A', text: '27' },
      { label: 'B', text: '187' },
      { label: 'C', text: '87', correct: true },
      { label: 'D', text: '120' }
    ]),
    explanation: 'Digits are evaluated with powers of 8: 1×8² + 2×8¹ + 7×8⁰ = 64 + 16 + 7 = 87.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q82',
    questionText: lines(
      'Q82. What will be the output if limit = 6 in the following pseudocode?',
      'Read limit',
      'n1 = 0, n2 = 1, n3 = 1, count = 1',
      'while count <= limit',
      'count = count + 1',
      'print n3',
      'n3 = n1 + n2',
      'n1 = n2',
      'n2 = n3',
      'end while'
    ),
    options: labelledOptions([
      { label: 'A', text: '112358', correct: true },
      { label: 'B', text: '12358' },
      { label: 'C', text: '123581321' },
      { label: 'D', text: '12358132' }
    ]),
    explanation: 'Prints the first six Fibonacci numbers starting from 1: 1 1 2 3 5 8 → 112358.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q83',
    questionText: lines(
      'Q83. What will be the value of even_counter if number = 2630?',
      'Read number',
      'Function divisible(number)',
      'even_counter = 0',
      'num_remainder = number',
      'while (num_remainder)',
      'digit = num_remainder % 10',
      'if digit != 0 AND number % digit == 0',
      'even_counter = even_counter + 1',
      'end if',
      'num_remainder = num_remainder / 10',
      'end while',
      'return even_counter'
    ),
    options: labelledOptions([
      { label: 'A', text: '3' },
      { label: 'B', text: '4' },
      { label: 'C', text: '2' },
      { label: 'D', text: '1', correct: true }
    ]),
    explanation: 'Only digit 2 divides 2630; digits 6 and 3 do not divide evenly and 0 is ignored.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q84',
    questionText: lines(
      'Q84. Code to sort a given array in ascending order — which line is wrong?',
      'Read size',
      'Read a[1] a[2] ... a[size]',
      'i = 0',
      'while (i < size)',
      'j = i + 1',
      'while (j < size)',
      'if a[i] < a[j] then',
      't = a[i]',
      'a[i] = a[j]',
      'a[j] = t',
      'end if',
      'j = j + 1',
      'end while',
      'i = i + 1',
      'end while'
    ),
    options: labelledOptions([
      { label: 'A', text: 'Line 4' },
      { label: 'B', text: 'Line 6' },
      { label: 'C', text: 'Line 7', correct: true },
      { label: 'D', text: 'No Error' }
    ]),
    explanation: 'Condition should be a[i] > a[j] for ascending order; using < forces descending swaps.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q85',
    questionText: lines(
      'Q85. What will be the output of the recursive function if a = 8 and b = 9?',
      'Function f(a, b)',
      'If (a < b) return f(b, a)',
      'elseif (b != 0) return (a + f(a, b - 1))',
      'else return 0'
    ),
    options: labelledOptions([
      { label: 'A', text: '56' },
      { label: 'B', text: '88' },
      { label: 'C', text: '72', correct: true },
      { label: 'D', text: '65' }
    ]),
    explanation: 'Arguments swap then the function accumulates a, b times: 9 × 8 = 72.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q86',
    questionText: lines(
      'Q86. What will be the output if f = 6 and g = 9?',
      'sum = 0',
      'If (g > f)',
      'for (n = f; n < g; n = n + 1)',
      'sum = sum + n',
      'end for',
      'else',
      'print error message',
      'print sum'
    ),
    options: labelledOptions([
      { label: 'A', text: '21', correct: true },
      { label: 'B', text: '15' },
      { label: 'C', text: '9' },
      { label: 'D', text: '6' }
    ]),
    explanation: 'Adds integers 6 + 7 + 8 = 21.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q87',
    questionText: lines(
      'Q87. Evaluate z = x ^ y for x = 2, y = 1.',
      'Set y = 1, x = 2',
      'z = x ^ y',
      'Print z'
    ),
    options: labelledOptions([
      { label: 'A', text: '1' },
      { label: 'B', text: '2' },
      { label: 'C', text: '4' },
      { label: 'D', text: '3', correct: true }
    ]),
    explanation: 'Bitwise XOR: 10 ^ 01 = 11₂ = 3.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q88',
    questionText: lines(
      'Q88. Predict the output.',
      'Integer value, n',
      'Set value = 1, n = 45',
      'while (value <= n)',
      'value = value << 1',
      'end while',
      'Print value'
    ),
    options: labelledOptions([
      { label: 'A', text: '16' },
      { label: 'B', text: '32' },
      { label: 'C', text: '64', correct: true },
      { label: 'D', text: '36' }
    ]),
    explanation: 'Value doubles until exceeding 45: sequence reaches 64.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q89',
    questionText: lines(
      'Q89. Evaluate z = x & y for x = 2, y = 1.',
      'Set y = 1, x = 2',
      'z = x & y',
      'Print z'
    ),
    options: labelledOptions([
      { label: 'A', text: '0', correct: true },
      { label: 'B', text: '2' },
      { label: 'C', text: '4' },
      { label: 'D', text: '3' }
    ]),
    explanation: 'Bitwise AND: 10 & 01 = 00.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q90',
    questionText: lines(
      'Q90. Evaluate the do-while loop.',
      'Integer x, y',
      'Set x = 4, y = 8',
      'do {',
      'Print x',
      'x = x + y + 1',
      '} while (x < 15)'
    ),
    options: labelledOptions([
      { label: 'A', text: '14 26' },
      { label: 'B', text: '15 17' },
      { label: 'C', text: '4 13', correct: true },
      { label: 'D', text: '4' }
    ]),
    explanation: 'First iteration prints 4, then x becomes 13; loop exits after printing sequence 4 13.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q91',
    questionText: lines(
      'Q91. Evaluate right shift.',
      'Integer a, b, c',
      'Set c = 12, b = 4',
      'a = c / b',
      'c = b >> a',
      'Print c'
    ),
    options: labelledOptions([
      { label: 'A', text: '2' },
      { label: 'B', text: '0', correct: true },
      { label: 'C', text: '6' },
      { label: 'D', text: '4' }
    ]),
    explanation: 'a = 3; shifting 4 (100₂) right by 3 yields 0.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q92',
    questionText: lines(
      'Q92. Predict the output.',
      'Integer a, b, c',
      'Set b = 10, c = 11',
      'a = b - c',
      'for (each c from 2 to a)',
      'b = b + c + 10',
      'b = b / 2',
      'end for',
      'c = a + b + c',
      'Print a, b, c'
    ),
    options: labelledOptions([
      { label: 'A', text: '-1 7 9' },
      { label: 'B', text: '2 5 8' },
      { label: 'C', text: '-1 10 20', correct: true },
      { label: 'D', text: '5 10 13' }
    ]),
    explanation: 'a becomes -1 so loop is skipped; c = -1 + 10 + 11 = 20.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q93',
    questionText: lines(
      'Q93. Output for a = 4, b = 6.',
      'Integer funn(Integer a, Integer b)',
      'If (a > 2)',
      'If (b > 2)',
      'Return a + b + funn(a + 1, b - 5)',
      'End If',
      'End If',
      'Return a - b'
    ),
    options: labelledOptions([
      { label: 'A', text: '12' },
      { label: 'B', text: '14', correct: true },
      { label: 'C', text: '17' },
      { label: 'D', text: '22' }
    ]),
    explanation: 'Only one recursive call occurs: funn(5,1) returns 4, giving 4 + 6 + 4 = 14.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q94',
    questionText: lines(
      'Q94. Output for a = 4, b = 6.',
      'Integer funn(Integer a, Integer b)',
      'If (a > 1)',
      'Return a * funn(b - 6, a - 4)',
      'Else',
      'Return 1',
      'End If'
    ),
    options: labelledOptions([
      { label: 'A', text: '0' },
      { label: 'B', text: '17' },
      { label: 'C', text: '4', correct: true },
      { label: 'D', text: '7' }
    ]),
    explanation: 'Recursive call with funn(0,0) returns 1, so result is 4 × 1 = 4.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q95',
    questionText: lines(
      'Q95. Evaluate bitwise expression.',
      'Integer a=8, b=51, c=2',
      'c = (a ^ c) ^ a',
      'b = b mod 4',
      'Print a + b + c'
    ),
    options: labelledOptions([
      { label: 'A', text: '13', correct: true },
      { label: 'B', text: '17' },
      { label: 'C', text: '26' },
      { label: 'D', text: '16' }
    ]),
    explanation: 'Toggling c twice leaves it 2; b % 4 = 3; sum is 8 + 3 + 2 = 13.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q96',
    questionText: lines(
      'Q96. Evaluate chained updates.',
      'Set b = 40, a = 20, c = 20',
      'a = a + c',
      'c = c + a',
      'a = a + c',
      'c = c + a',
      'Print a + b + c'
    ),
    options: labelledOptions([
      { label: 'A', text: '40' },
      { label: 'B', text: '100' },
      { label: 'C', text: '300', correct: true },
      { label: 'D', text: 'None of the above' }
    ]),
    explanation: 'Sequence yields a = 100, c = 160, giving total 100 + 40 + 160 = 300.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q97',
    questionText: lines(
      'Q97. Bitwise operations.',
      'Integer a=1, b=1',
      'a = (a ^ 1) & 1 + (b ^ 1) & 1',
      'Print a + b'
    ),
    options: labelledOptions([
      { label: 'A', text: '0' },
      { label: 'B', text: '1', correct: true },
      { label: 'C', text: '2' },
      { label: 'D', text: '3' }
    ]),
    explanation: 'Each term becomes 0, so a becomes 0 and a + b = 1.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q98',
    questionText: lines(
      'Q98. Predict the output (same logic as Q92).',
      'Integer a, b, c',
      'Set b = 10, c = 11',
      'a = b - c',
      'for (each c from 2 to a)',
      'b = b + c + 10',
      'b = b / 2',
      'end for',
      'c = a + b + c',
      'Print a, b, c'
    ),
    options: labelledOptions([
      { label: 'A', text: '-1 7 9' },
      { label: 'B', text: '2 5 8' },
      { label: 'C', text: '-1 10 20', correct: true },
      { label: 'D', text: '5 10 13' }
    ]),
    explanation: 'Same as before: a = -1, loop skipped, c = 20.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q99',
    questionText: lines(
      'Q99. GCD using Euclidean algorithm for p = 15, q = 4.',
      'Integer solve(Integer p, Integer q)',
      'while (q)',
      'value = p MOD q',
      'p = q',
      'q = value',
      'end while',
      'return p'
    ),
    options: labelledOptions([
      { label: 'A', text: '1', correct: true },
      { label: 'B', text: '2' },
      { label: 'C', text: '3' },
      { label: 'D', text: '5' }
    ]),
    explanation: 'The algorithm reduces (15,4) to (4,3) → (3,1) → (1,0), returning 1.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q100',
    questionText: lines(
      'Q100. a = 9, b = 7; c = 2; return a%2 + b%2.',
      'Integer c = 2',
      'b = b mod c',
      'a = a mod c',
      'return a + b'
    ),
    options: labelledOptions([
      { label: 'A', text: '2', correct: true },
      { label: 'B', text: '5' },
      { label: 'C', text: '-5' },
      { label: 'D', text: '17' }
    ]),
    explanation: 'Both 9 and 7 are odd, so each mod 2 equals 1.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q101',
    questionText: lines(
      'Q101. Evaluate expressions.',
      'Integer a=4, b=8',
      'c = a * b',
      'a = c / (b - a)',
      'b = b - a',
      'Print a + b'
    ),
    options: labelledOptions([
      { label: 'A', text: '8', correct: true },
      { label: 'B', text: '6' },
      { label: 'C', text: '12' },
      { label: 'D', text: '4' }
    ]),
    explanation: 'c = 32, a becomes 8, b becomes 0, so total is 8.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q102',
    questionText: lines(
      'Q102. Evaluate simple ops.',
      'a = 7; b = 3',
      'c = a % b',
      'a = c * 2',
      'b = a + 1',
      'Print b - c'
    ),
    options: labelledOptions([
      { label: 'A', text: '6' },
      { label: 'B', text: '2', correct: true },
      { label: 'C', text: '4' },
      { label: 'D', text: '3' }
    ]),
    explanation: 'c = 1, a = 2, b = 3 → b - c = 2.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q103',
    questionText: lines(
      'Q103. Compute after swaps.',
      'x = 8; y = 4',
      'x = x - y',
      'y = x + y',
      'Print x * y'
    ),
    options: labelledOptions([
      { label: 'A', text: '32', correct: true },
      { label: 'B', text: '24' },
      { label: 'C', text: '16' },
      { label: 'D', text: '12' }
    ]),
    explanation: 'After operations x = 4, y = 8, product is 32.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q104',
    questionText: lines(
      'Q104. Another swap then multiply.',
      'x = 7; y = 2',
      'x = x + y',
      'y = x - y',
      'Print x * y'
    ),
    options: labelledOptions([
      { label: 'A', text: '54' },
      { label: 'B', text: '15' },
      { label: 'C', text: '63', correct: true },
      { label: 'D', text: '18' }
    ]),
    explanation: 'x becomes 9, y becomes 7, product is 63.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q105',
    questionText: lines(
      'Q105. Two loops with conditions.',
      'x = 3; y = 90',
      'while (y > 0)',
      'y = y / 3',
      'x = x + 6',
      'c = x + y',
      'while (c > 30)',
      'if (c % 3 == 0) Write x else Write y',
      'c = c / 5',
      'end while',
      'end while'
    ),
    options: labelledOptions([
      { label: 'A', text: '9,33' },
      { label: 'B', text: '9,30' },
      { label: 'C', text: '9,36,9' },
      { label: 'D', text: '9 33 6', correct: true }
    ]),
    explanation: 'Outputs 9 then 33 then 6 as nested loop reduces c.',
    difficulty: 'Hard'
  },
  {
    slug: 'Q106',
    questionText: lines(
      'Q106. Compare p and q after updates.',
      'p = 4; q = 6; r = 2',
      'p = p + q + r - 7',
      'q = p + r - 7',
      'if (p > q) Print Hello else Print Hi'
    ),
    options: labelledOptions([
      { label: 'A', text: 'Hello', correct: true },
      { label: 'B', text: 'Hi' },
      { label: 'C', text: 'Error' },
      { label: 'D', text: 'Hello Hi' }
    ]),
    explanation: 'p evaluates to 5 while q becomes 0, so condition prints Hello.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q107',
    questionText: lines(
      'Q107. Recursive array function with a = {1,2,3,4,5}, num = 4.',
      'integer fun(int a[], int num)',
      'if (num == 1) return a[0]',
      'x = fun(a, num - 1)',
      'if (x == a[num - 1]) return x',
      'else return a[num - 1]'
    ),
    options: labelledOptions([
      { label: 'A', text: '1' },
      { label: 'B', text: '3' },
      { label: 'C', text: '4', correct: true },
      { label: 'D', text: '5' }
    ]),
    explanation: 'Recursion unwinds comparing previous values; final return is a[3] = 4.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q108',
    questionText: lines(
      'Q108. Loop arithmetic.',
      'int p = 2, q = 3',
      'for (int i = 0; i <= 6; i = i + 2)',
      'p = p + q + 1',
      'p = p + q',
      'q = p - q',
      'print q'
    ),
    options: labelledOptions([
      { label: 'A', text: '30' },
      { label: 'B', text: '5' },
      { label: 'C', text: '13' },
      { label: 'D', text: '18', correct: true }
    ]),
    explanation: 'After loop updates, q evaluates to 18.',
    difficulty: 'Hard'
  },
  {
    slug: 'Q109',
    questionText: lines(
      'Q109. Comma operator with integer assignment.',
      'int get_the_val;',
      'get_the_val = (100, 256, 3.3);',
      'printf("%d", get_the_val);'
    ),
    options: labelledOptions([
      { label: 'A', text: '3', correct: true },
      { label: 'B', text: '3.3' },
      { label: 'C', text: '100' },
      { label: 'D', text: '256' }
    ]),
    explanation: 'Comma operator returns last operand (3.3) which truncates to 3 in int.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q110',
    questionText: lines(
      'Q110. Recursing main with static int.',
      'static int val = 5.2;',
      'printf("%d ", val--);',
      'if (1.25) main();'
    ),
    options: labelledOptions([
      { label: 'A', text: '1.5' },
      { label: 'B', text: '5.2' },
      { label: 'C', text: '4.2' },
      { label: 'D', text: 'Infinite loop', correct: true }
    ]),
    explanation: 'Condition is always truthy so the program recurses endlessly.',
    difficulty: 'Hard'
  },
  {
    slug: 'Q111',
    questionText: lines(
      'Q111. While loop printing a/b mix.',
      'a = 2; b = 90',
      'while (b > 9)',
      'a = b % 2 + a',
      'if (a % 2 != 0) Print a else Print b',
      'b = b / 2',
      'end while'
    ),
    options: labelledOptions([
      { label: 'A', text: '3 90 11 3' },
      { label: 'B', text: '11 3 3 90' },
      { label: 'C', text: '90 3 3 11', correct: true },
      { label: 'D', text: '3 3 90 11' }
    ]),
    explanation: 'Successive iterations output 90, then 3, then 3, then 11.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q112',
    questionText: lines(
      'Q112. Simple arithmetic.',
      'x=5, y=10, z=15; p=10, q=20, r=30',
      'a = x + p',
      'b = y * q',
      'c = r / z',
      'Print a b c'
    ),
    options: labelledOptions([
      { label: 'A', text: '15 200 0' },
      { label: 'B', text: '15 200 20' },
      { label: 'C', text: '15 200 2', correct: true },
      { label: 'D', text: '15 20 2' }
    ]),
    explanation: 'a = 15, b = 200, c = 2.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q113',
    questionText: lines(
      'Q113. Recursive function returning 0.',
      'int fun(int i) {',
      'if (i == 0) return 0;',
      'else if (i % 2 == 0) return fun(i - 1);',
      'else return fun(i - 1);',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: '109876' },
      { label: 'B', text: '10' },
      { label: 'C', text: '0', correct: true },
      { label: 'D', text: '1' }
    ]),
    explanation: 'Function always recurses down to 0 returning 0.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q114',
    questionText: lines(
      'Q114. Pointer arithmetic.',
      'int num[] = {1, 4, 8, 12, 16};',
      'int *a, *b; int i;',
      'a = num; b = num + 2;',
      'i = *a++;',
      'printf("%d,%d,%d\\n", i, *a, *b);'
    ),
    options: labelledOptions([
      { label: 'A', text: '1,4,8', correct: true },
      { label: 'B', text: '4,1,8' },
      { label: 'C', text: '2,1,8' },
      { label: 'D', text: '4,4,8' }
    ]),
    explanation: 'Post-increment returns 1 then pointer advances to 4; b remains pointing at 8.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q115',
    questionText: lines(
      'Q115. Comma operator and increments.',
      'int x=4, y=0; int z;',
      'z = (x++ + ++y + y++, x++);',
      'printf("%d\\n", z);'
    ),
    options: labelledOptions([
      { label: 'A', text: '5', correct: true },
      { label: 'B', text: 'zero - "O"' },
      { label: 'C', text: 'compiler error' },
      { label: 'D', text: 'undefined behavior' }
    ]),
    explanation: 'Comma operator yields final x++, producing 5.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q116',
    questionText: lines(
      'Q116. Simple recursion sum.',
      'int f(int n){',
      'if (n == 0) return 1;',
      'else return n + f(n - 1);',
      '} // called with f(10)'
    ),
    options: labelledOptions([
      { label: 'A', text: 'compile time error' },
      { label: 'B', text: 'infinite loop' },
      { label: 'C', text: '56', correct: true },
      { label: 'D', text: '55036674' }
    ]),
    explanation: 'Evaluates 10 + 9 + … + 1 + 1 = 56.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q117',
    questionText: lines(
      'Q117. Size of struct on 64-bit.',
      'struct node { int data; int *pointer; };',
      'sizeof(struct node)'
    ),
    options: labelledOptions([
      { label: 'A', text: '4' },
      { label: 'B', text: '12' },
      { label: 'C', text: '16', correct: true },
      { label: 'D', text: '5' }
    ]),
    explanation: '4-byte int plus 8-byte pointer with padding equals 16 bytes.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q118',
    questionText: lines(
      'Q118. Multiplying digits (typos corrected).',
      'int no = 1112, sum = 1;',
      'while (no > 0) {',
      'int digit = no % 10;',
      'sum = sum * digit;',
      'no /= 10;',
      '}',
      'print sum'
    ),
    options: labelledOptions([
      { label: 'A', text: '25' },
      { label: 'B', text: '7' },
      { label: 'C', text: '5' },
      { label: 'D', text: '2', correct: true }
    ]),
    explanation: 'Product is 1 × 1 × 1 × 2 = 2.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q119',
    questionText: lines(
      'Q119. For loop increments.',
      'a = 11; b = 12; c = 10',
      'if (b > 0) b++',
      'for (b = 0; b <= 5; b = b + 1)',
      'a = a + 1',
      'print (a + c)'
    ),
    options: labelledOptions([
      { label: 'A', text: '27', correct: true },
      { label: 'B', text: '20' },
      { label: 'C', text: '22' },
      { label: 'D', text: '24' }
    ]),
    explanation: 'Loop runs six times bringing a to 17; adding c gives 27.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q120',
    questionText: lines(
      'Q120. Evaluate boolean expression.',
      'if (9 > 6 || (2 == 3 && 4 > 1))',
      'print "First"',
      'else',
      'print "Second"'
    ),
    options: labelledOptions([
      { label: 'A', text: 'First', correct: true },
      { label: 'B', text: 'Second' },
      { label: 'C', text: 'Error' },
      { label: 'D', text: 'None of the above' }
    ]),
    explanation: 'First condition is true so "First" is printed.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q121',
    questionText: lines(
      'Q121. What does the following function compute?',
      'int fun(int x, int y)',
      '{',
      '  if (y == 0) return 0;',
      '  return x + fun(x, y - 1);',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: 'x + y' },
      { label: 'B', text: 'x - y' },
      { label: 'C', text: 'x * y', correct: true },
      { label: 'D', text: 'x / y' }
    ]),
    explanation: 'Recursion adds x a total of y times, implementing multiplication.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q122',
    questionText: lines(
      'Q122. What is printed by P1 using call-by-reference parameter passing?',
      'Program P1()',
      '{',
      '  x = 10',
      '  y = 3',
      '  func1(y, x, x)',
      '  print x',
      '  print y',
      '}',
      'func1(x, y, z)',
      '{',
      '  y = y + 4',
      '  z = x + y + z',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: '10 then 3' },
      { label: 'B', text: '31 then 3', correct: true },
      { label: 'C', text: '10 then 7' },
      { label: 'D', text: '31 then 7' }
    ]),
    explanation: 'Both y and z refer to the caller variable x, so x updates to 31 while y stays 3.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q123',
    questionText: lines(
      'Q123. What value does f(1) return?',
      'int f(int n) {',
      '  static int i = 1;',
      '  if (n >= 5) return n;',
      '  n = n + i;',
      '  i++;',
      '  return f(n);',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: '5' },
      { label: 'B', text: '6' },
      { label: 'C', text: '7', correct: true },
      { label: 'D', text: '8' }
    ]),
    explanation: 'Static i keeps increasing across calls, pushing n to 7 before meeting the base case.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q124',
    questionText: lines(
      'Q124. What is the output of the following code?',
      '#include <stdio.h>',
      'void fun(int n) {',
      '  if (n > 0) {',
      '    fun(n - 1);',
      '    printf("%d", n);',
      '    fun(n - 1);',
      '  }',
      '}',
      'int main() {',
      '  fun(3);',
      '  return 0;',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: '123321' },
      { label: 'B', text: '1213121', correct: true },
      { label: 'C', text: '321123' },
      { label: 'D', text: '112233' }
    ]),
    explanation: 'Recursive calls print values in an in-order pattern: 1 2 1 3 1 2 1.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q125',
    questionText: lines(
      'Q125. What is the output of the following code?',
      '#include <stdio.h>',
      'void fun(int n) {',
      '  if (n > 0) {',
      '    fun(--n);',
      '    printf("%d", n);',
      '    fun(--n);',
      '  }',
      '}',
      'int main() {',
      '  fun(3);',
      '  return 0;',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: '0110' },
      { label: 'B', text: '0120', correct: true },
      { label: 'C', text: '0101' },
      { label: 'D', text: '0011' }
    ]),
    explanation: 'Each pre-decrement changes n before printing, producing the sequence 0 1 2 0.',
    difficulty: 'Hard'
  },
  {
    slug: 'Q126',
    questionText: lines(
      'Q126. What is the output of the following code?',
      '#include <stdio.h>',
      'int f(int n) {',
      '  if (n <= 1) return 1;',
      '  if (n % 2 == 0)',
      '    return f(n / 2);',
      '  return f(n / 2) + f(n / 2 + 1);',
      '}',
      'int main() {',
      '  printf("%d", f(11));',
      '  return 0;',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: '3' },
      { label: 'B', text: '4' },
      { label: 'C', text: '5', correct: true },
      { label: 'D', text: '6' }
    ]),
    explanation: 'Odd inputs split into two recursive calls; unwinding at n = 11 sums to 5.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q127',
    questionText: lines(
      'Q127. What is the output of the following code?',
      '#include <stdio.h>',
      'int f(int *a, int n) {',
      '  if (n <= 0) return 0;',
      '  else if (*a % 2 == 0) return *a + f(a + 1, n - 1);',
      '  else return *a + f(a + 1, n - 1);',
      '}',
      'int main() {',
      '  int a[] = {12, 7, 13, 4, 11, 6};',
      '  printf("%d", f(a, 6));',
      '  return 0;',
      '}'
    ),
    options: labelledOptions([
      { label: 'A', text: '22' },
      { label: 'B', text: '31' },
      { label: 'C', text: '53', correct: true },
      { label: 'D', text: '15' }
    ]),
    explanation: 'Both branches add the current element, so every value contributes and the sum is 53.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q128',
    questionText: lines(
      'Q128. What is the value of j after executing the pseudocode?',
      'Integer incr(Integer i)',
      '  Static Integer count = 0',
      '  count = count + i',
      '  return count',
      'Main()',
      '  Integer i, j',
      '  for (start i from 0 to 4)',
      '    j = incr(i)',
      '  end for'
    ),
    options: labelledOptions([
      { label: 'A', text: '10', correct: true },
      { label: 'B', text: '9' },
      { label: 'C', text: '14' },
      { label: 'D', text: '4' }
    ]),
    explanation: 'Static count accumulates 0 + 1 + 2 + 3 + 4 = 10, so the last assignment stores 10 in j.',
    difficulty: 'Easy'
  },
  {
    slug: 'Q129',
    questionText: lines(
      'Q129. Evaluate the postfix expression.',
      '1 2 + 3 * 4 2 - 3 1 + * -'
    ),
    options: labelledOptions([
      { label: 'A', text: '0' },
      { label: 'B', text: '1', correct: true },
      { label: 'C', text: '3' },
      { label: 'D', text: '5' }
    ]),
    explanation: 'Processing the postfix expression step by step leaves 1 on the stack.',
    difficulty: 'Medium'
  },
  {
    slug: 'Q130',
    questionText: lines(
      'Q130. Let A be an n x n matrix; what does the pseudocode output?',
      'C = 100',
      'for i = 1 to n do',
      '  for j = 1 to n do',
      '  {',
      '    Temp = A[i][j] + C',
      '    A[i][j] = A[j][i]',
      '    A[j][i] = Temp - C',
      '  }',
      'for i = 1 to n do',
      '  for j = 1 to n do',
      '    Output(A[i][j])'
    ),
    options: labelledOptions([
      { label: 'A', text: 'The original matrix A', correct: true },
      { label: 'B', text: 'The transpose of A' },
      { label: 'C', text: 'Matrix A with every entry increased by 100' },
      { label: 'D', text: 'Matrix A with rows reversed' }
    ]),
    explanation: 'The swap stores the original value using Temp and restores it, so A remains unchanged.',
    difficulty: 'Easy'
  }
];

async function ensureCapgeminiStream() {
  const existing = await Stream.findOne({ name: { $in: [TARGET_STREAM_NAME, ...LEGACY_NAMES] } });

  if (!existing) {
    const created = await Stream.create(defaultStreamPayload);
    console.log('✅ Created default Capgemini stream');
    return created;
  }

  const updates = {};

  if (existing.name !== TARGET_STREAM_NAME) {
    updates.name = TARGET_STREAM_NAME;
  }

  if (existing.description !== defaultStreamPayload.description) {
    updates.description = defaultStreamPayload.description;
  }

  if (existing.resourceType !== defaultStreamPayload.resourceType) {
    updates.resourceType = defaultStreamPayload.resourceType;
  }

  if (existing.resourceTitle !== defaultStreamPayload.resourceTitle) {
    updates.resourceTitle = defaultStreamPayload.resourceTitle;
  }

  if (existing.resourceUrl !== defaultStreamPayload.resourceUrl) {
    updates.resourceUrl = defaultStreamPayload.resourceUrl;
  }

  if (existing.resourceDescription !== defaultStreamPayload.resourceDescription) {
    updates.resourceDescription = defaultStreamPayload.resourceDescription;
  }

  if (existing.isActive === false) {
    updates.isActive = true;
  }

  if (Object.keys(updates).length > 0) {
    existing.set(updates);
    await existing.save();
    console.log('♻️  Updated Capgemini stream metadata');
  }

  return existing;
}

async function ensureCapgeminiSubject(stream) {
  let subject = await Subject.findOne({ stream: stream._id, name: CAPGEMINI_SUBJECT_NAME });

  if (!subject) {
    subject = await Subject.create({
      name: CAPGEMINI_SUBJECT_NAME,
      stream: stream._id,
      description: 'Pseudo-code practice questions for Capgemini assessments.'
    });
    console.log('✅ Created Capgemini subject');
  } else if (!subject.isActive) {
    subject.isActive = true;
    await subject.save();
    console.log('♻️  Reactivated Capgemini subject');
  }

  return subject;
}

async function ensureCapgeminiTopic(stream, subject) {
  let topic = await Topic.findOne({ subject: subject._id, name: CAPGEMINI_TOPIC_NAME });

  if (!topic) {
    topic = await Topic.create({
      name: CAPGEMINI_TOPIC_NAME,
      subject: subject._id,
      description: 'Curated practice set for Capgemini pseudo-code round.'
    });
    console.log('✅ Created Capgemini topic');
  } else {
    let requiresSave = false;

    if (!topic.isActive) {
      topic.isActive = true;
      requiresSave = true;
    }

    if (requiresSave) {
      await topic.save();
      console.log('♻️  Updated Capgemini topic');
    }
  }

  return topic;
}

async function ensureCapgeminiQuestions(stream, subject, topic) {
  for (const question of capgeminiQuestions) {
    const existingQuestion = await Question.findOne({ questionText: question.questionText, topic: topic._id });

    if (existingQuestion) {
      if (!existingQuestion.isActive) {
        existingQuestion.isActive = true;
        await existingQuestion.save();
      }
      continue;
    }

    await Question.create({
      questionText: question.questionText,
      options: question.options,
      explanation: question.explanation,
      difficulty: question.difficulty,
      stream: stream._id,
      subject: subject._id,
      topic: topic._id,
      isActive: true
    });

    console.log(`🆕 Added Capgemini question ${question.slug ?? ''}`);
  }
}

async function ensureCapgeminiContent() {
  const stream = await ensureCapgeminiStream();
  const subject = await ensureCapgeminiSubject(stream);
  const topic = await ensureCapgeminiTopic(stream, subject);
  await ensureCapgeminiQuestions(stream, subject, topic);
}

async function ensureDefaultStreams() {
  await ensureCapgeminiContent();
}

module.exports = { ensureDefaultStreams };
