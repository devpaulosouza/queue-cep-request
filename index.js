'use strict'

require('dotenv/config');

const fetch =  require('cross-fetch')

/**
 * onde serão armazenados as requisições já feitas
 */
const _cache = {}

/**
 * chave publica da api
 */
const APP_KEY = process.env.APP_KEY

/**
 * chave privada do usuário da api
 */
const APP_SECRET = process.env.APP_SECRET

/**
 * URL da API de enderecos
 * documentacao: https://webmaniabr.com/docs/rest-api-cep-ibge/
 */
const URL = 'https://webmaniabr.com/api/1/cep/'

/**
 * enfileira as requisições para serem executadas de forma síncrona
 */
const requestAddress = (() => {
  let pending = Promise.resolve();

  const run = async (cep) => {
    try {
      await pending;
    } finally {
      return fetchAddress(cep)
    }
  }
  return (cep) => (pending = run(cep))
})()

/**
 * Faz uma consulta à api da webmania
 * @param {string} cep cep a ser consultado
 */
const fetchAddress = async (cep) => {
  let res;
  if (_cache[cep]) {
    res = _cache[cep]
    console.log('cached')
  } else {
    res = await fetch(`${URL}${cep}/?app_key=${APP_KEY}&app_secret=${APP_SECRET}`)
    res = await res.json()
    _cache[cep] = res; 
  }
  return res;
}

/**
 * lista com os ceps a serem consultados para teste
 */
const CEPS = ['58015-070', '13173-425', '86600-490', '86600-490', '64078-180', '64078-180']

CEPS.forEach(async cep => {
  const { endereco } = await requestAddress(cep)
  console.log(endereco)
})
