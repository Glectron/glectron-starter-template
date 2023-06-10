local html = util.Base64Decode([=[%HTML_SOURCE%]=])

function run()
    if GAPP then
        GAPP:ForceShutdown()
        GAPP = nil
    end
    
    GAPP = Glectron.Application:Create()
    GAPP:SetHTML(html)

    function GAPP:Setup()
        GAPP:AddFunction("dMsg", Derma_Message)
    end
    
    hook.Add("OnPlayerChat", "GAPP", function(ply, text)
        if ply == LocalPlayer() and string.find(text, "!gexampleapp", 1, true) ~= nil then
            GAPP:MakePopup()
            return true
        end
    end)

    print("Glectron example app is loaded")
end

if Glectron then
    run()
else
    hook.Add("GlectronReady", "GAPP", run)
end