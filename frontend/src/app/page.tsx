"use client";

import Image from "next/image";
import { HeavyComponent } from "@/components/HeavyComponent";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">

      {/* Hero Section */}
      <main className="flex min-h-screen w-full max-w-4xl mx-auto flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert mb-8"
          src="/next.svg"
          alt="Next.js logo"
          width={150}
          height={30}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-12">
          <h1 className="max-w-lg text-4xl font-bold leading-12 tracking-tight text-black dark:text-zinc-50">
            Snake Tech Demo
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Showcase of Tailwind CSS and Path Aliases in Next.js
          </p>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mb-16">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-white transition-colors hover:bg-gray-800 md:w-[180px] dark:bg-white dark:text-black dark:hover:bg-gray-200"
            href="#demo"
          >
            View Demo ↓
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[180px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Docs
          </a>
        </div>
      </main>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            🚀 Features Demo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image Demo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                🖼️ Image Display
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Images load immediately with Next.js Image component
              </p>
              <div className="space-y-4">
                <Image
                  src="https://picsum.photos/400/300?random=1"
                  alt="Image 1"
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <Image
                  src="https://picsum.photos/400/300?random=2"
                  alt="Image 2"
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <Image
                  src="https://picsum.photos/400/300?random=3"
                  alt="Image 3"
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            </div>

            {/* Heavy Component Demo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                ⚡ Heavy Component
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Heavy component loads immediately with loading state
              </p>
              <HeavyComponent />
            </div>

            {/* Alias Demo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                🎯 Path Aliases
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Clean imports using @/ alias instead of relative paths
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm">
                <div className="text-blue-600 dark:text-blue-400">import</div>
                <div className="text-green-600 dark:text-green-400">{"{ LazyImage }"}</div>
                <div className="text-blue-600 dark:text-blue-400">from</div>
                <div className="text-orange-600 dark:text-orange-400">&apos;@/components/LazyImage&apos;</div>
              </div>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                All components and utilities use @/ alias for clean imports
              </div>
            </div>
          </div>

          {/* Tailwind CSS Demo */}
          <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              🎨 Tailwind CSS Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold">Responsive</div>
                <div className="text-sm opacity-90">Mobile-first design</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">Utility-first</div>
                <div className="text-sm opacity-90">Rapid prototyping</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg text-white text-center">
                <div className="text-2xl mb-2">🌙</div>
                <div className="font-semibold">Dark Mode</div>
                <div className="text-sm opacity-90">Built-in support</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white text-center">
                <div className="text-2xl mb-2">🔧</div>
                <div className="font-semibold">Customizable</div>
                <div className="text-sm opacity-90">Easy configuration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Ready to build something amazing? 🚀
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            All features are set up and ready to use in your Snake Tech project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Start Building
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-800">
              View Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
