const config = {
    // 服务器配置
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },

    // 数据库配置
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/chy_financial',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // JWT配置
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '7d'
    },

    // 密码加密配置
    bcrypt: {
        saltRounds: 10
    },

    // 跨域配置
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // 文件上传配置
    upload: {
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        },
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
    },

    // 邮件服务配置
    email: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    },

    // AI服务配置
    ai: {
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: 'gpt-4'
        }
    }
};

module.exports = config; 