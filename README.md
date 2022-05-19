# Telegram Autoposter
Autoposting from VK to Telegram.

## Getting started

* clone repo
* ``npm install``
* set up ``config.json``
* ``npm run start``

## ``config.json`` parameters

* ``tokens``
  * ``vk`` - [VK token](https://vk.com/dev/implicit_flow_user) (easy way to get: https://vkhost.github.io/).
  * ``telegram`` - [Telegram bot token](https://core.telegram.org/bots#6-botfather).
* ``channel`` - channel ID or channelname (``-10012345678``, ``"@channelname"``). **Note: bot must be invited to the channel.**
* ``groups`` - array of group ids (``12345678``, ``"club12345678"``, ``"public87654321"``, ``"anyothergroup"``).
* ``banWords`` - array of ban words, phrases or regex (``"курсы", "низкая цена", "низк(ая|ой) цен(а|е)"``).
* ``youtube-dl-binary`` - path to [youtube-dl](https://github.com/ytdl-org/youtube-dl) binary (yt-dlp is also supported as it's a fork of youtube-dl)
