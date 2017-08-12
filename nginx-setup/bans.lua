local _M = {}

local data = {}
-- TODO: initialize current bans

function _M.add(ban)
    data[ban] = ban
end

function _M.getAll()
    return data
end

return _M