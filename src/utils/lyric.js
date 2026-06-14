export const parseLyric = (lyricText) => {
  if (!lyricText) return []

  const lines = lyricText.split('\n')

  return lines
    .map(line => {
      const result = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/)

      if (!result) return null

      const minute = Number(result[1])
      const second = Number(result[2])
      const millisecond = Number(result[3])

      return {
        time: minute * 60 + second + millisecond / 100,
        text: result[4].trim()
      }
    })
    .filter(Boolean)
}