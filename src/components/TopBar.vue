<template>
    <nav class="top-bar">
        <RouterLink to="/">Portfolio</RouterLink>
        <RouterLink to="/about">Resume</RouterLink>
        <a href="https://github.com/Eshnek" target="_blank">Github</a>
        <div class="top-right">
            <Corner />
        </div>
    </nav>
</template>

<script lang="ts">
import Corner from '@/components/Corner.vue';

export default {
    components: { Corner },
}
</script>

<style scoped lang="scss">
.top-bar {
    width: 100%;
    height: 64px;

    font-size: 12px;
    text-align: center;

    padding: var(--padding-top);
    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: var(--border-top);
    background-color: var(--color-background-top);

    a {
        padding: var(--padding-top-link);
        line-height: 0px;

        text-decoration: none;
        font-size: var(--font-size-top);
        color: var(--color-text);
    }

    .top-right {
        height: inherit;
        position: absolute;
        right: 0; // var(--padding-top-horizontal);

        display: flex;
        align-items: center;
    }
}
</style>
