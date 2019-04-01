module.exports = function(len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    uuid = [],
    i = 0;

  radix = radix || 16;
  len = len || 8;

  for (i = 0; i < len; i++) {
    uuid[i] = chars[0 | Math.random() * radix]
  };

  return uuid.join('');
}