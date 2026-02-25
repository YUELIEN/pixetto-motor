# Pixetto 與馬達控制 Mind+ 用戶庫

在 Mind+（上傳模式）中使用 Pixetto 視覺感測器進行顏色辨識，並結合循線感測器，控制雙馬達。支援標準 Arduino Uno 腳位以及 mBot mCore 控制板。

## 載入方式

### 本地載入
1. 下載本 repo 的 `.mpext` 檔案
2. 開啟 Mind+ → 擴展 → 用戶庫 → 從本地載入

### 網路載入（網頁版適用）
1. 開啟 Mind+ → 擴展 → 用戶庫
2. 搜尋欄貼上：
```text
[https://github.com/YUELIEN/pixetto-motor](https://github.com/YUELIEN/pixetto-motor)

```

## 硬體接線配置

本擴充庫支援標準 Arduino 接線，腳位配置同時相容於 mBot mCore 的 RJ25 連接埠。

### mBot mCore 連接埠對應

| 模組 | mCore 連接埠 | Arduino 內部腳位 |
| --- | --- | --- |
| **循線感測器** | 連接埠 2 | Slot1 = D9 (左), Slot2 = D10 (右) |
| **Pixetto 感測器** | 連接埠 3 | Slot1 = A2 (RX), Slot2 = A3 (TX) |
| **右馬達 (M1)** | 馬達 M1 | D6 (PWM), D7 (DIR) |
| **左馬達 (M2)** | 馬達 M2 | D5 (PWM), D4 (DIR) |

### 標準 Arduino 獨立接線

如果你使用一般的 Arduino 擴充板，請依照以下腳位連接：

**1. Pixetto 視覺感測器**
| Pixetto | Arduino |
|---------|---------|
| TX | A2 |
| RX | A3 |
| VCC | 5V |
| GND | GND |

**2. 循線感測器**
| 功能 | Arduino Pin |
|------|-------------|
| 左側感測器 | Pin 9 |
| 右側感測器 | Pin 10 |

**3. 馬達驅動（雙馬達 L298N 等）**
| 功能 | Arduino Pin |
|------|-------------|
| 左馬達 方向 (DIR) | Pin 4 |
| 左馬達 速度 (PWM) | Pin 5 |
| 右馬達 速度 (PWM) | Pin 6 |
| 右馬達 方向 (DIR) | Pin 7 |

## 積木說明

| 積木 | 說明 |
| --- | --- |
| **初始化 Pixetto 感測器** | 啟動 Pixetto 通訊，並自動設定所有馬達與循線感測器的腳位。 |
| **Pixetto感測器 偵測到 [顏色] ？** | 回傳 true/false，支援紅、黃、綠三色辨識，可接於 `如果...那麼` 判斷式。 |
| **循線感測器 偵測到 [位置] 為 [顏色] ？** | 回傳 true/false。可偵測 左邊/右邊/全部/沒有 是否遇到 黑線/白線。 |
| **前進，動力 [%]** | 兩輪同向前進。 |
| **後退，動力 [%]** | 兩輪同向後退。 |
| **左轉，動力 [%]** | 左輪後退 + 右輪前進（原地左轉）。 |
| **右轉，動力 [%]** | 左輪前進 + 右輪後退（原地右轉）。 |
| **停止** | 雙輪馬達停止運轉。 |

> 💡 **提示**：動力範圍輸入 0～100%，擴充庫內部會自動換算成 Arduino 的 PWM 值（0～255）。

## 範例邏輯：顏色辨識與循線結合

```text
初始化 Pixetto 感測器
重複無限次：
  如果 循線感測器 偵測到 [全部] 為 [黑] ？：
    停止
  否則：
    如果 Pixetto感測器 偵測到 [紅色] ？：
      停止
    如果 Pixetto感測器 偵測到 [黃色] ？：
      前進，動力 30%
    如果 Pixetto感測器 偵測到 [綠色] ？：
      前進，動力 60%

```

## 依賴函式庫

編譯前，請確保將以下官方函式庫放入 Mind+ 的對應目錄中：

* [Pixetto Arduino Library](https://github.com/pixetto/Pixetto)
* [PixettoLite Arduino Library](https://github.com/pixetto/PixettoLite)

請放置於：

```text
arduinoC/libraries/Pixetto/
arduinoC/libraries/PixettoLite/

```

## 授權

[MIT License](https://www.google.com/search?q=LICENSE)

```
