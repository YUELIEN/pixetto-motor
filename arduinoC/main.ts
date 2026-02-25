//% color="#0095DD" iconWidth=50 iconHeight=40
namespace pixetto_motor {

    // ────────────────────────────────────────────────
    // mBot mCore 腳位對照：
    //   連接埠2 (循線感測器) → Slot1=D9(左), Slot2=D10(右)
    //   連接埠3 (Pixetto)    → Slot1=A2(RX), Slot2=A3(TX)
    //   馬達 → M1: D6(PWM), D7(DIR)  /  M2: D5(PWM), D4(DIR)
    // ────────────────────────────────────────────────

    // ────────── 初始化 Pixetto 感測器 ──────────
    //% block="初始化 Pixetto 感測器"
    //% blockType="command"
    //% weight=100
    export function pixettoInit(parameter: any, block: any): void {
        Generator.addInclude("Arduino",       '#include <Arduino.h>');
        Generator.addInclude("Wire",          '#include <Wire.h>');
        Generator.addInclude("SoftwareSerial",'#include <SoftwareSerial.h>');
        Generator.addInclude("Pixetto",       '#include <Pixetto.h>');
        // 連接埠3 → A2(RX), A3(TX)
        Generator.addObject("ss", "Pixetto", "ss(A2, A3);");
        Generator.addSetup("pixetto_motor_init",
            "ss.begin();\n" +
            "\tpinMode(4, OUTPUT);\n" +
            "\tpinMode(5, OUTPUT);\n" +
            "\tpinMode(6, OUTPUT);\n" +
            "\tpinMode(7, OUTPUT);\n" +
            "\t// 循線感測器 連接埠2: D9(左), D10(右)\n" +
            "\tpinMode(9,  INPUT);\n" +
            "\tpinMode(10, INPUT);"
        );
    }

    // ────────── 偵測到指定顏色？ ──────────
    //% block="偵測到 [COLOR] ？"
    //% blockType="boolean"
    //% COLOR.shadow="dropdown" COLOR.options="COLOR_MENU" COLOR.defl="COLOR_MENU.red"
    //% weight=90
    export function detectColor(parameter: any, block: any): void {
        let color = parameter.COLOR.code;
        Generator.addCode([
            `(ss.isDetected() && ss.getFuncID() == Pixetto::FUNC_COLOR_DETECTION && ss.getTypeID() == ${color})`,
            Generator.ORDER_ATOMIC
        ]);
    }

    // ────────── 循線感測器（連接埠2，D9=左 / D10=右）──────────
    //% block="循線感測器 偵測到 [POSITION] 為 [LINE_COLOR] ？"
    //% blockType="boolean"
    //% POSITION.shadow="dropdown" POSITION.options="LINE_POSITION_MENU" POSITION.defl="LINE_POSITION_MENU.all"
    //% LINE_COLOR.shadow="dropdown" LINE_COLOR.options="LINE_COLOR_MENU" LINE_COLOR.defl="LINE_COLOR_MENU.black"
    //% weight=85
    export function lineFollower(parameter: any, block: any): void {
        let position = parameter.POSITION.code;
        let color    = parameter.LINE_COLOR.code;

        Generator.addInclude("lineCheckHelper",
`
// ── 循線感測器輔助函式 (連接埠2: D9=左, D10=右) ──
// position: 0=全部, 1=右邊, 2=左邊, 3=沒有
// lineColor: 0=黑(LOW), 1=白(HIGH)
inline bool pixetto_lineCheck(int position, int lineColor) {
  int target = (lineColor == 0) ? LOW : HIGH;
  bool L = (digitalRead(9)  == target);
  bool R = (digitalRead(10) == target);
  if (position == 0) return  L &&  R;
  if (position == 1) return  R && !L;
  if (position == 2) return  L && !R;
  if (position == 3) return !L && !R;
  return false;
}
`
        );

        Generator.addCode([
            `(pixetto_lineCheck(${position}, ${color}))`,
            Generator.ORDER_ATOMIC
        ]);
    }

    // ────────── 前進 ──────────
    //% block="前進，動力 [POWER] %"
    //% blockType="command"
    //% POWER.shadow="range" POWER.params.min=0 POWER.params.max=100 POWER.defl=50
    //% weight=80
    export function motorForward(parameter: any, block: any): void {
        let power = parameter.POWER.code;
        Generator.addCode(
            `digitalWrite(4, HIGH);\n\tanalogWrite(5, map(constrain(${power},0,100),0,100,0,255));\n\tdigitalWrite(7, LOW);\n\tanalogWrite(6, map(constrain(${power},0,100),0,100,0,255));`
        );
    }

    // ────────── 後退 ──────────
    //% block="後退，動力 [POWER] %"
    //% blockType="command"
    //% POWER.shadow="range" POWER.params.min=0 POWER.params.max=100 POWER.defl=50
    //% weight=70
    export function motorBackward(parameter: any, block: any): void {
        let power = parameter.POWER.code;
        Generator.addCode(
            `digitalWrite(4, LOW);\n\tanalogWrite(5, map(constrain(${power},0,100),0,100,0,255));\n\tdigitalWrite(7, HIGH);\n\tanalogWrite(6, map(constrain(${power},0,100),0,100,0,255));`
        );
    }

    // ────────── 左轉 ──────────
    //% block="左轉，動力 [POWER] %"
    //% blockType="command"
    //% POWER.shadow="range" POWER.params.min=0 POWER.params.max=100 POWER.defl=50
    //% weight=60
    export function motorTurnLeft(parameter: any, block: any): void {
        let power = parameter.POWER.code;
        Generator.addCode(
            `digitalWrite(4, HIGH);\n\tanalogWrite(5, map(constrain(${power},0,100),0,100,0,255));\n\tdigitalWrite(7, HIGH);\n\tanalogWrite(6, map(constrain(${power},0,100),0,100,0,255));`
        );
    }

    // ────────── 右轉 ──────────
    //% block="右轉，動力 [POWER] %"
    //% blockType="command"
    //% POWER.shadow="range" POWER.params.min=0 POWER.params.max=100 POWER.defl=50
    //% weight=50
    export function motorTurnRight(parameter: any, block: any): void {
        let power = parameter.POWER.code;
        Generator.addCode(
            `digitalWrite(4, LOW);\n\tanalogWrite(5, map(constrain(${power},0,100),0,100,0,255));\n\tdigitalWrite(7, LOW);\n\tanalogWrite(6, map(constrain(${power},0,100),0,100,0,255));`
        );
    }

    // ────────── 停止 ──────────
    //% block="停止"
    //% blockType="command"
    //% weight=40
    export function motorStop(parameter: any, block: any): void {
        Generator.addCode(`analogWrite(5, 0);\n\tanalogWrite(6, 0);`);
    }
}