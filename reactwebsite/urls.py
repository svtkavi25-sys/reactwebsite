from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from mainapp import views
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('mainapp.urls')),
]

# Serve generated files
if settings.DEBUG:
    urlpatterns += static(
        '/generated_projects/',
        document_root=os.path.join(settings.BASE_DIR, 'generated_projects')
    )