from rest_framework import serializers 
from .models import Tags, People, Credit

class TagsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Tags 
        fields = ['tags_id', 'name', 'colorname', 'created_at', 'updated_at', 'user']
        read_only_fields = ['tags_id', 'created_at', 'updated_at', 'user']  
    
    def create(self, validated_data):
        user = self.context['request'].user
        return Tags.objects.create(user=user, **validated_data)
    
class PeopleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    tag_details = serializers.SerializerMethodField()
    
    class Meta:
        model = People
        fields = [
            'people_id', 'name', 'notes', 'email', 'phone', 'company',
            'role', 'department', 'street', 'city', 'state', 'zip',
            'country', 'image', 'image_url', 'tag', 'tag_details', 'created_at', 'updated_at', 'user'
        ]
        read_only_fields = ['people_id', 'created_at', 'updated_at', 'user', 'image_url','tag_details']
    
    def get_image_url(self, obj):
        return obj.image
    
    def get_tag_details(self, obj):
        """Return full tag details if a tag exists"""
        if obj.tag:
            return {
                'tags_id': obj.tag.tags_id,
                'name': obj.tag.name,
                'colorname': obj.tag.colorname
            }
        return None
    
    def validate_email(self, value):
        """Make empty string email become None to avoid unique constraint issues"""
        if value == "":
            return None
        return value
    
    def validate(self, data):
        """Ensure we don't try to create duplicate emails for the same user"""
        request = self.context.get('request')
        if request and request.method == 'POST':
            email = data.get('email')
            user = request.user
            
            if email:
                existing_person = People.objects.filter(
                    user=user, 
                    email=email
                ).first()
                
                if existing_person:
                    raise serializers.ValidationError({
                        'email': f'A person with email {email} already exists for this user.'
                    })
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        
        if 'email' in validated_data and validated_data['email'] == "":
            validated_data['email'] = None
            
        person = People.objects.create(user=user, **validated_data)
        return person

    def update(self, instance, validated_data):
        if 'image' in validated_data and validated_data['image'] is None:
            validated_data['image'] = instance.image
            
        if 'email' in validated_data and validated_data['email'] == "":
            validated_data['email'] = None
            
        return super().update(instance, validated_data)

class CreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = ['credit_id', 'credit_number']