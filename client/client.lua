local config = require 'shared.config'
local isOpen, frontendMode, pauseCam, dofActive = false, nil, nil, false
local vehicleControlsTracked, frontendControlsTracked = false, false
local pauseEffectsActive, menuOpening = false, false

local pauseMenuHash = `FE_MENU_VERSION_MP_PAUSE`
local settingsHash = -1031775802

local function formatClock(sec)
    sec = tonumber(sec) or 0
    if sec < 0 then sec = 0 end

    local hh = math.floor(sec / 3600)
    local mm = math.floor((sec - hh * 3600) / 60)
    local ss = math.floor(sec - hh * 3600 - mm * 60)
    return string.format("%02d:%02d:%02d", hh, mm, ss)
end

local function disableControls(trackVehicle, trackFrontend)
    if trackVehicle ~= vehicleControlsTracked then
        if trackVehicle then
            lib.disableControls:Add(config.vehicleControls)
        else
            lib.disableControls:Remove(config.vehicleControls)
        end
        vehicleControlsTracked = trackVehicle
    end
    if trackFrontend ~= frontendControlsTracked then
        if trackFrontend then
            lib.disableControls:Add(config.frontendControls)
        else
            lib.disableControls:Remove(config.frontendControls)
        end
        frontendControlsTracked = trackFrontend
    end
end

local function clearControls()
    if vehicleControlsTracked then
        lib.disableControls:Remove(config.vehicleControls)
        vehicleControlsTracked = false
        lib.disableControls:Clear(config.vehicleControls)
    end
    if frontendControlsTracked then
        lib.disableControls:Remove(config.frontendControls)
        frontendControlsTracked = false
        lib.disableControls:Clear(config.frontendControls)
    end
end

local function pauseEffect()
    if pauseEffectsActive then return end
    pauseEffectsActive = true

    CreateThread(function()
        while pauseCam or dofActive do
            local cam = pauseCam

            if cam and DoesCamExist(cam) then
                local ped = cache.ped

                if not IsEntityDead(ped) and GetEntitySpeed(ped) > 0.1 then
                    local camPos = GetOffsetFromEntityInWorldCoords(ped, 0.0, 2.2, 0.8)
                    SetCamCoord(cam, camPos.x, camPos.y, camPos.z)
                    PointCamAtEntity(cam, ped, 0.0, 0.0, 0.65, true)
                end

                if dofActive then
                    SetUseHiDof()
                end
            end
            Wait(0)
        end

        pauseEffectsActive = false
    end)
end

-- This prevents the native pause menu from opening, as it could sometimes appear alongside the UI.
local function preventNativePause()
    if menuOpening then return end
    menuOpening = true
    SetPauseMenuActive(false)

    CreateThread(function()
        while menuOpening and not frontendMode do
            DisableFrontendThisFrame()

            if IsPauseMenuActive() then SetPauseMenuActive(false) end

            Wait(0)
        end
    end)
end

local function createPauseCam()
    if pauseCam and DoesCamExist(pauseCam) then return end

    local ped = cache.ped
    local camPos = GetOffsetFromEntityInWorldCoords(ped, 0.0, 2.2, 0.8)
    pauseCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
    SetCamCoord(pauseCam, camPos.x, camPos.y, camPos.z)
    PointCamAtEntity(pauseCam, ped, 0.0, 0.0, 0.65, true)
    SetCamFov(pauseCam, 40.0)
    SetCamActive(pauseCam, true)
    RenderScriptCams(true, true, 500, true, true)
    pauseEffect()
end

local function destroyPauseCam()
    if not pauseCam or not DoesCamExist(pauseCam) then return end
    RenderScriptCams(false, true, 200, true, true)
    DestroyCam(pauseCam, false)
    pauseCam = nil
end

local function createDof()
    if dofActive then return end
    dofActive = true

    if pauseCam and DoesCamExist(pauseCam) then
        SetCamUseShallowDofMode(pauseCam, true)
        SetCamNearDof(pauseCam, 0.8)
        SetCamFarDof(pauseCam, 2.2)
        SetCamDofStrength(pauseCam, 1.0)
    end

    if not pauseEffectsActive then pauseEffect() end
end

local function nuiFocus(state, restartSeconds)
    isOpen = state
    SetNuiFocus(state, state)
    local ped = cache.ped
    local inVeh = IsPedInAnyVehicle(ped, false)
    if not inVeh then
        SetPlayerControl(cache.playerId, not state, 0)
    end

    if state then
        createPauseCam()
        createDof()
        SendNUIMessage({
            type = 'sd_pausemenu:nui:setRestartTime',
            restartIn = formatClock(restartSeconds),
            discord = config.discordLink
        })
    else
        createDof()
        destroyPauseCam()
    end

    SendNUIMessage({
        type = 'sd_pausemenu:nui:setVisible',
        visible = state
    })
end

local function enableControls()
    clearControls()
    LocalPlayer.state.invBusy = false
end

local function closeMenu()
    menuOpening = false
    enableControls()
    nuiFocus(false)
end

local function closeGtaFrontend()
    menuOpening = false
    frontendMode = nil
    SetPauseMenuActive(false)
    SetFrontendActive(false)
    local ped = cache.ped
    local inVeh = IsPedInAnyVehicle(ped, false)
    if not inVeh then SetPlayerControl(cache.playerId, true, 0) end
end

local function openNativeFrontend(mode)
    frontendMode = mode
    isOpen = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({
        type = 'sd_pausemenu:nui:setVisible',
        visible = false
    })

    local ped = cache.ped
    local inVeh = IsPedInAnyVehicle(ped, false)
    if not inVeh then SetPlayerControl(cache.playerId, true, 0) end
    SetFrontendActive(true)
    if mode == 'settings' then
        ActivateFrontendMenu(settingsHash, 0, 0)
    elseif mode == 'map' then
        ActivateFrontendMenu(pauseMenuHash, 0, -1)
    end
    Wait(0)
    SetPauseMenuActive(true)

    CreateThread(function()
        for _ = 1, 8 do  Wait(0) end

        for _ = 1, 10 do 
            SetControlNormal(0, 174, 1.0)
            Wait(0)
        end

        local stepsRight = 0
        if mode == 'settings' then
            stepsRight = 4
        end

        for _ = 1, stepsRight do
            SetControlNormal(0, 175, 1.0)
            Wait(0)
        end

        SetCursorLocation(0.5, 0.5)
    end)
end

local function openMenu()
    if frontendMode or menuOpening then return end

    preventNativePause()
    LocalPlayer.state.invBusy = true
    local restartSeconds = lib.callback.await('sd_pausemenu:server:getRestartTime')

    nuiFocus(true, restartSeconds)

    menuOpening = false
end

CreateThread(function()
    while true do
        if frontendMode then
            if not IsPauseMenuActive() then closeGtaFrontend() end
        else
            DisableFrontendThisFrame()
            if IsPauseMenuActive() then SetPauseMenuActive(false) end
        end

        if IsControlJustPressed(0, 200) and not LocalPlayer.state.disablepausemenu then
            if frontendMode then
                closeGtaFrontend()
            elseif isOpen or IsNuiFocused() then
                closeMenu()
            elseif not IsPauseMenuActive() then
                openMenu()
            end
        end

        Wait(0)
    end
end)

CreateThread(function()
    while true do
        local sleep = 500
        local ped = cache.ped
        local shouldDisableVehicle = isOpen and IsPedInAnyVehicle(ped, false)
        local shouldDisableFrontend = frontendMode ~= nil

        disableControls(shouldDisableVehicle, shouldDisableFrontend)

        if shouldDisableVehicle or shouldDisableFrontend then
            lib.disableControls()
            sleep = 0
        elseif isOpen then
            sleep = 100
        end

        Wait(sleep)
    end
end)

RegisterNUICallback('sd_pausemenu:nui:closeMenu', function(_, cb)
    closeMenu()
    cb(true)
end)

RegisterNUICallback('sd_pausemenu:nui:backToGame', function(_, cb)
    closeMenu()
    cb(true)
end)

RegisterNUICallback('sd_pausemenu:nui:openMap', function(_, cb)
    closeMenu()
    openNativeFrontend('map')
    cb(true)
end)

RegisterNUICallback('sd_pausemenu:nui:openSettings', function(_, cb)
    closeMenu()
    openNativeFrontend('settings')
    cb(true)
end)

RegisterNUICallback('sd_pausemenu:nui:disconnect', function(_, cb)
    closeMenu()
    TriggerServerEvent('sd_pausemenu:server:dropPlayer')
    cb(true)
end)

RegisterNUICallback('sd_pausemenu:nui:report', function(_, cb)
    closeMenu()
    -- IMPLEMENT YOUR OWN REPORT MENU LOGICA HERE
    cb(true)
end)
