//% color="#0095DD" iconWidth=50 iconHeight=40
namespace pixetto_motor {

    // ────────── 初始化 Pixetto 感測器 ──────────
    //% block="初始化 Pixetto 感測器"
    //% blockType="command"
    //% weight=100
    export function pixettoInit(parameter: any, block: any): void {
        Generator.addInclude("Arduino",  '#include <Arduino.h>');
        Generator.addInclude("Wire",     '#include <Wire.h>');
        Generator.addInclude("SoftwareSerial", '#include <SoftwareSerial.h>');
        Generator.addInclude("Pixetto",  '#include <Pixetto.h>');
        Generator.addObject("ss", "Pixetto", "ss(A2, A3);");
        Generator.addSetup("pixetto_motor_init",
            "ss.begin();\n\tpinMode(4, OUTPUT);\n\tpinMode(5, OUTPUT);\n\tpinMode(6, OUTPUT);\n\tpinMode(7, OUTPUT);"
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

    // ────────── 左轉（左輪退 + 右輪走）──────────
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

    // ────────── 右轉（左輪走 + 右輪退）──────────
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