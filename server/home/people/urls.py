from django.urls import path, include
from people.views import TagsViewSet, PeopleViewSet, CheckCreditsView

urlpatterns = [
    path('tags/user/<int:user_id>/', TagsViewSet.as_view({'get': 'list'}), name='user-tags-list'),
    path('tags/user/create/', TagsViewSet.as_view({'post': 'create'}), name='user-tags-create'), 
    path('tags/<int:pk>/', TagsViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='user-tags-detail'),
    
    path('people/user/<int:user_id>/', PeopleViewSet.as_view({'get': 'list'}), name='people-list'),
    path('people/create/', PeopleViewSet.as_view({'post': 'create'}), name='people-create'), 
    path('people/<int:pk>/', PeopleViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='people-detail'),

    path('check-credits/', CheckCreditsView.as_view(), name='check-credits'),
]