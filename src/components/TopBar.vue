<template>
    <nav class="top-bar">
        <RouterLink to="/">Portfolio</RouterLink>
        <RouterLink to="/about">Resume</RouterLink>
        <a href="https://github.com/Eshnek" target="_blank">
            <img src="logos/github/github-mark.svg" alt="Github">
        </a>
    </nav>
</template>

<style scoped lang="scss">
.top-bar {
    width: 100%;
    height: 64px;

    font-size: 12px;
    text-align: center;

    padding: 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-background-top);

    a {
        padding: 8px;
        line-height: 0px;

        img {
            width: 32px;
            height: auto;
        }
    }
}
</style>
