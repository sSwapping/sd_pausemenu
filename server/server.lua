local config = require "shared.config"
lib.locale()

local function timeTillRestart()
    local now = os.date('*t')
    local nowSec = (now.hour * 3600) + (now.min * 60) + now.sec

    local best = nil
    for _, t in ipairs(config.restartTimes) do
        local hh, mm = t:match('^(%d%d):(%d%d)$')
        hh, mm = tonumber(hh), tonumber(mm)
        local sec = (hh * 3600) + (mm * 60)
        local diff = sec - nowSec
        if diff >= 0 and (best == nil or diff < best) then
            best = diff
        end
    end

    if best == nil then
        local hh, mm = config.restartTimes[1]:match('^(%d%d):(%d%d)$')
        hh, mm = tonumber(hh), tonumber(mm)
        local firstSec = (hh * 3600) + (mm * 60)
        best = (24 * 3600 - nowSec) + firstSec
    end
    return best
end

lib.callback.register("sd_pausemenu:server:getRestartTime", function()
    return timeTillRestart()
end)

RegisterNetEvent('sd_pausemenu:server:dropPlayer', function()
    if not source then return end
    DropPlayer(source, locale('dropReason'))
end)