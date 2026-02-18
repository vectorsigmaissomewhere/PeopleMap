from django.shortcuts import render
from rest_framework import viewsets
from .models import Tags, People
from rest_framework.response import Response
from rest_framework import status 
from .serializers import TagsSerializer, PeopleSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from accounts.models import User
from .models import Credit
from django.db import transaction
from rest_framework.views import APIView
from rest_framework import parsers
from .utils import upload_image_to_cloudinary, delete_image_from_cloudinary
import cloudinary.uploader
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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


class CloudinaryUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        """Upload image to Cloudinary"""
        if 'image' not in request.FILES:
            return Response({
                'success': False,
                'error': 'No image file provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['image']
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response({
                'success': False,
                'error': 'Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate file size (max 5MB)
        if image_file.size > 5 * 1024 * 1024:
            return Response({
                'success': False,
                'error': 'File size too large. Maximum size is 5MB.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Upload to Cloudinary
        result = upload_image_to_cloudinary(image_file, request.user.id)
        
        if result['success']:
            return Response({
                'success': True,
                'url': result['url'],
                'public_id': result['public_id']
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': result['error']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# Updated PeopleViewSet with Pagination, Filtering, and Search
class PeopleViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    @property
    def paginator(self):
        if not hasattr(self, '_paginator'):
            self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset):
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset, self.request, view=self)

    def get_paginated_response(self, data):
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data)

    def list(self, request, user_id=None):
        """List people for a specific user with pagination, filtering, and search"""
        if request.user.id != user_id:
            return Response({"detail": "You don't have permission to view these people."}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Start with base queryset
        people = People.objects.filter(user_id=user_id).select_related('tag').order_by('-created_at')
        
        # Apply search if provided
        search_query = request.query_params.get('search', '')
        if search_query:
            people = people.filter(
                Q(name__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(company__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(phone__icontains=search_query) |
                Q(role__icontains=search_query)
            )
        
        # Apply tag filtering if provided
        tag_id = request.query_params.get('tag', '')
        if tag_id:
            if tag_id.lower() == 'none' or tag_id == '':
                people = people.filter(tag__isnull=True)
            else:
                people = people.filter(tag_id=tag_id)
        
        # Apply additional filters
        company = request.query_params.get('company', '')
        if company:
            people = people.filter(company__icontains=company)
        
        city = request.query_params.get('city', '')
        if city:
            people = people.filter(city__icontains=city)
        
        # Pagination
        page = self.paginate_queryset(people)
        if page is not None:
            serializer = PeopleSerializer(page, many=True)
            return self.get_paginated_response({
                'people': serializer.data,
                'total_count': people.count(),
                'filtered_count': len(page)
            })
        
        # If no pagination, return all results
        serializer = PeopleSerializer(people, many=True)
        return Response({
            'people': serializer.data,
            'total_count': people.count()
        }, status=status.HTTP_200_OK)
    
    def create(self, request):
        """Create a new person - requires available credits"""
        
        # Check if user has credits
        try:
            credit, created = Credit.objects.get_or_create(
                user=request.user,
                defaults={'credit_number': 0}
            )
            
            if credit.credit_number < 1:
                return Response({
                    'error': 'Insufficient credits',
                    'message': f'You need at least 1 credit to add a person. Current credits: {credit.credit_number}',
                    'current_credits': credit.credit_number,
                    'required_credits': 1
                }, status=status.HTTP_402_PAYMENT_REQUIRED)
            
        except Exception as e:
            return Response({
                'error': 'Credit check failed',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Use transaction to ensure both operations succeed or fail together
        with transaction.atomic():
            serializer = PeopleSerializer(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                person = serializer.save()
                
                # Subtract 1 credit
                credit.credit_number -= 1
                credit.save()
                
                return Response({
                    'msg': 'Person created successfully',
                    'data': serializer.data,
                    'credits_remaining': credit.credit_number,
                    'credits_used': 1
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete a person and refund 1 credit"""
        person = get_object_or_404(People, people_id=pk)
    
        if request.user.id != person.user_id:
            return Response(
                {"detail": "You don't have permission to delete this person."}, 
                status=status.HTTP_403_FORBIDDEN
            )
    
        with transaction.atomic():
            # Delete image from Cloudinary if it exists
            if person.image and 'cloudinary' in person.image:
                try:
                    # Extract public_id from URL (you might want to store it separately)
                    import re
                    match = re.search(r'/v\d+/(.+?)\.', person.image)
                    if match:
                        public_id = match.group(1)
                        delete_image_from_cloudinary(public_id)
                except Exception as e:
                    print(f"Error deleting image from Cloudinary: {e}")
            
            person_name = person.name
            person.delete()
        
            credit, created = Credit.objects.get_or_create(
                user=request.user,
                defaults={'credit_number': 0}
            )
        
            credit.credit_number += 1
            credit.save()
    
        return Response({
            'msg': 'Person deleted successfully',
            'credits_refunded': 1,
            'credits_remaining': credit.credit_number,
            'person_deleted': person_name
        }, status=status.HTTP_200_OK)
    

    def retrieve(self, request, pk=None):
        """Get a single person by their ID"""
        person = get_object_or_404(People, people_id=pk)
        
        # Check if the user owns this person
        if request.user.id != person.user_id:
            return Response(
                {"detail": "You don't have permission to view this person."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = PeopleSerializer(person)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Fully update a person (PUT)"""
        person = get_object_or_404(People, people_id=pk)
        
        if request.user.id != person.user_id:
            return Response(
                {"detail": "You don't have permission to update this person."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Note: Updating a person doesn't cost credits
        serializer = PeopleSerializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'msg': 'Person updated successfully', 'data': serializer.data}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        """Partially update a person (PATCH)"""
        person = get_object_or_404(People, people_id=pk)
        
        if request.user.id != person.user_id:
            return Response(
                {"detail": "You don't have permission to update this person."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Note: Updating a person doesn't cost credits
        serializer = PeopleSerializer(person, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'msg': 'Person updated successfully', 'data': serializer.data}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CheckCreditsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            credit, created = Credit.objects.get_or_create(
                user=request.user,
                defaults={'credit_number': 0}
            )
            
            return Response({
                'credits': credit.credit_number,
                'can_add_person': credit.credit_number >= 1
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Failed to retrieve credits',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
