<template>
    <div class="fullscreen text-center flex flex-center"
         style="position: absolute; z-index: 1000000; background-color: rgba(29,29,29,0.4)">
        <div class="loader"/>
    </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'ErrorNotFound'
});
</script>

<style>
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loader {
    border: 16px solid #181818;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 120px;
    height: 120px;
    z-index: 1000000;
    animation: spin 2s linear infinite;
}
</style>
