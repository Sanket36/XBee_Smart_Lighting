# Jan 23 2022
from django.urls import path
from . import views

urlpatterns = [
    path('getNodes/', views.get_nodes),
    path('discover/', views.discover_nodes),
    path('toggle/', views.toggle_pin),
    path('dimming/', views.dim_to),
    path('instValues/',views.getInstValues),
    path('graphValues/',views.getGraphValues),
    path('getSchedule/', views.fetchSchedule),
    path('setSchedule/', views.changeSchedule),
    path('sync/', views.syncAuto)
]
