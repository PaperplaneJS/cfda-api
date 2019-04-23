import crypto from 'crypto';

export default function(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}