from django.core.cache import cache

session = None

def init(request, processes=[]):
    global session
    if request.session.is_empty():
        request.session.create() # Create session cookie if it does not exist
    session = request.session.session_key
    if len(processes) > 0:
        cache.set(__cacheKey(), { k: 0 for k in processes })

def clearProcesses(processes=None):
    global session
    if session:
        if processes:
            progress = getProgress()
            for process in processes:
                if process in progress:
                    del progress[process]
            if len(progress) > 0:
                cache.set(__cacheKey(), progress)
                return
        cache.delete(__cacheKey())
        session = None

def updateProgress(process, percent):
    global session
    if session:
        progress = getProgress()
        progress[process] = percent
        cache.set(__cacheKey(), progress)

def getProgress():
    global session
    if session:
        return cache.get(__cacheKey(), {})
    return {}

def __cacheKey():
    global session
    return 'progress-' + session
