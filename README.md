# Pixetto 與馬達控制 Mind+ 用戶庫

在 Mind+（上傳模式）中使用 Pixetto 視覺感測器進行顏色辨識，並控制雙馬達。

## 載入方式

### 本地載入
1. 下載本 repo 的 `.mpext` 檔案
2. 開啟 Mind+ → 擴展 → 用戶庫 → 從本地載入

### 網路載入（網頁版適用）
1. 開啟 Mind+ → 擴展 → 用戶庫
2. 搜尋欄貼上：
```
https://github.com/YUELIEN/pixetto-motor
```

## 硬體接線

### Pixetto 感測器
| Pixetto | Arduino |
|---------|---------|
| TX | A2 |
| RX | A3 |
| VCC | 5V |
| GND | GND |

### 馬達驅動（雙馬達）
| 功能 | Arduino Pin |
|------|-------------|
| 左馬達 方向 | Pin 4 |
| 左馬達 速度(PWM) | Pin 5 |
| 右馬達 速度(PWM) | Pin 6 |
| 右馬達 方向 | Pin 7 |

## 積木說明

| 積木 | 說明 |
|------|------|
| 初始化 Pixetto 感測器 | 啟動 Pixetto，設定所有馬達腳位 |
| 偵測到 [顏色] ？ | 回傳 true/false，可接 if 判斷 |
| 前進，動力 [%] | 兩輪同向前進 |
| 後退，動力 [%] | 兩輪同向後退 |
| 左轉，動力 [%] | 左輪退 + 右輪走 |
| 右轉，動力 [%] | 左輪走 + 右輪退 |
| 停止 | 兩輪停止 |

> 動力範圍 0～100%，內部自動換算成 PWM 值（0～255）

## 範例邏輯

```
初始化 Pixetto 感測器
重複無限次：
  如果 偵測到紅色？ → 停止
  如果 偵測到黃色？ → 前進，動力 30%
  如果 偵測到綠色？ → 前進，動力 60%
```

## 依賴函式庫

編譯前請將 [Pixetto Arduino Library](https://github.com/pixetto/Pixetto) 放入：
編譯前請將 [Pixetto Arduino Library](https://github.com/pixetto/PixettoLite) 放入：
```
arduinoC/libraries/Pixetto/
arduinoC/libraries/PixettoLite/
```

## 授權
MIT License
