import axios from "axios"

export const BASE_URL = "http://localhost:8000/"

export const ENDPOINTS = {
  predict: "predict",
  ping: "ping",
}

export const createAPIEndpoint = (endpoint: any) => {
  let url = BASE_URL + "api/" + endpoint + "/"
  return {
    fetch: () => axios.get(url),
    fetchById: (id: number) => axios.get(url + id),
    post: (newRecord: any) => axios.post(url, newRecord),
    put: (id: number, updatedRecord: any) => axios.put(url + id, updatedRecord),
    delete: (id: number) => axios.delete(url + id),
  }
}
