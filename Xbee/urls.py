from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.make_connection),
    path('discover/', views.discover_nodes),
    path('toggle/', views.toggle_pin),
]