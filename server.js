const app = require('./config/express')();
// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(3001, () => {
  console.log(`Servidor rodando na porta ${3001}`)
});