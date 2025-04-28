import IConfig from './IConfig';
import { config } from 'dotenv';

config();

const configuration : IConfig = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'dev',
    MONGO_URL: process.env.MONGO_URL || '',
    PRIVATE_KEY: process.env.PRIVATE_KEY|| '',
    TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    WEB_HOOK_SECRET: process.env.WEB_HOOK_SECRET || ''
};

export default configuration;