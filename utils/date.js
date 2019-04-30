function date(dt = new Date()) {
  return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
}

function datetime(dt = new Date()) {
  return `${date(dt)} ${dt.getHours()}:${dt.getMinutes()}`;
}

export { date, datetime }