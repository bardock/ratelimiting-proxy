local _M = {}

local data = {}
-- TODO: initialize current bans

function _M.add(ban)
    data[ban] = ban
end

function _M.getAll()
    return data
end

function _M.find(remote_addr, request_uri)
    return data[remote_add]
end

return _M