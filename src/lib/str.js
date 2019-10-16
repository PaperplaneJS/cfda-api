export const str = (first, ...rest) => {
  if (typeof first === 'string') {
    return first
  }

  return first.reduce((result, frag, i) => result.concat(frag).concat(rest[i] || ''), '')
}

export default { str }
