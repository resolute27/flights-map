
# ✈️ Flight Info Web App


## 📦 安裝指引

### 1. 安裝 Python 依賴

```bash
pip install -r backend/requirements.txt
```

### 2. 下載並放置資料檔案

* 從 Kaggle 下載航班資料：
  [https://www.kaggle.com/datasets/mahoora00135/flights](https://www.kaggle.com/datasets/mahoora00135/flights)

  將 CSV 檔案命名為 `flight_data.csv`，並放到 `backend/` 資料夾中：

  ```
  backend/flight_data.csv
  ```

* 從 GitHub 下載 IATA/ICAO 機場代碼對應表：
  [https://github.com/ip2location/ip2location-iata-icao](https://github.com/ip2location/ip2location-iata-icao)

  將 CSV 檔案命名為 `iata-icao.csv`，並放到 `backend/` 資料夾中：

  ```
  backend/iata-icao.csv
  ```

### 3. 匯入初始資料

```bash
python -m backend.import_flights
python -m backend.import_airports
```

---

## 🚀 啟動應用程式

開兩個 Terminal

### ✅ 啟動後端

```bash
cd backend
pnpm i
pnpm approve-builds
pnpm dev
```


### ✅ 啟動前端

```bash
cd frontend/
pnpm install
pnpm dev
```
