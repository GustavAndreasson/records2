from django.core.cache import cache

session = None

def init(request, processes=[]):
    global session
    session = request.session.session_key
    for process in processes:
        updateProgress(process, 0)

def clearProcesses(processes):
    global session
    if session:
        progress = cache.get(session + '_progress', {})
        for process in processes:
            if process in progress:
                del(progress[process])
        cache.set(session + '_progress', progress)

def updateProgress(process, percent):
    global session
    if session:
        progress = cache.get(session + '_progress', {})
        progress[process] = percent
        cache.set(session + '_progress', progress)

def getProgress():
    global session
    if session:
        return cache.get(session + '_progress', {})
    return {}
