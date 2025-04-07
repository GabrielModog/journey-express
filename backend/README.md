# API de Jornadas

## Instalação Através do Docker (Recomendado)
Caso a intenção não seja rodar configurar e rodar manualmente o projeto, o Docker pode ser uma alternativa para rodar localmente o projeto. Siga as instruções a seguir:

Na raiz do projeto rode o seguinte comando:

```bash
docker-compose up -d
```

Este comando deve ser executado na raiz do projeto, onde possui o arquivo `docker-compose.yml`, que contém todas as configurações necessárias para rodar o projeto através do docker.

## Instalação Manual

### Pré-requisitos para rodar localmente
- Node 20 or superior
- MongoDB
- Redis

### Variaveis de Ambiente

Cria um `.env` baseado no `.env.example` na raiz deste projeto.
 
Por exemplo:
```env
MONGODB_URI=mongodb://localhost:27017/evacopilot
REDIS_HOST=localhost
REDIS_PORT=6379
BACKEND_PORT=3001
```

### Instalação e Execução
1. Instalação de dependências:
```bash
yarn install
```

2. Inicialização do servidor
```bash
yarn dev
```

3. Acesse 
```bash
http://localhost:3001/api
```

## Documentação da API
Para ter acesso a documentação gerada pelo swagger o servidor deve está
rodando na sua maquina. Quando você seguir as instruções para inicializar o servidor, é só acessar essa rota

```bash
http://localhost:3001/api/docs
```

## API Endpoints

`POST /api/colaboradores`  

```json
{
  "name": "Fulano de Tal",
  "email": "fulano@tal.com",
  "phone": "+5511999999999"
}
```

`POST /api/actions`

```json
{
  "type": "EMAIL",
  "order": 1,
  "delayMinutes": 0
}
```

`POST /api/jornadas`

```json
{
  "name": "Jornada de Onboarding",
  "description": "Jornada para novos funcionários",
  "actions": ["<id_da_action>"],
  "isActive": true
}
```

`POST /api/vincular-jornada/vincular`

```json
{
  "colaboradorId": "<id_colaborador>",
  "jornadaId": "<id_jornada>",
  "startDate": "2024-04-05T14:00:00Z"
}
```