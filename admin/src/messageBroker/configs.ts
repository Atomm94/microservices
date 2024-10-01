import { config } from "dotenv";

config();

export const rmqhost = process.env.RBMQ_HOST || 'localhost';

export const RBMQ_ADMIN_QUEUE = process.env.RBMQ_ADMIN_QUEUE || "admins_queue";
export const RBMQ_DB_QUEUE = process.env.RBMQ_QUEUE || "db_queue";