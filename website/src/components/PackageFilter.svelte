<script lang="ts">
    interface Package {
        name: string;
        url: string;
        description: string;
        stars: number;
        topics: string[];
        pushed_at: string;
        discovered_at: string;
    }

    interface Props {
        packages: Package[];
    }

    let {packages}: Props = $props();

    let sort = $state('discovered');
    let search = $state('');
    let minStars = $state(0);
    let maxStars = $state(500);

    function timeAgo(dateString: string): string {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
        return date.toLocaleDateString();
    }

    let filtered = $derived.by(() => {
        let result = packages.filter((pkg) => {
            if (pkg.stars < minStars || pkg.stars > maxStars) return false;
            if (search) {
                const haystack = (
                    pkg.name +
                    ' ' +
                    pkg.description +
                    ' ' +
                    (pkg.topics || []).join(' ')
                ).toLowerCase();
                return haystack.includes(search.toLowerCase());
            }
            return true;
        });

        result.sort((a, b) => {
            switch (sort) {
                case 'stars':
                    return b.stars - a.stars;
                case 'updated':
                    return (
                        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
                    );
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'discovered':
                default:
                    return (
                        new Date(b.discovered_at).getTime() -
                        new Date(a.discovered_at).getTime()
                    );
            }
        });

        return result;
    });
</script>

<nav class="z-10 -mt-12 mb-6">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div
                class="bg-zinc-900 rounded-xl shadow-2xl overflow-hidden font-mono text-sm ring-1 ring-white/10"
        >
            <div
                    class="flex items-center gap-2 px-5 py-3 bg-zinc-800/80 border-b border-zinc-700/50"
            >
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
                <span class="ml-2 text-zinc-400 text-xs">astro-finder</span>
                <a
                        aria-label="GitHub Repository"
                        href="https://github.com/HelgeSverre/gh-astro-discovery"
                        target="_blank"
                        class="ml-auto text-zinc-500 hover:text-zinc-300 transition"
                >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                        />
                    </svg>
                </a>
            </div>
            <div
                    class="px-5 py-6 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-zinc-300 leading-tight"
            >
                <span class="text-green-400">$</span>
                <span class="text-yellow-300">find</span>
                <span class="text-zinc-400">packages</span>
                <span class="text-pink-400">--sort</span><span class="text-zinc-400"
            >=</span
            ><select bind:value={sort} class="cmd-select" aria-label="Sort order">
                <option value="discovered">discovered</option>
                <option value="stars">stars</option>
                <option value="updated">updated</option>
                <option value="name">name</option>
            </select>
                <span class="text-pink-400">--min-stars</span><span class="text-zinc-400"
            >=</span
            ><input
                    type="number"
                    bind:value={minStars}
                    class="cmd-input w-12"
                    aria-label="Minimum stars"
            />
                <span class="text-pink-400">--max-stars</span><span class="text-zinc-400"
            >=</span
            ><input
                    type="number"
                    bind:value={maxStars}
                    class="cmd-input w-12"
                    aria-label="Maximum stars"
            />
                <span class="text-pink-400">--search</span><span class="text-zinc-400"
            >=</span
            ><span class="text-cyan-300">"</span><input
                    type="text"
                    bind:value={search}
                    placeholder="search..."
                    class="cmd-input w-32"
                    aria-label="Search packages"
            /><span class="text-cyan-300">"</span>
            </div>
        </div>
    </div>
</nav>

<main class="flex-1 max-w-7xl mx-auto w-full px-4 pb-8 sm:px-6 lg:px-8">
    <div class="mb-4 text-sm text-zinc-500 font-mono">
        # Found {filtered.length} packages
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each filtered as pkg (pkg.name)}
            <a
                    href={pkg.url}
                    target="_blank"
                    class="group flex flex-col p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-zinc-200 overflow-hidden"
            >
                <div class="flex items-start justify-between gap-2">
                    <h2
                            class="font-semibold text-zinc-900 group-hover:text-purple-600 transition truncate text-base"
                    >
                        {pkg.name}
                    </h2>
                    <span
                            class="flex items-center gap-1 text-sm text-zinc-500 whitespace-nowrap"
                    >
            <svg
                    class="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
            >
              <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
                        {pkg.stars}
          </span>
                </div>
                <p class="mt-2 text-sm text-zinc-600 line-clamp-2 flex-1">
                    {#if pkg.description}
                        {pkg.description}
                    {:else}
                        <span class="italic text-zinc-500">No description</span>
                    {/if}
                </p>
                <div class="mt-3 flex flex-wrap gap-1">
                    {#each (pkg.topics || []).slice(0, 3) as topic}
            <span
                    class="px-2 py-0.5 text-xs bg-zinc-100 text-zinc-600 rounded-full"
            >{topic}</span
            >
                    {/each}
                </div>
                <div class="mt-3 text-xs text-zinc-500">
                    Updated {timeAgo(pkg.pushed_at)}
                </div>
            </a>
        {/each}
    </div>
</main>
