<template>
  <header class="bg-white">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div
        class="w-full py-6 flex items-center justify-between border-b border-gray-300 lg:border-none"
      >
        <div class="flex items-center">
          <nuxt-link to="/">
            <span class="sr-only">Logo</span>
            <svg
              width="119"
              height="25"
              viewBox="0 0 119 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M111.32 14.736L118.19 7.036V6.707H112.36L106.981 12.888V0.032H102.325V23.705H106.981V16.751L112.518 23.705H118.539V23.378L111.32 14.736ZM83.02 23.713H88V14.282C87.9585 13.8561 88.0077 13.4263 88.1444 13.0209C88.281 12.6154 88.5021 12.2435 88.7929 11.9297C89.0837 11.6158 89.4377 11.3671 89.8315 11.2C90.2254 11.0329 90.6502 10.9511 91.078 10.96C93.053 10.96 93.934 12.131 93.934 14.082V23.712H98.915V12.522C98.915 8.786 96.392 6.412 92.632 6.412C91.7653 6.36331 90.8987 6.51065 90.0967 6.84306C89.2948 7.17547 88.5781 7.6844 88 8.332H87.873L87.024 6.707H83.016L83.02 23.713ZM71.228 20.1C69.737 20.1 68.959 19.383 68.959 18.4C68.959 17.492 69.673 16.775 71.259 16.775H74.459V17.5C74.473 18.9 73.267 20.1 71.228 20.1ZM69.967 24C70.8093 24.0458 71.6513 23.907 72.4343 23.5934C73.2174 23.2797 73.9224 22.7987 74.5 22.184H74.627L74.984 23.713H79.45V12.53C79.45 8.985 76.666 6.42 72.033 6.42C67.043 6.42 64.751 9.152 64.751 12.338H69.408C69.408 11.295 70.308 10.45 71.875 10.45C73.723 10.45 74.469 11.358 74.469 12.537V13.445H70.84C66.176 13.445 64.04 15.524 64.04 18.678C64.041 21.7 66.144 24 69.967 24ZM53.7 19.619C51.233 19.619 50.36 17.572 50.36 15.198C50.36 12.824 51.169 10.809 53.7 10.809C56.231 10.809 57.04 12.824 57.04 15.198C57.04 17.572 56.172 19.619 53.7 19.619ZM55.228 24C59.504 24 62.09 20.3 62.09 15.19C62.09 10.116 59.504 6.412 55.228 6.412C54.3788 6.35489 53.5282 6.499 52.7452 6.83263C51.9622 7.16626 51.269 7.67997 50.722 8.332H50.6V0.032H45.613V23.705H50.08L50.6 22.08H50.727C51.2741 22.7306 51.9665 23.2434 52.7484 23.577C53.5303 23.9105 54.3797 24.0554 55.228 24V24ZM33.08 23.713H37.737V15.313C37.737 12.581 39.26 10.988 41.624 10.988H43.242V6.412H42.075C41.1617 6.40287 40.2655 6.65923 39.4952 7.14991C38.7249 7.6406 38.1138 8.34448 37.736 9.176H37.609L36.76 6.707H33.08V23.713ZM24.528 23.713H29.51V6.707H24.528V23.713ZM24.362 4.684H29.669V0H24.362V4.684ZM7.941 14.9L10.122 6.05H11.415L13.581 14.9H7.941ZM14.89 0.717H6.854L0 23.387V23.714H5.22L6.545 19.389H14.962L16.287 23.714H21.769V23.387L14.89 0.717Z"
                fill="black"
              ></path>
            </svg>
          </nuxt-link>
          <div class="hidden ml-10 space-x-8 lg:block">
            <nuxt-link
              to="/"
              class="text-base text-gray-500 hover:text-gray-900"
            >
              Transactions
            </nuxt-link>

            <nuxt-link
              to="/categories"
              class="text-base text-gray-500 hover:text-gray-900"
            >
              Categories
            </nuxt-link>

            <nuxt-link
              to="/accounts"
              class="text-base text-gray-500 hover:text-gray-900"
            >
              Accounts
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
        <nuxt-link to="/" class="text-base text-gray-500 hover:text-gray-900">
          Transactions
        </nuxt-link>

        <nuxt-link
          to="/categories"
          class="text-base text-gray-500 hover:text-gray-900"
        >
          Categories
        </nuxt-link>

        <nuxt-link
          to="/accounts"
          class="text-base text-gray-500 hover:text-gray-900"
        >
          Accounts
        </nuxt-link>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
export default {
  name: 'AppHeader',
}
</script>
