import request from '../utils/request'

export const getSongList = () => {
  return request.get('/api/songList')
}