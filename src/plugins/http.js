import axios from 'axios'

const config = {
  baseURL: 'https://gateway.apiserpro.serpro.gov.br/consulta-nfe-df-trial/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer 06aef429-a981-3ec5-a1f8-71d38d86481e',
  },
}

export default function (app) {
  app.config.globalProperties.$http = axios.create(config)
}
