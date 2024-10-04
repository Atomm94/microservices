import { config } from "dotenv";

config();

export const rmqhost = process.env.RBMQ_HOST || 'localhost';

export const DB_QUEUE = process.env.RBMQ_DB_QUEUE || "db_queue'";
export const MANAGER_QUEUE = process.env.RBMQ_MANAGER_QUEUE || "manager_queue'";
export const ADMIN_QUEUE = process.env.RBMQ_DB_ADMIN || "admins_queue'";