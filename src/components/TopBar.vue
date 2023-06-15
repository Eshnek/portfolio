<template>
    <nav>
        <RouterLink to="/">Portfolio</RouterLink>
        <RouterLink to="/about">Resume</RouterLink>
        <a href="https://github.com/Eshnek" target="_blank">
            <img src="logos/github/github-mark.svg" alt="Github">
        </a>
    </nav>
</template>

<style scoped lang="scss">
nav {
    width: 100%;
    height: 64px;

    font-size: 12px;
    text-align: center;

    padding: 16px;

    a {
        padding: 8px;
    }
}
</style>
