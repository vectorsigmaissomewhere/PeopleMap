from django.urls import path, include
from people.views import TagsViewSet

urlpatterns = [
    path('tags/user/<int:user_id>/', TagsViewSet.as_view({'get': 'list'}), name='user-tags-list'),
    path('tags/user/create/', TagsViewSet.as_view({'post': 'create'}), name='user-tags-create'), 
]