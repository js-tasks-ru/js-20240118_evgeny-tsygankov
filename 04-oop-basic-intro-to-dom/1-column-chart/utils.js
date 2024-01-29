/**
 * @param {number[]} data
 * @param {number} chartHeight
 * @returns {Array<{ percent: string; value: string }>}
 */
export function getColumnProps(data, chartHeight) {
  const maxValue = Math.max(...data);
  const scale = chartHeight / maxValue;
  const getStringPercent = (numberValue) =>
    ((numberValue / maxValue) * 100).toFixed(0) + "%";

  return data.map((numberItem) => ({
    percent: getStringPercent(numberItem),
    value: String(Math.floor(numberItem * scale)),
  }));
}
