from django.core.cache import cache

session = None

def init(request):
    global session
    session = request.session.session_key
    cache.set(session + '_progress', 0)

def updateProgress(percent):
    global session
    if session:
        cache.set(session + '_progress', percent)

def getProgress():
    global session
    if session:
        return {'progress': cache.get(session + '_progress', 0)}
    return {'progress': 0}
