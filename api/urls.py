from django.urls import path, include
from . import views

urlpatterns = [
    
    path('home/',  views.home, name="home"),
    path('task-list/', views.taskList, name="tasklist"),
    path('task-detail/<str:pk>/', views.taskDetail, name="taskdetai;"),
    path('task-create/', views.taskCreate, name="taskcreate"),
    path('task-update/<str:pk>/', views.taskUpdate, name="tasklupdate"),
    path('task-delete/<str:pk>/', views.taskDelete, name="taskdelete"),
]
