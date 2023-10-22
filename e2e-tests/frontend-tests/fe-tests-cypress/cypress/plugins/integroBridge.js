const axios = require('axios').default

const setUpIntegro = (on) => {
  on('task', {
    // create tasks
    async integro(in_calls) {
      //TODO set URL as configured
      const result = await axios.post('http://localhost:8080/call', in_calls, {
        headers: { 'content-type': 'text/json' },
      })
      console.log(result.data)
      return result.data
    },
  })
}

module.exports = setUpIntegro
