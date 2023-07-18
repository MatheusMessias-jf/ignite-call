export function convertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number) //pega cada posição do array retornado pelo split e passa pro number que já é uma função construtora

  return hours * 60 + minutes
}