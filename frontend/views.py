from django.shortcuts import render

# Create your views here.
def index(request):
    if request.session.is_empty():
        request.session.create() # Create session cookie if it does not exist
    return render(request, 'frontend/index.html')
