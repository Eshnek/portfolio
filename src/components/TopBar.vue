<template>
    <nav class="top-bar">
        <RouterLink to="/">Portfolio</RouterLink>
        <RouterLink to="/about">Resume</RouterLink>
        <RouterLink to="/about">Github</RouterLink>
        <div class="top-right">
            <a href="https://github.com/Eshnek" target="_blank">
                <img src="logos/github/github-mark.svg" alt="Github">
            </a>
        </div>
    </nav>
</template>

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

        img {
            width: 32px;
            height: auto;
        }
    }
    .top-right {
        height: inherit;
        position: absolute;
        right: var(--padding-top-horizontal);

        display: flex;
        align-items: center;
    }
}
</style>
