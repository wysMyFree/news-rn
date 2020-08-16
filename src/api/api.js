import * as axios from 'axios'

const instance = axios.create({
  baseURL:
    'http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=cb20367f46af47aeaea843a529ad0b7c',
})

export const newsAPI = {
  fetchNews() {
    return instance.get().then((response) => response.data.articles)
  },
}
