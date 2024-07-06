<template>
    <div class="top-bar">
        <div class="top-bar-title">
            <a href="/">Eshnek</a>
        </div>
        <nav class="top-bar-content">
            <RouterLink to="/">Portfolio</RouterLink>
            <!-- <a href="/Resume.pdf" target="_blank">Resume</a> -->
            <a href="https://github.com/Eshnek" target="_blank">Github</a>
            <div class="top-right">
                <Corner link="https://github.com/Eshnek/portfolio" />
            </div>
            <div class="divider" />
            <!-- <RouterLink class="contact" to="/contact">Contact</RouterLink>
            <div class="divider" />-->
            <DayNight class="top-element" />
        </nav>
    </div>
</template>

<script lang="ts">
import Corner from "@/components/Corner.vue";
import DayNight from "@/components/DayNight.vue";

export default {
    components: {
        Corner,
        DayNight,
    },
};
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
        padding-bottom: 0;
        padding-top: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-bottom: var(--border-top);
        background-color: var(--color-background-top);

        a,
        .top-element {
            padding: var(--padding-top-link);
            line-height: 0px;

            text-decoration: none;
            font-size: var(--font-size-top);
            color: var(--color-text-inactive);

            border-bottom: 1px solid transparent;
            margin-bottom: -2px;
        }

        .top-right {
            height: inherit;

            display: flex;
            align-items: center;

            .github-corner {
                position: fixed;
                right: 0;
                top: 0;

                padding: 0;

                z-index: 5000;
            }
        }

        .divider {
            height: 60%;
            width: 1px;
            background-color: var(--color-border);

            margin: var(--margin-top-divider);
        }

        .contact {
            /*position: absolute;
            right: 64px;*/
        }

        .router-link-active {
            color: var(--color-text-active);

            height: 100%;
            display: flex;
            align-items: center;

            border-bottom: 1px solid var(--color-border-active);
        }
    }
}
</style>
