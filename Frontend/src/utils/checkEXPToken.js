export function getDateTime() {
  let date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let second = date.getSeconds();
  let dateTmp = date.getDate();
  let monthTmp = date.getMonth() + 1;
  if (date.getDate() < 10) {
    dateTmp = "0" + dateTmp;
  }
  if (date.getMonth() + 1 < 10) {
    monthTmp = "0" + monthTmp;
  }
  if (date.getHours() < 10) {
    hour = "0" + hour;
  }
  if (date.getMinutes() < 10) {
    min = "0" + min;
  }
  if (date.getSeconds() < 10) {
    second = "0" + second;
  }

  let current_time = hour + ":" + min + ":" + second;
  let current_date = date.getFullYear() + "-" + monthTmp + "-" + dateTmp;
  return current_date + " " + current_time;
}
