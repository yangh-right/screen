/**
 * @version: 1.0.1
 * @Author: wang kai
 * @Date: 2020-07-17 15:27:13
 * @LastEditors: wang kai
 * @LastEditTime: 2020-07-17 16:11:23
 * @Description: 翻转面板
 * @Update: 更新内容
 */
<template>
    <div class="transformPanelBox">
        <div class="beforeBox">
            <slot name="before" />
        </div>
        <div class="afterBox">
            <slot name="after" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TransformPanel'
    }
</script>

<style lang="less" scoped>
    .transformPanelBox{
        position: relative;
        width: 100%;
        height: 100%;
        .beforeBox, .afterBox{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            animation-duration: 12s;
            animation-timing-function: ease;
            animation-iteration-count: infinite;
            animation-direction: normal;
        }
        .beforeBox{
            animation-name: cardFront;
        }
        .afterBox{
            // animation: 6s linear 6s normal both infinite running cardBack;
            animation-name: cardBack;
        }
        @keyframes cardFront { 
            0%, 40%, 100% {
                opacity: 1;
                -webkit-transform: rotateX(0deg);
                -moz-transform: rotateX(0deg);
                -ms-transform: rotateX(0deg);
                transform: rotateX(0deg)
            }
            50%, 90% {
                opacity: 1;
                -webkit-transform: rotateX(-180deg);
                -moz-transform: rotateX(-180deg);
                -ms-transform: rotateX(-180deg);
                transform: rotateX(-180deg)
            }
        }
        
        @keyframes cardBack { 
            0%, 40% ,100% {
                opacity: 1;
                -webkit-transform: rotateX(-180deg);
                -moz-transform: rotateX(-180deg);
                -ms-transform: rotateX(-180deg);
                transform: rotateX(-180deg)
            }
            50%, 90% {
                opacity: 1;
                -webkit-transform: rotateX(0deg);
                -moz-transform: rotateX(0deg);
                -ms-transform: rotateX(0deg);
                transform: rotateX(0deg)
            }
        }
    }
</style>