fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'sd_pausemenu'
author 'sSwapping Development'
version '1.0.0'

ui_page 'web/dist/index.html'

shared_scripts {
  '@ox_lib/init.lua',
  'shared/*.lua'
}

files {
  'web/dist/index.html',
  'web/dist/**/*',
  'locales/*.json',
}

client_scripts {
  'client/*.lua'
}

server_scripts {
  'server/*.lua'
}

