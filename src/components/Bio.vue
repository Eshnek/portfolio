<template>
    <div class="bio">
        <!--
            <div class="bio-top">
                Hello, I'm Eshnek! I am a professional software engineer with experience all over the board.
            </div>

            <div class="bio-bottom">
                Below you can find some of my more recent projects.
            </div>

            <div class="bio-bottom">
                Cards with colored corners can be clicked on to open their corresponding links.
            </div>

            <div class="bio-bottom">
                Move your mouse over the grid below to play a short snake game I <a href="https://github.com/Eshnek/portfolio/blob/main/src/snake.ts" target="_blank">wrote in <span class="color-blue">TypeScript</span></a>:
            </div>
        -->
    </div>
</template>

<style lang="scss" scoped>
.bio {
    width: 100%;
    max-width: 512px;

    text-align: center;
    white-space: normal;

    div {
        margin-bottom: 24px;
    }
    .bio-top {
        font-size: 24px;
    }
    .bio-bottom {
        font-size: 18px;

        a {
            text-decoration: underline;
            text-decoration-color: var(--color-link);

            color: var(--color-text-link);
        }
    }
}
</style>
