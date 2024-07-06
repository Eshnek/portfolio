<template>
    <div class="home">
        <Bio />

        <h1>Visual Studio Code Extensions</h1>
        <div class="card-holder">
            <Card
                title="Power Commit"
                link="https://github.com/CitadelStronghold/power-commit"
            >
                A Visual Studio Code Extension for performing quick Git commits.
            </Card>
            <Card
                title="Smart Backspace"
                link="https://github.com/CitadelStronghold/smart-backspace"
            >
                A Visual Studio Code Extension for deleting empty and whitespace lines when backspace is pressed.
            </Card>
            <Card
                title="Semigod"
                link="https://github.com/CitadelStronghold/semigod"
            >
                A Visual Studio Code Extension for adding a semicolon with a keyboard shortcut.
            </Card>
        </div>
        <h1>Other</h1>
        <div class="card-holder">
            <!--<Card blank
                title="Teek"
                link="https://teek.info"
                icon="https://teek.info/Icon.png"
            >
                Game in development. Uses a proprietary engine written with <span class="color-blue">C++20</span>. The game utilizes the ECS design pattern.
            </Card>-->

            <!--<Card blank
                title="DayForm.io"
                link="https://dayform.io"
                icon="https://dayform.io/Icon.png"
            >
                Daily accountability and mobile-compatible form service delivered by text message. Responses are encrypted client-side using a derived key. Frontend written using <span class="color-green">VueJS</span>.
            </Card>-->

            <Card round
                class="gem-card"
                title="Gem Linux"
                link="https://github.com/CitadelStronghold/gem"
                icon="https://avatars.githubusercontent.com/u/114880172?s=48&v=4"
            >
                <span class="color-blue">Arch Linux®</span> Based ISO Distribution
            </Card>

            <!--<Card class="hidden" title="Hidden" />-->

            <Card
                class="status-card"
                title="Git Dashboard"
            >
                A dashboard for a Raspberry Pi to monitor project build statuses. Built with <span class="color-green">VueJS</span> and <span class="color-blue">TypeScript</span>.
                <img src="/status.png" alt="Status Dashboard" @click="openModal">
            </Card>

            <!-- <Card blank
                title="Nuxt Weather"
                link="https://weather-lyart-seven.vercel.app/"
                icon="https://weather-lyart-seven.vercel.app/favicon.ico"
            >
                A weather dashboard created with <span class="color-green">Nuxt</span> and <span class="color-blue">Tailwind CSS</span>. Results are colored by temperature.
            </Card> -->
        </div>
        <h1>C++</h1>
        <div class="card-holder">
            <Card
                title="Match"
                link="https://github.com/CitadelStronghold/match"
            >
                High Performance Log Validator
            </Card>

            <Card
                title="C++ Starter"
                link="https://github.com/Eshnek/starter"
            >
                Starter C++23 Project with CMake and Ninja
            </Card>
            <Card
                title="TypeList"
                link="https://github.com/Eshnek/typelist"
            >
                C++ Type Manipulation Header
            </Card>
            <Card
                class="card-format"
                title="Format"
                link="https://github.com/Eshnek/format"
            >
                <div class="format-internal">
                    <div class="format-internal-description">
                        for clang-format
                    </div>

                    <code class="format-internal-code">
                        #include &lt;iostream&gt;
                        <br>
                        <br>
                        int main ()
                        <br>
                        {
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;const char* msg = "Message!";
                            <br>
                            <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;std::cout &lt;&lt; msg &lt;&lt; "\n";
                            <br><br>
                            &nbsp;&nbsp;&nbsp;&nbsp;return 0;
                            <br>
                        }
                    </code>
                </div>
            </Card>

            <!-- <Card
                title="Case"
            >
                An in-house testing engine that sandboxes tests into subprocesses. This technique allows any number of tests to run in parallel, without static variables interfering with each other.
            </Card> -->
        </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showModal" class="modal" @click="closeModal">
        <div class="modal-content">
            <img src="/status.png" alt="Status Dashboard" @click.stop>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Card from '@/components/Card.vue';
import Bio from '@/components/Bio.vue';
import Snake from '@/components/Snake.vue';

export default defineComponent({
    components: { Card, Bio, Snake },
    setup() {
        const showModal = ref(false);

        const openModal = () => {
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
        };

        return {
            showModal,
            openModal,
            closeModal
        };
    }
});
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;

    .bio {
        margin-top: var(--padding-page);
    }
    h1 {
        margin: 8px;
        font-size: 32px;
    }

    .snake {
        margin-bottom: 6px;
    }
    .hidden {
        opacity: 0;
    }
    .status-card {
        img {
            margin-top: var(--padding-card);
            width: 100%;
            height: auto;
            object-fit: cover;
            border: var(--border-card);
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: transform 0.3s ease;

            &:hover {
                transform: scale(1.05);
            }
        }
    }
}

.card-holder {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    .card-format {
        width: 100%;
        grid-column: span 2;
    }
}

.format-internal {
    display: flex;
    flex-direction: column;
    gap: var(--padding-card);

    .format-internal-code {
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        padding: var(--padding-card);
        text-align: left;
    }
}

.modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;

    .modal-content {
        max-width: 90%;
        max-height: 90%;

        img {
            width: 100%;
            height: auto;
            object-fit: contain;
            border-radius: var(--border-radius);
        }
    }
}
</style>