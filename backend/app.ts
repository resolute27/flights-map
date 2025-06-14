import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const port = 8000;

// CORS 設定
app.use(cors({
  origin: '*',
  credentials: true,
}));

// API 路由
app.use('/api', router);

// 關閉預設 docs（Express 本來就沒有 docs UI）
app.get('/', (req, res) => {
  res.send('Flights API running...');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
