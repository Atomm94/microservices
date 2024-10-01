import { config } from "dotenv";

config();

export const rmqhost = process.env.RBMQ_HOST || 'localhost';

export const RBMQ_LOGS_QUEUE = process.env.RBMQ_LOGS_QUEUE || "logs_queue";
export const RBMQ_MANAGER_QUEUE = process.env.RBMQ_MANAGER_QUEUE || "manager_queue";
export const RBMQ_DB_QUEUE = process.env.RBMQ_DB_QUEUE || "db_queue'";