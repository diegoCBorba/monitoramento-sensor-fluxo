export function numberCSV(value: number, decimals = 3) {
  return value.toFixed(decimals) // força . como decimal
}

export function dateCSV(date: Date) {
  // formato seguro pra planilha
  const pad = (n: number) => String(n).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
