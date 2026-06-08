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
  'ui/dist/index.html',
  'ui/dist/**/*',
}

client_scripts {
  'client/*.lua'
}

server_scripts {
  'server/*.lua'
}

