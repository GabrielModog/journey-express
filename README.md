# Projeto Jornadas

## Rodando o projeto
Certifique-se que está na raiz do projeto e faça os seguintes passos:

```bash
docker-compose up -d
```

O docker compose irá criar os containers necessários para rodar o projeto.

Quando o processo estiver concluído você tera acesso as seguintes URLs:

### Frontend

Na pasta de `/frontend/` é possível achar instruções sobre as variáveis de ambientes necessarias 
e também para rodar o projeto manualmente na maquina também.
```bash
http://localhost:3000
```

### Backend
Na pasta de `/backend/` é possível achar instruções sobre as variáveis de ambientes 
e também para rodar o projeto manualmente na maquina também.
```bash
http://localhost:3001/api
```

#### Documentação da API do Backend
Para ter acesso a documentação gerada pelo swagger o servidor deve está
rodando na sua maquina. Quando você seguir as instruções para inicializar o servidor, é só acessar essa rota

```bash
http://localhost:3001/api/docs
```