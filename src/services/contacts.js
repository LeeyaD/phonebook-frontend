import axios from 'axios'
const baseURL = '/api/persons'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseURL)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseURL, newObject, config)
  return response.data
}

const remove = (id) => {
  axios.delete(`${baseURL}/${id}`)
}

const update = (id, updatedPersonObj) => {
  const request = axios.put(`${baseURL}/${id}`, updatedPersonObj)
  return request.then(response => response.data)
}

export default {
  getAll,
  create,
  remove,
  update,
  setToken
}