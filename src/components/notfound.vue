<template>
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">

        <div class="text-center space-y-4">

            <h1 class="text-6xl font-bold text-primary">404</h1>

            <p class="text-lg opacity-70">
                Page not found
            </p>

            <div class="flex gap-2 justify-center">
                <button class="btn btn-primary" @click="$router.push('/')">
                    Go Dashboard
                </button>

                <button class="btn btn-outline" @click="$router.back()">
                    Go Back
                </button>
            </div>

        </div>

    </div>
</template>

<script>
export default {
    name: "NotFound"
}
</script>