import { config } from "dotenv";

config();

export const rmqhost = process.env.RBMQ_HOST || 'localhost';

export const ADMIN_QUEUE = process.env.ADMIN_QUEUE || "admins_queue";
export const DB_QUEUE = process.env.DB_QUEUE || "db_queue";
export const MANAGER_QUEUE = process.env.MANAGER_QUEUE || "manager_queue";