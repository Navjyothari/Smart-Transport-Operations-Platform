import app from './app';
import { config } from './config/env';
import prisma from './lib/prisma';

async function bootstrap() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(config.port, () => {
      console.log(`🚀 TransitOps API running on http://localhost:${config.port}`);
      console.log(`   Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
