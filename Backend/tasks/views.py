from django.shortcuts import render
from .models import Task
from rest_framework import generics
from .serializers import TaskSerializer
from rest_framework.pagination import PageNumberPagination

# This is pagination class
class TaskPagination(PageNumberPagination):
    page_size = 5  
    page_size_query_param = "page_size"
    max_page_size = 100

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by("-created_at")
    serializer_class = TaskSerializer
    pagination_class = TaskPagination  


class TaskRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
