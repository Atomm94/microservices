const dbConfigs = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'admin_management',
}

export default {
    uri: `mongodb://${dbConfigs.host}:${dbConfigs.port}/${dbConfigs.name}`,
};