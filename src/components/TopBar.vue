<template>
    <div class="top-bar">
        <div class="top-bar-title">
            <a href="/">Dylan Pozarnsky</a>
        </div>
        <nav class="top-bar-content">
            <RouterLink to="/">Portfolio</RouterLink>
            <a href="/Dylan_Pozarnsky.pdf" target="_blank">Resume</a>
            <a href="https://github.com/Eshnek" target="_blank">Github</a>
            <div class="top-right">
                <Corner />
            </div>
            <RouterLink class="contact" to="/contact">Contact</RouterLink>
        </nav>
    </div>
</template>

<script lang="ts">
import Corner from '@/components/Corner.vue';

export default {
    components: { Corner },
}
</script>

<style scoped lang="scss">
.top-bar {
    height: 64px;

    .top-bar-title {
        position: absolute;
        left: 0;
        height: inherit;

        display: flex;
        align-items: center;
        padding-left: var(--padding-top-horizontal);

        font-size: var(--font-size-top-title);
        color: var(--color-text);
    }

    .top-bar-content {
        width: 100%;
        height: inherit;

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

        .contact {
            /*position: absolute;
            right: 64px;*/
        }
    }
}
</style>
