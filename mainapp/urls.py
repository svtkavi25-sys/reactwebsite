from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('process/', views.process, name='process'),
    path('history/', views.history, name='history'),
    path('api/save_project_data/<int:project_id>/', views.save_project_data, name='save_project_data'),
    path('api/get_project_data/<int:project_id>/', views.get_project_data, name='get_project_data'),
]