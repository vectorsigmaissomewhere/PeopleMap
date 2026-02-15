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
    
    class Meta:
        model = People
        fields = [
            'people_id', 'name', 'notes', 'email', 'phone', 'company',
            'role', 'department', 'street', 'city', 'state', 'zip',
            'country', 'image', 'image_url', 'tag', 'created_at', 'updated_at', 'user'
        ]
        read_only_fields = ['people_id', 'created_at', 'updated_at', 'user', 'image_url']
    
    def get_image_url(self, obj):
        return obj.image
    
    def create(self, validated_data):
        user = self.context['request'].user
        person = People.objects.create(user=user, **validated_data)
        return person

    def update(self, instance, validated_data):
        if 'image' in validated_data and validated_data['image'] is None:
            validated_data['image'] = instance.image
        return super().update(instance, validated_data)

class CreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = ['credit_id', 'credit_number']