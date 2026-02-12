from django.urls import path, include
from people.views import TagsViewSet

urlpatterns = [
    path('tags/user/<int:user_id>/', TagsViewSet.as_view({'get': 'list'}), name='user-tags-list'),
]