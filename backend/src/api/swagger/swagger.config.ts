import swaggerJsdoc from 'swagger-jsdoc';
import { config } from 'dotenv';

config();

const PORT = process.env.BACKEND_PORT || '3001';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jornadas API',
      version: '1.0.0',
      description: 'API de Jornadas',
      contact: {
        name: 'API',
        email: 'support@teste.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/api/routes/*.ts', './src/api/controllers/*.ts', './src/core/domain/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 