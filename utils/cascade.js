export default function(deps) {
  function handleCascade(parent) {
    const children = deps.filter(dep =>
      dep._rel.length === parent._rel.length + 1 && dep._rel.includes(parent._id)
    );
    if (children.length > 0) {
      parent.children = children;
      parent.children.forEach(t => handleCascade(t));
    }
  };

  const minLength = Math.min(...deps.map(t => t._rel.length));
  const cascade = deps.filter(dep => dep._rel.length <= minLength);
  deps.forEach(t => handleCascade(t));

  return cascade;
}