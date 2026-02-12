from django.shortcuts import render
from rest_framework import viewsets
from .models import Tags
from rest_framework.response import Response
from rest_framework import status 
from .serializers import TagsSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from accounts.models import User

class TagsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request, user_id=None):
        """List tags for a specific user"""
        if request.user.id != user_id:
            return Response({"detail": "You don't have permission to view these tags."}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        tags = Tags.objects.filter(user_id=user_id)
        if not tags.exists():
            return Response({"tags": [], "detail": "No tags found for this user."}, 
                          status=status.HTTP_200_OK)
        serializer = TagsSerializer(tags, many=True)
        return Response({"tags": serializer.data}, status=status.HTTP_200_OK)
    
    def create(self, request):
        pass 
    def retrieve(self, request, pk=None):
        pass 
    def update(self, request, pk=None):
        pass 
    def partial_update(self, request, pk=None):
        pass 
    def destroy(self, request, pk=None):
        pass 

