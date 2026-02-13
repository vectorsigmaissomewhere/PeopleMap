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
        serializer = TagsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'msg':'Tags created successfully', 'data':serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """Get a single tag by its ID"""
        tag = get_object_or_404(Tags, tags_id=pk)
    
        # Check if the user owns this tag
        if request.user.id != tag.user_id:
            return Response(
                {"detail": "You don't have permission to view this tag."}, 
                status=status.HTTP_403_FORBIDDEN
            )
    
        serializer = TagsSerializer(tag)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Fully update a tag (PUT)"""
        tag = get_object_or_404(Tags, tags_id=pk)
        
        if request.user.id != tag.user_id:
            return Response(
                {"detail": "You don't have permission to update this tag."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TagsSerializer(tag, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'msg': 'Tag updated successfully', 'data': serializer.data}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        """Partially update a tag (PATCH)"""
        tag = get_object_or_404(Tags, tags_id=pk)
        
        if request.user.id != tag.user_id:
            return Response(
                {"detail": "You don't have permission to update this tag."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = TagsSerializer(tag, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'msg': 'Tag updated successfully', 'data': serializer.data}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete a tag"""
        tag = get_object_or_404(Tags, tags_id=pk)
        
        if request.user.id != tag.user_id:
            return Response(
                {"detail": "You don't have permission to delete this tag."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        tag.delete()
        return Response(
            {'msg': 'Tag deleted successfully'}, 
            status=status.HTTP_204_NO_CONTENT
        )

